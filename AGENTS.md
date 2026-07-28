# CityConnect Agent Guide

> Required project context and operating rules for AI coding agents working on CityConnect.

---

## Purpose of This File

This document explains the CityConnect project as a whole so that future AI agents can understand the product, architecture, approved stack, development priorities, and project rules before generating or modifying code.

Every AI agent must read this file together with:

- `README.md`
- `CONTRIBUTING.md`
- the relevant GitHub issue
- the current sprint requirements
- existing code in the affected module

Agents must not assume that unfinished applications, modules, integrations, or files already exist. Inspect the repository first.

## Project Overview

**CityConnect** is a centralized citizen service request, communication, and case-management platform for Caloocan City.

It connects:

- citizens;
- city employees;
- department administrators;
- system administrators.

The platform is intended to replace fragmented workflows involving paper, email, spreadsheets, Messenger, and disconnected office processes with a secure, structured, auditable, and role-based system.

## Main User Roles

### Citizen

Citizens should eventually be able to:

- authenticate through Auth0;
- manage their profile;
- submit and track service requests;
- submit complaints and concerns;
- schedule appointments;
- upload supporting documents;
- communicate with assigned employees;
- receive notifications;
- view announcements;
- provide feedback.

### Employee

Employees should eventually be able to:

- view assigned or department requests;
- update request statuses;
- add processing notes;
- request additional information;
- communicate with citizens;
- communicate internally with employees;
- manage appointments and complaints within their permissions;
- receive work notifications;
- access authorized reports.

### Department Administrator

Department administrators should eventually be able to:

- manage department employees;
- assign and reassign cases;
- manage department service categories;
- monitor workloads and request progress;
- access department reports;
- review department-level audit activity.

### System Administrator

System administrators should eventually be able to:

- manage users, roles, and permissions;
- manage departments and service categories;
- configure system-wide settings;
- review reports and dashboards;
- review audit logs;
- deactivate internal access;
- manage application-level configuration without managing user passwords directly.

## Approved Technology Stack

Do not replace the approved technologies without explicit approval from the project owner.

### Monorepo and Tooling

| Technology | Purpose |
|---|---|
| pnpm Workspaces | Workspace and dependency management |
| Turborepo | Monorepo task execution and caching |
| TypeScript | Shared type-safe development language |
| Prettier | Formatting |
| GitHub | Source control and collaboration |
| GitHub Projects | Scrum board, sprint, backlog, and roadmap tracking |

### Frontend

| Technology | Purpose |
|---|---|
| Next.js App Router | Main web application |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| shadcn/ui with Base UI | UI components |
| TanStack Query | Server-state management |
| React Hook Form | Form handling |
| Zod | Validation |
| Recharts | Reports and dashboards |
| Socket.IO Client | Real-time communication |
| Auth0 Next.js SDK | Authentication integration |

### Backend

| Technology | Purpose |
|---|---|
| NestJS | REST API and business logic |
| TypeScript | Type safety |
| Swagger/OpenAPI | API documentation |
| Socket.IO Gateway | Real-time events and messaging |
| Class Validator | Request validation |
| BullMQ | Background jobs |
| Redis | Queue storage and caching |

### Authentication and Authorization

- Auth0 Universal Login
- OAuth 2.0
- OpenID Connect
- RS256 JWT access tokens
- JWKS verification in NestJS
- PostgreSQL-managed role-based access control

Auth0 owns:

- credentials;
- password reset;
- login;
- MFA;
- authentication sessions;
- identity-provider integration.

PostgreSQL owns:

- internal users;
- citizen and employee profiles;
- departments;
- roles;
- permissions;
- business data;
- account activation state;
- audit logs.

Do not store passwords or password hashes in PostgreSQL.

### Database and Storage

| Technology | Purpose |
|---|---|
| PostgreSQL | Primary relational database |
| Prisma | Schema, migrations, and typed database access |
| UUID | Primary identifiers |
| pgvector | Future semantic search and RAG |
| Amazon S3 or Cloudflare R2 | Production document storage |
| MinIO | Local S3-compatible development storage |

### Planned Integrations

- Resend for email
- Firebase Cloud Messaging for push notifications
- Semaphore or another approved SMS provider
- Tesseract.js for OCR
- OpenAI API for future AI-assisted features
- Sentry for monitoring

## Architecture Direction

CityConnect begins as a **modular monolith**, not microservices.

Do not create independent services unless the project owner explicitly approves an architectural change.

The initial applications are:

```text
apps/web       Next.js frontend
apps/api       NestJS REST API and WebSocket gateway
apps/worker    NestJS BullMQ worker
```

The first complete vertical slice must be:

```text
Citizen signs in
→ Internal user is synchronized
→ Citizen submits a service request
→ Request is stored in PostgreSQL
→ Employee receives or is assigned the request
→ Employee updates its status
→ Citizen sees the updated status
→ Notification is queued
→ Audit log is recorded
```

Do not prioritize AI, OCR, advanced analytics, or microservices before this workflow is stable.

## Repository Structure

