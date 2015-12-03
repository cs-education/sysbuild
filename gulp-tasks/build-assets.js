import gulp from 'gulp';
import htmlreplace from 'gulp-html-replace';

// Copies index.html, replacing <script> and <link> tags to reference production URLs
gulp.task('html', () => {
    return gulp.src('./src/index.html')
        .pipe(htmlreplace({
            'css': 'styles.css',
            'js': 'scripts.js'
        }))
        .pipe(gulp.dest('./dist/'));
});
