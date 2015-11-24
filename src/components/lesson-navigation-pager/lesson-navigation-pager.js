import ko from 'knockout';
import templateMarkup from 'text!./lesson-navigation-pager.html';

class LessonNavigationPager {
    constructor(params) {
        var activityData = params.activityData(),
            currentChapter = activityData.chapter,
            currentChapterIdx = currentChapter.index,
            currentSection = activityData.section,
            currentSectionIdx = currentSection.index,
            currentActivity = activityData.activity,
            currentActivityIdx = currentActivity.index;

        this.currentSectionName = currentSection.name;

        this.prevActivityUrl = ko.pureComputed(() => {
            var prevSection = currentChapter ? currentChapter.sections[currentSectionIdx - 1] : null,
                prevSectionNumActivities = prevSection ? prevSection.activities.length : 1,
                prevSectionIdx = currentSectionIdx,
                prevActivityIdx = currentActivityIdx - 1;

            if (prevActivityIdx < 0) {
                prevSectionIdx -= 1;
                prevActivityIdx = prevSectionNumActivities - 1;
            }

            return `#chapter/${currentChapterIdx}/section/${prevSectionIdx}/activity/${prevActivityIdx}`;
        });

        this.nextActivityUrl = ko.pureComputed(() => {
            var numActivities = currentSection ? currentSection.activities.length : 1,
                nextSectionIdx = currentSectionIdx,
                nextActivityIdx = currentActivityIdx + 1;

            if (nextActivityIdx >= numActivities) {
                nextSectionIdx += 1;
                nextActivityIdx = 0;
            }

            return `#chapter/${currentChapterIdx}/section/${nextSectionIdx}/activity/${nextActivityIdx}`;
        });
    }

    dispose() {
        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
    }
}

export default { viewModel: LessonNavigationPager, template: templateMarkup };