```text
cityconnect/
├── apps/
│   ├── web/                  Next.js frontend
│   ├── api/                  NestJS API and WebSocket gateway
│   └── worker/               NestJS background worker
│
├── packages/
│   ├── database/             Prisma schema, migrations, client, and seeds
│   ├── shared-types/         Shared TypeScript types
│   ├── validation/           Shared validation schemas
│   ├── config/               Shared non-secret configuration
│   ├── eslint-config/        Shared lint rules
│   └── typescript-config/    Shared TypeScript configuration
│
├── infrastructure/           Docker, deployment, monitoring, and scripts
├── docs/                     Architecture, API, database, security, and testing docs
├── .github/                  Workflows, templates, and CODEOWNERS
│
├── AGENT.md
├── CONTRIBUTING.md
├── README.md
├── docker-compose.yml
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

There must be only one root `pnpm-lock.yaml` and one root `pnpm-workspace.yaml`.

## Expected Backend Modules

```text
health
auth
users
citizens
employees
departments
roles
permissions
service-categories
service-requests
request-history
complaints
appointments
documents
conversations
messages
notifications
announcements
feedback
reports
audit-logs
ai-assistant       later phase only
```

## Database Direction

The initial internal user model should link an Auth0 identity to a CityConnect user.

```prisma
model User {
  id          String   @id @default(uuid()) @db.Uuid
  auth0UserId String   @unique
  email       String   @unique
  firstName   String?
  lastName    String?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("users")
}
```

Planned major entities include:

- User
- CitizenProfile
- EmployeeProfile
- Department
- Role
- Permission
- RolePermission
- UserRole
- ServiceCategory
- ServiceRequest
- RequestAssignment
- RequestStatusHistory
- Complaint
- Appointment
- Document
- Conversation
- ConversationMember
- Message
- Notification
- DeviceToken
- Announcement
- Feedback
- AuditLog
- Report
- AiKnowledgeDocument
- AiDocumentChunk

Agents must not generate every entity at once unless the issue explicitly requires it.

## Security Rules

Every agent-generated change must follow these rules:

- Never commit credentials, secrets, tokens, private keys, or production URLs.
- Never expose Auth0 Client Secret to browser code.
- Never store passwords in PostgreSQL.
- Enforce authorization in the backend, not only in the frontend.
- Validate all external input.
- Use allowlists for uploaded file types and size limits.
- Do not trust user-provided filenames or MIME types.
- Do not log access tokens or sensitive citizen data.
- Record meaningful administrative and workflow actions in audit logs.
- Use least-privilege permissions.
- Avoid returning internal stack traces to clients.
- Do not manually modify `_prisma_migrations`.

## Coding Rules

### General

- Use TypeScript strict mode.
- Avoid `any` unless clearly justified.
- Prefer small, focused functions.
- Use descriptive names.
- Preserve the existing architecture and naming conventions.
- Reuse shared types and validation where appropriate.
- Add comments only when they explain non-obvious decisions.
- Do not add dependencies when the current stack already solves the problem.

### Frontend

- Use the Next.js App Router.
- Prefer Server Components when interactivity is not required.
- Use Client Components only where necessary.
- Keep API requests in service or feature layers.
- Use TanStack Query for server-state operations.
- Use React Hook Form and Zod for forms.
- Use shadcn/ui components before building duplicate primitives.
- Keep citizen, employee, and administrator portals in the same Next.js application.

### Backend

- Keep modules domain-focused.
- Validate DTOs.
- Keep controllers thin.
- Place business logic in services.
- Keep database operations testable.
- Enforce roles and permissions through guards or centralized authorization logic.
- Document REST endpoints through Swagger.
- Use queues for slow or retryable tasks.

### Database

- Use Prisma migrations for schema changes.
- Use UUID identifiers.
- Keep migration names descriptive.
- Review generated SQL before committing.
- Do not use `prisma db push` as a substitute for migrations in shared development workflows.

## Git and Scrum Rules

All meaningful work should have:

- a GitHub issue;
- acceptance criteria;
- an assignee;
- a priority;
- a sprint assignment;
- a branch from `develop`;
- a pull request into `develop`.

Branch examples:

```text
feature/auth0-user-sync
feature/service-request-submission
fix/prisma-migration-path
docs/local-development
chore/configure-ci
```

Commit examples:

```text
feat(auth): add Auth0 JWT guard
feat(requests): add citizen request endpoint
fix(database): correct Prisma connection configuration
docs(readme): update local setup instructions
```

## Agent Workflow

Before changing code:

1. Read the user request and linked issue.
2. Inspect the repository and affected files.
3. Confirm what currently exists.
4. Identify dependencies and security implications.
5. Make the smallest complete change.
6. Run the relevant checks.
7. Update documentation when behavior or setup changes.
8. Clearly report what changed, what was tested, and what remains incomplete.

## Agent Prohibitions

Agents must not:

- invent completed features;
- assume applications or modules exist without checking;
- replace Auth0, Prisma, PostgreSQL, Next.js, NestJS, pnpm, or Turborepo without approval;
- create microservices prematurely;
- implement AI before the core workflow is stable;
- expose secrets;
- disable authentication or authorization to make a feature work;
- delete migrations or production data without explicit approval;
- silently change public API contracts;
- mark work complete when tests or required setup still fail.

## Current Project Priority

The immediate priority is the foundation and first service-request workflow.

```text
1. Complete Auth0 login and callback
2. Initialize and configure the NestJS API
3. Validate Auth0 access tokens in NestJS
4. Synchronize authenticated users to PostgreSQL
5. Implement roles and permissions
6. Build citizen service-request submission
7. Build employee request processing
8. Add notifications and audit logging
```

## Definition of Done for Agent Work

A change is complete only when applicable requirements are satisfied:

- [ ] Acceptance criteria are met
- [ ] Code follows the approved architecture
- [ ] Build succeeds
- [ ] Type checking succeeds
- [ ] Linting succeeds
- [ ] Relevant tests pass
- [ ] Authorization is enforced
- [ ] Validation is present
- [ ] No secrets are committed
- [ ] Database changes include migrations
- [ ] Documentation is updated
- [ ] Remaining limitations are stated honestly
