// Simple scene engine for:
// - Intro ("Setting the scene") sequence
// - First Impactful Technology scenario (mechanic disruption → decision → consequence → reflection → articulation placeholder)

const state = {
  choices: {},
  submitted: false,
  articulationProgress: {
    q1: 0,
    q2: 0,
  },
  articulationMegatrend: null,
  articulationAspect: null,
  // EST Practice (assessment-style quiz on what they learned)
  practiceScore: 0,
  practiceQuestionIndex: 0,
  practiceAnswers: {},
  practiceRevealed: {},
  estSubmitted: false,
};

const INTRO_MEDIA_BASE = "content/intro-pages";
const CONTENT_BASE = "content";

let scenes = [];

function introScenesFromManifest(manifest) {
  if (!manifest || !Array.isArray(manifest.pages)) return [];
  return manifest.pages.map((p) => ({
    id: p.id,
    label: p.label,
    phase: p.phase || "Intro",
    media: p.media || null,
    mediaNote: p.label,
    narration: p.narration || [],
  }));
}

// Fallback intro: one combined video (intro-all.mp4). When manifest loads, it can override with same structure.
// Full flow: Intro (one video) → Disruption → Decision → Consequence → Reflection → Articulation
const fallbackIntroScenes = [
  {
    id: "intro-all",
    label: "Setting the scene",
    phase: "Intro",
    media: "intro-all.mp4",
    mediaNote: "Watch the intro, then click Next to continue.",
    narration: [
      "One combined intro covers: jobs that might not exist, jobs that don’t exist yet, seeing change coming, the world moving fast, global forces, “that’s nothing to do with me”, but it is, when the world changes work changes, skills move too, what are you going to do, front seat, and Impactful Technology.",
      "When you’re ready, click Next to go to the scenario.",
    ],
  },
];

// Scenario: Disruption → Decision → Consequence → Reflection → Articulation
const scenarioScenes = [
  // IMPACTFUL TECHNOLOGY – MECHANIC SCENARIO
  // DISRUPTION
  {
    id: "impact-mechanic-1",
    label: "Mechanic – A normal morning",
    phase: "Disruption",
    media: "scenario-1-mechanic-1-normal-day.mp4",
    mediaNote:
      "Visual: Small mechanic workshop; tools, cars on lifts; owner starting the day.",
    narration: [
      "You are a qualified mechanic running a small, trusted workshop.",
      "You know your customers, and they know you. Most days feel familiar.",
    ],
  },
  {
    id: "impact-mechanic-2",
    label: "Complaint letter arrives",
    phase: "Disruption",
    media: "scenario-1-mechanic.mp4",
    mediaNote:
      "Visual: Close-up of an envelope or email notification; letter from a long-time customer.",
    narration: [
      "Today feels different.",
      "A complaint letter arrives from a long‑time customer.",
      "They write that their friends are getting mechanical work done much cheaper and faster somewhere else.",
    ],
  },
  {
    id: "impact-mechanic-3",
    label: "The pressure from new tech",
    phase: "Disruption",
    media: "scenario-1-mechanic-3-new-tech.mp4",
    mediaNote:
      "Visual: Other workshop using computerised diagnostic equipment; your workshop using traditional methods.",
    narration: [
      "The other workshop uses advanced computerised diagnostic equipment.",
      "Your customer says your jobs are taking too long and costing too much.",
      "They’re starting to wonder if they should keep coming back.",
    ],
  },

  // DECISION
  {
    id: "impact-mechanic-decision",
    label: "How will you respond?",
    phase: "Decision",
    mediaNote:
      "Visual: Mechanic thinking in the workshop; options appear around them.",
    narration: [
      "You can’t ignore this. Impactful technology is changing how mechanical work is done.",
      "You need to decide how you will respond.",
    ],
    choices: [
      {
        id: "env-robotic-workshop",
        label:
          "Invest in cleaner, robotic and automated diagnostic equipment so your physical work environment becomes a tech‑enabled workshop.",
      },
      {
        id: "employment-upskill-gig",
        label:
          "Start recruiting mechanics with IT/diagnostics skills and invest in upskilling your current staff, or bring in diagnostic specialists on a gig basis when they’re needed.",
      },
      {
        id: "emerging-ev-specialist",
        label:
          "Shift your focus toward emerging jobs by specialising in electric vehicles and advanced computerised systems, and gradually reduce basic servicing that is being automated.",
      },
      {
        id: "do-nothing",
        label:
          "Do nothing and keep running your small workshop the same way, relying on loyal customers and traditional tools.",
      },
      {
        id: "specialise-old-cars",
        label:
          "Specialise in older and classic cars that many high‑tech workshops don’t focus on, keeping traditional methods but in a smaller niche.",
      },
    ],
  },

  // CONSEQUENCE – content varies based on decision
  {
    id: "impact-mechanic-consequence",
    label: "What happens next?",
    phase: "Consequence",
    mediaNote:
      "Visual: Time skip – show the workshop some time later, reflecting the choice made.",
    narration: [], // Filled dynamically based on decision
  },

  // REFLECTION – light, to be extended later
  {
    id: "impact-mechanic-reflection",
    label: "Looking back on your choice",
    phase: "Reflection",
    mediaNote:
      "Visual: Mechanic reflecting; icons or text highlighting technology, work environment, employment type.",
    narration: [
      "Think about how Impactful Technology shaped the options you had.",
      "Which parts of the job changed because of new diagnostic tools, and which parts still relied on human skills?",
      "Later, you’ll connect this scenario to work environments, types of employment, and emerging or declining jobs.",
    ],
  },

  // ARTICULATION – placeholder ready to connect to your marking key
  {
    id: "impact-mechanic-articulation",
    label: "Articulation – Impactful Technology",
    phase: "Articulation",
    mediaNote:
      "Visual: Simple question screen or workspace for a short written response.",
    narration: [
      "Articulation placeholder:",
      "Here you will respond to a question like:",
      "“Explain how impactful technology affected the mechanic’s work environment, type of employment, and the demand for their skills.”",
      "In the final version, this screen will link directly to your marking key and model answers.",
    ],
  },

  { id: "est-practice", label: "EST Practice – Impactful Technology", phase: "Assessment practice", mediaNote: "", narration: [] },
  { id: "est-practice-results", label: "EST Practice – Your score", phase: "Assessment practice", mediaNote: "", narration: [] },
];

