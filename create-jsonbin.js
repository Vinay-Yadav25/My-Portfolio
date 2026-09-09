// create-jsonbin.js
// Creates a JSONBin for the Vinay Portfolio CMS

const JSONBIN_API = "https://api.jsonbin.io/v3/b";

// ----------------------------------------------------
// PUT YOUR JSONBIN MASTER KEY IN THE ENVIRONMENT
// Do NOT put your real key directly in this file.
// ----------------------------------------------------
const API_KEY = process.env.JSONBIN_MASTER_KEY;

if (!API_KEY) {
  console.error("❌ JSONBIN_MASTER_KEY is not set.");
  console.log("");
  console.log("Windows PowerShell:");
  console.log('$env:JSONBIN_MASTER_KEY="YOUR_JSONBIN_MASTER_KEY"');
  console.log("node create-jsonbin.js");
  process.exit(1);
}

// ----------------------------------------------------
// Initial Portfolio Data
// ----------------------------------------------------
const portfolioData = {
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

// ----------------------------------------------------
// Create JSONBin
// ----------------------------------------------------
async function createBin() {
  try {
    console.log("Creating JSONBin...");
    console.log("");

    const response = await fetch(JSONBIN_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": API_KEY,
        "X-Bin-Private": "true",
        "X-Bin-Name": "Vinay Portfolio CMS"
      },
      body: JSON.stringify(portfolioData)
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("❌ JSONBin creation failed:");
      console.error(result);
      process.exit(1);
    }

    console.log("✅ JSONBin created successfully!");
    console.log("");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("BIN ID:");
    console.log(result.metadata.id);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("");
    console.log("Save this Bin ID.");
    console.log("You will need it in your Admin CMS.");
    console.log("");
    console.log("Data stored:");
    console.log(`Projects: ${result.record.projects.length}`);
    console.log(`Skills:   ${result.record.skills.length}`);

  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

createBin();