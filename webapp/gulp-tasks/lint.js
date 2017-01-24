import gulp from 'gulp';
import eslint from 'gulp-eslint';

function lintJs(files, options) {
  return () => {
    return gulp.src(files)
      .pipe(eslint(options))
      .pipe(eslint.format())
      .pipe(eslint.failAfterError());
  };
}

gulp.task('lint:js:src', lintJs('src/{app,components}/**/*.js'));
gulp.task('lint:js:test', lintJs('test/{app,components}/**/*.js', { envs: ['jasmine'] }));
gulp.task('lint:js:test:watch', () => {
    gulp.watch('test/{app,components}/**/*.js', ['lint:js:test']);
});

// TODO: Add linting for Sass/CSS and HTML (with Bootstrap support)

gulp.task('lint:src', ['lint:js:src']);
gulp.task('lint:test', ['lint:js:test']);
gulp.task('lint:test:watch', ['lint:js:test:watch']);
gulp.task('lint:gulptasks',
    lintJs(['gulpfile.babel.js', 'gulp-tasks/**/*.js'],
    { env: { node: true } }));

gulp.task('lint', ['lint:src', 'lint:test', 'lint:gulptasks']);