// EST Practice: questions based on Megatrends EST prep (Impactful Technology). Points for right answers; key points for feedback.
const EST_QUESTIONS = [
  {
    id: "q1",
    question: "What is a megatrend?",
    options: [
      "A short-term trend in fashion or social media",
      "A significant and long-lasting development that has a transformational impact on the way we live, work and do business",
      "A type of economic recession",
      "A government policy that lasts one year",
    ],
    correctIndex: 1,
    points: 10,
    keyPoints: "Define: significant, long-lasting, transformational impact on how we live, work and do business.",
  },
  {
    id: "q2",
    question: "Which of these best describes the Impactful Technology megatrend?",
    options: [
      "Changes in the climate and sustainability",
      "Changes in technology – the tools used to do our work; rapid and fast-growing (e.g. automation, robotics, AI, big data, digitisation)",
      "Changes in the age and make-up of the population",
      "Changes in which countries dominate the global economy",
    ],
    correctIndex: 1,
    points: 10,
    keyPoints: "Technology as tools we use for work; rapid growth; examples: automation, robotics, AI, digitisation, cloud computing.",
  },
  {
    id: "q3",
    question: "How does Impactful Technology affect work environments?",
    options: [
      "Workplaces stay exactly the same",
      "Growth in telecommuting and working from home; many tasks automated; need for real people may reduce or skill level required may increase",
      "Only office work is affected",
      "Everyone must work in an office",
    ],
    correctIndex: 1,
    points: 15,
    keyPoints: "Work environments: telecommuting, working from home, automation, changing need for staff/skill levels (EST prep).",
  },
  {
    id: "q4",
    question: "How does Impactful Technology affect types of employment?",
    options: [
      "Everyone becomes a full-time employee",
      "Higher skill levels required; greater workplace flexibility; gig work and freelance jobs",
      "Employment types do not change",
      "Only manual work increases",
    ],
    correctIndex: 1,
    points: 15,
    keyPoints: "Types of employment: higher skill level, greater flexibility, gig work, freelance jobs.",
  },
  {
    id: "q5",
    question: "Which are examples of emerging and declining jobs linked to Impactful Technology?",
    options: [
      "Declining: mining; Emerging: solar technician",
      "Declining: manual or repetitive jobs (e.g. data entry, some customer jobs due to chatbots); Emerging: systems developer, data analyst, AI trainer",
      "All jobs are emerging",
      "All jobs are declining",
    ],
    correctIndex: 1,
    points: 15,
    keyPoints: "Declining: manual/repetitive, data entry, some customer roles (chatbots). Emerging: systems developer, data analyst, AI trainer.",
  },
];

