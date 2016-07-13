import ko from 'knockout';
import templateMarkup from 'text!./not-found-page.html';

class NotFoundPage {
    constructor(params) {
        this.message = ko.observable('Hello from the not-found-page component!');
    }

    dispose() {
        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
    }
}

export default { viewModel: NotFoundPage, template: templateMarkup };
