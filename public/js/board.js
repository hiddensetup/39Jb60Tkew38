document.addEventListener('DOMContentLoaded', async () => {
    const floorFilter = document.getElementById('floorFilter');
    const notificationsList = document.getElementById('notificationsList');

    // Fetch floors and notifications
    try {
        const response = await fetch('/data');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        // Populate floor filter options
        const uniqueFloors = [...new Set(data.users.map(user => user.floorNumber))];
        uniqueFloors.forEach(floor => {
            const option = document.createElement('option');
            option.value = floor;
            option.textContent = `${floor} - Floor`;
            floorFilter.appendChild(option);
        });

        // Fetch and display notifications
        const updateNotifications = (floor) => {
            notificationsList.innerHTML = '';
            const filteredUsers = floor === 'all' ? data.users : data.users.filter(user => user.floorNumber === floor);
            const recentNotifications = filteredUsers.flatMap(user => user.notifications).sort((a, b) => new Date(b.dateSent) - new Date(a.dateSent)).slice(0, 2);

            if (recentNotifications.length === 0) {
                notificationsList.innerHTML = '<p>No notifications available.</p>';
                return;
            }

            recentNotifications.forEach(notification => {
                const item = document.createElement('a');
                item.href = '#';
                item.className = 'list-group-item list-group-item-action';
                item.innerHTML = `
                    <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">${floor === 'all' ? 'All Floors' : floor + ' - Floor'}</h5>
                        <small>${new Date(notification.dateSent).toLocaleDateString()}</small>
                    </div>
                    <p class="mb-1">${notification.message}</p>
                `;
                notificationsList.appendChild(item);
            });
        };

        // Initialize notifications display
        updateNotifications('all');

        // Handle floor filter change
        floorFilter.addEventListener('change', (event) => {
            updateNotifications(event.target.value);
        });

    } catch (error) {
        console.error('Error fetching data:', error);
        notificationsList.innerHTML = '<p>Failed to load notifications.</p>';
    }
});
