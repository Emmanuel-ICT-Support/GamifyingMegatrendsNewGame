// Very simple backend to collect mechanic scenario results for a whole class.
// - Stores each student's choice and the derived scores in a JSON file.
// - Provides a summary endpoint the teacher can use to see class trends.

const fs = require("fs");
const path = require("path");
const os = require("os");
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Get this machine's local network IP so the teacher can share the join link without looking it up
function getLocalIp() {
  const ifaces = os.networkInterfaces();
  for (const name of Object.keys(ifaces)) {
    for (const iface of ifaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return null;
}

const DATA_FILE = path.join(__dirname, "class-data.json");

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Simple join page so students can use one URL and enter a session code
app.get("/play", (req, res) => {
  res.sendFile(path.join(__dirname, "play.html"));
});

// So the teacher page can show the join link with this machine's IP (no need to look it up)
app.get("/api/join-url", (req, res) => {
  const ip = getLocalIp();
  const port = PORT;
  const joinUrl = ip ? `http://${ip}:${port}/play` : null;
  res.json({ joinUrl, ip, port });
});

function readData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    return { submissions: [] };
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
}

// Record a single student's mechanic decision and scores
app.post("/api/record", (req, res) => {
  const { studentName, choiceId, scores } = req.body || {};

  if (!studentName || !choiceId || !scores) {
    return res
      .status(400)
      .json({ error: "studentName, choiceId and scores are required." });
  }

  const data = readData();
  data.submissions.push({
    studentName,
    choiceId,
    scores,
    timestamp: new Date().toISOString(),
  });
  writeData(data);

  res.json({ ok: true });
});

// Get a simple class summary of choices and average scores
app.get("/api/summary", (req, res) => {
  const data = readData();
  const submissions = data.submissions || [];

  const byChoice = {};
  const totals = { env: 0, employment: 0, trend: 0 };

  submissions.forEach((s) => {
    if (!byChoice[s.choiceId]) {
      byChoice[s.choiceId] = { count: 0 };
    }
    byChoice[s.choiceId].count += 1;

    if (s.scores) {
      totals.env += s.scores.env || 0;
      totals.employment += s.scores.employment || 0;
      totals.trend += s.scores.trend || 0;
    }
  });

  const count = submissions.length || 1;

  res.json({
    totalSubmissions: submissions.length,
    choices: byChoice,
    averageScores: {
      env: totals.env / count,
      employment: totals.employment / count,
      trend: totals.trend / count,
    },
  });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Megatrends backend listening on http://localhost:${PORT}`);
});

