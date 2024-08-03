document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  const sendMessageButton = document.getElementById('sendMessageButton');

  // Function to handle device registration
  const registerDevice = async (floor, dept) => {
    const deptNumber = `${floor} ${dept}`;
    const beamsClient = new PusherPushNotifications.Client({ instanceId: 'cc4fa519-f5d8-4ac5-a880-63e1f791f695' });

    try {
      await beamsClient.start();
      await beamsClient.addDeviceInterest('hello');
      const deviceId = await beamsClient.getDeviceId();

      const response = await fetch('/registerDevice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId, deptNumber }),
      });

      const data = await response.json();
      console.log('Device registered:', data);
      alert('Device registered successfully');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to register device.');
    }
  };

  // Device registration form
  if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const floor = document.getElementById('floorInput').value;
      const dept = document.getElementById('deptInput').value;
      await registerDevice(floor, dept);
    });
  }

  // Function to handle notification sending
  const sendNotification = async (message, deptNumber) => {
    try {
      const response = await fetch(`/sendNotification?message=${encodeURIComponent(message)}&deptNumber=${encodeURIComponent(deptNumber)}`, {
        method: 'GET',
      });

      const data = await response.text();
      console.log(data);
      alert('Notification sent successfully');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to send message.');
    }
  };

  // Notification sending button
  if (sendMessageButton) {
    sendMessageButton.addEventListener('click', async () => {
      const selectedMessage = document.getElementById('messageSelect').value;
      const deptNumber = document.getElementById('deptNumberInput')?.value;

      if (deptNumber) {
        await sendNotification(selectedMessage, deptNumber);
      } else {
        alert('Please enter a department number.');
      }
    });
  }
});
