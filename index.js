// Import the necessary Firebase libraries
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import * as fs from "fs"; // Import the fs module to read the API key from a file

//import xss VERY IMPORTANT !!!PEOPLE WILL HACK YOU 
var xss = require("xss");


const apiKey = fs.readFileSync("./apikey.txt").buffer; // read file using node's fs module 

// Your Firebase config
const firebaseConfig = {
  apiKey: apiKey, //dont store this here!!!
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
        timestamp: new Date() // Store the timestamp
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
  console.log(querySnapshot);  // Log the data to check if it's correct
  commentList.innerHTML = ""; // Clear the current comments
  
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    
    // Check and log the timestamp value
    console.log(data.timestamp);  // Log the timestamp to see what it contains
    
    const commentElement = document.createElement("div");
    const formattedTimestamp = data.timestamp.toDate ? data.timestamp.toDate().toLocaleString() : "Unknown date";
    
    commentElement.innerHTML = `
      <strong>${data.name}</strong>: ${data.comment} <br>
      <small>Posted on ${formattedTimestamp}</small>
      <hr>
    `;
    commentList.appendChild(commentElement);
  });
}

// Initial fetch of comments when the page loads
fetchComments();
