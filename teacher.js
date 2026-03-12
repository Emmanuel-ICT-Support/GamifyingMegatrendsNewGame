(function () {
  const supabase = typeof window !== "undefined" && window.SUPABASE;
  const useSupabase = supabase && supabase.url && supabase.anonKey && !supabase.url.includes("YOUR_PROJECT");

  const headers = useSupabase
    ? {
        apikey: supabase.anonKey,
        Authorization: "Bearer " + supabase.anonKey,
        "Content-Type": "application/json",
      }
    : { "Content-Type": "application/json" };

  const base = useSupabase ? supabase.url + "/rest/v1" : "";

  function getGameBaseUrl() {
    return window.location.origin + window.location.pathname.replace(/teacher\.html?$/, "index.html");
  }

  function getPlayUrl() {
    return window.location.origin + "/play";
  }

  document.getElementById("btn-new-session").addEventListener("click", async function () {
    if (!useSupabase) {
      alert("Set up Supabase (config/supabase-config.js) to use sessions.");
      return;
    }
    try {
      const res = await fetch(base + "/sessions", {
        method: "POST",
        headers: { ...headers, Prefer: "return=representation" },
        body: JSON.stringify({ label: "Class " + new Date().toLocaleDateString() }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const session = Array.isArray(data) ? data[0] : data;
      const id = session.id;
      let playUrl = getPlayUrl();
      if (playUrl.indexOf("localhost") !== -1) {
        try {
          const joinRes = await fetch("/api/join-url");
          const join = await joinRes.json();
          if (join.joinUrl) playUrl = join.joinUrl;
        } catch (e) { /* keep getPlayUrl() */ }
      }
      const gameLink = getGameBaseUrl() + "?session=" + id;
      const viewLink = window.location.href.split("?")[0] + "?session=" + id;
      const box = document.getElementById("new-session-result");
      box.style.display = "block";
      const localhostTip = playUrl.indexOf("localhost") !== -1
        ? "<br><br><span class=\"muted\" style=\"display:block; margin-top:0.5rem;\">⚠️ On <strong>other devices</strong> use this computer's IP in the link (e.g. <code>http://192.168.1.5:3000/play</code>). Find your IP in System Settings → Network.</span>"
        : "";
      box.innerHTML =
        "<strong>Students – give them this one link:</strong><br>" +
        "<a href=\"" + playUrl + "\" target=\"_blank\" id=\"play-link\">" + playUrl + "</a> " +
        "<button type=\"button\" class=\"teacher-copy\" data-copy=\"" + playUrl.replace(/"/g, "&quot;") + "\">Copy link</button>" +
        "<br><br><strong>Session code</strong> (students paste this on the join page):<br>" +
        "<code id=\"session-code-display\">" + id + "</code> " +
        "<button type=\"button\" class=\"teacher-copy\" data-copy=\"" + id.replace(/"/g, "&quot;") + "\">Copy code</button>" +
        localhostTip +
        "<br><br><strong>View results for this session:</strong><br><a href=\"" + viewLink + "\">" + viewLink + "</a>";
      box.querySelectorAll(".teacher-copy").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var text = this.getAttribute("data-copy");
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(function () {
              btn.textContent = "Copied!";
              setTimeout(function () { btn.textContent = text === playUrl ? "Copy link" : "Copy code"; }, 1500);
            });
          } else {
            var ta = document.createElement("textarea");
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            document.body.removeChild(ta);
            btn.textContent = "Copied!";
            setTimeout(function () { btn.textContent = text === playUrl ? "Copy link" : "Copy code"; }, 1500);
          }
        });
      });
    } catch (err) {
      alert("Could not create session: " + (err.message || err));
    }
  });

  async function loadSessions() {
    if (!useSupabase) return [];
    const res = await fetch(base + "/sessions?order=created_at.desc", { headers });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  document.getElementById("btn-load-sessions").addEventListener("click", async function () {
    if (!useSupabase) {
      alert("Set up Supabase to load sessions.");
      return;
    }
    const sel = document.getElementById("session-select");
    try {
      const sessions = await loadSessions();
      sel.innerHTML = "<option value=\"\">— Choose session —</option>";
      sessions.forEach(function (s) {
        const opt = document.createElement("option");
        opt.value = s.id;
        opt.textContent = (s.label || "Session") + " – " + new Date(s.created_at).toLocaleString();
        sel.appendChild(opt);
      });
    } catch (err) {
      alert("Could not load sessions: " + (err.message || err));
    }
  });

  document.getElementById("session-select").addEventListener("change", function () {
    const id = this.value;
    if (!id) {
      document.getElementById("results-area").style.display = "none";
      return;
    }
    loadResults(id);
  });

  function getGroupRewardTier(pct) {
    if (pct >= 85) return { label: "Gold", emoji: "🥇" };
    if (pct >= 70) return { label: "Silver", emoji: "🥈" };
    if (pct >= 50) return { label: "Bronze", emoji: "🥉" };
    return { label: "Keep going", emoji: "📚" };
  }

  async function loadResults(sessionId) {
    if (!useSupabase) return;
    const area = document.getElementById("results-area");
    const errEl = document.getElementById("results-error");
    errEl.style.display = "none";
    try {
      const res = await fetch(base + "/submissions?session_id=eq." + encodeURIComponent(sessionId), { headers });
      if (!res.ok) throw new Error(await res.text());
      const submissions = await res.json();

      const estRes = await fetch(base + "/est_practice?session_id=eq." + encodeURIComponent(sessionId), { headers });
      const estResults = estRes.ok ? await estRes.json() : [];

      const byCategory = {};
      let totalEnv = 0, totalEmp = 0, totalTrend = 0;
      submissions.forEach(function (s) {
        const cat = s.category || "Other";
        if (!byCategory[cat]) byCategory[cat] = { count: 0, names: [], env: 0, emp: 0, trend: 0 };
        byCategory[cat].count += 1;
        byCategory[cat].names.push(s.student_name || "—");
        byCategory[cat].env += Number(s.score_env) || 0;
        byCategory[cat].emp += Number(s.score_employment) || 0;
        byCategory[cat].trend += Number(s.score_trend) || 0;
        totalEnv += Number(s.score_env) || 0;
        totalEmp += Number(s.score_employment) || 0;
        totalTrend += Number(s.score_trend) || 0;
      });

      const catOrder = [
        "Work environments",
        "Types of employment",
        "Emerging/declining jobs",
        "Do nothing",
        "Micro niche/specialisation",
      ];
      let catHtml = "";
      catOrder.forEach(function (cat) {
        const b = byCategory[cat];
        if (!b) return;
        catHtml +=
          "<div class=\"category-block\">" +
          "<h3>" + cat + " (" + b.count + ")</h3>" +
          "<div class=\"names\">" + (b.names.join(", ") || "—") + "</div>" +
          "</div>";
      });
      Object.keys(byCategory).forEach(function (cat) {
        if (catOrder.indexOf(cat) !== -1) return;
        const b = byCategory[cat];
        catHtml +=
          "<div class=\"category-block\">" +
          "<h3>" + cat + " (" + b.count + ")</h3>" +
          "<div class=\"names\">" + (b.names.join(", ") || "—") + "</div>" +
          "</div>";
      });
      document.getElementById("results-by-category").innerHTML = catHtml || "<p class=\"muted\">No submissions yet.</p>";

      const n = submissions.length || 1;
      const avgEnv = (totalEnv / n).toFixed(2);
      const avgEmp = (totalEmp / n).toFixed(2);
      const avgTrend = (totalTrend / n).toFixed(2);
      document.getElementById("results-strength").innerHTML =
        "<p><strong>" + submissions.length + " response(s)</strong></p>" +
        "<p>Average scores (class workshop): Work environment " + avgEnv + ", Employment " + avgEmp + ", Emerging/declining " + avgTrend + ".</p>" +
        "<p class=\"muted\">Higher = more tech-enabled / mixed employment / emerging jobs.</p>";

      var countEST = estResults.length;
      var sumEST = 0;
      var sumPct = 0;
      estResults.forEach(function (r) {
        var s = Number(r.score) || 0;
        var t = Number(r.total) || 65;
        sumEST += s;
        sumPct += t ? (s / t) * 100 : 0;
      });
      var classESTAvg = countEST ? Math.round(sumPct / countEST) : 0;
      var classESTPoints = sumEST;
      var groupReward = getGroupRewardTier(classESTAvg);
      var estHtml = "<p><strong>EST Practice</strong></p>";
      if (countEST === 0) {
        estHtml += "<p class=\"muted\">No EST scores submitted yet for this session.</p>";
      } else {
        estHtml += "<p><strong>Class total: " + classESTPoints + " points</strong> (" + countEST + " student(s))</p>";
        estHtml += "<p>Class average: " + classESTAvg + "%</p>";
        estHtml += "<p><strong>Group reward: " + groupReward.emoji + " " + groupReward.label + "</strong></p>";
        estHtml += "<p class=\"muted\">Everyone's EST score contributes to the class total. Unlock Silver at 70% average, Gold at 85%.</p>";
      }
      document.getElementById("results-est").innerHTML = estHtml;
    } catch (err) {
      errEl.textContent = "Could not load results: " + (err.message || err);
      errEl.style.display = "block";
    }
    area.style.display = "block";
  }

  if (useSupabase && window.location.search) {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session");
    if (sessionId) {
      loadSessions()
        .then(function (sessions) {
          const sel = document.getElementById("session-select");
          sel.innerHTML = "<option value=\"\">— Choose session —</option>";
          sessions.forEach(function (s) {
            const opt = document.createElement("option");
            opt.value = s.id;
            opt.textContent = (s.label || "Session") + " – " + new Date(s.created_at).toLocaleString();
            sel.appendChild(opt);
          });
          sel.value = sessionId;
          loadResults(sessionId);
        })
        .catch(function () {});
      document.getElementById("results-area").style.display = "block";
    }
  }
})();
