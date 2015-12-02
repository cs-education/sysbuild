import ko from 'knockout';
import crossroads from 'crossroads';
import hasher from 'hasher';

// This module configures crossroads.js, a routing library. If you prefer, you
// can use any other routing library (or none at all) as Knockout is designed to
// compose cleanly with external libraries.
//
// You *don't* have to follow the pattern established here (each route entry
// specifies a 'page', which is a Knockout component) - there's nothing built into
// Knockout that requires or even knows about this technique. It's just one of
// many possible ways of setting up client-side routes.

class Router {
    constructor(config) {
        this.currentRoute = ko.observable({});

        // Configure Crossroads route handlers
        crossroads.addRoute('', (requestParams) => {
            this.currentRoute(ko.utils.extend(requestParams, { page: 'home-page' }));
        });

        crossroads.addRoute('about', (requestParams) => {
            this.currentRoute(ko.utils.extend(requestParams, { page: 'about-page' }));
        });

        crossroads.addRoute('lessons', (requestParams) => {
            this.currentRoute(ko.utils.extend(requestParams, { page: 'lessons-page' }));
        });

        crossroads.addRoute('chapter/{chapterIdx}', (requestParams) => {
            hasher.replaceHash(`chapter/${requestParams.chapterIdx}/section/0/activity/0`);
        });

        crossroads.addRoute('chapter/{chapterIdx}/section/{sectionIdx}', (requestParams) => {
            hasher.replaceHash(`chapter/${requestParams.chapterIdx}/section/${requestParams.sectionIdx}/activity/0`);
        });

        crossroads.addRoute('chapter/{chapterIdx}/section/{sectionIdx}/activity/{activityIdx}', (requestParams) => {
            this.currentRoute(ko.utils.extend(requestParams, { page: 'activity-page' }));
        });

        crossroads.addRoute('playground', (requestParams) => {
            this.currentRoute(ko.utils.extend(requestParams, { page: 'play-activity-page' }));
        });

        crossroads.bypassed.add(() => {
            this.currentRoute({ page: 'not-found-page' });
        });

        // Activate Crossroads
        crossroads.normalizeFn = crossroads.NORM_AS_OBJECT;
        hasher.initialized.add(hash => crossroads.parse(hash));
        hasher.changed.add(hash => crossroads.parse(hash));
        hasher.init();
    }
}

// Create and export router instance
var routerInstance = new Router();

export default routerInstance;
