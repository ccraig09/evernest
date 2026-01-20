import { constructPrompt } from "../lib/ai-service";
import {
  ChildStatus,
  FaithPreference,
  StoryLength,
  StoryTheme,
} from "../lib/types";

// Mock environment
process.env.GEMINI_API_KEY = "mock_key";

console.log("Testing Born Story Prompt Construction...\n");

const baseConfig = {
  theme: StoryTheme.NATURE_CALM,
  length: StoryLength.SHORT,
  faithPreference: FaithPreference.NON_RELIGIOUS,
  parentOneName: "Dad",
  babyNickname: "Bean",
};

// Test 1: Prenatal (Default)
const prenatalConfig = {
  ...baseConfig,
  childStatus: ChildStatus.PRENATAL,
  dueDate: "May 2026",
};

const prenatalPrompt = constructPrompt(prenatalConfig);
console.log("--- PRENATAL PROMPT ---");
if (
  prenatalPrompt.includes("prenatal storytelling companion") &&
  prenatalPrompt.includes("unborn baby")
) {
  console.log("✅ PASSED: Contains prenatal persona");
} else {
  console.log("❌ FAILED: Missing prenatal persona");
}

// Test 2: Born
const bornConfig = {
  ...baseConfig,
  childStatus: ChildStatus.BORN,
  birthDate: "2025-01-01",
};

const bornPrompt = constructPrompt(bornConfig);
console.log("\n--- BORN PROMPT ---");
if (
  bornPrompt.includes("storyteller for a young baby") &&
  !bornPrompt.includes("unborn")
) {
  console.log("✅ PASSED: Contains born persona");
} else {
  console.log("❌ FAILED: Incorrect persona");
}

console.log("\nTests Complete.");
