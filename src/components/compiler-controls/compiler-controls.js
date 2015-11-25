import ko from 'knockout';
import templateMarkup from 'text!./compiler-controls.html';

class CompilerControls {
    constructor(params) {
        this.gccOptsError = params.gccOptsError;
        this.gccOptions = params.gccOptions;
        this.programArgs = params.programArgs;
        this.compileBtnEnable = params.compileBtnEnable;
        this.compileBtnTooltip = params.compileBtnTooltip;
    }

    dispose() {
        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
    }
}

export default { viewModel: CompilerControls, template: templateMarkup };
