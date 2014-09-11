/* global $, Sammy, sysViewModel */

window.Router = (function () {
    'use strict';

    function Router() {
        /* jshint newcap: false */
        var viewModel = sysViewModel;

        return Sammy(function () {

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
