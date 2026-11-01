# SoulRide

SoulRide is a rider’s guide to North Macedonia: scenic roads, hidden spots, suggested loops, and a small community layer (accounts, profiles, and chat) backed by Supabase.

The catalog of spots and routes lives in the repo as static data. Accounts, photos, and chat use Supabase when those env vars are set.

## Stack

- Vite 5, React 18, TypeScript
- Tailwind CSS and shadcn/ui
- React Router, TanStack Query
- Leaflet (maps and marker clusters)
- Supabase (auth, profiles, chat, storage)
- Vitest and Testing Library

## Local setup

Requirements: Node.js 22 (Node 20+ should work) and npm.

```sh
npm ci
cp .env.example .env
```

Edit `.env` with the Supabase URL, project ref, and anon/publishable key for the project you want to talk to. Do not commit `.env`. Do not put the service-role key in any `VITE_*` variable — those values are compiled into the browser bundle.

```sh
npm run dev
```

The dev server listens on port 8080.

`VITE_OPENWEATHER_API_KEY` is optional. When it is missing or still the placeholder `YOUR_API_KEY`, spot pages show a stable local weather estimate instead of calling OpenWeather. A server-side proxy is the intended next step so a live key is not shipped to browsers.

This repo does not run Supabase migrations for you. SQL history is in `supabase/migrations/`. Do not apply it to the hosted project unless you own that database and mean to change it.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Yes | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Yes | Supabase anon/publishable key |
| `VITE_SUPABASE_PROJECT_ID` | No (app) | Project ref. The Vite app does not read it today; `supabase/config.toml` holds the same id for the CLI |
| `VITE_OPENWEATHER_API_KEY` | No | Live weather. Unset means the on-page estimate |

Hosted builds (Vercel, Lovable, or anything else) must set the Supabase variables in the host. They used to be committed in `.env`, which this repo no longer tracks.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc` for the app and Vite config |
| `npm test` | Vitest once |
| `npm run test:watch` | Vitest watch mode |

GitHub Actions (`.github/workflows/ci.yml`) runs install, lint, typecheck, tests, and build on push and pull request. CI uses placeholder Supabase values and does not call the hosted project.

## Preview on GitHub Pages

`.github/workflows/pages.yml` publishes a static build to GitHub Pages. It does not deploy to soulridemk.lovable.app or soulridemk.vercel.app.

The site is a project page, so the build sets Vite `base` to `/<repo>/` (for this repo, `/soulridemk/`). React Router uses that basename. The Pages build copies `index.html` onto each known screen (`routes.html`, `spots/<id>.html`, and the other app paths) so those URLs return 200. Anything else is `404.html`, which is the same app shell, so an unknown path still loads SoulRide instead of GitHub’s generic 404.

Local `npm run dev` and the CI build keep `base` at `/`. To reproduce the Pages build locally:

```sh
VITE_BASE=/soulridemk/ npm run build
```

The Pages workflow uses placeholder Supabase values unless the repository secrets `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, and `VITE_SUPABASE_PROJECT_ID` are set. Browsing spots and routes does not need those secrets. Sign-in on the preview will not reach the hosted project until the secrets exist.

Pages is not enabled on this repository yet. An admin needs to turn it on once:

1. Open **Settings → Pages → Build and deployment**.
2. Set **Source** to **GitHub Actions**.

After that, the workflow on `main` and on this branch publishes to:

https://realggzz88-tech.github.io/soulridemk/

If the deploy job fails with a token permission error, set **Settings → Actions → General → Workflow permissions** to **Read and write permissions**.

## Project structure

```
src/
  components/        feature UI; components/ui is shadcn
  data/              spots, routes, and journey-planner places
  hooks/             auth, weather, favorites, uploads
  integrations/supabase/   browser client and generated Database types
  lib/               env helpers and small shared utilities
  pages/             route screens
  test/              Vitest setup and smoke tests
supabase/
  config.toml        CLI project ref (not a secret)
  migrations/        historical SQL — not applied by CI
public/              static files
```

Pages are loaded with `React.lazy` in `src/App.tsx`.

## Auth and data

Spot and route pages render from `src/data/spots.ts` and `src/data/routes.ts`. `/routes` lists every catalog route; `/routes/:id` is one ride. Sign-in, profiles, favorites stored on the server, chat, and photo upload need a reachable Supabase project and the public env vars above. Row Level Security on that project is what keeps the anon key safe to expose in the client.
