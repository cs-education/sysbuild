import gulp from 'gulp';
import ghPages from 'gulp-gh-pages';

gulp.task('deploy:staging', () => {
  return gulp.src('./dist/**/*')
    .pipe(ghPages({
        remoteUrl: 'https://github.com/cs-education/sys-staging',
        branch: 'gh-pages'
    }));
});

gulp.task('deploy:prod', () => {
  return gulp.src('./dist/**/*')
    .pipe(ghPages({
        remoteUrl: 'https://github.com/cs-education/sys',
        branch: 'gh-pages'
    }));
});

gulp.task('deploy:angraveprod', () => {
  return gulp.src('./dist/**/*')
    .pipe(ghPages({
        remoteUrl: 'https://github.com/angrave/sys',
        branch: 'gh-pages'
    }));
});

gulp.task('deploy', (callback) => {
    callback();
    console.log('\nPlease specify a target: staging, prod, angraveprod\n');
});
