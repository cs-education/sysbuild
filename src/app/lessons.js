import ko from 'knockout';

class Lessons {
    constructor() {
        this.chapters = ko.observableArray([]);
        $.getJSON('https://cs-education.github.io/sysassets/sys.min.json', (data) => {
            this.chapters(data.chapters);
        });
    }
}

export default (new Lessons());
