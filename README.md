# CodePear

CodePear is a full-stack collaborative coding interview platform built with Turborepo, Next.js, Express, Drizzle ORM, shadcn/ui, and Socket.io. It features real-time code editing, video calls, chat, problem management, and role-based access.

---

## Features

- **Collaborative Coding:** Real-time code editor powered by Monaco and Socket.io.
- **Video Calls:** Peer-to-peer video chat using WebRTC (simple-peer).
- **Live Chat:** Real-time messaging in sessions.
- **Problem Management:** Admins can create, delete, and manage coding problems.
- **Role-Based Access:** User and admin roles with protected routes.
- **Session Management:** Interviewer/candidate sessions with join codes.
- **Modern UI:** Built with shadcn/ui and Tailwind CSS.
- **Monorepo:** Managed with Turborepo for scalable development.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Bun](https://bun.sh/) or [Yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) (optional, for containerization)
- [PostgreSQL](https://www.postgresql.org/) (local or cloud)

### 1. Clone the repository

```sh
git clone https://github.com/Avaneesh-Chopdekar/codepear.git
cd codepear
```

### 2. Install dependencies

```sh
bun install
# or
yarn install
```

### 3. Configure environment variables

Create `.env.local` files in `apps/web` and `apps/api`:

**apps/web/.env.local**

```
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

**apps/api/.env**

```
DATABASE_URL="postgres://user:password@localhost:5432/codepear"
JWT_SECRET="your_jwt_secret"
```

### 4. Setup the database

Run migrations and generate ORM clients:

```sh
bunx drizzle-kit generate:pg
bunx drizzle-kit push:pg
```

### 5. Start the development servers

**API server:**

```sh
bun run dev --cwd apps/api
# or
yarn workspace api dev
```

**Web app:**

```sh
bun run dev --cwd apps/web
# or
yarn workspace web dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Docker Setup

To run everything in Docker:

```sh
# Build and start containers
docker network create app_network
COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker-compose -f docker-compose.yml build
docker-compose -f docker-compose.yml up -d

# Stop containers
docker-compose -f docker-compose.yml down
```

---

## Project Structure

```
apps/
  web/      # Next.js frontend
  api/      # Express backend
packages/
  ui/       # Shared React components
  logger/   # Shared logger
  typescript-config/
  jest-presets/
  eslint-config/
```

---

## Remote Caching

You can enable Vercel Remote Cache for faster builds. See [Vercel docs](https://vercel.com/docs/remote-cache) for setup.

---

## Utilities

- **TypeScript** for static type checking
- **ESLint** for code linting
- **Jest** for testing
- **Prettier** for code formatting

---

## Contributing

Pull requests are welcome! Please open an issue first for major changes.

---

## TODOS

[WEB]

- Add unit and integration tests
- Improve error handling and validation
- Add user profile and settings
- Enhance session analytics and reporting
- Add dark mode
- Integrate with GitHub OAuth
- Integrate Sentry for error tracking

[API]

- Add pagination and filtering for sessions and problems
- Refresh tokens for user sessions
- Add authentication and authorization for API routes
- Add OpenAPI Swagger docs
- Implement rate limiting for API requests
- Add caching for API responses

[FINISHING STEPS]

- Create demo video
- Deploy to Vercel

---

## License

[MIT LICENSE](./LICENSE)

---

## Demo

Coming soon!
