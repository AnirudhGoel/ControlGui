// var 
// var safariSubButton = $("#safariSubscribe");

// safariSubButton.on("click", function() {
//     console.log("Here");
//     pushNotification();
// });

// var pushNotification = function () {
//     console.log(window);

//     if ('safari' in window && 'pushNotification' in window.safari) {
//         var permissionData = window.safari.pushNotification.permission(pushId);
//         console.log(permissionData);
//         checkRemotePermission(permissionData);
//     } else {
//         alert("Push notifications not supported.");
//     }
// };

// var checkRemotePermission = function (permissionData) {
//     // "use strict";

//     if (permissionData.permission === 'default') {
//         console.log("The user is making a decision");
//         window.safari.pushNotification.requestPermission(
//             'https://pcald31.cern.ch',
//             pushId,
//             {},
//             checkRemotePermission
//         );
//     }
//     else if (permissionData.permission === 'denied') {
//         console.dir(arguments);
//     }

//     else if (permissionData.permission === 'granted') {
//         console.log("The user said yes, with token: "+ permissionData.deviceToken);

//         safariSubButton.text("Disable Push Messaging");
//     }
// };































$.widget('o2.apn', {
  options: {
    pushButton: undefined,
    result: undefined,
    jwtToken: undefined,
    preferencesForm: undefined,
    preferenceOptionsSection: undefined,
    pushId: "web.ch.cern.anirudh",
    preferenceOptions: ['Type A', 'Type B', 'Type C'],
    // Change these options and the default value of 'preferences' in DB to modify the preferences
    isSubscribed: false,
    swRegistration: null
  },

  _create: function() {
    if ('safari' in window && 'pushNotification' in window.safari) {
      // console.log('APNs is supported');
      document.createElement(this.options);
      // console.log(window);
      this.initialiseUI();

      this.options.preferencesForm.on('submit', (event) => {
        this.updateSubscriptionPreferences(event);
      });

      this.generatePreferencesOptions();
    } else {
      // console.warn('Push messaging is not supported');
      this.options.pushButton.text('APNs Not Supported');
      this.options.pushButton.css('display', 'none');

      return;
    }
  },

  // Initialises the UI according to user subscribed or not
  // These UI updates include updating the button
  // and showing or hiding the notification preferences section.
  initialiseUI: function() {
    console.log(this.options.pushButton);
    let permissionData = window.safari.pushNotification.permission(this.options.pushId);
    this.options.pushButton.on('click', () => {
      this.options.result.html('');
      this.options.pushButton.prop('disabled', true);
      if (this.options.isSubscribed) {
        this.unsubscribeUser();
      } else {
        this.subscribeUser(permissionData);
      }
    });




    if (permissionData.permission === 'granted') {
      this.options.isSubscribed = true;
      this.options.preferencesForm['0'].classList.remove('is-invisible');
      // this.getPreferences();
    }

    this.updateBtn();
  },

  // The preferences options on the web page are generated dynamically from this function
  generatePreferencesOptions: function() {
    let prefOptionsHTML = '';
    for (let i = 1; i <= this.options.preferenceOptions.length; i++) {
      prefOptionsHTML += '<input type="checkbox" id="type' + i +'">'
        + '<label for="type' + i + '">' + this.options.preferenceOptions[i-1] + '</label><br><br>';
    }

    this.options.preferenceOptionsSection.html(prefOptionsHTML);
  },

  // Updates the button according to user subscribed or not
  updateBtn: function() {
    if (this.options.isSubscribed) {
      this.options.pushButton.text('Disable Push Messaging');
    } else {
      this.options.pushButton.text('Enable Push Messaging');
    }

    this.options.pushButton.prop('disabled', false);
  },

  subscribeUser: function(permissionData) {
    if (permissionData.permission === 'default') {
      console.log("The user is making a decision");
      window.safari.pushNotification.requestPermission(
          'https://pcald31.cern.ch',
          this.options.pushId,
          {},
          this.subscribeUser
      );
    }
    else if (permissionData.permission === 'denied') {
      this.updateBtn();
      console.dir("Permission Denied.");
    }

    else if (permissionData.permission === 'granted') {
      console.log(this.document);
      console.log("The user said yes, with token: " + permissionData.deviceToken);

      // this.options.isSubscribed = true;

      // this.updateBtn();
    }
  },
});