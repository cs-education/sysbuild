import es from 'event-stream';
import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sourcemaps from 'gulp-sourcemaps';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import replace from 'gulp-replace';
import concat from 'gulp-concat';

gulp.task('sass', () => {
    // main.scss imports all other style files
    return gulp.src('src/styles/main.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass.sync({
            outputStyle: 'expanded',
            precision: 10,
            includePaths: ['.']
        }).on('error', sass.logError))
        .pipe(autoprefixer({browsers: ['last 1 version']}))
        .pipe(sourcemaps.write())
        .pipe(concat('styles.css')) // rename file
        .pipe(gulp.dest('src/'))
});

// Copies fonts
gulp.task('fonts', () => {
    const bootstrapFonts = gulp.src('./src/bower_modules/components-bootstrap/fonts/*', { base: './src/bower_modules/components-bootstrap/' }),
          notific8Fonts = gulp.src('./src/bower_modules/jquery-notific8/dist/fonts/*', { base: './src/bower_modules/jquery-notific8/dist/' });
    return es.concat(bootstrapFonts, notific8Fonts)
        .pipe(gulp.dest('./dist/'));
});

// Rewrites relative paths to fonts, copies CSS file
gulp.task('css', ['sass'], () => {
    return gulp.src('src/styles.css')
        .pipe(replace(/url\((')?\.\.\/fonts\//g, 'url($1fonts/'))
        .pipe(gulp.dest('./dist/'));
});
