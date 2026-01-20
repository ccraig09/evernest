# Testing Strategy & Specification

## Overview

Comprehensive test suite with **109 tests** achieving **93.42% code coverage**. Tests include unit tests, integration tests, and component tests.

## Test Structure

```
src/__tests__/
├── utils.test.ts           # Utility function tests
├── setup/
│   └── mocks.ts            # Shared test mocks
├── unit/
│   ├── schemas.test.ts     # Zod schema validation (28 tests)
│   ├── ai-service.test.ts  # Prompt construction (26 tests)
│   └── server-utils.test.ts # Config hashing (16 tests)
├── integration/
│   └── story-service.test.ts # CRUD operations (16 tests)
└── components/
    └── ui.test.tsx         # UI component rendering (11 tests)
```

## Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- src/__tests__/unit/schemas.test.ts

# Run tests in watch mode
npm test -- --watch
```

## Test Categories

| Category    | Location       | Description                                     |
| ----------- | -------------- | ----------------------------------------------- |
| Unit        | `unit/`        | Pure function logic (schemas, prompts, hashing) |
| Integration | `integration/` | Service layer with mocked DB/AI                 |
| Component   | `components/`  | React component rendering                       |

## Coverage Report

| Metric     | Coverage |
| ---------- | -------- |
| Statements | 93.42%   |
| Branches   | 96.55%   |
| Functions  | 94.44%   |
| Lines      | 93.42%   |

## Writing New Tests

### Unit Test Example

```typescript
import { storyGenerationConfigSchema } from "@/lib/schemas";

describe("storyGenerationConfigSchema", () => {
  it("should accept valid config", () => {
    const result = storyGenerationConfigSchema.safeParse(validConfig);
    expect(result.success).toBe(true);
  });
});
```

### Integration Test Example

```typescript
// Mock dependencies before imports
jest.mock("@/lib/db", () => ({ db: { story: { findFirst: jest.fn() } } }));

import { checkForDuplicate } from "@/server/story-service";

describe("checkForDuplicate", () => {
  it("should detect existing stories", async () => {
    mockedDb.story.findFirst.mockResolvedValue({ id: "test" });
    const result = await checkForDuplicate(userId, hash);
    expect(result.isDuplicate).toBe(true);
  });
});
```

## Notes

- **Jest + Next.js**: Uses `next/jest` for automatic configuration
- **Mocking ESM**: `@google/genai` is mocked inline to avoid ESM transform issues
- **Edge Runtime**: API routes and middleware require edge runtime and are tested manually
