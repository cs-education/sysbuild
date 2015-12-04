import es from 'event-stream';
import chalk from 'chalk';
import gulp from 'gulp';
import clean from 'gulp-clean';
import uglify from 'gulp-uglify';

import './gulp-tasks/build-js';
import './gulp-tasks/build-assets';
import './gulp-tasks/build-styles';
import './gulp-tasks/serve';
import './gulp-tasks/test';

// Removes all files from ./dist/
gulp.task('clean', () => {
    return gulp.src('./dist/**/*', { read: false })
        .pipe(clean());
});

// Copies the Jor1k Web Worker script file, the VM disk image, and the filesystem files
gulp.task('jor1k', () => {
    const workerJs = gulp.src('./src/bower_modules/jor1k/bin/jor1k-worker-min.js')
        .pipe(uglify({ preserveComments: 'some' }));
    const fsFiles = gulp.src('./src/bower_modules/jor1k/bin/{vmlinux.bin.bz2,basefs-compile.json,sysroot/**}');
    return es.concat(workerJs, fsFiles)
        .pipe(gulp.dest('./dist/bower_modules/jor1k/bin/'));
});

gulp.task('build', ['html', 'js', 'css:dist', 'fonts', 'images', 'extras', 'jor1k'], (callback) => {
    callback();
    console.log('\nPlaced optimized files in ' + chalk.magenta('dist/\n'));
});

gulp.task('default', (callback) => {
    callback();
    console.log('\nPlease specify a task: serve, test, clean, build, deploy\n');
});
