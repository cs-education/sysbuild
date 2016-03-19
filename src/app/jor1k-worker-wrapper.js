/* Required for development only */

importScripts('require.config.js');
require.baseUrl = '../../';
importScripts('../bower_modules/requirejs/require.js');

// see https://github.com/guybedford/amd-loader/issues/4
var window = self; // returns a reference to the WorkerGlobalScope

require(['cjs!jor1k/worker/worker']);
