import ko from 'knockout';
import templateMarkup from 'text!./compiler-state-label.html';
import { notify } from 'app/notifications';

const compileStatusToLabelClassMap = {
    'Waiting': 'default',
    'Ready': 'success',
    'Compiling': 'primary',
    'Cancelled': 'default',
    'Success': 'success',
    'Warnings': 'default-light',
    'Failed': 'default-light'
};

class CompilerStateLabel {
    constructor(params) {
        // TODO: Wire these from parent component
        this.compileStatus = ko.observable('Warnings');
        this.gccErrorCount = ko.observable(1);
        this.gccWarningCount = ko.observable(1);
        this.lastGccOutput = ko.observable('TEST');

        this.compileStatusClass = ko.pureComputed(() =>
            'label label-' + compileStatusToLabelClassMap[this.compileStatus()]);

        this.showErrorWarningLabel = ko.pureComputed(() => {
            var unsuccessful = (this.compileStatus() === 'Warnings' || this.compileStatus() === 'Failed');
            if (unsuccessful) {
                notify('There were errors or warnings during compilation', 'red');
            }
            return unsuccessful;
        });

        this.errorWarningLabel = ko.pureComputed(() => {
            var errors = this.gccErrorCount(),
                warnings = this.gccWarningCount(),
                str = '';
            str += errors ? '<span class="compile-status-label-text-error">' + (errors + ' error' + (errors > 1 ? 's ' : '')) + (warnings ? '' : '\u2026') + '</span>' : '';
            str += warnings ? '&nbsp;<span class="compile-status-label-text-warning">' + (warnings + ' warning' + (warnings > 1 ? 's' : '')) + '\u2026' + '</span>' : '';
            if (!str && this.showErrorWarningLabel()) {
                // the compilation failed but error/warning count is not available
                str = '<span class="compile-status-label-text-error">' + this.compileStatus() + '\u2026' + '</span>';
            }
            return str;
        });
    }

    dispose() {
        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
    }
}

export default { viewModel: CompilerStateLabel, template: templateMarkup };
