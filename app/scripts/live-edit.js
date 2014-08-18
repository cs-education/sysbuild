/* global ace */

window.LiveEdit = (function (ace) {
    'use strict';

    // LiveEdit class.
    function LiveEdit(editorDivId, _runtime) {
        this.runtime = _runtime;
  
        this.ace = ace.edit(editorDivId);
        this.ace.setTheme('ace/theme/monokai');
        this.ace.getSession().setMode('ace/mode/c_cpp');
        this.compileBtn = document.getElementById('compile-btn');

        var updateCompileButton = function() {
            var ready = this.runtime.ready();
            /* TODO: abstract UI specific code */
            this.compileBtn.disabled = !ready;
            this.setHtml('gcc-compile-status', ready ? 'Ready' : 'VM booting');
            this.setHtml('vm-state', ready ? 'Ready' : 'Booting');
            this.getElement('gcc-compile-status').className = ready ? 'label label-success' : 'label label-warning';
            this.getElement('vm-state').className = ready ? 'label label-success' : 'label label-warning';
        }.bind(this);

        updateCompileButton(); // Maybe sys is already up and running
  
        this.runtime.addListener('ready', function() {
            updateCompileButton();
        }.bind(this));
    }

    // Currently JQuery-free
    LiveEdit.prototype.getElement = function (id) {
        return document.getElementById(id);
    };

    LiveEdit.prototype.setHtml = function (id, html) {
        var el = this.getElement(id);
        el.innerHTML = html;
        return el;
    };

    LiveEdit.prototype.escapeHtml = function (unsafe) {
        /*stackoverflow.com/questions/6234773/*/
        return unsafe
             .replace(/&/g, '&amp;')
             .replace(/</g, '&lt;')
             .replace(/>/g, '&gt;')
             .replace(/"/g, '&quot;')
             .replace(/'/g, '&#039;');
    };

    LiveEdit.prototype.processGccCompletion = function (result) {
        var GCC_RESULT_HTML_WARN = '<span onclick="alert(globalLastGccOutput); return false;">SUCCESSFUL WITH WARNINGS</span>';
        var GCC_RESULT_HTML_ERROR = '<span onclick="alert(globalLastGccOutput); return false;">FAILED</span>';
  
        this.setHtml('gcc-error-count', '');
        this.setHtml('gcc-warning-count', '');

        if (!result) {
            // cancelled
            this.setHtml('gcc-compile-status', 'Cancelled');
            this.getElement('gcc-compile-status').className = 'label label-default';
            return;
        }

        // null if cancelled
        // result = { 'exitcode':gcc_exit_code, 'stats':stats,'annotations':annotations,'gcc_ouput':gcc_output}

        this.runtime.sendKeys('clear\n');
        this.ace.getSession().setAnnotations(result.annotations);

        window.globalLastGccOutput = result.gccOutput;

        this.setHtml('gcc-error-count',   result.stats.error.toString());
        this.setHtml('gcc-warning-count', result.stats.warning.toString());

        if (result.exitCode === 0) {
            var cmdargs = this.getElement('cmdline').value;

            var warnings = result.stats.warning > 0;
            this.setHtml('gcc-compile-status', warnings ? GCC_RESULT_HTML_WARN : 'Success');
            this.getElement('gcc-compile-status').className = warnings ? 'label label-warning' : 'label label-success';

            this.runtime.startProgram('program', cmdargs);
        } else {
            this.setHtml('gcc-compile-status', GCC_RESULT_HTML_ERROR);
            this.getElement('gcc-compile-status').className = 'label label-danger';
        }
        
        this.compileBtn.disabled = false;
    };

    LiveEdit.prototype.getCodeText = function() {
        return this.ace.getSession().getValue();
    };

    LiveEdit.prototype.runCode = function(code, gccOptions) {
        if(code.length === 0 || code.indexOf('\x03') >= 0 || code.indexOf('\x04') >= 0 ) {
            return;
        }
        var callback = this.processGccCompletion.bind(this);

        this.compileBtn.disabled = true;
        this.setHtml('gcc-compile-status', 'Compiling');
        this.getElement('gcc-compile-status').className = 'label label-warning';

        this.runtime.startGccCompile(code, gccOptions, callback);
    };

    LiveEdit.prototype.setTheme = function (theme) {
        this.ace.setTheme('ace/theme/' + theme);
    };

    return LiveEdit;
})(ace);
