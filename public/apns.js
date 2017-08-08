var pushId = "web.ch.cern.anirudh";

console.log($("#subscribe"));

$("#subscribe").on("click", function() {
    console.log("Here");
    pushNotification();
});

var pushNotification = function () {
    console.log(window);

    if ('safari' in window && 'pushNotification' in window.safari) {
        var permissionData = window.safari.pushNotification.permission(pushId);
        console.log(permissionData);
        checkRemotePermission(permissionData);
    } else {
        alert("Push notifications not supported.");
    }
};

var checkRemotePermission = function (permissionData) {
    // "use strict";

    if (permissionData.permission === 'default') {
        console.log("The user is making a decision");
        window.safari.pushNotification.requestPermission(
            'https://pcald31.cern.ch',
            pushId,
            {},
            checkRemotePermission
        );
    }
    else if (permissionData.permission === 'denied') {
        console.dir(arguments);
    }

    else if (permissionData.permission === 'granted') {
        console.log("The user said yes, with token: "+ permissionData.deviceToken);
    }
};