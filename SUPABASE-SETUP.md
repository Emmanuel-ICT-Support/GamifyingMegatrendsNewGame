# Supabase setup (class sessions & workshop strength)

Students’ answers are pooled by **session**. You start a new session when you want to reset the pool (e.g. a new class run). Results are grouped by the categories they chose and you get a **workshop strength** summary for the class.

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a project.
2. In the project: **Project Settings → API**.
3. Copy the **Project URL** and the **anon public** key.

## 2. Create the tables

1. In Supabase: **SQL Editor**.
2. Run the contents of **supabase/schema.sql** (creates `sessions`, `submissions`, and `est_practice` tables). If you already ran it before, run only the new `est_practice` section at the bottom of the file.

## 3. Configure the game

1. Open **config/supabase-config.js**.
2. Replace `YOUR_PROJECT_REF` and `YOUR_ANON_KEY` with your Project URL and anon key.

## 4. How to use

- **Teacher:** Open **teacher.html** (e.g. `http://localhost:3000/teacher.html`).
  - Click **New session**. Copy the **game link** and share it with students (it includes `?session=...`).
  - When you want to review: **Load sessions**, choose the session, then see **Choices by category** and **Workshop strength**.
- **Students:** Use the link the teacher shared. Their choice is saved to that session and grouped under:
  - Work environments  
  - Types of employment  
  - Emerging/declining jobs  
  - Do nothing  
  - Micro niche/specialisation  

If Supabase is not configured, the game still works and can use the local **Back** (server.js) for saving.
