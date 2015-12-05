import ko from 'knockout';
import templateMarkup from 'text!./copyright-line.html';

class CopyrightLine {
    constructor(params) {
        this.projectLicense = ko.observable('Could not load the license file. Please use the link above to view the latest license on GitHub');
        $.get('LICENSE.md', function (data) {
            this.projectLicense(marked(data));
        });

        // The modal needs to be "outside" the layout if used on the playground page
        // https://stackoverflow.com/questions/10636667/bootstrap-modal-appearing-under-background
        $('a[data-target=#project-license-window]').click(() => {
            $('#project-license-window').appendTo('body');
        });
    }

    dispose() {
        $('#project-license-window').remove();
    }
}

export default { viewModel: CopyrightLine, template: templateMarkup };
