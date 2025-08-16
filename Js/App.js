// Just frontend placeholder for now
document.addEventListener("DOMContentLoaded", () => {
  const myTeamDiv = document.getElementById("myTeam");
  const leagueTableDiv = document.getElementById("leagueTable");

  // Demo data
  const demoTeam = ["Messi", "Mbappé", "De Bruyne"];
  const demoLeague = [
    { name: "Natty", points: 120 },
    { name: "Sam", points: 110 },
    { name: "Alex", points: 95 }
  ];

  // Render team
  myTeamDiv.innerHTML = demoTeam.map(p => `<p>⭐ ${p}</p>`).join("");

  // Render league
  leagueTableDiv.innerHTML = demoLeague
    .map(l => `<p>${l.name}: ${l.points} pts</p>`)
    .join("");

  // Buttons
  document.getElementById("addPlayerBtn").addEventListener("click", () => {
    alert("Add player (will connect to API later)");
  });
});
