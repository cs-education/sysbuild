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

        var populateCurrentNavigation = function (chapterIdx, sectionIdx, activityIdx) {
            var chapter = viewModel.chapters()[chapterIdx];
            chapter = chapter || { sections: [] };
            var section = chapter.sections[sectionIdx];
            section = section || { activities: [] };
            var activity = section.activities[activityIdx];
            activity = activity || {};

            viewModel.currentChapterIdx(chapterIdx);
            viewModel.currentChapter(chapter);

            viewModel.currentSectionIdx(sectionIdx);
            viewModel.currentSection(section);

            viewModel.currentActivityIdx(activityIdx);
            viewModel.currentActivity(activity);
        };

        var goToChapterIndex = function () {
            stopVideo();
            viewModel.shownPage('chapter_index');
        };

        var goToPlayGround = function (playActivity) {
            stopVideo();

            var cb = function (doc) {
                viewModel.setSysPlayGroundState({
                    challengeDoc: marked(doc),
                    gccOptions: playActivity.gccOptions || '',
                    programArgs: playActivity.programCommandLineArgs || '',
                    editorText: playActivity.code || ''
                });

                viewModel.shownPage('playground');
            };

            if (playActivity.docFile) {
                $.get('sysassets/' + playActivity.docFile, function (doc) {
                    cb(doc);
                });
            } else {
                cb('');
            }
        };

        var stopVideo = function () {
            if ($('#lesson-video').length > 0) {
                videojs('lesson-video').dispose();
            }
        };

        var goToVideoLesson = function (videoActivity) {
            var cb = function (doc) {
                viewModel.shownPage('video');

                var currentVideoFilePrefix = 'sysassets/' + videoActivity.file;
                viewModel.currentVideoFilePrefix(currentVideoFilePrefix);
                viewModel.currentVideoTopics(videoActivity.topics || '');
                viewModel.currentVideoDoc(marked(doc));

                var $video = $('<video>').attr('id', 'lesson-video').
                    addClass('video-js vjs-default-skin vjs-big-play-centered');

                if ($('#lesson-video').length > 0) {
                    videojs('lesson-video').dispose();
                }

                $('#lesson-video-container').width(960).append($video);

                videojs('lesson-video', {
                    controls: true,
                    preload: 'none',
                    width: 960,
                    height: 540,
                    poster: ''
                }, function () {
                    this.src([
                        { type: 'video/mp4', src: currentVideoFilePrefix + '.mp4' },
                        { type: 'video/webm', src: currentVideoFilePrefix + '.webm' },
                        { type: 'video/ogg', src: currentVideoFilePrefix + '.ogv' }
                    ]);
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
                populateChapters();
                populateCurrentNavigation(this.params.chapterIdx, this.params.sectionIdx, this.params.activityIdx);

                var activity = viewModel.currentActivity();

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
