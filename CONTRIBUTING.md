# Contributing to CityConnect

> Team workflow, coding standards, Git conventions, review requirements, and security rules.

Thank you for contributing to CityConnect. All contributors should follow this guide to keep the repository organized, secure, and consistent.

---

## Table of Contents

- [Before You Start](#before-you-start)
- [Approved Stack](#approved-stack)
- [GitHub Issue Requirements](#github-issue-requirements)
- [Branching Strategy](#branching-strategy)
- [Commit Messages](#commit-messages)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Review Requirements](#review-requirements)
- [Coding Standards](#coding-standards)
- [Database Changes](#database-changes)
- [Security and Privacy](#security-and-privacy)
- [Scrum Workflow](#scrum-workflow)
- [Definition of Done](#definition-of-done)

## Before You Start

Before making changes:

1. Read `README.md`.
2. Read `AGENT.md` when using an AI coding assistant.
3. Check the active GitHub Project sprint.
4. Open or assign the related GitHub issue.
5. Review its acceptance criteria and dependencies.
6. Pull the latest `develop` branch.
7. Create a new branch for the task.

Do not begin a large feature from an unapproved idea or unassigned draft item.

## Approved Stack

Contributors must preserve the approved architecture unless the project owner explicitly approves a change.

| Area | Approved technology |
|---|---|
| Frontend | Next.js, TypeScript, Tailwind CSS, shadcn/ui |
| Forms and validation | React Hook Form, Zod |
| Server state | TanStack Query |
| Backend | NestJS, TypeScript, REST, Swagger |
| Authentication | Auth0 |
| Authorization | PostgreSQL-managed RBAC |
| Database | PostgreSQL and Prisma |
| Real time | Socket.IO |
| Queue and cache | Redis and BullMQ |
| Storage | Amazon S3, Cloudflare R2, or MinIO locally |
| Monorepo | pnpm Workspaces and Turborepo |

Do not introduce replacement frameworks, databases, ORMs, authentication providers, or package managers without approval.

## GitHub Issue Requirements

Every meaningful change should have a GitHub issue containing:

- a clear objective;
- affected user or module;
- acceptance criteria;
- dependencies;
- priority;
- sprint;
- assignee;
- story points when used by the team.

Recommended issue titles:

```text
[AUTH] Synchronize Auth0 users with PostgreSQL
[DATABASE] Add roles and permissions schema
[REQUESTS] Create citizen request endpoint
[BUG] Fix callback URL handling
[DOCS] Update local setup guide
```

## Branching Strategy

### Permanent Branches

```text
main
 develop
```

- `main` contains stable and approved releases.
- `develop` contains integrated development work.

### Working Branches

```text
feature/*
fix/*
docs/*
test/*
chore/*
refactor/*
hotfix/*
```

Examples:

```text
feature/auth0-user-sync
feature/service-request-submission
fix/prisma-migration-path
docs/local-development
chore/configure-github-actions
```

Create a branch from `develop`:

```powershell
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

Never reuse an old merged branch for unrelated work.

## Commit Messages

Use Conventional Commits.

```text
type(scope): concise description
```

### Common Types

| Type | Purpose |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation |
| `test` | Tests |
| `refactor` | Internal code improvement |
| `chore` | Maintenance |
| `build` | Build configuration |
| `ci` | Continuous integration |
| `perf` | Performance improvement |
| `style` | Formatting without behavior changes |

Examples:

```text
feat(auth): add Auth0 JWT guard
feat(users): synchronize authenticated user
fix(database): correct migration output path
docs(readme): add PostgreSQL setup steps
test(auth): cover unauthorized API access
chore(deps): update Prisma packages
```

Keep commits focused. Do not combine unrelated changes in one commit.

## Development Workflow

1. Select an issue from the active sprint.
2. Move it to `In Progress`.
3. Create a branch from `develop`.
4. Implement the smallest complete solution.
5. Run formatting, linting, type checking, and tests.
6. Commit using Conventional Commits.
7. Push the branch.
8. Open a pull request into `develop`.
9. Move the issue to `In Review`.
10. Address review comments.
11. Move the issue to `Testing` when approved.
12. Move it to `Done` only after successful merge and verification.

## Pull Request Process

Push your branch:

```powershell
git add .
git commit -m "feat(scope): description"
git push -u origin your-branch-name
```

Open the pull request into:

```text
develop
```

A pull request should include:

- summary of the change;
- related issue using `Closes #issue-number` when appropriate;
- implementation details;
- tests performed;
- screenshots for UI changes;
- migration notes for database changes;
- security and privacy considerations;
- known limitations.

Do not open a pull request into `main` unless it is an approved release or hotfix.

### Pull Request Checklist

```markdown
- [ ] The related issue is linked
- [ ] Acceptance criteria are satisfied
- [ ] The code builds locally
- [ ] Linting passes
- [ ] Type checking passes
- [ ] Relevant tests pass
- [ ] No secrets were committed
- [ ] Database changes include a migration
- [ ] API documentation was updated
- [ ] UI screenshots were included when applicable
- [ ] Documentation was updated
```

## Review Requirements

Before requesting review:

- update your branch with the latest `develop`;
- resolve conflicts locally;
- run all relevant checks;
- test the changed workflow manually;
- verify that no secrets or personal data were added;
- update documentation.

Reviewers should check:

- acceptance criteria;
- correctness;
- backend authorization;
- validation;
- database migration safety;
- error handling;
- code readability;
- test coverage;
- UI accessibility;
- responsiveness;
- security and privacy risks.

## Coding Standards

### General

- Use TypeScript strict mode.
- Avoid `any` unless justified.
- Use descriptive names.
- Keep functions and services focused.
- Validate external input.
- Handle errors intentionally.
- Avoid duplicate business rules.
- Do not add dependencies unnecessarily.
- Keep authorization logic centralized.

### Frontend

- Use the Next.js App Router.
- Prefer Server Components where appropriate.
- Use Client Components only when interactivity requires them.
- Use TanStack Query for API state.
- Use React Hook Form and Zod for forms.
- Use shadcn/ui components before creating duplicate UI primitives.
- Keep citizen, employee, and administrator portals in one application.
- Provide loading, empty, error, and success states.
- Maintain responsive and accessible interfaces.

### Backend

- Keep controllers thin.
- Put business logic in services.
- Validate DTOs.
- Enforce authorization on the server.
- Document endpoints in Swagger.
- Use queues for slow, retryable, or external tasks.
- Avoid returning internal stack traces.
- Use consistent API error responses.

### Workspace

Install dependencies from the repository root:

```powershell
pnpm install
```

Only one root copy of these files should exist:

```text
pnpm-lock.yaml
pnpm-workspace.yaml
```

Use workspace filters:

```powershell
pnpm --filter web dev
pnpm --filter api start:dev
pnpm --filter worker start:dev
pnpm --filter @cityconnect/database exec prisma studio
```

Run project checks:

```powershell
pnpm format
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Database Changes

All shared database changes must use Prisma migrations.

### Update the Schema

Edit:

```text
packages/database/prisma/schema.prisma
```

### Create a Migration

```powershell
pnpm --filter @cityconnect/database exec prisma migrate dev --name descriptive_name
```

### Generate Prisma Client

```powershell
pnpm --filter @cityconnect/database exec prisma generate
```

### Review Before Committing

Review:

```text
packages/database/prisma/migrations/
```

Never:

- manually edit `_prisma_migrations`;
- delete shared migrations without approval;
- use `prisma db push` as a substitute for proper team migrations;
- commit database passwords;
- reset a shared or production database without explicit approval.

## Security and Privacy

CityConnect handles citizen and government-related information. Security requirements are mandatory.

- Never commit `.env` files.
- Never expose Auth0 Client Secret to frontend code.
- Never store passwords in PostgreSQL.
- Never log JWTs or sensitive personal data.
- Enforce authorization in the backend.
- Validate uploaded files and size limits.
- Use least-privilege permissions.
- Add audit logs for important actions.
- Avoid exposing internal errors to users.
- Review changes that affect authentication, authorization, uploads, messages, reports, or citizen data carefully.

## Scrum Workflow

GitHub Project statuses:

```text
Backlog
Ready
In Progress
In Review
Testing
Blocked
Done
```

### Status Meaning

| Status | Meaning |
|---|---|
| Backlog | Not yet committed to a sprint |
| Ready | Approved and ready to start |
| In Progress | Actively being implemented |
| In Review | Pull request awaiting review |
| Testing | Approved and being verified |
| Blocked | Cannot continue because of a dependency or issue |
| Done | Merged and acceptance criteria verified |

Every sprint item should have:

- sprint assignment;
- assignee;
- priority;
- story points;
- acceptance criteria;
- related branch and pull request.

## Definition of Done

A task can move to `Done` only when all applicable items are complete:

- [ ] Acceptance criteria are satisfied
- [ ] The implementation works locally
- [ ] Build succeeds
- [ ] Linting succeeds
- [ ] Type checking succeeds
- [ ] Relevant tests pass
- [ ] Database changes include reviewed migrations
- [ ] API changes are documented
- [ ] UI changes work on relevant screen sizes
- [ ] Backend authorization is enforced
- [ ] Validation is present
- [ ] Secrets and personal data are protected
- [ ] Documentation is updated
- [ ] Pull request is approved and merged
