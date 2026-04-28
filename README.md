# 4D BIM Progress Tracking MVP

Working MVP for construction progress tracking with React + Vite, React Three Fiber/Three.js, Supabase, Tailwind CSS, and Vercel deployment.

## 1) Folder structure

```text
bookish-palm-tree/
├─ public/
│  └─ models/
│     └─ building.glb            # place your BIM model here
├─ src/
│  ├─ components/
│  │  └─ ModelViewer.jsx
│  ├─ lib/
│  │  └─ supabaseClient.js
│  ├─ App.jsx
│  ├─ index.css
│  └─ main.jsx
├─ supabase/
│  └─ schema.sql
├─ .env.example
├─ index.html
├─ package.json
├─ postcss.config.js
├─ tailwind.config.js
└─ vite.config.js
```

## 2) Features in this MVP

1. Loads a `.glb` model from `public/models/building.glb`.
2. Supports rotate/zoom/pan via OrbitControls.
3. Includes activities:
   - Excavation
   - Piling
   - Raft
   - Columns
   - Slabs
   - Blockwork
   - MEP
   - Finishing
4. Per-activity progress percentage.
5. Color mapping by progress:
   - `0%` = grey
   - `1–99%` = orange
   - `100%` = green
   - delayed = red
6. Dashboard shows:
   - Overall progress
   - Activity progress
   - Last update date
   - Remarks
7. Supabase schema included in `supabase/schema.sql`.

## 3) Step-by-step run commands

```bash
# 1) Install dependencies
npm install

# 2) Copy environment template
cp .env.example .env

# 3) Fill .env with your Supabase URL + anon key

# 4) Run locally
npm run dev
```

Open the local URL shown by Vite (usually `http://localhost:5173`).

## 4) Supabase setup

1. Create a new Supabase project.
2. In SQL Editor, run `supabase/schema.sql`.
3. Copy project URL and anon key to `.env`.

If env vars are missing, the app still runs with local in-memory data.

## 5) Model linking for color updates

Mesh-to-activity linking is name-based:
- if a mesh name contains `excavation`, it uses Excavation color rules.
- same idea for piling, raft, columns, slabs, blockwork, mep, finishing.

Tip: Name BIM export elements with these keywords for direct activity color mapping.

## 6) Deploy to Vercel

```bash
# install vercel cli if needed
npm i -g vercel

# from project root
vercel
```

In Vercel project settings, add:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Then redeploy.
