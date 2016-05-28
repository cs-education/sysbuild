import ko from 'knockout';
import templateMarkup from 'text!./lesson-navigation-pager.html';

class LessonNavigationPager {
    constructor(params) {
        this.listCssClass = params.listCssClass;

        const activityData = params.activityData;
        const currentChapter = activityData.chapter;
        const currentChapterIdx = currentChapter.index;
        const currentSection = activityData.section;
        const currentSectionIdx = currentSection.index;
        const currentActivity = activityData.activity;
        const currentActivityIdx = currentActivity.index;

        this.currentSectionName = currentSection.name;

        this.prevActivityUrl = ko.pureComputed(() => {
            let prevSectionIdx = currentSectionIdx;
            let prevActivityIdx = currentActivityIdx - 1;

            if (prevActivityIdx < 0) {
                // we were already at first activity of current section,
                // so go to last activity of previous section
                prevSectionIdx -= 1;
                if (prevSectionIdx < 0) {
                    // we were already at first section of current chapter,
                    // so go to chapter listing
                    return '#lessons';
                }
                const prevSection = currentChapter.sections[prevSectionIdx];
                const prevSectionNumActivities = prevSection.activities.length;
                prevActivityIdx = prevSectionNumActivities - 1;
            }

            return `#chapter/${currentChapterIdx}/section/${prevSectionIdx}/activity/${prevActivityIdx}`;
        });

        this.nextActivityUrl = ko.pureComputed(() => {
            const currentSectionNumActivities = currentSection.activities.length;
            let nextSectionIdx = currentSectionIdx;
            let nextActivityIdx = currentActivityIdx + 1;

            if (nextActivityIdx >= currentSectionNumActivities) {
                // we were already at last activity of current section,
                // so go to first activity of next section
                nextSectionIdx += 1;
                const currentChapterNumSections = currentChapter.sections.length;
                if (nextSectionIdx >= currentChapterNumSections) {
                    // we were already at last section of current chapter,
                    // so go to chapter listing
                    return '#lessons';
                }
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
