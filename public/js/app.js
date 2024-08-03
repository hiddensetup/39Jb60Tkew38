document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  const sendMessageButton = document.getElementById('sendMessageButton');

  // Function to handle device registration
  const registerDevice = async (floorNumber, department) => {
    const beamsClient = new PusherPushNotifications.Client({ instanceId: 'cc4fa519-f5d8-4ac5-a880-63e1f791f695' });

    try {
      await beamsClient.start();
      await beamsClient.addDeviceInterest('hello');
      const deviceId = await beamsClient.getDeviceId();

      const response = await fetch('/registerDevice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId, floorNumber, department }),
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
      const floorNumber = document.getElementById('floorInput').value;
      const department = document.getElementById('departmentInput').value;
      await registerDevice(floorNumber, department);
    });
  }

  // Function to handle notification sending
  const sendNotification = async (message, deptNumbers) => {
    try {
      const response = await fetch('/sendNotification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, deptNumbers }),
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
      const selectedCheckboxes = document.querySelectorAll('.deptCheckbox:checked');
      const selectedDeptNumbers = Array.from(selectedCheckboxes).map(cb => JSON.parse(cb.value));

      if (selectedDeptNumbers.length === 0) {
        alert('Please select at least one department.');
        return;
      }

      await sendNotification(selectedMessage, selectedDeptNumbers);
    });
  }
});
