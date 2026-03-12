# Supabase to-do list

Use this checklist to get class sessions and EST practice scores working with Supabase.

---

## 1. Create a Supabase project

- [ ] Go to [supabase.com](https://supabase.com) and sign in (or create an account).
- [ ] Click **New project**.
- [ ] Choose an organization, name the project (e.g. `megatrends-game`), set a database password, pick a region, then click **Create new project**.
- [ ] Wait for the project to finish provisioning.

---

## 2. Get your API details

- [ ] In the Supabase dashboard, open **Project Settings** (gear icon in the left sidebar).
- [ ] Click **API** in the left menu.
- [ ] Copy and save:
  - **Project URL** (e.g. `https://xxxxx.supabase.co`)
  - **anon public** key (under "Project API keys").

---

## 3. Create the database tables

- [ ] In the Supabase dashboard, open **SQL Editor**.
- [ ] Click **New query**.
- [ ] Open the file **supabase/schema.sql** in this project and copy its full contents.
- [ ] Paste into the SQL Editor and click **Run** (or press Cmd/Ctrl + Enter).
- [ ] Confirm you see success messages and that the tables **sessions**, **submissions**, and **est_practice** exist under **Table Editor**.

---

## 4. Connect the game to Supabase

- [ ] In this project, open **config/supabase-config.js**.
- [ ] Replace `YOUR_PROJECT_REF` in the `url` with your **Project URL** (the full URL, e.g. `https://xxxxx.supabase.co`).
- [ ] Replace `YOUR_ANON_KEY` with your **anon public** key.
- [ ] Save the file.

---

## 5. Simple way for students to join

- **One link for the class:** Share `http://YOUR_IP:3000/play` with students (e.g. on the board or via your usual channel).
- **Session code:** After you click **New session** on the teacher page, you’ll see a **Session code**. Students open the join link, paste (or type) that code, and click **Start game**.
- No need to share a long URL with the session in it—just the join link + code.

---

## 6. Test the flow

- [ ] **Start the game** (see “How to start the game” below).
- [ ] In your browser, open **teacher.html**: `http://localhost:3000/teacher.html`
- [ ] Click **New session**. Use the **Copy link** and **Copy code** buttons; open the join link in another tab, paste the session code, click **Start game**, and play through.
- [ ] Back on the teacher page, click **Load sessions**, choose the session, and confirm you see:
  - **Choices by category** (your test choice and name).
  - **Workshop strength** (scores).
  - **EST Practice – class total & group reward** (your EST score and group reward).

---

## Done

- [ ] Supabase is set up; teachers can create sessions, share links, and view class results and EST practice totals.

**Tip:** If you already ran the schema before and only added EST Practice later, run just the `est_practice` part of **supabase/schema.sql** (from `create table if not exists public.est_practice` to the end).

---

## How to start the game

The game runs as a small web server on your computer. You need to start it before opening the game or teacher page in the browser.

1. **Open a terminal**  
   - In Cursor: **Terminal → New Terminal** (or `` Ctrl+` `` / `` Cmd+` ``).  
   - Or on Mac: open **Terminal** from Applications/Utilities.  
   - Or on Windows: open **Command Prompt** or **PowerShell**.

2. **Go to the project folder**  
   Type (then press Enter):
   ```bash
   cd "/Users/tania.byrnes/Desktop/New Game"
   ```
   If your project lives somewhere else, use that path instead.

3. **Install dependencies (first time, or after cloning the project)**  
   Type (then press Enter):
   ```bash
   npm install
   ```
   This installs the packages the game needs (e.g. express, cors). You only need to do this once per machine, or after pulling new changes that update dependencies.

4. **Start the server**  
   Type (then press Enter):
   ```bash
   npm start
   ```
   You should see something like: `Megatrends backend listening on http://localhost:3000`

5. **Open the game in your browser**  
   - Game: **http://localhost:3000**  
   - Teacher page: **http://localhost:3000/teacher.html**

Leave the terminal window open while you’re using the game. To stop the server, press **Ctrl+C** in the terminal.

**If you see “Cannot find module 'express'”** when you run `npm start`, run `npm install` in the project folder first (step 3), then try `npm start` again.

---

## Students get “can’t connect to the server”

This usually happens when students open a link that uses **localhost**.

- **localhost** only works on the same computer. On a student’s device, “localhost” is their own machine, not yours, so the game never reaches your server.

**What to do:**

1. **Start the game** on your computer (`npm start`).
2. **Find your computer’s IP address** on the school network:
   - **Mac:** System Settings → Network → Wi‑Fi (or Ethernet) → Details → look for “IP address” (e.g. `192.168.1.5`).
   - Or in Terminal: run `ipconfig getifaddr en0` (Wi‑Fi) or `ipconfig getifaddr en1`.
3. **Share this kind of link with students** (use your IP and the session ID from the teacher page):
   - `http://YOUR_IP:3000?session=SESSION_ID`
   - Example: `http://192.168.1.5:3000?session=abc-123-def`
4. Make sure your computer’s firewall allows incoming connections on port **3000** (or turn the firewall off temporarily for the lesson if your school allows it).

Students must use the link you give them (with your IP), not a link that says `localhost`.
