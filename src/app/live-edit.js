import * as SysGlobalObservables from 'app/sys-global-observables'

class LiveEdit {
    constructor(_runtime) {
        this.runtime = _runtime;

        var updateCompileButton = () => {
            var ready = this.runtime.ready();
            SysGlobalObservables.vmState(ready ? 'Running' : 'Booting');
            SysGlobalObservables.compileStatus(ready ? 'Ready' : 'Waiting');
        }.bind(this);

        updateCompileButton(); // Maybe sys is already up and running

        this.runtime.addListener('ready', () => {
            updateCompileButton();
        }.bind(this));

        SysGlobalObservables.runCode(this.runCode.bind(this));
    }

    escapeHtml(unsafe) {
        /*stackoverflow.com/questions/6234773/*/
        return unsafe
             .replace(/&/g, '&amp;')
             .replace(/</g, '&lt;')
             .replace(/>/g, '&gt;')
             .replace(/"/g, '&quot;')
             .replace(/'/g, '&#039;');
    }

    processGccCompletion(result) {
        SysGlobalObservables.gccErrorCount(0);
        SysGlobalObservables.gccWarningCount(0);

        if (!result) {
            // cancelled
            SysGlobalObservables.compileStatus('Cancelled');
            return;
        }

        // null if cancelled
        // result = { 'exitcode':gcc_exit_code, 'stats':stats,'annotations':annotations,'gcc_ouput':gcc_output}

        this.runtime.sendKeys('tty0', 'clear\n');

        var aceAnnotations = [], gccOptsErrors = [];
        result.annotations.forEach((annotation) => {
            if (annotation.isGccOptsError) {
                gccOptsErrors.push(annotation);
            } else {
                aceAnnotations.push(annotation);
            }
        });

        this.editor.setAnnotations(aceAnnotations);
        this.viewModel.lastGccOutput(result.gccOutput);
        this.viewModel.gccErrorCount(result.stats.error);
        this.viewModel.gccWarningCount(result.stats.warning);
        this.viewModel.gccOptsError(gccOptsErrors.map(function (error) {
            return error.text;
        }).join('\n'));

        if (result.exitCode === 0) {
            this.viewModel.compileStatus(result.stats.warning > 0 ? 'Warnings' : 'Success');
            this.runtime.startProgram('program', this.viewModel.programArgs());
        } else {
            this.viewModel.compileStatus('Failed');
        }
    }

    runCode(code, gccOptions) {
        if (code.length === 0 || code.indexOf('\x03') >= 0 || code.indexOf('\x04') >= 0) {
            return;
        }
        var callback = this.processGccCompletion.bind(this);

        SysGlobalObservables.compileStatus('Compiling');

        this.runtime.startGccCompile(code, gccOptions, callback);
    }
}

export default LiveEdit;
