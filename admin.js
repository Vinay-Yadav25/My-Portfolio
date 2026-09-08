// ================================================================
//  ADMIN CMS — admin.js
//  All data stored in localStorage under "vy_portfolio"
//  Optional cloud sync via JSONBin.io
// ================================================================

// ── DEFAULT DATA (matches hardcoded portfolio) ──────────────────
const DEFAULTS = {
  projects: [
    {
      id: "p1",
      num: "01",
      title: "AI Plagiarism Detection",
      desc: "Detects AI-generated and copied content using FastAPI and ML models with high accuracy.",
      tags: ["FastAPI", "Machine Learning", "Python"],
      github: "https://github.com/Vinay-Yadav25/AI-Plagiarism-Detection-Tool",
      demo: ""
    },
    {
      id: "p2",
      num: "02",
      title: "AI-Workout App",
      desc: "Personalized AI workout plans with progress tracking and intelligent fitness recommendations.",
      tags: ["Flutter", "PHP", "MySQL", "AI"],
      github: "https://github.com/Vinay-Yadav25",
      demo: ""
    },
    {
      id: "p3",
      num: "03",
      title: "AI Helmet Detection",
      desc: "Real-time YOLOv8 safety detection system with Streamlit dashboard, alerts, and metrics.",
      tags: ["YOLOv8", "Computer Vision", "Streamlit"],
      github: "https://github.com/Vinay-Yadav25/AI-Based-Helmet-Detection",
      demo: ""
    }
  ],
  skills: [
    { id: "s1", icon: "🖥️", name: "Frontend",   tags: ["HTML", "CSS", "JavaScript"] },
    { id: "s2", icon: "💻", name: "Languages",  tags: ["Python", "Java", "C"] },
    { id: "s3", icon: "⚙️", name: "Backend",    tags: ["⚡ FastAPI", "🐘 PHP", "MySQL"] },
    { id: "s4", icon: "🤖", name: "AI / ML",    tags: ["🧠 Deep Learning", "👁️ Computer Vision", "🎯 YOLOv8"] },
    { id: "s5", icon: "📱", name: "Mobile Dev", tags: ["📱 Flutter", "🎯 Dart"] },
    { id: "s6", icon: "🛠️", name: "Tools",      tags: ["VS Code", "GitHub", "ChatGPT"] }
  ]
};

// ── STORAGE KEY & PASSWORD ──────────────────────────────────────
const DATA_KEY     = "vy_portfolio";
const PWD_KEY      = "vy_admin_pwd";
const JB_KEY       = "vy_jb_key";
const JB_BIN       = "vy_jb_bin";
const DEFAULT_PWD  = "vinay@2025";    // ← change in Settings after first login

// ── HELPERS ────────────────────────────────────────────────────
function getData() {
  const raw = localStorage.getItem(DATA_KEY);
  return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(DEFAULTS));
}

function saveData(data) {
  localStorage.setItem(DATA_KEY, JSON.stringify(data));
  syncToCloud(data);   // fire-and-forget cloud sync if configured
}

function getPwd() {
  return localStorage.getItem(PWD_KEY) || DEFAULT_PWD;
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

// ── CLOUD SYNC ─────────────────────────────────────────────────
async function syncToCloud(data) {
  const key = localStorage.getItem(JB_KEY);
  const bin = localStorage.getItem(JB_BIN);
  if (!key || !bin) return;
  try {
    await fetch(`https://api.jsonbin.io/v3/b/${bin}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": key
      },
      body: JSON.stringify(data)
    });
  } catch (e) {
    console.warn("Cloud sync failed:", e);
  }
}

async function fetchFromCloud() {
  const key = localStorage.getItem(JB_KEY);
  const bin = localStorage.getItem(JB_BIN);
  if (!key || !bin) return null;
  try {
    const res  = await fetch(`https://api.jsonbin.io/v3/b/${bin}/latest`, {
      headers: { "X-Master-Key": key }
    });
    const json = await res.json();
    return json.record || null;
  } catch (e) {
    return null;
  }
}

