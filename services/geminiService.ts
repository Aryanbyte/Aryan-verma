
import { GoogleGenAI, Type } from "@google/genai";
import { NewsResponse, PlayerProfileData, MatchData, TeamStanding } from "../types";

// Initialize Gemini client
// NOTE: API Key is expected to be in process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to clean JSON string from markdown
const cleanJsonString = (text: string) => {
  let clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
  const firstBrace = clean.indexOf('{');
  const firstBracket = clean.indexOf('[');
  
  // Determine if it's an object or array
  const start = (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) ? firstBrace : firstBracket;
  
  const lastBrace = clean.lastIndexOf('}');
  const lastBracket = clean.lastIndexOf(']');
  
  const end = (lastBrace !== -1 && (lastBracket === -1 || lastBrace > lastBracket)) ? lastBrace : lastBracket;

  if (start >= 0 && end >= 0) {
    clean = clean.substring(start, end + 1);
  }
  return clean;
};

/**
 * Fetches the latest cricket news using Google Search Grounding.
 */
export const fetchCricketNews = async (): Promise<NewsResponse> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = "What are the top 5 most important cricket news headlines right now? Provide a summary.";

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "No news available at the moment.";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return {
      text,
      groundingChunks: groundingChunks as any[], 
    };
  } catch (error) {
    console.error("Error fetching news:", error);
    throw new Error("Failed to fetch latest cricket news.");
  }
};

/**
 * Generates a detailed player profile using Search + JSON parsing to ensure up-to-date stats and form.
 */
export const fetchPlayerProfile = async (playerName: string): Promise<PlayerProfileData> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Search for the detailed profile, career statistics (Batting: Matches, Runs, Avg, SR; Bowling: Matches, Wickets, Avg, Econ), and VERY RECENT form (last 3 months) of cricketer "${playerName}".
      
      INSTRUCTIONS:
      1. Output ONLY raw valid JSON. Do NOT use markdown code blocks. Do NOT add any conversational text or apologies.
      2. If you absolutely cannot find the player, return a JSON object with a property "error": "Player not found".
      
      The JSON must match this structure:
      {
        "name": "Full Name",
        "role": "Role",
        "country": "Country",
        "battingStyle": "Right/Left-hand bat",
        "bowlingStyle": "Style or None",
        "bio": "Short biography",
        "careerHighlights": ["highlight 1", "highlight 2"],
        "recentForm": "Summary of performance in last few series/matches",
        "majorTeams": ["Team A", "Team B"],
        "battingStats": {
          "matches": "100", "runs": "5000", "average": "50.00", "strikeRate": "85.0"
        },
        "bowlingStats": {
          "matches": "100", "wickets": "150", "average": "25.00", "economy": "4.5", "bestFigures": "5/20"
        }
      }
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    
    try {
      const jsonStr = cleanJsonString(text);
      const data = JSON.parse(jsonStr);
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      return data as PlayerProfileData;
    } catch (e) {
      console.error("Failed to parse player profile JSON:", text);
      throw new Error("Could not generate a valid profile for this player.");
    }
  } catch (error) {
    console.error("Error fetching player profile:", error);
    throw error;
  }
};

/**
 * Fetches Live, Recent, and Upcoming match data.
 */
export const fetchMatchData = async (): Promise<MatchData> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Search for:
      1. Current LIVE cricket matches happening right now worldwide (scores, teams, current status).
      2. Completed cricket match results from the last 48 hours.
      3. Upcoming cricket matches for the next 3 days.

      INSTRUCTIONS:
      1. Output ONLY raw valid JSON. Do NOT use markdown. Do NOT output conversational text.
      2. Return an object with three arrays: "live", "recent", "upcoming".

      Structure for each item in the arrays:
      {
        "team1": "Team Name",
        "team2": "Team Name",
        "score": "Current score (e.g., 'IND 200/3 vs AUS') or Final Score",
        "status": "Live" or "Completed" or "Upcoming",
        "date": "Date and Time",
        "venue": "Stadium, City",
        "result": "Result string (e.g. 'IND won by 5 wkts') or null if not completed"
      }
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    try {
      const jsonStr = cleanJsonString(text);
      return JSON.parse(jsonStr) as MatchData;
    } catch (e) {
      console.error("Match JSON Parse Error", text);
      return { live: [], recent: [], upcoming: [] };
    }
  } catch (e) {
    console.error("Error fetching match data", e);
    return { live: [], recent: [], upcoming: [] };
  }
};

/**
 * Fetches current team standings for the most relevant active tournament.
 */
export const fetchStandings = async (): Promise<TeamStanding[]> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Search for the points table or standings of the currently most popular active cricket tournament (e.g., IPL, World Cup, Big Bash, etc.). 
      If no major T20/ODI league is currently active, provide the latest "ICC Men's T20I Team Rankings".

      INSTRUCTIONS:
      1. Output ONLY raw valid JSON array. Do NOT use markdown.
      2. Each object must have: "rank" (number), "team" (string), "played" (number), "won" (number), "lost" (number), "points" (number), "nrr" (string).

      JSON Array Format only.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    try {
      const jsonStr = cleanJsonString(text);
      return JSON.parse(jsonStr) as TeamStanding[];
    } catch (e) {
      console.error("Standings JSON Parse Error", text);
      return [];
    }
  } catch (e) {
    console.error("Error fetching standings", e);
    return [];
  }
};

/**
 * Chat interface helper.
 */
export const createChatSession = () => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: "You are a wise and witty cricket analyst (like a mix of Richie Benaud and Harsha Bhogle). You know the rules, history, and current stats deeply. Keep answers concise but insightful.",
    },
  });
};
