import ko from 'knockout';

class Lessons {
    constructor() {
        this.chapters = ko.observableArray([]);
        $.getJSON('https://cs-education.github.io/sysassets/sys.min.json', (data) => {
            this.chapters(data.chapters);
        });
    }

    getActivity(chapterIdx, sectionIdx, activityIdx) {
        var chapter = this.chapters()[chapterIdx];
        if (!chapter) return null;

        var section = chapter.sections[sectionIdx];
        if (!section) return null;

        var activity = section.activities[activityIdx];
        if (!activity) return null;

        return ko.utils.extend(activity, {
            chapter: {
                name: chapter.name,
                description: chapter.description
            },
            section: {
                name: section.name
            }
        });
    }
}

export default (new Lessons());