// ── LOGIN ──────────────────────────────────────────────────────
const loginScreen = document.getElementById("login-screen");
const dashboard   = document.getElementById("dashboard");
const pwdInput    = document.getElementById("pwd-input");
const loginBtn    = document.getElementById("login-btn");
const loginErr    = document.getElementById("login-err");

function doLogin() {
  if (pwdInput.value === getPwd()) {
    loginScreen.classList.add("hidden");
    dashboard.classList.remove("hidden");
    renderProjects();
    renderSkills();
    loadJbSettings();
    loginErr.textContent = "";
  } else {
    loginErr.textContent = "Incorrect password. Try again.";
    pwdInput.value = "";
    pwdInput.focus();
  }
}

loginBtn.addEventListener("click", doLogin);
pwdInput.addEventListener("keydown", e => { if (e.key === "Enter") doLogin(); });

document.getElementById("logout-btn").addEventListener("click", () => {
  loginScreen.classList.remove("hidden");
  dashboard.classList.add("hidden");
  pwdInput.value = "";
});

// ── TABS ───────────────────────────────────────────────────────
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.add("hidden"));
    tab.classList.add("active");
    document.getElementById(`tab-${tab.dataset.tab}`).classList.remove("hidden");
    document.getElementById(`tab-${tab.dataset.tab}`).classList.add("active");
  });
});

// ================================================================
//  PROJECTS
// ================================================================
const projectFormCard  = document.getElementById("project-form-card");
const projectFormTitle = document.getElementById("project-form-title");

function renderProjects() {
  const { projects } = getData();
  const list = document.getElementById("projects-list");

  if (!projects.length) {
    list.innerHTML = '<div class="empty-state">No projects yet. Click "+ Add Project" to get started.</div>';
    return;
  }

  list.innerHTML = projects.map(p => `
    <div class="list-card">
      <div class="list-card-info">
        <div class="list-card-num">PROJECT ${p.num || ""}</div>
        <div class="list-card-title">${p.title}</div>
        <div class="list-card-desc">${p.desc}</div>
        <div class="list-card-tags">
          ${p.tags.map(t => `<span class="list-tag">${t}</span>`).join("")}
        </div>
        <div style="margin-top:8px;display:flex;gap:12px;font-size:0.75rem;color:var(--muted)">
          ${p.github ? `<a href="${p.github}" target="_blank" style="color:var(--accent)">GitHub ↗</a>` : ""}
          ${p.demo   ? `<a href="${p.demo}"   target="_blank" style="color:var(--accent2)">Live Demo ↗</a>` : '<span>No demo</span>'}
        </div>
      </div>
      <div class="list-card-actions">
        <button class="btn-edit"   onclick="editProject('${p.id}')">Edit</button>
        <button class="btn-delete" onclick="deleteProject('${p.id}')">Delete</button>
      </div>
    </div>
  `).join("");
}

