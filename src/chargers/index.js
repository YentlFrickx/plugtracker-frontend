import './index.html'

// https://github.com/firebase/quickstart-js/blob/master/messaging/index.html
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage, deleteToken } from "firebase/messaging";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAJHS1ppIoFvAtYnxI1Li0JhTPJ-mMU2zo",
    authDomain: "ev-notification.firebaseapp.com",
    projectId: "ev-notification",
    storageBucket: "ev-notification.appspot.com",
    messagingSenderId: "857330862150",
    appId: "1:857330862150:web:14d7535e086d99a1482247",
    measurementId: "G-RQ9DY8CV5D"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const messaging = getMessaging(firebase);
// Retrieve Firebase Messaging object.
// const messaging = firebase.messaging();

// IDs of divs that display registration token UI or request permission UI.
const tokenDivId = 'token_div';
const permissionDivId = 'permission_div';

// Handle incoming messages. Called when:
// - a message is received while the app has focus
// - the user clicks on an app notification created by a service worker
//   `messaging.onBackgroundMessage` handler.
onMessage((payload) => {
    console.log('Message received. ', payload);
    // Update the UI to include the received message.
    appendMessage(payload);
});

function resetUI() {
    clearMessages();
    showToken('loading...');
    // Get registration token. Initially this makes a network call, once retrieved
    // subsequent calls to getToken will return from cache.
    getToken(messaging, {vapidKey: 'BH7vtSjsDf8h9IQyROmPZb3x5HOzVt9oEEmOUqSMUbh19EPbpVYKkNDj_Jkrblsjw3ch7eetGk5lk86GGLk_YRM'}).then((currentToken) => {
        if (currentToken) {
            sendTokenToServer(currentToken);
            updateUIForPushEnabled(currentToken);
        } else {
            // Show permission request.
            console.log('No registration token available. Request permission to generate one.');
            // Show permission UI.
            updateUIForPushPermissionRequired();
            setTokenSentToServer(false);
        }
    }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
        showToken('Error retrieving registration token. ', err);
        setTokenSentToServer(false);
    });
}


function showToken(currentToken) {
    // Show token in console and UI.
    const tokenElement = document.querySelector('#token');
    tokenElement.textContent = currentToken;
}

// Send the registration token your application server, so that it can:
// - send messages back to this app
// - subscribe/unsubscribe the token from topics
function sendTokenToServer(currentToken) {
    if (!isTokenSentToServer()) {
        console.log('Sending token to server...');
        fetch('https://charger-api.yfrickx.be/api/notify/sub', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "topic": "78102",
                "fcmRegistrationTokens": [currentToken]
            })
        })
        setTokenSentToServer(true);
    } else {
        console.log('Token already sent to server so won\'t send it again ' +
            'unless it changes');
    }
}

function isTokenSentToServer() {
    return window.localStorage.getItem('sentToServer') === '1';
}

function setTokenSentToServer(sent) {
    window.localStorage.setItem('sentToServer', sent ? '1' : '0');
}

function showHideDiv(divId, show) {
    const div = document.querySelector('#' + divId);
    if (show) {
        div.style = 'display: visible';
    } else {
        div.style = 'display: none';
    }
}



document.getElementById("delete").addEventListener("click",
    function() {
        // Delete registration token.
        getToken(messaging, {vapidKey: 'BH7vtSjsDf8h9IQyROmPZb3x5HOzVt9oEEmOUqSMUbh19EPbpVYKkNDj_Jkrblsjw3ch7eetGk5lk86GGLk_YRM'}).then((currentToken) => {
            deleteToken(messaging, {vapidKey: 'BH7vtSjsDf8h9IQyROmPZb3x5HOzVt9oEEmOUqSMUbh19EPbpVYKkNDj_Jkrblsjw3ch7eetGk5lk86GGLk_YRM'}).then(() => {
                fetch('https://charger-api.yfrickx.be/api/notify/unsub', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "topic": "78102",
                        "fcmRegistrationTokens": [currentToken]
                    })
                })
                setTokenSentToServer(false);
                // Once token is deleted update UI.
                resetUI();
            }).catch((err) => {
                console.log('Unable to delete token. ', err);
            });
        }).catch((err) => {
            console.log('Error retrieving registration token. ', err);
            showToken('Error retrieving registration token. ', err);
        });
    })

// Add a message to the messages element.
function appendMessage(payload) {
    const messagesElement = document.querySelector('#messages');
    const dataHeaderElement = document.createElement('h5');
    const dataElement = document.createElement('pre');
    dataElement.style = 'overflow-x:hidden;';
    dataHeaderElement.textContent = 'Received message:';
    dataElement.textContent = JSON.stringify(payload, null, 2);
    messagesElement.appendChild(dataHeaderElement);
    messagesElement.appendChild(dataElement);
}

// Clear the messages element of all children.
function clearMessages() {
    const messagesElement = document.querySelector('#messages');
    while (messagesElement.hasChildNodes()) {
        messagesElement.removeChild(messagesElement.lastChild);
    }
}

function updateUIForPushEnabled(currentToken) {
    showHideDiv(tokenDivId, true);
    showHideDiv(permissionDivId, false);
    showToken(currentToken);
}

function updateUIForPushPermissionRequired() {
    showHideDiv(tokenDivId, false);
    showHideDiv(permissionDivId, true);
}

resetUI();