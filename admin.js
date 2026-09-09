// ================================================================
//  ADMIN CMS — admin.js
//  Portfolio CMS with localStorage + JSONBin cloud sync
// ================================================================

// ── DEFAULT DATA ────────────────────────────────────────────────
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
    {
      id: "s1",
      icon: "🖥️",
      name: "Frontend",
      tags: ["HTML", "CSS", "JavaScript"]
    },
    {
      id: "s2",
      icon: "💻",
      name: "Languages",
      tags: ["Python", "Java", "C"]
    },
    {
      id: "s3",
      icon: "⚙️",
      name: "Backend",
      tags: ["⚡ FastAPI", "🐘 PHP", "MySQL"]
    },
    {
      id: "s4",
      icon: "🤖",
      name: "AI / ML",
      tags: [
        "🧠 Deep Learning",
        "👁️ Computer Vision",
        "🎯 YOLOv8"
      ]
    },
    {
      id: "s5",
      icon: "📱",
      name: "Mobile Dev",
      tags: ["📱 Flutter", "🎯 Dart"]
    },
    {
      id: "s6",
      icon: "🛠️",
      name: "Tools",
      tags: ["VS Code", "GitHub", "ChatGPT"]
    }
  ]
};


// ── STORAGE KEY & PASSWORD ──────────────────────────────────────
const DATA_KEY = "vy_portfolio";
const PWD_KEY = "vy_admin_pwd";
const JB_KEY = "vy_jb_key";

// Permanent JSONBin Bin ID for this portfolio
const JB_BIN = "6aa13488ffd5d16053f11a38";

const DEFAULT_PWD = "vinay@2025";


// ── HELPERS ─────────────────────────────────────────────────────
function getData() {
  const raw = localStorage.getItem(DATA_KEY);

  return raw
    ? JSON.parse(raw)
    : JSON.parse(JSON.stringify(DEFAULTS));
}


function saveData(data) {
  localStorage.setItem(
    DATA_KEY,
    JSON.stringify(data)
  );

  // Sync to JSONBin if API key is configured
  syncToCloud(data);
}


function getPwd() {
  return localStorage.getItem(PWD_KEY) || DEFAULT_PWD;
}


function uid() {
  return Math.random()
    .toString(36)
    .slice(2, 9);
}


// ================================================================
//  JSONBIN CLOUD SYNC
// ================================================================

async function syncToCloud(data) {

  const key = localStorage.getItem(JB_KEY);
  const bin = JB_BIN;

  if (!key) {
    console.warn(
      "JSONBin API key is not configured."
    );

    return false;
  }

  try {

    const response = await fetch(
      `https://api.jsonbin.io/v3/b/${bin}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          "X-Master-Key": key
        },

        body: JSON.stringify(data)
      }
    );


    if (!response.ok) {

      const error =
        await response
          .json()
          .catch(() => ({}));

      console.warn(
        "Cloud sync failed:",
        error.message ||
        `HTTP ${response.status}`
      );

      return false;
    }


    console.log(
      "✓ Portfolio data synced to JSONBin."
    );

    return true;

  } catch (error) {

    console.warn(
      "Cloud sync failed:",
      error
    );

    return false;
  }
}



async function fetchFromCloud() {

  const key = localStorage.getItem(JB_KEY);
  const bin = JB_BIN;

  if (!key) {

    console.warn(
      "JSONBin API key is not configured."
    );

    return null;
  }


  try {

    const response = await fetch(
      `https://api.jsonbin.io/v3/b/${bin}/latest`,
      {
        headers: {
          "X-Master-Key": key
        }
      }
    );


    if (!response.ok) {

      const error =
        await response
          .json()
          .catch(() => ({}));

      console.warn(
        "Could not load cloud data:",
        error.message ||
        `HTTP ${response.status}`
      );

      return null;
    }


    const json =
      await response.json();

    return json.record || null;

  } catch (error) {

    console.warn(
      "Cloud fetch failed:",
      error
    );

    return null;
  }
}


