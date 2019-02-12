'use strict';
function checkCookie(name) {
    return document.cookie.match('(^|;+\\s*)' + name + '\\s*=');
}

function setCookie(name) {
    document.cookie = name + '=true'
        + ';Path=/'
        + ';max-age=' + 60*60*24*30*6; // 6 months
}

(function (window, document) {
    var cookieName = 'cesiumjs.orgCookiePermissions';
    var cookiesEnabled = (checkCookie(cookieName) !== null);

    if (!cookiesEnabled) {
        $(document).ready(function () {
            $('.footer-cookies').show();
            $('#confirm-cookies').on('click', function (e) {
                e.preventDefault();
                $('.footer-cookies').hide();

                setCookie(cookieName);
                window.cookiesEnabled = true;
                window.trackPageView();
            });
        });
    }

    window.cookiesEnabled = cookiesEnabled;
})(window, document);