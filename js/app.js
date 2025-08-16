// --- Firebase Setup ---
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const db = window.db; // db comes from <script> in Index.html

// --- Team Data ---
let myTeam = [];
let selectedLeague = 39; // default Premier League

// League switcher
document.getElementById("leagueSelect").addEventListener("change", (e) => {
  selectedLeague = e.target.value;
});

// --- Add Player ---
document.getElementById("addPlayer").addEventListener("click", async () => {
  const name = document.getElementById("playerInput").value.trim();
  const position = document.getElementById("positionSelect").value;

  if (!name) return alert("Enter player name");

  const player = await searchPlayer(name, selectedLeague);
  if (!player) return alert("Player not found");

  player.position = position;
  myTeam.push(player);
  renderTeam();
});

// --- Search Player from API ---
async function searchPlayer(name, league) {
  try {
    const res = await fetch(`/.netlify/functions/players?league=${league}&season=2023&search=${name}`);
    const data = await res.json();
    return data.response[0] || null;
  } catch (err) {
    console.error("Search error:", err);
    return null;
  }
}

// --- Render Team ---
function renderTeam() {
  const teamDiv = document.getElementById("team");
  teamDiv.innerHTML = "";
  myTeam.forEach(p => {
    const card = document.createElement("div");
    card.className = "player-card";
    card.innerHTML = `
      <img src="${p.player.photo}" alt="${p.player.name}" />
      <p>${p.player.name}</p>
      <small>${p.position}</small>
    `;
    teamDiv.appendChild(card);
  });
}

// --- Save Team to Firebase ---
document.getElementById("saveTeam").addEventListener("click", async () => {
  try {
    await setDoc(doc(db, "teams", "user1"), {
      league: selectedLeague,
      players: myTeam,
      timestamp: Date.now()
    });
    alert("Team saved!");
  } catch (err) {
    console.error("Save error:", err);
  }
});

// --- Load Team from Firebase ---
async function loadTeam() {
  try {
    const ref = doc(db, "teams", "user1");
    const snap = await getDoc(ref);
    if (snap.exists()) {
      myTeam = snap.data().players || [];
      renderTeam();
    }
  } catch (err) {
    console.error("Load error:", err);
  }
}

// --- Daily Update Points ---
async function updatePoints() {
  let points = 0;
  for (let p of myTeam) {
    const stats = p.statistics?.[0] || {};
    if (stats.goals?.total) points += stats.goals.total * 5; // Goal = 5pts
    if (stats.goals?.assists) points += stats.goals.assists * 3; // Assist = 3pts
    if (p.position === "G" && stats.games?.appearences && stats.goals?.conceded === 0) {
      points += 4; // GK Clean sheet
    }
  }
  document.getElementById("points").innerText = points;
}

// Load saved team on page start
document.addEventListener("DOMContentLoaded", async () => {
  await loadTeam();
  updatePoints();
});

// Refresh points once per day
setInterval(updatePoints, 86400000);
