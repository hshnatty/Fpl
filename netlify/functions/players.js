// players.js

const league = "39"; // Example: Premier League
const season = "2024"; // Example: 2024 season
const API_KEY = process.env.FOOTBALL_API_KEY; // Set in Netlify env vars

const url = `https://v3.football.api-sports.io/players?league=${league}&season=${season}`;

async function fetchPlayers() {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-apisports-key": API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Players data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching players:", error);
  }
}

// Example usage:
fetchPlayers();
