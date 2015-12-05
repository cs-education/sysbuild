/* global ga */
const angraveOldProdGaWebPropertyId = 'UA-42515111-2',
      neelabhgOldProdGaWebPropertyId = 'UA-39700861-4',
      neelabhgStagingGaWebPropertyId = 'UA-39700861-5',
      neelabhgProdGaWebPropertyId = 'UA-39700861-6';

var getEnvironment = () => {
    var loc = window.location.hostname + window.location.pathname;
    if (loc === 'cs-education.github.io/sys/') {
        return 'prod';
    } else if (loc === 'angrave.github.io/sys/') {
        return 'angraveprod';
    } else if (loc === 'cs-education.github.io/sys-staging/') {
        return 'staging';
    } else {
        return 'dev';
    }
};

// Encapsulates Google Analytics tracking
class Tracker {
    constructor() {
        var env = getEnvironment();
        // Disable tracking if the opt-out cookie exists.
        if (document.cookie.indexOf('disableTracking=true') > -1) {
            this.disableTracking();
        }

        // Create the tracker objects
        if (env === 'prod') {
            ga('create', neelabhgProdGaWebPropertyId, 'auto', {'name': 'neelabhgProd'});
        } else if (env === 'angraveprod') {
            ga('create', angraveOldProdGaWebPropertyId, 'auto', {'name': 'angraveOldProd'});
            ga('create', neelabhgOldProdGaWebPropertyId, 'auto', {'name': 'neelabhgOldProd'});
        } else if (env === 'staging') {
            ga('create', neelabhgStagingGaWebPropertyId, 'auto', {'name': 'neelabhgStaging'});
        }
    }

    /**
     * Disable tracking on the current page
     * https://developers.google.com/analytics/devguides/collection/analyticsjs/advanced#optout
     */
    disableTracking() {
        window['ga-disable-' + angraveOldProdGaWebPropertyId] = true;
        window['ga-disable-' + neelabhgOldProdGaWebPropertyId] = true;
        window['ga-disable-' + neelabhgStagingGaWebPropertyId] = true;
        window['ga-disable-' + neelabhgProdGaWebPropertyId] = true;
    }

    isTrackingEnabled() {
        return !(window['ga-disable-' + angraveOldProdGaWebPropertyId] &&
                 window['ga-disable-' + neelabhgOldProdGaWebPropertyId] &&
                 window['ga-disable-' + neelabhgStagingGaWebPropertyId] &&
                 window['ga-disable-' + neelabhgProdGaWebPropertyId]);
    }

    optout() {
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/advanced#optout
        document.cookie = 'disableTracking' + '=true; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/';
        this.disableTracking();
    }

    /**
     * Track an event. This function is a wrapper to the analytics.js event tracking implementation
     * See https://developers.google.com/analytics/devguides/collection/analyticsjs/events
     * for the parameters to this function.
     *
     * When calling this function, do not include the command and hit type parameters.
     * These parameters are automatically set to 'send' and 'event' respectively.
     */
    trackEvent() {
        var args = Array.prototype.slice.call(arguments);
        args.unshift('event');
        ga(function () {
            ga.getAll().forEach(function (tracker) {
                tracker.send.apply(tracker, args);
            });
        });
    }

    /**
     * Track a page view
     * @param page optional If not set, the page will be set to the current path including the location hash
     * @param title optional If not set, the analytics.js library will
     *        set the title value using the document.title browser property
     */
    trackPageView(page, title) {
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/pages
        var properties = {
            page: page || window.location.pathname + window.location.search + window.location.hash
        };
        if (title) {
            properties.title = title;
        }
        ga(() => {
            ga.getAll().forEach((tracker) => {
                tracker.send('pageview', properties);
            });
        });
    }
}

// Tracker is meant to be used as a singleton
export default (new Tracker());
