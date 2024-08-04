const PushNotifications = require("@pusher/push-notifications-server");

const beamsClient = new PushNotifications({
  instanceId: process.env.BEAMS_INSTANCE_ID,
  secretKey: process.env.BEAMS_SECRET_KEY,
});

function sendNotification(message, url = "/board") {
  return beamsClient.publishToInterests(["updates-info"], {
    web: {
      notification: {
        title: "Notification",
        body: message,
        icon: "https://routin.cloud/favicon.png",
        // Add the URL where you want users to be redirected
        data: { url },
      },
    },
  });
}

module.exports = { sendNotification };
