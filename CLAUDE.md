# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite, hot-reload)
npm run build     # Production build
npm run preview   # Preview production build locally
```

No test runner or linter is configured.

## Environment

Requires a `.env` file with:
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

The Unsplash API key is hardcoded in `src/services/unsplash.js`.

## Architecture

**Stack:** Vue 3 (Composition API, `<script setup>`) + Vuetify 3 + Pinia + Vue Router 4 + vue-i18n 11 + Supabase.

**Two pages:**
- `HomePage` (`/`) — vehicle search form (make/model/year via NHTSA API), navigates to CarDetailPage on submit.
- `CarDetailPage` (`/car/:make/:model/:year`) — fetches/creates the vehicle record in Supabase (`resolveVehicle`), then loads its image (Unsplash), info (NHTSA), reviews, failures, and rating in parallel.

**Services layer** (`src/services/`):
- `supabase.js` — singleton Supabase client, reads credentials from `import.meta.env`.
- `carquery.js` — wraps the NHTSA VPIC API for makes, models, years, and vehicle info.
- `unsplash.js` — fetches a landscape car photo by make/model/year.
- `reviews.js` — `resolveVehicle` (lazy-creates a `vehicles` row on first visit), CRUD for the `reviews` table (joined with `profiles`).
- `failures.js` — CRUD for the `failures` table with upvote/downvote logic via `failure_votes`.

**Supabase schema (inferred):**
- `profiles(id, name, avatar_url)` — linked to Supabase Auth users.
- `vehicles(id, make, model, year)` — created on demand by `resolveVehicle`.
- `reviews(id, vehicle_id, user_id, rating, title, body, created_at)` — joined to `profiles`.
- `failures(id, vehicle_id, user_id, title, problem, solution, status)` — `status` is `'open'` or `'resolved'`.
- `failure_votes(failure_id, user_id, vote)` — `vote` is `'up'` or `'down'`; toggling the same vote deletes it.

**Auth** (`src/stores/auth.js`): Pinia store initialized via `auth.init()` in `App.vue`'s `onMounted`. Handles sign-up, sign-in, sign-out, and listens for Supabase auth state changes to keep `user` and `profile` reactive.

**i18n** (`src/i18n/`): English and Spanish, locale persisted in `localStorage`. Use `const { t } = useI18n()` and `$t('key')` in templates. Add new keys to both `en.js` and `es.js`.

**Component organization:** Components are grouped by page under `src/components/home/` and `src/components/car-detail/`. `AuthModal.vue` is shared.
