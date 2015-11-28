/* global ko, $, marked, SysRuntime */

window.SysViewModel = (function () {
    'use strict';
    var instance;

    function SysViewModel() {
        
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
