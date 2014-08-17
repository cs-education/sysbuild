/* global LiveEdit, SysRuntime */

(function main(LiveEdit, SysRuntime) {
    'use strict';

    // Globals
    var liveEdit; // The single IDE
    window.globalLastGccOutput = '';

    // GLOBAL FUNCTIONS : UI glue
    window.compileButtonClicked = function () {
        var code =  liveEdit.getCodeText();
        var gccOptions = liveEdit.getElement('gccoptions').value;
        liveEdit.runCode(code, gccOptions);
        return false;
    };

    window.startEditor = function () {
        liveEdit = new LiveEdit('code', SysRuntime.getInstance());
    };

})(LiveEdit, SysRuntime);
