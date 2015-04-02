/* global xdomain */
(function () {
    'use strict';

    xdomain.slaves({
        'http://cs-education.github.io': '/sysassets/proxy.html',
        'http://scowalt.com': '/sysassets/proxy.html'
    });

    xdomain.debug = false;
})();