# Escobar.Club

A creator–business partnership platform. Businesses list public profiles, creators apply with a pitch,
approved creators submit content for review, and — once approved — creators publish that content to
Instagram and link it back into the app. From there the platform tracks its real performance via an Apify
Instagram scraper and ranks creators on business-level and global view-count leaderboards.

**In scope:** business discovery → creator application → approval → content submission → content review
(approve / reject / request changes, with versioned resubmission and a full note history) → publishing
(creator links their live Instagram post) → on-demand performance metrics sync (likes/comments/views via
Apify) → creator leaderboards (per-business and global, ranked by total views).

**Out of scope (by design):** payments/payouts and any rate-card logic — deferred until real payout
requirements are defined. No official Meta/Instagram Graph API integration (metrics come from Apify's
unofficial scraper, same ToS caveat that implies); "publishing" means the creator posts manually and
self-reports the link, it is not automated posting.

---

## Architecture overview

```
escobar-club/
  backend/    Spring Boot 3 (Java 21) REST API — Controller → Service → Repository → Entity
  frontend/   React 18 + TypeScript (Vite) SPA
  docker-compose.yml
```

**Backend** is a single-service monolith with strict layering:

- `controller/` — HTTP boundary only. Validates input (`@Valid`), enforces role auth (`@PreAuthorize`), and
  maps to/from DTOs. Never touches repositories directly.
- `service/` (+ `service/impl/`) — all business logic and state-transition rules live here. Interfaces are
  separate from implementations so they can be mocked cleanly in unit tests.
- `repository/` — Spring Data JPA repositories.
- `entity/` — JPA entities. Enums are stored as strings (`@Enumerated(EnumType.STRING)`), never ordinals.
- `dto/` + `mapper/` — API requests/responses are DTOs (records), mapped from entities via MapStruct.
  Entities are never serialized directly.
- `security/` — JWT issuing/parsing, the auth filter, and the `UserDetailsService` adapter.
- `storage/` — `StorageService` interface with a local-disk implementation (`LocalStorageService`). A
  future S3-backed implementation is a drop-in `@Service` swap, not a rewrite.
- `integration/apify/` — the Apify Instagram scraper client (`ApifyInstagramClient`), kept separate from
  `service/` since it's third-party HTTP plumbing, not domain logic.
- `exception/` + `GlobalExceptionHandler` — a consistent error shape (`{ timestamp, status, error, message,
  path }`) for every failure mode; no stack traces or raw exception messages ever reach the client.

**Frontend** is a Vite-built React SPA:

```
frontend/src/
  api/          axios instance + auth interceptor, one module per REST resource
  auth/         AuthContext (JWT/session state) + ProtectedRoute
  components/   shared design-system UI (Button, Card, StatusPill, TickMeter, Toast, AppShell, ...)
  features/     feature-specific components (businesses/, applications/, content/, creators/)
  pages/        route-level screens, grouped by role (creator/, business/)
  types/        TypeScript types mirroring backend DTOs
```

State-transition rules (who can move an application/content item from one status to another, and when)
are enforced **server-side** in the service layer — the frontend only reflects what the API allows.

---

## Tech stack

| Layer          | Choice                                                            |
|----------------|--------------------------------------------------------------------|
| Backend        | Java 21, Spring Boot 3, Spring Web/Data JPA/Security, springdoc-openapi |
| Database       | MySQL 8, Flyway migrations                                        |
| Auth           | JWT (short-lived access token + rotating refresh token), BCrypt   |
| Frontend       | React 18, TypeScript (strict), Vite, Tailwind CSS                 |
| Data fetching  | TanStack Query                                                    |
| Forms          | react-hook-form + zod                                             |
| Containerization | Docker + Docker Compose                                         |

---

## Running locally with Docker (fastest path)

Requirements: Docker Desktop.

```bash
cp .env.example .env
# edit .env and set real values for JWT_SECRET, DB_PASSWORD, etc.

docker compose up --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui.html

The `mysql` service seeds a database automatically; Flyway migrations run on backend startup.

---

## Running locally without Docker

### Requirements

- Java 21 + Maven 3.9+
- Node 20+
- A local MySQL 8 instance

### 1. Database

```sql
CREATE DATABASE escobar_club;
CREATE USER 'escobar'@'%' IDENTIFIED BY 'escobar';
GRANT ALL PRIVILEGES ON escobar_club.* TO 'escobar'@'%';
```

### 2. Backend

```bash
cd backend
cp ../.env.example .env   # or export the same variables in your shell
mvn spring-boot:run
```

The backend runs on `dev` profile by default (`SPRING_PROFILES_ACTIVE=dev`), reading `application-dev.yml`.
Flyway applies all migrations in `src/main/resources/db/migration` on startup.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Vite proxies `/api` and `/media` to `http://localhost:8080` (configurable via `VITE_API_PROXY_TARGET`), so
no CORS setup is needed for local dev.

Visit http://localhost:5173, register a **Business** account and a **Creator** account (in separate
browser sessions or via incognito), and walk through the flow: browse → apply → approve → submit content →
review.

---

## Environment variables

See [`.env.example`](.env.example) for the full list. Key ones:

