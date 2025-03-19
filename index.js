// Import the necessary Firebase libraries
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDuhlsItxSNvULtIX57yE_dWvA3HnHQkK8",
  authDomain: "comment-section-f96a7.firebaseapp.com",
  projectId: "comment-section-f96a7",
  storageBucket: "comment-section-f96a7.firebasestorage.app",
  messagingSenderId: "197161690322",
  appId: "1:197161690322:web:a48662dc9386278071b90b",
  measurementId: "G-476KMHKT3C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get the form and input elements
const commentForm = document.getElementById("comment-form");
const nameInput = document.getElementById("name");
const commentInput = document.getElementById("comment");
const commentList = document.getElementById("comment-list");

// Handle form submission
commentForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent default form submission
  
  const name = nameInput.value.trim() || "Anonymous"; // Default to "Anonymous" if no name provided
  const comment = commentInput.value.trim();

  if (comment) {
    try {
      // Add the comment to Firestore
      await addDoc(collection(db, "comments"), {
        name: name,
        comment: comment,
        timestamp: new Date()
      });

      // Clear the form fields
      nameInput.value = "";
      commentInput.value = "";

      // Fetch and display the updated comments
      fetchComments();
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  }
});

// Fetch and display comments
async function fetchComments() {
  const querySnapshot = await getDocs(collection(db, "comments"));
  console.log(querySnapshot);  // Add this line to debug
  commentList.innerHTML = ""; // Clear the current comments
  
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const commentElement = document.createElement("div");
    commentElement.innerHTML = `
      <strong>${data.name}</strong>: ${data.comment} <br>
      <small>Posted on ${data.timestamp.toDate().toLocaleString()}</small>
      <hr>
    `;
    commentList.appendChild(commentElement);
  });
}

// Initial fetch of comments when the page loads
fetchComments();
