/**
 * "Entering The System" Cyberspace Engine
 * Sufi Mahbub Ahmed - Cybersecurity Portfolio
 * Creates an immersive 3D digital grid highway, passing security firewalls,
 * matrix data streams, and high-speed cyberspace traversal into the system mainframe.
 */

(function () {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let width, height;
  let cx, cy;
  let targetCx, targetCy;

  // Reduced motion detection
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Projection configuration
  const FOCAL_LENGTH = 320;
  const DEPTH = 2000;
  const TUNNEL_WIDTH = 480;
  const TUNNEL_HEIGHT = 280;
  
  let baseSpeed = prefersReducedMotion ? 0 : 5.5;
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
  // 1. Moving 3D Grid Highway (Floor & Ceiling Matrix Grids)
  // =========================================================================
  let gridZOffset = 0;
  const GRID_LINE_SPACING = 80;
  const NUM_Z_LINES = 28;

  function drawGridHighway(speed) {
    gridZOffset = (gridZOffset + speed) % GRID_LINE_SPACING;

    ctx.save();

    // Longitudinal Rails (radiating from horizon)
    const xRays = [-800, -600, -450, -300, -180, -80, 0, 80, 180, 300, 450, 600, 800];
    
    // Draw Floor Rails
    xRays.forEach((rx, i) => {
      const isMain = i % 2 === 0;
      const scaleFar = FOCAL_LENGTH / DEPTH;
      const scaleNear = FOCAL_LENGTH / 30;

      const xFar = cx + rx * scaleFar;
      const yFar = cy + TUNNEL_HEIGHT * scaleFar;
      const xNear = cx + rx * scaleNear;
      const yNear = cy + (TUNNEL_HEIGHT + 350) * scaleNear;

      const grad = ctx.createLinearGradient(xFar, yFar, xNear, yNear);
      grad.addColorStop(0, 'rgba(0, 240, 255, 0)');
      grad.addColorStop(0.3, isMain ? 'rgba(0, 240, 255, 0.15)' : 'rgba(0, 119, 254, 0.08)');
      grad.addColorStop(1, isMain ? 'rgba(0, 240, 255, 0.45)' : 'rgba(0, 119, 254, 0.25)');

      ctx.strokeStyle = grad;
      ctx.lineWidth = isMain ? 1.2 : 0.7;
      ctx.beginPath();
      ctx.moveTo(xFar, yFar);
      ctx.lineTo(xNear, yNear);
      ctx.stroke();
    });

    // Draw Ceiling Rails
    xRays.forEach((rx, i) => {
      const isMain = i % 2 === 0;
      const scaleFar = FOCAL_LENGTH / DEPTH;
      const scaleNear = FOCAL_LENGTH / 30;

      const xFar = cx + rx * scaleFar;
      const yFar = cy - TUNNEL_HEIGHT * scaleFar;
      const xNear = cx + rx * scaleNear;
      const yNear = cy - (TUNNEL_HEIGHT + 350) * scaleNear;

      const grad = ctx.createLinearGradient(xFar, yFar, xNear, yNear);
      grad.addColorStop(0, 'rgba(0, 240, 255, 0)');
      grad.addColorStop(0.3, isMain ? 'rgba(0, 240, 255, 0.12)' : 'rgba(0, 119, 254, 0.06)');
      grad.addColorStop(1, isMain ? 'rgba(0, 240, 255, 0.35)' : 'rgba(0, 119, 254, 0.18)');

      ctx.strokeStyle = grad;
      ctx.lineWidth = isMain ? 1.2 : 0.7;
      ctx.beginPath();
      ctx.moveTo(xFar, yFar);
      ctx.lineTo(xNear, yNear);
      ctx.stroke();
    });

    // Moving Transverse Z-Lines (rushing towards camera)
    for (let i = 0; i < NUM_Z_LINES; i++) {
      const z = (i * GRID_LINE_SPACING) - gridZOffset + 35;
      if (z <= 25 || z >= DEPTH) continue;

      const scale = FOCAL_LENGTH / z;
      const depthFactor = Math.pow(1 - (z / DEPTH), 1.8);
      const alpha = Math.min(0.65, depthFactor * 0.75);

      if (alpha <= 0.01) return;

      const floorY = cy + TUNNEL_HEIGHT * scale;
      const ceilY = cy - TUNNEL_HEIGHT * scale;
      const spanW = 900 * scale;

      ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
      ctx.lineWidth = Math.max(0.6, 2.2 * scale);

      // Floor horizontal line
      ctx.beginPath();
      ctx.moveTo(cx - spanW, floorY);
      ctx.lineTo(cx + spanW, floorY);
      ctx.stroke();

      // Ceiling horizontal line
      ctx.beginPath();
      ctx.moveTo(cx - spanW, ceilY);
      ctx.lineTo(cx + spanW, ceilY);
      ctx.stroke();
    }

    ctx.restore();
  }

  // =========================================================================
  // 2. Security Gateway Firewalls ("ENTERING SYSTEM LAYER // ACCESS GRANTED")
  // =========================================================================
  const GATE_COUNT = 6;
  const GATE_SPACING = DEPTH / GATE_COUNT;
  const GATE_LABELS = [
    'SYS_AUTH // ACCESS GRANTED',
    'FIREWALL // BYPASS OK',
    'MAINFRAME // LEVEL 01',
    'SEC_KERNEL // INITIALIZED',
    'DATA_PIPELINE // CONNECTED',
    'IUT_SEC_NET // ROOT ACCESS'
  ];

  let gates = [];

  class SecurityGate {
    constructor(z, labelIndex) {
      this.z = z;
      this.label = GATE_LABELS[labelIndex % GATE_LABELS.length];
      this.w = TUNNEL_WIDTH * 2;
      this.h = TUNNEL_HEIGHT * 2;
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
      const alpha = Math.min(0.8, Math.max(0, depthFactor * 0.75));

      if (alpha <= 0.02) return;

      ctx.save();

      // Outer Gate Neon Frame
      ctx.strokeStyle = `rgba(0, 240, 255, ${alpha * 0.8})`;
      ctx.lineWidth = Math.max(1, 2.8 * scale);
      ctx.strokeRect(gx, gy, sw, sh);

      // Cyber Corner Brackets
      const cLen = Math.min(30, 25 * scale);
      ctx.strokeStyle = `rgba(0, 240, 255, ${alpha * 1.4})`;
      ctx.lineWidth = Math.max(1.5, 3.8 * scale);

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

      // Gateway Security Text Badge
      if (scale > 0.35) {
        const fontSize = Math.max(8, 12 * scale);
        ctx.font = `600 ${fontSize}px "JetBrains Mono", monospace`;
        ctx.fillStyle = `rgba(0, 240, 255, ${alpha * 0.95})`;
        ctx.fillText(`[ ${this.label} ]`, gx + 15 * scale, gy - 8 * scale);

        // Security Status Dot
        ctx.fillStyle = `rgba(16, 185, 129, ${alpha})`;
        ctx.beginPath();
        ctx.arc(gx + 6 * scale, gy - 12 * scale, 3 * scale, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  // =========================================================================
  // 3. High-Speed Cyber Light Streaks (Data Packets Rushing by)
  // =========================================================================
  const STREAK_COUNT = 90;
  let streaks = [];

  class CyberStreak {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      // Position along the 4 tunnel quadrants (walls, floor, ceiling)
      const side = Math.floor(Math.random() * 4);
      if (side === 0) { // Floor
        this.x = (Math.random() - 0.5) * TUNNEL_WIDTH * 2.2;
        this.y = TUNNEL_HEIGHT + Math.random() * 150;
      } else if (side === 1) { // Ceiling
        this.x = (Math.random() - 0.5) * TUNNEL_WIDTH * 2.2;
        this.y = -TUNNEL_HEIGHT - Math.random() * 150;
      } else if (side === 2) { // Left wall
        this.x = -TUNNEL_WIDTH - Math.random() * 150;
        this.y = (Math.random() - 0.5) * TUNNEL_HEIGHT * 2;
      } else { // Right wall
        this.x = TUNNEL_WIDTH + Math.random() * 150;
        this.y = (Math.random() - 0.5) * TUNNEL_HEIGHT * 2;
      }

      this.z = initial ? Math.random() * DEPTH : DEPTH - Math.random() * 80;
      this.len = 60 + Math.random() * 120;
      this.speedMult = 1.3 + Math.random() * 1.8;
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
      ctx.lineWidth = Math.max(0.8, 2.8 * scale1);
      ctx.beginPath();
      ctx.moveTo(px1, py1);
      ctx.lineTo(px2, py2);
      ctx.stroke();

      // Glowing photon head
      if (scale1 > 0.5) {
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(px1, py1, Math.max(1.2, 2.2 * scale1), 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  // =========================================================================
  // 4. Matrix Binary & Hex Stream Drops on Side Walls
  // =========================================================================
  const STREAM_COUNT = 16;
  const CHAR_SET = '01010101ABCDEF01X#<>{}[]*+=-~';
  let matrixStreams = [];

  class MatrixStream {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.side = Math.random() > 0.5 ? 1 : -1;
      this.x = this.side * (TUNNEL_WIDTH + 60 + Math.random() * 120);
      this.y = (Math.random() - 0.5) * TUNNEL_HEIGHT * 1.8;
      this.z = initial ? Math.random() * DEPTH : DEPTH;
      this.chars = [];
      const len = 4 + Math.floor(Math.random() * 6);
      for (let i = 0; i < len; i++) {
        this.chars.push(CHAR_SET[Math.floor(Math.random() * CHAR_SET.length)]);
      }
    }

    update(speed) {
      this.z -= speed * 1.2;
      if (this.z <= 30) {
        this.reset();
      }
    }

    draw() {
      if (this.z <= 40) return;
      const scale = FOCAL_LENGTH / this.z;
      const px = cx + this.x * scale;
      const py = cy + this.y * scale;

      const depthFactor = 1 - (this.z / DEPTH);
      const alpha = Math.min(0.65, Math.max(0, depthFactor * 0.65));

      if (alpha <= 0.02) return;

      const fontSize = Math.max(6, 12 * scale);
      ctx.save();
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

      this.chars.forEach((ch, idx) => {
        const charY = py + idx * (fontSize * 1.15);
        if (idx === 0) {
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 1.2})`;
        } else {
          ctx.fillStyle = `rgba(0, 240, 255, ${alpha * (1 - idx * 0.12)})`;
        }
        ctx.fillText(ch, px, charY);
      });

      ctx.restore();
    }
  }

  // =========================================================================
  // 5. System Mainframe Core (Glowing Target Horizon)
  // =========================================================================
  function drawMainframeCore() {
    ctx.save();

    // Deep pulsating core gradient
    const pulse = 1 + Math.sin(globalTime * 2.5) * 0.08;
    const coreGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 180 * pulse);
    coreGrad.addColorStop(0, 'rgba(0, 240, 255, 0.45)');
    coreGrad.addColorStop(0.25, 'rgba(0, 119, 254, 0.22)');
    coreGrad.addColorStop(0.6, 'rgba(11, 19, 36, 0.08)');
    coreGrad.addColorStop(1, 'transparent');

    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 180 * pulse, 0, Math.PI * 2);
    ctx.fill();

    // Central bright nexus core
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 18;
    ctx.shadowColor = '#00f0ff';
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fill();

    // Subtle crosshair lines
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(cx - 25, cy);
    ctx.lineTo(cx + 25, cy);
    ctx.moveTo(cx, cy - 25);
    ctx.lineTo(cx, cy + 25);
    ctx.stroke();

    ctx.restore();
  }

  // =========================================================================
  // Initialize and Run Animation Loop
  // =========================================================================
  function init() {
    resize();

    gates = [];
    for (let i = 0; i < GATE_COUNT; i++) {
      gates.push(new SecurityGate(i * GATE_SPACING + 60, i));
    }

    streaks = [];
    for (let i = 0; i < STREAK_COUNT; i++) {
      streaks.push(new CyberStreak());
    }

    matrixStreams = [];
    for (let i = 0; i < STREAM_COUNT; i++) {
      matrixStreams.push(new MatrixStream());
    }
  }

  let lastScrollY = window.scrollY;

  function animate() {
    globalTime += 0.016;

    // Dark cyberspace trail fade (gives motion blur without hiding content)
    ctx.fillStyle = 'rgba(4, 7, 16, 0.24)';
    ctx.fillRect(0, 0, width, height);

    // Smooth camera steering
    cx += (targetCx - cx) * 0.06;
    cy += (targetCy - cy) * 0.06;

    // Smooth scroll velocity acceleration
    if (scrollBoost > 0) {
      scrollBoost *= 0.93;
    }
    currentSpeed = baseSpeed + scrollBoost;

    // 1. Draw Horizon & Mainframe Core
    drawMainframeCore();

    // 2. Draw 3D Infinite Grid Highway
    drawGridHighway(currentSpeed);

    // 3. Draw Passing Security Gateways
    gates.forEach(gate => {
      gate.update(currentSpeed);
      gate.draw();
    });

    // 4. Draw Matrix Binary Streams
    matrixStreams.forEach(stream => {
      stream.update(currentSpeed);
      stream.draw();
    });

    // 5. Draw Light Speed Streaks
    streaks.forEach(streak => {
      streak.update(currentSpeed);
      streak.draw();
    });

    animationFrameId = requestAnimationFrame(animate);
  }

  // Event Listeners
  window.addEventListener('resize', () => {
    resize();
    init();
  });

  // Mouse Steer (shifts perspective vanishing point)
  window.addEventListener('mousemove', (e) => {
    const mouseNormX = (e.clientX / width) - 0.5;
    const mouseNormY = (e.clientY / height) - 0.5;
    targetCx = (width / 2) + mouseNormX * 140;
    targetCy = (height / 2) + mouseNormY * 90;
  });

  window.addEventListener('mouseleave', () => {
    targetCx = width / 2;
    targetCy = height / 2;
  });

  // Scroll velocity acceleration (speeding through system when scrolling)
  window.addEventListener('scroll', () => {
    const delta = Math.abs(window.scrollY - lastScrollY);
    lastScrollY = window.scrollY;
    scrollBoost = Math.min(16, scrollBoost + delta * 0.2);
  }, { passive: true });

  init();
  animate();
})();
