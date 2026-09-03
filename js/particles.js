/**
 * 3D Cyberspace "Entering The System" Engine
 * Sufi Mahbub Ahmed - Cybersecurity Portfolio
 * Features prominent floating 3D security access status tags (SYS_AUTH, FIREWALL BYPASS, MAINFRAME, IUT_SEC_NET),
 * high-speed perspective grid highway, and cyber photon streaks without heavy box clutter.
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
  const TUNNEL_WIDTH = 520;
  const TUNNEL_HEIGHT = 290;

  let baseSpeed = prefersReducedMotion ? 0 : 5.6;
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
  // 1. 3D Floating Security Status Tags (SYS_AUTH, FIREWALL, MAINFRAME, IUT_SEC_NET)
  // =========================================================================
  const SYSTEM_TAGS = [
    'SYS_AUTH // ACCESS GRANTED',
    'FIREWALL // BYPASS OK',
    'MAINFRAME // LEVEL 01',
    'IUT_SEC_NET // ROOT ACCESS',
    'SYS_AUTH // ACCESS GRANTED',
    'FIREWALL // BYPASS OK',
    'MAINFRAME // LEVEL 01',
    'IUT_SEC_NET // ROOT ACCESS',
    'SECURITY_LAYER // VERIFIED',
    'ENCRYPTION // AES_256',
    'DATA_PIPELINE // CONNECTED',
    'SEC_KERNEL // INITIALIZED'
  ];

  const TAG_COUNT = 14; // Plentiful and constantly streaming
  let hudTags = [];

  class CyberHUDTag {
    constructor(initialZ) {
      this.reset(initialZ);
    }

    reset(customZ = null) {
      // Position evenly across the 4 quadrant perimeters
      const quadrant = Math.floor(Math.random() * 4);
      if (quadrant === 0) { // Top Left / Upper Left
        this.x = -220 - Math.random() * 320;
        this.y = -140 - Math.random() * 160;
      } else if (quadrant === 1) { // Top Right / Upper Right
        this.x = 220 + Math.random() * 320;
        this.y = -140 - Math.random() * 160;
      } else if (quadrant === 2) { // Bottom Left / Lower Left
        this.x = -220 - Math.random() * 320;
        this.y = 140 + Math.random() * 160;
      } else { // Bottom Right / Lower Right
        this.x = 220 + Math.random() * 320;
        this.y = 140 + Math.random() * 160;
      }

      this.z = customZ !== null ? customZ : (DEPTH - Math.random() * 150);
      this.text = SYSTEM_TAGS[Math.floor(Math.random() * SYSTEM_TAGS.length)];
      this.isAccessGranted = this.text.includes('ACCESS GRANTED') || this.text.includes('ROOT ACCESS') || this.text.includes('BYPASS OK');
    }

    update(speed) {
      this.z -= speed * 1.1;
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
      const alpha = Math.min(0.9, Math.max(0, depthFactor * 0.95));

      if (alpha <= 0.02) return;

      const fontSize = Math.max(7.5, 13.5 * scale);
      ctx.save();
      ctx.font = `600 ${fontSize}px "JetBrains Mono", monospace`;

      // Status indicator dot
      const dotRadius = Math.max(1.8, 3.5 * scale);
      ctx.fillStyle = this.isAccessGranted ? `rgba(16, 185, 129, ${alpha})` : `rgba(0, 240, 255, ${alpha})`;
      ctx.shadowBlur = this.isAccessGranted ? 8 : 6;
      ctx.shadowColor = this.isAccessGranted ? '#10b981' : '#00f0ff';
      ctx.beginPath();
      ctx.arc(px - 10 * scale, py - (fontSize * 0.35), dotRadius, 0, Math.PI * 2);
      ctx.fill();

      // Cyber text with subtle glow
      ctx.shadowBlur = scale > 0.4 ? 6 : 0;
      ctx.shadowColor = 'rgba(0, 240, 255, 0.6)';
      ctx.fillStyle = `rgba(0, 240, 255, ${alpha * 0.95})`;
      ctx.fillText(`[ ${this.text} ]`, px, py);

      // Underline trace on closer elements
      if (scale > 0.4) {
        const textWidth = ctx.measureText(`[ ${this.text} ]`).width;
        ctx.strokeStyle = `rgba(0, 240, 255, ${alpha * 0.35})`;
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
  // 2. Sleek 3D Grid Highway (Floor & Ceiling Perspective Rails)
  // =========================================================================
  let gridZOffset = 0;
  const GRID_SPACING = 110;
  const NUM_Z_LINES = 20;

  function drawGridHighway(speed) {
    gridZOffset = (gridZOffset + speed) % GRID_SPACING;

    ctx.save();

    // Longitudinal Rails extending from horizon
    const rails = [-750, -500, -320, -160, 0, 160, 320, 500, 750];

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
      grad.addColorStop(1, isCenter ? 'rgba(0, 240, 255, 0.5)' : 'rgba(0, 119, 254, 0.25)');

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
      grad.addColorStop(0.35, isCenter ? 'rgba(0, 240, 255, 0.16)' : 'rgba(0, 119, 254, 0.06)');
      grad.addColorStop(1, isCenter ? 'rgba(0, 240, 255, 0.4)' : 'rgba(0, 119, 254, 0.18)');

      ctx.strokeStyle = grad;
      ctx.lineWidth = isCenter ? 1.5 : 0.8;
      ctx.beginPath();
      ctx.moveTo(xFar, yFar);
      ctx.lineTo(xNear, yNear);
      ctx.stroke();
    });

    // Transverse Z-Lines (Clean, smooth floor & ceiling grids)
    for (let i = 0; i < NUM_Z_LINES; i++) {
      const z = (i * GRID_SPACING) - gridZOffset + 35;
      if (z <= 30 || z >= DEPTH) continue;

      const scale = FOCAL_LENGTH / z;
      const depthFactor = Math.pow(1 - (z / DEPTH), 1.6);
      const alpha = Math.min(0.55, depthFactor * 0.65);

      if (alpha <= 0.01) continue;

      const floorY = cy + TUNNEL_HEIGHT * scale;
      const ceilY = cy - TUNNEL_HEIGHT * scale;
      const spanW = 880 * scale;

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
  // 3. High-Speed Light Rays & Photons (Clean Data Streams)
  // =========================================================================
  const STREAK_COUNT = 90;
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
      this.len = 70 + Math.random() * 130;
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

      if (this.colorType > 0.35) {
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
  // 4. Horizon Mainframe Core Glow
  // =========================================================================
  function drawHorizonNexus() {
    ctx.save();
    const pulse = 1 + Math.sin(globalTime * 2.2) * 0.06;
    const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 160 * pulse);
    grad.addColorStop(0, 'rgba(0, 240, 255, 0.4)');
    grad.addColorStop(0.3, 'rgba(0, 119, 254, 0.18)');
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
    ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // =========================================================================
  // Initialization & Main Loop
  // =========================================================================
  function init() {
    resize();

    // Initialize 3D HUD Tags at distributed depths
    hudTags = [];
    const spacing = DEPTH / TAG_COUNT;
    for (let i = 0; i < TAG_COUNT; i++) {
      hudTags.push(new CyberHUDTag(i * spacing + 100));
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
    ctx.fillStyle = 'rgba(4, 7, 16, 0.25)';
    ctx.fillRect(0, 0, width, height);

    // Smooth camera steer
    cx += (targetCx - cx) * 0.06;
    cy += (targetCy - cy) * 0.06;

    // Scroll speed acceleration
    if (scrollBoost > 0) {
      scrollBoost *= 0.93;
    }
    currentSpeed = baseSpeed + scrollBoost;

    // 1. Horizon Nexus
    drawHorizonNexus();

    // 2. Clean 3D Perspective Grid Highway
    drawGridHighway(currentSpeed);

    // 3. 3D Floating System Status Tags (SYS_AUTH, FIREWALL, MAINFRAME, IUT_SEC_NET)
    hudTags.forEach(tag => {
      tag.update(currentSpeed);
      tag.draw();
    });

    // 4. High-speed Light Photons
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
