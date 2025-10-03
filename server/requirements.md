# Backend Requirements for Habyt Tracker App

## 1. Project Setup
- [x] Initialize a Node.js project with TypeScript.
- [x] Install and configure Express, Sequelize, and PostgreSQL.
- [x] Set up environment variables for development, production, and test environments.
- [x] Configure Sequelize to connect to PostgreSQL using environment variables.

## 2. Database Models
- [x] **User Model**
  - Fields: id, name, email, password, etc.
- [x] **Habyt Model**
  - Fields: id, title, description, userId (foreign key).
  - Relationship: One-to-many (User has many Habyts).
- [ ] **Completion Model** (for future development)
  - Fields: id, habytId (foreign key), date, completed (boolean), timeSpent (optional).
  - Relationship: One-to-many (Habyt has many Completions).

## 3. Fundamental Relationships
- [x] Implement User and Habyt models with a one-to-many relationship.
- [x] Ensure referential integrity between User and Habyt.

## 4. Controllers & Routes
- [/] User can create, read, update, and delete Habyts.
- [ ] Only allow users to manage their own Habyts.
- [ ] Basic authentication (JWT or session-based) for user actions.
- [ ] Implement tests for authentication logic to ensure security and correctness.
- [ ] Write tests for CRUD operations on Habyts to verify user access control.
- [ ] Add tests for model relationships and referential integrity.

## 5. Future Scalability
- [ ] Add Completion model to track daily habit completion and time spent.
- [ ] Implement endpoints for creating, updating, and viewing completions.
- [ ] Design API responses to be easily consumed by a frontend (e.g., React).

## 6. Best Practices
- [ ] Use migrations for database schema changes.
- [ ] Organize code into modules: models, controllers, routes, services.
- [ ] Write unit and integration tests for critical endpoints.
- [ ] Document API endpoints for frontend integration.

---
**Example Habyt:**  
- Title: "Code for 1 hour"

**Example Completion:**  
- Date: 26-Sept-2025, Completed: false  
- Date: 25-Sept-2025, Completed: true, Time Spent: 2hrs 30min

---

## Pre-Merge Checklist (before merging to dev branch)
> These items must be completed before merging the stable version into `dev`.

### Code Quality
- [ ] Lint passes with no errors (`npm run lint`)
- [ ] Typecheck/build passes with no errors (`npm run typecheck`)
- [ ] ESLint configured with `parserOptions.project` (type-aware enabled)

### Authentication & Security
- [x] JWT middleware (`authRequired`) implemented
- [ ] `Request` augmented with `authUser`
- [ ] Protected routes (create Habyt, delete Habyt, delete User)
- [ ] Ownership verification on DELETE Habyt/User
- [ ] Do not expose `passwordHash` in responses
- [ ] Validate `JWT_SECRET` is present on startup

### Structure & Types
- [ ] `server/src/types/` folder created (or plan for `shared/` package)
- [ ] Centralized JWT payload type
- [ ] Naming convention for DTOs / bodies (`CreateXxxBody`, `AuthTokenPayload`)

### Tests
- [ ] Test runner (Vitest or Jest) + Supertest configured
- [ ] Minimum user fixture/seed
- [ ] Test login (200 and 401)
- [ ] Test user creation (201 and duplicate 400)
- [ ] Test create Habyt authenticated (201)
- [ ] Test create Habyt without token (401)
- [ ] Test delete own Habyt (204)
- [ ] Test delete someone else's Habyt (403)

### Scripts / Automation
- [ ] `test`, `test:watch` scripts added
- [ ] Composite `verify` script (lint + typecheck + test)
- [ ] (Optional) Local/documented CI pipeline

### Documentation
- [ ] README: auth flow (signup → login → token)
- [ ] README: how to start environment (Docker + dev)
- [ ] Example requests (login, create habyt)
- [ ] `.env.example` updated

### Git / Branch
- [ ] Commits squashed or clearly structured
- [ ] PR with checklist marked
- [ ] (Optional) Tag `v0.1.0-dev` post-merge

### Final Review
- [ ] Environment variables sanitized
- [ ] No sensitive logs
- [ ] Consistent status codes
- [ ] No unused dependencies

### Next Steps (post-merge, optional)
- [ ] Rate limiting
- [ ] Refresh tokens (if applicable)
- [ ] Pagination for listings (users, habyts)
- [ ] Extract common types to `shared/`