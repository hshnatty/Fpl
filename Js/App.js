// Firebase Config
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBOcQz6KoL9LnwavdGLaLAsEeYEOXsXUiM",
  authDomain: "fantasy-football-f8fae.firebaseapp.com",
  projectId: "fantasy-football-f8fae",
  storageBucket: "fantasy-football-f8fae.appspot.com",
  messagingSenderId: "974520941117",
  appId: "1:974520941117:web:d68f1b3d265c29a11d0854",
  measurementId: "G-B0G0891E04"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// Elements
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const postBtn = document.getElementById("postBtn");
const postInput = document.getElementById("postInput");
const postsList = document.getElementById("postsList");

// Auth
loginBtn.addEventListener("click", () => signInWithPopup(auth, provider));
logoutBtn.addEventListener("click", () => signOut(auth));

onAuthStateChanged(auth, user => {
  if(user){
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
    postInput.disabled = false;
    postBtn.disabled = false;
    loadPosts();
  } else {
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    postsList.innerHTML = "";
    postInput.disabled = true;
    postBtn.disabled = true;
  }
});

// Add Post
postBtn.addEventListener("click", async () => {
  const text = postInput.value.trim();
  if(text === "") return alert("Type something!");
  await addDoc(collection(db, "posts"), {
    text: text,
    createdAt: new Date(),
    uid: auth.currentUser.uid,
    name: auth.currentUser.displayName
  });
  postInput.value = "";
  loadPosts();
});

// Load Posts
async function loadPosts(){
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  postsList.innerHTML = snapshot.docs.map(doc => {
    const data = doc.data();
    return `<p><strong>${data.name}:</strong> ${data.text}</p>`;
  }).join("");
}

// Placeholder team/league data
const myTeamDiv = document.getElementById("myTeam");
const leagueTableDiv = document.getElementById("leagueTable");
const demoTeam = ["Messi", "Mbappé", "De Bruyne"];
const demoLeague = [
  { name: "Natty", points: 120 },
  { name: "Sam", points: 110 },
  { name: "Alex", points: 95 }
];
myTeamDiv.innerHTML = demoTeam.map(p => `<p>⭐ ${p}</p>`).join("");
leagueTableDiv.innerHTML = demoLeague.map(l => `<p>${l.name}: ${l.points} pts</p>`).join("");

document.getElementById("addPlayerBtn").addEventListener("click", () => {
  alert("Add player (will connect to API later)");
});