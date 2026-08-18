/**
 * SPIDERLEARN // CORE JAVASCRIPT ENGINE
 * Tab Switching, 2x2 Interactive Charts, Courses Filter & Modals
 */

// Courses Data Store
const COURSES_DATA = [
  {
    id: 'course-1',
    title: 'Data Structures Refresher',
    category: 'frontend',
    categoryLabel: 'Algorithms & Logic',
    nextLesson: 'Graph traversals',
    progress: 18,
    status: 'Paused',
    statusClass: 'pill-paused',
    fillClass: 'fill-gray',
    xp: 750,
    mentor: 'Peter Parker',
    desc: 'Master graph traversals, binary search trees, and dynamic programming with spider-suit optimization.'
  },
  {
    id: 'course-2',
    title: 'Full-Stack React & Next.js 15 WebSockets',
    category: 'backend',
    categoryLabel: 'Full-Stack',
    nextLesson: 'Real-time WebSocket streaming',
    progress: 34,
    status: 'In progress',
    statusClass: 'pill-progress',
    fillClass: 'fill-cyan',
    xp: 1200,
    mentor: 'Miles Morales',
    desc: 'High-frequency Server Components, real-time WebSockets, and distributed Postgres state.'
  },
  {
    id: 'course-3',
    title: 'Applied Machine Learning',
    category: 'ai',
    categoryLabel: 'AI & Deep Learning',
    nextLesson: 'Regularization in practice',
    progress: 74,
    status: 'Due Today',
    statusClass: 'pill-due',
    fillClass: 'fill-gold',
    xp: 1600,
    mentor: 'Gwen Stacy (Ghost-Spider)',
    desc: 'Deep learning models with PyTorch, Vision Transformers, and temporal threat predictive math.'
  },
  {
    id: 'course-4',
    title: 'Venom Protocol: Offensive Cybersecurity',
    category: 'security',
    categoryLabel: 'Security',
    nextLesson: 'Memory vulnerability patching',
    progress: 0,
    status: 'Not Started',
    statusClass: 'pill-paused',
    fillClass: 'fill-gray',
    xp: 1450,
    mentor: 'Agent Venom',
    desc: 'Penetration testing, buffer overflow exploits, and zero-trust cloud network defense.'
  },
  {
    id: 'course-5',
    title: 'Systems Design Foundations',
    category: 'multiverse',
    categoryLabel: 'Distributed Systems',
    nextLesson: 'Caching strategies',
    progress: 42,
    status: 'In progress',
    statusClass: 'pill-progress',
    fillClass: 'fill-cyan',
    xp: 1900,
    mentor: 'Miguel O\'Hara (2099)',
    desc: 'High-scale caching architectures, Redis clusters, and distributed consensus algorithms.'
  }
];

let activeModalId = null;

// ==========================================================================
// 1. Sidebar Tab Switching
// ==========================================================================
window.switchTab = function(tabName) {
  // Update sidebar active state
  document.querySelectorAll('.nav-item').forEach((btn) => btn.classList.remove('active'));
  document.getElementById(`nav-${tabName}`)?.classList.add('active');

  // Update main content views
  document.querySelectorAll('.tab-view').forEach((view) => view.classList.remove('active'));
  document.getElementById(`view-${tabName}`)?.classList.add('active');

  // Close mobile sidebar
  document.getElementById('sidebar')?.classList.remove('mobile-open');

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (tabName === 'courses') {
    renderCourses();
  } else if (tabName === 'learning') {
    renderMyLearning();
  }
};

// ==========================================================================
// 2. Interactive Charts & Hover Tooltips
// ==========================================================================
function initCharts() {
  document.querySelectorAll('.chart-dot').forEach((dot) => {
    dot.addEventListener('mouseenter', () => {
      showSpiderToast(`📈 ${dot.dataset.tip}`);
    });
  });

  document.querySelectorAll('.bar-pillar').forEach((bar) => {
    bar.addEventListener('mouseenter', () => {
      showSpiderToast(`📊 ${bar.dataset.tip}`);
    });
  });
}

