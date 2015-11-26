/* global ko, $, marked, SysRuntime */

window.SysViewModel = (function () {
    'use strict';
    var instance;

    function SysViewModel() {
        var self = this;

        

        self.challengeDoc = ko.observable('');
        self.editorText = ko.observable('');


        self.gccOptions = ko.observable('');
        self.gccOptsError = ko.observable('');

        self.programArgs = ko.observable('');
        self.lastGccOutput = ko.observable('');





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
