/* global $, ko, saveAs, Bloodhound, SysViewModel, Editor, LiveEdit, SysRuntime, Router, videojs, videoPlayerConfig */

$(document).ready(function () {
    'use strict';
    /* jshint camelcase: false */



    var viewModel = SysViewModel.getInstance();
    var editor = new Editor('code');
    var liveEdit = new LiveEdit(editor, SysRuntime.getInstance());



    
});
