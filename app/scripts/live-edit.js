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
        var GCC_RESULT_HTML_WARN = '<span><a href="#" style="color: darkgoldenrod" onclick="alert(global_last_gcc_output); return false;">SUCCESSFUL WITH WARNINGS</a></span>';
        var GCC_RESULT_HTML_SUCCESS = '<span style="color: green">SUCCESS</span>';
        var GCC_RESULT_HTML_ERROR = '<span><a href="#" style="color: red" onclick="alert(global_last_gcc_output); return false;">FAILED</a></span>';
        //var GCC_RESULT_HTML_COMPILING = '<span style="color: gray">COMPILING</span>';

        var GCC_RESULT_HTML_CANCEL = '<span style="color: gray">Cancelled</span>';
  
        this.setHtml('gcc-error-count', '');
        this.setHtml('gcc-warning-count', '');

        if (!result) {
            // cancelled
            this.setHtml('gcc-compile-status', GCC_RESULT_HTML_CANCEL);
            return;
        }

        // null if cancelled
        // result = { 'exitcode':gcc_exit_code, 'stats':stats,'annotations':annotations,'gcc_ouput':gcc_output}

        this.runtime.sendKeys('clear\n');
        this.ace.getSession().setAnnotations(result.annotations);

        window.globalLastGccOutput = result.gccOutput;

        this.setHtml('gcc-error-count',   result.stats.error.toString());
        this.setHtml('gcc-warning-count', result.stats.warning.toString());

        var statusMsg = GCC_RESULT_HTML_ERROR;
        if (result.exitCode === 0) {
            var cmdargs = this.getElement('cmdline').value;
            statusMsg = result.stats.warning > 0 ? GCC_RESULT_HTML_WARN : GCC_RESULT_HTML_SUCCESS;
            this.runtime.startProgram('program', cmdargs);
        }
        this.setHtml('gcc-compile-status', statusMsg);
    };

    LiveEdit.prototype.getCodeText = function() {
        return this.ace.getSession().getValue();
    };

    LiveEdit.prototype.runCode = function(code, gccOptions) {
        if(code.length === 0 || code.indexOf('\x03') >= 0 || code.indexOf('\x04') >= 0 ) {
            return;
        }
        var callback = this.processGccCompletion.bind(this);
        this.runtime.startGccCompile(code, gccOptions, callback);
    };

    LiveEdit.prototype.setTheme = function (theme) {
        this.ace.setTheme('ace/theme/' + theme);
    };

    return LiveEdit;
})(ace);
