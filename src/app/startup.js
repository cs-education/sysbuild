import 'jquery';
import 'bootstrap';
import ko from 'knockout';
import 'knockout-projections'
import * as router from './router';

// Components can be packaged as AMD modules, such as the following:
ko.components.register('nav-bar', { require: 'components/nav-bar/nav-bar' });
ko.components.register('home-page', { require: 'components/home-page/home' });

// ... or for template-only components, you can just point to a .html file directly:
ko.components.register('about-page', {
    template: { require: 'text!components/about-page/about.html' }
});

ko.components.register('lessons-page', { require: 'components/lessons-page/lessons-page' });
ko.components.register('activity-page', { require: 'components/activity-page/activity-page' });
ko.components.register('video-activity-page', { require: 'components/video-activity-page/video-activity-page' });
ko.components.register('lesson-navigation-pager', { require: 'components/lesson-navigation-pager/lesson-navigation-pager' });
ko.components.register('copyright-line', { require: 'components/copyright-line/copyright-line' });
ko.components.register('play-activity-page', { require: 'components/play-activity-page/play-activity-page' });
ko.components.register('playground-layout', { require: 'components/playground-layout/playground-layout' });
ko.components.register('editor', { require: 'components/editor/editor' });
ko.components.register('editor-pane', { require: 'components/editor-pane/editor-pane' });

ko.components.register('compiler-controls', { require: 'components/compiler-controls/compiler-controls' });

ko.components.register('editor-compiler-tab', { require: 'components/editor-compiler-tab/editor-compiler-tab' });

ko.components.register('manpages-search-tab', { require: 'components/manpages-search-tab/manpages-search-tab' });

// [Scaffolded component registrations will be inserted here. To retain this feature, don't remove this comment.]

// Start the application
ko.applyBindings({ route: router.currentRoute });
