/* global $, Sammy, SysViewModel, marked, videojs, videoPlayerConfig, Tracker */

window.Router = (function () {
    'use strict';
    var instance;

    function Router() {
        /* jshint newcap: false */
        var viewModel = SysViewModel.getInstance();

        var populateChapters = (function () {
            var previouslyFailed = false;
            return function () {
                var jqxhr;
                if (previouslyFailed) {
                    // Chapter load already failed, don't try again
                    jqxhr = {
                        done: function () {
                            return this;
                        },
                        fail: function (cb) {
                            if (cb) {
                                cb();
                            }
                            return this;
                        }
                    };
                } else if (viewModel.chapters().length === 0) {
                    // Load chapters
                    jqxhr = $.getJSON('http://cs-education.github.io/sysassets/sys.min.json', function (data) {
                        viewModel.chapters(data.chapters);
                    }).fail(function () {
                        // Getting file failed, don't try again
                        previouslyFailed = true;
                    });
                } else {
                    // Chapters have already been loaded, so request cannot fail
                    jqxhr = {
                        done: function (cb) {
                            if (cb) {
                                cb();
                            }
                            return this;
                        },
                        fail: function () {
                            return this;
                        }
                    };
                }
                return jqxhr;
            };
        })();

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

        var stopVideo = function () {
            if ($('#lesson-video').length > 0) {
                videojs('lesson-video').dispose();
            }
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
                viewModel.currentActiveTabIndex(-2); // Show code editor
                viewModel.openManPageTabs([]); // Close previously open man page tabs
                viewModel.shownPage('playground');
                viewModel.playGroundNavPagerVisible(true);
                Tracker.getInstance().trackPageView();
            };

            if (playActivity.docFile) {
                $.get('http://cs-education.github.io/sysassets/' + playActivity.docFile).done(cb).fail(function () {
                    cb(playActivity.doc || '');
                });
            } else {
                cb(playActivity.doc || '');
            }
        };

        var goToVideoLesson = function (videoActivity) {
            var cb = function (doc) {
                viewModel.shownPage('video');
                Tracker.getInstance().trackPageView();

                var currentVideoFilePrefix = 'https://cs-education.github.io/sysassets/' + videoActivity.file;
                viewModel.currentVideoFilePrefix(currentVideoFilePrefix);
                viewModel.currentVideoTopics(videoActivity.topics || '');
                viewModel.currentVideoDoc(marked(doc));

                var $video = $('<video>').attr('id', 'lesson-video').
                    addClass('video-js vjs-default-skin vjs-big-play-centered');

                stopVideo();
                $('#lesson-video-container').width(960).append($video);

                videojs('lesson-video', {
                    controls: true,
                    preload: 'none',
                    width: 960,
                    height: 540,
                    poster: ''
                }, function () {
                    // add the text track to the video
                    var videoName = videoActivity.file.replace('mp4/', '');
                    videoPlayerConfig.configure(this, currentVideoFilePrefix, videoName);
                });
            };

            if (videoActivity.docFile) {
                $.get('http://cs-education.github.io/sysassets/' + videoActivity.docFile).done(cb).fail(function () {
                    cb(videoActivity.doc || '');
                });
            } else {
                cb(videoActivity.doc || '');
            }
        };

        return Sammy(function () {
            this.get('/', function () {
                var self = this;

                /* Urls /, /# and /#/ are treated the same and trigger this route,
                 * but /# and /#/ have different location.hash values.
                 * So, if this route was triggered by going to /#/, the following statement
                 * changes the url to /#, so that a consistent page url can be used,
                 * especially when tracking page views.
                 */
                window.location.hash = '';

                populateChapters().done(function () {
                    stopVideo();
                    viewModel.currentChapterIdx(0);
                    viewModel.currentChapter(null);
                    viewModel.currentSectionIdx(0);
                    viewModel.currentSection(null);
                    viewModel.currentActivityIdx(0);
                    viewModel.currentActivity(null);
                    viewModel.shownPage('chapter_index');
                    Tracker.getInstance().trackPageView();
                }).fail(function () {
                    self.redirect('#playground');
                });
            });

            this.get('#chapter/:chapterIdx', function () {
                this.redirect('#chapter/' + this.params.chapterIdx + '/section/0/activity/0');
            });

            this.get('#chapter/:chapterIdx/section/:sectionIdx', function () {
                this.redirect('#chapter/' + this.params.chapterIdx + '/section/' + this.params.sectionIdx + '/activity/0');
            });

            this.get('#chapter/:chapterIdx/section/:sectionIdx/activity/:activityIdx', function () {
                var self = this;
                populateChapters().done(function () {
                    populateCurrentNavigation(self.params.chapterIdx, self.params.sectionIdx, self.params.activityIdx);
                    var activity = viewModel.currentActivity();
                    if (activity.type === 'play') {
                        goToPlayGround(activity);
                    } else if (activity.type === 'video') {
                        goToVideoLesson(activity);
                    } else {
                        self.redirect('#/');
                    }
                }).fail(function () {
                    self.redirect('#playground');
                });
            });

            this.get('#playground', function () {
                populateChapters();

                var playActivity = {};
                playActivity.doc =
                    '<h2>Welcome</h2>' +
                    '<p>Welcome to this tiny but fast linux virtual machine. ' +
                    'Currently only Chrome is known to work. Other browsers will be supported in the future.</p>';

                playActivity.gccOptions = '-lm -Wall -fmax-errors=10 -Wextra';
                playActivity.programCommandLineArgs = '';
                playActivity.code =
                    '/*Write your C code here*/\n' +
                    '#include <stdio.h>\n' +
                    '\n' +
                    'int main() {\n' +
                    '    printf("Hello world!\\n");\n' +
                    '    return 0;\n' +
                    '}\n' +
                    '';

                goToPlayGround(playActivity);
                viewModel.playGroundNavPagerVisible(false);
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
