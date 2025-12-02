
import { GoogleGenAI } from "@google/genai";
import { MODEL_NAME } from "./constants.js";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates the README markdown based on project details.
 * @param {Object} details - The project details collected from the UI.
 * @returns {Promise<string>} - The generated markdown string.
 */
export async function generateReadme(details) {
  const prompt = `
    You are an expert developer. Create a professional README.md (Markdown) for:
    Project Name: ${details.projectName}
    Tagline: ${details.tagline}
    Description: ${details.description}
    Tech Stack: ${details.techStack}
    Features: ${details.features}
    Installation: ${details.installation}
    Usage: ${details.usage}
    Contributing: ${details.contributing ? 'Yes' : 'No'}
    License: ${details.license}

    Structure: Title, Badges (placeholder), Description, Tech Stack, Features, Installation, Usage, Contributing, License.
    Return ONLY raw markdown. Do not wrap in \`\`\`markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    return response.text || "Failed to generate content.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Could not generate README. Please check your API Key and try again.");
  }
}
