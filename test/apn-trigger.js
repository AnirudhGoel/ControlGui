// const argv = require('yargs').argv;
const mysql = require('mysql');
const config = require('./../config.json');
// const log = require('./../log.js');
const con = mysql.createConnection({
  host: config.pushNotifications.host,
  user: config.pushNotifications.user,
  password: config.pushNotifications.password,
  database: config.pushNotifications.database
});

con.connect(function(err) {
  if (err) {
    throw err;
  }
});

/**
 * Sends push notifications to subscribed users
 * @param {object} subscription - Subscription object with user endpoint
 * @param {string} dataToSend - String message to be sent in notification
 */
// function triggerPushMsg(subscription, dataToSend) {
//   $.post('api.development.push.apple.com:443/3/device/' +
//     '1F9CF5FEFB37E53B2F3A06B6398FB6102F89D71F3505E0F951CA5AE502FD3B1D');

//   return webpush.sendNotification(subscription, dataToSend)
//     .catch((err) => {
//       if (err.statusCode === 410) {
//         return deleteSubscriptionFromDatabase(subscription.endpoint);
//       } else {
//         log.warn('Subscription is no longer valid: ', err);
//       }
//     });
// }
