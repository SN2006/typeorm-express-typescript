# Task Management API

RESTful API for task management built with TypeScript, Express, and TypeORM.

## Entities Description

### User

User entity represents system users with authentication and authorization capabilities.

**Fields:**

- `id` - Unique identifier (auto-generated)
- `email` - User's email (unique, required)
- `password` - Hashed password (required)
- `username` - User's username (unique, optional)
- `name` - User's full name (optional)
- `role` - User role: `STANDARD` or `ADMINISTRATOR` (default: `STANDARD`)
- `language` - Preferred language (default: `en-US`)
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp

**Relationships:**

- One user can have many States (one-to-many)
- One user can have many TaskTypes (one-to-many)
- One user can have many Tasks (one-to-many)

### State

State entity represents task statuses (e.g., "To Do", "In Progress", "Done"). Each user can create their own custom states.

**Fields:**

- `id` - Unique identifier (auto-generated)
- `name` - State name (max 100 characters, required)
- `userId` - Reference to the owner user
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

**Relationships:**

- Many-to-one with User (each state belongs to one user)

### TaskType

TaskType entity represents task categories or types (e.g., "Bug", "Feature", "Documentation"). Each user can create their own custom task types.

**Fields:**

- `id` - Unique identifier (auto-generated)
- `name` - Task type name (max 100 characters, required)
- `userId` - Reference to the owner user
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

**Relationships:**

- Many-to-one with User (each task type belongs to one user)

### Task

Task entity represents individual tasks with all their details.

**Fields:**

- `id` - Unique identifier (auto-generated)
- `title` - Task title (max 200 characters, required)
- `description` - Task description (optional)
- `priority` - Task priority: `LOW`, `MEDIUM`, or `HIGH` (required)
- `userId` - Reference to the owner user (auto-assigned, cannot be changed)
- `stateId` - Reference to the task's state (required, must belong to user)
- `taskTypeId` - Reference to the task's type (required, must belong to user)
- `dueDate` - Task due date (required)
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

**Relationships:**

- Many-to-one with User (each task belongs to one user)
- Many-to-one with State (each task has one state)
- Many-to-one with TaskType (each task has one type)

**Validation Rules:**

- When creating a task, all fields except `description` are required
- `stateId` and `taskTypeId` must reference entities that belong to the authenticated user
- `userId` is automatically assigned from JWT token and cannot be modified

## API Endpoints

Base URL: `/api/v1`

### Authentication Endpoints

| Method | Endpoint                | Description             | Authentication |
| ------ | ----------------------- | ----------------------- | -------------- |
| POST   | `/auth/register`        | Register a new user     | No             |
| POST   | `/auth/login`           | Login and get JWT token | No             |
| POST   | `/auth/change-password` | Change user password    | Required       |

### User Endpoints

| Method | Endpoint     | Description    | Authentication | Authorization                |
| ------ | ------------ | -------------- | -------------- | ---------------------------- |
| GET    | `/users`     | Get all users  | Required       | Any                          |
| GET    | `/users/:id` | Get user by ID | Required       | Any                          |
| PATCH  | `/users/:id` | Update user    | Required       | ADMINISTRATOR or own profile |
| DELETE | `/users/:id` | Delete user    | Required       | ADMINISTRATOR or own profile |

### State Endpoints

| Method | Endpoint      | Description               | Authentication        |
| ------ | ------------- | ------------------------- | --------------------- |
| GET    | `/states`     | Get all states            | Required              |
| GET    | `/states/my`  | Get current user's states | Required              |
| GET    | `/states/:id` | Get state by ID           | Required              |
| POST   | `/states`     | Create new state          | Required              |
| PATCH  | `/states/:id` | Update state              | Required (owner only) |
| DELETE | `/states/:id` | Delete state              | Required (owner only) |

### Task Type Endpoints

| Method | Endpoint          | Description                   | Authentication        |
| ------ | ----------------- | ----------------------------- | --------------------- |
| GET    | `/task-types`     | Get all task types            | Required              |
| GET    | `/task-types/my`  | Get current user's task types | Required              |
| GET    | `/task-types/:id` | Get task type by ID           | Required              |
| POST   | `/task-types`     | Create new task type          | Required              |
| PATCH  | `/task-types/:id` | Update task type              | Required (owner only) |
| DELETE | `/task-types/:id` | Delete task type              | Required (owner only) |

### Task Endpoints

| Method | Endpoint     | Description              | Authentication        |
| ------ | ------------ | ------------------------ | --------------------- |
| GET    | `/tasks`     | Get all tasks            | Required              |
| GET    | `/tasks/my`  | Get current user's tasks | Required              |
| GET    | `/tasks/:id` | Get task by ID           | Required              |
| POST   | `/tasks`     | Create new task          | Required              |
| PATCH  | `/tasks/:id` | Update task              | Required (owner only) |
| DELETE | `/tasks/:id` | Delete task              | Required (owner only) |

**Note:** All endpoints require JWT authentication except registration and login. Include the JWT token in the `Authorization` header as `Bearer <token>`.

## Requirements

- [Node v16+](https://nodejs.org/)
- [Docker](https://www.docker.com/)

## Running

_Easily set up a local development environment with single command!_

- Clone the repo
- `npm run docker:dev` 🚀

Visit [localhost:4000](http://localhost:4000/) or if using Postman grab [config](/postman).

### What happened 💥

Containers created:

- Postgres database container
- Node (v16 Alpine) container with running RESTful API service
- Node container instance to run tests locally or in CI

## Features

- [Express](https://github.com/expressjs/express) framework
- [TypeScript v4](https://github.com/microsoft/TypeScript) codebase
- [TypeORM](https://typeorm.io/) using Data Mapper pattern
- [Docker](https://www.docker.com/) environment
- JWT authentication and role-based authorization
- Request validation middleware
- Consistent error response schema
- Unit and integration tests with [Mocha](https://mochajs.org/) and [Chai](https://www.chaijs.com/)
- Linting with [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/) code formatter
- Git hooks with [Husky](https://github.com/typicode/husky) and [lint-staged](https://github.com/okonet/lint-staged)

## Practical Work Reports

This section contains detailed reports and documentation for practical assignments:

- [Workshop 5](workshop_reports/workshop5/WORKSHOP_5.md) - Expanding the API
- [Workshop 6](workshop_reports/workshop6/WORKSHOP_6.md) - Expanding the API
