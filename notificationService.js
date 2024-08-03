const PushNotifications = require('@pusher/push-notifications-server');

const beamsClient = new PushNotifications({
  instanceId: process.env.BEAMS_INSTANCE_ID,
  secretKey: process.env.BEAMS_SECRET_KEY,
});

function sendNotification(message) {
  return beamsClient.publishToInterests(['hello'], {
    web: {
      notification: {
        title: 'Notification',
        body: message,
      },
    },
  });
}

module.exports = { sendNotification };
