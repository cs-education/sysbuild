
window.Preferences = (function () {
    'use strict';
    var instance;
    var namedinstances = [];

    function Preferences() {
        var self = this;

        // check if local storage supported
        try {
            self.useLocalStorage = (localStorage !== 'undefined');
        } catch (e) {
            // error accessing local storage (user may have blocked access)
            console.log(e);
            self.useLocalStorage = false;
        }
    }

    Preferences.prototype.setItem = function (key, value) {
        if (this.useLocalStorage) {
            try {
                localStorage.setItem(key, value);
            } catch (e) {
                // error modifying local storage (out of space?)
                console.log(e);
            }
        }
    };

    Preferences.prototype.getItem = function (key, defaultValue) {
        if (this.useLocalStorage) {
            try {
                var result = localStorage.getItem(key);
                return (result !== null ? result : defaultValue);
            } catch (e) {
                // error reading from local storage
                console.log(e);
                return defaultValue;
            }
        } else {
            return defaultValue;
        }
    };

    Preferences.prototype.removeItem = function (key) {
        if (this.useLocalStorage) {
            try {
                localStorage.removeItem(key);
            } catch (e) {
                // error modifying local storage
                console.log(e);
            }
        }
    };

    Preferences.prototype.clear = function () {
        if (this.useLocalStorage) {
            try {
                localStorage.clear();
            } catch (e) {
                // error modifying local storage
                console.log(e);
            }
        }
    };

    function NamedPreferences(namespace, preferenceManager) {
        var self = this;
        self.manager = preferenceManager;
        self.prefix = 'preferences/' + namespace;
    }

    NamedPreferences.prototype.setItem = function (key, value) {
        this.manager.setItem(this.prefix + '/' + key, value);
    };

    NamedPreferences.prototype.getItem = function (key, defaultValue) {
        return this.manager.getItem(this.prefix + '/' + key, defaultValue);
    };

    NamedPreferences.prototype.removeItem = function (key) {
        this.manager.removeItem(this.prefix + '/' + key);
    };

    return {
        getInstance: function (namespace) {
            if (!instance) {
                instance = new Preferences();
                instance.constructor = null;
            }
            if (!namedinstances[namespace]) {
                namedinstances[namespace] = new NamedPreferences(namespace, instance);
            }
            return namedinstances[namespace];
        }
    };
})();
