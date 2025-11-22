// === FULL FINAL SCRIPT.JS — MOBILE-OPTIMIZED + DYNAMIC .MD + VIDEO FIX ===

// Sidebar & Navigation
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  sidebar.classList.toggle('active');
  overlay.classList.toggle('active');
});
overlay.addEventListener('click', () => {
  hamburger.classList.remove('active');
  sidebar.classList.remove('active');
  overlay.classList.remove('active');
});
document.querySelectorAll('.sidebar a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(link.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    document.querySelectorAll('.sidebar a').forEach(a => a.classList.remove('active'));
    link.classList.add('active');
    if (window.innerWidth <= 768) hamburger.click();
  });
});

// === OPTIMIZED NEURAL BACKGROUND (60 FPS on desktop, 30 FPS on mobile) ===
const canvas = document.getElementById('neuralCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const nodeCount = isMobile ? 40 : 80;
const nodes = [];
const pulses = [];

for (let i = 0; i < nodeCount; i++) {
  nodes.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 3 + 1,
    vx: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.5),
    vy: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.5)
  });
}

function connectNodes() {
  nodes.forEach(n => n.connections = []);
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
      if (dist < 180) nodes[i].connections.push(nodes[j]);
    }
  }
}

function sendPulse() {
  if (nodes.length < 2) return;
  const a = nodes[Math.floor(Math.random() * nodes.length)];
  const b = nodes[Math.floor(Math.random() * nodes.length)];
  if (a !== b) pulses.push({ x: a.x, y: a.y, tx: b.x, ty: b.y, progress: 0, speed: 0.025 });
}

let lastTime = 0;
const fps = isMobile ? 30 : 60;
const interval = 1000 / fps;

function animate(time) {
  if (!lastTime) lastTime = time;
  const delta = time - lastTime;
  if (delta > interval) {
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    nodes.forEach(node => {
      node.x += node.vx; node.y += node.vy;
      if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
      if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

      node.connections.forEach(conn => {
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(conn.x, conn.y);
        ctx.strokeStyle = 'rgba(0,255,255,0.15)';
        ctx.stroke();
      });

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
      ctx.fillStyle = '#0ff';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#0ff';
      ctx.fill();
    });

    pulses = pulses.filter(p => {
      p.progress += p.speed;
      if (p.progress >= 1) return false;
      const x = p.x + (p.tx - p.x) * p.progress;
      const y = p.y + (p.ty - p.y) * p.progress;
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,215,0,0.9)';
      ctx.shadowBlur = 25;
      ctx.shadowColor = 'gold';
      ctx.fill();
      return true;
    });

    lastTime = time - (delta % interval);
  }
  requestAnimationFrame(animate);
}
connectNodes();
setInterval(connectNodes, 12000);
setInterval(sendPulse, isMobile ? 600 : 300);
requestAnimationFrame(animate);

// === HOLOGRAPHIC PORTRAIT ===
const holoCanvas = document.getElementById('holoCanvas');
const hctx = holoCanvas.getContext('2d');
holoCanvas.width = 300; holoCanvas.height = 400;
function drawHolo() {
  hctx.clearRect(0, 0, 300, 400);
  const t = Date.now() * 0.001;
  hctx.strokeStyle = '#0ff'; hctx.lineWidth = 2; hctx.shadowBlur = 20; hctx.shadowColor = '#0ff';
  for (let i = 0; i < 3; i++) {
    hctx.globalAlpha = 0.3 + i * 0.15;
    const o = i * 12 * Math.sin(t + i);
    hctx.strokeRect(10 + o, 10 + o, 280 - o * 2, 380 - o * 2);
  }
  requestAnimationFrame(drawHolo);
}
drawHolo();

// === SKILLS MATRIX ===
const skillsCanvas = document.getElementById('skillsCanvas');
const sctx = skillsCanvas.getContext('2d');
let skillNodes = [];
const skills = ["Basic Household Wiring", "Arduino Programming", "Web Development", "AutoCAD", "Troubleshooting Computer Hardware", "PCB Design"];
for (let i = 0; i < skills.length; i++) {
  skillNodes.push({
    x: Math.random() * skillsCanvas.width,
    y: Math.random() * skillsCanvas.height,
    label: skills[i],
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4
  });
}
function animateSkills() {
  sctx.fillStyle = 'rgba(0,0,0,0.1)';
  sctx.fillRect(0, 0, skillsCanvas.width, skillsCanvas.height);
  skillNodes.forEach(n => {
    n.x += n.vx; n.y += n.vy;
    if (n.x < 50 || n.x > skillsCanvas.width - 50) n.vx *= -1;
    if (n.y < 50 || n.y > skillsCanvas.height - 50) n.vy *= -1;
    sctx.fillStyle = '#0ff';
    sctx.font = '18px Rajdhani';
    sctx.shadowBlur = 10;
    sctx.shadowColor = '#0ff';
    sctx.fillText(n.label, n.x, n.y);
  });
  requestAnimationFrame(animateSkills);
}
animateSkills();

