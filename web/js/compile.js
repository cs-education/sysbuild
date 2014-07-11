function Start() {
    CreateEditor();
    document.addEventListener("jor1k_terminal_put_char", terminalPutCharListener, false);
    jor1kgui = new jor1kGUI("tty", "fb", "stats", ["../../../jor1k/bin/vmlinux.bin.bz2", "../../../bin/hdgcc-mod.bz2"], "");
}

var term_output = "";
var gcc_output = "";
var gcc_output_capture_re = /###GCC_COMPILE###\s*([\S\s]*?)\s*###GCC_COMPILE_FINISHED###/;

function terminalPutCharListener(e) {
    term_output = term_output + e.detail.character;
}

function waitForGccCompletion() {

    var regex_match_array = gcc_output_capture_re.exec(term_output);

    if (regex_match_array !== null) {
        gcc_output = regex_match_array[1];
        SendKeysToJor1k("clear\n");
        var errorAnnotations = getErrorAnnotations(gcc_output);
        editor.getSession().setAnnotations(errorAnnotations);

        var warnings_errors_count = {
            error: 0,
            warning: 0
        };
        errorAnnotations.forEach(function (errorAnnotation) {
            warnings_errors_count[errorAnnotation.type] += 1;
        });

        document.getElementById('gcc-error-count').innerHTML = warnings_errors_count.error.toString();
        document.getElementById('gcc-warning-count').innerHTML = warnings_errors_count.warning.toString();

        if (warnings_errors_count.error === 0) {
            if (warnings_errors_count.warning > 0) {
                document.getElementById('gcc-compile-status').innerHTML = '<span><a href="#" style="color: darkgoldenrod" onclick="alert(gcc_output); return false;">SUCCESSFUL WITH WARNINGS</a></span>';
            }
            else {
                document.getElementById('gcc-compile-status').innerHTML = '<span style="color: green">SUCCESS</span>';
            }
            SendKeysToJor1k("./program\n");
        }
        else {
            document.getElementById('gcc-compile-status').innerHTML = '<span><a href="#" style="color: red" onclick="alert(gcc_output); return false;">FAILED</a></span>';
        }
    }
    else {
        // output is not ready yet
        document.getElementById('gcc-compile-status').innerHTML = '<span style="color: gray">COMPILING</span>';
        setTimeout(waitForGccCompletion, 1000);
    }
}

var gcc_output_parse_re = /prog.c:(.+):\s*(.+)/g;
var gcc_row_col_type_parse_re = /(\d+):(\d+):\s*([\w]+)/;
function getErrorAnnotations(gcc_output_str) {
    var match, line_col_type_match, row, col, type, errors = [];
    gcc_output_str.split("\n").forEach(function (error_line) {
        if(match = gcc_output_parse_re.exec(error_line)) {
            if (line_col_type_match = gcc_row_col_type_parse_re.exec(match[1])) {
                row = line_col_type_match[1] - 1; // line numbers in ace start from zero
                col = line_col_type_match[2];
                type = line_col_type_match[3];
            }
            else {
                row = col = 0;
                type = "error";
            }

            errors.push({
                row: row,
                column: col,
                type: type, // ace supports error, warning or info
                text: match[2]
            });
        }
    });
    return errors;
}

function CreateEditor()
{
    editor = ace.edit("code");
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/c_cpp");
}

function GetCodeText() {
   //return document.getElementById('code').value; // textarea
   return editor.getSession().getValue(); //ace
}

function SendKeysToJor1k(text,quiet) {
  var tty = quiet ? "tty1" : "tty0";
  for(var i=0;i<text.length;i++) {
    jor1kgui.SendToWorker(tty, text.charCodeAt(i) >>>0);
  }
}

function RunCode(code,gccoptions) {
   if(code.length ===0 || code.indexOf("\x03") >= 0 || code.indexOf("\x04") >= 0 ) return;           

   jor1kgui.Pause(false);
    // wakeup tty0
   SendKeysToJor1k("\x03\n\nstty -clocal\nstty crtscts\nstty -ixoff\n",false); 
// wakeup hidden tty1
//tty1-unusedfornow SendKeysToJor1k("\x03\n",true);
   
   SendKeysToJor1k("cd ~;rm prog.c program 2>/dev/null\n");
   // not-reliable SendKeysToJor1k("stty -echo\n\n");   // Does not work reliably

   switch(3) {
	   case 1: // dd - does not work
	     SendKeysToJor1k("dd ibs=1 of=prog.c count="+code.length+"\n");
	     SendKeysToJor1k(code);
	   break;
	   case 2:  // cat - does not work
	     SendKeysToJor1k("cat >prog.c\n");
	     SendKeysToJor1k(code);
	     SendKeysToJor1k("\x04"); //  why does this not work?
	   break
	   case 3:  // brain dead echo does work
	     codeArray= code.match(/[^]{1,256}/gim); // Avoid 1K line-limit (assume escape expansion) so split programing into shorter chuncks
	     for(var i=0; i < codeArray.length;i++) {
	          // For happiness, escape *after* splitting
	          var escaped = codeArray[i] .replace(/\\/g,"\\134").replace(/\t/g,"\\t")
	                   .replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/"/gm,'\\"');
	          //Todo Handle all chars in the sent file i.e. replace <=0x2f with \xnn

	          SendKeysToJor1k('echo -n -e "');
	          SendKeysToJor1k(escaped);
	          SendKeysToJor1k('\">> prog.c\n');
	     }
	}
   // For now we want gcc output to be viewable, so this goes on the main terminal
   // To use tty1 we would need to synchronize gcc i.e. wait for prog.c upload

      // not-reliable SendKeysToJor1k("stty echo\n\nclear\n");
    term_output = "";
    SendKeysToJor1k("echo \\#\\#\\#GCC_COMPILE\\#\\#\\#;clear;gcc " + gccoptions + " prog.c -o program;echo \\#\\#\\#GCC_COMPILE_FINISHED\\#\\#\\#;clear\n");
    waitForGccCompletion();
}