// Map player decision to consequence narration
function getMechanicConsequenceLines() {
  const choiceId = state.choices["impact-mechanic-decision"];

  if (choiceId === "env-robotic-workshop") {
    return [
      "You invest in cleaner, automated diagnostic equipment and re‑organise the workshop around new robotics and digital tools.",
      "Your physical work environment changes: there are more screens, sensors and automated processes, and fewer purely manual checks.",
      "Some repetitive diagnostic tasks disappear, but your role shifts toward higher‑skill work reading data, solving problems and explaining options to customers.",
      "You move away from declining, low‑skill, manual checking and into an emerging, tech‑enabled version of mechanical work.",
    ];
  }

  if (choiceId === "employment-upskill-gig") {
    return [
      "You decide the people in your workshop need new skills as much as new tools.",
      "You recruit mechanics who already have IT and diagnostics experience and pay for training so existing staff can learn to use computerised systems.",
      "At busy times, you bring in a diagnostic specialist on a gig basis, changing the mix of employment types in and around your workshop.",
      "Your team becomes more multiskilled, and the workshop connects to emerging, higher‑skill roles instead of staying in low‑skill, routine work.",
    ];
  }

  if (choiceId === "emerging-ev-specialist") {
    return [
      "You rebrand your business to focus on electric vehicles and advanced computer systems instead of standard servicing.",
      "Your work environment gradually fills with EVs, battery packs and software‑related diagnostics, while simple oil changes and basic services move elsewhere.",
      "You retrain yourself and your staff into roles that look more like emerging 'vehicle systems technicians' than traditional mechanics.",
      "You step away from some declining tasks and into a part of the industry that is expected to grow as more EVs and smart vehicles appear.",
    ];
  }

  if (choiceId === "do-nothing") {
    return [
      "You decide not to change anything for now.",
      "Your work environment stays familiar: paper records, manual checks and slower diagnostics.",
      "At first, loyal customers keep coming, but over time more of them try the faster, cheaper, tech‑enabled workshop.",
      "You start to feel your role slide toward the declining side of the industry, as more routine mechanical work is automated or moved to larger centres.",
    ];
  }

  if (choiceId === "specialise-old-cars") {
    return [
      "You decide to specialise in older and classic cars that many high‑tech workshops avoid.",
      "Your work environment keeps its traditional tools and methods, but your customer base becomes smaller and more specialised.",
      "Some routine work declines as everyday drivers move to faster, automated services, but there is still steady demand from enthusiasts who value your skills.",
      "You position yourself in a niche that is partly protected from automation but limited in size, sitting between emerging and declining areas of mechanical work.",
    ];
  }

  // Fallback if no choice was made
  return [
    "Different choices would lead to different futures for this workshop.",
    "In the full game, your earlier decision will shape exactly what happens next.",
    "For now, imagine how each option might change the mechanic’s work environment and job security.",
  ];
}

// Summarise the player's mechanic choice in terms of
// work environment, types of employment, and emerging/declining jobs.
function getMechanicProfileLines() {
  const choiceId = state.choices["impact-mechanic-decision"];

  if (!choiceId) {
    return [
      "You haven’t locked in a response yet. In the full game, this summary will reflect the choice you made for the mechanic.",
    ];
  }

  if (choiceId === "env-robotic-workshop") {
    return [
      "Work environment: You shifted to a cleaner, tech‑enabled workshop with robotics and digital diagnostic tools.",
      "Types of employment: Most roles stay as mechanics, but they now need higher‑level digital and problem‑solving skills.",
      "Emerging/declining jobs: You moved away from declining, low‑skill manual checks into more emerging, tech‑enabled mechanical work.",
    ];
  }

  if (choiceId === "employment-upskill-gig") {
    return [
      "Work environment: Your workshop still looks familiar, but digital diagnostics are now a normal part of everyday jobs.",
      "Types of employment: You mix ongoing staff with new hires who have IT/diagnostic skills, and bring in gig specialists when needed.",
      "Emerging/declining jobs: You connect your team to emerging, higher‑skill roles instead of staying only in routine, easily automated tasks.",
    ];
  }

  if (choiceId === "emerging-ev-specialist") {
    return [
      "Work environment: Your space becomes focused on electric vehicles and advanced computer systems rather than basic servicing.",
      "Types of employment: You and your staff retrain into specialist 'vehicle systems' roles, building deeper technical expertise.",
      "Emerging/declining jobs: You move strongly into an emerging area of work that is expected to grow as more EVs and smart vehicles appear.",
    ];
  }

  if (choiceId === "do-nothing") {
    return [
      "Work environment: Your workshop stays traditional, relying on paper records, manual checks and older tools.",
      "Types of employment: Employment stays the same, but there are fewer opportunities to build new skills or roles.",
      "Emerging/declining jobs: You remain in a part of the industry that is slowly declining as more routine work is automated or moved to tech‑enabled centres.",
    ];
  }

  if (choiceId === "specialise-old-cars") {
    return [
      "Work environment: You keep a traditional workshop focused on older and classic cars with familiar tools and methods.",
      "Types of employment: You work as a niche specialist, often in smaller teams, serving a specific group of customers.",
      "Emerging/declining jobs: You step into a small niche that is protected from some automation, but limited compared to larger, emerging areas of vehicle work.",
    ];
  }

  return [];
}

// Turn the player's mechanic choice into simple numeric scores for:
// - env: traditional (-1) → tech‑enabled (+1)
// - employment: single stable job (-1) → mix/structured/gig (+1)
// - trend: declining (-1) → emerging (+1)
function getMechanicScores() {
  const choiceId = state.choices["impact-mechanic-decision"];

  switch (choiceId) {
    case "env-robotic-workshop":
      return { env: 1, employment: 0, trend: 1 };
    case "employment-upskill-gig":
      return { env: 0.5, employment: 1, trend: 0.5 };
    case "emerging-ev-specialist":
      return { env: 1, employment: 0.5, trend: 1 };
    case "do-nothing":
      return { env: -1, employment: -0.5, trend: -1 };
    case "specialise-old-cars":
      return { env: -0.2, employment: 0.2, trend: -0.2 };
    default:
      return { env: 0, employment: 0, trend: 0 };
  }
}

