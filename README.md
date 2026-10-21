# Renovation Platform (CSIT314 group project)

An online platform that matches renovation customers to interior designers. Four actors: User Admin, Interior Designer, Customer and Platform Manager.

**Stack:** Next.js (App Router) + React + TypeScript + Tailwind CSS, Supabase (Postgres), Vitest, GitHub Actions, Vercel.

## Design: Boundary, Control, Entity

The code follows the BCE framework, so every class in the class and sequence diagrams exists in the code with the same name and methods.

| Layer | Where | Rules |
| --- | --- | --- |
| **Boundary** | `src/app/**` (pages, forms and their `actions.ts`) | Reads input, calls **one** controller, shows the result. No database calls, no business rules. Name the page component `XxxBoundary`. |
| **Control** | `src/control/` | **One class per user story**, e.g. `CreateRoleController.createRole()`. Holds the rules (validation, checks). No React or Next.js imports. |
| **Entity** | `src/entity/` | `Role`, `UserAccount`, ... Each owns its own database calls. The **only** code that talks to Supabase, and only on the server. |

A sequence diagram for UA #10 reads:
`CreateRoleBoundary -> CreateRoleController.createRole(name, description) -> Role.findByName(name), Role.create(name, description) -> Supabase`.

Accounts and login are our own code (`user_account` table, bcrypt, `iron-session` cookie), not Supabase Auth, because managing accounts and roles is part of the User Admin stories.

Already built as the pattern to copy: **login and logout** (all actors) and **UA #10 create role**.

## Getting started

You need Node 22 and Docker (for the local database).

```bash
npm install
npx supabase start          # local Postgres + API in Docker; applies supabase/migrations
cp .env.example .env.local  # then paste SECRET_KEY from `npx supabase status` into SUPABASE_SECRET_KEY
npm run seed                # 100+ records per data type
npm run dev                 # http://localhost:3000
```

Demo logins (password `Password123!`): `admin@demo.com`, `designer@demo.com`, `customer@demo.com`, `manager@demo.com`.

| Command | What it does |
| --- | --- |
| `npm test` | Unit tests for controllers (fast, no database) |
| `npm run test:watch` | Same, re-running on save. Use this while doing TDD |
| `npm run test:coverage` | Unit tests with a coverage report |
| `npm run test:integration` | Entity tests against the local Supabase |
| `npm run lint` / `npm run typecheck` | Lint and type check |
| `npm run seed` | Wipe and re-seed the local database (`-- --live` for the live one) |
| `npx supabase migration new <name>` | New schema change. Never edit an old migration |

## Building a story (TDD)

1. Branch from `main`: `git checkout -b ua-11-view-roles`.
2. **Red:** write `tests/control/ViewRolesController.test.ts` first, stubbing the entity with `vi.spyOn(Role, "findAll")`. Run it, see it fail, commit (`TG-71 test: view roles (red)`).
3. **Green:** write `src/control/ViewRolesController.ts` and any new entity method. Run the tests, see them pass, commit.
4. Add an entity test in `tests/entity/` for any new database method.
5. Add the boundary page in `src/app/<actor>/...` that calls the controller.
6. Open a pull request. CI must be green before merging. Screenshot red and green test runs for the report's TDD section.

Put the Taiga ref (`TG-<number>`) in commit messages so commits line up with the Taiga board.

## CI/CD

`.github/workflows/ci.yml` runs on every push and pull request:

1. Lint, typecheck, controller unit tests with coverage.
2. Starts a local Supabase in the runner, runs the entity tests and the seed script against it.
3. Production build.

On a push to `main` that passes, the **deploy** job applies new migrations to the live Supabase project and deploys to Vercel. Vercel's own Git auto-deploy is off (`vercel.json`), so every live release has passed the tests.

### One-time setup for deployment

1. Create a Supabase project. CI applies the migrations on the first deploy.
2. Create a Vercel project from this repo. In its Environment Variables, set `SUPABASE_URL`, `SUPABASE_SECRET_KEY` (from Supabase > Project Settings > API keys) and `SESSION_SECRET` (`openssl rand -base64 32`).
3. In GitHub > Settings > Secrets and variables > Actions, add `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` (from `.vercel/project.json` after `npx vercel link`) and `SUPABASE_ACCESS_TOKEN` (Supabase > Account > Access Tokens). No database password is needed. The project ref is set in `ci.yml`; change it there if the Supabase project changes.
4. Protect `main`: require a pull request and the "Lint, typecheck and test" check.
5. Seed the live database before the demo: `npm run seed -- --live` with the live values in `.env.local`.

Free Supabase projects pause after a week without activity. Open the dashboard before the demo.