// ── AUTOMATIC CLOUD LOAD ────────────────────────────────────────

async function loadCloudDataAutomatically() {

  const key =
    localStorage.getItem(JB_KEY);


  if (!key) {

    console.log(
      "JSONBin API key not configured. Using local data."
    );

    return;
  }


  const cloudData =
    await fetchFromCloud();


  if (
    cloudData &&
    Array.isArray(cloudData.projects) &&
    Array.isArray(cloudData.skills)
  ) {

    // Save cloud data as local cache
    localStorage.setItem(
      DATA_KEY,
      JSON.stringify(cloudData)
    );


    renderProjects();
    renderSkills();


    console.log(
      "✓ Latest portfolio data loaded from JSONBin."
    );

  } else {

    console.log(
      "No valid cloud data found. Using local data."
    );
  }
}


// ================================================================
//  LOGIN
// ================================================================

const loginScreen =
  document.getElementById("login-screen");

const dashboard =
  document.getElementById("dashboard");

const pwdInput =
  document.getElementById("pwd-input");

const loginBtn =
  document.getElementById("login-btn");

const loginErr =
  document.getElementById("login-err");


async function doLogin() {

  if (pwdInput.value === getPwd()) {

    loginScreen.classList.add("hidden");

    dashboard.classList.remove("hidden");


    // Show local data immediately
    renderProjects();
    renderSkills();


    // Load JSONBin settings
    loadJbSettings();


    loginErr.textContent = "";


    // Automatically load latest cloud data
    await loadCloudDataAutomatically();

  } else {

    loginErr.textContent =
      "Incorrect password. Try again.";

    pwdInput.value = "";

    pwdInput.focus();
  }
}


loginBtn.addEventListener(
  "click",
  doLogin
);


pwdInput.addEventListener(
  "keydown",
  event => {

    if (event.key === "Enter") {
      doLogin();
    }

  }
);


// ── LOGOUT ──────────────────────────────────────────────────────

document
  .getElementById("logout-btn")
  .addEventListener("click", () => {

    loginScreen.classList.remove("hidden");

    dashboard.classList.add("hidden");

    pwdInput.value = "";
  });


// ================================================================
//  TABS
// ================================================================

document
  .querySelectorAll(".tab")
  .forEach(tab => {

    tab.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(".tab")
          .forEach(t =>
            t.classList.remove("active")
          );


        document
          .querySelectorAll(".tab-content")
          .forEach(c =>
            c.classList.add("hidden")
          );


        tab.classList.add("active");


        const tabContent =
          document.getElementById(
            `tab-${tab.dataset.tab}`
          );


        tabContent.classList.remove("hidden");

        tabContent.classList.add("active");
      }
    );
  });


// ================================================================
//  PROJECTS
// ================================================================

const projectFormCard =
  document.getElementById(
    "project-form-card"
  );

const projectFormTitle =
  document.getElementById(
    "project-form-title"
  );


// ── Render Projects ─────────────────────────────────────────────

