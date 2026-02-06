# Supabase CRUD (Next.js + Tailwind)

A simple CRUD demo that uses Supabase to store items and Next.js App Router for the UI.

## Setup

1) Create the Supabase table in the SQL editor:

```sql
create extension if not exists "pgcrypto";

create table if not exists items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  created_at timestamptz default now()
);
```

2) Ensure the environment variables in `.env.local` are set:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

3) Install and run:

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Notes

- The app reads/writes to the `items` table.
- Edit and delete actions are done inline on the home page.
