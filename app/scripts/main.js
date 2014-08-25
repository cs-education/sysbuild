/* global $, ko, compileMain, SysViewModel */

$(document).ready(function () {
    'use strict';

    var initLayout = function () {
        /* jshint camelcase: false */
        var mainLayout = $('#layout').layout({
            livePaneResizing: true,

            north__paneSelector: '#navbar-container',
            center__paneSelector: '#doc-tty-container',
            east__paneSelector: '#code-container',
            south__paneSelector: '#footer-container',

            east__size: '50%',
            spacing_open: 2,

            north__resizable: false,
            north__size: 35,
            north__spacing_open: 0,
            north__showOverflowOnHover: true,

            south__resizable: true,
            south__size: 60,
            south__spacing_open: 0
        });

        var ttyLayout = mainLayout.panes.center.layout({
            livePaneResizing: true,
            spacing_open: 2,

            north__paneSelector: '#doc-container',
            center__paneSelector: '#tty',
            south__paneSelector: '#compile-opts-container',

            north__size: '25%',

            south__resizable: false,
            south__size: 28,
            south__spacing_open: 0
        });

        var codeLayout = mainLayout.panes.east.layout({
            livePaneResizing: true,
            spacing_open: 2,

            north__paneSelector: '#editor-tabs-bar',
            center__paneSelector: '#code',
            south__paneSelector: '#code-south-bar',

            north__resizable: false,
            north__size: 30,
            north__spacing_open: 0,

            south__resizable: false,
            south__size: 28,
            south__spacing_open: 0
        });

        return {
            mainLayout: mainLayout,
            ttyLayout: ttyLayout,
            codeLayout: codeLayout,
        };
    };

    initLayout();

    window.sysViewModel = new SysViewModel();
    ko.applyBindings(window.sysViewModel);

    compileMain.startEditor();
});
