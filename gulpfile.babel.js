import chalk from 'chalk';
import gulp from 'gulp';
import clean from 'gulp-clean';
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

gulp.task('build', ['html', 'js', 'css:dist', 'fonts', 'images', 'extras'], (callback) => {
    callback();
    console.log('\nPlaced optimized files in ' + chalk.magenta('dist/\n'));
});

gulp.task('default', (callback) => {
    callback();
    console.log('\nPlease specify a task: serve, test, clean, build, deploy\n');
});
