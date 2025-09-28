# Backend Requirements for Habyt Tracker App

## 1. Project Setup
- [x] Initialize a Node.js project with TypeScript.
- [x] Install and configure Express, Sequelize, and PostgreSQL.
- [x] Set up environment variables for dev, prod, and test environments.
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
- [x] Implement User and Habyt models with one-to-many relationship.
- [x] Ensure referential integrity between User and Habyt.

## 4. Controllers & Routes
- [ ] User can create, read, update, and delete Habyts.
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