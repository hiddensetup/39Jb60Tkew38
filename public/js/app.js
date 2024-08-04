document.addEventListener("DOMContentLoaded", () => {
  const sendMessageButton = document.getElementById("sendMessageButton");

  // Function to show a toast message
  window.showToast = (message, type = "success") => {
    const toastContainer = document.querySelector(".toast-container");

    // Create a new toast element
    const toastHtml = `
      <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
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
      showToast("Notification sent successfully");
    } catch (error) {
      console.error("Error:", error);
      showToast("Failed to send message.", "danger");
    }
  };

  // Notification sending button
  if (sendMessageButton) {
    sendMessageButton.addEventListener("click", async () => {
      const messageInput = document.getElementById("messageInput").value;
      const selectedDeptCheckboxes = document.querySelectorAll(
        ".deptCheckbox:checked"
      );
      const selectedDeptNumbers = Array.from(selectedDeptCheckboxes).map(
        (checkbox) => {
          const dept = JSON.parse(checkbox.value);
          return {
            floorNumber: parseInt(dept.floorNumber, 10),
            department: dept.department,
          };
        }
      );

      if (selectedDeptNumbers.length === 0) {
        showToast("Please select at least one department.", "warning");
        return;
      }

      const combinedMessage = messageInput;

      await sendNotification(combinedMessage, selectedDeptNumbers);
    });
  }
});
