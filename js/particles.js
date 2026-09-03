/**
 * Clean 3D Cyberspace System Traversal Engine
 * Sufi Mahbub Ahmed - Cybersecurity Portfolio
 * Minimalist, high-speed digital highway with sleek perspective grids,
 * clean laser light streams, and subtle cyber portals (uncluttered & words-free).
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

  // Projection setup
  const FOCAL_LENGTH = 340;
  const DEPTH = 2200;
  const TUNNEL_WIDTH = 550;
  const TUNNEL_HEIGHT = 300;

  let baseSpeed = prefersReducedMotion ? 0 : 5.8;
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
  // 1. Sleek 3D Grid Highway (Floor & Ceiling Perspective Lines)
  // =========================================================================
  let gridZOffset = 0;
  const GRID_SPACING = 120; // Wider spacing = much cleaner look
  const NUM_Z_LINES = 18;

  function drawGridHighway(speed) {
    gridZOffset = (gridZOffset + speed) % GRID_SPACING;

    ctx.save();

    // Longitudinal Rails extending from horizon
    const rails = [-700, -480, -300, -150, 0, 150, 300, 480, 700];

    // Floor Rails
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
      grad.addColorStop(0.35, isCenter ? 'rgba(0, 240, 255, 0.22)' : 'rgba(0, 119, 254, 0.08)');
      grad.addColorStop(1, isCenter ? 'rgba(0, 240, 255, 0.5)' : 'rgba(0, 119, 254, 0.22)');

      ctx.strokeStyle = grad;
      ctx.lineWidth = isCenter ? 1.5 : 0.8;
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
      grad.addColorStop(0.35, isCenter ? 'rgba(0, 240, 255, 0.16)' : 'rgba(0, 119, 254, 0.05)');
      grad.addColorStop(1, isCenter ? 'rgba(0, 240, 255, 0.4)' : 'rgba(0, 119, 254, 0.16)');

      ctx.strokeStyle = grad;
      ctx.lineWidth = isCenter ? 1.5 : 0.8;
      ctx.beginPath();
      ctx.moveTo(xFar, yFar);
      ctx.lineTo(xNear, yNear);
      ctx.stroke();
    });

    // Clean Transverse Z-Lines (Wider spacing, no box clutter)
    for (let i = 0; i < NUM_Z_LINES; i++) {
      const z = (i * GRID_SPACING) - gridZOffset + 40;
      if (z <= 30 || z >= DEPTH) continue;

      const scale = FOCAL_LENGTH / z;
      const depthFactor = Math.pow(1 - (z / DEPTH), 1.6);
      const alpha = Math.min(0.55, depthFactor * 0.65);

      if (alpha <= 0.01) continue;

      const floorY = cy + TUNNEL_HEIGHT * scale;
      const ceilY = cy - TUNNEL_HEIGHT * scale;
      const spanW = 850 * scale;

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
  // 2. Minimalist Cyber Portal Arches (Only 2 Clean Sleek Rings, No Word Clutter)
  // =========================================================================
  const PORTAL_COUNT = 2; // Drastically reduced from 6 heavy boxes
  const PORTAL_SPACING = DEPTH / PORTAL_COUNT;
  let portals = [];

  class MinimalPortal {
    constructor(z) {
      this.z = z;
      this.w = TUNNEL_WIDTH * 2.1;
      this.h = TUNNEL_HEIGHT * 2.1;
    }

    update(speed) {
      this.z -= speed;
      if (this.z <= 25) {
        this.z += DEPTH;
      }
    }

    draw() {
      if (this.z <= 35) return;
      const scale = FOCAL_LENGTH / this.z;
      const sw = this.w * scale;
      const sh = this.h * scale;
      const gx = cx - sw / 2;
      const gy = cy - sh / 2;

      const depthFactor = 1 - (this.z / DEPTH);
      const alpha = Math.min(0.65, Math.max(0, depthFactor * 0.55));

      if (alpha <= 0.02) return;

      ctx.save();

      // Sleek Corner Brackets (Open & minimal, not a heavy enclosed box)
      const cLen = Math.min(35, 30 * scale);
      ctx.strokeStyle = `rgba(0, 240, 255, ${alpha * 1.2})`;
      ctx.lineWidth = Math.max(1.2, 2.6 * scale);

      // Top-Left
      ctx.beginPath();
      ctx.moveTo(gx, gy + cLen);
      ctx.lineTo(gx, gy);
      ctx.lineTo(gx + cLen, gy);
      // Top-Right
      ctx.moveTo(gx + sw - cLen, gy);
      ctx.lineTo(gx + sw, gy);
      ctx.lineTo(gx + sw, gy + cLen);
      // Bottom-Left
      ctx.moveTo(gx, gy + sh - cLen);
      ctx.lineTo(gx, gy + sh);
      ctx.lineTo(gx + cLen, gy + sh);
      // Bottom-Right
      ctx.moveTo(gx + sw - cLen, gy + sh);
      ctx.lineTo(gx + sw, gy + sh);
      ctx.lineTo(gx + sw, gy + sh - cLen);
      ctx.stroke();

      // Subtle lateral tick marks
      ctx.strokeStyle = `rgba(0, 240, 255, ${alpha * 0.5})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(gx - 15 * scale, gy + sh / 2);
      ctx.lineTo(gx + 15 * scale, gy + sh / 2);
      ctx.moveTo(gx + sw - 15 * scale, gy + sh / 2);
      ctx.lineTo(gx + sw + 15 * scale, gy + sh / 2);
      ctx.stroke();

      ctx.restore();
    }
  }

  // =========================================================================
  // 3. High-Speed Light Rays & Photons (Smooth & Aesthetic Data Streaks)
  // =========================================================================
  const STREAK_COUNT = 95;
  let streaks = [];

  class LightStreak {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      const side = Math.floor(Math.random() * 4);
      if (side === 0) { // Floor zone
        this.x = (Math.random() - 0.5) * TUNNEL_WIDTH * 2.4;
        this.y = TUNNEL_HEIGHT + Math.random() * 160;
      } else if (side === 1) { // Ceiling zone
        this.x = (Math.random() - 0.5) * TUNNEL_WIDTH * 2.4;
        this.y = -TUNNEL_HEIGHT - Math.random() * 160;
      } else if (side === 2) { // Left peripheral
        this.x = -TUNNEL_WIDTH - Math.random() * 180;
        this.y = (Math.random() - 0.5) * TUNNEL_HEIGHT * 2.2;
      } else { // Right peripheral
        this.x = TUNNEL_WIDTH + Math.random() * 180;
        this.y = (Math.random() - 0.5) * TUNNEL_HEIGHT * 2.2;
      }

      this.z = initial ? Math.random() * DEPTH : DEPTH - Math.random() * 100;
      this.len = 70 + Math.random() * 140;
      this.speedMult = 1.2 + Math.random() * 1.8;
      this.colorType = Math.random();
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
      const alpha = Math.min(0.85, Math.max(0, depthFactor * 0.85));

      if (alpha <= 0.01) return;

      ctx.save();
      const grad = ctx.createLinearGradient(px1, py1, px2, py2);

      if (this.colorType > 0.4) {
        grad.addColorStop(0, `rgba(0, 240, 255, ${alpha})`);
        grad.addColorStop(1, 'rgba(0, 119, 254, 0)');
      } else if (this.colorType > 0.15) {
        grad.addColorStop(0, `rgba(56, 189, 248, ${alpha})`);
        grad.addColorStop(1, 'rgba(139, 92, 246, 0)');
      } else {
        grad.addColorStop(0, `rgba(16, 185, 129, ${alpha})`);
        grad.addColorStop(1, 'rgba(0, 240, 255, 0)');
      }

      ctx.strokeStyle = grad;
      ctx.lineWidth = Math.max(0.8, 2.5 * scale1);
      ctx.beginPath();
      ctx.moveTo(px1, py1);
      ctx.lineTo(px2, py2);
      ctx.stroke();

      // Glowing photon head
      if (scale1 > 0.5) {
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(px1, py1, Math.max(1, 2 * scale1), 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  // =========================================================================
  // 4. Subtle Horizon Nexus Glow
  // =========================================================================
  function drawHorizonNexus() {
    ctx.save();
    const pulse = 1 + Math.sin(globalTime * 2.2) * 0.06;
    const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 160 * pulse);
    grad.addColorStop(0, 'rgba(0, 240, 255, 0.38)');
    grad.addColorStop(0.3, 'rgba(0, 119, 254, 0.16)');
    grad.addColorStop(0.7, 'rgba(11, 19, 36, 0.04)');
    grad.addColorStop(1, 'transparent');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, 160 * pulse, 0, Math.PI * 2);
    ctx.fill();

    // Clean center point
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00f0ff';
    ctx.beginPath();
    ctx.arc(cx, cy, 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // =========================================================================
  // Init & Loop
  // =========================================================================
  function init() {
    resize();

    portals = [];
    for (let i = 0; i < PORTAL_COUNT; i++) {
      portals.push(new MinimalPortal(i * PORTAL_SPACING + 100));
    }

    streaks = [];
    for (let i = 0; i < STREAK_COUNT; i++) {
      streaks.push(new LightStreak());
    }
  }

  let lastScrollY = window.scrollY;

  function animate() {
    globalTime += 0.016;

    // Dark cyberspace trail fade
    ctx.fillStyle = 'rgba(4, 7, 16, 0.26)';
    ctx.fillRect(0, 0, width, height);

    // Smooth camera steering
    cx += (targetCx - cx) * 0.06;
    cy += (targetCy - cy) * 0.06;

    // Scroll speed boost
    if (scrollBoost > 0) {
      scrollBoost *= 0.93;
    }
    currentSpeed = baseSpeed + scrollBoost;

    // 1. Horizon Nexus
    drawHorizonNexus();

    // 2. Clean 3D Grid Highway
    drawGridHighway(currentSpeed);

    // 3. Minimalist Portal Arches
    portals.forEach(p => {
      p.update(currentSpeed);
      p.draw();
    });

    // 4. High-speed Light Streaks
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
    scrollBoost = Math.min(15, scrollBoost + delta * 0.18);
  }, { passive: true });

  init();
  animate();
})();
