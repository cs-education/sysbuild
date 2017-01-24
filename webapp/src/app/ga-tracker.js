/* global ga */
const angraveOldProdGaWebPropertyId = 'UA-42515111-2';
const neelabhgOldProdGaWebPropertyId = 'UA-39700861-4';
const neelabhgStagingGaWebPropertyId = 'UA-39700861-5';
const neelabhgProdGaWebPropertyId = 'UA-39700861-6';

const getEnvironment = () => {
    const loc = window.location.hostname + window.location.pathname;
    let env;
    if (loc === 'cs-education.github.io/sys/') {
        env = 'prod';
    } else if (loc === 'angrave.github.io/sys/') {
        env = 'angraveprod';
    } else if (loc === 'cs-education.github.io/sys-staging/') {
        env = 'staging';
    } else {
        env = 'dev';
    }
    return env;
};

// Encapsulates Google Analytics tracking
class Tracker {
    constructor() {
        const env = getEnvironment();
        // Disable tracking if the opt-out cookie exists.
        if (document.cookie.indexOf('disableTracking=true') > -1) {
            this.disableTracking();
        }

        // Create the tracker objects
        if (env === 'prod') {
            ga('create', neelabhgProdGaWebPropertyId, 'auto', { name: 'neelabhgProd' });
        } else if (env === 'angraveprod') {
            ga('create', angraveOldProdGaWebPropertyId, 'auto', { name: 'angraveOldProd' });
            ga('create', neelabhgOldProdGaWebPropertyId, 'auto', { name: 'neelabhgOldProd' });
        } else if (env === 'staging') {
            ga('create', neelabhgStagingGaWebPropertyId, 'auto', { name: 'neelabhgStaging' });
        }

        if (env === 'dev') {
            this.debug = console.log.bind(console);
        } else {
            this.debug = () => {};
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
        const args = Array.prototype.slice.call(arguments);
        this.debug('Tracker#event:', args);
        args.unshift('event');
        ga(() => {
            ga.getAll().forEach(tracker => {
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
        const properties = {
            page: page || window.location.pathname + window.location.search + window.location.hash,
        };
        if (title) {
            properties.title = title;
        }
        this.debug('Tracker#pageview:', properties);
        ga(() => {
            ga.getAll().forEach((tracker) => {
                // See https://developers.google.com/analytics/devguides/collection/analyticsjs/single-page-applications#tracking_virtual_pageviews
                tracker.set(properties);
                tracker.send('pageview');
            });
        });
    }
}

// Tracker is meant to be used as a singleton
export default (new Tracker());
