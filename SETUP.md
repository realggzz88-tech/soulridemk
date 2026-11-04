# Stage 2 Supabase setup (Free tier only)

This repo does not create Supabase projects and does not talk to a live project.
A ClickCash org owner does that in the dashboard. Use the **Free** plan only.
Do not enable paid add-ons: no Image Transformations, no Point-in-Time Recovery,
no custom domain on Supabase, no leaked-password protection, no branching, no read replicas.

Create both projects in **EU (Frankfurt) / `eu-central-1`**. The org has two free
project slots. Until production is approved, create only staging.

| Project | When | Purpose |
| --- | --- | --- |
| `soulride-staging` | Now | GitHub Pages preview and QA |
| `soulride-prod` | After the prod approval | Cloudflare production |

Do not reuse the old Lovable project (`mmgnqtruwthyxakskgus`). It is test data the
org cannot access. `supabase/config.toml` still carries that ref only so this
repo is not linked to a new project by accident. Replace `project_id` when you
link staging. Never run `supabase link` or `supabase db push` against the old ref.

## What to create

### 1. Projects

1. Create `soulride-staging` on the Free plan, region Frankfurt.
2. Add the developers who need SQL and logs.
3. Leave production uncreated until it is approved. It uses the second free slot.

### 2. Keys and secrets

| Name | Where it lives | Notes |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | GitHub **environment variable** `staging` (later `production`) | `https://<ref>.supabase.co`. Public. Injected into `vite build`. |
| `VITE_SUPABASE_PROJECT_ID` | GitHub environment variable | The project ref. |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | GitHub environment variable | The anon / publishable key. Public by design. Never the service-role key. |
| `VITE_TURNSTILE_SITE_KEY` | GitHub environment variable | Public Turnstile site key. |
| `VITE_PASSWORD_RESET_ENABLED` | GitHub environment variable | `false` until SMTP is approved. |
| `SUPABASE_ACCESS_TOKEN` | GitHub **environment secret** | Account access token for `supabase db push` and backups. |
| `SUPABASE_DB_PASSWORD` | GitHub environment secret, one per environment | Database password. Required reviewers on `production`. |
| `OPENWEATHER_API_KEY` | `supabase secrets set` | Server-side only. Free OpenWeatherMap key. |
| `CRON_SECRET` | `supabase secrets set` | Long random string. Same value as the Vault secret below. |
| `github_dispatch_token` | Supabase Vault | Fine-grained GitHub PAT, this repo only, `contents:write`. |
| `functions_base_url` | Supabase Vault | `https://<ref>.supabase.co/functions/v1` |
| `cron_secret` | Supabase Vault | Same value as `CRON_SECRET`. |
| `rebuild_dispatch_url` | Supabase Vault, later | Optional Cloudflare Pages deploy hook. Leave unset for now. |
| Turnstile secret | Supabase Auth → Bot and Abuse Protection | Not an env var in this repo. |
| `SUPABASE_SERVICE_ROLE_KEY` | Injected into Edge Functions by Supabase | Do not copy it into GitHub or the frontend. |

Vault (SQL editor, once, as the owner):

```sql
select vault.create_secret('PASTE_PAT', 'github_dispatch_token', 'contents:write on this repo only');
select vault.create_secret('https://YOUR_PROJECT_REF.supabase.co/functions/v1', 'functions_base_url');
select vault.create_secret('PASTE_SAME_VALUE_AS_CRON_SECRET', 'cron_secret');
```

First admin, once, after that person has signed up:

```sql
insert into public.user_roles (user_id, role)
select id, 'admin'::public.app_role
from auth.users
where email = 'the-admin@example.com';
```

### 3. Auth settings

Staging, now:

| Setting | Value |
| --- | --- |
| Site URL | `https://realggzz88-tech.github.io/soulridemk/` |
| Redirect allow-list | `https://realggzz88-tech.github.io/soulridemk/**` and `http://localhost:8080/**` |
| Confirm email | **Off** |
| Password reset | Leave the default mailer. The app hides "Forgot password" (`VITE_PASSWORD_RESET_ENABLED=false`) until SMTP is approved. |
| Minimum password length | 10 |
| Password requirements | Letters and digits |
| CAPTCHA | Turnstile on for sign-up, sign-in and reset |
| Leaked-password protection | Not available on Free. Do not turn on a paid add-on. |

The redirect URLs keep the `/soulridemk/` base path used by GitHub Pages.
Local `supabase/config.toml` mirrors the length, the letters-and-digits rule,
confirmation off, and the same redirect list for `supabase start`. Turnstile
stays off in that local file because the secret is not in git.

Later, for production, add:

- Site URL: the Cloudflare origin, then the custom domain
- Redirects: `https://<project>.pages.dev/**`, `https://*.<project>.pages.dev/**`, `https://<custom-domain>/**`
- Confirm email on, via an approved **free single-sender SMTP** (no paid mail domain). Do not open an SMTP account until that approval.
- Password reset on, using the same redirect helper as sign-up

### 4. Apply the database

From a machine with Docker and the Supabase CLI, against the local stack or after
`supabase link` to **staging**:

```sh
node --experimental-strip-types scripts/gen-seed.ts
supabase start
supabase db reset
supabase test db
```

`db reset` replays `supabase/migrations` in order: the existing 7 stage 1 files,
then the stage 2 files. Do not edit a migration after it has been applied.
A new content version is a new file from `scripts/gen-seed.ts` (bump the version
in that script). Seed rows are drafts. A route cannot be published while any of
its stops is still a draft. Re-running the seed function does not overwrite a
row whose `updated_by` is set.

`supabase db push` to staging is for CI after merge to `main`. Do not push to
production except on a tagged release, and do not push anywhere from this setup
until the owner has created the project.

### 5. Edge Functions

`supabase/functions` holds scaffolds for `weather`, `purge-chat-photos`,
`delete-account` and `dispatch-rebuild`. Nothing here deploys them and none of
them contain a real key. Deploy only after the secrets above exist. The chat
purge and the rebuild dispatcher also exist as SQL functions scheduled with
`pg_cron` when that extension is available.

### 6. Owner checklist

- [ ] Free Supabase org, Frankfurt, project `soulride-staging` only (prod later)
- [ ] No paid add-ons
- [ ] GitHub environment `staging`: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PROJECT_ID`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_TURNSTILE_SITE_KEY`, `VITE_PASSWORD_RESET_ENABLED=false`
- [ ] GitHub secrets: `SUPABASE_ACCESS_TOKEN`, `SUPABASE_DB_PASSWORD`
- [ ] Supabase secrets: `OPENWEATHER_API_KEY`, `CRON_SECRET`
- [ ] Vault: `github_dispatch_token`, `functions_base_url`, `cron_secret`
- [ ] Auth Site URL and redirect allow-list, including `/soulridemk/`
- [ ] Confirm email off, Turnstile on, password length 10 with letters and digits
- [ ] Password reset left unavailable until the free SMTP approval
- [ ] First admin inserted into `user_roles`
- [ ] `config.toml` `project_id` replaced with the new ref when linking
- [ ] Migrations applied with `supabase db push` to staging, never by dashboard SQL (except the one-time admin grant and Vault secrets)
