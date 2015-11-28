/* global $, ko, saveAs, Bloodhound, SysViewModel, Editor, LiveEdit, SysRuntime, Router, videojs, videoPlayerConfig */

$(document).ready(function () {
    'use strict';
    /* jshint camelcase: false */



    var viewModel = SysViewModel.getInstance();
    var editor = new Editor('code');
    var liveEdit = new LiveEdit(editor, SysRuntime.getInstance());



    var manPageTokens = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        limit: 10,
        prefetch: {
            url: 'https://cs-education.github.io/sysassets/man_pages/sys_man_page_index.min.json'
        }
    });
    manPageTokens.initialize();
    editor.setTokenHighlighter(manPageTokens, openManPage);



    var resizeTabs = function () {
        window.setTimeout(function () {
            $('.tab-content').height(
                $('#code-container').height() -
                $('#editor-tabs-bar').height() -
                5
            );
        }, 500);
    };

    $(window).resize(function () {
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
    viewModel.compileBtnTooltip(compileBtnTooltip);

    var compile = function () {
        var code = editor.getText();
        var gccOptions = viewModel.gccOptions();
        liveEdit.runCode(code, gccOptions);
    };

    $('#compile-btn').click(function () {
        compile();
    });

    editor.addKeyboardCommand(
        'compileAndRunShortcut',
        compileShortcut,
        compile,
        true // the compile command should work in readOnly mode
    );

    



    ko.applyBindings(viewModel);
    viewModel.shownPage.subscribe(function (newPage) {
        if (newPage === 'playground') {
            if (!window.layouts) {
                window.layouts = initLayout();
            }
            $(window).trigger('resize');
        }
    });

    Router.getInstance().run();

});
