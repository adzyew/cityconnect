Contributing to CityConnect

Thank you for contributing to CityConnect. This guide defines the team workflow, coding expectations, Git conventions, review process, and security requirements.

1. Read Before Contributing

Before making changes:

Read README.md.

Read AGENT.md when using an AI coding assistant or agent.

Check the active GitHub Project sprint.

Open or assign the related GitHub issue.

Confirm the acceptance criteria.

Start from the latest develop branch.

Do not begin a large implementation from an unapproved idea or draft item.

2. Approved Stack

Contributors must preserve the approved stack unless the project owner explicitly approves a change.

Do not introduce a replacement authentication provider, ORM, frontend framework, backend framework, database, or monorepo tool without prior approval.

Current core choices include:

Next.js

NestJS

Auth0

PostgreSQL

Prisma

pnpm workspaces

Turborepo

Redis and BullMQ

Socket.IO

S3-compatible object storage

3. Branching Strategy

Permanent branches:

main
 develop

Use temporary branches based on the work type:

feature/*
fix/*
docs/*
test/*
chore/*
refactor/*
hotfix/*

Examples:

feature/auth0-user-sync
feature/service-request-submission
fix/prisma-migration-path
docs/local-development
chore/configure-github-actions

Create a branch from develop:

git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name

Never reuse an old merged feature branch for unrelated work.

4. Issue Requirements

Every meaningful change should have a GitHub issue containing:

Clear title

Problem or objective

User or system affected

Acceptance criteria

Dependencies

Priority

Sprint

Assignee

Story points when used by the team

Recommended issue title formats:

[AUTH] Synchronize Auth0 users with PostgreSQL
[DATABASE] Add roles and permissions schema
[REQUESTS] Create citizen request endpoint
[BUG] Fix callback URL handling
[DOCS] Update local setup guide

5. Commit Messages

Use Conventional Commits.

Format:

type(scope): concise description

Common types:

feat

fix

docs

test

refactor

chore

build

ci

perf

style

Examples:

feat(auth): add Auth0 JWT guard
feat(users): synchronize authenticated user
fix(database): correct migration output path
docs(readme): add PostgreSQL setup steps
test(auth): cover unauthorized API access
chore(deps): update Prisma packages

Keep commits focused. Avoid mixing unrelated frontend, backend, database, and documentation changes in one commit unless they form one inseparable feature.

6. Pull Request Process

Push your branch:

git add .
git commit -m "feat(scope): description"
git push -u origin your-branch-name

Open the pull request into:

develop

A pull request should include:

Summary of the change

Related issue, using Closes #issue-number when appropriate

Main implementation details

Testing performed

Screenshots for visible UI changes

Migration notes for database changes

Security and privacy considerations

Do not open a pull request into main unless it is an approved release or hotfix.

7. Review Requirements

Before requesting review:

Rebase or merge the latest develop changes as agreed by the team.

Resolve all conflicts locally.

Run linting.

Run type checking.

Run relevant tests.

Run the application manually.

Verify no secrets were added.

Update documentation.

Reviewers should check:

Acceptance criteria

Correctness

Security

Authorization

Validation

Database migration safety

Error handling

Readability

Test coverage

UI accessibility and responsiveness

8. Definition of Done

A task can move to Done only when all applicable items are complete:

Acceptance criteria are satisfied.

The implementation works locally.

Build, lint, and type checking pass.

Tests pass.

New behavior has suitable tests when practical.

Database changes have a reviewed migration.

API changes are reflected in Swagger or documentation.

UI changes work on relevant screen sizes.

Authorization is enforced in the backend.

Secrets and personal data are not exposed.

The pull request is approved and merged.

9. Workspace Rules

Run installation from the repository root:

pnpm install

There should be only one:

pnpm-lock.yaml
pnpm-workspace.yaml

Do not create extra workspace files or lockfiles inside apps/* or packages/*.

Use workspace filtering:

pnpm --filter web dev
pnpm --filter api start:dev
pnpm --filter worker start:dev
pnpm --filter @cityconnect/database exec prisma studio

10. Formatting and Code Quality

Run:

pnpm format
pnpm lint
pnpm typecheck
pnpm test

General expectations:

Use TypeScript strictness.

Avoid any unless justified.

Prefer clear names over abbreviations.

Keep functions and services focused.

Validate external input.

Handle errors intentionally.

Avoid duplicated business rules.

Keep role and permission logic centralized.

11. Frontend Guidelines

Use Next.js App Router.

Prefer Server Components where appropriate.

Add Client Components only when interactivity requires them.

Use TanStack Query for server-state synchronization.

Use React Hook Form with Zod for forms.

Use shadcn/ui and the approved design system.

Maintain balanced Caloocan-inspired orange and green accents.

Do not overuse either theme color.

Make pages responsive and keyboard-accessible.

Display loading, empty, success, and error states.

Do not trust frontend role checks as authorization.

12. Backend Guidelines

Use NestJS modules by domain.

Keep controllers thin.

Put business logic in services.

Use DTOs with validation decorators.

Use a global API prefix such as /api/v1.

Document endpoints with Swagger.

Use consistent error responses.

Enforce permissions through guards and service checks.

Record sensitive changes in audit logs.

Avoid returning internal secrets or unnecessary personal information.

13. Database and Prisma Guidelines

Use PostgreSQL UUIDs for primary identifiers.

Change the schema through Prisma models and migrations.

Give migrations descriptive names.

Review generated SQL before merging.

Never manually edit _prisma_migrations.

Never use migrate reset against shared, staging, or production databases.

Use seed scripts only for approved reference or development data.

Avoid destructive schema changes without a migration plan.

Typical development flow:

pnpm --filter @cityconnect/database exec prisma validate
pnpm --filter @cityconnect/database exec prisma migrate dev --name descriptive_name
pnpm --filter @cityconnect/database exec prisma generate

Commit both the schema change and generated migration folder.

14. Authentication and Authorization Rules

Auth0 manages:

Passwords

Universal Login

MFA

Identity provider sessions

Authentication identity

CityConnect manages:

Internal user profile

Account activation status

Departments

Roles

Permissions

Resource ownership

Business authorization

Never:

Store Auth0 passwords in PostgreSQL.

Commit Auth0 Client Secrets.

Decode a token without verifying its signature.

Accept tokens with the wrong issuer or audience.

Rely only on UI hiding for access control.

15. File and Document Security

When document upload is implemented:

Validate file size.

Validate MIME type and extension.

Generate safe object keys.

Prevent executable file handling.

Restrict access by ownership and permission.

Use signed URLs for private access.

Record upload, download, and deletion events where required.

Do not store sensitive documents in the Git repository.

16. Environment Variables and Secrets

Allowed in Git:

.env.example

Not allowed in Git:

.env
.env.local
.env.development
.env.production
private keys
service account JSON
access tokens
client secrets
real database passwords

Before committing, inspect:

git status
git diff --cached

If a secret is accidentally committed, notify the project owner immediately and rotate it. Deleting the visible line from a later commit is not enough.

17. Testing Expectations

Use:

Jest for unit tests

Supertest for NestJS integration tests

Playwright for end-to-end user workflows

Priority test areas:

Authentication and authorization

Service-request ownership

Employee assignment permissions

Status transitions

File access

Audit logging

Input validation

Do not rely only on successful-path tests.

18. Project Board Workflow

Use the GitHub Project status flow:

Backlog
→ Ready
→ In Progress
→ In Review
→ Testing
→ Done

Use Blocked when an unresolved dependency prevents progress.

Update the issue when:

Work begins

A blocker appears

A pull request is opened

Testing starts

The task is completed

Do not leave finished work in In Progress.

19. Documentation

Update documentation whenever you change:

Local setup

Environment variables

Repository structure

Architecture

Database schema

Authentication flow

API contracts

Deployment

Security assumptions

Documentation is part of the implementation, not an optional follow-up.

20. Using AI Coding Agents

AI agents must read AGENT.md before modifying the repository.

Contributors remain responsible for reviewing AI-generated code. Never merge generated code solely because it compiles.

Check AI changes for:

Invented files or APIs

Incorrect package versions

Unsafe authentication shortcuts

Missing authorization

Unnecessary dependencies

Destructive migrations

Exposed secrets

Architecture drift

21. Getting Help

When blocked:

Add a clear comment to the issue.

Move the issue to Blocked.

Include the exact error, attempted commands, relevant logs, and environment details.

Do not post passwords, tokens, .env contents, or private citizen data.