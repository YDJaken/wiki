/* eslint-disable */
(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function () {
                (i[r].q = i[r].q || []).push(arguments)
            }, i[r].l = 1 * new Date();
    a = s.createElement(o),
            m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
/* eslint-enable */

/* global ga */
function configFieldObject() {
    var fieldObject = 'auto';
    if (!window.cookiesEnabled) {
        // disable cookie storage
        fieldObject = {
            storage: 'none'
        };
        // anonymize IP
        ga('set', 'anonymizeIp', true);
    }
    return fieldObject;
}

window.trackPageView = function () {
    ga('create', 'UA-30040272-1', configFieldObject());
    ga('send', 'pageview');
};

window.trackReleaseDownload = function (tag, label) {
    if (label === undefined) {
        label = 'downloaded-' + tag;
    }

    ga('create', 'UA-30040272-1', configFieldObject());
    ga('send', {
        hitType: 'event',
        eventCategory: 'Release Downloads',
        eventAction: tag,
        eventLabel: label
    });
};

$(document).ready(function () {
    window.trackPageView();
});
