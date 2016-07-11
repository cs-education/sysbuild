class Preferences {
    constructor() {
        // check if local storage supported
        try {
            this.useLocalStorage = (localStorage !== 'undefined');
        } catch (e) {
            // error accessing local storage (user may have blocked access)
            console.log(e);
            this.useLocalStorage = false;
        }
    }

    setItem(key, value) {
        if (this.useLocalStorage) {
            try {
                localStorage.setItem(key, value);
            } catch (e) {
                // error modifying local storage (out of space?)
                console.log(e);
            }
        }
    }

    getItem(key, defaultValue) {
        if (this.useLocalStorage) {
            try {
                const result = localStorage.getItem(key);
                return (result !== null ? result : defaultValue);
            } catch (e) {
                // error reading from local storage
                console.log(e);
                return defaultValue;
            }
        } else {
            return defaultValue;
        }
    }

    removeItem(key) {
        if (this.useLocalStorage) {
            try {
                localStorage.removeItem(key);
            } catch (e) {
                // error modifying local storage
                console.log(e);
            }
        }
    }

    clear() {
        if (this.useLocalStorage) {
            try {
                localStorage.clear();
            } catch (e) {
                // error modifying local storage
                console.log(e);
            }
        }
    }
}

class NamedPreferences {
    constructor(namespace, preferenceManager) {
        this.manager = preferenceManager;
        this.prefix = 'preferences/' + namespace;
    }

    setItem(key, value) {
        this.manager.setItem(this.prefix + '/' + key, value);
    }

    getItem(key, defaultValue) {
        return this.manager.getItem(this.prefix + '/' + key, defaultValue);
    }

    removeItem(key) {
        this.manager.removeItem(this.prefix + '/' + key);
    }
}

const instance = new Preferences();
const namedInstances = [];
export default {
    getPreferenceManager: (namespace) => {
        if (!namedInstances[namespace]) {
            namedInstances[namespace] = new NamedPreferences(namespace, instance);
        }
        return namedInstances[namespace];
    },
};