| Variable | Purpose |
|---|---|
| `JWT_SECRET` | Signing key for access/refresh tokens. Must be long and random in any real deployment. |
| `JWT_ACCESS_TTL_MINUTES` / `JWT_REFRESH_TTL_DAYS` | Token lifetimes. |
| `DB_HOST` / `DB_PORT` / `DB_NAME` / `DB_USERNAME` / `DB_PASSWORD` | MySQL connection. |
| `UPLOAD_DIR` | Where uploaded media is stored on disk (served back under `/media/**`). |
| `CORS_ALLOWED_ORIGINS` | Origins allowed to call the API (the frontend's dev/prod URL). |
| `APIFY_API_TOKEN` | Your Apify account token — required for the metrics-sync feature to actually reach Apify. Get one at [console.apify.com](https://console.apify.com/account/integrations). |
| `APIFY_ACTOR_ID` / `APIFY_BASE_URL` / `APIFY_TIMEOUT_MS` | Apify actor and API config; sensible defaults are provided. The actor run is synchronous and can take 30–90s, hence the generous default timeout. |
| `METRICS_SYNC_MIN_INTERVAL_MINUTES` | Minimum time between metrics syncs for a single piece of content (rate limit to avoid hammering Apify). Default 15. |

Never commit a real `.env` file — only `.env.example` is tracked.

---

## Running tests

### Backend

```bash
cd backend
mvn test
```

This runs:

- **Unit tests** (`src/test/java/club/escobar/service/`) — service-layer business logic and state-transition
  rules (application approve/reject, content submit/resubmit/review) using JUnit 5 + Mockito, with no
  database involved.
- **Controller slice tests** (`src/test/java/club/escobar/controller/`) — MockMvc tests validating request/
  response contracts and validation error shapes.
- **Integration tests** (`src/test/java/club/escobar/integration/`) — full end-to-end HTTP flows (register →
  apply → approve → submit content → request changes → resubmit → approve; and separately publish → sync
  metrics (Apify client stubbed) → rate-limit → leaderboard) against a real MySQL instance via
  Testcontainers. **Requires Docker to be running** since Testcontainers spins up a throwaway MySQL
  container.

To skip the Testcontainers-based integration tests (e.g. no Docker available):

```bash
mvn test -Dtest='!*IntegrationTest'
```

### Frontend

```bash
cd frontend
npm run lint     # ESLint
npx tsc -b       # strict TypeScript check
npm run build    # production build
```

---

## Folder structure reference

### `backend/`

```
src/main/java/club/escobar/
  config/        Spring configuration (security, CORS, OpenAPI, storage/JWT properties, static resources)
  controller/    REST controllers (one per resource: auth, businesses, creators, applications, content, media)
  dto/           Request/response records, grouped by resource
  entity/        JPA entities + enums
  exception/     Custom exceptions + GlobalExceptionHandler
  mapper/        MapStruct entity↔DTO mappers
  repository/    Spring Data JPA repositories
  security/      JWT service, auth filter, UserDetails adapter
  service/       Service interfaces (+ impl/ for implementations)
  storage/       StorageService abstraction (local disk today, S3-ready)
src/main/resources/
  application.yml, application-{dev,test,prod}.yml
  db/migration/  Flyway SQL migrations
src/test/java/club/escobar/
  service/       Unit tests
  controller/    MockMvc slice tests
  integration/   Testcontainers end-to-end tests
```

### `frontend/`

```
src/
  api/         axios client + auth interceptor + per-resource API modules
  auth/        AuthContext, ProtectedRoute
  components/  Shared design-system components
  features/    Feature-specific components (businesses, applications, content, creators)
  pages/       Route-level pages (creator/, business/ subfolders for role-specific screens)
  types/       Shared TypeScript types mirroring backend DTOs
  hooks/       Small reusable hooks
```

---

## API surface

Full interactive documentation is available at `/swagger-ui.html` once the backend is running. Summary:

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout

GET    /api/businesses                    (public, paginated, searchable by name/industry)
GET    /api/businesses/{id}               (public)
GET    /api/businesses/me                 (business)
PUT    /api/businesses/me                 (business)

GET    /api/creators/{id}                 (authenticated)
GET    /api/creators/me                   (creator)
PUT    /api/creators/me                   (creator)

POST   /api/applications                  (creator)
GET    /api/applications/me               (creator)
GET    /api/businesses/{id}/applications  (business inbox, paginated, filterable by status)
PATCH  /api/applications/{id}/status      (business: approve/reject + note)

POST   /api/applications/{id}/content     (creator; requires an APPROVED application)
PATCH  /api/content/{id}                  (creator; edit/resubmit after changes requested)
GET    /api/content/me                    (creator)
GET    /api/businesses/{id}/content       (business review queue, paginated, filterable by status)
PATCH  /api/content/{id}/review           (business: approve/reject/request changes + note)
PATCH  /api/content/{id}/publish          (creator; requires APPROVED content, records the live Instagram URL)

POST   /api/content/{id}/metrics/sync     (creator or business who owns the content; rate-limited)
GET    /api/content/{id}/metrics          (creator or business who owns the content; paginated history)

GET    /api/businesses/{id}/leaderboard   (business; own creators ranked by total views)
GET    /api/leaderboard/global            (any authenticated user; all creators ranked by total views)

POST   /api/media/upload                  (authenticated, multipart)
```

Every state transition (application PENDING→APPROVED/REJECTED, content SUBMITTED→APPROVED/REJECTED/
CHANGES_REQUESTED→SUBMITTED→...→PUBLISHED, ...) is validated server-side; invalid transitions return
`409 Conflict` with a clear message rather than silently succeeding. Metrics syncing hitting the rate limit
returns `429 Too Many Requests`.
