/* global ko, $ */

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
        self.editorText = ko.observable();

        self.gccErrorCount = ko.observable(0);
        self.gccWarningCount = ko.observable(0);
        self.gccOptions = ko.observable();
        self.gccOptsError = ko.observable('');

        self.programArgs = ko.observable();
        self.lastGccOutput = ko.observable('');

        self.compileStatus = ko.observable('Waiting');
        self.compileStatusClass = ko.pureComputed(function () {
            return 'label label-' + compileStatusToLabelClassMap[self.compileStatus()];
        });
        self.compileBtnEnable = ko.pureComputed(function () {
            return !(self.compileStatus() === 'Waiting' || self.compileStatus() === 'Compiling');
        });
        self.compileBtnTooltip = ko.observable();

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

        self.availableAceThemes = ko.observableArray(['monokai', 'terminal', 'tomorrow', 'xcode']);
        self.aceTheme = ko.observable(self.availableAceThemes()[0]);
        self.aceFontSize = ko.observable();

        self.ttyContainer = $('#tty-container');
        self.ttyFullScreen = ko.observable(false);
        self.ttyFullScreen.subscribe(function (newTTYFullScreenStatus) {
            if (newTTYFullScreenStatus) {
                self.ttyContainer.appendTo('body');
            } else {
                self.ttyContainer.appendTo('#tty-pane');
            }
        });
        self.ttyToggleBtnClass = ko.pureComputed(function () {
            return 'glyphicon ' + (self.ttyFullScreen() ? 'glyphicon-resize-small' : 'glyphicon-resize-full');
        });

        self.openManPageTabs = ko.observableArray();
        self.closeManPageTab = function (tab) {
            var index = self.openManPageTabs.indexOf(tab);
            var previousTabContentSelector;
            if (index >= 1) {
                previousTabContentSelector = '#man-page-tab-' + (index - 1);
            } else {
                previousTabContentSelector = '#man-pages-index';
            }
            $('a[href="' + previousTabContentSelector + '"]').parent().addClass('active');
            $(previousTabContentSelector).addClass('active');

            self.openManPageTabs.splice(index, 1);
        };
    }

    SysViewModel.prototype.setState = function (state) {
        state = state || {};

        if (state.challengeDoc) {
            this.challengeDoc(state.challengeDoc);
        }
        if (state.gccOptions) {
            this.gccOptions(state.gccOptions);
        }
        if (state.programArgs) {
            this.programArgs(state.programArgs);
        }
        if (state.editorText) {
            this.editorText(state.editorText);
        }
    };

    return SysViewModel;
})();