// Map choice_id to the category used for class grouping and workshop strength
function getCategoryForChoice(choiceId) {
  const map = {
    "env-robotic-workshop": "Work environments",
    "employment-upskill-gig": "Types of employment",
    "emerging-ev-specialist": "Emerging/declining jobs",
    "do-nothing": "Do nothing",
    "specialise-old-cars": "Micro niche/specialisation",
  };
  return map[choiceId] || choiceId;
}

// Correct "aspect of future of work" for the articulation quiz, based on the decision they made
function getCorrectAspectForChoice(choiceId) {
  const map = {
    "env-robotic-workshop": "Work Environment",
    "employment-upskill-gig": "Types of employment",
    "emerging-ev-specialist": "Emerging and Declining Jobs",
    "do-nothing": "Stay the same",
    "specialise-old-cars": "Stay the same",
  };
  return map[choiceId] || "";
}

// Session ID from URL so results are pooled per class run (teacher resets by starting a new session)
function getSessionIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("session") || params.get("session_id") || "";
}

// Send the player's choice to Supabase (if configured) or fallback to local /api/record
async function maybeSubmitResults() {
  if (state.submitted) return;

  const choiceId = state.choices["impact-mechanic-decision"];
  if (!choiceId) return;

  const studentName = (state.studentName || "").trim();
  if (!studentName) return;

  const scores = getMechanicScores();
  const category = getCategoryForChoice(choiceId);

  const supabase = typeof window !== "undefined" && window.SUPABASE;
  const useSupabase = supabase && supabase.url && supabase.anonKey && !supabase.url.includes("YOUR_PROJECT");

  if (useSupabase) {
    const sessionId = getSessionIdFromUrl();
    if (!sessionId) {
      // eslint-disable-next-line no-alert
      window.alert("No session link. Your teacher will share a link that includes the session. Your choice was not saved to the class pool.");
      return;
    }
    try {
      const res = await fetch(`${supabase.url}/rest/v1/submissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabase.anonKey,
          Authorization: `Bearer ${supabase.anonKey}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          session_id: sessionId,
          student_name: studentName,
          choice_id: choiceId,
          category,
          score_env: scores.env,
          score_employment: scores.employment,
          score_trend: scores.trend,
        }),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || res.statusText);
      }
      state.submitted = true;
    } catch (err) {
      console.warn("Could not submit to Supabase:", err);
      // eslint-disable-next-line no-alert
      window.alert("Could not save your result to the class pool. Please check your session link and try again.");
    }
    return;
  }

  try {
    const res = await fetch("/api/record", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentName, choiceId, scores }),
    });
    if (res.ok) state.submitted = true;
    else throw new Error("Server returned " + res.status);
  } catch (err) {
    console.warn("Could not submit results to class summary backend:", err);
    // eslint-disable-next-line no-alert
    window.alert(
      "Could not connect to the game server. If you're on your own device, make sure you're using the link from your teacher (it should use the school network address, not 'localhost'). Your teacher can find the correct link in the teacher page."
    );
  }
}

const KEY_CONCEPT_LINE1 = "Global long lasting development";
const KEY_CONCEPT_LINE2 = "Transforms how we live and work";

// Build spans for each character in a sentence so students can type directly over it.
function buildSentence(container, text, questionKey) {
  const p = document.createElement("p");
  p.className = "articulation-expected";
  p.dataset.question = questionKey;

  for (let i = 0; i < text.length; i += 1) {
    const span = document.createElement("span");
    span.className = "art-char";
    span.dataset.question = questionKey;
    span.dataset.index = String(i);
    span.textContent = text[i];
    p.appendChild(span);
  }

  container.appendChild(p);
}

function updateArticulationHighlights() {
  ["q1", "q2"].forEach((key) => {
    const expected =
      key === "q1" ? KEY_CONCEPT_LINE1 : KEY_CONCEPT_LINE2;
    const progress = state.articulationProgress[key] || 0;

    const spans = narrationEl.querySelectorAll(
      `.art-char[data-question="${key}"]`
    );

    spans.forEach((span) => {
      const idx = Number(span.dataset.index);
      span.classList.remove("current", "done");
      if (idx < progress) {
        span.classList.add("done");
      } else if (idx === progress && progress < expected.length) {
        span.classList.add("current");
      }
    });
  });
}

