import ko from 'knockout';
import templateMarkup from 'text!./compiler-state-label.html';
import { notify } from 'app/notifications';

const compileStatusToLabelClassMap = {
    Waiting: 'default',
    Ready: 'success',
    Compiling: 'primary',
    Cancelled: 'default',
    Success: 'success',
    Warnings: 'default-light',
    Failed: 'default-light'
};

class CompilerStateLabel {
    constructor(params) {
        this.compileStatus = params.compilerState.compileStatus;
        this.gccErrorCount = params.compilerState.gccErrorCount;
        this.gccWarningCount = params.compilerState.gccWarningCount;
        this.lastGccOutput = params.compilerState.lastGccOutput;

        this.compileStatusClass = ko.pureComputed(() =>
            'label label-' + compileStatusToLabelClassMap[this.compileStatus()]);

        this.showErrorWarningLabel = ko.pureComputed(() => {
            const unsuccessful = (this.compileStatus() === 'Warnings' || this.compileStatus() === 'Failed');
            if (unsuccessful) {
                notify('There were errors or warnings during compilation', 'red');
            }
            return unsuccessful;
        });

        this.errorWarningLabel = ko.pureComputed(() => {
            const errors = this.gccErrorCount();
            const warnings = this.gccWarningCount();
            let str = '';
            str += errors ? '<span class="compile-status-label-text-error">' + (errors + ' error' + (errors > 1 ? 's ' : '')) + (warnings ? '' : '\u2026') + '</span>' : '';
            str += warnings ? '&nbsp;<span class="compile-status-label-text-warning">' + (warnings + ' warning' + (warnings > 1 ? 's' : '')) + '\u2026' + '</span>' : '';
            if (!str && this.showErrorWarningLabel()) {
                // the compilation failed but error/warning count is not available
                str = '<span class="compile-status-label-text-error">' + this.compileStatus() + '\u2026' + '</span>';
            }
            return str;
        });

        // The modal needs to be "outside" the layout if used on the playground page
        // https://stackoverflow.com/questions/10636667/bootstrap-modal-appearing-under-background
        $('a[data-target=#gcc-error-window]').click(() => {
            $('#gcc-error-window').appendTo('body');
        });
    }

    dispose() {
        $('#gcc-error-window').remove();
    }
}

export default { viewModel: CompilerStateLabel, template: templateMarkup };