function renderProjects() {

  const { projects } =
    getData();


  const list =
    document.getElementById(
      "projects-list"
    );


  if (!projects.length) {

    list.innerHTML =
      '<div class="empty-state">No projects yet. Click "+ Add Project" to get started.</div>';

    return;
  }


  list.innerHTML =
    projects
      .map(project => `

        <div class="list-card">

          <div class="list-card-info">

            <div class="list-card-num">
              PROJECT ${project.num || ""}
            </div>

            <div class="list-card-title">
              ${project.title}
            </div>

            <div class="list-card-desc">
              ${project.desc}
            </div>

            <div class="list-card-tags">

              ${
                project.tags
                  .map(
                    tag =>
                      `<span class="list-tag">${tag}</span>`
                  )
                  .join("")
              }

            </div>


            <div
              style="
                margin-top:8px;
                display:flex;
                gap:12px;
                font-size:0.75rem;
                color:var(--muted)
              "
            >

              ${
                project.github
                  ? `<a href="${project.github}" target="_blank" style="color:var(--accent)">GitHub ↗</a>`
                  : ""
              }


              ${
                project.demo
                  ? `<a href="${project.demo}" target="_blank" style="color:var(--accent2)">Live Demo ↗</a>`
                  : "<span>No demo</span>"
              }

            </div>

          </div>


          <div class="list-card-actions">

            <button
              class="btn-edit"
              onclick="editProject('${project.id}')"
            >
              Edit
            </button>


            <button
              class="btn-delete"
              onclick="deleteProject('${project.id}')"
            >
              Delete
            </button>

          </div>

        </div>

      `)
      .join("");
}


// ── Add Project ─────────────────────────────────────────────────

document
  .getElementById("add-project-btn")
  .addEventListener("click", () => {

    clearProjectForm();

    projectFormTitle.textContent =
      "Add Project";

    projectFormCard.classList.remove(
      "hidden"
    );

    projectFormCard.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });

  });


// ── Cancel Project ──────────────────────────────────────────────

document
  .getElementById("cancel-project-btn")
  .addEventListener("click", () => {

    projectFormCard.classList.add(
      "hidden"
    );

  });


// ── Save Project ────────────────────────────────────────────────

document
  .getElementById("save-project-btn")
  .addEventListener("click", () => {

    const title =
      document
        .getElementById("proj-title")
        .value
        .trim();


    const desc =
      document
        .getElementById("proj-desc")
        .value
        .trim();


    if (!title || !desc) {

      alert(
        "Title and description are required."
      );

      return;
    }


    const data =
      getData();


    const id =
      document
        .getElementById("proj-id")
        .value ||
      uid();


    const proj = {

      id,

      num:
        document
          .getElementById("proj-num")
          .value
          .trim() ||
        String(
          data.projects.length + 1
        ).padStart(2, "0"),

      title,

      desc,

      tags:
        document
          .getElementById("proj-tags")
          .value
          .split(",")
          .map(tag => tag.trim())
          .filter(Boolean),

      github:
        document
          .getElementById("proj-github")
          .value
          .trim(),

      demo:
        document
          .getElementById("proj-demo")
          .value
          .trim()
    };


    const index =
      data.projects.findIndex(
        project =>
          project.id === id
      );


    if (index > -1) {

      data.projects[index] =
        proj;

    } else {

      data.projects.push(proj);
    }


    saveData(data);

    renderProjects();


    projectFormCard.classList.add(
      "hidden"
    );


    clearProjectForm();

  });


// ── Edit Project ────────────────────────────────────────────────

window.editProject =
  function(id) {

    const { projects } =
      getData();


    const project =
      projects.find(
        p => p.id === id
      );


    if (!project) return;


    document
      .getElementById("proj-id")
      .value = project.id;


    document
      .getElementById("proj-num")
      .value = project.num;


    document
      .getElementById("proj-title")
      .value = project.title;


    document
      .getElementById("proj-desc")
      .value = project.desc;


    document
      .getElementById("proj-tags")
      .value =
        project.tags.join(", ");


    document
      .getElementById("proj-github")
      .value = project.github;


    document
      .getElementById("proj-demo")
      .value = project.demo;


    projectFormTitle.textContent =
      "Edit Project";


    projectFormCard.classList.remove(
      "hidden"
    );


    projectFormCard.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });

  };


// ── Delete Project ──────────────────────────────────────────────

window.deleteProject =
  function(id) {

    if (
      !confirm(
        "Delete this project?"
      )
    ) {
      return;
    }


    const data =
      getData();


    data.projects =
      data.projects.filter(
        project =>
          project.id !== id
      );


    saveData(data);

    renderProjects();

  };


