# Testing Strategy & Specification

## Overview
This project prioritizes high-value End-to-End (E2E) flows and integration testing to ensure the critical user journey (Story Generation) works reliably.

## Test Levels

### 1. Integration Tests (Critical)
**Location**: Jest / `src/__tests__` (to be created)
**Focus**: Verification of the AI Service and Database interactions.

*   **Story Service spec**:
    *   Should validate configuration input (Zod).
    *   Should call AI provider (Gemini) with correct prompt.
    *   Should save result to Database.

### 2. Manual Verification / QA Scripts (Current Strategy)
**Location**: `task.md` checklists and `walkthrough.md` proofs.
**Flows**:
1.  **Sign Up**: Create new account using Credentials auth.
2.  **Generate**: Complete story wizard -> Call API -> Receive result.
3.  **Review**: Verify story appears in dashboard list.

## Future TDD Implementation
To adopt TDD for future features, follow this workflow:

1.  **Write Spec**: Define the feature in this file or a ticket.
2.  **Write Test**: Create a `.test.ts` file in `src/__tests__/integration`.
    ```typescript
    it('should generate a story only when authenticated', async () => { ... })
    ```
3.  **Implement**: Write the code to pass the test.
4.  **Refactor**: Cleanup.

## Running Tests
```bash
# Run unit/integration tests
npm test

# Run specific test file
npm test -- src/lib/ai-service.test.ts
```
