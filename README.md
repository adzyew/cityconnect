CityConnect

CityConnect is a centralized citizen-service and local government workflow platform for Caloocan City. It provides citizens, city employees, and administrators with one secure system for submitting, processing, tracking, communicating about, and reporting public-service concerns and requests.

Project Goals

CityConnect aims to:

Improve communication between citizens and city offices.

Replace fragmented email, Messenger, paper, and spreadsheet workflows.

Let citizens track requests and receive status updates.

Give employees a structured workspace for assigned cases.

Give administrators visibility into operations, performance, and audit activity.

Protect citizen data through secure authentication, authorization, validation, and audit logging.

Main User Portals

Citizen Portal

Citizens can submit service requests and complaints, schedule appointments, upload documents, communicate with employees, receive notifications, and track progress.

Employee Portal

Employees can work on assigned requests, update statuses, request additional information, manage appointments, communicate with citizens or colleagues, and access authorized operational information.

Administrator Portal

Administrators can manage users, departments, service categories, roles, permissions, assignments, reports, announcements, settings, and audit logs.

Approved Technology Stack

Frontend

Next.js

TypeScript

Tailwind CSS

shadcn/ui with Base UI

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

Socket.IO WebSocket Gateway

Authentication and authorization

Auth0 Universal Login

OAuth 2.0 and OpenID Connect

RS256 JWT access tokens

JWKS validation

PostgreSQL-managed role-based access control

Data and infrastructure

PostgreSQL

Prisma

pgvector

Redis

BullMQ

Amazon S3 or Cloudflare R2

MinIO for local object storage

Integrations planned

Resend

Firebase Cloud Messaging

Semaphore or another approved SMS provider

Tesseract.js

OpenAI API

Testing and monitoring

Jest

Supertest

Playwright

Sentry

Repository Structure

cityconnect/
├── apps/
│   ├── web/
│   ├── api/
│   └── worker/
├── packages/
│   ├── database/
│   ├── shared-types/
│   ├── validation/
│   ├── config/
│   ├── eslint-config/
│   └── typescript-config/
├── infrastructure/
├── docs/
├── .github/
├── docker-compose.yml
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── turbo.json
├── AGENT.md
├── CONTRIBUTING.md
└── README.md

Prerequisites

Install the following before starting:

Node.js 22 or a compatible project-approved version

pnpm 11

Git

PostgreSQL 18 or a compatible PostgreSQL instance

Docker Desktop for Redis and MinIO when using the provided Compose setup

An Auth0 development tenant

Verify your tools:

node --version
pnpm --version
git --version
psql --version
docker --version

Installation

Clone the repository:

git clone https://github.com/YOUR-ORGANIZATION/cityconnect.git
cd cityconnect

Install all workspace dependencies from the repository root:

pnpm install

Do not run separate package managers inside individual applications. The repository uses one root pnpm workspace and one root lockfile.

Environment Configuration

Never commit real .env files.

Create local environment files based on the included examples.

Database

Create:

packages/database/.env

Example:

DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/cityconnect"

Next.js and Auth0

Create:

apps/web/.env.local

Example:

AUTH0_SECRET=
APP_BASE_URL=http://localhost:3000
AUTH0_DOMAIN=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
AUTH0_AUDIENCE=https://api.cityconnect.local

API and worker

Create local .env files for apps/api and apps/worker when those applications require their integrations.

PostgreSQL and Prisma Setup

Create the local database:

CREATE DATABASE cityconnect;

The expected local connection is:

Host: localhost
Port: 5432
Database: cityconnect
User: postgres

Validate the Prisma schema:

pnpm --filter @cityconnect/database exec prisma validate

Create and apply a migration:

pnpm --filter @cityconnect/database exec prisma migrate dev --name initial_schema

Generate the Prisma client:

pnpm --filter @cityconnect/database exec prisma generate

Open Prisma Studio:

pnpm --filter @cityconnect/database exec prisma studio

Do not edit the _prisma_migrations table manually.

Local Infrastructure

When Docker Desktop is installed and running, start the configured local services:

docker compose up -d

Check their status:

docker compose ps

When PostgreSQL is installed directly on Windows and already uses port 5432, do not start a second PostgreSQL container on the same port. Redis and MinIO may still be run through Docker.

Running the Applications

Run all available workspace development scripts:

pnpm dev

Run only the frontend:

pnpm --filter web dev

Run only the NestJS API:

pnpm --filter api start:dev

Run only the worker:

pnpm --filter worker start:dev

Expected local URLs:

Frontend: http://localhost:3000
API: http://localhost:4000
Swagger: http://localhost:4000/api/docs
MinIO console: http://localhost:9001

Auth0 Development Setup

Create two Auth0 resources.

CityConnect Web

Application type: Regular Web Application

Allowed callback URL: http://localhost:3000/auth/callback

Allowed logout URL: http://localhost:3000

Allowed web origin: http://localhost:3000

CityConnect API

Identifier: https://api.cityconnect.local

Signing algorithm: RS256

Auth0 manages identity and login. CityConnect PostgreSQL roles and permissions manage authorization.

Common Commands

pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm test
pnpm format

Database commands:

pnpm --filter @cityconnect/database exec prisma validate
pnpm --filter @cityconnect/database exec prisma migrate dev --name migration_name
pnpm --filter @cityconnect/database exec prisma generate
pnpm --filter @cityconnect/database exec prisma studio

Branching

Permanent branches:

main

develop

Create work branches from develop:

git checkout develop
git pull origin develop
git checkout -b feature/example-feature

Open pull requests into develop. Do not push feature work directly to main.

Initial Delivery Plan

Sprint 0 — Foundation

Monorepo and workspace

Next.js frontend

NestJS API

NestJS worker

PostgreSQL and Prisma

Auth0 development setup

Redis and local storage

Project board and documentation

Sprint 1 — Authentication and Users

Auth0 frontend authentication

NestJS JWKS validation

Internal user synchronization

Roles and permissions

/api/v1/users/me

Authentication audit logs

Sprint 2 — Service Request MVP

Citizen request submission

Request categories

Employee assignment

Status history

Citizen request tracking

Notifications and audit logs

Security Principles

Never commit credentials or private keys.

Never store Auth0 passwords in PostgreSQL.

Enforce authorization in the backend.

Validate all request bodies, parameters, files, and external data.

Use least privilege.

Audit sensitive workflow and administrative actions.

Avoid logging tokens, private documents, or unnecessary personal information.

Contributing

Read CONTRIBUTING.md before creating branches, commits, issues, or pull requests.

AI coding agents must also read AGENT.md before modifying the project.

Project Status

CityConnect is currently in the foundation and authentication setup stage. The immediate technical objective is to complete Auth0 authentication, NestJS access-token validation, PostgreSQL user synchronization, and role-based authorization.