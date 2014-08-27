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

        self.challengeDoc = ko.observable('<p>Welcome to this tiny but fast linux virtual machine. Currently only Chrome is known to work. Other browsers will be supported in the future.</p>');

        self.gccErrorCount = ko.observable(0);
        self.gccWarningCount = ko.observable(0);
        self.gccOptions = ko.observable('-lm -Wall -fmax-errors=10 -Wextra');
        self.programArgs = ko.observable('');
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
            if(str) { str += '...';}
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
    }

    return SysViewModel;
})();
