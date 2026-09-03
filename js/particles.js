/**
 * Interactive Node Constellation Canvas with Blue & Red Cyber Breach Words
 * Sufi Mahbub Ahmed - Cybersecurity Portfolio
 * Features connected network nodes that react to mouse movements alongside
 * streaming blue and red security access / hacking status words.
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
    radius: 170
  };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  // =========================================================================
  // 1. Interactive Node Constellation Network
  // =========================================================================
  const NODE_COUNT = 75;
  const CONNECTION_DIST = 135;
  let nodes = [];

  class NetworkNode {
    constructor() {
      this.reset();
      this.x = Math.random() * width;
      this.y = Math.random() * height;
    }

    reset() {
      this.vx = (Math.random() - 0.5) * (prefersReducedMotion ? 0 : 0.6);
      this.vy = (Math.random() - 0.5) * (prefersReducedMotion ? 0 : 0.6);
      this.radius = Math.random() * 2 + 1;
      this.baseAlpha = Math.random() * 0.45 + 0.25;
      this.alpha = this.baseAlpha;
      // 70% blue/cyan nodes, 30% red alert nodes
      this.isRed = Math.random() > 0.7;
    }

    update() {
      if (prefersReducedMotion) return;

      this.x += this.vx;
      this.y += this.vy;

      // Wrap screen edges
      if (this.x < -20) this.x = width + 20;
      if (this.x > width + 20) this.x = -20;
      if (this.y < -20) this.y = height + 20;
      if (this.y > height + 20) this.y = -20;

      // Mouse repulsion / proximity reaction
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

  // Draw connecting constellation lines
  function drawConstellationLines() {
    for (let a = 0; a < nodes.length; a++) {
      for (let b = a + 1; b < nodes.length; b++) {
        const dx = nodes[a].x - nodes[b].x;
        const dy = nodes[a].y - nodes[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECTION_DIST) {
          const opacity = (1 - dist / CONNECTION_DIST) * 0.22;
          ctx.beginPath();

          // Mix colors if one is red
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

      // Connect to mouse cursor
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
  // 2. Floating Blue and Red Hacking / System Words
  // =========================================================================
  const WORDS_BLUE = [
    '> SYS_AUTH // ACCESS GRANTED',
    '> MAINFRAME // LEVEL 01',
    '> IUT_SEC_NET // ROOT_ACCESS',
    '> DECRYPTING_HASH // 0x7F8B',
    '> MEMORY_INJECTION // 0x0040',
    '> PACKET_SNIFFER // ACTIVE',
    '> PORT_SCAN::STEALTH_ACK [443]',
    '> KERNEL_HOOK // ATTACHED'
  ];

  const WORDS_RED = [
    '> FIREWALL // BYPASS OK',
    '> SYS_AUTH // BREACH_CONFIRMED',
    '> INJECTING_PAYLOAD // CRITICAL',
    '> EXPLOIT::BUFFER_OVERFLOW [ALERT]',
    '> PRIVILEGE_ESCALATION [BREACH]',
    '> SECURITY_ALERT // INTRUSION_OK'
  ];

  const FLOATING_WORD_COUNT = 14;
  let floatingWords = [];

  class FloatingWord {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.isRed = Math.random() > 0.5; // 50% Blue, 50% Red
      this.text = this.isRed
        ? WORDS_RED[Math.floor(Math.random() * WORDS_RED.length)]
        : WORDS_BLUE[Math.floor(Math.random() * WORDS_BLUE.length)];

      this.x = Math.random() * (width - 150) + 50;
      this.y = initial ? Math.random() * (height - 50) + 50 : (Math.random() > 0.5 ? -30 : height + 30);
      
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      if (Math.abs(this.vx) < 0.1) this.vx = 0.2;
      if (Math.abs(this.vy) < 0.1) this.vy = -0.2;

      this.fontSize = Math.floor(Math.random() * 3) + 11; // 11px - 13px
      this.maxAlpha = Math.random() * 0.35 + 0.45; // 0.45 - 0.8
      this.alpha = 0;
      this.fadeState = 'in'; // 'in', 'hold', 'out'
      this.lifeTime = Math.random() * 300 + 200;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Handle smooth fade in / fade out
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

      // Edge reset
      if (this.x < -100 || this.x > width + 100 || this.y < -50 || this.y > height + 50) {
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

      // Text string
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

    // Spawn network nodes
    nodes = [];
    const count = Math.min(NODE_COUNT, Math.floor((width * height) / 14000));
    for (let i = 0; i < count; i++) {
      nodes.push(new NetworkNode());
    }

    // Spawn blue and red floating words
    floatingWords = [];
    for (let i = 0; i < FLOATING_WORD_COUNT; i++) {
      floatingWords.push(new FloatingWord());
    }
  }

  function animate() {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Constellation Network Lines
    drawConstellationLines();

    // 2. Update and Draw Nodes
    nodes.forEach(n => {
      n.update();
      n.draw();
    });

    // 3. Update and Draw Floating Blue & Red Hacking Words
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
