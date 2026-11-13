# CyberHub ERP

CyberHub is an academic ERP for students, faculty, departments, and
administrators.

## Current workspace

The existing student and staff portals are kept as separate Next.js applications
while the domain model and backend are being established:

- `CyberHub-Student`: student-facing portal
- `CyberHub-Staff`: faculty and staff-facing portal
- `CyberHub-API`: PostgreSQL-backed authentication and API foundation

The parent workspace provides common commands and local infrastructure. The
frontends remain independently installable applications during this transition,
so their separate lockfiles and Git histories are preserved. The frontends do
not contain production authentication or persistent data yet.

## Requirements

- Node.js 20 or newer
- npm 10 or newer
- Docker Desktop for PostgreSQL and Redis

## Install

From this directory (the parent package delegates installation to each portal):

```bash
npm --prefix CyberHub-Student install
npm --prefix CyberHub-Staff install
npm --prefix CyberHub-API install
```

The child applications also retain their individual lockfiles so they can be
run independently during this transition.

## Run the portals

Use separate terminals:

```bash
npm run dev:student
npm run dev:staff
npm run dev:api
```

## Start local infrastructure

Copy `.env.example` to `.env`, then run:

```bash
docker compose up -d
```

The services are available locally at:

- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`
- API health: `http://localhost:4000/health`

If another local PostgreSQL container already uses port `5432`, start this
project database on an alternate host port and point the API at it:

```powershell
$env:POSTGRES_PORT = "55432"
docker compose up -d postgres redis
$env:DATABASE_URL = "postgresql://cyberhub:change-me-local-only@localhost:55432/cyberhub?schema=public"
```

Generate the Prisma client and apply the development schema:

```bash
npm run db:generate
npm run db:push
```

To create the first administrator, provide a strong password in the shell
environment and run the seed command:

```powershell
$env:BOOTSTRAP_ADMIN_IDENTIFIER = "admin001"
$env:BOOTSTRAP_ADMIN_PASSWORD = "use-a-unique-password-of-10-or-more-characters"
$env:BOOTSTRAP_STUDENT_IDENTIFIER = "uat-student"
$env:BOOTSTRAP_STUDENT_PASSWORD = "use-another-unique-password"
npm run db:seed
```

Stop them with:

```bash
docker compose down
```

Add `-v` only when intentionally deleting local database and Redis data.

## Validation

```bash
npm run lint:student
npm run lint:staff
npm run build:student
npm run build:staff
npm run build:api
```

## Phase 1 boundaries

The API now provides the initial authentication boundary. The ERP domain
modules, authorization policies, migrations, password recovery, email delivery,
and production observability still need to be implemented before public launch.
Never use demo credentials or development secrets in a public deployment.

## UAT vertical slice

The current UAT slice is:

```text
Student login
  -> Projects & Funding
  -> Add New
  -> Submit project
  -> Staff Approvals
  -> Approve or reject
```

The student portal runs on `http://localhost:3000`, the staff portal runs on
`http://localhost:3001`, and the API runs on `http://localhost:4000`.

Authentication is centralized at the staff portal's `/login` page. Student
and staff credentials are checked by the API, then students are sent to the
student portal and faculty, HOD, and administrator accounts are sent to the
staff portal. The session cookie is shared across both local portal ports.

The student portal includes UI workspaces for research, workshops,
conferences, volunteering, hackathons, leadership, and awards. These new
workspaces support search, status filters, draft/submission forms, and
session-only records until dedicated API and database models are introduced.

## Profile and authorization foundation

The API now also exposes:

```text
GET /api/v1/profile
```

The schema includes departments, student profiles, staff profiles, and
department links. Faculty, HOD, and administrator review permissions are
enforced server-side. Administrators can review across departments; department
scoped reviewers can review only submissions from their department.

Authenticated profile endpoints:

```text
GET   /api/v1/profile
PATCH /api/v1/profile
```

Students can update their own name, email, and phone details. Institutional
identity fields such as register number, department, programme, batch, and
semester remain controlled by the ERP data layer.
