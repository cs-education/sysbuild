import ko from 'knockout';
import templateMarkup from 'text!./copyright-line.html';

class CopyrightLine {
    constructor(params) {
        this.projectLicense = ko.observable('Could not load the license file. Please use the link above to view the latest license on GitHub');
        $.get('LICENSE.md', function (data) {
            this.projectLicense(marked(data));
        });
    }

    dispose() {
        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
    }
}

export default { viewModel: CopyrightLine, template: templateMarkup };
