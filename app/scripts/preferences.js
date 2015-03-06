
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

        self.setItem = function (key, value) {
            if (self.useLocalStorage) {
                try {
                    localStorage.setItem(key, value);
                } catch (e) {
                    // error modifying local storage (out of space?)
                    console.log(e);
                }
            }
        };

        self.getItem = function (key, defaultValue) {
            if (self.useLocalStorage) {
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

        self.removeItem = function (key) {
            if (self.useLocalStorage) {
                try {
                    localStorage.removeItem(key);
                } catch (e) {
                    // error modifying local storage
                    console.log(e);
                }
            }
        };

        self.clear = function () {
            if (self.useLocalStorage) {
                try {
                    localStorage.clear();
                } catch (e) {
                    // error modifying local storage
                    console.log(e);
                }
            }
        };
    }

    function NamedPreferences(namespace, preferenceManager) {
        var self = this;
        var manager = preferenceManager;
        var prefix = namespace;

        self.setItem = function (key, value) {
            manager.setItem(prefix + '/' + key, value);
        };

        self.getItem = function (key, defaultValue) {
            return manager.getItem(prefix + '/' + key, defaultValue);
        };

        self.removeItem = function (key) {
            manager.removeItem(prefix + '/' + key);
        };
    }

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
