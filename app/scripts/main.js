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

    // Initialize Bootstrap tooltip and popover
    $('[data-toggle=tooltip]').tooltip();
    $('[data-toggle=popover]')
        .popover()
        .click(function (e) {
            e.preventDefault();
        });

    $('#editor-opts-container').find('form').submit(function (e) {
        e.preventDefault();
        e.stopPropagation();
    });

    $('#download-file-btn').click(function () {
        var text = editor.getText();
        var blob = new Blob([text], {type: 'text/plain;charset=utf-8'});
        saveAs(blob, 'program.c');
    });

    $('#autoindent-code-btn').click(function () {
        editor.autoIndentCode();
    });

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

    var videoSearch = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('title', 'snippet'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        limit: 10,
        prefetch: {
            url: 'https://cs-education.github.io/sysassets/transcriptions/transcription_index.min.json'
        }
    });
    videoSearch.initialize();

    var stopVideo = function () {
        if ($('#search-video').length > 0) {
            videojs('search-video').dispose();
        }
    };

    var loadVideo = function (resultVid) {
        var $video = $('<video>').attr('id', 'search-video').
            addClass('video-js vjs-default-skin vjs-big-play-centered');
        stopVideo();
        $('#search-video-container').width(640).append($video);
        var vid = videojs('search-video', {
                    controls: true,
                    preload: 'none',
                    width: 640,
                    height: 264,
                    poster: ''
                }, function () {
                    var videoURL = 'https://cs-education.github.io/sysassets/mp4/' + resultVid.source;
                    videoPlayerConfig.configure(this, videoURL, resultVid.source);
                });
        vid.currentTime(resultVid.startTime);
        vid.play();
    };

    var resultVideo = null;
    $('#video-search-typeahead').children('.typeahead').typeahead({
        highlight: true
    }, {
        displayKey: 'title',
        source: videoSearch.ttAdapter(),
        templates: {
            empty: [
                '<div class="empty-message">',
                'unable to find any video lessons that match the current query',
                '</div>'
            ].join('\n'),
            // Typeahead Docs (https://github.com/twitter/typeahead.js/blob/master/doc/jquery_typeahead.md#datasets):
            // "Note a precompiled template is a function that takes a JavaScript object as its first argument and returns a HTML string."
            // So instead of using some templating library, using a simple function to act as a compiled template
            suggestion: function (context) {
                return [
                    '<div>',
                        '<p><strong>' + context.title + '</strong><span class="pull-right"> Time ' + context.startTime + '</span>' + '</p>',
                        '<p>' + context.snippet + '</p>',
                    '</div>'
                ].join('\n');
            }
        }
    }).on('typeahead:selected typeahead:autocompleted', function (e, suggestion) {
        resultVideo = suggestion;
        //for now suggestion is a time for proof of concept purposes
        //eventually it'll suggest an actually line from the transcripts
    }).keypress(function (e) {
        if (e.which === 13) {
            // Enter key pressed
            loadVideo(resultVideo);
        } else {
            // User typed in something
            // Discard the last selected man page because it should be saved only when
            // the user autocompleted the typeahead hint or used a suggestion
            resultVideo = null;
        }
    }).keydown(function (e) {
        if (e.which === 8) {
            // Backspace pressed
            // keypress does not fire for Backspace in Chrome
            // (https://stackoverflow.com/questions/4690330/jquery-keypress-backspace-wont-fire)
            resultVideo = null;
        }
    });

    $('#video-search-btn').click(function () {
        loadVideo(resultVideo);
    });


});
