/* global ko, $ */

window.SysViewModel = (function () {
    'use strict';
    var instance;

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

        self.challengeDoc = ko.observable('');
        self.editorText = ko.observable('');

        self.gccErrorCount = ko.observable(0);
        self.gccWarningCount = ko.observable(0);
        self.gccOptions = ko.observable('');
        self.gccOptsError = ko.observable('');

        self.programArgs = ko.observable('');
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
        self.currentActiveTabIndex = ko.observable(-2);
        self.closeManPageTab = function (tab) {
            var newActiveTabIndex = self.currentActiveTabIndex(),
                index = self.openManPageTabs.indexOf(tab);

            self.openManPageTabs.splice(index, 1);

            if (index <= newActiveTabIndex) {
                newActiveTabIndex = newActiveTabIndex - 1;
            }
            self.currentActiveTabIndex(newActiveTabIndex);

        };

        self.chapters = ko.observableArray([]);
        self.currentChapterIdx = ko.observable(0);
        self.currentChapter = ko.observable();

        self.currentSectionIdx = ko.observable(0);
        self.currentSection = ko.observable();

        self.currentActivityIdx = ko.observable(0);
        self.currentActivity = ko.observable();

        self.currentVideoFilePrefix = ko.observable();
        self.currentVideoTopics = ko.observable();
        self.currentVideoDoc = ko.observable();

        self.shownPage = ko.observable();
        self.shownPage.subscribe(function (newPage) {
            if (newPage === 'playground') {
                $('body').css('overflow', 'hidden');
            } else {
                $('body').css('overflow', 'auto');
            }
        });

        self.getNavUrlPrev = ko.pureComputed(function () {
            var currentChapter = self.currentChapter(),
                currentSectionIdx = parseInt(self.currentSectionIdx(), 10),
                currentActivityIdx = parseInt(self.currentActivityIdx(), 10),
                prevSection = currentChapter ? currentChapter.sections[currentSectionIdx - 1] : null,
                prevSectionNumActivities = prevSection ? prevSection.activities.length : 1,
                prevSectionIdx = currentSectionIdx,
                prevActivityIdx = currentActivityIdx - 1;

            if (prevActivityIdx < 0) {
                prevSectionIdx -= 1;
                prevActivityIdx = prevSectionNumActivities - 1;
            }

            return '#chapter/' + self.currentChapterIdx() +
                '/section/' + prevSectionIdx +
                '/activity/' + prevActivityIdx;
        });

        self.getNavUrlNext = ko.pureComputed(function () {
            var currentSection = self.currentSection(),
                currentSectionIdx = parseInt(self.currentSectionIdx(), 10),
                currentActivityIdx = parseInt(self.currentActivityIdx(), 10),
                numActivities = currentSection ? currentSection.activities.length : 1,
                nextSectionIdx = currentSectionIdx,
                nextActivityIdx = currentActivityIdx + 1;

            if (nextActivityIdx >= numActivities) {
                nextSectionIdx += 1;
                nextActivityIdx = 0;
            }

            return '#chapter/' + self.currentChapterIdx() +
                '/section/' + nextSectionIdx +
                '/activity/' + nextActivityIdx;
        });

        self.playGroundNavPagerVisible = ko.observable();
    }

    SysViewModel.prototype.setSysPlayGroundState = function (state) {
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

    return {
        getInstance: function () {
            if (!instance) {
                instance = new SysViewModel();
                instance.constructor = null;
            }
            return instance;
        }
    };
})();
