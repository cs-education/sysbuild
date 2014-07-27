function ExpectTTY(runtime, expectstring, callback_fn) {
  this.output="";
  this.callback = callback_fn;
  this.expect = expectstring;
  this.sys = runtime;
  this.found = false;
  this.ExpectPutCharListener = function(sys,e) {
    this.output = this.output.substr(this.output.length == this.expect.length ? 1: 0) + e.detail.character;
    if(this.output === this.expect) {
       this._Cleanup();
       this.callback(true);
    }
  }.bind(this);
  this.sys.AddListener("putchar",this.ExpectPutCharListener);
}

ExpectTTY.prototype._Cleanup = function() {
  this.sys.RemoveListener("putchar",this.ExpectPutCharListener);
}

ExpectTTY.prototype.Cancel = function() {
  this._Cleanup();
  this.callback(false);
}

// A singleton that encapsulates the virtual machine interface

function SysRuntime() {
  if(SysRuntimeInstance) return SysRuntimeInstance;
  else SysRuntimeInstance = this;
  
  this.boot_finished = false;

  this.listeners={};
  this.tty_state = this.BOOT;
  this.tty_output = "";
  this.capture_output = false;
  this.compile_ticket = 0;
  
  this.gcc_output_capture_re = /###GCC_COMPILE###\s*([\S\s]*?)\s*###GCC_COMPILE_FINISHED###/;
  this.gcc_exit_code_capture_re = /GCC_EXIT_CODE: (\d+)/;

  // Set up Callbacks

  this.putCharListener = function(e) {
   if(this.capture_output) 
      this.tty_output += e.detail.character;
   this.NotifyListeners('putchar',e);
  }.bind(this); 

  var onBootFinished = function(completed) {
    this.boot_finished = completed;
    if(completed) {
      this.NotifyListeners("ready",true);
    }
  }.bind(this);
  
  var onTTYLogin = function(completed) {
    if(completed) {
      this.SendKeys("\x03\nstty -clocal crtscts -ixoff\ngcc hello.c;echo boot2ready-$?\n","boot2ready-0",onBootFinished);
    }
  }.bind(this);


  // Wait for tty to be ready
  document.addEventListener("jor1k_terminal_put_char", this.putCharListener, false);
  
  this.jor1kgui = new jor1kGUI("tty", "fb", "stats", ["../../../jor1k/bin/vmlinux.bin.bz2", "../../../bin/hdgcc-mod.bz2"], "");
  this.SendKeys("","root login on 'console'", onTTYLogin);
  return this;
}

SysRuntime.prototype.Ready=function() { return this.boot_finished; }

SysRuntime.prototype.StartGccCompile = function(code, gccoptions,gui_callback) {
  if(!this.boot_finished) return 0;
  if(this.expecting)
     this.expecting.Cancel();
 
  this.tty_output = "";
  this.capture_output = true;
  ++this.compile_ticket;
  
    
  var compile_cb = function(completed) {
    var result = null;
    this.expecting = undefined;
    
    if(completed) {
      this.capture_output = false;
      var regex_match_array = this.gcc_output_capture_re.exec(this.tty_output);
      var gcc_output = regex_match_array[1];
      this.tty_output = "";
      gcc_exit_code = parseInt(this.gcc_exit_code_capture_re.exec(gcc_output)[1]);

      var stats = {
          error: 0,
          warning: 0,
          info: 0
      };
      var annotations = this.GetErrorAnnotations(gcc_output);
          annotations.forEach(function (note) {
              stats[note.type] += 1;
          });
          
      result = { 'exit_code':gcc_exit_code, 'stats':stats,'annotations':annotations,'gcc_output':gcc_output};
    }    
    gui_callback(result);
  }.bind(this);
  
  this.SendKeys("\x03\ncd ~;rm program.c program 2>/dev/null\n")
  this.SendTextFile("program.c",code);
  
  var cmd = "echo \\#\\#\\#GCC_COMPILE\\#\\#\\#;clear;gcc " + gccoptions + " program.c -o program; echo GCC_EXIT_CODE: $?; echo \\#\\#\\#GCC_COMPILE_FINISHED\\#\\#\\#"+this.compile_ticket+".;clear\n";
  
  
  this.expecting = this.SendKeys(cmd,"GCC_COMPILE_FINISHED###"+this.compile_ticket+".",compile_cb);
  
  return this.compile_ticket;
}


