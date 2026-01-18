# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
This is a **Living Document** that must be updated with every significant change.

## [Unreleased]
### Added
- `TESTING.md` to document testing strategy and specifications.
- `DEPLOYMENT.md` to guide hosting and deployment processes.
- End-to-end testing user flow for Story Generation.

### Changed
- Migrating database connection from local Docker container to Serverless (Neon) architecture.
- Refactoring `ai-service.ts` to exclusively use Google Gemini interactions.
- Updating `README.md` to reflect new architecture.

### Removed
- OpenAI integration and dependency.
- Local Docker dependency requirement for development (optionalized).

## [0.1.0] - 2026-01-17
### Added
- Initial project scaffold with Next.js 16.
- PostgreSQL database setup with Prisma & Docker.
- Basic Authentication with NextAuth.
- Story Generation feature (Dual support for OpenAI/Gemini).
- User Dashboard for story management.
