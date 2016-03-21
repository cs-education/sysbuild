/* Required for development only */
importScripts('../bower_modules/requirejs/require.js');
importScripts('require.config.js');
require.config({baseUrl: '../'});


// see https://github.com/guybedford/amd-loader/issues/4
var window = self; // returns a reference to the WorkerGlobalScope

require(['cjs!jor1k/worker/worker']);
