# IT setup instructions – Megatrends game (Year 12)

**For:** School IT support  
**From:** Teacher using the Megatrends / Future of Work game in class  
**Purpose:** So students can open one link, enter a session code, and play; the teacher sees results on a dashboard.

---

## What I’m trying to do

1. **In class:** I run a small web application (the “game”) on a computer. It’s a learning activity where students make choices in a scenario and answer practice questions.
2. **Students** open a single link (e.g. a join page on the school network), type a session code I give them, and click “Start game.” They don’t need to create accounts or install anything.
3. **I (the teacher)** use a separate “teacher” page to start a session, get the join link and session code, and later view class results (choices, scores, group totals).

So we need:

- One **join link** that works for all students (e.g. `http://[computer-IP]:3000/play`).
- Students and my computer on the **same network** (or allowed to talk to the machine running the game).
- The game app able to reach the internet to save results (see “Supabase” below).

---

## What is Supabase and what is it for?

**Supabase** is an external cloud service (like a small database in the cloud). I use it so that:

- **Class sessions** (e.g. “Period 2 Tuesday”) are stored there.
- **Student results** (their in-game choices and practice scores) are sent from the game to Supabase and linked to that session.
- **I don’t store this data on school servers.** The game runs on one computer; it sends results to Supabase over HTTPS. My teacher dashboard reads from Supabase so I can see results by session.

So:

- The game and the teacher’s browser need **outbound HTTPS** to Supabase’s servers (e.g. `*.supabase.co`). If staff/devices can use normal websites over HTTPS, that’s usually enough.
- No Supabase account or login is required for students. They only use the join link and session code.

---

## What needs to be set up

### 1. The game application

- It’s a **Node.js** app (runs with `node server.js` or `npm start`).
- It serves:
  - A **join page** at `/play` (students open this and enter the session code).
  - The **game** itself.
  - A **teacher page** (for me to create sessions and view results).
- It listens on **port 3000** (HTTP). No HTTPS is required on the school side; the app is HTTP only.

### 2. Where it can run

- **Option A (simplest):** I run it on **my laptop/desktop** during the lesson. Students need to be able to reach that machine’s IP on port 3000 (same network or VLAN, or firewall rule allowing access to that IP and port).
- **Option B:** IT runs it on a **school server** (same Node.js app, same port) so the join link is stable (e.g. `http://gameserver.school.local:3000/play` or a similar URL IT provides). Then I don’t need to run it on my machine.

### 3. Network / firewall

- **Inbound:** Devices that need to join the game (student devices, my computer) must be able to **open HTTP to the machine running the game on port 3000** (e.g. `http://[that-machine’s-IP]:3000/play`).
- **Outbound:** The machine running the game (and the machine where I open the teacher page) must be able to make **HTTPS** requests to the internet (for Supabase). Standard “allow web browsing” usually covers this.

### 4. What students need

- A **join link** (one URL for the class, e.g. on the board or my webpage).
- The **session code** for that lesson (I get it from the teacher page and show or read it in class).
- No installs, no accounts—just browser access to the join URL.

---

## Summary for IT

| Item | Detail |
|------|--------|
| **App type** | Node.js (Express) web app; run via `npm start` (starts `server.js`). |
| **Port** | 3000 (HTTP). |
| **Inbound** | Allow HTTP traffic to the host running the game on port 3000 from student/teacher devices that need to join. |
| **Outbound** | HTTPS to Supabase (e.g. `*.supabase.co`); normal web access is usually enough. |
| **Student access** | One URL (e.g. `http://[server-or-teacher-PC-IP]:3000/play`). Students enter a session code and click “Start game.” |
| **Data** | Session and result data is stored in Supabase (cloud); not on school servers. |

---

## If something doesn’t work

- **“Cannot GET /play” or join page doesn’t load:** The app may not be running, or the device can’t reach the host on port 3000. Check the app is started and that firewall/network allows HTTP to that host on port 3000.
- **Students “can’t connect”:** Usually means they’re using a link that doesn’t point to the machine running the game (e.g. wrong IP or blocked port). The join link must be the correct URL (host + port 3000 + `/play`).
- **Teacher page can’t load sessions / no results:** The machine where I open the teacher page needs outbound HTTPS to Supabase. If Supabase is blocked, results won’t save or load.

---

## Project location and how to run it

- **Project folder:** (teacher to fill in, e.g. `Desktop/New Game` or the deployed path.)
- **Start command:** `npm install` (once), then `npm start`.
- **Join link format:** `http://[IP-or-hostname]:3000/play`  
  (Teacher gets the exact link from the teacher page after clicking “New session,” or IT can provide a fixed URL if the app runs on a server.)

---

Thank you for helping get this running so students can access the game with a single link and session code.
