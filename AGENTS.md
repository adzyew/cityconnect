CityConnect Agent Guide

This document gives future AI agents and contributors the context needed to work safely and consistently on CityConnect.

1. Project Overview

CityConnect is a centralized citizen-service and local government workflow platform intended for Caloocan City. It connects citizens, city employees, and administrators through one secure system for submitting, processing, tracking, and reporting public-service requests.

The system is designed to replace fragmented communication through email, Messenger, paper records, and disconnected office workflows with a structured, auditable, role-based platform.

2. Primary Users

Citizens

Citizens can:

Sign in securely through Auth0.

Manage their profile.

Submit and track service requests.

Submit complaints.

Schedule appointments.

Upload supporting documents.

Communicate with assigned city employees.

Receive email, push, in-app, and optional SMS notifications.

View announcements and provide feedback.

Employees

Employees can:

View requests assigned to them or their department.

Update request status and processing notes.

Request additional citizen documents.

Communicate with citizens and other employees.

Manage appointments and complaints within their authority.

Receive work notifications.

Access limited reports based on permissions.

Administrators

Administrators can:

Manage users, employees, departments, service categories, roles, and permissions.

Assign and reassign work.

Configure system settings and announcements.

Review reports and operational dashboards.

Review audit logs.

Manage access without directly managing user passwords.

3. Approved Technology Stack

Do not replace technologies without explicit approval from the project owner.

Monorepo and tooling

pnpm workspaces

Turborepo

TypeScript

Prettier

GitHub and GitHub Projects

Frontend

Next.js with App Router

TypeScript

Tailwind CSS

shadcn/ui using Base UI

TanStack Query

React Hook Form

Zod

Recharts

Socket.IO Client

Auth0 Next.js SDK

Backend

NestJS

TypeScript

REST API

Swagger/OpenAPI

Socket.IO through NestJS WebSocket Gateway

Class Validator and Class Transformer

Authentication and authorization

Auth0 Universal Login

OAuth 2.0 and OpenID Connect

RS256 JWT access tokens

JWKS validation in NestJS

PostgreSQL-managed role-based access control

Auth0 owns passwords, login, MFA, and identity sessions. PostgreSQL stores the internal CityConnect user, role, permission, department, profile, and business records.

Database

PostgreSQL 18 during local development

Prisma 7

PostgreSQL UUID identifiers

pgvector for later AI/RAG features

Background processing and cache

Redis

BullMQ

Separate NestJS worker application

Storage and integrations

Amazon S3 or Cloudflare R2 in production

MinIO as the local S3-compatible development service

Resend for email

Firebase Cloud Messaging for push notifications

Semaphore or another approved provider for SMS

Tesseract.js for initial OCR

OpenAI API and pgvector for later RAG functionality

Testing and monitoring

Jest

Supertest

Playwright

Sentry

Uptime monitoring

Deployment direction

Vercel for the Next.js frontend

Railway or Render for the initial NestJS deployment

Managed PostgreSQL and Redis

S3 or Cloudflare R2 for documents

AWS-compatible architecture for future scaling

4. Repository Structure

cityconnect/
├── apps/
│   ├── web/                 # Next.js citizen, employee, admin, and public UI
│   ├── api/                 # NestJS REST API and WebSocket gateway
│   └── worker/              # NestJS BullMQ processors
├── packages/
│   ├── database/            # Prisma schema, migrations, generated client, seeds
│   ├── shared-types/        # Shared TypeScript types when required
│   ├── validation/          # Shared Zod schemas when appropriate
│   ├── config/              # Shared non-secret configuration
│   ├── eslint-config/       # Shared lint configuration
│   └── typescript-config/   # Shared TypeScript configuration
├── infrastructure/
│   ├── docker/
│   ├── deployment/
│   ├── monitoring/
│   └── scripts/
├── docs/
│   ├── architecture/
│   ├── api/
│   ├── database/
│   ├── development/
│   ├── requirements/
│   ├── security/
│   └── testing/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   ├── workflows/
│   ├── CODEOWNERS
│   └── pull_request_template.md
├── docker-compose.yml
├── pnpm-workspace.yaml
├── turbo.json
├── package.json
├── README.md
├── CONTRIBUTING.md
└── AGENT.md

There must be only one root pnpm-workspace.yaml and one root pnpm-lock.yaml.

5. Current Development Direction

CityConnect begins as a modular monolith, not microservices.

The first complete functional vertical slice is:

Citizen signs in
→ internal user is synchronized
→ citizen submits a service request
→ request is stored in PostgreSQL
→ employee receives or is assigned the request
→ employee updates status
→ citizen sees the update
→ notification is queued
→ audit log is recorded

Do not prioritize AI, OCR, advanced analytics, or large-scale infrastructure before this workflow is stable.

6. Initial Domain Modules

Expected backend modules include:

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

ai-assistant, later only

7. Initial Database Direction

The project currently starts with the internal user model and migration foundation.

Example core user fields:

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

Planned major entities include:

User

CitizenProfile

EmployeeProfile

Department

Role

Permission

RolePermission

UserRole

ServiceCategory

ServiceRequest

RequestAssignment

RequestStatusHistory

Complaint

Appointment

Document

Conversation

ConversationMember

Message

Notification

DeviceToken

Announcement

Feedback

