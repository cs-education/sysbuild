import ko from 'knockout';
import templateMarkup from 'text!./playground-layout.html';
import 'jquery-ui-layout';

class PlaygroundLayout {
    constructor(params) {
        this.activityData = params.activityData;
        this.showLessonNavigation = !!this.activityData; // coerce to boolean
        this.editorPaneTabs = ko.observableArray();

        this.docParams = params.docParams;
        this.vmState = params.vmParams.vmState;
        const compilerParams = params.compilerParams;
        this.compilerStateParams = {
            compileStatus: compilerParams.compileStatus,
            lastGccOutput: compilerParams.lastGccOutput,
            gccErrorCount: compilerParams.gccErrorCount,
            gccWarningCount: compilerParams.gccWarningCount
        };

        const editorParams = params.editorParams;
        const openManPageCallback = this.openManPage.bind(this);
        editorParams.openManPage = openManPageCallback;

        this.initLayout();
        $('body').css('overflow', 'hidden');

        // Prevent accidental backward navigation.
        // The event name is namespaced so that its handler can be safely removed
        // when this component is disposed, as we want backspace to work properly
        // when the user is not in the playground.
        $(window).on('keydown.playground', (e) => {
            const keyCode = {
                backspace: 8
            };

            // allow backspace for inputs
            const focused = $(':focus');
            if (focused.is('input') || focused.is('textarea')) {
                return true;
            }

            if (e.keyCode === keyCode.backspace) {
                e.preventDefault();
            }
        });

        this.createVideoSearchTab();
        this.createEditorTab(editorParams, compilerParams);
        this.createFileBrowserTab();
        this.createManPageSearchTab(openManPageCallback);
    }

    createEditorTab(editorParams, compilerParams) {
        this.editorPaneTabs.push({
            title: 'Code',
            icon: 'file',
            closable: false,
            component: {
                name: 'editor-compiler-tab',
                params: {
                    editorParams: editorParams,
                    compilerParams: compilerParams
                }
            }
        });
    }

    createManPageSearchTab(openManPageCallback) {
        this.editorPaneTabs.push({
            title: 'Man Page Search',
            closable: false,
            component: {
                name: 'manpages-search-tab',
                params: {
                    openManPage: openManPageCallback
                }
            }
        });
    }

    createVideoSearchTab() {
        this.editorPaneTabs.push({
            title: 'Video Search',
            closable: false,
            component: {
                name: 'video-search-tab'
            }
        });
    }

    createFileBrowserTab() {
        this.editorPaneTabs.push({
            title: 'File Browser',
            icon: 'list-alt',
            closable: false,
            component: {
                name: 'file-browser'
            }
        });
    }

    // Callback used by the manpages-search-tab and editor components
    openManPage(manPage) {
        if (!manPage) {
            return;
        }

        const name = manPage.name;
        const section = manPage.section;

        this.editorPaneTabs.push({
            title: `${name} (${section})`,
            component: {
                name: 'manpage-tab',
                params: {
                    manPageName: name,
                    manPageSection: section
                }
            }
        });

        const addedTabName = `${name} (${section})`;
        $('#editor-tabs-bar').find('span:contains("' + addedTabName + '")').click();
    }

    initLayout() {
        const mainNavBarHeightPx = 51;
        this.navbarTopMargin = mainNavBarHeightPx + 'px';

        let navBarHeightPx = 33;
        if (!this.showLessonNavigation) {
            navBarHeightPx = 0;
        }

        const mainLayout = $('#layout').layout({
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

            onresizeall: (layout, state) => {
                // Make the layout responsive - close the east pane when the screen becomes too small,
                // reopen it when the screen becomes wide again.
                // Adapted from https://groups.google.com/forum/#!msg/jquery-ui-layout/69xyqoyqGcU/1XvjZSW9n4wJ
                const width = state.container.outerWidth;
                if (width <= 800 && !state.east.isClosed) {
                    layout.close('east');
                    state.east.autoClosed = true; // CUSTOM state-data
                } else if (state.east.autoClosed) {
                    layout.open('east');
                    state.east.autoClosed = false;
                }
            }
        });

        const ttyLayout = mainLayout.panes.east.layout({
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
        $('body').css('overflow', 'auto');
        $(window).off('keydown.playground');
    }
}

export default { viewModel: PlaygroundLayout, template: templateMarkup };
