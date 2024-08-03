const PushNotifications = require('@pusher/push-notifications-server');

// Ensure to use environment variables here as well
const beamsClient = new PushNotifications({
  instanceId: process.env.BEAMS_INSTANCE_ID,
  secretKey: process.env.BEAMS_SECRET_KEY,
});

beamsClient.publishToInterests(['hello'], {
  web: {
    notification: {
      title: 'Hello',
      body: 'Hello, World!',
    },
  },
})
.then(response => {
  console.log('Notification sent successfully:', response);
})
.catch(error => {
  console.error('Failed to send notification:', error);
});
