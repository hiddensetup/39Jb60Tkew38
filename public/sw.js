// self.addEventListener('push', (event) => {
//     const data = event.data.json();
//     const title = data.web.notification.title;
//     const options = {
//       body: data.web.notification.body,
//       icon: data.web.notification.icon,
//       data: data.web.notification.data
//     };
  
//     event.waitUntil(
//       self.registration.showNotification(title, options)
//     );
//   });
  
//   self.addEventListener('notificationclick', (event) => {
//     event.notification.close();
  
//     const url = event.notification.data.url || '/board';
//     event.waitUntil(
//       clients.openWindow(url)
//     );
//   });

  
  // Pusher push notification handling
self.addEventListener('push', (event) => {
  const data = event.data.json();
  const title = data.web.notification.title;
  const options = {
    body: data.web.notification.body,
    icon: data.web.notification.icon,
    data: data.web.notification.data
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const url = event.notification.data.url || '/board';
  event.waitUntil(
    clients.openWindow(url)
  );
});