// ── Clear Project Form ─────────────────────────────────────────

function clearProjectForm() {

  [
    "proj-id",
    "proj-num",
    "proj-title",
    "proj-desc",
    "proj-tags",
    "proj-github",
    "proj-demo"
  ]

    .forEach(
      id =>
        document.getElementById(id).value =
          ""
    );
}


// ================================================================
//  SKILLS
// ================================================================

const skillFormCard =
  document.getElementById(
    "skill-form-card"
  );

const skillFormTitle =
  document.getElementById(
    "skill-form-title"
  );


// ── Render Skills ───────────────────────────────────────────────

function renderSkills() {

  const { skills } =
    getData();


  const list =
    document.getElementById(
      "skills-list"
    );


  if (!skills.length) {

    list.innerHTML =
      '<div class="empty-state">No skill categories yet. Click "+ Add Category" to get started.</div>';

    return;
  }


  list.innerHTML =
    skills
      .map(skill => `

        <div class="list-card">

          <div class="list-card-info">

            <div class="list-card-title">
              ${skill.icon} ${skill.name}
            </div>


            <div
              class="list-card-tags"
              style="margin-top:8px"
            >

              ${
                skill.tags
                  .map(
                    tag =>
                      `<span class="list-tag">${tag}</span>`
                  )
                  .join("")
              }

            </div>

          </div>


          <div class="list-card-actions">

            <button
              class="btn-edit"
              onclick="editSkill('${skill.id}')"
            >
              Edit
            </button>


            <button
              class="btn-delete"
              onclick="deleteSkill('${skill.id}')"
            >
              Delete
            </button>

          </div>

        </div>

      `)
      .join("");
}


// ── Add Skill ───────────────────────────────────────────────────

document
  .getElementById("add-skill-btn")
  .addEventListener("click", () => {

    clearSkillForm();

    skillFormTitle.textContent =
      "Add Skill Category";

    skillFormCard.classList.remove(
      "hidden"
    );

    skillFormCard.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });

  });


// ── Cancel Skill ────────────────────────────────────────────────

document
  .getElementById("cancel-skill-btn")
  .addEventListener("click", () => {

    skillFormCard.classList.add(
      "hidden"
    );

  });


// ── Save Skill ──────────────────────────────────────────────────

document
  .getElementById("save-skill-btn")
  .addEventListener("click", () => {

    const name =
      document
        .getElementById("skill-name")
        .value
        .trim();


    if (!name) {

      alert(
        "Category name is required."
      );

      return;
    }


    const data =
      getData();


    const id =
      document
        .getElementById("skill-id")
        .value ||
      uid();


    const skill = {

      id,

      icon:
        document
          .getElementById("skill-icon")
          .value
          .trim() ||
        "🔧",

      name,

      tags:
        document
          .getElementById("skill-tags")
          .value
          .split(",")
          .map(tag => tag.trim())
          .filter(Boolean)
    };


    const index =
      data.skills.findIndex(
        item =>
          item.id === id
      );


    if (index > -1) {

      data.skills[index] =
        skill;

    } else {

      data.skills.push(skill);
    }


    saveData(data);

    renderSkills();


    skillFormCard.classList.add(
      "hidden"
    );


    clearSkillForm();

  });


// ── Edit Skill ──────────────────────────────────────────────────

window.editSkill =
  function(id) {

    const { skills } =
      getData();


    const skill =
      skills.find(
        item =>
          item.id === id
      );


    if (!skill) return;


    document
      .getElementById("skill-id")
      .value = skill.id;


    document
      .getElementById("skill-icon")
      .value = skill.icon;


    document
      .getElementById("skill-name")
      .value = skill.name;


    document
      .getElementById("skill-tags")
      .value =
        skill.tags.join(", ");


    skillFormTitle.textContent =
      "Edit Skill Category";


    skillFormCard.classList.remove(
      "hidden"
    );


    skillFormCard.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });

  };


