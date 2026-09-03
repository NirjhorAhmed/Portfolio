/**
 * "Hacking Through The System" Cyberspace Engine
 * Sufi Mahbub Ahmed - Cybersecurity Portfolio
 * Deep endless cyber-breach void, terminal injection logs,
 * root privilege escalation streams, and high-speed data penetration.
 * (No central blue light - pure dark cyberspace breach aesthetic)
 */

(function () {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let width, height;
  let cx, cy;
  let targetCx, targetCy;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 3D Projection Setup
  const FOCAL_LENGTH = 340;
  const DEPTH = 2400;
  const TUNNEL_WIDTH = 540;
  const TUNNEL_HEIGHT = 290;

  let baseSpeed = prefersReducedMotion ? 0 : 6.2;
  let currentSpeed = baseSpeed;
  let scrollBoost = 0;
  let globalTime = 0;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    cx = width / 2;
    cy = height / 2;
    targetCx = cx;
    targetCy = cy;
  }

  // =========================================================================
  // 1. Live Hacking & Cyber Penetration Stream Logs
  // =========================================================================
  const HACK_LOGS = [
    { text: '> INJECTING_PAYLOAD // OK', type: 'success' },
    { text: '> BYPASSING_FIREWALL // 100%', type: 'success' },
    { text: '> PRIVILEGE_ESCALATION [ROOT]', type: 'root' },
    { text: '> IUT_SEC_NET // ROOT_ACCESS', type: 'root' },
    { text: '> SYS_AUTH // BREACH_CONFIRMED', type: 'alert' },
    { text: '> DECRYPTING_HASH // 0x7F8B92', type: 'info' },
    { text: '> PACKET_SNIFFER // INTERCEPTING', type: 'info' },
    { text: '> MEMORY_INJECTION // 0x004000', type: 'info' },
    { text: '> MAINFRAME // ROOT_SHELL_OPEN', type: 'root' },
    { text: '> EXPLOIT::BUFFER_OVERFLOW [OK]', type: 'success' },
    { text: '> PORT_SCAN::STEALTH_ACK [443]', type: 'info' },
    { text: '> KERNEL_HOOK // ATTACHED', type: 'success' }
  ];

  const TAG_COUNT = 16;
  let hackTags = [];

  class HackingTag {
    constructor(customZ) {
      this.reset(customZ);
    }

    reset(customZ = null) {
      // Distributed across peripheral quadrants
      const quadrant = Math.floor(Math.random() * 4);
      if (quadrant === 0) { // Top Left
        this.x = -240 - Math.random() * 340;
        this.y = -140 - Math.random() * 160;
      } else if (quadrant === 1) { // Top Right
        this.x = 240 + Math.random() * 340;
        this.y = -140 - Math.random() * 160;
      } else if (quadrant === 2) { // Bottom Left
        this.x = -240 - Math.random() * 340;
        this.y = 140 + Math.random() * 160;
      } else { // Bottom Right
        this.x = 240 + Math.random() * 340;
        this.y = 140 + Math.random() * 160;
      }

      this.z = customZ !== null ? customZ : (DEPTH - Math.random() * 180);
      this.data = HACK_LOGS[Math.floor(Math.random() * HACK_LOGS.length)];
      this.speedMult = 1.0 + Math.random() * 0.4;
    }

    update(speed) {
      this.z -= speed * this.speedMult;
      if (this.z <= 25) {
        this.reset();
      }
    }

    draw() {
      if (this.z <= 35) return;
      const scale = FOCAL_LENGTH / this.z;
      const px = cx + this.x * scale;
      const py = cy + this.y * scale;

      const depthFactor = 1 - (this.z / DEPTH);
      const alpha = Math.min(0.95, Math.max(0, depthFactor * 0.98));

      if (alpha <= 0.02) return;

      const fontSize = Math.max(7.5, 13.5 * scale);
      ctx.save();
      ctx.font = `600 ${fontSize}px "JetBrains Mono", monospace`;

      let mainColor, dotColor, glowColor;
      if (this.data.type === 'root' || this.data.type === 'success') {
        mainColor = `rgba(0, 255, 136, ${alpha * 0.95})`;
        dotColor = `rgba(0, 255, 136, ${alpha})`;
        glowColor = '#00ff88';
      } else if (this.data.type === 'alert') {
        mainColor = `rgba(255, 51, 102, ${alpha * 0.95})`;
        dotColor = `rgba(255, 51, 102, ${alpha})`;
        glowColor = '#ff3366';
      } else {
        mainColor = `rgba(0, 240, 255, ${alpha * 0.95})`;
        dotColor = `rgba(0, 240, 255, ${alpha})`;
        glowColor = '#00f0ff';
      }

      // Terminal Prompt Indicator Dot
      const dotRadius = Math.max(1.8, 3.5 * scale);
      ctx.fillStyle = dotColor;
      ctx.shadowBlur = scale > 0.3 ? 8 : 0;
      ctx.shadowColor = glowColor;
      ctx.beginPath();
      ctx.arc(px - 10 * scale, py - (fontSize * 0.35), dotRadius, 0, Math.PI * 2);
      ctx.fill();

      // Hacker Terminal Log String
      ctx.fillStyle = mainColor;
      ctx.shadowBlur = scale > 0.4 ? 6 : 0;
      ctx.fillText(this.data.text, px, py);

      // Cyber underline trace on closer tags
      if (scale > 0.45) {
        const textWidth = ctx.measureText(this.data.text).width;
        ctx.strokeStyle = mainColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(px, py + 3 * scale);
        ctx.lineTo(px + textWidth, py + 3 * scale);
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  // =========================================================================
  // 2. Dark Wireframe Breach Grid (Floor & Ceiling Rails)
  // =========================================================================
  let gridZOffset = 0;
  const GRID_SPACING = 110;
  const NUM_Z_LINES = 22;

  function drawGridHighway(speed) {
    gridZOffset = (gridZOffset + speed) % GRID_SPACING;

    ctx.save();

    // Longitudinal Rails extending into the deep dark void
    const rails = [-800, -520, -320, -160, 0, 160, 320, 520, 800];

    // Floor Rails (Hacker Cyan / Terminal Green tint)
    rails.forEach((rx, i) => {
      const isCenter = rx === 0;
      const scaleFar = FOCAL_LENGTH / DEPTH;
      const scaleNear = FOCAL_LENGTH / 35;

      const xFar = cx + rx * scaleFar;
      const yFar = cy + TUNNEL_HEIGHT * scaleFar;
      const xNear = cx + rx * scaleNear;
      const yNear = cy + (TUNNEL_HEIGHT + 350) * scaleNear;

      const grad = ctx.createLinearGradient(xFar, yFar, xNear, yNear);
      grad.addColorStop(0, 'rgba(0, 240, 255, 0)');
      grad.addColorStop(0.35, isCenter ? 'rgba(0, 255, 136, 0.25)' : 'rgba(0, 119, 254, 0.08)');
      grad.addColorStop(1, isCenter ? 'rgba(0, 255, 136, 0.55)' : 'rgba(0, 240, 255, 0.25)');

      ctx.strokeStyle = grad;
      ctx.lineWidth = isCenter ? 1.6 : 0.8;
      ctx.beginPath();
      ctx.moveTo(xFar, yFar);
      ctx.lineTo(xNear, yNear);
      ctx.stroke();
    });

    // Ceiling Rails
    rails.forEach((rx, i) => {
      const isCenter = rx === 0;
      const scaleFar = FOCAL_LENGTH / DEPTH;
      const scaleNear = FOCAL_LENGTH / 35;

      const xFar = cx + rx * scaleFar;
      const yFar = cy - TUNNEL_HEIGHT * scaleFar;
      const xNear = cx + rx * scaleNear;
      const yNear = cy - (TUNNEL_HEIGHT + 350) * scaleNear;

      const grad = ctx.createLinearGradient(xFar, yFar, xNear, yNear);
      grad.addColorStop(0, 'rgba(0, 240, 255, 0)');
      grad.addColorStop(0.35, isCenter ? 'rgba(0, 240, 255, 0.2)' : 'rgba(0, 119, 254, 0.06)');
      grad.addColorStop(1, isCenter ? 'rgba(0, 240, 255, 0.45)' : 'rgba(0, 119, 254, 0.18)');

      ctx.strokeStyle = grad;
      ctx.lineWidth = isCenter ? 1.6 : 0.8;
      ctx.beginPath();
      ctx.moveTo(xFar, yFar);
      ctx.lineTo(xNear, yNear);
      ctx.stroke();
    });

    // Transverse Scanning Lines (Rushing towards camera)
    for (let i = 0; i < NUM_Z_LINES; i++) {
      const z = (i * GRID_SPACING) - gridZOffset + 35;
      if (z <= 30 || z >= DEPTH) continue;

      const scale = FOCAL_LENGTH / z;
      const depthFactor = Math.pow(1 - (z / DEPTH), 1.6);
      const alpha = Math.min(0.55, depthFactor * 0.65);

      if (alpha <= 0.01) continue;

      const floorY = cy + TUNNEL_HEIGHT * scale;
      const ceilY = cy - TUNNEL_HEIGHT * scale;
      const spanW = 900 * scale;

      ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
      ctx.lineWidth = Math.max(0.6, 1.8 * scale);

      // Floor line
      ctx.beginPath();
      ctx.moveTo(cx - spanW, floorY);
      ctx.lineTo(cx + spanW, floorY);
      ctx.stroke();

      // Ceiling line
      ctx.beginPath();
      ctx.moveTo(cx - spanW, ceilY);
      ctx.lineTo(cx + spanW, ceilY);
      ctx.stroke();
    }

    ctx.restore();
  }

  // =========================================================================
  // 3. High-Speed Cyber Attack Streaks (Hacker Green & Neon Cyan Data Photons)
  // =========================================================================
  const STREAK_COUNT = 95;
  let streaks = [];

  class HackingStreak {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      const side = Math.floor(Math.random() * 4);
      if (side === 0) { // Floor
        this.x = (Math.random() - 0.5) * TUNNEL_WIDTH * 2.4;
        this.y = TUNNEL_HEIGHT + Math.random() * 160;
      } else if (side === 1) { // Ceiling
        this.x = (Math.random() - 0.5) * TUNNEL_WIDTH * 2.4;
        this.y = -TUNNEL_HEIGHT - Math.random() * 160;
      } else if (side === 2) { // Left flank
        this.x = -TUNNEL_WIDTH - Math.random() * 180;
        this.y = (Math.random() - 0.5) * TUNNEL_HEIGHT * 2.2;
      } else { // Right flank
        this.x = TUNNEL_WIDTH + Math.random() * 180;
        this.y = (Math.random() - 0.5) * TUNNEL_HEIGHT * 2.2;
      }

      this.z = initial ? Math.random() * DEPTH : DEPTH - Math.random() * 100;
      this.len = 80 + Math.random() * 150;
      this.speedMult = 1.3 + Math.random() * 1.9;
      this.type = Math.random();
    }

    update(speed) {
      this.z -= speed * this.speedMult;
      if (this.z <= 20) {
        this.reset();
      }
    }

    draw() {
      if (this.z <= 30) return;
      const scale1 = FOCAL_LENGTH / this.z;
      const scale2 = FOCAL_LENGTH / (this.z + this.len);

      const px1 = cx + this.x * scale1;
      const py1 = cy + this.y * scale1;
      const px2 = cx + this.x * scale2;
      const py2 = cy + this.y * scale2;

      const depthFactor = 1 - (this.z / DEPTH);
      const alpha = Math.min(0.9, Math.max(0, depthFactor * 0.9));

      if (alpha <= 0.01) return;

      ctx.save();
      const grad = ctx.createLinearGradient(px1, py1, px2, py2);

      if (this.type > 0.45) { // Hacker green
        grad.addColorStop(0, `rgba(0, 255, 136, ${alpha})`);
        grad.addColorStop(1, 'rgba(0, 119, 254, 0)');
      } else if (this.type > 0.15) { // Cyan
        grad.addColorStop(0, `rgba(0, 240, 255, ${alpha})`);
        grad.addColorStop(1, 'rgba(0, 255, 136, 0)');
      } else { // Red alert glitch
        grad.addColorStop(0, `rgba(255, 51, 102, ${alpha})`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      }

      ctx.strokeStyle = grad;
      ctx.lineWidth = Math.max(0.8, 2.6 * scale1);
      ctx.beginPath();
      ctx.moveTo(px1, py1);
      ctx.lineTo(px2, py2);
      ctx.stroke();

      // Glowing photon head
      if (scale1 > 0.5) {
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(px1, py1, Math.max(1, 2.2 * scale1), 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  // =========================================================================
  // Initialize & Main Animation Loop
  // =========================================================================
  function init() {
    resize();

    // Spawn 3D Hacking Logs distributed across depth
    hackTags = [];
    const spacing = DEPTH / TAG_COUNT;
    for (let i = 0; i < TAG_COUNT; i++) {
      hackTags.push(new HackingTag(i * spacing + 80));
    }

    streaks = [];
    for (let i = 0; i < STREAK_COUNT; i++) {
      streaks.push(new HackingStreak());
    }
  }

  let lastScrollY = window.scrollY;

  function animate() {
    globalTime += 0.016;

    // Dark cyberspace trail fade (Pure deep void - NO central blue light)
    ctx.fillStyle = 'rgba(3, 6, 14, 0.26)';
    ctx.fillRect(0, 0, width, height);

    // Smooth camera steering with mouse
    cx += (targetCx - cx) * 0.06;
    cy += (targetCy - cy) * 0.06;

    // Scroll speed boost
    if (scrollBoost > 0) {
      scrollBoost *= 0.93;
    }
    currentSpeed = baseSpeed + scrollBoost;

    // 1. Dark 3D Grid Highway into the Void
    drawGridHighway(currentSpeed);

    // 2. 3D Hacking & Privilege Escalation Streams
    hackTags.forEach(tag => {
      tag.update(currentSpeed);
      tag.draw();
    });

    // 3. High-Speed Cyber Penetration Photons
    streaks.forEach(s => {
      s.update(currentSpeed);
      s.draw();
    });

    animationFrameId = requestAnimationFrame(animate);
  }

  // Event Listeners
  window.addEventListener('resize', () => {
    resize();
    init();
  });

  window.addEventListener('mousemove', (e) => {
    const mouseNormX = (e.clientX / width) - 0.5;
    const mouseNormY = (e.clientY / height) - 0.5;
    targetCx = (width / 2) + mouseNormX * 130;
    targetCy = (height / 2) + mouseNormY * 80;
  });

  window.addEventListener('mouseleave', () => {
    targetCx = width / 2;
    targetCy = height / 2;
  });

  window.addEventListener('scroll', () => {
    const delta = Math.abs(window.scrollY - lastScrollY);
    lastScrollY = window.scrollY;
    scrollBoost = Math.min(16, scrollBoost + delta * 0.2);
  }, { passive: true });

  init();
  animate();
})();
