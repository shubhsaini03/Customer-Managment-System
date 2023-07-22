/* Browser tests */
/* If you need something more robust, take a look at "Modernizr" */

tpt.browser = tpt.browser || {};

tpt.browser.supportsTransition = function (modifyClassIfTestFails) {
    "use strict";
    var test = function () {
        var elm = document.createElement("div");
        return !!(((elm.style.transition !== undefined) || (elm.style.webkitTransition !== undefined)) && (navigator.userAgent.indexOf("Android 2.") === -1));
    };
    var result = test();

    var classModifier = function (result) {
        if (result) {
            tpt.removeClass(document.documentElement, "noTransition");
        } else {
            tpt.addClass(document.documentElement, "noTransition");
        }
    };

    if (modifyClassIfTestFails) {
        classModifier(result);
    }

    tpt.browser.supportsTransition = function (modifyClassIfTestFails) {
        if (modifyClassIfTestFails) {
            classModifier(result);
        }
        return result;
    };

    return result;
};

tpt.browser.supportsTransform = function (modifyClassIfTestFails) {
    "use strict";
    var test = function () {
        var elm = document.createElement("div");
        return !!(((elm.style.transform !== undefined) || (elm.style.webkitTransform !== undefined)) && (navigator.userAgent.indexOf("Android 2.") === -1));
    };
    var result = test();

    var classModifier = function (result) {
        if (result) {
            tpt.removeClass(document.documentElement, "noTransform");
        } else {
            tpt.addClass(document.documentElement, "noTransform");
        }
    };

    if (modifyClassIfTestFails) {
        classModifier(result);
    }

    tpt.browser.supportsTransform = function (modifyClassIfTestFails) {
        if (modifyClassIfTestFails) {
            classModifier(result);
        }
        return result;
    };

    return result;
};
