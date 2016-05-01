import ko from 'knockout';
import templateMarkup from 'text!./playground-footer.html';

class PlaygroundFooter {
    constructor(params) {
        this.vmState = params.vmState;
        this.compilerStateParams = params.compilerStateParams;
    }

    dispose() {
        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
    }
}

export default { viewModel: PlaygroundFooter, template: templateMarkup };
