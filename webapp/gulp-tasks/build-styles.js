import es from 'event-stream';
import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sourcemaps from 'gulp-sourcemaps';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import replace from 'gulp-replace';
import concat from 'gulp-concat';
import minifyCss from 'gulp-minify-css';

function compiledCssStream(options = {}) {
    // main.scss imports all other style files
    return gulp.src('src/styles/main.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass.sync({
            outputStyle: 'expanded',
            precision: 10,
            includePaths: ['src'],
            importer: (url, prev, done) => {
                let newUrl;
                if (options.sassImportPathModifier) {
                    newUrl = options.sassImportPathModifier(url, prev);
                } else {
                    newUrl = url;
                }
                return { file: newUrl };
            }
        }).on('error', sass.logError))
        .pipe(autoprefixer({ browsers: ['last 1 version'] }))
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
                if (url.slice(-4) === '.css') {
                    url = url.slice(0, -4);
                }
                return url;
            }
        })
        // rewrite relative links to Bootstrap fonts
        .pipe(replace(/url\((['"])?bower_modules\/bootstrap-sass\/assets\/fonts\/bootstrap\//g, 'url($1fonts/'))
        // jquery-notific8 font URLs are already as desired
        .pipe(minifyCss({ compatibility: '*' }))
        .pipe(gulp.dest('./dist/'));
});

// Copies fonts
gulp.task('fonts', () => {
    const bootstrapFonts = gulp.src('./src/bower_modules/bootstrap-sass/assets/fonts/bootstrap/*', { base: './src/bower_modules/bootstrap-sass/assets/fonts/bootstrap/' });
    const notific8Fonts = gulp.src('./src/bower_modules/jquery-notific8/dist/fonts/*', { base: './src/bower_modules/jquery-notific8/dist/fonts/' });
    // VideoJS font files do not need to be copied, because its stylesheet embeds the font using a Data-URI.
    return es.concat(bootstrapFonts, notific8Fonts)
        .pipe(gulp.dest('./dist/fonts/'));
});
