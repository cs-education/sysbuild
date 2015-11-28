/* global ko, $, marked, SysRuntime */

window.SysViewModel = (function () {
    'use strict';
    var instance;

    function SysViewModel() {
        var self = this;

        self.shownPage = ko.observable();
        self.shownPage.subscribe(function (newPage) {
            if (newPage === 'playground') {
                $('body').css('overflow', 'hidden');
            } else {
                $('body').css('overflow', 'auto');
            }
        });
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = new SysViewModel();
                instance.constructor = null;
            }
            return instance;
        }
    };
})();
