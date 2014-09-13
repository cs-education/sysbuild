/* global $, Sammy, sysViewModel, marked, videojs */

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

        var goToChapterIndex = function () {
            viewModel.playgroundVisible(false);
            viewModel.showVideoLesson(false);
            viewModel.showChapterIndex(true);
        };

        var goToPlayGround = function (playActivity) {
            var cb = function (doc) {
                viewModel.showChapterIndex(false);
                viewModel.showVideoLesson(false);
                viewModel.setSysPlayGroundState({
                    challengeDoc: marked(doc),
                    gccOptions: playActivity.gccOptions || '',
                    programArgs: playActivity.programCommandLineArgs || '',
                    editorText: playActivity.code || '',
                    playgroundVisible: true
                });
            };

            if (playActivity.docFile) {
                $.get('sysassets/' + playActivity.docFile, function (doc) {
                    cb(doc);
                });
            } else {
                cb('');
            }
        };

        var goToVideoLesson = function (videoActivity) {
            var cb = function (doc) {
                viewModel.playgroundVisible(false);
                viewModel.showChapterIndex(false);
                viewModel.showVideoLesson(true);

                viewModel.currentVideoFilePrefix('sysassets/' + videoActivity.file);
                viewModel.currentVideoTopics(videoActivity.topics || '');
                viewModel.currentVideoDoc(marked(doc));

                videojs('lesson-video', {}, function () {

                });
            };

            if (videoActivity.docFile) {
                $.get('sysassets/' + videoActivity.docFile, function (doc) {
                    cb(doc);
                });
            } else {
                cb('');
            }
        };

        return Sammy(function () {
            this.get('/', function () {
                populateChapters();
                goToChapterIndex();
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
                    goToPlayGround(activity);
                } else if (activity.type === 'video') {
                    goToVideoLesson(activity);
                } else {
                    goToChapterIndex();
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
