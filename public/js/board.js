document.addEventListener("DOMContentLoaded", async () => {
  const searchInput = document.getElementById("searchInput");
  const notificationList = document.getElementById("notificationList");
  const toggleViewButton = document.getElementById("toggleViewButton");
  const toggleSortButton = document.getElementById("toggleSortButton");
  // const departmentInput = document.getElementById('departmentInput');
  const dropdownMenu = document.querySelector(".dropdown-menu");

  const colors = ["#29bf12", "#f95a2a", "#31cea2", "#f21b3f", "#ff9914"];
  let notifications = await fetchNotifications();
  let displayAll = false;
  let sortAsc = false;
  let lastColor = null; // Track the last used color

  function formatDate(dateTime) {
    const date = new Date(dateTime);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    let formattedDate = "";

    if (diffDays === 0) {
      formattedDate = "Hoy";
    } else if (diffDays === 1) {
      formattedDate = "Ayer";
    } else if (diffDays > 1 && diffDays <= 30) {
      formattedDate = `Hace ${diffDays} días`;
    } else {
      formattedDate = `${day}/${month}/${year}`;
    }

    return { date: formattedDate, time: `${hours}:${minutes}` };
  }

  function groupNotificationsByMessage(notifications) {
    return notifications.reduce((acc, notification) => {
      const key = notification.message;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(notification);
      return acc;
    }, {});
  }

  function getRandomColor() {
    let newColor;
    do {
      newColor = colors[Math.floor(Math.random() * colors.length)];
    } while (newColor === lastColor);
    lastColor = newColor;
    return newColor;
  }

  function renderNotifications(notifications) {
    const groupedNotifications = groupNotificationsByMessage(notifications);
    notificationList.innerHTML = Object.keys(groupedNotifications)
      .map((message) => {
        const notifications = groupedNotifications[message];
        const { date, time } = formatDate(notifications[0].dateSent);

        return `
                <div class="card mb-3 shadow-sm border-custom">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <p class="card-text mb-2"><small class="text-muted">${date}</small></p>
                            <p class="card-text mb-2"><small class="text-muted">${time}</small></p>
                        </div>
                        <h5 class="card-title">${message}</h5>
                        <div class="d-flex flex-wrap">
                            ${notifications
                              .map((n) => {
                                const color = getRandomColor(); // Get a random color ensuring it's different from the last one
                                return `
                                    <span class="badge m-1" style="background-color: ${color};">${n.floorNumber} ${n.department}</span>
                                `;
                              })
                              .join("")}
                        </div>
                    </div>
                </div>
            `;
      })
      .join("");
  }

  async function fetchNotifications() {
    try {
      const response = await fetch("/data");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();

      const floors = [...new Set(data.users.map((user) => user.floorNumber))];
      dropdownMenu.innerHTML += `
                <li><a class="dropdown-item" href="#" data-floor="">Todos</a></li>
                ${floors
                  .map(
                    (floor) =>
                      `<li><a class="dropdown-item" href="#" data-floor="${floor}">Piso ${floor}</a></li>`
                  )
                  .join("")}
            `;

      return data.users.flatMap((user) =>
        user.notifications.map((notification) => ({
          ...notification,
          floorNumber: user.floorNumber,
          department: user.department,
        }))
      );
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }
  }

  function filterNotifications(notifications) {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedFloor = dropdownMenu
      .querySelector(".active")
      ?.getAttribute("data-floor");
    // const departmentSearch = departmentInput.value.toLowerCase();

    return notifications.filter(
      (notification) =>
        notification.message.toLowerCase().includes(searchTerm) &&
        (selectedFloor ? notification.floorNumber === selectedFloor : true)
    );
  }

  function sortNotifications(notifications, asc = true) {
    return notifications.sort((a, b) =>
      asc
        ? new Date(a.dateSent) - new Date(b.dateSent)
        : new Date(b.dateSent) - new Date(a.dateSent)
    );
  }

  function updateNotifications() {
    let filteredNotifications = filterNotifications(notifications);
    if (!displayAll) filteredNotifications = filteredNotifications.slice(0, 10);
    filteredNotifications = sortNotifications(filteredNotifications, sortAsc);
    renderNotifications(filteredNotifications);
  }

  toggleViewButton.addEventListener("click", () => {
    displayAll = !displayAll;
    toggleViewButton.textContent = displayAll ? "Últimos" : "Ver todo";
    updateNotifications();
  });

  toggleSortButton.addEventListener("click", () => {
    sortAsc = !sortAsc;
    toggleSortButton.innerHTML = sortAsc ? "Orden <i class=\"bi bi-arrow-down\"></i>" : "Orden <i class=\"bi bi-arrow-up\"></i>";
    updateNotifications();
  });

  searchInput.addEventListener("input", updateNotifications);
  // departmentInput.addEventListener('input', updateNotifications);

  dropdownMenu.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      dropdownMenu
        .querySelectorAll("a")
        .forEach((a) => a.classList.remove("active"));
      e.target.classList.add("active");
      updateNotifications();
    }
  });

  updateNotifications();
});
