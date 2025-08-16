// netlify/functions/players.js

const league = "39"; // Example: Premier League
const season = "2023"; // Example: 2024 season
const API_KEY = process.env.FOOTBALL_API_KEY; // Set in Netlify env vars

exports.handler = async function(event, context) {
  const url = `https://v3.football.api-sports.io/players?league=${league}&season=${season}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-apisports-key": API_KEY,
      },
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `HTTP error! Status: ${response.status}` }),
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
