function DebugMessage(message) {
    console.log(message);
}

function UARTDev(worker) {
    this.ReceiveChar = function(c) {
        if (worker.lastMouseDownTarget != worker.fbcanvas) {
            worker.SendToWorker("tty0", c);
        }
    };
}

function jor1kGUI(termid, fbid, statsid, imageurls, relayURL)
{
    this.urls = imageurls;
    
    this.worker = new Worker('jor1k/js/worker/worker.js');
    this.worker.onmessage = this.OnMessage.bind(this);   
    this.worker.onerror = function(e) {
        console.log("Error at " + e.filename + ":" + e.lineno + ": " + e.message);
    }
    
    this.SendToWorker = function(command, data) {
        this.worker.postMessage(
        {
            "command": command,
            "data": data
        });
    }

    this.Reset= function () {
      this.stop = false; // VM Stopped/Aborted
      this.userpaused = false;
      this.executepending=false; // if we rec an execute message while paused      
      this.SendToWorker("Reset");
      this.SendToWorker("LoadAndStart", this.urls);
      this.term.PauseBlink(false);
    }
    this.Pause = function(pause) {
      pause = !! pause; // coerce to boolean
      if(pause == this.userpaused) return; 
      this.userpaused = pause;
      if(! this.userpaused && this.executepending) {
        this.executepending = false;
         this.SendToWorker("execute", 0);
      }
      this.term.PauseBlink(pause);
    }

    this.terminalcanvas = document.getElementById(termid);

    this.term = new Terminal(24, 80, termid);
    this.terminput = new TerminalInput(new UARTDev(this));

    this.IgnoreKeys = function() {
      //Simpler but not as general, return( document.activeElement.type==="textarea" || document.activeElement.type==='input');
      return ((this.lastMouseDownTarget != this.terminalcanvas));
    }
    var recordTarget = function(event) {
            this.lastMouseDownTarget = event.target;
        }.bind(this);
      
    if(document.addEventListener)
      document.addEventListener('mousedown', recordTarget, false);
    else
      Window.onmousedown = recordTarget; // IE 10 support (untested)
        
    
    document.onkeypress = function(event) {
        if(this.IgnoreKeys()) return true;
        this.SendToWorker("keypress", {keyCode:event.keyCode, charCode:event.charCode});
        return this.terminput.OnKeyPress(event);
    }.bind(this);

    document.onkeydown = function(event) {
        if(this.IgnoreKeys()) return true;
        this.SendToWorker("keydown", {keyCode:event.keyCode, charCode:event.charCode});
        return this.terminput.OnKeyDown(event);
    }.bind(this);

    document.onkeyup = function(event) {
        if(this.IgnoreKeys()) return true;
        this.SendToWorker("keyup", {keyCode:event.keyCode, charCode:event.charCode});
        return this.terminput.OnKeyUp(event);
    }.bind(this);

    this.ethernet = new Ethernet(relayURL);
    this.ethernet.onmessage = function(e) {
        this.SendToWorker("ethmac", e.data);
    }.bind(this);
    
    this.Reset();
    }

jor1kGUI.prototype.OnMessage = function(e) {
    if (this.stop) return;
    switch(e.data.command)
    {
        case "execute":  // this command is send back and forth to be responsive
            if(this.userpaused) {
              this.executepending = true;
            } else {
              this.executepending = false; 
              this.SendToWorker("execute", 0);
            }
            break;
        case "ethmac":
            this.ethernet.SendFrame(e.data.data);
            break;
        case "tty0":
            this.term.PutChar(e.data.data);
            break;
        case "Stop":
            console.log("Received stop signal");
            this.stop = true;
            break;
        case "Debug":
            console.log(e.data.data);
            break;
    }
}


