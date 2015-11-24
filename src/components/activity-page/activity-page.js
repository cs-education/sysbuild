import ko from 'knockout';
import templateMarkup from 'text!./activity-page.html';
import lessons from 'app/lessons'

const activityTypeToComponentNameMap = {
    'video': 'video-activity-page',
    'play': 'play-activity-page'
};

class ActivityPage {
    constructor(params) {
        var [chapterIdx, sectionIdx, activityIdx] = [params.chapterIdx, params.sectionIdx, params.activityIdx].map((idx) => parseInt(idx));
        this.activityData = lessons.getActivityData(chapterIdx, sectionIdx, activityIdx);
        this.activityComponent = ko.pureComputed(() => {
            var activityDataObj = this.activityData();
            if (!activityDataObj)
                return { name: '404-page', params: {} }; // not implemented yet
            return {
                name: activityTypeToComponentNameMap[activityDataObj.activity.type],
                params: activityDataObj
            };
        });
    }

    dispose() {
        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
    }
}

export default { viewModel: ActivityPage, template: templateMarkup };
