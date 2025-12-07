import { GoogleGenAI, Type } from "@google/genai";
import { StoryPromptParams, StoryResponse } from '../types';
import { constructStoryPrompt } from './storyPrompt';

export const generateStory = async (params: StoryPromptParams): Promise<StoryResponse> => {
  // Check for API key presence
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please ensure process.env.API_KEY is available.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = constructStoryPrompt(params);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: 'The gentle title of the story.',
            },
            content: {
              type: Type.STRING,
              description: 'The full text of the story, formatted with paragraphs.',
            },
          },
          required: ["title", "content"],
        },
        temperature: 0.7, // Warm and creative but cohesive
      },
    });

    const responseText = response.text;
    
    if (!responseText) {
      throw new Error("Received empty response from AI.");
    }

    const jsonResponse = JSON.parse(responseText) as StoryResponse;
    
    // Post-processing to fix common grammar spacing issues
    // Example: "beauty.Picture" -> "beauty. Picture"
    if (jsonResponse.content) {
      jsonResponse.content = jsonResponse.content.replace(/([.!?])([A-Z])/g, '$1 $2');
    }

    return jsonResponse;

  } catch (error) {
    console.error("Error generating story:", error);
    throw new Error("Failed to generate a calm story. Please try again gently.");
  }
};