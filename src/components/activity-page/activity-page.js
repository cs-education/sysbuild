import ko from 'knockout';
import templateMarkup from 'text!./activity-page.html';
import lessons from 'app/lessons'

const activityTypeToComponentNameMap = {
    'video': 'video-activity-page',
    'play': 'play-activity-page'
};

class ActivityPage {
    constructor(params) {
        var activity = lessons.getActivity(params.chapterIdx, params.sectionIdx, params.activityIdx);
        this.activityComponent = ko.pureComputed(() => {
            var activityObj = activity();
            if (!activityObj)
                return { name: '404', params: {} };
            return {
                name: activityTypeToComponentNameMap[activityObj.type],
                params: activityObj
            };
        });
    }

    dispose() {
        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
    }
}

export default { viewModel: ActivityPage, template: templateMarkup };
