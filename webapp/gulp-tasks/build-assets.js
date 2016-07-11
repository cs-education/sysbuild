import es from 'event-stream';
import gulp from 'gulp';
import htmlreplace from 'gulp-html-replace';
import minifyHtml from 'gulp-minify-html';

// Copies index.html, replacing <script> and <link> tags to reference production URLs
gulp.task('html', () => {
    const indexHtml = gulp.src('./src/index.html')
        .pipe(htmlreplace({
            css: 'styles.css',
            js: ['browserfs.min.js', 'scripts.js']
        }));

    const otherHtml = gulp.src('./src/404.html');

    return es.concat(indexHtml, otherHtml)
        .pipe(minifyHtml({ conditionals: true, loose: true }))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('images', () => {
    return gulp.src('src/images/**/*')
        .pipe(gulp.dest('dist/images'));
});

gulp.task('extras', () => {
    const remainingSrcFiles = gulp.src(['src/*.*', '!src/*.html', '!src/styles.css'], { dot: true });
    const documentation = gulp.src(['LICENSE.md', 'sys-gh-pages-config/README.md']);
    return es.concat(remainingSrcFiles, documentation)
        .pipe(gulp.dest('dist'));
});
