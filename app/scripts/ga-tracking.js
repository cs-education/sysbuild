/* global ga */

// A singleton encapsulating Google Analytics tracking
window.Tracker = (function () {
    'use strict';
    var instance;

    var angraveGaWebPropertyId = 'UA-42515111-2',
        neelabhgGaWebPropertyId = 'UA-39700861-4';

    var isProduction = function () {
        return window.location.hostname + window.location.pathname === 'angrave.github.io/sys/';
    };

    function Tracker() {
        // Disable tracking if the opt-out cookie exists or this is not a production application
        if (document.cookie.indexOf('disableTracking=true') > -1 || !isProduction()) {
            window['ga-disable-' + angraveGaWebPropertyId] = true;
            window['ga-disable-' + neelabhgGaWebPropertyId] = true;
        }

        // Load analytics.js from Google
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

        ga('create', angraveGaWebPropertyId, 'auto', {'name': 'angrave'});
        ga('create', neelabhgGaWebPropertyId, 'auto', {'name': 'neelabhg'});
    }

    Tracker.prototype.isTrackingEnabled = function () {
        return !(window['ga-disable-' + angraveGaWebPropertyId] && window['ga-disable-' + neelabhgGaWebPropertyId]);
    };

    // Opt-out function
    Tracker.prototype.optout = function () {
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/advanced
        document.cookie = 'disableTracking' + '=true; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/';
        window['ga-disable-' + angraveGaWebPropertyId] = true;
        window['ga-disable-' + neelabhgGaWebPropertyId] = true;
    };

    /**
     * Track an event. This function is a wrapper to the analytics.js event tracking implementation
     * See https://developers.google.com/analytics/devguides/collection/analyticsjs/events
     * for the parameters to this function.
     *
     * When calling this function, do not include the command and hit type parameters.
     * These parameters are automatically set to 'send' and 'event' respectively.
     */
    Tracker.prototype.trackEvent = function () {
        var args = Array.prototype.slice.call(arguments);
        args.unshift('angrave.send', 'event');
        ga.apply(null, args);
        args[0] = 'neelabhg.send';
        ga.apply(null, args);
    };

    /**
     * Track a page view
     * @param page optional If not set, the page will be set to the current path including the location hash
     * @param title optional If not set, the analytics.js library will
     *        set the title value using the document.title browser property
     */
    Tracker.prototype.trackPageView = function (page, title) {
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/pages
        var properties = {
            'page': page || window.location.pathname + window.location.search + window.location.hash
        };
        if (title) {
            properties['title'] = title;
        }
        ga('angrave.send', 'pageview', properties);
        ga('neelabhg.send', 'pageview', properties);
    };

    return {
        getInstance: function () {
            if (!instance) {
                instance = new Tracker();
                instance.constructor = null;
            }
            return instance;
        }
    };
})();
