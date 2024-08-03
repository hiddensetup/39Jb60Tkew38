document.addEventListener('DOMContentLoaded', async () => {
    const searchInput = document.getElementById('searchInput');
    const notificationList = document.getElementById('notificationList');
    const toggleViewButton = document.getElementById('toggleViewButton');
    const toggleSortButton = document.getElementById('toggleSortButton');
    const dateSearchButton = document.getElementById('dateSearchButton');
    const dateInput = document.getElementById('dateInput');
    const floorSelect = document.getElementById('floorSelect');
    const departmentInput = document.getElementById('departmentInput');

    let notifications = await fetchNotifications();
    let displayAll = false;
    let sortAsc = false;

    function renderNotifications(notifications) {
        notificationList.innerHTML = notifications.map(notification => `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${notification.floorNumber} - ${notification.department}</h5>
                    <p class="card-text">${notification.message}</p>
                    <p class="card-text"><small class="text-muted">${new Date(notification.dateSent).toLocaleString()}</small></p>
                </div>
            </div>
        `).join('');
    }

    async function fetchNotifications() {
        try {
            const response = await fetch('/data');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();

            const floors = [...new Set(data.users.map(user => user.floorNumber))];
            floorSelect.innerHTML += floors.map(floor => `<option value="${floor}">${floor}</option>`).join('');

            return data.users.flatMap(user => 
                user.notifications.map(notification => ({
                    ...notification,
                    floorNumber: user.floorNumber,
                    department: user.department
                }))
            );
        } catch (error) {
            console.error('Error fetching notifications:', error);
            return [];
        }
    }

    function filterNotifications(notifications) {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedFloor = floorSelect.value;
        const departmentSearch = departmentInput.value.toLowerCase();

        return notifications.filter(notification => 
            notification.message.toLowerCase().includes(searchTerm) &&
            (selectedFloor ? notification.floorNumber === selectedFloor : true) &&
            (departmentSearch ? notification.department.toLowerCase().includes(departmentSearch) : true)
        );
    }

    function sortNotifications(notifications, asc = true) {
        return notifications.sort((a, b) => asc ? new Date(a.dateSent) - new Date(b.dateSent) : new Date(b.dateSent) - new Date(a.dateSent));
    }

    function updateNotifications() {
        let filteredNotifications = filterNotifications(notifications);
        if (!displayAll) filteredNotifications = filteredNotifications.slice(0, 10);
        filteredNotifications = sortNotifications(filteredNotifications, sortAsc);
        renderNotifications(filteredNotifications);
    }

    toggleViewButton.addEventListener('click', () => {
        displayAll = !displayAll;
        toggleViewButton.textContent = displayAll ? 'Show Latest 10' : 'Show All';
        updateNotifications();
    });

    toggleSortButton.addEventListener('click', () => {
        sortAsc = !sortAsc;
        toggleSortButton.textContent = sortAsc ? 'Sort Desc' : 'Sort Asc';
        updateNotifications();
    });

    searchInput.addEventListener('input', updateNotifications);
    floorSelect.addEventListener('change', updateNotifications);
    departmentInput.addEventListener('input', updateNotifications);

    dateSearchButton.addEventListener('click', () => {
        const selectedDate = new Date(dateInput.value).toISOString().split('T')[0];
        const filteredNotifications = notifications.filter(notification => 
            new Date(notification.dateSent).toISOString().split('T')[0] === selectedDate
        );
        renderNotifications(filteredNotifications);
        $('#dateModal').modal('hide');
    });

    updateNotifications();
});