SysRuntime.prototype.GetErrorAnnotations = function(gcc_output_str) {
  var gcc_output_parse_re = /(?:program\.c|gcc|collect2):\s*(.+)\s*:\s*(.+)\s*/;
  var gcc_row_col_type_parse_re = /(\d+):(\d+):\s*(.+)/;
  var gcc_output_type_text_split_re = /\s*(.+)\s*:\s*(.+)\s*/;
  var match, line_col_type_match, type_text_split_match, row, col, gcc_error_type, ace_annotation_type, text, errors = [];
    gcc_output_str.split("\n").forEach(function (error_line) {
        if(match = gcc_output_parse_re.exec(error_line)) {
            if (line_col_type_match = gcc_row_col_type_parse_re.exec(match[1])) {
                row = line_col_type_match[1] - 1; // line numbers in ace start from zero
                col = line_col_type_match[2];
                if (type_text_split_match = gcc_output_type_text_split_re.exec(line_col_type_match[3])) {
                    gcc_error_type = type_text_split_match[1];
                    text = type_text_split_match[2] + ": " + match[2];
                } else {
                    gcc_error_type = line_col_type_match[3];
                    text = match[2];
                }
            } else {
                // some gcc output without line info
                row = col = 0;
                if (type_text_split_match = gcc_output_type_text_split_re.exec(match[1])) {
                    gcc_error_type = type_text_split_match[1];
                    text = type_text_split_match[2] + ": " + match[2];
                } else {
                    gcc_error_type = match[1];
                    text = match[2];
                }
            }

            // Determine the type of editor annotation. ace supports error, warning or info.
            // This annotation type is also used to determine success of the compilation process.
            if (gcc_error_type.toLowerCase().indexOf("error") !== -1) {
                ace_annotation_type = "error";
            } else if (gcc_error_type.toLowerCase().indexOf("warning") !== -1) {
                ace_annotation_type = "warning";
            } else {
                ace_annotation_type = "info";
            }

            errors.push({
                row: row,
                column: col,
                type: ace_annotation_type,
                text: text
            });
        }
    });
    return errors;
}


SysRuntime.prototype.StartProgram = function(filename, cmdargs) {
  if(!filename) return;
  if(filename[0]!="/" && filename[0]!=".") 
     filename= "./"+filename.replace(" ","\\ ");
  cmdargs = cmdargs.replace("\\","\\\\").replace("\n","\\n");
  this.SendKeys("\x03\n"+filename+" "+cmdargs+"\n");
}

SysRuntime.prototype.SendTextFile = function(filename,contents) {  
  this.SendKeys("\nstty raw\ndd ibs=1 of="+filename+" count="+contents.length+"\n"+ contents+"\nstty -raw\n");
}

// Used to broadcast 'putchar' and 'ready' events
SysRuntime.prototype.AddListener = function(eventname,fn) {
  var ary = this.listeners[eventname];
  if(ary) ary.push(fn);
  else this.listeners[eventname] = [fn];
}
SysRuntime.prototype.RemoveListener = function(eventname,fn) {
  var ary = this.listeners[eventname];
  this.listeners[eventname] = ary.filter( function(el) {return el ===fn;} );
}
SysRuntime.prototype.NotifyListeners= function(eventname,data) {
  var ary = this.listeners[eventname];
  if(!ary) return;
  ary = ary.slice(); // Listeners may be added/removed during this event, so make a copy first
  for(var i=0; ary && i < ary.length; i++)
     ary[i](this,data);
     
}

SysRuntime.prototype.SendKeys = function(text,expect,success,cancel) {
  this.jor1kgui.Pause(false);   
  var tty = false ? "tty1" : "tty0";
  
  var expectResult = null;
  if(expect)
      expectResult = new ExpectTTY(this, expect,success,cancel);
  
  for(var i=0;i < text.length;i++) {
    this.jor1kgui.SendToWorker(tty, text.charCodeAt(i) >>>0);
  }
  return expectResult;
}