// === COUNTERS ===
document.querySelectorAll('.counter').forEach(c => {
  const update = () => {
    const t = +c.dataset.target;
    const count = +c.innerText;
    const inc = t / 200;
    if (count < t) {
      c.innerText = Math.ceil(count + inc);
      setTimeout(update, 20);
    } else {
      c.innerText = t === 999 ? '∞' : t + (t > 100 ? '+' : '');
    }
  };
  new IntersectionObserver(e => { if (e[0].isIntersecting) update(); }, { threshold: 0.5 }).observe(c.parentElement);
});

// === FULL FINAL SCRIPT.JS — ALL BUGS FIXED ===

// [All previous code unchanged: sidebar, neural background, holo photo, skills matrix, counters — keep exactly as before]

// === DYNAMIC .MD + CORRECT VIDEOS & TIKTOK LINKS ===
const modal = document.getElementById('projectModal');
const modalBody = document.getElementById('modalBody');
const closeBtn = document.querySelector('.modal-close');

const projectsData = {
  clock: {
    title: "DS1302 Precision Digital Clock + Alarm",
    video: "assets/clockvideo.mp4",
    thumb: "assets/clock.jpg",
    gallery: ["assets/clock.jpg"],
    tiktok: "https://vm.tiktok.com/ZMA3SXw5S/",  // ← Correct Clock TikTok
    code: "sketch9clockdisplay.ino",
    docFile: "assets/Arduino RTC Alarm Clock Project.md"
  },
  snake: {
    title: "Sound-Reactive Snake Lights System",
    video: ["assets/snakevideo1.mp4", "assets/snakevideo2.mp4"],  // ← BOTH videos
    thumb: "assets/snake1.jpg",
    gallery: ["assets/snake1.jpg", "assets/snake2.jpg"],
    tiktok: "https://vm.tiktok.com/ZMA3SHtr2/",  // ← Correct Snake Lights TikTok
    code: "Snakelights_and_mic_module_code2.ino",
    docFile: "assets/Sound Sensor Integrated Snake light.md"
  }
};

document.querySelectorAll('.project-holo-card').forEach(card => {
  card.addEventListener('click', async () => {
    const p = projectsData[card.dataset.project];

    let docHTML = "<p>Loading documentation...</p>";
    try {
      const response = await fetch(p.docFile);
      if (response.ok) {
        const markdown = await response.text();
        docHTML = markdown
          .replace(/^### (.*$)/gm, '<h4 style="color:gold;margin:20px 0;">$1</h4>')
          .replace(/^## (.*$)/gm, '<h3 style="color:gold;margin:25px 0;">$1</h3>')
          .replace(/^# (.*$)/gm, '<h2 style="color:gold;margin:30px 0;">$1</h2>')
          .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#0ff;">$1</strong>')
          .replace(/\*(.*?)\*/g, '<em style="color:#0ff;">$1</em>')
          .replace(/^- (.*$)/gm, '<span style="color:#0ff;">• </span>$1<br>')
          .replace(/\n/g, '<br>');
      }
    } catch (err) {
      docHTML = "<p style='color:red;'>Error loading documentation.</p>";
    }

    // Handle single video or multiple videos
    let videoHTML = "";
    if (Array.isArray(p.video)) {
      p.video.forEach((vid, index) => {
        videoHTML += `
          <video controls playsinline preload="metadata" poster="${p.thumb}" style="width:100%;max-width:800px;max-height:480px;border-radius:15px;box-shadow:0 0 40px #0ff;margin:30px auto;display:block;">
            <source src="${vid}" type="video/mp4">
          </video>`;
      });
    } else {
      videoHTML = `
        <video controls playsinline preload="metadata" poster="${p.thumb}" style="width:100%;max-width:800px;max-height:480px;border-radius:15px;box-shadow:0 0 40px #0ff;margin:30px auto;display:block;">
          <source src="${p.video}" type="video/mp4">
        </video>`;
    }

    modalBody.innerHTML = `
      <h2 style="text-align:center;color:gold;font-size:3rem;margin-bottom:20px;">${p.title}</h2>
      
      ${videoHTML}
      
      <div style="text-align:center;margin:20px 0;">
        <a href="${p.tiktok}" target="_blank" class="cyber-btn large">View Original on TikTok ↗</a>
      </div>
      
      <div class="gallery-carousel">
        ${p.gallery.map(img => `<img src="${img}" alt="Project photo">`).join('')}
      </div>
      
      <div class="doc-terminal">${docHTML}</div>
      
      <div style="text-align:center;margin:40px 0;">
        <a href="assets/${p.code}" download class="cyber-btn large">⬇ Download ${p.code}</a>
      </div>
      
      <p style="text-align:center;color:#0ff;font-size:1.4rem;">⚡ Open Source • Fork • Improve • Share ⚡</p>
    `;
    modal.classList.add('active');
  });
});

closeBtn.onclick = () => modal.classList.remove('active');
modal.onclick = e => { if (e.target === modal) modal.classList.remove('active'); };
closeBtn.onclick = () => modal.classList.remove('active');
modal.onclick = e => { if (e.target === modal) modal.classList.remove('active'); };

// Resize handler
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
