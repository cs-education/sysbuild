/* global $, ko, saveAs, SysViewModel, Editor, LiveEdit, SysRuntime */

$(document).ready(function () {
    'use strict';
    /* jshint camelcase: false */

    var initLayout = function () {
        var mainLayout = $('#layout').layout({
            livePaneResizing: true,

            north__paneSelector: '#navbar-container',
            center__paneSelector: '#code-container',
            east__paneSelector: '#doc-tty-container',
            south__paneSelector: '#footer-container',

            // Hack to prevent editor toolbar from becoming too small.
            // Better is to figure out how to fire a media query upon resize
            center__minWidth: 700,

            east__size: '50%',
            spacing_open: 2,

            north__resizable: false,
            north__size: 33,
            north__spacing_open: 0,
            north__spacing_closed: 0,
            north__showOverflowOnHover: true,

            south__resizable: false,
            south__size: 29,
            south__spacing_open: 0
        });

        var ttyLayout = mainLayout.panes.east.layout({
            livePaneResizing: true,
            spacing_open: 2,

            north__paneSelector: '#doc-container',
            center__paneSelector: '#tty-pane',

            north__size: '25%'
        });

        return {
            mainLayout: mainLayout,
            ttyLayout: ttyLayout
        };
    };

    initLayout();

    window.sysViewModel = new SysViewModel();
    ko.applyBindings(window.sysViewModel);

    var editor = new Editor('code');
    var liveEdit = new LiveEdit(editor, SysRuntime.getInstance());

    $(window).resize(function() {
        editor.resize();
    });

    var compile = function () {
        var code = editor.getText();
        var gccOptions = window.sysViewModel.gccOptions();
        liveEdit.runCode(code, gccOptions);
    };

    var compileShortcut = { // used for text and for binding
        win: 'Ctrl-Return',
        mac: 'Command-Return'
    };

    var platform = (navigator.platform.match(/mac|win|linux/i) || ['other'])[0].toLowerCase(); // from ace editor
    var compileBtnTooltip = 'Compile and Run (' + (platform === 'mac' ? compileShortcut.mac.replace('Command', '\u2318') : compileShortcut.win) + ' in code editor)';
    window.sysViewModel.compileBtnTooltip(compileBtnTooltip);

    $('#compile-btn').click(function () {
        compile();
    });

    // Initialize Bootstrap tooltip and popover
    $('[data-toggle=tooltip]').tooltip();
    $('[data-toggle=popover]')
        .popover()
        .click(function (e) {
            e.preventDefault();
        });

    $('#editor-opts-container').find('form').submit(function (e) {
        e.preventDefault();
    });

    $('#download-file-btn').click(function () {
        var text = editor.getText();
        var blob = new Blob([text], {type: 'text/plain;charset=utf-8'});
        saveAs(blob, 'program.c');
    });

    $('#autoindent-code-btn').click(function () {
        editor.autoIndentCode();
    });

    editor.addKeyboardCommand(
        'compileAndRunShortcut',
        compileShortcut,
        compile
    );

    var setState = function (viewModel, codeEditor, state) {
        viewModel.challengeDoc(state.challengeDoc);
        viewModel.gccOptions(state.gccOptions);
        viewModel.programArgs(state.programArgs);
        codeEditor.setText(state.editorText);
        $(window).trigger('resize');
    };

    var setInitialState = function () {
        var state = {};
        state.challengeDoc = state.challengeDoc || {
            title: 'Welcome',
            instructions: 'Welcome to this tiny but fast linux virtual machine. ' +
                'Currently only Chrome is known to work. Other browsers will be supported in the future.'
        };

        state.gccOptions = state.gccOptions || '-lm -Wall -fmax-errors=10 -Wextra';
        state.programArgs = state.programArgs || '';
        state.editorText = state.editorText || '' +
            '/*Write your C code here*/\n' +
            '#include <stdio.h>\n' +
            '\n' +
            'int main() {\n' +
            '    printf("Hello world!\\n");\n' +
            '    return 0;\n' +
            '}\n' +
            '';

        setState(window.sysViewModel, editor, state);
    };

    setInitialState();
});
