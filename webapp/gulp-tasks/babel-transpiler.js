import * as babelCore from 'babel-core';
import slash from 'slash';
import path from 'path';
import objectAssign from 'object-assign';
import url from 'url';
import es from 'event-stream';

class BabelTranspiler {
    constructor(root) {
        this.config = {
            root: root || 'src',
            skip: ['bower_modules/**', 'app/require.config.js', 'test/require.config.js', 'app/jor1k-worker-wrapper.js'],
            babelConfig: {
                plugins: ['add-module-exports', 'transform-es2015-modules-amd'],
                sourceMaps: 'inline'
            }
        };
        this.config.babelIgnoreRegexes = this.config.skip.map((item) => babelCore.util.regexify(item));
    }

    transpile(pathname, callback) {
        pathname = slash(pathname);
        if (this.config.babelIgnoreRegexes.some((re) => re.test(pathname))) return callback();
        if (!babelCore.util.canCompile(pathname)) return callback();
        const src = path.join(this.config.root, pathname);
        const opts = objectAssign({ sourceFileName: '/source/' + pathname }, this.config.babelConfig);
        babelCore.transformFile(src, opts, callback);
    }

    connectMiddleware() {
        return (req, res, next) => {
            const pathname = path.normalize(url.parse(req.url).pathname);
            this.transpile(pathname, (err, result) => {
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
    }

    stream() {
        /* eslint-disable array-callback-return */
        return es.map((data, cb) => {
            if (!data.isNull()) {
                this.transpile(data.relative, (err, res) => {
                    if (res) {
                        data.contents = new Buffer(res.code);
                    }
                    cb(err, data);
                });
            } else {
                cb(null, data);
            }
        });
    }
}

export default BabelTranspiler;
