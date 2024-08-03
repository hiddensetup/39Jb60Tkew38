document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  const sendMessageButton = document.getElementById('sendMessageButton');

  if (registerForm) {
    registerForm.addEventListener('submit', async function(event) {
      event.preventDefault();
      const floor = document.getElementById('floorInput').value;
      const dept = document.getElementById('deptInput').value;
      const deptNumber = `${floor} ${dept}`;

      const beamsClient = new PusherPushNotifications.Client({
        instanceId: 'cc4fa519-f5d8-4ac5-a880-63e1f791f695',
      });

      try {
        await beamsClient.start();
        await beamsClient.addDeviceInterest('hello');
        const deviceId = await beamsClient.getDeviceId();

        const response = await fetch('/registerDevice', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ deviceId, deptNumber }),
        });

        const data = await response.json();
        console.log('Device registered:', data);
        alert('Device registered successfully');
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to register device.');
      }
    });
  }

  if (sendMessageButton) {
    sendMessageButton.addEventListener('click', async function() {
      const selectedMessage = document.getElementById('messageSelect').value;
      const deptNumber = document.getElementById('deptNumberInput').value;

      try {
        const response = await fetch(`/sendNotification?message=${encodeURIComponent(selectedMessage)}&deptNumber=${encodeURIComponent(deptNumber)}`, {
          method: 'GET',
        });

        const data = await response.text();
        console.log(data);
        alert('Notification sent successfully');
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to send message.');
      }
    });
  }
});
