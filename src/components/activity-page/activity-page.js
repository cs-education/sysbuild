import ko from 'knockout';
import templateMarkup from 'text!./activity-page.html';
import * as lesson from 'app/lessons'

const activityTypeToComponentNameMap = {
    'video': 'video-activity-page',
    'play': 'play-activity-page'
};

class ActivityPage {
    constructor(params) {
        var activity = lesson.getActivity(params.chapterIdx, params.sectionIdx, params.activityIdx);
        if (!activity) {
            this.activityComponent = '404'; // TODO
        } else {
            this.activityComponent = activityTypeToComponentNameMap[activity.type];
            this.activityParams = activity;
        }
    }

    dispose() {
        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
    }
}

export default { viewModel: ActivityPage, template: templateMarkup };
