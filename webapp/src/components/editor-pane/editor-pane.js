import ko from 'knockout';
import templateMarkup from 'text!./editor-pane.html';
import 'knockout-projections';

class EditorPane {
    constructor(params) {
        this.currentActiveTabIndex = ko.observable(params.initialTabIndex || 0);
        this.sourceTabArray = params.editorPaneTabs;
        this.editorPaneTabs = this.sourceTabArray.map((tab) => ({
            tabTitle: tab.title,
            tabIconClass: 'glyphicon glyphicon-' + (tab.icon || 'globe'),
            closable: (typeof tab.closable === 'undefined') ? true : !!tab.closable,
            tabContentClasses: tab.contentCssClasses || '',
            tabComponent: tab.component
        }));

        this.resize();
        $(window).resize(this.resize.bind(this));
    }

    resize() {
        window.setTimeout(() => {
            $('.tab-content').height(
                $('#code-container').height() -
                $('#editor-tabs-bar').height() -
                5
            );
        }, 500);
    }

    closeTab(tab) {
        let newActiveTabIndex = this.currentActiveTabIndex();
        const index = this.editorPaneTabs().indexOf(tab);

        // Remove from the original array passed to this component,
        // so that the other observers also get the update.
        // editorPaneTabs will update automatically, thanks to
        // knockout-projections.
        this.sourceTabArray.splice(index, 1);

        if (index <= newActiveTabIndex) {
            newActiveTabIndex -= 1;
        }

        this.currentActiveTabIndex(newActiveTabIndex);
    }

    dispose() {
        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
    }
}

export default { viewModel: EditorPane, template: templateMarkup };
