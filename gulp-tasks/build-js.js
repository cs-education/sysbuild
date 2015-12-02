import fs from 'fs';
import vm from 'vm';
import merge from 'deeply';
import objectAssign from 'object-assign';

import gulp from 'gulp';
import rjs from 'gulp-requirejs-bundler';
import uglify from 'gulp-uglify';
import clean from 'gulp-clean';
import BabelTranspiler from './babel-transpiler';

// Config
const requireJsRuntimeConfig = vm.runInNewContext(fs.readFileSync('src/app/require.config.js') + '; require;'),
      requireJsOptimizerConfig = merge(requireJsRuntimeConfig, {
        out: 'scripts.js',
        baseUrl: './src',
        name: 'app/startup',
        paths: {
            requireLib: 'bower_modules/requirejs/require'
        },
        include: [
            'requireLib',
            'components/nav-bar/nav-bar',
            'components/home-page/home',
            'text!components/about-page/about.html',
            'components/lessons-page/lessons-page',
            'components/activity-page/activity-page',
            'components/video-activity-page/video-activity-page',
            'components/lesson-navigation-pager/lesson-navigation-pager',
            'components/copyright-line/copyright-line',
            'components/play-activity-page/play-activity-page',
            'components/playground-layout/playground-layout',
            'components/editor/editor',
            'components/editor-pane/editor-pane',
            'components/compiler-controls/compiler-controls',
            'components/editor-compiler-tab/editor-compiler-tab',
            'components/manpages-search-tab/manpages-search-tab',
            'components/manpage-tab/manpage-tab',
            'components/video-search-tab/video-search-tab',
            'components/playground-doc-pane/playground-doc-pane',
            'components/playground-term-pane/playground-term-pane',
            'components/playground-footer/playground-footer',
            'components/vm-state-label/vm-state-label',
            'components/compiler-state-label/compiler-state-label',
            'components/not-found-page/not-found-page'
        ],
        insertRequire: ['app/startup'],
        bundles: {
            // If you want parts of the site to load on demand, remove them from the 'include' list
            // above, and group them into bundles here.
            // 'bundle-name': [ 'some/module', 'another/module' ],
            // 'another-bundle-name': [ 'yet-another-module' ]
        }
    });

// Pushes all the source files through Babel for transpilation
gulp.task('js:babel', () => {
    return gulp.src(requireJsOptimizerConfig.baseUrl + '/**')
        .pipe((new BabelTranspiler('src')).stream())
        .pipe(gulp.dest('./temp'));
});

// Discovers all AMD dependencies, concatenates together all required .js files, minifies them
gulp.task('js:optimize', ['js:babel'], () => {
    var config = objectAssign({}, requireJsOptimizerConfig, { baseUrl: 'temp' });
    return rjs(config)
        .pipe(uglify({ preserveComments: 'some' }))
        .pipe(gulp.dest('./dist/'));
});

// Builds the distributable .js files by calling Babel then the r.js optimizer
gulp.task('js', ['js:optimize'], () => {
    // Now clean up
    return gulp.src('./temp', { read: false }).pipe(clean());
});
