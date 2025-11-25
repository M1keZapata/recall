import { GoogleGenAI, SchemaType } from "@google/genai";
import { Bookmark, ConnectionInsight } from "../types";

// Initialize Gemini client
// Note: In a real production app, you might proxy this through a backend to protect the key,
// but for this client-side demo as per instructions, we use process.env.API_KEY directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `You are an intelligent personal knowledge assistant for a bookmarking app called "Recall". 
Your goal is to analyze content saved by the user, summarize it concisely, and later find serendipitous connections between seemingly unrelated items.
Be concise, insightful, and focus on the "why" - why did the user save this?`;

/**
 * Helper to convert File to Base64
 */
export const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve({
        inlineData: {
          data: base64String,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Analyzes a single bookmark (Image or Video)
 */
export const analyzeBookmarkMedia = async (file: File, url: string, type: 'image' | 'video'): Promise<{ title: string; summary: string; tags: string[] }> => {
  const modelName = 'gemini-3-pro-preview'; // Capable of both complex image and video reasoning

  try {
    const mediaPart = await fileToGenerativePart(file);
    
    const prompt = `Analyze this ${type} from ${url}. 
    1. Give it a short, catchy title.
    2. Write a 1-sentence summary of the main idea or content.
    3. Generate 3-5 relevant descriptive tags (lowercase).
    
    Return JSON format: { "title": string, "summary": string, "tags": string[] }`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: [
          mediaPart,
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        systemInstruction: SYSTEM_INSTRUCTION
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    return JSON.parse(text);

  } catch (error) {
    console.error("Gemini analysis failed:", error);
    throw error;
  }
};

/**
 * Finds connections between bookmarks (The "Recap" feature)
 */
export const findConnections = async (bookmarks: Bookmark[]): Promise<{ summary: string; insights: ConnectionInsight[] }> => {
  const modelName = 'gemini-3-pro-preview'; // Strong reasoning model for connections

  if (bookmarks.length === 0) {
    return { summary: "No bookmarks to analyze yet.", insights: [] };
  }

  // Serialize bookmarks for the prompt
  const bookmarksText = bookmarks.map(b => 
    `ID: ${b.id} | Type: ${b.platform} | Title: ${b.title || 'Untitled'} | Summary: ${b.summary || 'No summary'}`
  ).join('\n');

  const prompt = `Here is a list of bookmarks the user saved recently:\n\n${bookmarksText}\n\n
  Task:
  1. Write a friendly, "push-notification style" daily recap summary (max 2 sentences) that makes the user feel good about what they learned.
  2. Find up to 3 interesting "Connections" or themes between these items. Look for subtle links (e.g., a design tutorial and a coding tool both related to productivity).
  
  Return JSON:
  {
    "summary": "...",
    "insights": [
      { "title": "...", "description": "...", "relatedBookmarkIds": ["ID1", "ID2"] }
    ]
  }`;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction: SYSTEM_INSTRUCTION,
        // Using a higher thinking budget for better connection finding logic if needed, 
        // but keeping it simple for speed here unless complex.
      }
    });

     const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    return JSON.parse(text);

  } catch (error) {
     console.error("Gemini connection analysis failed:", error);
     throw error;
  }
}
