import es from 'event-stream';
import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sourcemaps from 'gulp-sourcemaps';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import replace from 'gulp-replace';
import concat from 'gulp-concat';
import minifyCss from 'gulp-minify-css';

function compiledCssStream(options={}) {
    // main.scss imports all other style files
    return gulp.src('src/styles/main.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass.sync({
            outputStyle: 'expanded',
            precision: 10,
            includePaths: ['src'],
            importer: function (url, prev, done) {
                var newUrl;
                if (options.sassImportPathModifier)
                    newUrl = options.sassImportPathModifier(url, prev);
                else
                    newUrl = url;
                return { file: newUrl };
            }
        }).on('error', sass.logError))
        .pipe(autoprefixer({browsers: ['last 1 version']}))
        .pipe(sourcemaps.write())
        .pipe(concat('styles.css')); // rename file
}

gulp.task('css:src', () => {
    return compiledCssStream()
        .pipe(gulp.dest('src/'));
});

gulp.task('css:watch', ['css:src'], () => {
    gulp.watch('src/styles/**/*.scss', ['css:src']);
});

gulp.task('css:dist', () => {
    return compiledCssStream({
            sassImportPathModifier: (url, prev) => {
                // inline CSS imports
                if (url.slice(-4) === '.css')
                    url = url.slice(0, -4);
                return url;
            }
        })
        .pipe(replace(/url\((')?\.\.\/fonts\//g, 'url($1fonts/'))
        .pipe(minifyCss({compatibility: '*'}))
        .pipe(gulp.dest('./dist/'));
});

// Copies fonts
gulp.task('fonts', () => {
    const bootstrapFonts = gulp.src('./src/bower_modules/components-bootstrap/fonts/*', { base: './src/bower_modules/components-bootstrap/' }),
          notific8Fonts = gulp.src('./src/bower_modules/jquery-notific8/dist/fonts/*', { base: './src/bower_modules/jquery-notific8/dist/' });
    return es.concat(bootstrapFonts, notific8Fonts)
        .pipe(gulp.dest('./dist/'));
});
