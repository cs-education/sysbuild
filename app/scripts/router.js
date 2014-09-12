/* global $, Sammy, sysViewModel */

window.Router = (function () {
    'use strict';
    var instance;

    function Router() {
        /* jshint newcap: false */
        var viewModel = sysViewModel;

        return Sammy(function () {
            this.get('/', function () {
                viewModel.setSysPlayGroundState({playgroundVisible: false});
                $.getJSON('sysassets/sys.json', function (data) {
                    viewModel.chapters(data.chapters);
                    viewModel.showChapterIndex(true);
                });
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

                viewModel.currentChapter(chapterIdx);
                viewModel.currentSection(sectionIdx);
                viewModel.currentActivity(activityIdx);

                var chapter = viewModel.chapters()[chapterIdx];
                chapter = chapter || { sections: [] };
                var section = chapter.sections[sectionIdx];
                section = section || { activities: [] };
                var activity = section.activities[activityIdx];
                activity = activity || {};

                console.log(activity);
                if (activity.type === 'play') {
                    console.log('playground!');
                    viewModel.showChapterIndex(false);
                    viewModel.setSysPlayGroundState({playgroundVisible: true});
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
