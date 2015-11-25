// require.js looks for the following global when initializing
var require = {
    baseUrl: ".",
    paths: {
        "bootstrap":            "bower_modules/components-bootstrap/js/bootstrap.min",
        "crossroads":           "bower_modules/crossroads/dist/crossroads.min",
        "hasher":               "bower_modules/hasher/dist/js/hasher.min",
        "jquery":               "bower_modules/jquery/dist/jquery",
        "knockout":             "bower_modules/knockout/dist/knockout",
        "knockout-projections": "bower_modules/knockout-projections/dist/knockout-projections",
        "signals":              "bower_modules/js-signals/dist/signals.min",
        "text":                 "bower_modules/requirejs-text/text",
        "marked":               "bower_modules/marked/marked.min",
        "videojs":              "bower_modules/videojs/dist/video.min",
        "jquery-ui":            "bower_modules/jquery-ui/jquery-ui.min",
        "jquery-ui-layout":     "bower_modules/jquery-ui-layout/source/stable/jquery.layout_and_plugins.min",
        "ace":                  "bower_modules/ace-builds/src/",
        "typeahead-jquery":     "bower_modules/typeahead.js/dist/typeahead.jquery.min",
        "bloodhound":           "bower_modules/typeahead.js/dist/bloodhound.min" // TODO: this leaks a "Bloodhound" global
    },
    shim: {
        "bootstrap": { deps: ["jquery"] },
        "jquery-ui": { deps: ["jquery"] },
        "jquery-ui-layout": { deps: ["jquery", "jquery-ui"] },
        "typeahead-jquery": { deps: ["jquery"] }
    }
};
