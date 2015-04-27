/* global ko, $, SysRuntime */

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
            'Warnings': 'default-light',
            'Failed': 'default-light'
        };

        var vmStateToLabelClassMap = {
            'Stopped': 'danger',
            'Booting': 'warning',
            'Running': 'success',
            'Paused': 'default'
        };

        var warningNotific8Options = {
            life: 5000,
            theme: 'ruby',
            icon: 'exclamation-triangle'
        };

        var busyNotific8Options = {
            life: 5000,
            theme: 'lemon',
            icon: 'info-circled'
        };

        var confirmNotific8Options = {
            life: 5000,
            theme: 'lime',
            icon: 'check-mark-2'
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
            var ready = !(self.compileStatus() === 'Waiting' || self.compileStatus() === 'Compiling');
            if (ready) {
                $.notific8('The compiler is now online', confirmNotific8Options);
            } else {
                $.notific8('The compiler is currently busy', busyNotific8Options);
            }
            return ready;
        });
        self.compileBtnTooltip = ko.observable();

        self.errorWarningLabel = ko.pureComputed(function () {
            var errors = self.gccErrorCount(),
                warnings = self.gccWarningCount(),
                str = '';
            str += errors ? '<span class="compile-status-label-text-error">' + (errors + ' error' + (errors > 1 ? 's ' : '')) + (warnings ? '' : '\u2026') + '</span>' : '';
            str += warnings ? '&nbsp;<span class="compile-status-label-text-warning">' + (warnings + ' warning' + (warnings > 1 ? 's' : '')) + '\u2026' + '</span>' : '';
            if (!str && self.showErrorWarningLabel()) {
                // the compilation failed but error/warning count is not available
                str = '<span class="compile-status-label-text-error">' + self.compileStatus() + '\u2026' + '</span>';
            }
            return str;
        });
        self.showErrorWarningLabel = ko.pureComputed(function () {
            var busy = (self.compileStatus() === 'Warnings' || self.compileStatus() === 'Failed');
            if (busy) {
                $.notific8('There were errors or warnings during compilation', warningNotific8Options);
            }
            return busy;
        });

        self.vmState = ko.observable('Stopped');
        self.vmStateClass = ko.pureComputed(function () {
            return 'label label-' + vmStateToLabelClassMap[self.vmState()];
        });

        self.availableAceThemes = ko.observableArray(['monokai', 'terminal', 'tomorrow', 'xcode']);
        self.aceTheme = ko.observable(self.availableAceThemes()[0]);
        self.aceFontSize = ko.observable();

        self.ttyContainer = $('#tty-container');
        self.ttyContainerTwo = $('#tty-container-two');
        self.currentTTYContainer = self.ttyContainer;
        self.ttyFullScreen = ko.observable(false);
        self.ttyFullScreen.subscribe(function (newTTYFullScreenStatus) {
            if (newTTYFullScreenStatus) {
                self.ttyContainer.appendTo('body');
                self.ttyContainerTwo.appendTo('body');
            } else {
                self.ttyContainer.appendTo('#tty-pane');
                self.ttyContainerTwo.appendTo('#tty-pane');
            }
            SysRuntime.getInstance().focusTerm(self.isPrimaryTTY() ? 'tty0' : 'tty1');
        });
        self.isPrimaryTTY = ko.observable(true);
        self.isPrimaryTTY.subscribe(function (newFrontTTY) {
            self.currentTTYContainer.hide();
            if (newFrontTTY) {
                self.currentTTYContainer = self.ttyContainer;
                SysRuntime.getInstance().focusTerm('tty0');
            } else {
                self.currentTTYContainer = self.ttyContainerTwo;
                SysRuntime.getInstance().focusTerm('tty1');
            }
            self.currentTTYContainer.show();
        });
        self.ttyToggleBtnClass = ko.pureComputed(function () {
            return 'glyphicon ' + (self.ttyFullScreen() ? 'glyphicon-resize-small' : 'glyphicon-resize-full');
        });

        self.ttySwitchBtnClass = ko.pureComputed(function () {
            return 'glyphicon ' + (self.isPrimaryTTY() ? 'glyphicon-chevron-right' : 'glyphicon-chevron-left');
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
