/**
 * 3D Cyberspace System Warp Engine
 * Sufi Mahbub Ahmed - Cybersecurity Portfolio
 * Simulates traveling at warp speed through an infinite digital cybersecurity system / data tunnel
 */

(function () {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let width, height;
  let cx, cy;
  let targetCx, targetCy;

  // Check reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Warp parameters
  const FOCAL_LENGTH = 350;
  const TUNNEL_DEPTH = 1800;
  let BASE_SPEED = prefersReducedMotion ? 0 : 3.8;
  let currentSpeed = BASE_SPEED;
  let scrollBoost = 0;

  // Mouse steer tracking
  let mouse = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0
  };

  // Resize handler
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    cx = width / 2;
    cy = height / 2;
    targetCx = cx;
    targetCy = cy;
  }

  // =========================================================================
  // 1. Cyber Tunnel Ring Gates (Concentric 3D Polygons)
  // =========================================================================
  const RING_COUNT = 14;
  const RING_SPACING = TUNNEL_DEPTH / RING_COUNT;
  let rings = [];

  class TunnelRing {
    constructor(z) {
      this.z = z;
      this.w = 700;
      this.h = 450;
    }

    update(speed) {
      this.z -= speed;
      if (this.z <= 20) {
        this.z += TUNNEL_DEPTH;
      }
    }

    draw() {
      if (this.z <= 30) return;
      const scale = FOCAL_LENGTH / this.z;
      const screenW = this.w * scale;
      const screenH = this.h * scale;
      const x = cx - screenW / 2;
      const y = cy - screenH / 2;

      // Distance opacity
      const depthFactor = 1 - (this.z / TUNNEL_DEPTH);
      const alpha = Math.min(1, Math.max(0, depthFactor * 0.45));

      if (alpha <= 0.01) return;

      // Outer gate box
      ctx.save();
      ctx.strokeStyle = `rgba(0, 240, 255, ${alpha * 0.75})`;
      ctx.lineWidth = Math.max(0.8, 1.8 * scale);

      // Rounded cyber box
      const r = Math.min(20, 15 * scale);
      ctx.beginPath();
      ctx.roundRect(x, y, screenW, screenH, r);
      ctx.stroke();

      // Corner tech marks
      const cornerLen = Math.min(25, 20 * scale);
      ctx.strokeStyle = `rgba(0, 240, 255, ${alpha * 1.4})`;
      ctx.lineWidth = Math.max(1.2, 2.5 * scale);

      // Top Left Corner
      ctx.beginPath();
      ctx.moveTo(x, y + cornerLen);
      ctx.lineTo(x, y);
      ctx.lineTo(x + cornerLen, y);
      // Top Right Corner
      ctx.moveTo(x + screenW - cornerLen, y);
      ctx.lineTo(x + screenW, y);
      ctx.lineTo(x + screenW, y + cornerLen);
      // Bottom Left Corner
      ctx.moveTo(x, y + screenH - cornerLen);
      ctx.lineTo(x, y + screenH);
      ctx.lineTo(x + cornerLen, y + screenH);
      // Bottom Right Corner
      ctx.moveTo(x + screenW - cornerLen, y + screenH);
      ctx.lineTo(x + screenW, y + screenH);
      ctx.lineTo(x + screenW, y + screenH - cornerLen);
      ctx.stroke();

      ctx.restore();
    }
  }

  // =========================================================================
  // 2. High-Speed 3D Data Streaks / Light Rays
  // =========================================================================
  const STREAK_COUNT = 85;
  let streaks = [];

  class DataStreak {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      // Cylindrical / tunnel distribution
      const angle = Math.random() * Math.PI * 2;
      const radius = 220 + Math.random() * 320;
      this.x = Math.cos(angle) * radius;
      this.y = Math.sin(angle) * radius;
      this.z = initial ? Math.random() * TUNNEL_DEPTH : TUNNEL_DEPTH - Math.random() * 100;
      this.len = 40 + Math.random() * 80;
      this.speedMult = 1.2 + Math.random() * 1.5;
      this.isCyan = Math.random() > 0.35;
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

      const depthFactor = 1 - (this.z / TUNNEL_DEPTH);
      const alpha = Math.min(1, Math.max(0, depthFactor * 0.7));

      if (alpha <= 0.01) return;

      ctx.save();
      const grad = ctx.createLinearGradient(px1, py1, px2, py2);
      if (this.isCyan) {
        grad.addColorStop(0, `rgba(0, 240, 255, ${alpha})`);
        grad.addColorStop(1, `rgba(0, 119, 254, 0)`);
      } else {
        grad.addColorStop(0, `rgba(56, 189, 248, ${alpha})`);
        grad.addColorStop(1, `rgba(139, 92, 246, 0)`);
      }

      ctx.strokeStyle = grad;
      ctx.lineWidth = Math.max(0.7, 2.2 * scale1);
      ctx.beginPath();
      ctx.moveTo(px1, py1);
      ctx.lineTo(px2, py2);
      ctx.stroke();

      // Glowing head
      if (scale1 > 0.6) {
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
        ctx.beginPath();
        ctx.arc(px1, py1, Math.max(1, 1.8 * scale1), 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  // =========================================================================
  // 3. Floating 3D Cyber Code / Data Packets (Flying Hex & Symbols)
  // =========================================================================
  const CODE_SNIPPETS = [
    '01', '0x7F', 'SYS.SEC', 'AUTH.OK', 'SYN', 'ACK',
    'PORT:443', '0x1A', 'NET.PACKET', 'SEC_READY', '200 OK',
    'TLSv1.3', 'HASH.SHA256', '0xFE', '0101', 'VULN_SCAN'
  ];
  const CODE_COUNT = 18;
  let codePackets = [];

  class CyberCodePacket {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 180 + Math.random() * 260;
      this.x = Math.cos(angle) * radius;
      this.y = Math.sin(angle) * radius;
      this.z = initial ? Math.random() * TUNNEL_DEPTH : TUNNEL_DEPTH;
      this.text = CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)];
      this.color = Math.random() > 0.5 ? 'rgba(0, 240, 255, ' : 'rgba(56, 189, 248, ';
    }

    update(speed) {
      this.z -= speed * 1.1;
      if (this.z <= 30) {
        this.reset();
      }
    }

    draw() {
      if (this.z <= 40) return;
      const scale = FOCAL_LENGTH / this.z;
      const px = cx + this.x * scale;
      const py = cy + this.y * scale;

      const depthFactor = 1 - (this.z / TUNNEL_DEPTH);
      const alpha = Math.min(0.65, Math.max(0, depthFactor * 0.65));

      if (alpha <= 0.02) return;

      const fontSize = Math.max(7, 13 * scale);
      ctx.save();
      ctx.font = `600 ${fontSize}px "JetBrains Mono", monospace`;
      ctx.fillStyle = this.color + alpha + ')';
      ctx.fillText(this.text, px, py);
      ctx.restore();
    }
  }

  // =========================================================================
  // 4. Perspective Tunnel Rails (Grid Lines from Center to Edges)
  // =========================================================================
  function drawPerspectiveRails() {
    ctx.save();
    ctx.lineWidth = 0.8;

    const corners = [
      { x: -350, y: -225 }, // Top-Left
      { x: 350, y: -225 },  // Top-Right
      { x: -350, y: 225 },  // Bottom-Left
      { x: 350, y: 225 },   // Bottom-Right
      { x: 0, y: -225 },    // Top-Center
      { x: 0, y: 225 },     // Bottom-Center
      { x: -350, y: 0 },    // Left-Center
      { x: 350, y: 0 }      // Right-Center
    ];

    corners.forEach((c, idx) => {
      const isCorner = idx < 4;
      const scaleNear = FOCAL_LENGTH / 40;
      const scaleFar = FOCAL_LENGTH / TUNNEL_DEPTH;

      const x1 = cx + c.x * scaleFar;
      const y1 = cy + c.y * scaleFar;
      const x2 = cx + c.x * scaleNear;
      const y2 = cy + c.y * scaleNear;

      const grad = ctx.createLinearGradient(x1, y1, x2, y2);
      grad.addColorStop(0, 'rgba(0, 240, 255, 0.03)');
      grad.addColorStop(0.7, isCorner ? 'rgba(0, 240, 255, 0.25)' : 'rgba(0, 119, 254, 0.12)');
      grad.addColorStop(1, 'rgba(0, 240, 255, 0)');

      ctx.strokeStyle = grad;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    });

    ctx.restore();
  }

  // =========================================================================
  // 5. Central System Core (Vanishing Point Glow & Vortex)
  // =========================================================================
  function drawSystemCore() {
    ctx.save();
    const coreGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 140);
    coreGrad.addColorStop(0, 'rgba(0, 240, 255, 0.35)');
    coreGrad.addColorStop(0.3, 'rgba(0, 119, 254, 0.18)');
    coreGrad.addColorStop(0.7, 'rgba(11, 19, 36, 0.05)');
    coreGrad.addColorStop(1, 'transparent');

    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 140, 0, Math.PI * 2);
    ctx.fill();

    // Central bright nexus dot
    ctx.fillStyle = 'rgba(0, 240, 255, 0.8)';
    ctx.shadowBlur = 12;
    ctx.shadowColor = 'rgba(0, 240, 255, 1)';
    ctx.beginPath();
    ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // =========================================================================
  // Initialization & Animation Loop
  // =========================================================================
  function init() {
    resize();
    rings = [];
    for (let i = 0; i < RING_COUNT; i++) {
      rings.push(new TunnelRing(i * RING_SPACING + 40));
    }

    streaks = [];
    for (let i = 0; i < STREAK_COUNT; i++) {
      streaks.push(new DataStreak());
    }

    codePackets = [];
    for (let i = 0; i < CODE_COUNT; i++) {
      codePackets.push(new CyberCodePacket());
    }
  }

  let lastScrollY = window.scrollY;

  function animate() {
    // Clear screen with deep cyber blue trail fade
    ctx.fillStyle = 'rgba(4, 7, 17, 0.28)';
    ctx.fillRect(0, 0, width, height);

    // Smooth camera steer towards mouse target
    cx += (targetCx - cx) * 0.06;
    cy += (targetCy - cy) * 0.06;

    // Scroll speed dampening
    if (scrollBoost > 0) {
      scrollBoost *= 0.92;
    }
    currentSpeed = BASE_SPEED + scrollBoost;

    // Render 3D Cyberspace Layers
    drawSystemCore();
    drawPerspectiveRails();

    rings.forEach(ring => {
      ring.update(currentSpeed);
      ring.draw();
    });

    streaks.forEach(streak => {
      streak.update(currentSpeed);
      streak.draw();
    });

    codePackets.forEach(code => {
      code.update(currentSpeed);
      code.draw();
    });

    animationFrameId = requestAnimationFrame(animate);
  }

  // =========================================================================
  // Interactive Event Listeners
  // =========================================================================
  window.addEventListener('resize', () => {
    resize();
    init();
  });

  // Mouse Steer (shifts perspective vanishing point subtly)
  window.addEventListener('mousemove', (e) => {
    const mouseNormX = (e.clientX / width) - 0.5;
    const mouseNormY = (e.clientY / height) - 0.5;
    targetCx = (width / 2) + mouseNormX * 120;
    targetCy = (height / 2) + mouseNormY * 90;
  });

  window.addEventListener('mouseleave', () => {
    targetCx = width / 2;
    targetCy = height / 2;
  });

  // Scroll acceleration
  window.addEventListener('scroll', () => {
    const delta = Math.abs(window.scrollY - lastScrollY);
    lastScrollY = window.scrollY;
    scrollBoost = Math.min(12, scrollBoost + delta * 0.15);
  }, { passive: true });

  init();
  animate();
})();
