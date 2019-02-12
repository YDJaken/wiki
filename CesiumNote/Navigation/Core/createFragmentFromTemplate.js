/*global define*/
define([
], function () {
    'use strict';

    var createFragmentFromTemplate = function (htmlString) {
        var holder = document.createElement('div');
        holder.innerHTML = htmlString;

        var fragment = document.createDocumentFragment();
        while (holder.firstChild) {
            fragment.appendChild(holder.firstChild);
        }

        return fragment;
    };

    return createFragmentFromTemplate;
});

