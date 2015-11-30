import * as babelCore from 'babel-core';
import slash from 'slash';
import path from 'path';
import objectAssign from 'object-assign';
import url from 'url';

const transpilationConfig = {
        root: 'src',
        skip: ['bower_modules/**', 'app/require.config.js'],
        babelConfig: {
            modules: 'amd',
            sourceMaps: 'inline'
        }
    },
    babelIgnoreRegexes = transpilationConfig.skip.map((item) => babelCore.util.regexify(item));

export function babelTranspile(pathname, callback) {
    pathname = slash(pathname);
    if (babelIgnoreRegexes.some((re) => re.test(pathname))) return callback();
    if (!babelCore.canCompile(pathname)) return callback();
    var src  = path.join(transpilationConfig.root, pathname);
    var opts = objectAssign({ sourceFileName: '/source/' + pathname }, transpilationConfig.babelConfig);
    babelCore.transformFile(src, opts, callback);
}

export function babelConnectMiddleware(req, res, next) {
    var pathname = path.normalize(url.parse(req.url).pathname);
    babelTranspile(pathname, (err, result) => {
       if (err) {
           next(err);
       } else if (result) {
           res.setHeader('Content-Type', 'application/javascript');
           res.end(result.code);
       } else {
           next();
       }
    });
};
