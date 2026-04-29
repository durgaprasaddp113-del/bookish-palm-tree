# Health Management Web App (React + Vite + Supabase + Vercel)

## Features
- Auth with signup/login and roles (Admin, Doctor, User).
- Dashboard cards: total patients, today appointments, pending checkups, medicine reminders.
- Modules: Patient Profile, Daily Records, Appointments, Medicine Reminders, Reports.
- Export reports to Excel and PDF.
- Responsive UI with sidebar/cards/tables/search.
- **Important:** App does not provide final medical diagnosis. Users should consult qualified doctors.

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create env file:
   ```bash
   cp .env.example .env
   ```
3. Fill in:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Run:
   ```bash
   npm run dev
   ```

## Supabase
1. Create a Supabase project.
2. Open SQL Editor and run `supabase/schema.sql`.
3. In Authentication settings, enable email auth.

## GitHub + Vercel Deployment
1. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial health app"
   git branch -M main
   git remote add origin https://github.com/<your-user>/<repo>.git
   git push -u origin main
   ```
2. Import repo in Vercel.
3. Framework: **Vite** (auto-detected).
4. Add environment variables in Vercel project settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy and open URL.

## Role access
- **Admin:** Full access to all records.
- **Doctor:** View/update assigned patient records.
- **User:** View own records.

## Medical Safety Notice
This project is for record management and reminders only. It is not a substitute for medical diagnosis/treatment.
