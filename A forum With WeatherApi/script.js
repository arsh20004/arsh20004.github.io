import {initializeApp} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import {getAnalytics} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-analytics.js";
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js";


const firebaseConfig = {
  apiKey: "AIzaSyBptzf3uLBvoiLGdJzpSjIV3Uad8jrvkpE",
  authDomain: "comp165rocks.firebaseapp.com",
  databaseURL: "https://comp165rocks-default-rtdb.firebaseio.com",
  projectId: "comp165rocks",
  storageBucket: "comp165rocks.appspot.com",
  messagingSenderId: "1042006373277",
  appId: "1:1042006373277:web:fbbb170f94c62ad7cff574",
  measurementId: "G-6PKQRCJ0XC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const databaseUrl = 'https://comp165rocks-default-rtdb.firebaseio.com/posts.json';
const storage = getStorage();

export async function sendMessage() {
  const usernameInput = document.querySelector('#username');
  const messageInput = document.querySelector('#message');
  const username = usernameInput.value;
  const message = messageInput.value;

  if (username.trim() === '' || message.trim() === '') {
    console.error('Username and message are required.');
    return;
  }

  const data = {username, message};

  try {
    const storageRef = ref(storage);
    const file = document.querySelector("#photo").files[0];
    if (file) {
      const name = Date.now() + "_" + file.name;
      const metadata = {contentType: file.type};
      const task = uploadBytesResumable(ref(storageRef,name) , file , metadata);
      await task;
      const downloadURL = await getDownloadURL(task.snapshot.ref);
      data.image = downloadURL;
      data.filename = file.name;
    }

    const response = await fetch(databaseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    messageInput.value = '';
    usernameInput.value = '';
    displayAllMessages();
  } catch (error) {
    console.error('Error sending message:', error);
  }
}
window.sendMessage = sendMessage;


window.sendMessage = sendMessage;
export async function displayAllMessages() {
  try {
    const response = await fetch(databaseUrl);
    const data = await response.json();
    const dataContainer = document.querySelector('#messages',);
    dataContainer.innerHTML = ""; // Clear previous messages

    for (const postId in data) {
      const post = data[postId];
      const timestamp = post.timestamp;
      //   const time = new Date(timestamp).toLocaleString("en-US", {timeZone: "America/Vancouver"});

    //    const image = downloadURL;
      const postElement = document.createElement('div');
      postElement.classList.add('post');
      postElement.innerHTML = `
                <p><strong>${post.username}</strong></p>
                <p>${post.message}</p>

                ${post.image ? `<img src="${post.image}" alt="Posted Image">` : ''}

            `;
      dataContainer.appendChild(postElement);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

addEventListener('DOMContentLoaded', () => {
  displayAllMessages(); // Display existing messages when the page loads
});
