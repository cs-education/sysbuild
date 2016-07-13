/* global require */
/* eslint quotes: [2, "double"], quote-props: 0 */
require.config({
    baseUrl: ".",
    paths: {
        // RequireJS plugins
        "text": "bower_modules/requirejs-text/text",
        "cjs": "bower_modules/cjs/cjs",
        "amd-loader": "bower_modules/amd-loader/amd-loader",

        // Library/external dependencies
        "bootstrap": "bower_modules/bootstrap-sass/assets/javascripts/bootstrap.min",
        "modernizr": "bower_modules/modernizr/modernizr",
        "crossroads": "bower_modules/crossroads/dist/crossroads.min",
        "hasher": "bower_modules/hasher/dist/js/hasher.min",
        "jquery": "bower_modules/jquery/dist/jquery",
        "knockout": "bower_modules/knockout/dist/knockout",
        "knockout-projections": "bower_modules/knockout-projections/dist/knockout-projections",
        "signals": "bower_modules/js-signals/dist/signals.min",
        "marked": "bower_modules/marked/marked.min",
        "videojs": "bower_modules/videojs/dist/video.min",
        "jquery-ui": "bower_modules/jquery-ui/jquery-ui.min",
        "jquery-ui-layout": "bower_modules/jquery-ui-layout/source/stable/jquery.layout_and_plugins.min",
        "jquery-fullscreen": "bower_modules/jquery-fullscreen/jquery.fullscreen-min",
        "jquery-notific8": "bower_modules/jquery-notific8/dist/jquery.notific8.min",
        "ace": "bower_modules/ace/lib/ace",
        "typeahead-jquery": "bower_modules/typeahead.js/dist/typeahead.jquery.min",
        "bloodhound": "bower_modules/typeahead.js/dist/bloodhound.min", // exports window global "Bloodhound"
        "FileSaver": "bower_modules/FileSaver/FileSaver.min", // exports window global "saveAs"
        "Blob": "bower_modules/Blob/Blob", // exports window global "Blob"
        "bootstrap-contextmenu": "bower_modules/bootstrap-contextmenu/bootstrap-contextmenu",
        "bootbox": "bower_modules/bootbox.js/bootbox",
        "github-api": "bower_modules/github-api/github",
        "jszip": "bower_modules/jszip/dist/jszip.min",

        // Application-specific modules
        "app/config": "app/config/config.dev", // overridden to 'config.dist' in build config
        "js-base64": "app/github-int/github-base64",
        "xmlhttprequest": "app/github-int/github-xmlhttpreq",
    },
    shim: {
        "github-api": {},
        "bootstrap": { deps: ["jquery"] },
        "jquery-ui": { deps: ["jquery"] },
        "jquery-ui-layout": { deps: ["jquery", "jquery-ui"] },
        "jquery-fullscreen": { deps: ["jquery"] },
        "typeahead-jquery": { deps: ["jquery"] },
        "bootbox": { deps: ["jquery"] },
        "bootstrap-contextmenu": { deps: ["bootstrap"] },
    },
    packages: [
        {
            name: "jor1k",
            location: "bower_modules/jor1k/js",
        },
    ],
    map: {
        // The 'system.js' file in the jor1k worker source 'require()'s the 'or1k' and 'riscv'
        // directories to load 'or1k/index.js' and 'riscv/index.js', respectively. Such a require
        // call is supported in CommonJS environments, but not in AMD/RequireJS. The following
        // mapping rules convert the directory requires into the correct module IDs to be loaded.
        "jor1k/worker/system": {
            // the following rule ensures that require('./or1k') will load './or1k/index.js'
            "jor1k/worker/or1k": "jor1k/worker/or1k/index",

            // this following rule overrides the above rule when the 'jor1k/worker/or1k/index'
            // module ID is normalized, to prevent 'jor1k/worker/or1k/index' being incorrectly
            // mapped to 'jor1k/worker/or1k/index/index'
            "jor1k/worker/or1k/index": "jor1k/worker/or1k/index",

             // similar to above
            "jor1k/worker/riscv": "jor1k/worker/riscv/index",
            "jor1k/worker/riscv/index": "jor1k/worker/riscv/index",

            // the following rule prevents 'jor1k/worker/riscv/htif' from being incorrectly
            // mapped to 'jor1k/worker/riscv/index/htif'
            "jor1k/worker/riscv/htif": "jor1k/worker/riscv/htif",
        },
    },
});
