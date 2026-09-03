/**
 * Interactive Node Constellation Canvas with Full-Screen Blue & Red Security Words
 * Sufi Mahbub Ahmed - Cybersecurity Portfolio
 * Distributes streaming blue and red security words across the entire screen
 * (top, middle, and bottom zones) alongside mouse-reactive constellation nodes.
 */

(function () {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let width, height;

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
  }

  // =========================================================================
  // 1. Interactive Node Constellation Network
  // =========================================================================
  const NODE_COUNT = 80;
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

      // Mouse proximity interaction
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
  // 2. Full-Screen Blue & Red Security Words (Top, Middle, and Bottom Bands)
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
    '> DEFENSE_NODE // ONLINE'
  ];

  const WORDS_RED = [
    '> FIREWALL // BYPASS OK',
    '> SYS_AUTH // BREACH_CONFIRMED',
    '> INJECTING_PAYLOAD // CRITICAL',
    '> EXPLOIT::BUFFER_OVERFLOW [ALERT]',
    '> PRIVILEGE_ESCALATION [BREACH]',
    '> SECURITY_ALERT // INTRUSION_OK',
    '> PAYLOAD_DELIVERY // SUCCESS',
    '> ZERO_DAY // EXECUTION_OK'
  ];

  const FLOATING_WORD_COUNT = 24; // Abundant coverage across entire screen
  let floatingWords = [];

  class FullScreenFloatingWord {
    constructor(zoneIndex) {
      this.zoneIndex = zoneIndex;
      this.reset(true);
    }

    reset(initial = false) {
      this.isRed = Math.random() > 0.5; // 50% Blue, 50% Red
      this.text = this.isRed
        ? WORDS_RED[Math.floor(Math.random() * WORDS_RED.length)]
        : WORDS_BLUE[Math.floor(Math.random() * WORDS_BLUE.length)];

      // Distribute strictly across 4 screen bands (0 = Top, 1 = Upper Mid, 2 = Lower Mid, 3 = Bottom)
      const band = this.zoneIndex % 4;
      const zoneHeight = height / 4;
      const minY = band * zoneHeight + 20;
      const maxY = (band + 1) * zoneHeight - 20;

      // X position
      if (initial) {
        this.x = Math.random() * (width - 240) + 20;
      } else {
        // Spawn from left or right edge
        this.x = Math.random() > 0.5 ? -260 : width + 20;
      }

      this.y = Math.random() * (maxY - minY) + minY;

      const dir = Math.random() > 0.5 ? 1 : -1;
      this.vx = dir * (Math.random() * 0.4 + 0.22);
      this.vy = (Math.random() - 0.5) * 0.18;

      this.fontSize = Math.floor(Math.random() * 3) + 11;
      this.maxAlpha = Math.random() * 0.35 + 0.48;
      this.alpha = initial ? (Math.random() * 0.35 + 0.35) : 0;
      this.fadeState = initial ? 'hold' : 'in';
      this.lifeTime = Math.random() * 450 + 250;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Smooth fade lifecycle
      if (this.fadeState === 'in') {
        this.alpha += 0.015;
        if (this.alpha >= this.maxAlpha) {
          this.alpha = this.maxAlpha;
          this.fadeState = 'hold';
        }
      } else if (this.fadeState === 'hold') {
        this.lifeTime--;
        if (this.lifeTime <= 0) {
          this.fadeState = 'out';
        }
      } else if (this.fadeState === 'out') {
        this.alpha -= 0.015;
        if (this.alpha <= 0) {
          this.reset();
        }
      }

      // Boundary reset
      if (this.x < -300 || this.x > width + 100) {
        this.reset();
      }
    }

    draw() {
      if (this.alpha <= 0.01) return;

      ctx.save();
      ctx.font = `600 ${this.fontSize}px "JetBrains Mono", monospace`;

      const colorStr = this.isRed
        ? `rgba(255, 51, 102, ${this.alpha})`
        : `rgba(0, 240, 255, ${this.alpha})`;

      const glowStr = this.isRed ? '#ff3366' : '#00f0ff';

      // Status indicator dot
      ctx.fillStyle = colorStr;
      ctx.shadowBlur = 6;
      ctx.shadowColor = glowStr;
      ctx.beginPath();
      ctx.arc(this.x - 8, this.y - (this.fontSize * 0.35), 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Word string
      ctx.fillStyle = colorStr;
      ctx.shadowBlur = 4;
      ctx.shadowColor = glowStr;
      ctx.fillText(this.text, this.x, this.y);

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

    // Spawn words evenly across Top, Upper Mid, Lower Mid, and Bottom zones
    floatingWords = [];
    for (let i = 0; i < FLOATING_WORD_COUNT; i++) {
      floatingWords.push(new FullScreenFloatingWord(i));
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

    // 3. Draw Blue & Red Words Across Top, Middle, and Bottom
    floatingWords.forEach(w => {
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