// LiveEdit class.
function LiveEdit(editor_div_id,_runtime) {
  this.runtime = _runtime;
  
  this.ace = ace.edit(editor_div_id);
  this.ace.setTheme("ace/theme/monokai");
  this.ace.getSession().setMode("ace/mode/c_cpp");
  this.compile_btn = document.getElementById("compile_btn");


  var updateCompileButton = function() {
    var ready = SysRuntimeInstance.Ready();
    this.compile_btn.disabled = !  ready;
    this.setHtml('gcc-compile-status',ready ? "Ready" : "Booting up");
  }.bind(this);
  
  updateCompileButton(); //Maybe sys is already up and running
  

  this.runtime.AddListener("ready", function(sys,eventname,value) {
    updateCompileButton();
  }.bind(this) );
}
// Currently JQuery-free
LiveEdit.prototype.getElement = function(id) {return document.getElementById(id);}
LiveEdit.prototype.setHtml = function(id,html) {return this.getElement(id).innerHTML=html;}
LiveEdit.prototype.escapeHtml = function(unsafe) { /*stackoverflow.com/questions/6234773/*/
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }


LiveEdit.prototype.processGccCompletion = function(result) {
  var GCC_RESULT_HTML_WARN = '<span><a href="#" style="color: darkgoldenrod" onclick="alert(global_last_gcc_output); return false;">SUCCESSFUL WITH WARNINGS</a></span>';
  var GCC_RESULT_HTML_SUCCESS='<span style="color: green">SUCCESS</span>';
  var GCC_RESULT_HTML_ERROR='<span><a href="#" style="color: red" onclick="alert(global_last_gcc_output); return false;">FAILED</a></span>';
  var GCC_RESULT_HTML_COMPILING='<span style="color: gray">COMPILING</span>';

  var GCC_RESULT_HTML_CANCEL='<span style="color: gray">Cancelled</span>'
  
  this.setHtml('gcc-error-count',"");
  this.setHtml('gcc-warning-count',"");
  if(!result) { // cancelled
     this.setHtml('gcc-compile-status',GCC_RESULT_HTML_CANCEL);
     return;
  }
  // null if cancelled
    // result = { 'exitcode':gcc_exit_code, 'stats':stats,'annotations':annotations,'gcc_ouput':gcc_output}

  this.runtime.SendKeys("clear\n");
  this.ace.getSession().setAnnotations(result.annotations);
  
  global_last_gcc_output =  result.gcc_output;
  
  this.setHtml('gcc-error-count',   result.stats.error.toString());
  this.setHtml('gcc-warning-count', result.stats.warning.toString());

  var status_msg = GCC_RESULT_HTML_ERROR;
  if (result.exit_code === 0) {
    
        status_msg = result.stats.warning > 0 ? GCC_RESULT_HTML_WARN : GCC_RESULT_HTML_SUCCESS ;
        var cmdargs= this.getElement('cmdline').value;
        
        SysRuntimeInstance.StartProgram("program",cmdargs);
  }
  this.setHtml('gcc-compile-status',status_msg);
}


LiveEdit.prototype.GetCodeText = function() {
   return this.ace.getSession().getValue();
}

LiveEdit.prototype.RunCode = function(code,gccoptions) {
   if(code.length ===0 || code.indexOf("\x03") >= 0 || code.indexOf("\x04") >= 0 ) 
     return;     
  var callback = this.processGccCompletion.bind(this);
  this.runtime.StartGccCompile(code,gccoptions,callback);    

}

//-----
// Globals
var live_edit; // The single IDE
var SysRuntimeInstance; // The single backend
var global_last_gcc_output="";

// GLOBAL FUNCTIONS : UI glue
function CompileButtonClicked() {
  var code =  live_edit.GetCodeText();
  var gcc_options=live_edit.getElement('gccoptions').value;
  live_edit.RunCode( code,gcc_options);
  return false;
}
function StartEditor() {
  SysRuntimeInstance = new SysRuntime();
  live_edit = new LiveEdit("code", SysRuntimeInstance);
}
