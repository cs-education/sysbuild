import ko from 'knockout';
import templateMarkup from 'text!./vm-state-label.html';

const vmStateToLabelClassMap = {
    'Stopped': 'danger',
    'Booting': 'warning',
    'Running': 'success',
    'Paused': 'default'
};

class VmStateLabel {
    constructor(params) {
        this.vmState = params.vmState;
        this.vmStateClass = ko.pureComputed(() =>
            'label label-' + vmStateToLabelClassMap[this.vmState()]);
    }

    dispose() {
        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
    }
}

export default { viewModel: VmStateLabel, template: templateMarkup };
