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
// const postId = 'POST_ID'
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const databaseUrl = 'https://comp165rocks-default-rtdb.firebaseio.com/posts.json';
// const likesUrl = `https://comp165rocks-default-rtdb.firebaseio.com/posts/${postId}/likes.json`;
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

  const data = {username, message, likes:0};

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
export async function updateLikesCount(postId, updatedLikes) {
  try {
      const response = await fetch(`https://comp165rocks-default-rtdb.firebaseio.com/posts/${postId}.json`, {
          method: 'PATCH',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ likes: updatedLikes })
      });

      if (!response.ok) {
          throw new Error('Failed to update likes count');
      }

      console.log('Likes count updated successfully');
  } catch (error) {
      console.error('Error updating likes count:', error);
  }
}


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
      ${post.image ? `<img src="${post.image}" alt="Posted Image"style="max-width: 50%; height: auto margin: 0 auto; display: block;">` : ''}
      <p>${post.message}</p>
                 <button class="like-btn">Like(${post.likes})</button>
                <button class="comment-btn">Comment</button>
                <div class = "comments-section">
                    <form class="comment-form">
               <input type = "text" class = "comment-input" placeholder="Comment here">
               <button type ="submit" class ="comment-submit-btn">Submit</button>
               </form>
               <div class = "comments-list"
               </div>
               </div>`;

               
               
               
           

                const likeBtn = postElement.querySelector('.like-btn');
                const commentBtn = postElement.querySelector('.comment-btn');
                const commentsSection = postElement.querySelector('.comments-section');
    
                likeBtn.addEventListener('click', async () => {
                    try {
                        // Increment the likes count by 1
                        const updatedLikes = post.likes + 1;
    
                        // Update the likes count in Firebase Realtime Database
                        await updateLikesCount(postId, updatedLikes);
                        post.likes = updatedLikes; // Update the likes count in the post object
                        likeBtn.textContent = `Like (${updatedLikes})`; 
                        // Optionally, you can also update the UI to reflect the new like count
                        // For example, you can update the text of the like button or display the new like count
                    } catch (error) {
                        console.error('Error updating like count:', error);
                    }
                });
    
                
    
      dataContainer.appendChild(postElement);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

addEventListener('DOMContentLoaded', () => {
  displayAllMessages(); // Display existing messages when the page loads
});