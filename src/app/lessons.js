import ko from 'knockout';

class Lessons {
    constructor() {
        this.chapters = ko.observableArray([]);
        $.getJSON('https://cs-education.github.io/sysassets/sys.min.json', (data) => {
            this.chapters(data.chapters);
        });
    }

    getActivityData(chapterIdx, sectionIdx, activityIdx) {
        // The chapters might not have been loaded when this function is called,
        // but we want the caller to get the activity once they are loaded.
        // So, we return a Knockout computed observable, which updates
        // automatically when the "chapters" observable changes.
        return ko.pureComputed(() => {
            var chapter = this.chapters()[chapterIdx];
            if (!chapter) return null;

            var section = chapter.sections[sectionIdx];
            if (!section) return null;

            var activity = section.activities[activityIdx];
            if (!activity) return null;

            return {
                chapter: ko.utils.extend(chapter, { index: chapterIdx }),
                section: ko.utils.extend(section, { index: sectionIdx }),
                activity: ko.utils.extend(activity, { index: activityIdx })
            };
        });
    }
}

export default (new Lessons());