// ── Delete Skill ────────────────────────────────────────────────

window.deleteSkill =
  function(id) {

    if (
      !confirm(
        "Delete this skill category?"
      )
    ) {
      return;
    }


    const data =
      getData();


    data.skills =
      data.skills.filter(
        skill =>
          skill.id !== id
      );


    saveData(data);

    renderSkills();

  };


// ── Clear Skill Form ────────────────────────────────────────────

function clearSkillForm() {

  [
    "skill-id",
    "skill-icon",
    "skill-name",
    "skill-tags"
  ]

    .forEach(
      id =>
        document.getElementById(id).value =
          ""
    );
}


// ================================================================
//  RESUME
// ================================================================

const RESUME_SETTINGS_KEY =
  "vy_resume_settings";


// Permanent GitHub repository
const RESUME_OWNER =
  "Vinay-Yadav25";

const RESUME_REPO =
  "My-Portfolio";


function loadResumeSettings() {

  try {

    const saved =
      JSON.parse(
        localStorage.getItem(
          RESUME_SETTINGS_KEY
        ) || "{}"
      );


    document
      .getElementById(
        "resume-owner"
      )
      .value =
        RESUME_OWNER;


    document
      .getElementById(
        "resume-repo"
      )
      .value =
        RESUME_REPO;


    if (saved.branch) {

      document
        .getElementById(
          "resume-branch"
        )
        .value =
          saved.branch;
    }


    if (saved.path) {

      document
        .getElementById(
          "resume-path"
        )
        .value =
          saved.path;
    }

  } catch (_) {}
}


function saveResumeSettings() {

  localStorage.setItem(
    RESUME_SETTINGS_KEY,

    JSON.stringify({

      owner:
        RESUME_OWNER,

      repo:
        RESUME_REPO,

      branch:
        document
          .getElementById(
            "resume-branch"
          )
          .value
          .trim() ||
        "main",

      path:
        document
          .getElementById(
            "resume-path"
          )
          .value
          .trim() ||
        "Vinay-Resume.pdf"

    })
  );
}


// ── Update Resume on GitHub ─────────────────────────────────────

