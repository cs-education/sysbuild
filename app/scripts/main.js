/* global $, ko, compileMain, SysViewModel */

$(document).ready(function () {
    'use strict';

    compileMain.initLayout();

    window.sysViewModel = new SysViewModel();
    ko.applyBindings(window.sysViewModel);
    compileMain.startEditor();
});