AuditLog

Report

AiKnowledgeDocument, later

AiDocumentChunk, later

Never store Auth0 passwords, password hashes, client secrets, private keys, or access tokens in ordinary database columns.

8. Auth0 Architecture

Two Auth0 resources are required:

CityConnect Web

Type: Regular Web Application

Local callback: http://localhost:3000/auth/callback

Local logout URL: http://localhost:3000

Local web origin: http://localhost:3000

CityConnect API

Identifier/audience: https://api.cityconnect.local

Signing algorithm: RS256

Authentication proves identity. Authorization remains a CityConnect responsibility through PostgreSQL roles and permissions.

The backend should eventually expose:

GET /api/v1/users/me

Expected flow:

Next.js obtains Auth0 access token
→ sends Bearer token
→ NestJS validates JWT using Auth0 JWKS
→ reads the Auth0 `sub`
→ finds or creates the internal user
→ loads roles and permissions
→ returns the authorized internal profile

9. Environment and Secrets

Never commit real .env files.

Expected local files may include:

apps/web/.env.local

apps/api/.env

apps/worker/.env

packages/database/.env

Commit only sanitized .env.example files.

Important variables include:

DATABASE_URL=
AUTH0_SECRET=
APP_BASE_URL=http://localhost:3000
AUTH0_DOMAIN=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
AUTH0_AUDIENCE=https://api.cityconnect.local
REDIS_URL=redis://localhost:6379
S3_ENDPOINT=http://localhost:9000
S3_BUCKET=cityconnect-documents
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=

10. Local Database Notes

The current local PostgreSQL connection is expected to use:

Host: localhost
Port: 5432
Database: cityconnect
User: postgres

The password is local and must not be committed.

Prisma 7 uses prisma.config.ts to read DATABASE_URL.

Typical commands from the repository root:

pnpm --filter @cityconnect/database exec prisma validate
pnpm --filter @cityconnect/database exec prisma migrate dev --name migration_name
pnpm --filter @cityconnect/database exec prisma generate
pnpm --filter @cityconnect/database exec prisma studio

Do not edit _prisma_migrations manually.

11. Development Workflow

Permanent branches:

main: stable, approved, presentation-ready

develop: integration branch

Temporary branches:

feature/*

fix/*

docs/*

test/*

chore/*

refactor/*

hotfix/*

Examples:

feature/auth0-integration
feature/service-request-submission
chore/project-foundation
docs/system-architecture
fix/request-status-validation

Do not push feature work directly to main.

12. Commit Convention

Use Conventional Commits:

feat(auth): integrate Auth0 login
feat(requests): create service request endpoint
fix(database): correct migration relation
refactor(api): simplify request assignment logic
test(auth): add unauthorized API test
docs(setup): update local PostgreSQL instructions
chore(deps): update workspace dependencies

13. Sprint and Project Workflow

GitHub Projects uses an Iteration field named Sprint.

Recommended status flow:

Backlog
→ Ready
→ In Progress
→ In Review
→ Testing
→ Done

Use Blocked only when progress depends on an unresolved external issue.

Initial sprint direction:

Sprint 0 — Foundation

Sprint 1 — Authentication and User Foundation

Sprint 2 — Service Request MVP

Sprint 3 — Employee Workflow

Sprint 0 covers repository, frontend, backend, database, authentication setup, documentation, and project workflow—not complete business features.

14. Definition of Done

A task is not done merely because code was written. It must satisfy all applicable conditions:

Acceptance criteria are met.

Code builds and type-checks.

Linting passes.

Tests are added or updated when appropriate.

Sensitive values are not committed.

Authorization is enforced server-side.

Database changes include a migration.

API behavior is documented when changed.

UI changes are responsive and accessible.

The pull request is reviewed.

The feature is manually verified.

15. Security Rules for Agents

Future agents must:

Never expose or invent secrets.

Never store Auth0 passwords in PostgreSQL.

Never rely only on frontend role checks.

Enforce permissions in NestJS guards and service logic.

Validate all external input.

Use signed or presigned URLs for private documents.

Validate file extension, MIME type, size, and ownership.

Record sensitive administrative and workflow actions in audit logs.

Avoid logging tokens, secrets, personal documents, or unnecessary PII.

Follow least privilege.

Treat citizen data as sensitive government-facing information.

16. Rules for Future AI Agents

Before changing code, an agent should:

Inspect the actual repository and current branch.

Read this file, README.md, and CONTRIBUTING.md.

Check relevant package scripts and dependency versions.

Avoid assuming files or modules exist.

Preserve the approved stack unless explicitly instructed otherwise.

Prefer small, reviewable changes.

State any missing information instead of fabricating it.

Update documentation when architecture or setup changes.

Never overwrite working user code without explaining the impact.

Do not introduce microservices, Supabase Auth, Firebase Auth, or a second ORM without explicit approval.

17. Current Priority

The immediate priority is to finish the repository foundation and then implement secure authentication-to-database synchronization.

The next major technical milestone is:

Auth0 login works
→ NestJS validates the access token
→ PostgreSQL creates or retrieves the internal user
→ roles and permissions are loaded
→ `/api/v1/users/me` returns the authorized profile

This document should be updated whenever the approved architecture, stack, repository layout, authentication strategy, or primary workflow changes.