async function updateResumeOnGitHub() {

  const token =
    document
      .getElementById(
        "resume-token"
      )
      .value
      .trim();


  const owner =
    RESUME_OWNER;


  const repo =
    RESUME_REPO;


  const branch =
    document
      .getElementById(
        "resume-branch"
      )
      .value
      .trim() ||
    "main";


  const path =
    document
      .getElementById(
        "resume-path"
      )
      .value
      .trim() ||
    "Vinay-Resume.pdf";


  const fileInput =
    document.getElementById(
      "resume-file"
    );


  const msg =
    document.getElementById(
      "resume-msg"
    );


  const button =
    document.getElementById(
      "update-resume-btn"
    );


  msg.textContent = "";


  if (
    !token ||
    !owner ||
    !repo ||
    !fileInput.files.length
  ) {

    msg.textContent =
      "Please enter the GitHub token, repository details, and select a PDF.";

    return;
  }


  const file =
    fileInput.files[0];


  if (
    file.type !== "application/pdf" &&
    !file.name
      .toLowerCase()
      .endsWith(".pdf")
  ) {

    msg.textContent =
      "Please select a PDF file only.";

    return;
  }


  if (
    file.size >
    10 * 1024 * 1024
  ) {

    msg.textContent =
      "Resume is too large. Please keep the PDF under 10 MB.";

    return;
  }


  if (
    !confirm(
      `Replace the current ${path} with ${file.name}?`
    )
  ) {
    return;
  }


  button.disabled = true;

  button.textContent =
    "Updating...";


  try {

    const apiUrl =
      `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${path
        .split("/")
        .map(encodeURIComponent)
        .join("/")}`;


    const headers = {

      "Accept":
        "application/vnd.github+json",

      "Authorization":
        `Bearer ${token}`,

      "X-GitHub-Api-Version":
        "2022-11-28"

    };


    // Get existing resume SHA
    const existingRes =
      await fetch(
        `${apiUrl}?ref=${encodeURIComponent(branch)}`,
        {
          headers
        }
      );


    let sha = null;


    if (existingRes.ok) {

      const existing =
        await existingRes.json();

      sha =
        existing.sha ||
        null;

    } else if (
      existingRes.status !== 404
    ) {

      const error =
        await existingRes
          .json()
          .catch(() => ({}));


      throw new Error(
        error.message ||
        `Could not access the existing resume (HTTP ${existingRes.status}).`
      );
    }


    // Convert PDF to Base64
    const base64 =
      await fileToBase64(file);


    const payload = {

      message:
        sha
          ? `Update resume: ${file.name}`
          : `Add resume: ${file.name}`,

      content:
        base64,

      branch

    };


    // SHA is required when replacing
    if (sha) {

      payload.sha =
        sha;
    }


    const updateRes =
      await fetch(
        apiUrl,
        {
          method: "PUT",

          headers: {
            ...headers,

            "Content-Type":
              "application/json"
          },

          body:
            JSON.stringify(
              payload
            )
        }
      );


    const result =
      await updateRes
        .json()
        .catch(() => ({}));


    if (!updateRes.ok) {

      throw new Error(
        result.message ||
        `GitHub rejected the update (HTTP ${updateRes.status}).`
      );
    }


    saveResumeSettings();


    // Clear sensitive token
    document
      .getElementById(
        "resume-token"
      )
      .value = "";


    fileInput.value = "";


    msg.textContent =
      "✓ Resume replaced successfully. GitHub Pages may take a few minutes to publish it.";

  } catch (error) {

    console.error(
      "Resume update failed:",
      error
    );


    msg.textContent =
      `✕ ${error.message}`;

  } finally {

    button.disabled = false;

    button.textContent =
      "Replace Resume";
  }
}


// ── File to Base64 ──────────────────────────────────────────────

function fileToBase64(file) {

  return new Promise(
    (resolve, reject) => {

      const reader =
        new FileReader();


      reader.onload = () => {

        const result =
          String(
            reader.result || ""
          );


        resolve(
          result.split(",")[1] ||
          ""
        );
      };


      reader.onerror = () => {

        reject(
          new Error(
            "Could not read the PDF file."
          )
        );
      };


      reader.readAsDataURL(file);
    }
  );
}


document
  .getElementById(
    "update-resume-btn"
  )
  .addEventListener(
    "click",
    updateResumeOnGitHub
  );


loadResumeSettings();


// ================================================================
//  SETTINGS
// ================================================================

// ── Change Password ────────────────────────────────────────────

document
  .getElementById(
    "change-pwd-btn"
  )
  .addEventListener(
    "click",
    () => {

      const curr =
        document
          .getElementById(
            "curr-pwd"
          )
          .value;


      const next =
        document
          .getElementById(
            "new-pwd"
          )
          .value;


      const confirmPassword =
        document
          .getElementById(
            "confirm-pwd"
          )
          .value;


      const msg =
        document
          .getElementById(
            "pwd-msg"
          );


      if (
        curr !==
        getPwd()
      ) {

        msg.textContent =
          "Current password is incorrect.";

        msg.className =
          "form-msg error";

        return;
      }


      if (
        next.length < 6
      ) {

        msg.textContent =
          "New password must be at least 6 characters.";

        msg.className =
          "form-msg error";

        return;
      }


      if (
        next !==
        confirmPassword
      ) {

        msg.textContent =
          "Passwords do not match.";

        msg.className =
          "form-msg error";

        return;
      }


      localStorage.setItem(
        PWD_KEY,
        next
      );


      [
        "curr-pwd",
        "new-pwd",
        "confirm-pwd"
      ]

        .forEach(
          id =>
            document
              .getElementById(id)
              .value = ""
        );


      msg.textContent =
        "✓ Password updated successfully.";

      msg.className =
        "form-msg success";


      setTimeout(
        () =>
          msg.textContent = "",
        3000
      );

    }
  );


