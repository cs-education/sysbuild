/* global LiveEdit, SysRuntime, sysViewModel */

window.compileMain = (function () {
    'use strict';

    var liveEdit; // The single IDE

    // GLOBAL FUNCTIONS : UI glue
    var compileButtonClicked = function () {
        var code =  liveEdit.getCodeText();
        var gccOptions = sysViewModel.gccOptions();
        liveEdit.runCode(code, gccOptions);
        return false;
    };

    var setEditorTheme = function (theme) {
        liveEdit.setTheme(theme);
    };

    var startEditor = function () {
        liveEdit = new LiveEdit('code', SysRuntime.getInstance());
    };

    return {
        startEditor: startEditor,
        compileButtonClicked: compileButtonClicked,
        setEditorTheme: setEditorTheme
    };

})();
