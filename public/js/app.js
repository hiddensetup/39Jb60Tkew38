document.addEventListener("DOMContentLoaded", () => {
    const registerButton = document.getElementById("registerButton");
  
    // Function to show a toast message
    window.showToast = (message, type = "success") => {
      const toastContainer = document.querySelector(".toast-container");
  
      // Create a new toast element
      const toastHtml = `
        <div class="toast bg-white" role="alert" aria-live="assertive" aria-atomic="true">
          <div class="toast-header">
            <img src="https://routin.cloud/favicon.png" class=" me-1" alt="..." style="width: 20px; border-radius: 5px;">
            <strong class="me-auto">Notification</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div class="toast-body">
            ${message}
          </div>
        </div>
      `;
      toastContainer.innerHTML += toastHtml;
  
      // Initialize and show the toast
      const toastElement = toastContainer.lastElementChild;
      const toast = new bootstrap.Toast(toastElement);
      toast.show();
  
      // Remove the toast element after it disappears
      toastElement.addEventListener("hidden.bs.toast", () => {
        toastElement.remove();
      });
    };
  
    // Function to handle the redirection to /board
    const redirectToBoard = () => {
      setTimeout(() => {
        window.location.href = '/board';
      }, 2000); // Redirect after 2 seconds to show the toast
    };
  
    // Register button event listener
    if (registerButton) {
      registerButton.addEventListener('click', async function () {
        let floor = document.getElementById('floorInput').value.trim();
        let department = document.getElementById('departmentInput').value.trim().toUpperCase();
  
        // Clear previous toast messages
        const toastContainer = document.querySelector(".toast-container");
        toastContainer.innerHTML = "";
  
        // Validate floorInput
        if (!floor || isNaN(floor)) {
          window.showToast('Please enter a valid floor number.', 'warning');
          return;
        }
  
        // Convert to integer
        const floorInt = parseInt(floor, 10);
  
        if (floorInt < 0 || floorInt > 16) {
          window.showToast('Floor number must be between 0 and 16.', 'warning');
          return;
        }
  
        // Validate departmentInput
        if (!department || department.length !== 1 || !/[A-Z]/.test(department)) {
          window.showToast('Please enter a single valid department letter (A-Z).', 'warning');
          return;
        }
  
        const deptNumber = { floorNumber: floorInt, department };
  
        const beamsClient = new PusherPushNotifications.Client({
          instanceId: 'cc4fa519-f5d8-4ac5-a880-63e1f791f695',
        });
  
        try {
          await beamsClient.start();
          await beamsClient.addDeviceInterest('updates-info');
          const deviceId = await beamsClient.getDeviceId();
  
          const response = await fetch('/registerDevice', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ deviceId, ...deptNumber }),
          });
  
          const data = await response.json();
          console.log('Device registered:', data);
          window.showToast('Device registered successfully', 'success');
  
          // Clear input fields after successful registration
          document.getElementById('floorInput').value = '';
          document.getElementById('departmentInput').value = '';
  
          // Redirect to /board
          redirectToBoard();
        } catch (error) {
          console.error('Error:', error);
          window.showToast('Failed to register device.', 'danger');
        }
      });
    }
  
    // Function to handle notification sending
    const sendNotification = async (message, deptNumbers) => {
      try {
        const response = await fetch("/sendNotification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, deptNumbers }),
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Network response was not ok: ${errorText}`);
        }
  
        const data = await response.text();
        console.log("Response from server:", data);
        window.showToast("Notification sent successfully");
      } catch (error) {
        console.error("Error:", error);
        window.showToast("Failed to send message.", "danger");
      }
    };
  
    // Notification sending button
    const sendMessageButton = document.getElementById("sendMessageButton");
    if (sendMessageButton) {
      sendMessageButton.addEventListener("click", async () => {
        const messageInput = document.getElementById("messageInput").value;
        const selectedDeptCheckboxes = document.querySelectorAll(".deptCheckbox:checked");
        const selectedDeptNumbers = Array.from(selectedDeptCheckboxes).map((checkbox) => {
          const dept = JSON.parse(checkbox.value);
          return {
            floorNumber: parseInt(dept.floorNumber, 10),
            department: dept.department,
          };
        });
  
        if (selectedDeptNumbers.length === 0) {
          window.showToast("Please select at least one department.", "warning");
          return;
        }
  
        const combinedMessage = messageInput;
  
        await sendNotification(combinedMessage, selectedDeptNumbers);
      });
    }
  });
  