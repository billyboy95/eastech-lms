# EASTC LMS

Starter scaffold for **East Sea Technocentric (EASTC)** — a school, artisan college, varsity, and food court sharing one student learning model.

This is a working catalog + enrollment skeleton, not a Moodle clone. It is meant to be forked, pointed at a real database, and grown into EASTC’s production LMS.

## Who it is for

- **Students** browse published courses, enroll, read lessons, and track progress.
- **Educators** open Studio to see the courses they author and a demo roster.

Every seeded person uses an `@eastc.demo` address. There is no real student PII in this repository.

## Stack (and why)

| Piece | Choice | Why |
| --- | --- | --- |
| App | **Next.js 16** (App Router) + **TypeScript** | Server-rendered catalog, deployable to Node or Vercel, typed routes and server actions. |
| UI | **Tailwind CSS 4** | Utility styling without a design-system lock-in. |
| Data | **Prisma** + **SQLite** | Explicit `User` / `Course` / `Lesson` / `Enrollment` / `LessonProgress` models. SQLite needs no cloud credentials for local work. Swap the Prisma `provider` to `postgresql` when you leave the laptop. |
| Auth | **Demo session cookie** | HMAC-signed httpOnly cookie. Pick a persona — no passwords, no OAuth secrets in git. Replace before production. |
| Tests | **Vitest** | Unit tests for progress, roles, campus tracks, and session tokens. |

## Learning model

```
User (STUDENT | EDUCATOR)
  └── teaches → Course (campus track: SCHOOL | ARTISAN_COLLEGE | VARSITY | FOOD_COURT)
                  └── Lesson (ordered)
  └── Enrollment (ACTIVE | COMPLETED)
  └── LessonProgress
```

Progress is `completed lessons / published lessons` on that course. Hitting 100% marks the enrollment `COMPLETED`.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run setup` | Generate Prisma client, push the schema, seed demo data |
| `npm run dev` | Next.js dev server (http://localhost:3000) |
| `npm test` | Vitest once |
| `npm run test:watch` | Vitest in watch mode |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run db:reset` | Wipe the local SQLite file and re-seed |

## Local install

Requires **Node 20+** (22 is what CI uses).

```bash
git clone https://github.com/billyboy95/eastech-lms.git
cd eastech-lms
cp .env.example .env
npm install
npm run setup
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use **Demo sign in** and pick a persona.

### Demo personas

| Role | Name | Email |
| --- | --- | --- |
| Educator · School | Priya Sharma | priya.sharma@eastc.demo |
| Educator · Artisan | Amara Nkrumah | amara.nkrumah@eastc.demo |
| Educator · Varsity | Kofi Mensah | kofi.mensah@eastc.demo |
| Educator · Food Court | Chef Adaeze Okafor | adaeze.okafor@eastc.demo |
| Student · School | Nia Okonkwo | nia.okonkwo@eastc.demo |
| Student · Artisan | Samir Patel | samir.patel@eastc.demo |
| Student · Varsity | Jordan Lee | jordan.lee@eastc.demo |
| Student · Food Court | Lila Chen | lila.chen@eastc.demo |

Seeded catalog: Digital Foundations, Joinery Studio I, Applied Computing 101, Kitchen Operations & Food Safety, Coastal Enterprise Lab.

## Checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

GitHub Actions runs the same sequence on every pull request.

## Environment

`.env.example` documents:

- `DATABASE_URL` — default `file:./dev.db` next to the Prisma schema (the db file is gitignored)
- `DEMO_AUTH_SECRET` — optional locally (a non-production default is used). **Required in production**, minimum 16 characters. Never commit a real secret.

## Deploy notes

SQLite is for laptops and CI. Serverless hosts will not persist `prisma/dev.db`.

To go live:

1. Provision Postgres (or similar).
2. Change `provider` in `prisma/schema.prisma` to `postgresql`.
3. Set `DATABASE_URL` and `DEMO_AUTH_SECRET` on the host — do not put them in git.
4. Run `npx prisma migrate deploy` (add a first migration when you leave `db push`) and `npm run db:seed` only against a throwaway environment.
5. Replace demo auth with EASTC’s real identity provider before any live cohort uses the app.

## Out of scope (on purpose)

Gradebooks, quizzes, SCORM, video hosting, discussion forums, notifications, payments, and real identity. Those belong in later iterations on top of this model.

## License

Public starter for EASTC / East Sea Technocentric. Demo content is fictional.