// ================================================================
//  JSONBIN SETTINGS
// ================================================================

function loadJbSettings() {

  const key =
    localStorage.getItem(
      JB_KEY
    ) || "";


  document
    .getElementById(
      "jb-key"
    )
    .value =
      key;


  // Bin ID is permanently configured
  const binInput =
    document.getElementById(
      "jb-bin"
    );


  if (binInput) {

    binInput.value =
      JB_BIN;

    binInput.readOnly =
      true;
  }
}


// ── Save & Sync ─────────────────────────────────────────────────

document
  .getElementById(
    "save-jb-btn"
  )
  .addEventListener(
    "click",
    async () => {

      const key =
        document
          .getElementById(
            "jb-key"
          )
          .value
          .trim();


      const msg =
        document
          .getElementById(
            "jb-msg"
          );


      if (!key) {

        msg.textContent =
          "Please enter your JSONBin API key.";

        msg.className =
          "form-msg error";

        return;
      }


      // Store API key locally
      localStorage.setItem(
        JB_KEY,
        key
      );


      msg.textContent =
        "Connecting to JSONBin...";

      msg.className =
        "form-msg";


      // Get latest cloud data
      const cloudData =
        await fetchFromCloud();


      if (
        cloudData &&
        Array.isArray(
          cloudData.projects
        ) &&
        Array.isArray(
          cloudData.skills
        )
      ) {

        // Cloud is source of truth
        localStorage.setItem(
          DATA_KEY,
          JSON.stringify(
            cloudData
          )
        );


        renderProjects();
        renderSkills();


        msg.textContent =
          "✓ Connected! Latest cloud data loaded.";

      } else {

        // If cloud data isn't valid,
        // push local data
        const success =
          await syncToCloud(
            getData()
          );


        if (success) {

          msg.textContent =
            "✓ Connected! Local data pushed to cloud.";

        } else {

          msg.textContent =
            "✕ Could not connect to JSONBin. Check your API key.";

          msg.className =
            "form-msg error";

          return;
        }
      }


      msg.className =
        "form-msg success";


      setTimeout(
        () =>
          msg.textContent = "",
        4000
      );

    }
  );


// ── Clear JSONBin API Key ───────────────────────────────────────

document
  .getElementById(
    "clear-jb-btn"
  )
  .addEventListener(
    "click",
    () => {

      localStorage.removeItem(
        JB_KEY
      );


      document
        .getElementById(
          "jb-key"
        )
        .value = "";


      const binInput =
        document.getElementById(
          "jb-bin"
        );


      if (binInput) {

        binInput.value =
          JB_BIN;
      }


      const msg =
        document.getElementById(
          "jb-msg"
        );


      msg.textContent =
        "JSONBin API key cleared.";

      msg.className =
        "form-msg";


      setTimeout(
        () =>
          msg.textContent = "",
        2000
      );

    }
  );


// ================================================================
//  RESET TO DEFAULTS
// ================================================================

document
  .getElementById(
    "reset-btn"
  )
  .addEventListener(
    "click",
    () => {

      if (
        !confirm(
          "This will delete all your custom projects and skills and restore defaults. Are you sure?"
        )
      ) {
        return;
      }


      const defaultData =
        JSON.parse(
          JSON.stringify(
            DEFAULTS
          )
        );


      saveData(
        defaultData
      );


      renderProjects();
      renderSkills();


      const msg =
        document.getElementById(
          "reset-msg"
        );


      msg.textContent =
        "✓ Reset to defaults.";

      msg.className =
        "form-msg success";


      setTimeout(
        () =>
          msg.textContent = "",
        3000
      );

    }
  );