document.getElementById("add-project-btn").addEventListener("click", () => {
  clearProjectForm();
  projectFormTitle.textContent = "Add Project";
  projectFormCard.classList.remove("hidden");
  projectFormCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

document.getElementById("cancel-project-btn").addEventListener("click", () => {
  projectFormCard.classList.add("hidden");
});

document.getElementById("save-project-btn").addEventListener("click", () => {
  const title = document.getElementById("proj-title").value.trim();
  const desc  = document.getElementById("proj-desc").value.trim();
  if (!title || !desc) { alert("Title and description are required."); return; }

  const data = getData();
  const id   = document.getElementById("proj-id").value || uid();
  const proj = {
    id,
    num:    document.getElementById("proj-num").value.trim() || String(data.projects.length + 1).padStart(2, "0"),
    title,
    desc,
    tags:   document.getElementById("proj-tags").value.split(",").map(t => t.trim()).filter(Boolean),
    github: document.getElementById("proj-github").value.trim(),
    demo:   document.getElementById("proj-demo").value.trim()
  };

  const idx = data.projects.findIndex(p => p.id === id);
  if (idx > -1) {
    data.projects[idx] = proj;
  } else {
    data.projects.push(proj);
  }

  saveData(data);
  renderProjects();
  projectFormCard.classList.add("hidden");
  clearProjectForm();
});

window.editProject = function(id) {
  const { projects } = getData();
  const p = projects.find(p => p.id === id);
  if (!p) return;
  document.getElementById("proj-id").value     = p.id;
  document.getElementById("proj-num").value    = p.num;
  document.getElementById("proj-title").value  = p.title;
  document.getElementById("proj-desc").value   = p.desc;
  document.getElementById("proj-tags").value   = p.tags.join(", ");
  document.getElementById("proj-github").value = p.github;
  document.getElementById("proj-demo").value   = p.demo;
  projectFormTitle.textContent = "Edit Project";
  projectFormCard.classList.remove("hidden");
  projectFormCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
};

window.deleteProject = function(id) {
  if (!confirm("Delete this project?")) return;
  const data = getData();
  data.projects = data.projects.filter(p => p.id !== id);
  saveData(data);
  renderProjects();
};

function clearProjectForm() {
  ["proj-id","proj-num","proj-title","proj-desc","proj-tags","proj-github","proj-demo"]
    .forEach(id => document.getElementById(id).value = "");
}

// ================================================================
//  SKILLS
// ================================================================
const skillFormCard  = document.getElementById("skill-form-card");
const skillFormTitle = document.getElementById("skill-form-title");

function renderSkills() {
  const { skills } = getData();
  const list = document.getElementById("skills-list");

  if (!skills.length) {
    list.innerHTML = '<div class="empty-state">No skill categories yet. Click "+ Add Category" to get started.</div>';
    return;
  }

  list.innerHTML = skills.map(s => `
    <div class="list-card">
      <div class="list-card-info">
        <div class="list-card-title">${s.icon} ${s.name}</div>
        <div class="list-card-tags" style="margin-top:8px">
          ${s.tags.map(t => `<span class="list-tag">${t}</span>`).join("")}
        </div>
      </div>
      <div class="list-card-actions">
        <button class="btn-edit"   onclick="editSkill('${s.id}')">Edit</button>
        <button class="btn-delete" onclick="deleteSkill('${s.id}')">Delete</button>
      </div>
    </div>
  `).join("");
}

document.getElementById("add-skill-btn").addEventListener("click", () => {
  clearSkillForm();
  skillFormTitle.textContent = "Add Skill Category";
  skillFormCard.classList.remove("hidden");
  skillFormCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

document.getElementById("cancel-skill-btn").addEventListener("click", () => {
  skillFormCard.classList.add("hidden");
});

document.getElementById("save-skill-btn").addEventListener("click", () => {
  const name = document.getElementById("skill-name").value.trim();
  if (!name) { alert("Category name is required."); return; }

  const data = getData();
  const id   = document.getElementById("skill-id").value || uid();
  const skill = {
    id,
    icon: document.getElementById("skill-icon").value.trim() || "🔧",
    name,
    tags: document.getElementById("skill-tags").value.split(",").map(t => t.trim()).filter(Boolean)
  };

  const idx = data.skills.findIndex(s => s.id === id);
  if (idx > -1) {
    data.skills[idx] = skill;
  } else {
    data.skills.push(skill);
  }

  saveData(data);
  renderSkills();
  skillFormCard.classList.add("hidden");
  clearSkillForm();
});

window.editSkill = function(id) {
  const { skills } = getData();
  const s = skills.find(s => s.id === id);
  if (!s) return;
  document.getElementById("skill-id").value    = s.id;
  document.getElementById("skill-icon").value  = s.icon;
  document.getElementById("skill-name").value  = s.name;
  document.getElementById("skill-tags").value  = s.tags.join(", ");
  skillFormTitle.textContent = "Edit Skill Category";
  skillFormCard.classList.remove("hidden");
  skillFormCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
};

window.deleteSkill = function(id) {
  if (!confirm("Delete this skill category?")) return;
  const data = getData();
  data.skills = data.skills.filter(s => s.id !== id);
  saveData(data);
  renderSkills();
};

function clearSkillForm() {
  ["skill-id","skill-icon","skill-name","skill-tags"]
    .forEach(id => document.getElementById(id).value = "");
}


// ================================================================
//  RESUME
// ================================================================
const RESUME_SETTINGS_KEY = "vy_resume_settings";

function loadResumeSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(RESUME_SETTINGS_KEY) || "{}");
    if (saved.owner) document.getElementById("resume-owner").value = saved.owner;
    if (saved.repo) document.getElementById("resume-repo").value = saved.repo;
    if (saved.branch) document.getElementById("resume-branch").value = saved.branch;
    if (saved.path) document.getElementById("resume-path").value = saved.path;
  } catch (_) {}
}

function saveResumeSettings() {
  localStorage.setItem(RESUME_SETTINGS_KEY, JSON.stringify({
    owner: document.getElementById("resume-owner").value.trim(),
    repo: document.getElementById("resume-repo").value.trim(),
    branch: document.getElementById("resume-branch").value.trim() || "main",
    path: document.getElementById("resume-path").value.trim() || "Vinay-Resume.pdf"
  }));
}

async function updateResumeOnGitHub() {
  const token = document.getElementById("resume-token").value.trim();
  const owner = document.getElementById("resume-owner").value.trim();
  const repo = document.getElementById("resume-repo").value.trim();
  const branch = document.getElementById("resume-branch").value.trim() || "main";
  const path = document.getElementById("resume-path").value.trim() || "Vinay-Resume.pdf";
  const fileInput = document.getElementById("resume-file");
  const msg = document.getElementById("resume-msg");
  const button = document.getElementById("update-resume-btn");

  msg.textContent = "";

  if (!token || !owner || !repo || !fileInput.files.length) {
    msg.textContent = "Please enter the GitHub token, repository details, and select a PDF.";
    return;
  }

  const file = fileInput.files[0];
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    msg.textContent = "Please select a PDF file only.";
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    msg.textContent = "Resume is too large. Please keep the PDF under 10 MB.";
    return;
  }

  if (!confirm(`Replace the current ${path} with ${file.name}?`)) return;

  button.disabled = true;
  button.textContent = "Updating...";

  try {
    const apiUrl = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${path.split("/").map(encodeURIComponent).join("/")}`;
    const headers = {
      "Accept": "application/vnd.github+json",
      "Authorization": `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28"
    };

    // Get the existing file first so GitHub can overwrite it using its current SHA.
    const existingRes = await fetch(`${apiUrl}?ref=${encodeURIComponent(branch)}`, { headers });
    let sha = null;

    if (existingRes.ok) {
      const existing = await existingRes.json();
      sha = existing.sha || null;
    } else if (existingRes.status !== 404) {
      const error = await existingRes.json().catch(() => ({}));
      throw new Error(error.message || `Could not access the existing resume (HTTP ${existingRes.status}).`);
    }

    const base64 = await fileToBase64(file);
    const payload = {
      message: sha ? `Update resume: ${file.name}` : `Add resume: ${file.name}`,
      content: base64,
      branch
    };
    if (sha) payload.sha = sha;

    const updateRes = await fetch(apiUrl, {
      method: "PUT",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await updateRes.json().catch(() => ({}));
    if (!updateRes.ok) {
      throw new Error(result.message || `GitHub rejected the update (HTTP ${updateRes.status}).`);
    }

    saveResumeSettings();
    document.getElementById("resume-token").value = "";
    fileInput.value = "";
    msg.textContent = "✓ Resume replaced successfully. GitHub Pages may take a few minutes to publish it.";
  } catch (error) {
    console.error("Resume update failed:", error);
    msg.textContent = `✕ ${error.message}`;
  } finally {
    button.disabled = false;
    button.textContent = "Replace Resume";
  }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      resolve(result.split(",")[1] || "");
    };
    reader.onerror = () => reject(new Error("Could not read the PDF file."));
    reader.readAsDataURL(file);
  });
}

