import path from 'path';
import gulp from 'gulp';
import { Server as KarmaServer } from 'karma';

// Karma Gulp tasks adapted from https://github.com/karma-runner/gulp-karma
const karmaConfPath = path.join(__dirname, '..', 'test', 'karma.conf.js');

/**
 * Run test once and exit
 */
gulp.task('test', ['lint:test'], (done) => {
  new KarmaServer({
    configFile: karmaConfPath,
    singleRun: true
  }, done).start();
});

/**
 * Run test once on PhantomJS and exit
 */
gulp.task('test:headless', ['lint:test'], (done) => {
  new KarmaServer({
    configFile: karmaConfPath,
    browsers: ['PhantomJS'],
    singleRun: true
  }, done).start();
});

/**
 * Watch for file changes and re-run tests on each change
 */
gulp.task('tdd', ['lint:test:watch'], (done) => {
  new KarmaServer({
    configFile: karmaConfPath
  }, done).start();
});
