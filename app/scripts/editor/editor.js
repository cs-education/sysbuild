/* global $, ace, SysViewModel, TokenHighlighter, Preferences */

window.Editor = (function () {
    'use strict';
    // Counter for generating unique element Ids for an editor
    var editorInstanceCounter = 0;
    function Editor(editorDivId) {
        var self = this;
        self.editorId = editorInstanceCounter;
        editorInstanceCounter += 1;
        self.viewModel = SysViewModel.getInstance();
        self.preferences = Preferences.getInstance('editor');
        var autoIndent = self.preferences.getItem('autoindent', 'true');
        var highlightLine = self.preferences.getItem('highlightline', 'true');
        var showInvisibles = self.preferences.getItem('showinvisibles', 'false');
        var theme = self.preferences.getItem('theme', self.viewModel.aceTheme());
        var fontSize = self.preferences.getItem('fontsize', 12);
    }
    return Editor;
})();
