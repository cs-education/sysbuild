import ko from 'knockout';
import template from 'text!./nav-bar.html';

class NavBarViewModel {
    constructor(params) {
        this.route = params.route;
        this.containerClass = ko.pureComputed(() =>
            (this.route().page === 'play-activity-page') ? 'container-fluid' : 'container');
    }
}

export default { viewModel: NavBarViewModel, template: template };
