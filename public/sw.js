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

// PWA caching
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/css/styles.css',
        '/js/app.js',
        '/js/board.js',
        '/js/loader.js',
        '/favicon.png'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
