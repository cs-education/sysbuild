import gulp from 'gulp';
import connect from 'gulp-connect';
import BabelTranspiler from './babel-transpiler';

// Starts a simple static file server that transpiles ES6 on the fly to ES5
gulp.task('serve:src', () => {
    var root = 'src'; // this is relative to project root
    return connect.server({
        root: root,
        middleware: (connect, opt) => {
            return [(new BabelTranspiler(root)).connectMiddleware()];
        }
    });
});

// Starts a simple static file server that transpiles ES6 on the fly to ES5
gulp.task('serve:test', () => {
    var root = '.'; // this is relative to project root
    return connect.server({
        root: root,
        middleware: (connect, opt) => {
            return [(new BabelTranspiler(root)).connectMiddleware()];
        }
    });
});

// After building, starts a trivial static file server
gulp.task('serve:dist', ['build'], () => {
    return connect.server({ root: './dist' });
});