document.getElementById("update-resume-btn").addEventListener("click", updateResumeOnGitHub);
loadResumeSettings();

// ================================================================
//  SETTINGS
// ================================================================

// ── Change Password ────────────────────────────────────────────
document.getElementById("change-pwd-btn").addEventListener("click", () => {
  const curr    = document.getElementById("curr-pwd").value;
  const next    = document.getElementById("new-pwd").value;
  const confirm = document.getElementById("confirm-pwd").value;
  const msg     = document.getElementById("pwd-msg");

  if (curr !== getPwd()) {
    msg.textContent = "Current password is incorrect.";
    msg.className = "form-msg error";
    return;
  }
  if (next.length < 6) {
    msg.textContent = "New password must be at least 6 characters.";
    msg.className = "form-msg error";
    return;
  }
  if (next !== confirm) {
    msg.textContent = "Passwords do not match.";
    msg.className = "form-msg error";
    return;
  }

  localStorage.setItem(PWD_KEY, next);
  ["curr-pwd","new-pwd","confirm-pwd"].forEach(id => document.getElementById(id).value = "");
  msg.textContent = "✓ Password updated successfully.";
  msg.className = "form-msg success";
  setTimeout(() => msg.textContent = "", 3000);
});

// ── JSONBin Settings ───────────────────────────────────────────
function loadJbSettings() {
  const key = localStorage.getItem(JB_KEY) || "";
  const bin = localStorage.getItem(JB_BIN) || "";
  document.getElementById("jb-key").value = key;
  document.getElementById("jb-bin").value = bin;
}

