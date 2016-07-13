import es from 'event-stream';
import merge from 'deeply';
import objectAssign from 'object-assign';

import gulp from 'gulp';
import rjs from 'gulp-requirejs-bundler';
import uglify from 'gulp-uglify';
import clean from 'gulp-clean';
import BabelTranspiler from './babel-transpiler';

// Configuration for the RequireJS Optimizer
// https://requirejs.org/docs/optimization.html#options
const requireJsOptimizerBaseConfig = {
    mainConfigFile: 'src/app/require.config.js',
    baseUrl: './src',
    paths: {
        requireLib: 'bower_modules/requirejs/require',
        'app/config': 'app/config/config.dist'
    }
};

// The following list should contain build configuration for each
// separate JS output file we want to create. Each config object is
// merged with the base configuration defined above, then passed to
// the optimizer separately.
const requireJsOptimizerFilesConfig = [
    {
        // Main bundle
        out: 'scripts.js',
        name: 'app/startup',
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
            'components/not-found-page/not-found-page',
            'components/file-browser/file-browser',
            'ace/ext/modelist',
            'ace/mode/c_cpp',
            'ace/mode/makefile',
            'ace/theme/monokai',
            'ace/theme/terminal',
            'ace/theme/tomorrow',
            'ace/theme/xcode'
        ],
        insertRequire: ['app/startup']
    },
    {
        // Jor1k worker
        out: 'jor1k-worker.js',
        name: 'cjs!jor1k/worker/worker',
        include: [
            'app/require.config',
            'requireLib'
        ],
        insertRequire: ['cjs!jor1k/worker/worker']
    }
];

// Pushes all the source files through Babel for transpilation
gulp.task('js:babel', () => {
    return gulp.src(requireJsOptimizerBaseConfig.baseUrl + '/**')
        .pipe((new BabelTranspiler('src')).stream())
        .pipe(gulp.dest('./temp'));
});

// Discovers all AMD dependencies, concatenates together all required .js files, minifies them
gulp.task('js:optimize', ['js:babel'], () => {
    const baseConfig = objectAssign({}, requireJsOptimizerBaseConfig, { baseUrl: 'temp' });
    const optimizedFiles = requireJsOptimizerFilesConfig.map(config => rjs(merge(baseConfig, config)));
    return es.concat(optimizedFiles)
        .pipe(uglify({ preserveComments: 'some' }))
        .pipe(gulp.dest('./dist/'));
});

// Builds the distributable .js files by calling Babel then the r.js optimizer
gulp.task('js', ['js:optimize'], () => {
    // Now clean up
    return gulp.src('./temp', { read: false }).pipe(clean());
});

// Copy BrowserFS for synchronous loading
gulp.task('js:browserFS', () => {
   // Copy From Bower components to Dist Folder
   return gulp.src('./src/bower_modules/browserfs/dist/browserfs.min.js')
        .pipe(gulp.dest('./dist/'));
});
