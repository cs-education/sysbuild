/* global ace, sysViewModel */

window.Editor = (function () {
    'use strict';

    function Editor(editorDivId) {
        var self = this;
        self.viewModel = sysViewModel;

        self.editorDivId = editorDivId;
        self.aceEditor = ace.edit(editorDivId);
        self.setTheme(self.viewModel.aceTheme());
        self.viewModel.aceFontSize(12);
        self.setMode('c_cpp');

        // automatically change theme upon selection
        self.viewModel.aceTheme.subscribe(function () {
            self.setTheme(self.viewModel.aceTheme());
        });

        self.viewModel.aceFontSize.subscribe(function () {
            self.setFontSize(self.viewModel.aceFontSize() + 'px');
        });
    }

    Editor.prototype.setTheme = function (theme) {
        this.aceEditor.setTheme('ace/theme/' + theme);
    };

    Editor.prototype.getText = function() {
        return this.aceEditor.getSession().getValue();
    };

    Editor.prototype.setText = function (text) {
        return this.aceEditor.getSession().setValue(text);
    };

    /**
     * @param size A valid CSS font size string, for example '12px'.
     */
    Editor.prototype.setFontSize = function (size) {
        document.getElementById(this.editorDivId).style.fontSize = size;
    };

    Editor.prototype.setMode = function (mode) {
        this.aceEditor.getSession().setMode('ace/mode/' + mode);
    };

    Editor.prototype.beautify = function (beautifierFunc) {
        this.setText(beautifierFunc(this.getText()));
    };

    Editor.prototype.setAnnotations = function (annotations) {
        this.aceEditor.getSession().setAnnotations(annotations);
    };

    Editor.prototype.resize = function () {
        this.aceEditor.resize();
    };

    Editor.prototype.addKeyboardCommand = function (cmdName, keyBindings, execFunc) {
        this.aceEditor.commands.addCommand({
            name: cmdName,
            bindKey: keyBindings,
            exec: execFunc,
            readOnly: true // false if this command should not apply in readOnly mode
        });
    };

    return Editor;
})();