document.getElementById("save-jb-btn").addEventListener("click", async () => {
  const key = document.getElementById("jb-key").value.trim();
  const bin = document.getElementById("jb-bin").value.trim();
  const msg = document.getElementById("jb-msg");

  if (!key || !bin) {
    msg.textContent = "Both API Key and Bin ID are required.";
    msg.className = "form-msg error";
    return;
  }

  localStorage.setItem(JB_KEY, key);
  localStorage.setItem(JB_BIN, bin);

  msg.textContent = "Syncing...";
  msg.className = "form-msg";

  // Try pulling cloud data first
  const cloudData = await fetchFromCloud();
  if (cloudData && cloudData.projects) {
    saveData(cloudData);
    renderProjects();
    renderSkills();
    msg.textContent = "✓ Connected! Pulled latest data from cloud.";
  } else {
    // Push local data to cloud
    await syncToCloud(getData());
    msg.textContent = "✓ Connected! Local data pushed to cloud.";
  }
  msg.className = "form-msg success";
  setTimeout(() => msg.textContent = "", 4000);
});

document.getElementById("clear-jb-btn").addEventListener("click", () => {
  localStorage.removeItem(JB_KEY);
  localStorage.removeItem(JB_BIN);
  document.getElementById("jb-key").value = "";
  document.getElementById("jb-bin").value = "";
  const msg = document.getElementById("jb-msg");
  msg.textContent = "Cloud sync cleared.";
  msg.className = "form-msg";
  setTimeout(() => msg.textContent = "", 2000);
});

// ── Reset to Defaults ──────────────────────────────────────────
document.getElementById("reset-btn").addEventListener("click", () => {
  if (!confirm("This will delete all your custom projects and skills and restore defaults. Are you sure?")) return;
  saveData(JSON.parse(JSON.stringify(DEFAULTS)));
  renderProjects();
  renderSkills();
  const msg = document.getElementById("reset-msg");
  msg.textContent = "✓ Reset to defaults.";
  msg.className = "form-msg success";
  setTimeout(() => msg.textContent = "", 3000);
});
