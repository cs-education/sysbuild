import ko from 'knockout';
import templateMarkup from 'text!./vm-state-label.html';

const vmStateToLabelClassMap = {
    Stopped: 'danger',
    Booting: 'warning',
    Running: 'success',
    Paused: 'default'
};

class VmStateLabel {
    constructor(params) {
        this.vmState = params.vmState;
        this.vmStateClass = ko.pureComputed(() =>
            'label label-' + vmStateToLabelClassMap[this.vmState()]);

        /* Jor1k is initialized at application startup. During initialization, it expects
           the vm-stats element to be present in the document. However, this component
           is shown only when the playground is displayed. So, as a workaround, the
           main HTML file (index.html) contains the vm-stats span element inside a hidden
           DIV. When this component is constructed, that element is moved inside the
           vm-state-container to be shown on the screen. When this component is disposed,
           the element is moved back into the hidden DIV, ready to be moved back if and
           when this component is constructed again at some point. */
        $('#vm-stats').appendTo('#vm-state-container');
    }

    dispose() {
        $('#vm-stats').appendTo('#hidden-vm-stats-container');
    }
}

export default { viewModel: VmStateLabel, template: templateMarkup };