function renderArticulation(scene) {
  narrationEl.innerHTML = "";

  // Your name for the class summary – in-page, no popup
  const nameBlock = document.createElement("div");
  nameBlock.className = "student-name-block";
  const nameLabel = document.createElement("label");
  nameLabel.className = "articulation-question";
  nameLabel.setAttribute("for", "student-name-input");
  nameLabel.textContent = "Your name (so your result can be added to the class summary)";
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.id = "student-name-input";
  nameInput.className = "articulation-input student-name-input";
  nameInput.placeholder = "Type your name here";
  nameInput.value = state.studentName || "";
  nameInput.autocomplete = "name";
  nameInput.addEventListener("input", () => {
    state.studentName = nameInput.value.trim();
  });
  nameInput.addEventListener("blur", () => {
    state.studentName = nameInput.value.trim();
  });
  nameBlock.appendChild(nameLabel);
  nameBlock.appendChild(nameInput);
  narrationEl.appendChild(nameBlock);

  // Reset progress each time we enter the articulation screen
  state.articulationProgress.q1 = state.articulationProgress.q1 || 0;
  state.articulationProgress.q2 = state.articulationProgress.q2 || 0;

  const intro = document.createElement("p");
  intro.textContent =
    "What are the key concepts of a megatrend? Type over the words below…";
  narrationEl.appendChild(intro);
  narrationEl.setAttribute("tabindex", "0");
  narrationEl.style.outline = "none";

  const block = document.createElement("div");
  block.className = "articulation-block";

  buildSentence(block, KEY_CONCEPT_LINE1, "q1");
  buildSentence(block, KEY_CONCEPT_LINE2, "q2");

  narrationEl.appendChild(block);

  // Which megatrend did you just explore?
  const megatrendHeading = document.createElement("p");
  megatrendHeading.className = "articulation-question";
  megatrendHeading.textContent = "Which megatrend did you just explore?";
  narrationEl.appendChild(megatrendHeading);

  const MEGATREND_OPTIONS = [
    "economic power shifts",
    "demographic shifts",
    "impactful technology",
    "climate change",
  ];
  const correctMegatrend = "impactful technology";

  const megatrendContainer = document.createElement("div");
  megatrendContainer.className = "articulation-options";
  const megatrendFeedback = document.createElement("p");
  megatrendFeedback.className = "articulation-feedback";
  megatrendFeedback.setAttribute("aria-live", "polite");

  MEGATREND_OPTIONS.forEach((opt) => {
    const label = document.createElement("label");
    label.className = "articulation-option";
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "articulation-megatrend";
    radio.value = opt;
    radio.addEventListener("change", () => {
      state.articulationMegatrend = opt;
      const correct = opt.toLowerCase() === correctMegatrend.toLowerCase();
      megatrendFeedback.textContent = correct ? "Well done!" : "Try again.";
      megatrendFeedback.className = "articulation-feedback " + (correct ? "feedback-correct" : "feedback-wrong");
    });
    label.appendChild(radio);
    label.appendChild(document.createTextNode(" " + opt));
    megatrendContainer.appendChild(label);
  });
  narrationEl.appendChild(megatrendContainer);
  narrationEl.appendChild(megatrendFeedback);

  // Which aspect of the future of work did your decision impact?
  const aspectHeading = document.createElement("p");
  aspectHeading.className = "articulation-question";
  aspectHeading.textContent = "Which aspect of the future of work did your decision impact?";
  narrationEl.appendChild(aspectHeading);

  const ASPECT_OPTIONS = [
    "Work Environment",
    "Emerging and Declining Jobs",
    "Types of employment",
    "Stay the same",
  ];
  const choiceId = state.choices["impact-mechanic-decision"];
  const correctAspect = getCorrectAspectForChoice(choiceId);

  const aspectContainer = document.createElement("div");
  aspectContainer.className = "articulation-options";
  const aspectFeedback = document.createElement("p");
  aspectFeedback.className = "articulation-feedback";
  aspectFeedback.setAttribute("aria-live", "polite");

  ASPECT_OPTIONS.forEach((opt) => {
    const label = document.createElement("label");
    label.className = "articulation-option";
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "articulation-aspect";
    radio.value = opt;
    radio.addEventListener("change", () => {
      state.articulationAspect = opt;
      const correct = opt === correctAspect;
      aspectFeedback.textContent = correct ? "Well done!" : "Try again.";
      aspectFeedback.className = "articulation-feedback " + (correct ? "feedback-correct" : "feedback-wrong");
    });
    label.appendChild(radio);
    label.appendChild(document.createTextNode(" " + opt));
    aspectContainer.appendChild(label);
  });
  narrationEl.appendChild(aspectContainer);
  narrationEl.appendChild(aspectFeedback);

  // Personalised profile summary underneath
  const profileLines = getMechanicProfileLines();
  if (profileLines.length > 0) {
    const hr = document.createElement("p");
    hr.className = "articulation-question";
    hr.textContent = "Your mechanic pathway summary:";
    narrationEl.appendChild(hr);

    profileLines.forEach((line) => {
      const p = document.createElement("p");
      p.textContent = line;
      narrationEl.appendChild(p);
    });
  }

  updateArticulationHighlights();
  narrationEl.focus();
}

