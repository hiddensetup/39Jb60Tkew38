document.getElementById('sendMessageButton').addEventListener('click', async function() {
  const selectedMessage = document.getElementById('messageSelect').value;

  try {
      const response = await fetch('/sendNotification', { // Changed to match server.js endpoint
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: selectedMessage }),
      });

      const data = await response.text();
  } catch (error) {
      console.error('Error:', error);
      alert('Failed to send message.');
  }
});
