/**
 * This file is used only during development, so that RequireJS and
 * its configuration could be loaded inside the worker using
 * importScripts. For production, the Jor1k worker along with
 * RequireJS is included directly during build.
 */

/*global importScripts, require*/
importScripts('../bower_modules/requirejs/require.js');
importScripts('require.config.js');
require.config({ baseUrl: '../' });

// see https://github.com/guybedford/amd-loader/issues/4
const window = self; // returns a reference to the WorkerGlobalScope

require(['cjs!jor1k/worker/worker']);
