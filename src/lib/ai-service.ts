import OpenAI from "openai";
import { GoogleGenAI, Type } from "@google/genai";
import {
  StoryGenerationConfig,
  StoryGenerationResult,
  FaithPreference,
  StoryTheme,
  AIProvider,
  STORY_LENGTH_WORD_COUNTS,
} from "./types";

/**
 * Construct the story generation prompt based on config
 */
function constructPrompt(config: StoryGenerationConfig): string {
  const {
    theme,
    length,
    faithPreference,
    parentOneName,
    parentTwoName,
    babyNickname,
    dueDate,
  } = config;
  const wordCount = STORY_LENGTH_WORD_COUNTS[length];

  // Faith/tone instruction
  let toneInstruction = "";
  switch (faithPreference) {
    case FaithPreference.FAITH_BASED:
      toneInstruction =
        "Include gentle references to God's love, blessings, or prayers suitable for a general faith perspective.";
      break;
    case FaithPreference.SPIRITUAL:
      toneInstruction =
        "Focus on universal connection, light, energy, and the miracle of life.";
      break;
    case FaithPreference.NON_RELIGIOUS:
      toneInstruction =
        "Focus solely on love, biology, nature, and emotional bonding without spiritual references.";
      break;
  }

  // Theme context
  let themeContext = "";
  if (theme === StoryTheme.SURPRISE) {
    themeContext =
      "Choose a calming, random theme suitable for a baby in the womb.";
  } else {
    const themeLabels: Record<StoryTheme, string> = {
      [StoryTheme.COLORS_SHAPES]: "Colors & Shapes",
      [StoryTheme.LOVE_BONDING]: "Love & Bonding",
      [StoryTheme.NATURE_CALM]: "Nature & Calm",
      [StoryTheme.SPIRITUAL_LIGHT]: "Spiritual & Light",
      [StoryTheme.RHYTHM_SOUND]: "Rhythm & Sound",
      [StoryTheme.FAMILY_LEGACY]: "Family Legacy",
      [StoryTheme.DISCIPLINE_VALUES]: "Discipline & Values",
      [StoryTheme.SURPRISE]: "Surprise",
    };
    themeContext = `The theme of the story is: ${themeLabels[theme]}.`;
  }

  // Name contexts
  const babyContext = babyNickname
    ? `The baby is affectionately called "${babyNickname}".`
    : 'Refer to the baby as "little one" or "baby".';

  let parentContext = "";
  if (parentOneName && parentTwoName) {
    parentContext = `The parents reading this are named ${parentOneName} and ${parentTwoName}.`;
  } else if (parentOneName) {
    parentContext = `The parent reading this is named ${parentOneName}.`;
  }

  const dateContext = dueDate ? `The baby is expected around ${dueDate}.` : "";

  return `
You are a gentle, warm, and poetic prenatal storytelling companion. 
Write a soothing bedtime story designed to be read aloud by parents to their unborn baby.

${themeContext}
Keep the story between ${wordCount.min} and ${wordCount.max} words.
${toneInstruction}
${babyContext}
${parentContext}
${dateContext}

The story should be rhythmic, calming, and foster a deep sense of safety and love.
Avoid any scary elements, loud noises, or negative conflict.
Use simple, melodic language.
Ensure every sentence ends with proper punctuation and a space before the next sentence begins.
Format the content with paragraph breaks for readability.

Return the result strictly as a JSON object with the keys: "title" and "content".
  `.trim();
}

/**
 * Generate a story using OpenAI GPT-4o
 */
async function generateWithOpenAI(
  config: StoryGenerationConfig
): Promise<StoryGenerationResult> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const prompt = constructPrompt(config);

  const completion = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          'You are a gentle, warm storyteller for unborn babies. Always respond with valid JSON containing "title" and "content" keys.',
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 1500,
    response_format: { type: "json_object" },
  });

  const text = completion.choices[0]?.message?.content;

  if (!text) {
    throw new Error("Received empty response from OpenAI.");
  }

  const jsonResponse = JSON.parse(text) as StoryGenerationResult;

  // Post-processing to fix common grammar spacing issues
  if (jsonResponse.content) {
    jsonResponse.content = jsonResponse.content.replace(
      /([.!?])([A-Z])/g,
      "$1 $2"
    );
  }

  return jsonResponse;
}

/**
 * Generate a story using Google Gemini
 */
async function generateWithGemini(
  config: StoryGenerationConfig
): Promise<StoryGenerationResult> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt = constructPrompt(config);

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.STRING,
            description: "The gentle title of the story.",
          },
          content: {
            type: Type.STRING,
            description:
              "The full text of the story, formatted with paragraphs.",
          },
        },
        required: ["title", "content"],
      },
      temperature: 0.7,
    },
  });

  const text = response.text;

  if (!text) {
    throw new Error("Received empty response from Gemini.");
  }

  const jsonResponse = JSON.parse(text) as StoryGenerationResult;

  // Post-processing to fix common grammar spacing issues
  if (jsonResponse.content) {
    jsonResponse.content = jsonResponse.content.replace(
      /([.!?])([A-Z])/g,
      "$1 $2"
    );
  }

  return jsonResponse;
}

/**
 * Get available AI providers based on configured API keys
 */
export function getAvailableProviders(): AIProvider[] {
  const providers: AIProvider[] = [];

  // Gemini is listed first as it's the primary/default
  if (process.env.GEMINI_API_KEY) {
    providers.push(AIProvider.GEMINI);
  }

  if (process.env.OPENAI_API_KEY) {
    providers.push(AIProvider.OPENAI);
  }

  return providers;
}

/**
 * Get the default provider (Gemini is the primary provider)
 */
export function getDefaultProvider(): AIProvider {
  // Gemini is the default/primary provider
  if (process.env.GEMINI_API_KEY) {
    return AIProvider.GEMINI;
  }
  // OpenAI is only used if explicitly available and Gemini isn't
  if (process.env.OPENAI_API_KEY) {
    return AIProvider.OPENAI;
  }
  throw new Error(
    "No AI provider configured. Please set GEMINI_API_KEY (recommended) or OPENAI_API_KEY."
  );
}

/**
 * Generate a story using the specified AI provider
 * No automatic fallback - uses only the specified or default provider
 */
export async function generateStory(
  config: StoryGenerationConfig
): Promise<StoryGenerationResult> {
  const provider = config.aiProvider || getDefaultProvider();

  try {
    switch (provider) {
      case AIProvider.OPENAI:
        return await generateWithOpenAI(config);
      case AIProvider.GEMINI:
        return await generateWithGemini(config);
      default:
        throw new Error(`Unknown AI provider: ${provider}`);
    }
  } catch (error) {
    // Log the specific error for debugging
    console.error(`Error generating story with ${provider}:`, error);

    // Provide a user-friendly error message
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    // Check for common error types and provide helpful messages
    if (errorMessage.includes("API key")) {
      throw new Error(
        `AI provider (${provider}) API key is invalid or not configured. Please check your settings.`
      );
    }
    if (errorMessage.includes("quota") || errorMessage.includes("429")) {
      throw new Error(
        `AI provider (${provider}) has exceeded its quota. Please try again later or switch providers in Settings.`
      );
    }
    if (errorMessage.includes("not found") || errorMessage.includes("404")) {
      throw new Error(
        `AI model not available. Please try again or contact support.`
      );
    }

    throw new Error(
      "Failed to generate a calm story. Please try again gently."
    );
  }
}
