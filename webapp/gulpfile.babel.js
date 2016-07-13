import fs from 'fs';
import cp from 'child_process';
import es from 'event-stream';
import chalk from 'chalk';
import gulp from 'gulp';
import clean from 'gulp-clean';
import size from 'gulp-size';

import './gulp-tasks/build-js';
import './gulp-tasks/build-assets';
import './gulp-tasks/build-styles';
import './gulp-tasks/serve';
import './gulp-tasks/test';
import './gulp-tasks/lint';
import './gulp-tasks/deploy';

// Run by Travis CI
gulp.task('ci', ['lint'], () => {
    gulp.start('test:headless');
});

// Removes all files from ./dist/
gulp.task('clean', () => {
    return gulp.src('./dist/**/*', { read: false })
        .pipe(clean());
});

gulp.task('build', ['lint', 'html', 'js', 'js:browserFS', 'css:dist', 'fonts', 'images', 'extras'], () => {
    console.log('\nPlaced optimized files in ' + chalk.magenta('dist/\n'));
    const buildStampFile = 'dist/build-stamp.txt';
    const recentCommitsFile = 'dist/publish-recentcommits.txt';

    const s = size({ title: 'dist' });
    const buildStamp = gulp.src('dist/**/*').pipe(s).on('end', () => {
        fs.writeFileSync(buildStampFile, `Build date: ${(new Date()).toUTCString()}\nBuilt size: ${s.prettySize}\n`);
        console.log('Build stamp written to ' + chalk.magenta(buildStampFile));
    });

    const recentCommitLog = cp.exec('git log -n 5 --oneline', (err, stdout) => {
        if (err) throw err;
        fs.writeFileSync(recentCommitsFile, stdout);
        console.log('Log of recent commits in distribution written to ' + chalk.magenta(recentCommitsFile));
    }).stdout;

    return es.concat(buildStamp, recentCommitLog);
});

gulp.task('default', (callback) => {
    callback();
    console.log('\nPlease specify a task: serve, test, clean, build, deploy\n');
});
