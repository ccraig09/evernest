# EverNest Technical Roadmap & Strategy

This living document tracks architectural decisions, technical debt, and strategic improvements for the EverNest project. It serves as a high-level guide for developers and AI agents to understand the *trajectory* of the codebase.

## 🏗️ Architectural Strategy

### 1. Robust Production Deployment (Priority: High)
*   **Context**: We deploy to Vercel with a Neon Database.
*   **Goal**: Ensure zero-downtime deployments and data integrity.
*   **Action Items**:
    - [ ] **Vercel Build Command**: Update to `npx prisma migrate deploy && next build` to ensure schema sync.
    - [ ] **Environment Validation**: Ensure all ENV vars are typed and checked at build time (e.g., using `t3-env` or similar pattern).

### 2. Reliability & Monitoring (Priority: High)
*   **Context**: Currently relying on logs.
*   **Goal**: Proactive error detection.
*   **Action Items**:
    - [ ] **Error Tracking**: Integrate Sentry for frontend/backend error reporting.
    - [ ] **Performance Monitoring**: Use Vercel Analytics to track Web Vitals.

### 3. AI Service Scalability (Priority: Medium)
*   **Context**: Story generation takes 5-10s. Vercel functions have timeouts.
*   **Goal**: Decouple generation from the HTTP request-response cycle.
*   **Action Items**:
    - [ ] **Background Jobs**: Implement a queue system (e.g., Inngest, QStash) to handle story generation asynchronously.
    - [ ] **Prompt Management**: Extract hardcoded prompts from `ai-service.ts` into a dedicated configuration file or database table for A/B testing.

### 4. Codebase Hygiene & Maintenance (Priority: Medium)
*   **Context**: Prototype code co-exists with production code.
*   **Goal**: Clean, maintainable separation of concerns.
*   **Action Items**:
    - [ ] **Cleanup**: Move or remove the `prototype/` directory.
    - [ ] **Strict Typing**: Ensure all `any` types are removed (checked via CI).
    - [ ] **Testing**: Maintain >80% coverage on core logic (`story-service`, `ai-service`).

## 🔮 Future Features (Backlog)

*   **Audio Narration**: Use Text-to-Speech (Google/OpenAI) to read stories aloud.
*   **Story Library**: Advanced filtering and search for saved stories.
*   **Social Sharing**: Generate sharable images/links for stories.

---

*Last Updated: January 20, 2026*
