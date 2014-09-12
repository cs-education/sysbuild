/* global $, Sammy, sysViewModel, marked */

window.Router = (function () {
    'use strict';
    var instance;

    function Router() {
        /* jshint newcap: false */
        var viewModel = sysViewModel;

        var populateChapters = function () {
            if (viewModel.chapters().length === 0) {
                $.getJSON('sysassets/sys.json', function (data) {
                    viewModel.chapters(data.chapters);
                });
            }
        };

        var getActivityFromIdx = function (chapterIdx, sectionIdx, activityIdx) {
            var chapter = viewModel.chapters()[chapterIdx];
            chapter = chapter || { sections: [] };
            var section = chapter.sections[sectionIdx];
            section = section || { activities: [] };
            var activity = section.activities[activityIdx];
            activity = activity || {};
            return activity;
        };

        return Sammy(function () {
            this.get('/', function () {
                populateChapters();
                viewModel.playgroundVisible(false);
                viewModel.showChapterIndex(true);
            });

            this.get('#chapter/:chapterIdx', function () {
                this.redirect('#chapter/' + this.params.chapterIdx + '/section/0/activity/0');
            });

            this.get('#chapter/:chapterIdx/section/:sectionIdx', function () {
                this.redirect('#chapter/' + this.params.chapterIdx + '/section/' + this.params.sectionIdx + '/activity/0');
            });

            this.get('#chapter/:chapterIdx/section/:sectionIdx/activity/:activityIdx', function () {
                var chapterIdx = this.params.chapterIdx,
                    sectionIdx = this.params.sectionIdx,
                    activityIdx = this.params.activityIdx;

                populateChapters();

                viewModel.currentChapter(chapterIdx);
                viewModel.currentSection(sectionIdx);
                viewModel.currentActivity(activityIdx);

                var activity = getActivityFromIdx(chapterIdx, sectionIdx, activityIdx);

                if (activity.type === 'play') {
                    $.get('sysassets/' + activity.docFile, function (doc) {
                        viewModel.showChapterIndex(false);
                        viewModel.setSysPlayGroundState({
                            challengeDoc: marked(doc),
                            gccOptions: activity.gccOptions,
                            programArgs: activity.programCommandLineArgs,
                            editorText: activity.code,
                            playgroundVisible: true
                        });
                    });
                } else if (activity.type === 'video') {
                    console.log('video!');
                }
            });
        });
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = new Router();
                instance.constructor = null;
            }
            return instance;
        }
    };
})();
