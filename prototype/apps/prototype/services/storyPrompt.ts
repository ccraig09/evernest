import { StoryPromptParams, FaithPreference, StoryTheme, StoryLength } from '../types';

export const constructStoryPrompt = (params: StoryPromptParams): string => {
  const { theme, length, parentNames, babyNickname, faithPreference, dueDate } = params;

  let toneInstruction = '';
  switch (faithPreference) {
    case FaithPreference.FAITH_BASED:
      toneInstruction = 'Include gentle references to God\'s love, blessings, or prayers suitable for a general faith perspective.';
      break;
    case FaithPreference.SPIRITUAL:
      toneInstruction = 'Focus on universal connection, light, energy, and the miracle of life.';
      break;
    case FaithPreference.NON_RELIGIOUS:
      toneInstruction = 'Focus solely on love, biology, nature, and emotional bonding without spiritual references.';
      break;
  }

  const lengthInstruction = length === StoryLength.SHORT 
    ? 'Keep the story between 200 and 300 words.' 
    : 'Keep the story between 350 and 500 words.';

  let themeContext = '';
  if (theme === StoryTheme.SURPRISE) {
    themeContext = 'Choose a calming, random theme suitable for a baby in the womb.';
  } else {
    themeContext = `The theme of the story is: ${theme}.`;
  }

  const nameContext = babyNickname 
    ? `The baby is affectionately called "${babyNickname}".` 
    : 'Refer to the baby as "little one" or "baby".';

  const parentContext = parentNames
    ? `The parent(s) reading this are named: ${parentNames}.`
    : '';
  
  const dateContext = dueDate 
    ? `The baby is expected around ${dueDate}.` 
    : '';

  return `
    You are a gentle, warm, and poetic prenatal storytelling companion. 
    Write a soothing bedtime story designed to be read aloud by parents to their unborn baby.
    
    ${themeContext}
    ${lengthInstruction}
    ${toneInstruction}
    ${nameContext}
    ${parentContext}
    ${dateContext}

    The story should be rhythmic, calming, and foster a deep sense of safety and love.
    Avoid any scary elements, loud noises, or negative conflict.
    Use simple, melodic language.
    Ensure every sentence ends with proper punctuation and a space before the next sentence begins.

    Return the result strictly as a JSON object with the keys: "title" and "content".
  `;
};