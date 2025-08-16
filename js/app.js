// js/app.js

// Fetch players from Netlify Function
async function fetchPlayers(league, season) {
  try {
    const response = await fetch(
      `/.netlify/functions/players?league=${league}&season=${season}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Function error:", errorText);
      throw new Error("Failed to fetch players");
    }

    const data = await response.json();
    console.log("Players data:", data); // Debugging in browser console

    // Some APIs return nested data (API-Football uses data.response).
    const players = data.response || data.players || [];

    renderPlayers(players);
  } catch (err) {
    console.error("Fetch error:", err);
    document.getElementById("players").innerHTML =
      `<p style="color:red;">Error loading players: ${err.message}</p>`;
  }
}

// Render players to the page
function renderPlayers(players) {
  const container = document.getElementById("players");
  container.innerHTML = "";

  if (!players.length) {
    container.innerHTML = "<p>No players found.</p>";
    return;
  }

  players.forEach((playerObj) => {
    // API-Football returns { player: {...}, statistics: [...] }
    const player = playerObj.player || playerObj;

    const card = document.createElement("div");
    card.classList.add("player-card");

    card.innerHTML = `
      <img src="${player.photo || "https://via.placeholder.com/50"}" alt="${player.name}">
      <h3>${player.name}</h3>
      <p>Age: ${player.age || "N/A"}</p>
      <p>Nationality: ${player.nationality || "N/A"}</p>
    `;

    container.appendChild(card);
  });
}

// Example: Premier League (39) Season 2024
fetchPlayers(39, 2024);
