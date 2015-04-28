/* global $ */
window.UIMux = (function () {
    'use strict';

    var instance;

    function UIMux() {
        var self = this;
        self.selectorLookup = [];
        self.panesLookup = [];
    }
    UIMux.prototype.uiElement  = function(selector) {
        return this.selectorLookup[selector];
    };

    UIMux.prototype.bindElement = function(selector, pane) {
        $(pane + ' .module').detach();
        console.log(selector);
        console.log(pane);
        if (this.uiElement(selector).parent() !== []) {
            this.uiElement(selector).detach();


        }
        this.uiElement(selector).appendTo(pane);

    };

    UIMux.prototype.uiMuxInit = function(selectors, panes, defaults) {
        //console.log(selectors);
        for (var i = 0; i < selectors.length; i++) {
            this.selectorLookup[selectors[i]] = $(selectors[i].selector);
        }
        for (i = 0; i < panes.length; i++) {
            this.panesLookup[panes[i]] = $(panes[i]);
        }
        console.log(this.selectorLookup);

        for (i = 0; i < defaults.length; i++) {
            //this.bindElement(defaults[i], panes[i]);
        }

    };

    return {
        getInstance: function() {
            if (!instance) {
                instance = new UIMux();
                instance.constructor = null;
            }
            return instance;
        }
    };
})();


