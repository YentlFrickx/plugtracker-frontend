const firebaseConfig = {
    apiKey: "AIzaSyAJHS1ppIoFvAtYnxI1Li0JhTPJ-mMU2zo",
    authDomain: "ev-notification.firebaseapp.com",
    projectId: "ev-notification",
    storageBucket: "ev-notification.appspot.com",
    messagingSenderId: "857330862150",
    appId: "1:857330862150:web:14d7535e086d99a1482247",
    measurementId: "G-RQ9DY8CV5D"
};

// Import and configure the Firebase SDK
// These scripts are made available when the app is served or deployed on Firebase Hosting
// If you do not serve/host your project using Firebase Hosting see https://firebase.google.com/docs/web/setup
importScripts('https://www.gstatic.com/firebasejs/8.1.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.1.1/firebase-messaging.js');

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
// messaging.onBackgroundMessage((payload) => {
//     console.log('[firebase-messaging-sw.js] Received background message ', payload);
//     const notificationTitle = "title";
//     const notificationOptions = {
//         body: "test",
//     };
//     return self.registration.showNotification(notificationTitle,
//         notificationOptions);
// });
self.addEventListener('notificationclick', event => {
    console.log(event)
});