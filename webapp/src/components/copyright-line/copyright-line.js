import ko from 'knockout';
import templateMarkup from 'text!./copyright-line.html';
import marked from 'marked';
import { projectLicense } from 'app/sys-global-observables';

class CopyrightLine {
    constructor(params) {
        this.projectLicense = projectLicense;
        this.displayHtml = ko.pureComputed(() => {
            if (!this.projectLicense()) {
                return '<p>Could not load the license file. Please use the link above to view the latest license on GitHub.</p>';
            }
            return this.projectLicense();
        });

        // The modal needs to be "outside" the layout if used on the playground page
        // https://stackoverflow.com/questions/10636667/bootstrap-modal-appearing-under-background
        $('a[data-target=#project-license-window]').click(() => {
            this.populate();
            $('#project-license-window').appendTo('body');
        });
    }

    populate() {
        if (!this.projectLicense()) {
            $.get('LICENSE.md', (data) => {
                this.projectLicense(marked(data));
            });
        }
    }

    dispose() {
        $('#project-license-window').remove();
    }
}

export default { viewModel: CopyrightLine, template: templateMarkup };
