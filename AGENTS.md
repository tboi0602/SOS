# AGENTS.md — Tam Trí Lực (SOS)

Two-package monorepo: **TTL-Server** (Express + Prisma/PostgreSQL, port 4000) + **TTL-Website** (Next.js 16 App Router, port 3000). Docker compose at root orchestrates everything plus nginx/certbot/db-backup in `prod` profile.

## Quick start

```bash
# Server (requires postgres running)
cd TTL-Server && npm run dev:full    # starts postgres, pushes schema, generates Prisma client, starts tsx watch

# Or step by step:
npm run db:up       # docker compose up -d postgres
npm run db:setup    # prisma db push && prisma generate
npm run dev         # tsx watch src/index.ts

# Website
cd TTL-Website && npm run dev        # next dev
```

- Server health: `GET /api/health` returns `{ status, database, timestamp }`
- API routes: `/api/v1/{auth,chat,posts,admin,profile,journal,submissions,notifications,lessons}`

## Deploy

```bash
# Local Docker build + push + VPS deploy
npm run deploy                         # bash scripts/deploy.sh .env.docker
bash scripts/deploy.sh --vps-only      # skip build, pull & restart on VPS
bash scripts/deploy.sh --no-deploy     # build + push only

# First-time VPS setup
docker compose pull && docker compose up -d

# Full production (domain + SSL)
bash scripts/setup-prod.sh            # 1-time: requests Let's Encrypt, generates nginx.conf from template
```

Deploy flow: `docker compose build` → tag → `docker push` → SSH to VPS → `docker compose pull && up -d`. SSH host configured in `.env.docker` via `SSH_HOST`. If unset, build+push only.

## Key config & quirks

- **`.env`** for local dev, **`.env.docker`** for Docker — copy from `.env.example`
- Prisma config: `TTL-Server/prisma.config.ts` (uses `defineConfig` from `prisma/config`, not default schema path)
- Migrations: `npx prisma migrate deploy` runs at server container start; `prisma db push` for dev
- Next.js outputs `standalone` for Docker (`next.config.ts`)
- Nginx: `nginx.conf` is generated from `nginx/nginx.conf.template` via `sed` in `setup-prod.sh`; not committed
- `data/` is gitignored (Postgres bind mount)
- `.gitignore` also ignores `/.claude`, `/docs`, `.env.docker`, `*.local`, `/.codegraph`
- `.hintrc`: `no-inline-styles: off`

## Architecture notes

- Server: Express + Prisma (PostgreSQL) + Zod validation + JWT (httpOnly cookies) + multer uploads + Gemini AI + Resend email
- Website: Next.js 16 App Router, Tailwind v4, react-three-fiber, Framer Motion, Recharts, lucide-react
- 9 Prisma models: User, AuditLog, Journal, Submission, Post, Like, Notification, Lesson, Comment
- Auth: email/password + Google OAuth (google-auth-library) + TBV OIDC SSO (Authorization Code + PKCE), activation tokens, rate limiting
- Admin dashboard at `/api/v1/admin/*` (role-based)
- File uploads served from `/uploads` on server, stored in Docker volume `uploads_data`

## No tests

No test framework in any `package.json`. No CI workflows.

## CodeGraphContext (MCP)

This project has `codegraphcontext` (cgc) MCP server configured in `opencode.json` for AI-powered code analysis. The repo is already indexed into a KuzuDB graph database with auto-watch enabled (live file change tracking).

- MCP tools available: `find_code`, `analyze_code_relationships`, `find_most_complex_functions`, `execute_cypher_query`, `find_dead_code`, etc.
- Re-index manually: `cgc index` from project root
- Config: `/home/zenng/.codegraphcontext/.env`
