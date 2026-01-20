import { constructPrompt } from "../src/lib/ai-service.ts";
import {
  ChildStatus,
  FaithPreference,
  StoryLength,
  StoryTheme,
} from "../src/lib/types.ts";

// Mock environment for the test
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
  console.log(prenatalPrompt);
}

if (prenatalPrompt.includes("May 2026")) {
  console.log("✅ PASSED: Contains due date");
} else {
  console.log("❌ FAILED: Missing due date");
}

// Test 2: Born
const bornConfig = {
  ...baseConfig,
  childStatus: ChildStatus.BORN,
  birthDate: "2025-01-01", // Should technically be passed but prompt logic uses status
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
  console.log(bornPrompt);
}

if (!bornPrompt.includes("expected around")) {
  console.log("✅ PASSED: Does excludes due date context");
} else {
  console.log("❌ FAILED: Includes due date context erroneously");
}

console.log("\nTests Complete.");
