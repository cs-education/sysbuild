import ko from 'knockout';
import templateMarkup from 'text!./lessons-page.html';
import * as lessons from 'app/lessons';

class LessonsPage {
    constructor(params) {
        this.chapters = lessons.chapters;
    }

    dispose() {
        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
    }
}

export default { viewModel: LessonsPage, template: templateMarkup };
