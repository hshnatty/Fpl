// netlify/functions/players.js
import fetch from "node-fetch";

export async function handler(event, context) {
  try {
    const { league, season } = event.queryStringParameters;

    if (!league || !season) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing league or season query parameters" }),
      };
    }

    // Replace with your real API endpoint + key
    const apiKey = process.env.FOOTBALL_API_KEY; // set this in Netlify environment variables
    const url = `https://api-football-v1.p.rapidapi.com/v3/players?league=${league}&season=${season}`;

    const response = await fetch(url, {
      headers: {
        "x-apisports-key": apiKey,
        "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "API request failed", details: errorText }),
      };
    }

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error("Function Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error", details: err.message }),
    };
  }
      }
