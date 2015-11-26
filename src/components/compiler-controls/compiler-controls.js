import ko from 'knockout';
import templateMarkup from 'text!./compiler-controls.html';

class CompilerControls {
    constructor(params) {
        this.gccOptsError = params.gccOptsError;
        this.gccOptions = params.gccOptions;
        this.programArgs = params.programArgs;
        this.compileBtnEnable = params.compileBtnEnable;
        this.compileBtnTooltip = params.compileBtnTooltip;

        /* TODO
        this.compileStatus = params.compileStatus();

        this.compileBtnEnable = ko.pureComputed(() => {
            var ready = !(this.compileStatus() === 'Waiting' || this.compileStatus() === 'Compiling');
            if (ready) {
                $.notific8('The compiler is now online', confirmNotific8Options);
            } else {
                $.notific8('The compiler is currently busy', busyNotific8Options);
            }
            return ready;
        });*/
    }

    dispose() {
        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
    }
}

export default { viewModel: CompilerControls, template: templateMarkup };
