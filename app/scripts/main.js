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

});