function renderESTPractice() {
  const idx = state.practiceQuestionIndex;
  const questions = EST_QUESTIONS;
  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  if (idx >= questions.length) {
    const msg = document.createElement("p");
    msg.textContent = "You've answered all questions. Click Next to see your score.";
    msg.className = "articulation-question";
    narrationEl.appendChild(msg);
    return;
  }

  const q = questions[idx];
  const qKey = q.id;
  const selected = state.practiceAnswers[qKey];
  const revealed = state.practiceRevealed[qKey];

  const intro = document.createElement("p");
  intro.className = "articulation-question";
  intro.textContent = "Practice answering EST-style questions. Points are awarded for correct answers.";
  narrationEl.appendChild(intro);

  const progress = document.createElement("p");
  progress.className = "est-practice-progress";
  progress.textContent = `Question ${idx + 1} of ${questions.length} · Score so far: ${state.practiceScore} / ${totalPoints}`;
  narrationEl.appendChild(progress);

  const qEl = document.createElement("p");
  qEl.className = "articulation-question";
  qEl.textContent = q.question;
  narrationEl.appendChild(qEl);

  const optionsContainer = document.createElement("div");
  optionsContainer.className = "articulation-options est-practice-options";

  q.options.forEach((opt, i) => {
    const label = document.createElement("label");
    label.className = "articulation-option";
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "est-practice-" + qKey;
    radio.value = String(i);
    radio.disabled = !!revealed;
    if (selected === i) radio.checked = true;
    radio.addEventListener("change", () => {
      if (state.practiceRevealed[qKey]) return;
      state.practiceAnswers[qKey] = i;
      const correct = i === q.correctIndex;
      if (correct) state.practiceScore += q.points;
      state.practiceRevealed[qKey] = true;
      renderScene();
    });
    label.appendChild(radio);
    label.appendChild(document.createTextNode(" " + opt));
    optionsContainer.appendChild(label);
  });
  narrationEl.appendChild(optionsContainer);

  if (revealed) {
    const correct = selected === q.correctIndex;
    const feedback = document.createElement("div");
    feedback.className = "est-practice-feedback " + (correct ? "feedback-correct" : "feedback-wrong");
    feedback.innerHTML =
      (correct ? "Well done! +" + q.points + " points." : "Not quite. Key points: " + q.keyPoints) + "<br><br>Click <strong>Next</strong> to continue.";
    narrationEl.appendChild(feedback);
  }
}

// Individual reward tier from EST Practice score (used for badge and message)
function getESTRewardTier(pct) {
  if (pct >= 85) return { tier: "gold", label: "Gold", message: "Outstanding! You've mastered the key concepts for this megatrend." };
  if (pct >= 70) return { tier: "silver", label: "Silver", message: "Well done! You've shown good understanding of the Impactful Technology megatrend and how it affects the future of work." };
  if (pct >= 50) return { tier: "bronze", label: "Bronze", message: "Good effort. Review the key points and try again to move up to Silver or Gold." };
  return { tier: "participant", label: "Keep practicing", message: "Review the key points from each question and the Megatrends EST prep summary. You can use Back to try the questions again." };
}

// Send EST score to class pool (Supabase) so it contributes to group reward
async function submitESTToClass(score, total) {
  if (state.estSubmitted) return;
  const supabase = typeof window !== "undefined" && window.SUPABASE;
  const useSupabase = supabase && supabase.url && supabase.anonKey && !supabase.url.includes("YOUR_PROJECT");
  if (!useSupabase) return;
  const sessionId = getSessionIdFromUrl();
  if (!sessionId) return;
  const studentName = (state.studentName || "").trim();
  if (!studentName) return;
  try {
    const res = await fetch(supabase.url + "/rest/v1/est_practice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabase.anonKey,
        Authorization: "Bearer " + supabase.anonKey,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ session_id: sessionId, student_name: studentName, score, total }),
    });
    if (res.ok) state.estSubmitted = true;
  } catch (e) {
    console.warn("Could not submit EST score to class:", e);
  }
}

