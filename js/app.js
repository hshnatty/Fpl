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

    // API-Football uses data.response
    const players = data.response || data.players || [];
    renderPlayers(players);
  } catch (err) {
    console.error("Fetch error:", err);
    document.getElementById("players").innerHTML =
      `<p style="color:red;">Failed to load players.</p>`;
  }
}

// Render players to UI
function renderPlayers(players) {
  const container = document.getElementById("players");
  container.innerHTML = "";

  if (!players.length) {
    container.innerHTML = "<p>No players found.</p>";
    return;
  }

  players.forEach(p => {
    const playerCard = document.createElement("div");
    playerCard.className = "player-card";
    playerCard.style.border = "1px solid #ddd";
    playerCard.style.padding = "10px";
    playerCard.style.margin = "10px 0";
    playerCard.style.borderRadius = "8px";
    playerCard.style.background = "#f9f9f9";

    playerCard.innerHTML = `
      <img src="${p.player.photo}" alt="${p.player.firstname} ${p.player.lastname}" width="50" style="border-radius:50%;" />
      <p><strong>${p.player.firstname} ${p.player.lastname}</strong></p>
      <p>Team: ${p.statistics[0]?.team?.name || "N/A"}</p>
      <p>Age: ${p.player.age} | Nationality: ${p.player.nationality}</p>
    `;

    container.appendChild(playerCard);
  });
}

// Call fetch on page load (Premier League, 2023 season as example)
document.addEventListener("DOMContentLoaded", () => {
  fetchPlayers(39, 2023);
});
