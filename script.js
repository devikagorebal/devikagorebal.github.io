/**
 * G Devika Portfolio - Interactive Engine
 * Canvas Particle Mesh, ML Simulator, Nova Voice Engine, and Smooth UI Interactions
 */

document.addEventListener("DOMContentLoaded", () => {
  // -------------------------------------------------------------------------
  // 1. Audio FX Engine (Web Audio API Synthesizer - Zero External Assets)
  // -------------------------------------------------------------------------
  let soundEnabled = true;
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
  }

  function playTone(freq = 440, type = "sine", duration = 0.08, gainVal = 0.04) {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio context policy fallback
    }
  }

  const soundToggle = document.getElementById("soundToggle");
  if (soundToggle) {
    const iconOn = soundToggle.querySelector(".icon-sound-on");
    const iconOff = soundToggle.querySelector(".icon-sound-off");

    soundToggle.addEventListener("click", () => {
      soundEnabled = !soundEnabled;
      if (soundEnabled) {
        iconOn.classList.remove("hidden");
        iconOff.classList.add("hidden");
        playTone(600, "triangle", 0.12, 0.05);
        showToast("🔊 Audio effects enabled");
      } else {
        iconOn.classList.add("hidden");
        iconOff.classList.remove("hidden");
        showToast("🔇 Audio effects muted");
      }
    });
  }

  // -------------------------------------------------------------------------
  // 2. Interactive Background Canvas (Neural Particle Network)
  // -------------------------------------------------------------------------
  const canvas = document.getElementById("bgCanvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    });

    const mouse = { x: -1000, y: -1000, radius: 140 };
    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    window.addEventListener("mouseleave", () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.radius = Math.random() * 2 + 1;
        this.baseColor = Math.random() > 0.5 ? "rgba(99, 102, 241," : "rgba(6, 182, 212,";
        this.alpha = Math.random() * 0.4 + 0.2;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse avoidance/attraction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 2;
          this.y -= (dy / dist) * force * 2;
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${this.baseColor}${this.alpha})`;
        ctx.fill();
      }
    }

    let particles = [];
    function initParticles() {
      const count = Math.min(Math.floor((width * height) / 14000), 85);
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    }
    initParticles();

    function renderCanvas() {
      ctx.clearRect(0, 0, width, height);

      // Connect particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < 110) {
            const opacity = (1 - dist / 110) * 0.18;
            ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(renderCanvas);
    }
    renderCanvas();
  }

  // -------------------------------------------------------------------------
  // 3. Custom Cursor Follower with Smooth Interpolation
  // -------------------------------------------------------------------------
  const cursorDot = document.getElementById("cursorDot");
  const cursorRing = document.getElementById("cursorRing");

  if (cursorDot && cursorRing && window.innerWidth > 900) {
    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    function updateRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
      requestAnimationFrame(updateRing);
    }
    updateRing();

    const hoverables = document.querySelectorAll("a, button, input, .glass-card, .model-chip, .sugg-chip");
    hoverables.forEach((el) => {
      el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
      el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
    });
  }

  // -------------------------------------------------------------------------
  // 4. Scroll Progress Indicator & Navbar Active Link Observer
  // -------------------------------------------------------------------------
  const scrollProgress = document.getElementById("scrollProgress");
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", () => {
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (totalScroll > 0) {
      const scrolled = (window.scrollY / totalScroll) * 100;
      if (scrollProgress) scrollProgress.style.width = `${scrolled}%`;
    }

    // Active link highlighting
    let current = "";
    sections.forEach((sec) => {
      const top = sec.offsetTop - 180;
      if (window.scrollY >= top) {
        current = sec.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });

  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const navLinksContainer = document.getElementById("navLinks");
  if (mobileMenuBtn && navLinksContainer) {
    mobileMenuBtn.addEventListener("click", () => {
      navLinksContainer.classList.toggle("open");
      playTone(520, "sine", 0.05);
    });

    navLinksContainer.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        navLinksContainer.classList.remove("open");
      });
    });
  }

  // -------------------------------------------------------------------------
  // 5. Theme Toggle (Dark / Light) with Local Storage
  // -------------------------------------------------------------------------
  const themeToggle = document.getElementById("themeToggle");
  const root = document.documentElement;

  const savedTheme = localStorage.getItem("devika-theme") || "dark";
  root.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const curTheme = root.getAttribute("data-theme") || "dark";
      const newTheme = curTheme === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", newTheme);
      localStorage.setItem("devika-theme", newTheme);
      updateThemeIcon(newTheme);
      playTone(newTheme === "light" ? 750 : 380, "sine", 0.1, 0.05);
      showToast(newTheme === "light" ? "☀️ Light mode activated" : "🌙 Dark mode activated");
    });
  }

  function updateThemeIcon(theme) {
    if (!themeToggle) return;
    const sunIcon = themeToggle.querySelector(".icon-sun");
    const moonIcon = themeToggle.querySelector(".icon-moon");
    if (theme === "light") {
      sunIcon.classList.add("hidden");
      moonIcon.classList.remove("hidden");
    } else {
      sunIcon.classList.remove("hidden");
      moonIcon.classList.add("hidden");
    }
  }

  // -------------------------------------------------------------------------
  // 6. Dynamic Typing Subtitle Effect
  // -------------------------------------------------------------------------
  const roles = [
    "Python Full Stack Developer",
    "Django Web Architect",
    "Machine Learning Enthusiast",
    "Fast Learner"
  ];
  let rIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingEl = document.getElementById("typing");

  function typeRole() {
    if (!typingEl) return;
    const curRole = roles[rIndex];

    if (!isDeleting) {
      typingEl.textContent = curRole.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === curRole.length) {
        isDeleting = true;
        setTimeout(typeRole, 1800);
        return;
      }
    } else {
      typingEl.textContent = curRole.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        rIndex = (rIndex + 1) % roles.length;
        setTimeout(typeRole, 350);
        return;
      }
    }

    setTimeout(typeRole, isDeleting ? 38 : 75);
  }
  typeRole();

  // -------------------------------------------------------------------------
  // 7. Hero Code Playground Runner
  // -------------------------------------------------------------------------
  const runCodeBtn = document.getElementById("runCodeBtn");
  const outputText = document.getElementById("outputText");

  if (runCodeBtn && outputText) {
    runCodeBtn.addEventListener("click", () => {
      playTone(880, "triangle", 0.15, 0.06);
      outputText.textContent = "Executing devika.py...";
      outputText.style.color = "#CDCBD6";

      setTimeout(() => {
        playTone(1100, "sine", 0.2, 0.08);
        outputText.innerHTML = `<strong>Status 200 OK:</strong> G Devika is active! Ready to engineer full stack solutions.`;
        outputText.style.color = "#596235";
        launchConfetti(0.3);
        showToast("✨ devika.py executed successfully!");
      }, 550);
    });
  }

  // -------------------------------------------------------------------------
  // 8. Bento Numbers Counter & Scroll Reveal
  // -------------------------------------------------------------------------
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const duration = 1600;
    const start = performance.now();

    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const val = ease * target;
      el.textContent = val.toFixed(decimals);

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        el.textContent = target.toFixed(decimals);
      }
    }
    requestAnimationFrame(frame);
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        const counters = entry.target.querySelectorAll(".counter");
        counters.forEach(animateCounter);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(".reveal").forEach((sec) => revealObserver.observe(sec));

  // -------------------------------------------------------------------------
  // 9. Interactive Skills Category Filter Tabs
  // -------------------------------------------------------------------------
  const skillTabs = document.querySelectorAll(".skill-tab");
  const skillCards = document.querySelectorAll(".skill-card");

  skillTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      skillTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      playTone(480, "sine", 0.06);

      const filter = tab.dataset.filter;
      skillCards.forEach((card) => {
        if (filter === "all" || card.dataset.category === filter) {
          card.style.display = "block";
          card.style.opacity = "0";
          card.style.transform = "scale(0.95)";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "scale(1)";
          }, 40);
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // -------------------------------------------------------------------------
  // 10. Interactive Cinnamon ML Quality Simulator
  // -------------------------------------------------------------------------
  const sliderMoisture = document.getElementById("sliderMoisture");
  const sliderOil = document.getElementById("sliderOil");
  const sliderCoumarin = document.getElementById("sliderCoumarin");
  const sliderAsh = document.getElementById("sliderAsh");

  const valMoisture = document.getElementById("valMoisture");
  const valOil = document.getElementById("valOil");
  const valCoumarin = document.getElementById("valCoumarin");
  const valAsh = document.getElementById("valAsh");

  const predCard = document.getElementById("predictionCard");
  const predResult = document.getElementById("predResult");
  const predExplanation = document.getElementById("predExplanation");
  const confValue = document.getElementById("confValue");
  const confBar = document.getElementById("confBar");

  const probHigh = document.getElementById("probHigh");
  const probMed = document.getElementById("probMed");
  const probLow = document.getElementById("probLow");

  const resetSimBtn = document.getElementById("resetSimBtn");

  function calculateQuality() {
    if (!sliderMoisture) return;
    const moisture = parseFloat(sliderMoisture.value);
    const oil = parseFloat(sliderOil.value);
    const coumarin = parseFloat(sliderCoumarin.value);
    const ash = parseFloat(sliderAsh.value);

    valMoisture.textContent = `${moisture.toFixed(1)}%`;
    valOil.textContent = `${oil.toFixed(1)} ml/100g`;
    valCoumarin.textContent = `${coumarin.toFixed(1)} mg/kg`;
    valAsh.textContent = `${ash.toFixed(1)}%`;

    // Scoring Algorithm derived from cinnamon quality standards
    // High Quality Ceylon: Moisture < 12%, Oil >= 2.0 ml, Coumarin < 15 mg/kg, Ash < 5.0%
    let score = 0;
    if (moisture >= 8 && moisture <= 12) score += 25;
    else if (moisture < 14) score += 12;

    if (oil >= 2.4) score += 30;
    else if (oil >= 1.5) score += 18;
    else score += 5;

    if (coumarin <= 12) score += 30;
    else if (coumarin <= 25) score += 12;
    else score += 0; // High coumarin indicates Cassia or low grade

    if (ash <= 4.8) score += 15;
    else if (ash <= 6.5) score += 8;

    let grade = "HIGH QUALITY";
    let explanation = "Optimal low coumarin, abundant volatile essential oils, and balanced moisture reflect premium export-grade Ceylon cinnamon.";
    let borderColor = "#596235";
    let textColor = "#CDCBD6";
    let pH = 88, pM = 10, pL = 2;

    if (score >= 75) {
      grade = "HIGH QUALITY";
      pH = Math.min(Math.round(score * 1.05), 98);
      pM = Math.round((100 - pH) * 0.75);
      pL = 100 - pH - pM;
      borderColor = "#596235";
      textColor = "#CDCBD6";
      explanation = "Optimal low coumarin (<15 mg/kg), rich aromatic volatile oils (>2.5 ml), and low ash purity align with Grade-A Ceylon standards.";
    } else if (score >= 45) {
      grade = "MEDIUM QUALITY";
      pM = 65;
      pH = 22;
      pL = 13;
      borderColor = "#D96846";
      textColor = "#D96846";
      explanation = "Moderate volatile oils and mild chemical variance. Acceptable for culinary standard batches, but fails premium distillation criteria.";
    } else {
      grade = "LOW / REJECTED";
      pL = 78;
      pM = 18;
      pH = 4;
      borderColor = "#2F3020";
      textColor = "#CDCBD6";
      explanation = "Elevated coumarin levels or high moisture/ash ratios indicate either Cassia substitution or sample degradation.";
    }

    predResult.textContent = grade;
    predResult.style.color = textColor;
    predCard.style.borderColor = borderColor;
    predCard.style.boxShadow = `0 0 25px ${borderColor}40`;
    predExplanation.textContent = explanation;

    const topConf = Math.max(pH, pM, pL);
    confValue.textContent = `${topConf}.4%`;
    confBar.style.width = `${topConf}%`;
    confBar.style.backgroundColor = borderColor;

    probHigh.textContent = `${pH}%`;
    probMed.textContent = `${pM}%`;
    probLow.textContent = `${pL}%`;
  }

  [sliderMoisture, sliderOil, sliderCoumarin, sliderAsh].forEach((s) => {
    if (s) {
      s.addEventListener("input", () => {
        calculateQuality();
        playTone(300 + parseFloat(s.value) * 15, "sine", 0.03, 0.015);
      });
    }
  });

  if (resetSimBtn) {
    resetSimBtn.addEventListener("click", () => {
      sliderMoisture.value = 10.2;
      sliderOil.value = 2.8;
      sliderCoumarin.value = 8.5;
      sliderAsh.value = 4.1;
      calculateQuality();
      playTone(660, "sine", 0.08);
      showToast("🔄 Simulator reset to optimal Ceylon sample");
    });
  }

  // -------------------------------------------------------------------------
  // 11. Model Chips Comparison Inspector
  // -------------------------------------------------------------------------
  const modelChips = document.querySelectorAll(".model-chip");
  const inspectorName = document.getElementById("inspectorName");
  const inspectorAcc = document.getElementById("inspectorAcc");
  const inspectorDesc = document.getElementById("inspectorDesc");

  modelChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      modelChips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      playTone(540, "triangle", 0.08);

      if (inspectorName) inspectorName.textContent = chip.dataset.name;
      if (inspectorAcc) inspectorAcc.textContent = `Accuracy: ${chip.dataset.accuracy}`;
      if (inspectorDesc) inspectorDesc.textContent = chip.dataset.desc;
    });
  });

  // -------------------------------------------------------------------------
  // 12. Mini Nova Interactive Terminal Assistant & Voice Engine
  // -------------------------------------------------------------------------
  const novaForm = document.getElementById("terminalForm");
  const novaInput = document.getElementById("terminalInput");
  const terminalLog = document.getElementById("terminalLog");
  const voiceToggle = document.getElementById("voiceToggle");
  const audioWave = document.getElementById("audioWave");
  const clearTerminalBtn = document.getElementById("clearTerminalBtn");

  const knowledgeBase = {
    skills: "Devika's core strengths: Python (90%), OOP Design (85%), HTML5/CSS3 (80%), SQL & Relational DBs (75%), Django (70%), JavaScript ES6+ (65%), React.js (65%), plus NumPy, Pandas & Scikit-Learn.",
    projects: "Flagship projects: 1) Cinnamon Quality Classification (Django, ML model comparison, Auth) and 2) Nova AI Voice Assistant (Python OOP speech assistant).",
    cinnamon: "The Cinnamon Quality app predicts High, Medium, or Low grade using chemical test inputs like moisture, ash, and coumarin, benchmarked across 5 ML algorithms with 96.4% top accuracy.",
    nova: "Nova is a desktop speech intelligence assistant built with Python OOP architecture separating speech recognition, command dispatching, and custom GUI.",
    education: "Devika completed her BE in Computer Science and Engineering at Sampoorna Institute of Technology and Research (2022–2026) with an 8.66 CGPA.",
    cgpa: "Devika holds a stellar 8.66 CGPA in Computer Science Engineering at Sampoorna SITR.",
    contact: "You can email Devika directly at devikagorebalc@gmail.com, or connect on LinkedIn at linkedin.com/in/g-devika-36488130a.",
    hire: "Devika is actively available for entry-level Full Stack Developer roles in Bengaluru or remote! She learns fast, builds end-to-end, and solves problems methodically.",
    hello: "Hello there! I'm Nova. I can tell you about Devika's skills, projects, CGPA, certifications, or how to contact her.",
    experience: "Devika completed a Full Stack Internship developing the Cinnamon Quality ML platform, and earned a Python Full Stack Developer Certification from Destination Career."
  };

  function speakNova(text) {
    if (!voiceToggle || !voiceToggle.checked) return;
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.1;

    if (audioWave) audioWave.classList.add("speaking");

    utterance.onend = () => {
      if (audioWave) audioWave.classList.remove("speaking");
    };
    utterance.onerror = () => {
      if (audioWave) audioWave.classList.remove("speaking");
    };

    window.speechSynthesis.speak(utterance);
  }

  function handleNovaQuery(rawQuery) {
    const q = rawQuery.toLowerCase().trim();
    if (!q) return;

    // Append user message
    const userDiv = document.createElement("div");
    userDiv.className = "terminal-msg user-msg";
    userDiv.innerHTML = `<span class="msg-sender">You:</span><div class="msg-content">${escapeHTML(rawQuery)}</div>`;
    terminalLog.appendChild(userDiv);
    terminalLog.scrollTop = terminalLog.scrollHeight;

    playTone(400, "sine", 0.05);

    // Formulate response
    let reply = "I didn't quite catch that. Try asking about: 'skills', 'projects', 'education', 'cinnamon', 'cgpa', or 'contact'!";

    for (const key of Object.keys(knowledgeBase)) {
      if (q.includes(key)) {
        reply = knowledgeBase[key];
        break;
      }
    }

    if (q.includes("hi") || q.includes("hey")) reply = knowledgeBase.hello;
    if (q.includes("job") || q.includes("work")) reply = knowledgeBase.hire;
    if (q.includes("email") || q.includes("mail")) reply = knowledgeBase.contact;
    if (q.includes("school") || q.includes("college")) reply = knowledgeBase.education;

    // Simulate thinking delay
    setTimeout(() => {
      const novaDiv = document.createElement("div");
      novaDiv.className = "terminal-msg nova-msg";
      novaDiv.innerHTML = `<span class="msg-sender">Nova:</span><div class="msg-content">${reply}</div>`;
      terminalLog.appendChild(novaDiv);
      terminalLog.scrollTop = terminalLog.scrollHeight;

      playTone(720, "triangle", 0.1, 0.04);
      speakNova(reply);

      if (q.includes("hire") || q.includes("cgpa")) {
        launchConfetti(0.2);
      }
    }, 280);
  }

  if (novaForm && novaInput) {
    novaForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const val = novaInput.value;
      novaInput.value = "";
      handleNovaQuery(val);
    });
  }

  // Suggestion chips
  document.querySelectorAll(".sugg-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const query = chip.dataset.query;
      handleNovaQuery(query);
    });
  });

  if (clearTerminalBtn) {
    clearTerminalBtn.addEventListener("click", () => {
      terminalLog.innerHTML = `
        <div class="terminal-msg nova-msg">
          <span class="msg-sender">Nova:</span>
          <div class="msg-content">Terminal cleared. Ready for your questions!</div>
        </div>
      `;
      playTone(350, "sine", 0.05);
    });
  }

  // -------------------------------------------------------------------------
  // 13. Copy Email to Clipboard & Toast Notifications
  // -------------------------------------------------------------------------
  const copyButtons = document.querySelectorAll(".copy-email-btn");
  copyButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const email = btn.dataset.email || "devikagorebalc@gmail.com";
      navigator.clipboard.writeText(email).then(() => {
        playTone(900, "sine", 0.1, 0.05);
        showToast(`📋 Copied "${email}" to clipboard!`);
        launchConfetti(0.25);
      }).catch(() => {
        showToast(`Email: ${email}`);
      });
    });
  });

  function showToast(message) {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("toast-out");
      setTimeout(() => toast.remove(), 350);
    }, 2800);
  }

  // -------------------------------------------------------------------------
  // 14. Bengaluru Live Clock in Footer
  // -------------------------------------------------------------------------
  const liveClock = document.getElementById("liveClock");
  function updateClock() {
    if (!liveClock) return;
    const now = new Date();
    const options = {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    };
    liveClock.textContent = now.toLocaleTimeString("en-IN", options);
  }
  updateClock();
  setInterval(updateClock, 1000);

  // -------------------------------------------------------------------------
  // 15. Smooth Back to Top
  // -------------------------------------------------------------------------
  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      playTone(550, "sine", 0.08);
    });
  }

  // -------------------------------------------------------------------------
  // 16. Pure Canvas Confetti Burst Engine
  // -------------------------------------------------------------------------
  function launchConfetti(scale = 0.5) {
    const cCanvas = document.getElementById("confettiCanvas");
    if (!cCanvas) return;
    const cCtx = cCanvas.getContext("2d");
    cCanvas.width = window.innerWidth;
    cCanvas.height = window.innerHeight;

    const colors = ["#CDCBD6", "#D96846", "#596235", "#2F3020", "#D96846", "#CDCBD6"];
    const count = Math.floor(70 * scale);
    const pieces = [];

    for (let i = 0; i < count; i++) {
      pieces.push({
        x: cCanvas.width / 2 + (Math.random() - 0.5) * 300,
        y: cCanvas.height * 0.45,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 1.2) * 14,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12,
        opacity: 1
      });
    }

    let frameId;
    function renderConfetti() {
      cCtx.clearRect(0, 0, cCanvas.width, cCanvas.height);
      let alive = false;

      pieces.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.45; // gravity
        p.rotation += p.rotSpeed;
        p.opacity -= 0.014;

        if (p.opacity > 0) {
          alive = true;
          cCtx.save();
          cCtx.translate(p.x, p.y);
          cCtx.rotate((p.rotation * Math.PI) / 180);
          cCtx.fillStyle = p.color;
          cCtx.globalAlpha = Math.max(p.opacity, 0);
          cCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
          cCtx.restore();
        }
      });

      if (alive) {
        frameId = requestAnimationFrame(renderConfetti);
      } else {
        cCtx.clearRect(0, 0, cCanvas.width, cCanvas.height);
        cancelAnimationFrame(frameId);
      }
    }
    renderConfetti();
  }

  // -------------------------------------------------------------------------
  // Helper: HTML escaping for safe terminal output
  // -------------------------------------------------------------------------
  function escapeHTML(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Run initial simulator compute
  calculateQuality();
});
