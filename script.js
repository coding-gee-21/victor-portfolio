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
    document.querySelector(link.getAttribute('href')).scrollIntoView({behavior:'smooth'});
    document.querySelectorAll('.sidebar a').forEach(a => a.classList.remove('active'));
    link.classList.add('active');
    if (window.innerWidth <= 768) hamburger.click();
  });
});

// Neural Background
const canvas = document.getElementById('neuralCanvas');
const ctx = canvas.getContext('2d');
canvas.width = innerWidth; canvas.height = innerHeight;
let nodes = [], pulses = [];

class Node {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 3 + 1;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }
}

class Pulse {
  constructor(x, y, tx, ty) {
    this.x = x; this.y = y; this.tx = tx; this.ty = ty;
    this.progress = 0; this.speed = 0.02 + Math.random() * 0.02;
  }
  update() { this.progress += this.speed; }
  done() { return this.progress >= 1; }
}

for (let i = 0; i < 100; i++) nodes.push(new Node());

function connectNodes() {
  nodes.forEach(n => {
    n.connections = [];
    nodes.forEach(o => {
      if (n !== o && Math.hypot(n.x - o.x, n.y - o.y) < 200) n.connections.push(o);
    });
  });
}

function sendPulse() {
  if (nodes.length < 2) return;
  const a = nodes[Math.floor(Math.random() * nodes.length)];
  const b = nodes[Math.floor(Math.random() * nodes.length)];
  if (a !== b) pulses.push(new Pulse(a.x, a.y, b.x, b.y));
}

function animate() {
  ctx.fillStyle = 'rgba(0,0,0,0.03)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  nodes.forEach(node => {
    node.update();
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
    p.update();
    if (p.done()) return false;
    const x = p.x + (p.tx - p.x) * p.progress;
    const y = p.y + (p.ty - p.y) * p.progress;
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,215,0,0.8)';
    ctx.shadowBlur = 25;
    ctx.shadowColor = 'gold';
    ctx.fill();
    return true;
  });
  requestAnimationFrame(animate);
}
connectNodes();
setInterval(connectNodes, 10000);
setInterval(sendPulse, 400);
window.addEventListener('resize', () => { canvas.width = innerWidth; canvas.height = innerHeight; });
animate();

// Holographic Photo
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

// Skills Matrix
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

// Counters
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

// [All previous code: sidebar, neural background, holo photo, skills matrix, counters — unchanged]

// DYNAMIC .MD + FIXED GALLERY
const modal = document.getElementById('projectModal');
const modalBody = document.getElementById('modalBody');
const closeBtn = document.querySelector('.modal-close');

const projectsData = {
  clock: {
    title: "DS1302 Precision Digital Clock + Alarm",
    video: "assets/clockvideo.mp4",
    thumb: "assets/clock.jpg",
    gallery: ["assets/clock.jpg"], // ← Only one photo
    tiktok: "https://vm.tiktok.com/ZMA3SHtr2/",
    code: "sketch9clockdisplay.ino",
    docFile: "assets/Arduino RTC Alarm Clock Project.md"
  },
  snake: {
    title: "Sound-Reactive Snake Lights System",
    video: "assets/snakevideo1.mp4",
    thumb: "assets/snake1.jpg",
    gallery: ["assets/snake1.jpg", "assets/snake2.jpg"], // ← Your two snake photos
    tiktok: "https://vm.tiktok.com/ZMA3SXw5S/",
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
      } else {
        docHTML = "<p style='color:red;'>Documentation not found.</p>";
      }
    } catch (err) {
      docHTML = "<p style='color:red;'>Error loading file.</p>";
    }

    modalBody.innerHTML = `
      <h2 style="text-align:center;color:gold;font-size:3rem;margin-bottom:20px;">${p.title}</h2>
      
      <video controls poster="${p.thumb}" style="width:100%;max-width:800px;max-height:480px;border-radius:15px;box-shadow:0 0 40px #0ff;margin:30px auto;display:block;">
        <source src="${p.video}" type="video/mp4">
      </video>
      
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