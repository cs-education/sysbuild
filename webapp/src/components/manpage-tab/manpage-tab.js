import ko from 'knockout';
import templateMarkup from 'text!./manpage-tab.html';

class ManpageTab {
    constructor(params) {
        const name = params.manPageName;
        const section = params.manPageSection;
        this.url = `https://cs-education.github.io/sysassets/man_pages/html/man${section}/${name}.${section}.html`;
    }

    dispose() {
        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
    }
}

export default { viewModel: ManpageTab, template: templateMarkup };
