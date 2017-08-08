$.widget('o2.preferencesSection', {
  options: {
    preferencesForm: undefined,
    preferenceOptionsSection: undefined,
    preferenceOptions: ['Type A', 'Type B', 'Type C'],
    // Change these options and the default value of 'preferences' in DB to modify the preferences
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
  
  updateSubscriptionPreferences: function(event) {
    event.preventDefault();

    this.options.swRegistration.pushManager.getSubscription()
      .then((subscription) => {
        if (subscription) {
          let data = {
            endpoint: subscription.endpoint,
            preferences: this.compilePreferences()
          };

          return fetch('/api/update-preferences?token=' + this.options.jwtToken, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error('Couldn\'t update preferences');
              }
              this.options.result.html('<h3>Preferences Updated.</h3>');
              // console.log(response.body);
            });
        } else {
          // console.log('Error updating preferences: No subscription');
        }
      });
  },
  
  getPreferences: function() {
    this.options.swRegistration.pushManager.getSubscription()
      .then((subscription) => {
        if (subscription) {
          let data = {
            endpoint: subscription.endpoint
          };

          return fetch('/api/get-preferences?token=' + this.options.jwtToken, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          })
            .then((response) => {
              response.json()
                .then((data) => {
                  let preferences = data[0].preferences.split('');

                  if (preferences.length == this.options.preferenceOptions.length) {
                    for (let i = 1; i <= preferences.length; i++) {
                      (preferences[i-1] == 1) ? ($('#type' + i).prop('checked', true))
                        : ($('#type' + i).prop('checked', false));
                    }
                  } else {
                    throw new Error('Number of preferences on HTML page and Database don\'t match.'
                      + 'Please see the database structure.');
                  }
                });
            });
        } else {
          throw new Error('Error updating preferences: No subscription');
          // console.log('Error updating preferences: No subscription');
        }
      });
  },

  compilePreferences: function() {
    let preferences = '';

    for (let i = 1; i <= this.options.preferenceOptions.length; i++) {
      ($('#type' + i).prop('checked')) ? (preferences += 1) : (preferences += 0);
    }

    return preferences;
  }
});