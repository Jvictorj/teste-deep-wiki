# front-zapfarma

Angular 18 front-end for **ZapFarma**, built with Nx and Angular Material.

## Prerequisites

- Node.js (LTS recommended)
- npm

## Getting Started

```bash
# Install dependencies
npm install

# Copy the example environment file and fill in your values
cp .env.example .env

# Start the development server
npm start
```

The dev server runs at `http://localhost:4200` by default.

## Environment Variables

All required environment variables are documented in **`.env.example`**.

| Variable | Description | Default |
|---|---|---|
| `PORT` | Express / SSR server port | `4000` |
| `CAREERS_STORAGE_MODE` | Careers storage backend (`memory` \| `postgres`) | `memory` |
| `CAREERS_DATABASE_URL` | PostgreSQL connection string (when using `postgres` mode) | — |
| `BASE_URL` | Base URL for Playwright E2E tests | `http://localhost:4200` |
| `CI` | Set to `true` in CI environments | — |

Angular compile-time settings (API URLs, Cal.com config, webhooks, etc.) live in
`src/environments/environments.ts`. See the comments in `.env.example` for the
full list of configurable values.

## Scripts

| Command | Description |
|---|---|
| `npm start` | Start the dev server (`nx serve`) |
| `npm run build` | Production build (`nx build`) |
| `npm test` | Run unit tests (`nx test`) |

## Project Structure

```
├── e2e/                  # Playwright E2E tests
├── src/
│   ├── app/              # Angular application
│   ├── environments/     # Compile-time environment config
│   └── server/           # Express server-side code (careers API)
├── server.ts             # SSR entry point
├── .env.example          # Environment variable reference
├── project.json          # Nx project configuration
└── package.json
```
