/* global ko */

window.SysViewModel = (function () {
    'use strict';

    function SysViewModel() {
        var self = this;
        var compileStatusToLabelClassMap = {
            'Waiting': 'default',
            'Ready': 'success',
            'Compiling': 'primary',
            'Cancelled': 'default',
            'Success': 'success',
            'Warnings': 'warning',
            'Failed': 'danger'
        };

        var vmStateToLabelClassMap = {
            'Stopped': 'danger',
            'Booting': 'warning',
            'Running': 'success',
            'Paused': 'default'
        };

        self.challengeDoc = ko.observable();

        self.gccErrorCount = ko.observable(0);
        self.gccWarningCount = ko.observable(0);
        self.gccOptions = ko.observable();
        self.programArgs = ko.observable();
        self.lastGccOutput = ko.observable('');

        self.compileStatus = ko.observable('Waiting');
        self.compileStatusClass = ko.pureComputed(function () {
            return 'label label-' + compileStatusToLabelClassMap[self.compileStatus()];
        });
        self.compileBtnEnable = ko.pureComputed(function () {
            return !(self.compileStatus() === 'Waiting' || self.compileStatus() === 'Compiling');
        });

        self.errorWarningLabel = ko.pureComputed(function () {
            var errors = self.gccErrorCount(),
                warnings = self.gccWarningCount(),
                str = '';

            str += errors ? (errors + ' error' + (errors > 1 ? 's ' : ' ')) : '';
            str += warnings ? (warnings + ' warning' + (warnings > 1 ? 's' : '')) : '';
            if(str) { str += '\u2026'; }
            return str;
        });
        self.showErrorWarningLabel = ko.pureComputed(function () {
            return (self.compileStatus() === 'Warnings' || self.compileStatus() === 'Failed');
        });

        self.vmState = ko.observable('Stopped');
        self.vmStateClass = ko.pureComputed(function () {
            return 'label label-' + vmStateToLabelClassMap[self.vmState()];
        });
        self.vmMips = ko.observable(0);

        self.showLastGccOutput = function () {
            var output = self.lastGccOutput();
            if (output) { window.alert(output); }
        };

        self.availableAceThemes = ko.observableArray(['monokai', 'terminal', 'tomorrow', 'xcode']);
        self.aceTheme = ko.observable();
        self.aceFontSize = ko.observable();
    }

    return SysViewModel;
})();
