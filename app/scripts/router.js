/* global $, Sammy, sysViewModel */

window.Router = (function () {
    'use strict';

    function Router() {
        /* jshint newcap: false */
        var viewModel = sysViewModel;

        return Sammy(function () {
            this.get('', function() { this.app.runRoute('get', '#/') });
            this.get('#/', function () {
                viewModel.setSysPlayGroundState({playgroundVisible: false});
                $.getJSON('sysassets/sys.json', function (data) {
                    viewModel.chapters(data.chapters);
                    viewModel.showChapterIndex(true);
                });
            });
        });
    }

    var instance;
    return {
        getInstance: function () {
            if (!instance) {
                instance = new Router();
                instance.constructor = null;
            }
            return instance;
        }
    };
})();
