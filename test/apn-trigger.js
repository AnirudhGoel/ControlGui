const argv = require('yargs').argv;
const mysql = require('mysql');
const config = require('./../config.json');
const log = require('./../log.js');
const con = mysql.createConnection({
  host: config.pushNotifications.host,
  user: config.pushNotifications.user,
  password: config.pushNotifications.password,
  database: config.pushNotifications.database
});

/*

To run this file, use command:

node test/notification-trigger.js --type <type> --title "<title>" --message "<message>"

Replace <type> with 1, 2 or 3.
(If more types are added then use the corresponding number)

<title> and <message> should be replaced by the Title and Message of notification respectively.

*/

con.connect(function(err) {
  if (err) {
    throw err;
  }
});

/**
 * Sends push notifications to subscribed users
 * @param {object} subscription - Subscription object with user endpoint
 * @param {string} dataToSend - String message to be sent in notification
 * @return {promise} webpush.sendNotification - Sends Notification
 */
function triggerPushMsg(subscription, dataToSend) {



  $.post('api.development.push.apple.com:443/3/device/1F9CF5FEFB37E53B2F3A06B6398FB6102F89D71F3505E0F951CA5AE502FD3B1D')








  return webpush.sendNotification(subscription, dataToSend)
    .catch((err) => {
      if (err.statusCode === 410) {
        return deleteSubscriptionFromDatabase(subscription.endpoint);
      } else {
        log.warn('Subscription is no longer valid: ', err);
      }
    });
}

/**
 * Deletes user subscriptions from Database
 * @param {string} endpoint - URL to identify each user
 * @return {promise}
 */
function deleteSubscriptionFromDatabase(endpoint) {
  let sql = 'DELETE FROM subscriptions WHERE endpoint = ?';

  return new Promise(function(resolve, reject) {
    con.query(sql, [endpoint], function(err, result) {
      if (err) {
        throw reject(err);
      }
      log.debug('Deleted successfully from database. endpoint: ', endpoint);
      resolve(true);
    });
  });
}

/**
 * Fetches subscriptions from Database
 * @return {promise}
 */
function getSubscriptions() {
  let sql = 'SELECT * FROM subscriptions';

  return new Promise(function(resolve, reject) {
    con.query(sql, function(err, result) {
      if (err) {
        throw reject(err);
      }
      resolve(result);
    });
  });
}

/**
 * Formats the subscription to a suitable format to be sent to 'web-push' server
 * @param {object} sub - Subscription object fetched from Database
 * @return {object} formattedSubscription - Subscription object reformatted
 */
function formatSubscription(sub) {
  let formattedSubscription = {
    'id': sub.sub_id,
    'endpoint': sub.endpoint,
    'keys': {
      'p256dh': sub.p256dh_key,
      'auth': sub.auth_key
    },
    'preferences': sub.preferences
  };
  return formattedSubscription;
}

/**
 * Fetches subscriptions from db then verifies them and sends notifications.
 * @return {promise}
 */
function sendNotif() {
  const type = argv.type;
  const dataToSend = {
    'title': argv.title,
    'message': argv.message
  };

  return getSubscriptions()
    .then(function(subscriptions) {
      let promiseChain = Promise.resolve();

      for (let i = 0; i < subscriptions.length; i++) {
        let subscription = subscriptions[i];
        subscription = formatSubscription(subscription);

        let pref = subscription.preferences.split('');

        if (pref[type - 1] == 1) {
          promiseChain = promiseChain.then(() => {
            return triggerPushMsg(subscription, JSON.stringify(dataToSend));
          });
        }
      }

      return promiseChain;
    })
    .then(() => {
      con.end();
    })
    .catch(function(err) {
      throw err;
    });
}
sendNotif();
