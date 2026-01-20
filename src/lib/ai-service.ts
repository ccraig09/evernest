import { GoogleGenAI, Type } from "@google/genai";
import {
  StoryGenerationConfig,
  StoryGenerationResult,
  FaithPreference,
  StoryTheme,
  AIProvider,
  STORY_LENGTH_WORD_COUNTS,
  ChildStatus,
  AgeGroup,
} from "./types";

/**
 * Construct the story generation prompt based on config
 */
export function constructPrompt(config: StoryGenerationConfig): string {
  const {
    theme,
    length,
    faithPreference,
    parentOneName,
    parentTwoName,
    babyNickname,
    dueDate,
    childStatus = ChildStatus.PRENATAL,
    ageGroup,
  } = config;
  const wordCount = STORY_LENGTH_WORD_COUNTS[length];

  const isBorn = childStatus === ChildStatus.BORN;

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
    themeContext = isBorn
      ? "Choose a calming, random theme suitable for a young child."
      : "Choose a calming, random theme suitable for a baby in the womb.";
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

  const dateContext =
    dueDate && !isBorn ? `The baby is expected around ${dueDate}.` : "";

  // Age Group Logic
  let ageInstruction = "";
  if (isBorn && ageGroup) {
    switch (ageGroup) {
      case AgeGroup.NEWBORN: // 0-3 months
        ageInstruction =
          "For a Newborn (0-3 months): Focus on high-contrast imagery (black, white, red), slow pacing, and very simple, repetitive sounds. Use soothing rhythms.";
        break;
      case AgeGroup.INFANT: // 3-12 months
        ageInstruction =
          "For an Infant (3-12 months): Focus on naming familiar objects, simple actions (clapping, waving), and sensory descriptions (soft, bright, loud).";
        break;
      case AgeGroup.TODDLER: // 1-3 years
        ageInstruction =
          "For a Toddler (1-3 years): Include a simple narrative with a clear beginning, middle, and end. Use repetition, familiar routines, and involve the child (e.g., 'Can you see the moon?').";
        break;
      case AgeGroup.PRESCHOOL: // 3-5 years
        ageInstruction =
          "For a Preschooler (3-5 years): Use slightly more complex sentences, focus on emotions, friendship, and curiosity. Encourage imagination.";
        break;
    }
  }

  const personaInstruction = isBorn
    ? `You are a gentle, warm, and poetic storyteller for a young child. Write a soothing bedtime story designed to be read aloud by parents. ${ageInstruction} Focus on helping the child discover the world through the senses.`
    : `You are a gentle, warm, and poetic prenatal storytelling companion. Write a soothing bedtime story designed to be read aloud by parents to their unborn baby. Use descriptive language to build a bridge between the womb and the world, mentioning the beauty of light, the rhythm of voices, and the promise of a world full of colors, animals, and scenery.`;

  return `
${personaInstruction}

${themeContext}
Include sensory details: Mention gentle sounds (like a soft bell or wind), vivid colors (like soft gold or deep blue), and simple shapes (like the curve of a moon or a round bubble). If appropriate, weave in the presence of friendly animals or peaceful scenery.
Keep the story between ${wordCount.min} and ${wordCount.max} words.
${toneInstruction}
${babyContext}
${parentContext}
${dateContext}

The story should be rhythmic, calming, and foster a deep sense of safety, curiosity, and love.
Help the baby/child begin to "map" the wonderful world they are in or transitioning to.
Avoid any scary elements, loud noises, or negative conflict.
Use simple, melodic language.
Ensure every sentence ends with proper punctuation.
Do not add spaces before punctuation marks like periods, commas, or question marks.
Format the content with paragraph breaks for readability.

Return the result strictly as a JSON object with the keys: "title" and "content".
  `.trim();
}

/**
 * Generate a story using Google Gemini
 */
export async function generateStory(
  config: StoryGenerationConfig,
): Promise<StoryGenerationResult> {
  // Enforce Gemini usage
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt = constructPrompt(config);

  try {
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
      jsonResponse.content = jsonResponse.content
        .replace(/([.!?])([A-Z])/g, "$1 $2") // Ensure space after punctuation
        .replace(/\s+([.,!?])/g, "$1"); // Remove space before punctuation
    }

    return jsonResponse;
  } catch (error) {
    console.error("Error generating story with Gemini:", error);
    throw new Error(
      "Failed to generate a calm story. Please try again gently.",
    );
  }
}

/**
 * Get available AI providers based on configured API keys
 */
export function getAvailableProviders(): AIProvider[] {
  // Only Gemini is supported
  const providers: AIProvider[] = [];
  if (process.env.GEMINI_API_KEY) {
    providers.push(AIProvider.GEMINI);
  }
  return providers;
}

/**
 * Get the default provider
 */
export function getDefaultProvider(): AIProvider {
  return AIProvider.GEMINI;
}

/**
 * Construct the story generation prompt based on config
 */
