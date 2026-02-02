// Dark mode toggle
const toggle = document.getElementById("themeToggle");
toggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  toggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

// Scroll reveal
const reveals = document.querySelectorAll(".reveal");
function revealOnScroll() {
  reveals.forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 100) {
      el.classList.add("active");
    }
  });
}
window.addEventListener("scroll", revealOnScroll);
revealOnScroll();

// PROJECT MODAL
const modal = document.getElementById("projectModal");
const titleEl = document.getElementById("modalTitle");
const descEl = document.getElementById("modalDesc");
const gitEl = document.getElementById("modalGit");

function openProject(title, desc, github) {
  titleEl.textContent = title;
  descEl.textContent = desc;

  if (github) {
    gitEl.style.display = "inline";
    gitEl.href = github;
  } else {
    gitEl.style.display = "none";
  }

  modal.classList.add("active");
}

function closeProject() {
  modal.classList.remove("active");
}

// Close project modal on outside click
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeProject();
});

// Toggle certifications dropdown
function toggleCerts() {
  const list = document.getElementById("certList");
  const arrow = document.getElementById("certArrow");

  list.classList.toggle("active");
  arrow.textContent = list.classList.contains("active") ? "▴" : "▾";
}

// Resume modal
function openResume() {
  document.getElementById("resumeModal").classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeResume() {
  document.getElementById("resumeModal").classList.remove("active");
  document.body.style.overflow = "";
}

// Close resume on outside click
document.getElementById("resumeModal").addEventListener("click", (e) => {
  if (e.target.id === "resumeModal") closeResume();
});

// Close resume on ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeResume();
});

// OPEN DOCUMENT (resume / certificates) — SINGLE SOURCE OF TRUTH
function openDoc(path) {
  const modal = document.getElementById("resumeModal");
  const frame = document.getElementById("docFrame");
  const download = document.getElementById("docDownload");

  frame.src = path;
  download.href = path;

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

// ---------- INTERACTIVE STARFIELD ----------
const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");

let w, h;
function resizeCanvas() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// ⭐ CONFIG
const STAR_COUNT = 300;
const MAX_REPEL_DIST = 140;
const REPEL_STRENGTH = 0.0635;
const RECOVERY_SPEED = 0.0101;

const stars = [];
const mouse = { x: w / 2, y: h / 2 };

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

// Create stars
for (let i = 0; i < STAR_COUNT; i++) {
  const x = Math.random() * w;
  const y = Math.random() * h;

  stars.push({
    x,
    y,
    baseX: x,
    baseY: y,
    r: Math.random() * 0.8 + 0.9,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    phase: Math.random() * Math.PI * 2
  });
}

function draw() {
  ctx.clearRect(0, 0, w, h);
  const t = Date.now();

  stars.forEach((s) => {
    // Organic drift
    s.x += s.vx + Math.sin(t * 0.0004 + s.phase) * 0.05;
    s.y += s.vy + Math.cos(t * 0.0004 + s.phase) * 0.05;

    // Cursor interaction
    const dx = s.x - mouse.x;
    const dy = s.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < MAX_REPEL_DIST) {
      const force = (MAX_REPEL_DIST - dist) / MAX_REPEL_DIST;
      s.x += dx * force * REPEL_STRENGTH;
      s.y += dy * force * REPEL_STRENGTH;
    }

    // Recovery
    s.x += (s.baseX - s.x) * RECOVERY_SPEED;
    s.y += (s.baseY - s.y) * RECOVERY_SPEED;

    // Wrap edges
    if (s.x < 0) s.x = w;
    if (s.x > w) s.x = 0;
    if (s.y < 0) s.y = h;
    if (s.y > h) s.y = 0;

    // Flicker
    const flicker = 0.5 + Math.sin(t * 0.0045 + s.phase) * 0.5;

    ctx.beginPath();
    ctx.fillStyle = `rgba(255,255,255,${0.3 + flicker * 0.6})`;
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(draw);
}

draw();
