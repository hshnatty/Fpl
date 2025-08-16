import fetch from "node-fetch";

export async function handler(event, context) {
  // Get API key from Netlify environment variables
  const API_KEY = process.env.API_FOOTBALL_KEY;

  // Get league and season from query parameters (defaults: EPL 2024)
  const leagueId = event.queryStringParameters?.league || 39; // EPL ID
  const season = event.queryStringParameters?.season || 2024;

  const url = `https://v3.football.api-sports.io/players?league=${leagueId}&season=${season}`;

  try {
    const res = await fetch(url, {
      headers: { "x-apisports-key": API_KEY }
    });
    const data = await res.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data.response) // array of player objects
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
        }
