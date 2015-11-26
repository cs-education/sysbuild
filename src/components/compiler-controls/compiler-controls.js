import ko from 'knockout';
import templateMarkup from 'text!./compiler-controls.html';
import { notify } from 'app/notifications';

class CompilerControls {
    constructor(params) {
        this.gccOptsError = params.gccOptsError;
        this.gccOptions = params.gccOptions;
        this.programArgs = params.programArgs;
        this.compileStatus = params.compileStatus;
        this.compileBtnTooltip = params.compileBtnTooltip;

        this.compileBtnEnable = ko.pureComputed(() => {
            var ready = !(this.compileStatus() === 'Waiting' || this.compileStatus() === 'Compiling');
            if (ready) {
                notify('The compiler is now online', 'green');
            } else {
                notify('The compiler is currently busy', 'yellow');
            }
            return ready;
        });
    }

    dispose() {
        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
    }
}

export default { viewModel: CompilerControls, template: templateMarkup };
