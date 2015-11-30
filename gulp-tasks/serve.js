import gulp from 'gulp';
import connect from 'gulp-connect';
import { babelConnectMiddleware } from './babel-transpile';

// Starts a simple static file server that transpiles ES6 on the fly to ES5
gulp.task('serve:src', () => {
    return connect.server({
        root: 'src',
        middleware: (connect, opt) => {
            return [babelConnectMiddleware];
        }
    });
});

// After building, starts a trivial static file server
gulp.task('serve:dist', ['build'], () => {
    return connect.server({ root: './dist' });
});
