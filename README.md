# CityConnect

> A centralized citizen service request, communication, and case-management platform for Caloocan City.

[![Status](https://img.shields.io/badge/status-in%20development-orange)](#project-status)
[![Frontend](https://img.shields.io/badge/frontend-Next.js-black)](#technology-stack)
[![Backend](https://img.shields.io/badge/backend-NestJS-e0234e)](#technology-stack)
[![Database](https://img.shields.io/badge/database-PostgreSQL-336791)](#technology-stack)
[![Auth](https://img.shields.io/badge/auth-Auth0-eb5424)](#technology-stack)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## Table of Contents

- [About the Project](#about-the-project)
- [Main Users](#main-users)
- [Core Features](#core-features)
- [Technology Stack](#technology-stack)
- [Repository Structure](#repository-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Available Commands](#available-commands)
- [Development Workflow](#development-workflow)
- [Project Status](#project-status)
- [Contributing](#contributing)
- [License](#license)

---

## About the Project

**CityConnect** is a secure digital platform designed to improve communication and service delivery between citizens and the local government of Caloocan City.

The platform provides one organized system for:

- submitting and tracking citizen requests;
- managing complaints and concerns;
- assigning work to departments and employees;
- communicating with citizens and other employees;
- managing appointments and supporting documents;
- sending notifications and status updates;
- generating administrative reports and audit records.

The project aims to replace fragmented workflows involving paper records, email, spreadsheets, Messenger, and disconnected office processes.

## Main Users

### Citizens

Citizens can submit requests, upload documents, schedule appointments, communicate with employees, and track the progress of their concerns.

### City Employees

Employees can receive assigned cases, update request statuses, request additional information, communicate with citizens, and coordinate with other employees.

### Department Administrators

Department administrators can manage department personnel, assignments, service categories, workloads, and department reports.

### System Administrators

System administrators can manage users, roles, permissions, departments, system settings, reports, and audit logs.

## Core Features

- Citizen service request submission
- Complaint and concern tracking
- Department assignment and routing
- Citizen-to-employee communication
- Internal employee communication
- Real-time status updates
- Email, push, in-app, and optional SMS notifications
- File and image attachments
- Appointment scheduling
- Administrative dashboards
- Reports and analytics
- Role-based access control
- Audit logging
- Future OCR and AI-assisted document search

## Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| Next.js | Main web application and routing |
| TypeScript | Type-safe frontend development |
| Tailwind CSS | Styling and responsive design |
| shadcn/ui with Base UI | Reusable interface components |
| TanStack Query | API data fetching and server-state management |
| React Hook Form | Form management |
| Zod | Frontend validation |
| Recharts | Dashboards and reports |
| Socket.IO Client | Real-time communication |
| Auth0 Next.js SDK | Authentication integration |

### Backend

| Technology | Purpose |
|---|---|
| NestJS | Backend application framework |
| TypeScript | Type-safe backend development |
| REST API | Main client-server communication |
| Swagger/OpenAPI | API documentation |
| Socket.IO Gateway | Real-time messaging and updates |
| Class Validator | Request validation |
| BullMQ | Background job processing |

### Authentication and Authorization

- Auth0 Universal Login
- OAuth 2.0
- OpenID Connect
- RS256 JWT access tokens
- JWKS token verification
- PostgreSQL-managed role-based access control

### Database and Infrastructure

| Technology | Purpose |
|---|---|
| PostgreSQL | Primary relational database |
| Prisma | ORM, migrations, and type-safe database access |
| pgvector | Future semantic search and RAG support |
| Redis | Caching and queue storage |
| BullMQ | Background task queues |
| Amazon S3 or Cloudflare R2 | Production document storage |
| MinIO | Local S3-compatible storage |
| Docker | Local infrastructure and containerization |
| Turborepo | Monorepo task orchestration |
| pnpm Workspaces | Dependency and workspace management |

### Planned Integrations

- Resend for email notifications
- Firebase Cloud Messaging for push notifications
- Semaphore or another approved SMS provider
- Tesseract.js for OCR
- OpenAI API for future AI-assisted features
- Sentry for monitoring and error tracking

## Repository Structure

```text
cityconnect/
├── apps/
│   ├── web/                  Next.js citizen, employee, admin, and public UI
│   ├── api/                  NestJS REST API and WebSocket gateway
│   └── worker/               NestJS BullMQ background processors
│
├── packages/
│   ├── database/             Prisma schema, migrations, generated client, seeds
│   ├── shared-types/         Shared TypeScript types
│   ├── validation/           Shared validation schemas
│   ├── config/               Shared non-secret configuration
│   ├── eslint-config/        Shared ESLint configuration
│   └── typescript-config/    Shared TypeScript configuration
│
├── infrastructure/           Docker, deployment, monitoring, and scripts
├── docs/                     Requirements, diagrams, API, security, and testing docs
├── .github/                  Workflows, issue templates, and PR templates
│
├── AGENT.md                  Instructions and context for future AI agents
├── CONTRIBUTING.md           Team contribution guide
├── README.md                 Project documentation
├── docker-compose.yml        Local infrastructure services
├── package.json              Root workspace scripts
├── pnpm-workspace.yaml       pnpm workspace configuration
└── turbo.json                Turborepo configuration
```

## Getting Started

### Prerequisites

Install the following:

- Node.js 22 or the project-approved version
- pnpm 11
- Git
- PostgreSQL
- Docker Desktop
- An Auth0 development tenant

Verify the installations:

```powershell
node --version
pnpm --version
git --version
psql --version
docker --version
```

### Clone the Repository

```powershell
git clone https://github.com/YOUR-ORGANIZATION/cityconnect.git
cd cityconnect
```

### Install Dependencies

Run installation from the repository root:

```powershell
pnpm install
```

Only one root `pnpm-lock.yaml` and one root `pnpm-workspace.yaml` should exist.

## Environment Variables

Never commit real credentials or local `.env` files.

### Web Application

Create:

```text
apps/web/.env.local
```

```env
AUTH0_SECRET=
APP_BASE_URL=http://localhost:3000
AUTH0_DOMAIN=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
AUTH0_AUDIENCE=https://api.cityconnect.local
```

### Database Package

Create:

```text
packages/database/.env
```

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/cityconnect"
```

### API

Create:

```text
apps/api/.env
```

```env
NODE_ENV=development
API_PORT=4000
WEB_URL=http://localhost:3000
DATABASE_URL=
AUTH0_DOMAIN=
AUTH0_AUDIENCE=https://api.cityconnect.local
REDIS_URL=redis://localhost:6379
```

## Database Setup

Create the database:

```sql
CREATE DATABASE cityconnect;
```

Validate the Prisma schema:

```powershell
pnpm --filter @cityconnect/database exec prisma validate
```

Create and apply the initial migration:

```powershell
pnpm --filter @cityconnect/database exec prisma migrate dev --name initial_schema
```

Generate Prisma Client:

```powershell
pnpm --filter @cityconnect/database exec prisma generate
```

Open Prisma Studio:

```powershell
pnpm --filter @cityconnect/database exec prisma studio
```

Do not manually edit the `_prisma_migrations` table.

## Available Commands

Run these commands from the repository root.

| Command | Purpose |
|---|---|
| `pnpm dev` | Run available development applications through Turborepo |
| `pnpm build` | Build all applications and packages |
| `pnpm lint` | Run linting |
| `pnpm typecheck` | Run TypeScript checks |
| `pnpm test` | Run tests |
| `pnpm format` | Format supported files with Prettier |
| `pnpm --filter web dev` | Run the Next.js frontend |
| `pnpm --filter api start:dev` | Run the NestJS API |
| `pnpm --filter worker start:dev` | Run the background worker |
| `pnpm --filter @cityconnect/database exec prisma studio` | Open Prisma Studio |

## Development Workflow

1. Select or create a GitHub issue.
2. Assign the issue to the active sprint.
3. Create a branch from `develop`.
4. Implement and test the change.
5. Commit using Conventional Commits.
6. Push the branch.
7. Open a pull request into `develop`.
8. Complete review and testing before merging.

Example:

```powershell
git checkout develop
git pull origin develop
git checkout -b feature/service-request-submission
```

```powershell
git add .
git commit -m "feat(requests): add citizen request submission"
git push -u origin feature/service-request-submission
```

## Project Status

CityConnect is currently in the **foundation and early development phase**.

Current priorities:

- [x] Create the monorepo
- [x] Initialize the Next.js frontend
- [x] Configure PostgreSQL and Prisma
- [ ] Complete Auth0 authentication flow
- [ ] Initialize the NestJS API
- [ ] Initialize the NestJS worker
- [ ] Configure Redis and BullMQ
- [ ] Configure local object storage
- [ ] Build the first complete service-request workflow

The first functional vertical slice is:

```text
Citizen signs in
→ Citizen submits a service request
→ Request is stored in PostgreSQL
→ Employee receives the request
→ Employee updates the request status
→ Citizen sees the updated status
→ Notification is queued
→ Audit log is recorded
```

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before creating branches, issues, commits, or pull requests.

AI coding agents must also read [AGENT.md](AGENT.md) before changing the project.

## License

This project is licensed under the terms in [LICENSE](LICENSE).