function renderESTPracticeResults() {
  const totalPoints = EST_QUESTIONS.reduce((sum, q) => sum + q.points, 0);
  const score = state.practiceScore;
  const pct = totalPoints ? Math.round((score / totalPoints) * 100) : 0;
  const reward = getESTRewardTier(pct);

  submitESTToClass(score, totalPoints);

  const heading = document.createElement("p");
  heading.className = "articulation-question";
  heading.textContent = "EST Practice – Impactful Technology";
  narrationEl.appendChild(heading);

  const scoreEl = document.createElement("p");
  scoreEl.className = "est-results-score";
  scoreEl.textContent = "Your score: " + score + " / " + totalPoints + " (" + pct + "%)";
  narrationEl.appendChild(scoreEl);

  const badgeEl = document.createElement("div");
  badgeEl.className = "est-reward-badge est-reward-" + reward.tier;
  badgeEl.innerHTML = "🏅 " + reward.label;
  narrationEl.appendChild(badgeEl);

  const message = document.createElement("p");
  message.textContent = reward.message;
  message.className = reward.tier === "participant" ? "feedback-wrong" : "feedback-correct";
  narrationEl.appendChild(message);

  const contributionEl = document.createElement("p");
  contributionEl.className = "est-contribution";
  contributionEl.textContent = "Your contribution to the class total: +" + score + " points.";
  narrationEl.appendChild(contributionEl);

  const decoderTip = document.createElement("div");
  decoderTip.className = "est-decoder-tip";
  decoderTip.innerHTML =
    "<strong>GTCEM Question Decoder – VTCS (Very Tired Career Students):</strong><br>" +
    "• <strong>V</strong>erb: What does the question want you to do? (Identify, Outline, Describe, Explain, Discuss, Compare, Analyse)<br>" +
    "• <strong>T</strong>opic: What concept are you writing about? (e.g. megatrends, impactful technology)<br>" +
    "• <strong>C</strong>ontext: What situation does it apply to? (Use words from the glossary – work environments, types of employment, emerging/declining jobs)<br>" +
    "• <strong>S</strong>tructure: Use the correct answer formula for that verb (marks = sentences).<br>" +
    "⭐ <strong>Stronger answers:</strong> Add <em>Because</em> → <em>For example</em> → <em>As a result</em>.<br>" +
    "E.g. <em>Discuss</em> = 4 sentences: Point → Explanation → For example → As a result.";
  narrationEl.appendChild(decoderTip);

  const cycleBackMsg = document.createElement("p");
  cycleBackMsg.className = "cycle-back-message";
  cycleBackMsg.textContent = "Let's cycle back and choose some other options for this mechanic.";
  narrationEl.appendChild(cycleBackMsg);
}

// DOM references
const sceneLabelEl = document.getElementById("scene-label");
const scenePhaseEl = document.getElementById("scene-phase");
const mediaPlaceholderEl = document.getElementById("media-placeholder");
const narrationEl = document.getElementById("narration");
const choicesEl = document.getElementById("choices");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const tapOverlay = document.getElementById("tap-overlay");
const tapStartButton = document.getElementById("tap-start");

let currentSceneIndex = 0;

if (tapStartButton && tapOverlay) {
  tapStartButton.addEventListener("click", () => {
    state.audioUnlocked = true;
    tapOverlay.style.display = "none";
  });
}

function renderScene() {
  const scene = scenes[currentSceneIndex];

  sceneLabelEl.textContent = scene.label;
  scenePhaseEl.textContent = scene.phase || "";

  mediaPlaceholderEl.innerHTML = "";
  const caption = document.createElement("p");
  caption.className = "media-caption";
  caption.textContent =
    scene.mediaNote ||
    "Media placeholder — add your video, image, or animation for this scene.";
  const mediaBase = scene.media && scene.id && scene.id.startsWith("impact-") ? CONTENT_BASE : INTRO_MEDIA_BASE;
  const mediaSrc = scene.media ? `${mediaBase}/${scene.media}` : null;
  if (mediaSrc) {
    const ext = (scene.media.split(".").pop() || "").toLowerCase();
    const isVideo = /^(mp4|webm|ogg)$/.test(ext);
    if (isVideo) {
      const video = document.createElement("video");
      video.src = mediaSrc;
      video.controls = true;
      video.muted = true;
      video.playsInline = true;
      if (scene.id === "impact-mechanic-3") video.loop = true; // "The pressure from new tech"
      video.className = "intro-media";
      video.onerror = () => {
        mediaPlaceholderEl.innerHTML = "";
        mediaPlaceholderEl.appendChild(caption);
      };
      mediaPlaceholderEl.appendChild(video);
      mediaPlaceholderEl.appendChild(caption);

      const soundButton = document.createElement("button");
      soundButton.type = "button";
      soundButton.className = "intro-sound-toggle intro-sound-toggle--primary";
      soundButton.textContent = "Unmute & play";
      soundButton.addEventListener("click", () => {
        state.audioUnlocked = true;
        if (tapOverlay) tapOverlay.style.display = "none";
        video.muted = false;
        soundButton.textContent = "Sound on — click to mute";
        soundButton.classList.remove("intro-sound-toggle--primary");
        video.play().catch(() => {});
      });
      mediaPlaceholderEl.appendChild(soundButton);
    } else {
      const img = document.createElement("img");
      img.src = mediaSrc;
      img.alt = scene.label;
      img.className = "intro-media";
      img.onerror = () => {
        mediaPlaceholderEl.innerHTML = "";
        mediaPlaceholderEl.appendChild(caption);
      };
      mediaPlaceholderEl.appendChild(img);
      mediaPlaceholderEl.appendChild(caption);
    }
  } else {
    mediaPlaceholderEl.appendChild(caption);
  }

  narrationEl.innerHTML = "";

  // Special handling for the articulation screen
  if (scene.id === "impact-mechanic-articulation") {
    renderArticulation(scene);
  } else if (scene.id === "est-practice") {
    renderESTPractice();
  } else if (scene.id === "est-practice-results") {
    renderESTPracticeResults();
  } else {
    let lines = scene.narration || [];

    if (scene.id === "impact-mechanic-consequence") {
      lines = getMechanicConsequenceLines();
    }

    lines.forEach((line) => {
      const p = document.createElement("p");
      p.textContent = line;
      narrationEl.appendChild(p);
    });
  }

  choicesEl.innerHTML = "";
  const hasChoices = Array.isArray(scene.choices) && scene.choices.length > 0;
  let choiceSelected = false;

  if (hasChoices) {
    const savedChoiceId = state.choices[scene.id];

    scene.choices.forEach((choice) => {
      const button = document.createElement("button");
      button.className = "choice-button";
      button.textContent = choice.label;

      if (savedChoiceId && savedChoiceId === choice.id) {
        button.classList.add("selected");
        choiceSelected = true;
      }

      button.addEventListener("click", () => {
        state.choices[scene.id] = choice.id;
        document
          .querySelectorAll(".choice-button")
          .forEach((b) => b.classList.remove("selected"));
        button.classList.add("selected");
        nextButton.disabled = false;
      });

      choicesEl.appendChild(button);
    });
  }

  prevButton.disabled = currentSceneIndex === 0;

  if (hasChoices) {
    nextButton.disabled = !choiceSelected;
  } else {
    nextButton.disabled = false;
  }

  // Update Next button label so it’s clear when students
  // have reached the end of the scenario.
  if (currentSceneIndex === scenes.length - 1) {
    nextButton.textContent = "Cycle back";
  } else {
    nextButton.textContent = "Next";
  }
}

