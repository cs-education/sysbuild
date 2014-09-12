/* global $, ko, saveAs, SysViewModel, Editor, LiveEdit, SysRuntime, Router */

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

    window.sysViewModel = new SysViewModel();
    var editor = new Editor('code');
    var liveEdit = new LiveEdit(editor, SysRuntime.getInstance());

    var manPageTokens = [
        { token: 'accept', display: 'accept(2)', url: 'http://man7.org/linux/man-pages/man2/accept.2.html' },
        { token: 'printf', display: 'printf(3)', url: 'http://man7.org/linux/man-pages/man3/printf.3.html' },
        { token: 'write', display: 'write(2)', url: 'http://man7.org/linux/man-pages/man2/write.2.html' },
        { token: 'select', display: 'select(2)', url: 'http://man7.org/linux/man-pages/man2/select.2.html' }
    ];

    var getManPage = function (manPageToken) {
        return {
            tabName: manPageToken.display,
            tabHtml: '<iframe style="width: 100%; height: 100%" src="' + manPageToken.url + '"></iframe>'
        };
    };

    manPageTokens.slice(0, 0).forEach(function (token) {
        window.sysViewModel.openManPageTabs.push(getManPage(token));
    });

    var resizeTabs = function () {
        window.setTimeout(function () {
            $('.tab-content').height(
                    $('#code-container').height() -
                    $('#editor-tabs-bar').height() -
                    5
            );
        }, 500);
    };

    $(window).resize(function() {
        editor.resize(500);
        resizeTabs();
    });

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        if ($(e.target).attr('href') === '#editor-container') {
            editor.resize();
        } else {
            resizeTabs();
        }
    });

    var compileShortcut = { // used for text and for binding
        win: 'Ctrl-Return',
        mac: 'Command-Return'
    };

    var platform = (navigator.platform.match(/mac|win|linux/i) || ['other'])[0].toLowerCase(); // from ace editor
    var compileBtnTooltip = 'Compile and Run (' +
        (platform === 'mac' ? compileShortcut.mac.replace('Command', '\u2318') : compileShortcut.win) +
        ' in code editor)';
    window.sysViewModel.compileBtnTooltip(compileBtnTooltip);

    var compile = function () {
        var code = editor.getText();
        var gccOptions = window.sysViewModel.gccOptions();
        liveEdit.runCode(code, gccOptions);
    };

    $('#compile-btn').click(function () {
        compile();
    });

    editor.addKeyboardCommand(
        'compileAndRunShortcut',
        compileShortcut,
        compile
    );

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

    var setInitialState = function () {
        var state = {};
        state.challengeDoc = state.challengeDoc ||
            '<h2>Welcome</h2>' +
            '<p>Welcome to this tiny but fast linux virtual machine. ' +
            'Currently only Chrome is known to work. Other browsers will be supported in the future.</p>';

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

        window.sysViewModel.setSysPlayGroundState(state);
    };

    setInitialState();
    ko.applyBindings(window.sysViewModel);
    Router.getInstance().run();

    window.sysViewModel.playgroundVisible.subscribe(function (playgroundVisible) {
        if (playgroundVisible) {
            if (!window.layouts) {
                window.layouts = initLayout();
            }
            $(window).trigger('resize');
        }
    });
});
