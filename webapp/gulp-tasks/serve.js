import gulp from 'gulp';
import connect from 'gulp-connect';
import BabelTranspiler from './babel-transpiler';

// Starts a simple static file server that transpiles ES6 on the fly to ES5
gulp.task('serve:src', ['css:watch'], () => {
    const root = 'src'; // this is relative to project root
    return connect.server({
        root: root,
        middleware: (connectInstance, opt) => {
            return [(new BabelTranspiler(root)).connectMiddleware()];
        }
    });
});

// Starts a simple static file server that transpiles ES6 on the fly to ES5
gulp.task('serve:test', ['lint:test:watch'], () => {
    const root = '.'; // this is relative to project root
    return connect.server({
        root: root,
        middleware: (connectInstance, opt) => {
            return [(new BabelTranspiler(root)).connectMiddleware()];
        }
    });
});

// Starts a trivial static file server
gulp.task('serve:dist', () => {
    return connect.server({ root: './dist' });
});

gulp.task('serve', ['serve:src']);
