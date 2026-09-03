/**
 * Interactive Node Constellation Canvas with Words Generating from the Very Center
 * Sufi Mahbub Ahmed - Cybersecurity Portfolio
 * All blue & red security words originate from the very center of the screen
 * and stream outward in 3D perspective across the interactive constellation mesh.
 */

(function () {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let width, height;
  let cx, cy;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mouse interaction state
  const mouse = {
    x: null,
    y: null,
    radius: 175
  };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    cx = width / 2;
    cy = height / 2;
  }

  // =========================================================================
  // 1. Interactive Node Constellation Network
  // =========================================================================
  const NODE_COUNT = 85;
  const CONNECTION_DIST = 140;
  let nodes = [];

  class NetworkNode {
    constructor() {
      this.reset();
      this.x = Math.random() * width;
      this.y = Math.random() * height;
    }

    reset() {
      this.vx = (Math.random() - 0.5) * (prefersReducedMotion ? 0 : 0.55);
      this.vy = (Math.random() - 0.5) * (prefersReducedMotion ? 0 : 0.55);
      this.radius = Math.random() * 2 + 1;
      this.baseAlpha = Math.random() * 0.45 + 0.25;
      this.alpha = this.baseAlpha;
      this.isRed = Math.random() > 0.7; // 70% blue, 30% red
    }

    update() {
      if (prefersReducedMotion) return;

      this.x += this.vx;
      this.y += this.vy;

      // Wrap edges
      if (this.x < -20) this.x = width + 20;
      if (this.x > width + 20) this.x = -20;
      if (this.y < -20) this.y = height + 20;
      if (this.y > height + 20) this.y = -20;

      // Mouse proximity reaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const dirX = (dx / dist) * force * 2.2;
          const dirY = (dy / dist) * force * 2.2;
          this.x -= dirX;
          this.y -= dirY;
          this.alpha = Math.min(1, this.baseAlpha + 0.45);
        } else {
          this.alpha = this.baseAlpha;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

      if (this.isRed) {
        ctx.fillStyle = `rgba(255, 51, 102, ${this.alpha * 1.1})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(255, 51, 102, 0.8)';
      } else {
        ctx.fillStyle = `rgba(0, 240, 255, ${this.alpha * 1.1})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(0, 240, 255, 0.8)';
      }

      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function drawConstellationLines() {
    for (let a = 0; a < nodes.length; a++) {
      for (let b = a + 1; b < nodes.length; b++) {
        const dx = nodes[a].x - nodes[b].x;
        const dy = nodes[a].y - nodes[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECTION_DIST) {
          const opacity = (1 - dist / CONNECTION_DIST) * 0.22;
          ctx.beginPath();

          if (nodes[a].isRed || nodes[b].isRed) {
            ctx.strokeStyle = `rgba(255, 51, 102, ${opacity * 0.85})`;
          } else {
            ctx.strokeStyle = `rgba(0, 240, 255, ${opacity})`;
          }

          ctx.lineWidth = 0.85;
          ctx.moveTo(nodes[a].x, nodes[a].y);
          ctx.lineTo(nodes[b].x, nodes[b].y);
          ctx.stroke();
        }
      }

      // Mouse connection line
      if (mouse.x !== null && mouse.y !== null) {
        const dx = nodes[a].x - mouse.x;
        const dy = nodes[a].y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const opacity = (1 - dist / mouse.radius) * 0.45;
          ctx.beginPath();
          ctx.strokeStyle = nodes[a].isRed
            ? `rgba(255, 51, 102, ${opacity})`
            : `rgba(0, 240, 255, ${opacity})`;
          ctx.lineWidth = 1.2;
          ctx.moveTo(nodes[a].x, nodes[a].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }
  }

  // =========================================================================
  // 2. 3D Security Words Generating From The Very Center
  // =========================================================================
  const WORDS_BLUE = [
    '> SYS_AUTH // ACCESS GRANTED',
    '> MAINFRAME // LEVEL 01',
    '> IUT_SEC_NET // ROOT_ACCESS',
    '> DECRYPTING_HASH // 0x7F8B',
    '> MEMORY_INJECTION // 0x0040',
    '> PACKET_SNIFFER // ACTIVE',
    '> PORT_SCAN::STEALTH_ACK [443]',
    '> KERNEL_HOOK // ATTACHED',
    '> TLS_HANDSHAKE // VERIFIED',
    '> DEFENSE_NODE // ONLINE',
    '> CORE_PIPELINE // CONNECTED',
    '> BUFFER_ALLOC // 0x7FFF'
  ];

  const WORDS_RED = [
    '> FIREWALL // BYPASS OK',
    '> SYS_AUTH // BREACH_CONFIRMED',
    '> INJECTING_PAYLOAD // CRITICAL',
    '> EXPLOIT::BUFFER_OVERFLOW [ALERT]',
    '> PRIVILEGE_ESCALATION [BREACH]',
    '> SECURITY_ALERT // INTRUSION_OK',
    '> PAYLOAD_DELIVERY // SUCCESS',
    '> ZERO_DAY // EXECUTION_OK',
    '> ROOTKIT // ACTIVE_INTRUSION',
    '> KERNEL_PANIC::OVERRIDE'
  ];

  const FOCAL_LENGTH = 320;
  const DEPTH = 2000;
  const WORD_COUNT = 32;
  let centerWords = [];

  class CenterOriginWord {
    constructor(initialZ) {
      this.reset(initialZ);
    }

    reset(customZ = null) {
      this.isRed = Math.random() > 0.5; // 50% Blue, 50% Red
      this.text = this.isRed
        ? WORDS_RED[Math.floor(Math.random() * WORDS_RED.length)]
        : WORDS_BLUE[Math.floor(Math.random() * WORDS_BLUE.length)];

      // Radial angle outward in 360 degrees
      this.angle = Math.random() * Math.PI * 2;
      
      // Target trajectory width and height in 3D
      const spreadX = 450 + Math.random() * 550;
      const spreadY = 280 + Math.random() * 380;
      this.x = Math.cos(this.angle) * spreadX;
      this.y = Math.sin(this.angle) * spreadY;

      // Start depth at the far distance (projects directly to the very middle cx, cy)
      this.z = customZ !== null ? customZ : (DEPTH - Math.random() * 80);
      this.speed = (Math.random() * 2.2 + 3.8);
    }

    update() {
      this.z -= this.speed;

      // When the word zooms past the screen, immediately respawn right at the very center
      if (this.z <= 30) {
        this.reset();
      }
    }

    draw() {
      if (this.z <= 35) return;
      const scale = FOCAL_LENGTH / this.z;

      // Screen projection: when z is large, (px, py) is at the exact center (cx, cy)
      const px = cx + this.x * scale;
      const py = cy + this.y * scale;

      // Opacity: starts as it emerges from the center, peaks mid-flight, stays visible
      const depthFactor = 1 - (this.z / DEPTH);
      const alpha = Math.min(0.92, Math.max(0, depthFactor * 1.1));

      if (alpha <= 0.02) return;

      const fontSize = Math.max(6.5, 14 * scale);
      ctx.save();
      ctx.font = `600 ${fontSize}px "JetBrains Mono", monospace`;

      const colorStr = this.isRed
        ? `rgba(255, 51, 102, ${alpha})`
        : `rgba(0, 240, 255, ${alpha})`;

      const glowStr = this.isRed ? '#ff3366' : '#00f0ff';

      // Status indicator dot
      ctx.fillStyle = colorStr;
      ctx.shadowBlur = scale > 0.3 ? 6 : 0;
      ctx.shadowColor = glowStr;
      ctx.beginPath();
      ctx.arc(px - 8 * scale, py - (fontSize * 0.32), Math.max(1.2, 2.8 * scale), 0, Math.PI * 2);
      ctx.fill();

      // Word string
      ctx.fillStyle = colorStr;
      ctx.shadowBlur = scale > 0.4 ? 4 : 0;
      ctx.shadowColor = glowStr;
      ctx.fillText(this.text, px, py);

      ctx.restore();
    }
  }

  // =========================================================================
  // Initialize & Main Animation Loop
  // =========================================================================
  function init() {
    resize();

    // Spawn constellation nodes
    nodes = [];
    const count = Math.min(NODE_COUNT, Math.floor((width * height) / 14000));
    for (let i = 0; i < count; i++) {
      nodes.push(new NetworkNode());
    }

    // Spawn 32 words with staggered depths so they continuously erupt from the center
    centerWords = [];
    const spacing = DEPTH / WORD_COUNT;
    for (let i = 0; i < WORD_COUNT; i++) {
      centerWords.push(new CenterOriginWord(i * spacing + 60));
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Constellation Network Lines
    drawConstellationLines();

    // 2. Draw Interactive Constellation Nodes
    nodes.forEach(n => {
      n.update();
      n.draw();
    });

    // 3. Draw Words Originating and Erupting from the Very Center
    centerWords.forEach(w => {
      w.update();
      w.draw();
    });

    animationFrameId = requestAnimationFrame(animate);
  }

  // Event Listeners
  window.addEventListener('resize', () => {
    resize();
    init();
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  init();
  animate();
})();