prevButton.addEventListener("click", () => {
  const scene = scenes[currentSceneIndex];
  if (scene.id === "est-practice" && state.practiceQuestionIndex > 0) {
    state.practiceQuestionIndex -= 1;
    renderScene();
    return;
  }
  if (currentSceneIndex > 0) {
    currentSceneIndex -= 1;
    renderScene();
  }
});

nextButton.addEventListener("click", () => {
  const scene = scenes[currentSceneIndex];
  const hasChoices = Array.isArray(scene.choices) && scene.choices.length > 0;

  if (hasChoices && !state.choices[scene.id]) {
    return;
  }

  if (scene.id === "est-practice") {
    if (state.practiceQuestionIndex < EST_QUESTIONS.length - 1) {
      state.practiceQuestionIndex += 1;
      renderScene();
    } else {
      currentSceneIndex += 1;
      renderScene();
    }
    return;
  }

  if (scene.id === "impact-mechanic-articulation") {
    const nameEl = document.getElementById("student-name-input");
    if (nameEl) state.studentName = (nameEl.value || "").trim();
    maybeSubmitResults().then(() => {
      currentSceneIndex += 1;
      renderScene();
    });
    return;
  }

  if (currentSceneIndex < scenes.length - 1) {
    currentSceneIndex += 1;
    renderScene();
  } else {
    // Loop back to start of mechanic scenario so they can choose a different response.
    const mechanicStartIndex = scenes.findIndex((s) => s.id === "impact-mechanic-1");
    if (mechanicStartIndex !== -1) {
      currentSceneIndex = mechanicStartIndex;
      state.choices["impact-mechanic-decision"] = null;
      delete state.choices["impact-mechanic-decision"];
      renderScene();
    }
  }
});

// Handle typing directly over the articulation sentences
window.addEventListener("keydown", (event) => {
  const scene = scenes[currentSceneIndex];
  if (!scene || scene.id !== "impact-mechanic-articulation") return;

  const key = event.key;
  if (key.length !== 1) return; // ignore Shift, Enter, etc.

  event.preventDefault();

  // Decide which line we are on
  const line1Length = KEY_CONCEPT_LINE1.length;
  let currentKey = "q1";
  if (state.articulationProgress.q1 >= line1Length) {
    currentKey = "q2";
  }

  const targetText =
    currentKey === "q1" ? KEY_CONCEPT_LINE1 : KEY_CONCEPT_LINE2;

  const idx = state.articulationProgress[currentKey] || 0;
  if (idx >= targetText.length) {
    return;
  }

  const expectedChar = targetText[idx];

  if (key.toLowerCase() === expectedChar.toLowerCase()) {
    state.articulationProgress[currentKey] = idx + 1;
  updateArticulationHighlights();
  narrationEl.focus();
}
});

// Load intro pages from content folder, then start the game
(async function init() {
  try {
    const res = await fetch(`${INTRO_MEDIA_BASE}/manifest.json`);
    const manifest = await res.json();
    const introScenes = introScenesFromManifest(manifest);
    scenes = introScenes.concat(scenarioScenes);
  } catch (err) {
    console.warn("Could not load intro manifest, using built-in intro scenes:", err);
    scenes = fallbackIntroScenes.concat(scenarioScenes);
  }
  renderScene();
})();

