import ko from 'knockout';
import templateMarkup from 'text!./playground-layout.html';
import 'jquery-ui-layout';

class PlaygroundLayout {
    constructor(params) {
        this.activityData = params.activityData;
        this.showLessonNavigation = this.activityData && this.activityData();
        this.editorPaneTabs = ko.observableArray();

        this.initLayout();
        this.createVideoSearchTab();
        this.createEditorTab();
        this.createManPageSearchTab();
    }

    createEditorTab() {
        this.editorPaneTabs.push({
            title: 'Code',
            icon: 'file',
            component: {
                name: 'editor-compiler-tab',
                params: {
                    editorParams: {
                        autoindent: ko.observable(true),
                        highlightLine: ko.observable(true),
                        showInvisibles: ko.observable(false),
                        theme: ko.observable('monokai'),
                        fontSize: ko.observable(12),
                        availableAceThemes: ko.observableArray(['monokai', 'terminal', 'tomorrow', 'xcode']),
                        initialEditorText: 'INITIAL EDITOR TEXT'
                    },
                    compilerParams: {
                        gccOptsError: ko.observable(''),
                        gccOptions: ko.observable(''),
                        programArgs: ko.observable(''),
                        compileBtnEnable: ko.observable(false),
                        compileBtnTooltip: ko.observable('')
                    }
                }
            }
        });
    }

    createManPageSearchTab() {
        this.editorPaneTabs.push({
            title: 'Man page search',
            contentCssClasses: 'man-page-tab',
            component: {
                name: 'manpages-search-tab',
                params: {
                    addEditorPaneTab: (tab) => { this.editorPaneTabs.push(tab); }
                }
            }
        });
    }

    createVideoSearchTab() {
        this.editorPaneTabs.push({
            title: 'Video Search',
            contentCssClasses: 'man-page-tab',
            component: {
                name: 'video-search-tab'
            }
        });
    }

    initLayout() {
        const mainNavBarHeightPx = 51;
        this.navbarTopMargin = mainNavBarHeightPx + 'px';

        var navBarHeightPx = 33;
        if (!this.showLessonNavigation)
            navBarHeightPx = 0;

        var mainLayout = $('#layout').layout({
            livePaneResizing: true,

            north__paneSelector: '#navbar-container',
            center__paneSelector: '#code-container',
            east__paneSelector: '#doc-tty-container',
            south__paneSelector: '#footer-container',

            east__size: '50%',
            spacing_open: 2,

            north__resizable: false,
            north__size: mainNavBarHeightPx + navBarHeightPx,
            north__spacing_open: 0,
            north__spacing_closed: 0,
            north__showOverflowOnHover: true,

            south__resizable: false,
            south__size: 29,
            south__spacing_open: 0,

            onresizeall: function (layout, state) {
                // Make the layout responsive - close the east pane when the screen becomes too small,
                // reopen it when the screen becomes wide again.
                // Adapted from https://groups.google.com/forum/#!msg/jquery-ui-layout/69xyqoyqGcU/1XvjZSW9n4wJ
                var width = state.container.outerWidth;
                if (width <= 800 && !state.east.isClosed) {
                    layout.close('east');
                    state.east.autoClosed = true; // CUSTOM state-data
                } else if (state.east.autoClosed) {
                    layout.open('east');
                    state.east.autoClosed = false;
                }
            }
        });

        var ttyLayout = mainLayout.panes.east.layout({
            livePaneResizing: true,
            spacing_open: 2,

            north__paneSelector: '#doc-container',
            center__paneSelector: '#tty-pane',

            north__size: '40%'
        });

        return {
            mainLayout: mainLayout,
            ttyLayout: ttyLayout
        };
    }

    dispose() {
        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
    }
}

export default { viewModel: PlaygroundLayout, template: templateMarkup };
