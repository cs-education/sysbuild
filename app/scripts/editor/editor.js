/* global $, ace, SysViewModel, TokenHighlighter, Preferences */

window.Editor = (function () {
    'use strict';
    // Counter for generating unique element Ids for an editor
    var editorInstanceCounter = 0;
    function Editor(editorDivId) {
        var self = this;
        self.editorId = editorInstanceCounter;
        editorInstanceCounter += 1;

    }
    return Editor;
})();
