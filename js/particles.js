/**
 * "Heart of the System" 3D Cyber Circuit Engine
 * Sufi Mahbub Ahmed - Cybersecurity Portfolio
 * Replaces plain grid rectangles with procedural 3D PCB circuit board traces,
 * glowing solder via nodes, 45-degree bus lines, electrical data pulses,
 * and pure blue terminal penetration logs streaming into the dark mainframe core.
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

  // 3D Projection Configuration
  const FOCAL_LENGTH = 340;
  const DEPTH = 2400;
  const CIRCUIT_PLANE_Y = 270; // Distance of ceiling and floor circuit boards from center

  let baseSpeed = prefersReducedMotion ? 0 : 6.0;
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
  // 1. Procedural 3D PCB Circuit Traces & Bus Pathways (Floor & Ceiling)
  // =========================================================================
  const CIRCUIT_TRACKS = [
    // Center main data bus
    { x: 0, dx: 0, isBus: true },
    { x: -50, dx: -50, isBus: true },
    { x: 50, dx: 50, isBus: true },

    // Mid-flank branching circuit traces with 45° step-outs
    { x: -160, dx: -240, isBus: false },
    { x: 160, dx: 240, isBus: false },
    { x: -300, dx: -420, isBus: false },
    { x: 300, dx: 420, isBus: false },

    // Outer peripheral motherboard power & address lines
    { x: -480, dx: -680, isBus: true },
    { x: 480, dx: 680, isBus: true },
    { x: -650, dx: -850, isBus: false },
    { x: 650, dx: 850, isBus: false }
  ];

  // Moving Z-segments & Solder Via Nodes
  let circuitZOffset = 0;
  const NODE_SPACING = 160;
  const NUM_Z_NODES = 16;

  function drawCircuitBoard(isCeiling, speed) {
    const planeSign = isCeiling ? -1 : 1;
    const planeY = planeSign * CIRCUIT_PLANE_Y;

    ctx.save();

    // 1. Draw Longitudinal Circuit Bus Lines
    CIRCUIT_TRACKS.forEach(track => {
      const scaleFar = FOCAL_LENGTH / DEPTH;
      const scaleNear = FOCAL_LENGTH / 35;

      const xFar = cx + track.x * scaleFar;
      const yFar = cy + planeY * scaleFar;

      const xNear = cx + track.dx * scaleNear;
      const yNear = cy + (planeY + (isCeiling ? -250 : 250)) * scaleNear;

      const grad = ctx.createLinearGradient(xFar, yFar, xNear, yNear);
      grad.addColorStop(0, 'rgba(0, 240, 255, 0)');
      grad.addColorStop(0.3, track.isBus ? 'rgba(0, 240, 255, 0.18)' : 'rgba(0, 119, 254, 0.1)');
      grad.addColorStop(1, track.isBus ? 'rgba(0, 240, 255, 0.6)' : 'rgba(0, 119, 254, 0.35)');

      ctx.strokeStyle = grad;
      ctx.lineWidth = track.isBus ? 1.5 : 0.9;
      ctx.beginPath();
      ctx.moveTo(xFar, yFar);
      ctx.lineTo(xNear, yNear);
      ctx.stroke();
    });

    // 2. Draw Circuit Nodes, Solder Via Pads & 45-degree Cross-Traces
    for (let i = 0; i < NUM_Z_NODES; i++) {
      const z = (i * NODE_SPACING) - circuitZOffset + 40;
      if (z <= 30 || z >= DEPTH) continue;

      const scale = FOCAL_LENGTH / z;
      const depthFactor = Math.pow(1 - (z / DEPTH), 1.5);
      const alpha = Math.min(0.75, depthFactor * 0.85);

      if (alpha <= 0.02) continue;

      const nodeY = cy + (planeY + (isCeiling ? -30 : 30)) * scale;

      // Draw horizontal & 45-degree circuit bridging lines
      const trackLeftX = cx + (-300) * scale;
      const trackRightX = cx + (300) * scale;

      // Subtle circuit bridge trace
      if (i % 2 === 0) {
        ctx.strokeStyle = `rgba(0, 240, 255, ${alpha * 0.45})`;
        ctx.lineWidth = Math.max(0.7, 1.4 * scale);
        ctx.beginPath();
        ctx.moveTo(trackLeftX, nodeY);
        ctx.lineTo(trackRightX, nodeY);
        ctx.stroke();
      }

      // Solder Via Pads (Circular PCB contact pads)
      const padPositions = [-480, -300, -160, -50, 0, 50, 160, 300, 480];
      padPositions.forEach((pxPos, pIdx) => {
        // Only draw pads on selective grid intersections for realistic PCB pattern
        if ((i + pIdx) % 3 !== 0) return;

        const padX = cx + pxPos * scale;
        const padRadius = Math.max(1.5, 3.8 * scale);

        // Outer solder ring
        ctx.strokeStyle = `rgba(0, 240, 255, ${alpha * 0.85})`;
        ctx.lineWidth = Math.max(0.8, 1.5 * scale);
        ctx.beginPath();
        ctx.arc(padX, nodeY, padRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Inner glowing via pin
        if (scale > 0.3) {
          ctx.fillStyle = `rgba(0, 240, 255, ${alpha})`;
          ctx.beginPath();
          ctx.arc(padX, nodeY, Math.max(0.8, 1.4 * scale), 0, Math.PI * 2);
          ctx.fill();
        }
      });
    }

    ctx.restore();
  }

  // =========================================================================
  // 2. High-Speed Electrical Current Signals (Flowing through Circuit Tracks)
  // =========================================================================
  const SIGNAL_COUNT = 36;
  let signals = [];

  class CircuitSignal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.isCeiling = Math.random() > 0.5;
      const track = CIRCUIT_TRACKS[Math.floor(Math.random() * CIRCUIT_TRACKS.length)];
      this.trackX = track.x;
      this.targetDX = track.dx;
      this.z = initial ? Math.random() * DEPTH : DEPTH - Math.random() * 80;
      this.len = 45 + Math.random() * 90;
      this.speedMult = 1.4 + Math.random() * 1.8;
      this.isCyan = Math.random() > 0.3;
    }

    update(speed) {
      this.z -= speed * this.speedMult;
      if (this.z <= 25) {
        this.reset();
      }
    }

    draw() {
      if (this.z <= 35) return;
      const scale1 = FOCAL_LENGTH / this.z;
      const scale2 = FOCAL_LENGTH / (this.z + this.len);

      const planeY = (this.isCeiling ? -1 : 1) * CIRCUIT_PLANE_Y;

      // Interpolate X based on Z progression (following 45° track divergence)
      const t1 = 1 - (this.z / DEPTH);
      const currX1 = this.trackX + (this.targetDX - this.trackX) * t1;

      const t2 = 1 - ((this.z + this.len) / DEPTH);
      const currX2 = this.trackX + (this.targetDX - this.trackX) * t2;

      const px1 = cx + currX1 * scale1;
      const py1 = cy + planeY * scale1;

      const px2 = cx + currX2 * scale2;
      const py2 = cy + planeY * scale2;

      const depthFactor = 1 - (this.z / DEPTH);
      const alpha = Math.min(0.95, Math.max(0, depthFactor * 0.95));

      if (alpha <= 0.02) return;

      ctx.save();
      const grad = ctx.createLinearGradient(px1, py1, px2, py2);
      grad.addColorStop(0, `rgba(0, 240, 255, ${alpha})`);
      grad.addColorStop(1, 'rgba(0, 119, 254, 0)');

      ctx.strokeStyle = grad;
      ctx.lineWidth = Math.max(1.2, 3.2 * scale1);
      ctx.beginPath();
      ctx.moveTo(px1, py1);
      ctx.lineTo(px2, py2);
      ctx.stroke();

      // Glowing current electron head
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = scale1 > 0.4 ? 10 : 4;
      ctx.shadowColor = '#00f0ff';
      ctx.beginPath();
      ctx.arc(px1, py1, Math.max(1.2, 2.5 * scale1), 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  // =========================================================================
  // 3. Live 3D Hacking Streams (Pure Cyber-Blue Palette)
  // =========================================================================
  const HACK_LOGS = [
    '> INJECTING_PAYLOAD // OK',
    '> BYPASSING_FIREWALL // 100%',
    '> PRIVILEGE_ESCALATION [ROOT]',
    '> IUT_SEC_NET // ROOT_ACCESS',
    '> SYS_AUTH // BREACH_CONFIRMED',
    '> DECRYPTING_HASH // 0x7F8B92',
    '> PACKET_SNIFFER // INTERCEPTING',
    '> MEMORY_INJECTION // 0x004000',
    '> MAINFRAME // ROOT_SHELL_OPEN',
    '> EXPLOIT::BUFFER_OVERFLOW [OK]',
    '> PORT_SCAN::STEALTH_ACK [443]',
    '> KERNEL_HOOK // ATTACHED'
  ];

  const TAG_COUNT = 15;
  let hackTags = [];

  class HackingTag {
    constructor(customZ) {
      this.reset(customZ);
    }

    reset(customZ = null) {
      const quadrant = Math.floor(Math.random() * 4);
      if (quadrant === 0) { // Top Left
        this.x = -240 - Math.random() * 340;
        this.y = -130 - Math.random() * 150;
      } else if (quadrant === 1) { // Top Right
        this.x = 240 + Math.random() * 340;
        this.y = -130 - Math.random() * 150;
      } else if (quadrant === 2) { // Bottom Left
        this.x = -240 - Math.random() * 340;
        this.y = 130 + Math.random() * 150;
      } else { // Bottom Right
        this.x = 240 + Math.random() * 340;
        this.y = 130 + Math.random() * 150;
      }

      this.z = customZ !== null ? customZ : (DEPTH - Math.random() * 180);
      this.text = HACK_LOGS[Math.floor(Math.random() * HACK_LOGS.length)];
      this.speedMult = 1.0 + Math.random() * 0.35;
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

      const mainColor = `rgba(0, 240, 255, ${alpha * 0.95})`;

      // Status indicator dot
      const dotRadius = Math.max(1.8, 3.5 * scale);
      ctx.fillStyle = mainColor;
      ctx.shadowBlur = scale > 0.3 ? 8 : 0;
      ctx.shadowColor = '#00f0ff';
      ctx.beginPath();
      ctx.arc(px - 10 * scale, py - (fontSize * 0.35), dotRadius, 0, Math.PI * 2);
      ctx.fill();

      // Cyber text
      ctx.fillStyle = mainColor;
      ctx.shadowBlur = scale > 0.4 ? 6 : 0;
      ctx.fillText(this.text, px, py);

      // Underline trace on closer tags
      if (scale > 0.45) {
        const textWidth = ctx.measureText(this.text).width;
        ctx.strokeStyle = `rgba(0, 240, 255, ${alpha * 0.4})`;
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
  // 4. High-Speed Peripheral Cyber Photons
  // =========================================================================
  const PHOTON_COUNT = 55;
  let photons = [];

  class PeripheralPhoton {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      const isLeft = Math.random() > 0.5;
      this.x = (isLeft ? -1 : 1) * (380 + Math.random() * 260);
      this.y = (Math.random() - 0.5) * 450;
      this.z = initial ? Math.random() * DEPTH : DEPTH - Math.random() * 100;
      this.len = 60 + Math.random() * 110;
      this.speedMult = 1.3 + Math.random() * 1.8;
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
      grad.addColorStop(0, `rgba(0, 240, 255, ${alpha})`);
      grad.addColorStop(1, 'rgba(0, 119, 254, 0)');

      ctx.strokeStyle = grad;
      ctx.lineWidth = Math.max(0.8, 2.4 * scale1);
      ctx.beginPath();
      ctx.moveTo(px1, py1);
      ctx.lineTo(px2, py2);
      ctx.stroke();

      ctx.restore();
    }
  }

  // =========================================================================
  // Initialize & Main Animation Loop
  // =========================================================================
  function init() {
    resize();

    signals = [];
    for (let i = 0; i < SIGNAL_COUNT; i++) {
      signals.push(new CircuitSignal());
    }

    hackTags = [];
    const spacing = DEPTH / TAG_COUNT;
    for (let i = 0; i < TAG_COUNT; i++) {
      hackTags.push(new HackingTag(i * spacing + 80));
    }

    photons = [];
    for (let i = 0; i < PHOTON_COUNT; i++) {
      photons.push(new PeripheralPhoton());
    }
  }

  let lastScrollY = window.scrollY;

  function animate() {
    globalTime += 0.016;

    // Deep Dark Void Canvas Refresh (NO central light blob)
    ctx.fillStyle = 'rgba(3, 6, 14, 0.28)';
    ctx.fillRect(0, 0, width, height);

    // Smooth camera steer
    cx += (targetCx - cx) * 0.06;
    cy += (targetCy - cy) * 0.06;

    // Scroll speed acceleration
    if (scrollBoost > 0) {
      scrollBoost *= 0.93;
    }
    currentSpeed = baseSpeed + scrollBoost;
    circuitZOffset = (circuitZOffset + currentSpeed) % NODE_SPACING;

    // 1. Draw 3D PCB Circuit Boards (Floor & Ceiling with Solder Via Pads)
    drawCircuitBoard(false, currentSpeed); // Floor Circuit
    drawCircuitBoard(true, currentSpeed);  // Ceiling Circuit

    // 2. Draw Flowing Electrical Current Pulses along Circuit Traces
    signals.forEach(s => {
      s.update(currentSpeed);
      s.draw();
    });

    // 3. Draw Peripheral Cyber Photons
    photons.forEach(p => {
      p.update(currentSpeed);
      p.draw();
    });

    // 4. Draw Pure Blue 3D Hacking Logs
    hackTags.forEach(tag => {
      tag.update(currentSpeed);
      tag.draw();
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
