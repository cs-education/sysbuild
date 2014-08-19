/* global compileMain, ko */

$(document).ready(function () {
    'use strict';

    compileMain.initLayout();
    compileMain.startEditor();

    var ViewModel = function () {
        var self = this;

        self.gccErrorCount = ko.observable(0);
        self.gccWarningsCount = ko.observable(0);
        self.gccOptions = ko.observable('-lm -Wall -fmax-errors=10 -Werror -Wextra');
        self.programArgs = ko.observable('hello world');
    };

    ko.applyBindings(new ViewModel());
});
