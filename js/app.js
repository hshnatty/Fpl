// Fetch players from API (Netlify function)
async function fetchPlayers(league, season) {
  try {
    const response = await fetch(
      `/.netlify/functions/players?league=${league}&season=${season}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch players");
    }

    const data = await response.json();
    console.log("Players data:", data);

    const players = data.response || [];
    renderFantasyTeam(players);
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

// Render players in a fantasy formation
function renderFantasyTeam(players) {
  // Example: just take first few players to mock a team
  const gk = players.filter(p => p.statistics[0]?.games?.position === "G")[0];
  const defs = players.filter(p => p.statistics[0]?.games?.position === "D").slice(0, 4);
  const mids = players.filter(p => p.statistics[0]?.games?.position === "M").slice(0, 4);
  const fwds = players.filter(p => p.statistics[0]?.games?.position === "F").slice(0, 2);
  const bench = players.slice(11, 15);

  addPlayersToLine("goalkeeper", [gk]);
  addPlayersToLine("defenders", defs);
  addPlayersToLine("midfielders", mids);
  addPlayersToLine("forwards", fwds);
  addPlayersToLine("bench", bench);
}

// Utility: render players into a line
function addPlayersToLine(containerId, players) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  players.forEach(p => {
    if (!p) return;
    const card = document.createElement("div");
    card.className = "player-card";
    card.innerHTML = `
      <img src="${p.player.photo}" alt="${p.player.name}" />
      <p>${p.player.name}</p>
      <small>${p.statistics[0]?.games?.position || "?"}</small>
    `;
    container.appendChild(card);
  });
}

// Load on page start
document.addEventListener("DOMContentLoaded", () => {
  fetchPlayers(39, 2023); // Example: Premier League 2023
});
