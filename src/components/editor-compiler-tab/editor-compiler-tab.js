import ko from 'knockout';
import templateMarkup from 'text!./editor-compiler-tab.html';

class EditorCompilerTab {
    constructor(params) {
        this.editorParams = params.editorParams;
        this.compilerParams = params.compilerParams;
    }

    dispose() {
        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
    }
}

export default { viewModel: EditorCompilerTab, template: templateMarkup };
