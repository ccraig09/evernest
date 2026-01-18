import { GoogleGenAI, Type } from '@google/genai';
import {
  StoryGenerationConfig,
  StoryGenerationResult,
  FaithPreference,
  StoryTheme,
  STORY_LENGTH_WORD_COUNTS,
} from './types';

/**
 * Construct the story generation prompt based on config
 */
function constructPrompt(config: StoryGenerationConfig): string {
  const { theme, length, faithPreference, parentOneName, parentTwoName, babyNickname, dueDate } = config;
  const wordCount = STORY_LENGTH_WORD_COUNTS[length];

  // Faith/tone instruction
  let toneInstruction = '';
  switch (faithPreference) {
    case FaithPreference.FAITH_BASED:
      toneInstruction =
        "Include gentle references to God's love, blessings, or prayers suitable for a general faith perspective.";
      break;
    case FaithPreference.SPIRITUAL:
      toneInstruction =
        'Focus on universal connection, light, energy, and the miracle of life.';
      break;
    case FaithPreference.NON_RELIGIOUS:
      toneInstruction =
        'Focus solely on love, biology, nature, and emotional bonding without spiritual references.';
      break;
  }

  // Theme context
  let themeContext = '';
  if (theme === StoryTheme.SURPRISE) {
    themeContext = 'Choose a calming, random theme suitable for a baby in the womb.';
  } else {
    const themeLabels: Record<StoryTheme, string> = {
      [StoryTheme.COLORS_SHAPES]: 'Colors & Shapes',
      [StoryTheme.LOVE_BONDING]: 'Love & Bonding',
      [StoryTheme.NATURE_CALM]: 'Nature & Calm',
      [StoryTheme.SPIRITUAL_LIGHT]: 'Spiritual & Light',
      [StoryTheme.RHYTHM_SOUND]: 'Rhythm & Sound',
      [StoryTheme.FAMILY_LEGACY]: 'Family Legacy',
      [StoryTheme.DISCIPLINE_VALUES]: 'Discipline & Values',
      [StoryTheme.SURPRISE]: 'Surprise',
    };
    themeContext = `The theme of the story is: ${themeLabels[theme]}.`;
  }

  // Name contexts
  const babyContext = babyNickname
    ? `The baby is affectionately called "${babyNickname}".`
    : 'Refer to the baby as "little one" or "baby".';

  let parentContext = '';
  if (parentOneName && parentTwoName) {
    parentContext = `The parents reading this are named ${parentOneName} and ${parentTwoName}.`;
  } else if (parentOneName) {
    parentContext = `The parent reading this is named ${parentOneName}.`;
  }

  const dateContext = dueDate ? `The baby is expected around ${dueDate}.` : '';

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
    Ensure every sentence ends with proper punctuation.
    Do not add spaces before punctuation marks like periods, commas, or question marks.
    Format the content with paragraph breaks for readability.

    Return the result strictly as a JSON object with the keys: "title" and "content".
  `;
}

/**
 * Generate a story using Gemini AI (using the new @google/genai SDK)
 */
export async function generateStory(
  config: StoryGenerationConfig
): Promise<StoryGenerationResult> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt = constructPrompt(config);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
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
          required: ['title', 'content'],
        },
        temperature: 0.7,
      },
    });

    const text = response.text;

    if (!text) {
      throw new Error('Received empty response from AI.');
    }

    const jsonResponse = JSON.parse(text) as StoryGenerationResult;

    // Post-processing to fix common grammar spacing issues
    if (jsonResponse.content) {
      jsonResponse.content = jsonResponse.content
        .replace(/([.!?])([A-Z])/g, '$1 $2') // Ensure space after punctuation
        .replace(/\s+([.,!?])/g, '$1'); // Remove space before punctuation
    }

    return jsonResponse;
  } catch (error) {
    console.error('Error generating story:', error);
    throw new Error('Failed to generate a calm story. Please try again gently.');
  }
}