// ==========================================================================
// 3. Render Courses Directory & Filter
// ==========================================================================
function renderCourses() {
  const container = document.getElementById('coursesGrid');
  if (!container) return;

  const searchQuery = (document.getElementById('courseSearchInput')?.value || '').toLowerCase();
  const activeCatBtn = document.querySelector('.cat-btn.active');
  const activeCat = activeCatBtn ? activeCatBtn.dataset.cat : 'all';

  const filtered = COURSES_DATA.filter((c) => {
    if (activeCat !== 'all' && c.category !== activeCat) return false;
    if (searchQuery && !c.title.toLowerCase().includes(searchQuery) && !c.desc.toLowerCase().includes(searchQuery)) return false;
    return true;
  });

  document.getElementById('coursesCountBadge').textContent = `${filtered.length} Courses`;

  container.innerHTML = filtered.map((c) => `
    <div class="course-card">
      <div style="display:flex; justify-content:space-between;">
        <span class="card-category-tag">${c.categoryLabel}</span>
        <span class="status-pill ${c.statusClass}">${c.status}</span>
      </div>
      <h3 class="card-title" onclick="openCourseModal('${c.id}')">${c.title}</h3>
      <p class="card-desc">${c.desc}</p>
      <div style="margin-top:auto; padding-top:12px; border-top:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center;">
        <span style="font-size:0.75rem; color:var(--text-muted);">👨‍🏫 ${c.mentor}</span>
        <button class="btn-spider-sm btn-primary" onclick="openCourseModal('${c.id}')">View Syllabus</button>
      </div>
    </div>
  `).join('');
}

function renderMyLearning() {
  const container = document.getElementById('myLearningList');
  if (!container) return;

  container.innerHTML = COURSES_DATA.map((c) => `
    <div class="course-progress-card" style="margin-bottom:14px;" onclick="openCourseModal('${c.id}')">
      <div class="cp-top">
        <div>
          <h4 class="cp-title">${c.title}</h4>
          <span class="cp-next">Next: ${c.nextLesson}</span>
        </div>
        <span class="status-pill ${c.statusClass}">${c.status}</span>
      </div>
      <div class="cp-track">
        <div class="cp-fill ${c.fillClass}" style="width: ${c.progress}%;"></div>
      </div>
    </div>
  `).join('');
}

// ==========================================================================
// 4. Modal Handlers
// ==========================================================================
window.openCourseModal = function(courseId) {
  const course = COURSES_DATA.find((c) => c.id === courseId);
  if (!course) return;

  activeModalId = courseId;
  const overlay = document.getElementById('courseModalOverlay');
  document.getElementById('modalTag').textContent = course.categoryLabel.toUpperCase();
  document.getElementById('modalTitle').textContent = course.title;
  document.getElementById('modalMeta').textContent = `👨‍🏫 ${course.mentor} • 🏆 +${course.xp} XP • Status: ${course.status}`;
  document.getElementById('modalDesc').textContent = course.desc;

  document.getElementById('modalSyllabus').innerHTML = `
    <ul style="padding-left: 20px; line-height: 1.8;">
      <li>Module 1: Foundations & Core Concepts (Completed)</li>
      <li>Module 2: ${course.nextLesson} (Current)</li>
      <li>Module 3: Advanced Optimization & Production Deployment</li>
      <li>Module 4: Stark Capstone Evaluation</li>
    </ul>
  `;

  overlay?.classList.remove('hidden');
};

window.closeCourseModal = function() {
  document.getElementById('courseModalOverlay')?.classList.add('hidden');
};

window.handleEnrollCourse = function() {
  closeCourseModal();
  showSpiderToast('🎉 Mission Progress saved! Suit telemetry updated.');
};

// ==========================================================================
// 5. Toast Notifications
// ==========================================================================
function showSpiderToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'spider-toast';
  toast.innerHTML = `<span>🕷️</span> <div>${message}</div>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.4s ease';
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

// ==========================================================================
// 6. Spider Web Canvas
// ==========================================================================
function initWebCanvas() {
  const canvas = document.getElementById('webCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initNodes();
  });

  const nodes = [];
  const nodeCount = Math.min(Math.floor((width * height) / 24000), 40);
  const mouse = { x: null, y: null, radius: 120 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function initNodes() {
    nodes.length = 0;
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 1.5 + 1,
        color: Math.random() > 0.6 ? '#FF2A54' : '#00D2FF'
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < nodes.length; i++) {
      const p = nodes[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      for (let j = i + 1; j < nodes.length; j++) {
        const p2 = nodes[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(226, 54, 54, ${0.15 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  initNodes();
  draw();
}

// ==========================================================================
// 7. Load & Event Listeners
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initWebCanvas();
  initCharts();

  // Mobile menu toggle
  document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
    document.getElementById('sidebar')?.classList.toggle('mobile-open');
  });

  // Category filter clicks
  document.querySelectorAll('.cat-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.cat-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      renderCourses();
    });
  });

  // Search input debouncer
  document.getElementById('courseSearchInput')?.addEventListener('input', () => {
    renderCourses();
  });

  // Modal overlay click to dismiss
  document.getElementById('courseModalOverlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'courseModalOverlay') closeCourseModal();
  });
});
