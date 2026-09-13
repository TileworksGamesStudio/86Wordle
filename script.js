(function () {
  "use strict";

  // Configuration & External Links compliant with Section 6
  const HOME_PAGE_URL = "https://tileworksgamesstudio.github.io/86/"; 
  const STORAGE_KEY = "COCKTAIL_word_guess_data_v1";
  const CSV_FILE = "puzzles.csv";
  const RELEASE_TIMEZONE = "UTC"; // Explicit IANA release timezone

  // Built-in fallback puzzle dataset for offline & resilient operation
  const FALLBACK_PUZZLES = [
    { date: "2025-05-18", word: "PRIDE", definition: "A feeling of deep satisfaction from one's achievements." },
    { date: "2025-05-19", word: "CLEAN", definition: "Free from dirt, marks, or unwanted matter." },
    { date: "2025-05-20", word: "LIGHT", definition: "The natural agent that stimulates sight." },
    { date: "2025-05-21", word: "BRAVE", definition: "Ready to face danger or pain; showing courage." },
    { date: "2025-05-22", word: "SHARP", definition: "Having an edge or point that is able to cut or pierce." },
    { date: "2025-05-23", word: "SWIFT", definition: "Happening quickly or moving with great speed." },
    { date: "2025-05-24", word: "CRANE", definition: "A large tall machine used for moving heavy objects." }
  ];

  const VALID_WORDS = new Set([
    "ABOUT", "ABOVE", "ABUSE", "ACTOR", "ACUTE", "ADMIT", "ADOPT", "ADULT", "AFTER", "AGAIN",
    "AGENT", "AGREE", "AHEAD", "ALARM", "ALBUM", "ALERT", "ALIKE", "ALIVE", "ALLOW", "ALONE",
    "ALONG", "ALTER", "AMONG", "ANGER", "ANGLE", "ANGRY", "APART", "APPLE", "APPLY", "ARENA",
    "ARGUE", "ARISE", "ARMED", "ARRAY", "ASIDE", "ASSET", "AUDIO", "AUDIT", "AVOID", "AWARD",
    "AWARE", "BADLY", "BAKER", "BASES", "BASIC", "BASIS", "BEACH", "BEGAN", "BEGIN", "BEGUN",
    "BEING", "BELOW", "BENCH", "BILLY", "BIRTH", "BLACK", "BLAME", "BLIND", "BLOCK", "BLOOD",
    "BOARD", "BOOST", "BOOTH", "BOUND", "BRAIN", "BRAND", "BRAVE", "BREAD", "BREAK", "BREED",
    "BRIEF", "BRING", "BROAD", "BROKE", "BROWN", "BUILD", "CABLE", "CARRY", "CATCH", "CAUSE",
    "CHAIN", "CHAIR", "CHART", "CHASE", "CHEAP", "CHECK", "CHEST", "CHIEF", "CHILD", "CHOSE",
    "CIVIL", "CLAIM", "CLASS", "CLEAN", "CLEAR", "CLICK", "CLOCK", "CLOSE", "COAST", "COULD",
    "COUNT", "COURT", "COVER", "CRAFT", "CRANE", "CREAM", "CRIME", "CROSS", "CROWD", "CROWN",
    "CURVE", "CYCLE", "DAILY", "DANCE", "DATED", "DEALT", "DEATH", "DEBUT", "DELAY", "DEPTH",
    "DOING", "DOUBT", "DOZEN", "DRAFT", "DRAMA", "DRAWN", "DREAM", "DRESS", "DRILL", "DRINK",
    "DRIVE", "DROVE", "DYING", "EAGER", "EARLY", "EARTH", "EIGHT", "ELITE", "EMPTY", "ENEMY",
    "ENJOY", "ENTER", "ENTRY", "EQUAL", "ERROR", "EVENT", "EVERY", "EXACT", "EXIST", "EXTRA",
    "FAITH", "FALSE", "FAULT", "FIBER", "FIELD", "FIFTH", "FIFTY", "FIGHT", "FINAL", "FIRST",
    "FIXED", "FLASH", "FLEET", "FLOOR", "FLUID", "FOCUS", "FORCE", "FORTH", "FORTY", "FORUM",
    "FOUND", "FRAME", "FRANK", "FRAUD", "FRESH", "FRONT", "FRUIT", "FULLY", "FUNNY", "GIANT",
    "GIVEN", "GLASS", "GLOBE", "GOING", "GRACE", "GRADE", "GRAIN", "GRAND", "GRANT", "GRASS",
    "GREAT", "GREEN", "GROSS", "GROUP", "GROWN", "GUARD", "GUESS", "GUEST", "GUIDE", "HAPPY",
    "HEART", "HEAVY", "HENCE", "HONEY", "HORSE", "HOTEL", "HOUSE", "HUMAN", "IDEAL", "IMAGE",
    "INDEX", "INNER", "INPUT", "ISSUE", "JOINT", "JUDGE", "JUICE", "KNIFE", "KNOWN", "LABEL",
    "LARGE", "LASER", "LATER", "LAUGH", "LAYER", "LEARN", "LEASE", "LEAST", "LEAVE", "LEGAL",
    "LEMON", "LEVEL", "LIGHT", "LIMIT", "LINKS", "LIVES", "LOCAL", "LOGIC", "LOOSE", "LOWER",
    "LUCKY", "LUNCH", "MAGIC", "MAJOR", "MAKER", "MARCH", "MATCH", "MAYBE", "MAYOR", "MEANT",
    "MEDIA", "METAL", "MIGHT", "MINOR", "MINUS", "MIXED", "MODEL", "MONEY", "MONTH", "MORAL",
    "MOTOR", "MOUNT", "MOUSE", "MOUTH", "MOVIE", "MUSIC", "NEEDS", "NEVER", "NEWLY", "NIGHT",
    "NOISE", "NORTH", "NOTED", "NOVEL", "NURSE", "OCCUR", "OFFER", "OFTEN", "ORDER", "OTHER",
    "OUGHT", "PAINT", "PANEL", "PAPER", "PARTY", "PEACE", "PHASE", "PHONE", "PHOTO", "PIECE",
    "PILOT", "PITCH", "PLACE", "PLAIN", "PLANE", "PLANT", "PLATE", "POINT", "POUND", "POWER",
    "PRESS", "PRICE", "PRIDE", "PRIME", "PRINT", "PRIOR", "PRIZE", "PROOF", "PROUD", "PROVE",
    "QUEEN", "QUICK", "QUIET", "QUITE", "RADIO", "RAISE", "RANGE", "RAPID", "RATIO", "REACH",
    "READY", "REFER", "RIGHT", "RIVAL", "RIVER", "ROUGH", "ROUND", "ROUTE", "ROYAL", "RURAL",
    "SCALE", "SCENE", "SCOPE", "SCORE", "SENSE", "SERVE", "SEVEN", "SHALL", "SHAPE", "SHARE",
    "SHARP", "SHEET", "SHELF", "SHELL", "SHIFT", "SHIRT", "SHOCK", "SHOOT", "SHORT", "SHOWN",
    "SIGHT", "SINCE", "SIXTH", "SIXTY", "SIZED", "SKILL", "SLEEP", "SLIDE", "SMALL", "SMART",
    "SMILE", "SMOKE", "SOLID", "SOLVE", "SORRY", "SOUND", "SOUTH", "SPACE", "SPARE", "SPEAK",
    "SPEED", "SPEND", "SPENT", "SPLIT", "SPOKE", "SPORT", "STAFF", "STAGE", "STAKE", "STAND",
    "START", "STATE", "STEAM", "STEEL", "STICK", "STILL", "STOCK", "STONE", "STOOD", "STORE",
    "STORM", "STORY", "STRIP", "STUDY", "STUFF", "STYLE", "SUGAR", "SUITE", "SUPER", "SWEET",
    "SWIFT", "TABLE", "TAKEN", "TASTE", "TAXES", "TEACH", "TEETH", "THANK", "THEFT", "THEIR",
    "THEME", "THERE", "THESE", "THICK", "THING", "THINK", "THIRD", "THOSE", "THREE", "THREW",
    "THROW", "TIGHT", "TIMES", "TIRED", "TITLE", "TODAY", "TOPIC", "TOTAL", "TOUCH", "TOUGH",
    "TOWER", "TRACK", "TRADE", "TRAIN", "TREAT", "TREND", "TRIAL", "TRIED", "TRIES", "TRUCK",
    "TRULY", "TRUST", "TRUTH", "TWICE", "UNDER", "UNDUE", "UNION", "UNITY", "UNTIL", "UPON",
    "UPPER", "UPSET", "URBAN", "USAGE", "USUAL", "VALID", "VALUE", "VIDEO", "VIRUS", "VISIT",
    "VITAL", "VOICE", "WASTE", "WATCH", "WATER", "WHEEL", "WHERE", "WHICH", "WHILE", "WHITE",
    "WHOLE", "WHOSE", "WOMAN", "WOMEN", "WORLD", "WORRY", "WORSE", "WORST", "WORTH", "WOULD",
    "WOUND", "WRITE", "WRONG", "WROTE", "YIELD", "YOUNG", "YOUTH"
  ]);

  /* ==========================================================================
     SUBTLE WEB AUDIO SYNTHESIZER (NO EXTERNAL ASSETS / GESTURE SAFE)
     ========================================================================== */
  class SpeakeasyAudio {
    constructor() {
      this.ctx = null;
    }

    init() {
      if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
        try {
          const AudioContextClass = window.AudioContext || window.webkitAudioContext;
          this.ctx = new AudioContextClass();
        } catch (e) {
          this.ctx = null;
        }
      }
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }
    }

    playKeyTick() {
      try {
        this.init();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(1400, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.035);

        gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.035);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.04);
      } catch (e) {}
    }

    playButtonTap() {
      try {
        this.init();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(420, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(260, this.ctx.currentTime + 0.05);

        gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.06);
      } catch (e) {}
    }

    playWinChime() {
      try {
        this.init();
        if (!this.ctx) return;
        const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.09);

          gain.gain.setValueAtTime(0.035, this.ctx.currentTime + idx * 0.09);
          gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + idx * 0.09 + 0.28);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(this.ctx.currentTime + idx * 0.09);
          osc.stop(this.ctx.currentTime + idx * 0.09 + 0.3);
        });
      } catch (e) {}
    }

    playErrorTone() {
      try {
        this.init();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(160, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.12);

        gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.13);
      } catch (e) {}
    }
  }

  const sound = new SpeakeasyAudio();

  /* ==========================================================================
     TWELVE COCKTAIL GARNISH SVG SILHOUETTES
     ========================================================================== */
  const GARNISH_SVGS = [
    `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"><path d="M25 80 C 10 40, 50 15, 75 30 C 95 45, 70 85, 45 75 C 30 70, 35 50, 55 50 C 70 50, 80 65, 70 80" stroke="#f6ad48"/></svg>`,
    `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"><path d="M15 25 Q 40 10 70 30 T 40 75 Q 25 85 50 90 T 85 70" stroke="#fdf0ce"/></svg>`,
    `<svg viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="42" stroke="#5deb93" stroke-width="5"/><circle cx="50" cy="50" r="34" stroke="#5deb93" stroke-width="2" opacity="0.6"/><path d="M50 16 L50 84 M16 50 L84 50 M26 26 L74 74 M26 74 L74 26" stroke="#5deb93" stroke-width="2.5" opacity="0.8"/></svg>`,
    `<svg viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="42" stroke="#fdf0ce" stroke-width="5"/><circle cx="50" cy="50" r="35" stroke="#fdf0ce" stroke-width="2" opacity="0.7"/><circle cx="50" cy="50" r="4" fill="#fdf0ce"/><path d="M50 16 L50 84 M16 50 L84 50 M26 26 L74 74 M26 74 L74 26" stroke="#fdf0ce" stroke-width="2.5" opacity="0.75"/></svg>`,
    `<svg viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="43" stroke="#a7461f" stroke-width="6" stroke-dasharray="8 3"/><circle cx="50" cy="50" r="35" stroke="#c99a43" stroke-width="2" opacity="0.7"/><circle cx="50" cy="50" r="7" fill="#7a3a1b"/><path d="M50 16 L50 84 M16 50 L84 50 M26 26 L74 74 M26 74 L74 26" stroke="#a7461f" stroke-width="3"/></svg>`,
    `<svg viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="42" stroke="#b88a38" stroke-width="5" stroke-dasharray="6 2"/><circle cx="50" cy="50" r="34" stroke="#e8c16b" stroke-width="1.8" opacity="0.7"/><circle cx="50" cy="50" r="6" fill="#8e6224"/><path d="M50 17 L50 83 M17 50 L83 50 M27 27 L73 73 M27 73 L73 27" stroke="#b88a38" stroke-width="2"/></svg>`,
    `<svg viewBox="0 0 100 100" fill="none"><circle cx="45" cy="65" r="24" fill="#b93b2a" opacity="0.85"/><circle cx="45" cy="65" r="22" stroke="#e8c16b" stroke-width="2"/><ellipse cx="38" cy="58" rx="6" ry="3" fill="#fff" opacity="0.45"/><path d="M45 42 C 45 15, 75 10, 85 20" stroke="#8e6224" stroke-width="4" stroke-linecap="round"/></svg>`,
    `<svg viewBox="0 0 100 100" fill="none"><circle cx="34" cy="70" r="18" fill="#a72d20" opacity="0.85"/><circle cx="34" cy="70" r="17" stroke="#e8c16b" stroke-width="1.8"/><circle cx="68" cy="68" r="18" fill="#b93b2a" opacity="0.85"/><circle cx="68" cy="68" r="17" stroke="#e8c16b" stroke-width="1.8"/><path d="M34 52 C 34 25, 52 14, 52 14 C 52 14, 68 30, 68 50" stroke="#8e6224" stroke-width="3" stroke-linecap="round"/><circle cx="52" cy="14" r="3" fill="#e8c16b"/></svg>`,
    `<svg viewBox="0 0 100 100" fill="none"><path d="M50 85 L50 30" stroke="#5deb93" stroke-width="3" stroke-linecap="round"/><path d="M50 65 Q 20 60 25 40 Q 45 42 50 65 Z" fill="#246d3c" stroke="#5deb93" stroke-width="1.5" opacity="0.85"/><path d="M50 55 Q 80 50 75 30 Q 55 32 50 55 Z" fill="#246d3c" stroke="#5deb93" stroke-width="1.5" opacity="0.85"/><path d="M50 35 Q 35 15 50 10 Q 65 15 50 35 Z" fill="#2e854c" stroke="#5deb93" stroke-width="1.5" opacity="0.85"/></svg>`,
    `<svg viewBox="0 0 100 100" fill="none" stroke="#689f38" stroke-width="2.5" stroke-linecap="round"><path d="M50 90 L50 15"/><path d="M50 75 L30 65 M50 75 L70 65"/><path d="M50 60 L28 50 M50 60 L72 50"/><path d="M50 45 L32 35 M50 45 L68 35"/><path d="M50 30 L36 20 M50 30 L64 20"/><path d="M50 18 L44 8 M50 18 L56 8"/></svg>`,
    `<svg viewBox="0 0 100 100" fill="none"><line x1="20" y1="85" x2="85" y2="18" stroke="#fdf0ce" stroke-width="3.5" stroke-linecap="round"/><ellipse cx="50" cy="50" rx="20" ry="26" fill="#4d6b2c" stroke="#e8c16b" stroke-width="2" transform="rotate(-40 50 50)"/><ellipse cx="50" cy="50" rx="6" ry="9" fill="#c34a26" transform="rotate(-40 50 50)"/></svg>`,
    `<svg viewBox="0 0 100 100" fill="none" stroke="#5deb93" stroke-width="3" stroke-linecap="round"><path d="M20 75 Q 35 90 55 75 T 80 40 Q 60 20 40 35 T 25 60" fill="rgba(46, 117, 65, 0.25)" opacity="0.75"/><circle cx="50" cy="50" r="2" fill="#fff" opacity="0.6"/><circle cx="45" cy="40" r="1.5" fill="#fff" opacity="0.5"/><circle cx="60" cy="55" r="1.5" fill="#fff" opacity="0.5"/></svg>`
  ];

  /* ==========================================================================
     RANDOMIZED COCKTAIL GARNISH FLOATING ENGINE
     ========================================================================== */
  class GarnishAtmosphere {
    constructor() {
      this.container = document.getElementById("garnish-canvas-container");
      this.activeParticles = 0;
      this.maxParticles = window.innerWidth < 600 ? 9 : 16;
      this.spawnTimer = null;

      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!prefersReduced && this.container) {
        this.start();
      }
    }

    start() {
      for (let i = 0; i < Math.floor(this.maxParticles * 0.7); i++) {
        this.spawnParticle(Math.random() * 90);
      }
      this.loop();
    }

    loop() {
      const interval = 1200 + Math.random() * 1600;
      this.spawnTimer = setTimeout(() => {
        if (this.activeParticles < this.maxParticles) {
          this.spawnParticle(-10);
        }
        this.loop();
      }, interval);
    }

    spawnParticle(initialPercentY = -10) {
      if (!this.container) return;

      const el = document.createElement("div");
      el.className = "garnish-particle";
      el.setAttribute("aria-hidden", "true");

      const iconIndex = Math.floor(Math.random() * GARNISH_SVGS.length);
      el.innerHTML = GARNISH_SVGS[iconIndex];

      const depthRoll = Math.random();
      let depthClass = "depth-middle";
      let baseScale = 0.65 + Math.random() * 0.35;
      let duration = 22 + Math.random() * 12;
      let opacity = 0.45;

      if (depthRoll < 0.38) {
        depthClass = "depth-distant";
        baseScale = 0.4 + Math.random() * 0.2;
        duration = 32 + Math.random() * 16;
        opacity = 0.25;
      } else if (depthRoll > 0.82) {
        depthClass = "depth-near";
        baseScale = 0.9 + Math.random() * 0.35;
        duration = 16 + Math.random() * 8;
        opacity = 0.65;
      }

      el.classList.add(depthClass);
      const sizePx = 42 * baseScale;
      el.style.width = `${sizePx}px`;
      el.style.height = `${sizePx}px`;

      const startLeft = Math.random() * 92;
      const driftX = (Math.random() - 0.5) * 80;
      const rotationStart = Math.random() * 360;
      const rotationEnd = rotationStart + (Math.random() > 0.5 ? 1 : -1) * (180 + Math.random() * 180);

      el.style.left = `${startLeft}%`;

      this.container.appendChild(el);
      this.activeParticles++;

      const startY = initialPercentY >= 0 ? (window.innerHeight * (100 - initialPercentY)) / 100 : window.innerHeight + 80;
      const endY = -100;
      const currentDuration = initialPercentY >= 0 ? duration * ((100 - initialPercentY) / 100) : duration;

      const animation = el.animate(
        [
          { transform: `translate3d(0, ${startY}px, 0) rotate(${rotationStart}deg)`, opacity: 0 },
          { opacity: opacity, offset: 0.15 },
          { opacity: opacity * 0.9, offset: 0.85 },
          { transform: `translate3d(${driftX}px, ${endY}px, 0) rotate(${rotationEnd}deg)`, opacity: 0 }
        ],
        { duration: currentDuration * 1000, easing: "linear" }
      );

      animation.onfinish = () => {
        el.remove();
        this.activeParticles--;
      };
    }
  }

  /* ==========================================================================
     STATE MANAGEMENT & CSV PARSING
     ========================================================================== */
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return getInitialState();
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object" || !parsed.stats) {
        return getInitialState();
      }
      return parsed;
    } catch (e) {
      return getInitialState();
    }
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
  }

  function getInitialState() {
    return {
      version: 1,
      stats: {
        played: 0,
        wins: 0,
        streak: 0,
        maxStreak: 0,
        distribution: [0, 0, 0, 0, 0, 0],
        lastDate: null
      },
      puzzles: {}
    };
  }

  function parseCSV(text) {
    const rows = [];
    let currentRow = [];
    let currentField = "";
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (c === '"') {
        if (inQuotes && text[i + 1] === '"') {
          currentField += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === "," && !inQuotes) {
        currentRow.push(currentField.trim());
        currentField = "";
      } else if ((c === "\n" || c === "\r") && !inQuotes) {
        if (c === "\r" && text[i + 1] === "\n") i++;
        currentRow.push(currentField.trim());
        if (currentRow.some((f) => f.length > 0)) rows.push(currentRow);
        currentRow = [];
        currentField = "";
      } else {
        currentField += c;
      }
    }
    if (currentField.length > 0 || currentRow.length > 0) {
      currentRow.push(currentField.trim());
      if (currentRow.some((f) => f.length > 0)) rows.push(currentRow);
    }
    if (rows.length < 2) return [];

    const headers = rows[0].map((h) => h.toLowerCase());
    return rows.slice(1).map((row) => {
      const obj = {};
      headers.forEach((h, idx) => {
        obj[h] = row[idx] || "";
      });
      return obj;
    });
  }

  /* ==========================================================================
     MAIN APPLICATION CLASS (AUTHORITATIVE RELEASE ARCHITECTURE)
     ========================================================================== */
  class WordGuessApp {
    constructor() {
      this.state = loadState();
      this.puzzles = [];
      this.currentPuzzle = null;
      
      // Authoritative synchronization variables
      this.authoritativeInstant = null;
      this.perfTimeAtSync = null;
      this.authoritativeTodayString = null;

      this.activeInput = "";
      this.guesses = [];
      this.isComplete = false;
      this.toastTimeout = null;

      this.cacheElements();
      this.setupHomeLink();
      this.initBoard();
      this.initKeyboard();
      this.attachEvents();
      this.loadPuzzleData();

      new GarnishAtmosphere();
    }

    cacheElements() {
      this.views = {
        menu: document.getElementById("view-menu"),
        vault: document.getElementById("view-vault"),
        game: document.getElementById("view-game")
      };

      this.dom = {
        navDaily: document.getElementById("nav-daily"),
        navVault: document.getElementById("nav-vault"),
        navHome: document.getElementById("nav-home"),
        menuDailyStatus: document.getElementById("menu-daily-status"),
        menuVaultCount: document.getElementById("menu-vault-count"),
        btnMenuStats: document.getElementById("btn-menu-stats"),
        btnMenuRules: document.getElementById("btn-menu-rules"),

        btnVaultBack: document.getElementById("btn-vault-back"),
        vaultList: document.getElementById("vault-list"),

        gamePuzzleTitle: document.getElementById("game-puzzle-title"),
        gamePuzzleDate: document.getElementById("game-puzzle-date"),
        gameStatusPill: document.getElementById("game-status-pill"),
        btnGameBack: document.getElementById("btn-game-back"),
        btnGameRules: document.getElementById("btn-game-rules"),
        btnGameStats: document.getElementById("btn-game-stats"),
        board: document.getElementById("board"),
        keyboard: document.getElementById("keyboard"),

        toast: document.getElementById("toast"),
        modalRules: document.getElementById("modal-rules"),
        modalStats: document.getElementById("modal-stats"),
        modalResult: document.getElementById("modal-result"),
        btnShare: document.getElementById("btn-share"),
        btnResultVault: document.getElementById("btn-result-vault"),

        resultTitle: document.getElementById("result-title"),
        resultWord: document.getElementById("result-word"),
        resultDefinition: document.getElementById("result-definition"),
        resultSummary: document.getElementById("result-summary"),

        statPlayed: document.getElementById("stat-played"),
        statWinrate: document.getElementById("stat-winrate"),
        statStreak: document.getElementById("stat-streak"),
        statMaxstreak: document.getElementById("stat-maxstreak"),
        distributionChart: document.getElementById("distribution-chart")
      };
    }

    setupHomeLink() {
      if (this.dom.navHome) {
        this.dom.navHome.setAttribute("href", HOME_PAGE_URL);
      }
    }

    switchView(viewName) {
      sound.playButtonTap();
      Object.keys(this.views).forEach((key) => {
        if (key === viewName) {
          this.views[key].classList.remove("hidden");
        } else {
          this.views[key].classList.add("hidden");
        }
      });

      if (viewName === "menu") {
        this.updateMenuSummary();
      } else if (viewName === "vault") {
        this.renderVault();
      }
    }

    /*
     * Derives authoritative calendar date in explicit IANA timezone.
     * Uses monotonic performance.now() from sync point to defeat device clock tampering.
     */
    getAuthoritativeTodayString() {
      if (this.authoritativeInstant === null || this.perfTimeAtSync === null) {
        return null; // Fail closed if authoritative server instant is unavailable
      }
      const elapsed = performance.now() - this.perfTimeAtSync;
      const currentInstant = new Date(this.authoritativeInstant + elapsed);

      const dtf = new Intl.DateTimeFormat("en-US", {
        timeZone: RELEASE_TIMEZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour12: false
      });
      const parts = dtf.formatToParts(currentInstant);
      const year = parts.find((p) => p.type === "year").value;
      const month = parts.find((p) => p.type === "month").value;
      const day = parts.find((p) => p.type === "day").value;
      return `${year}-${month}-${day}`;
    }

    async loadPuzzleData() {
      try {
        const response = await fetch(CSV_FILE, {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" }
        });

        // Parse origin server HTTP Date header
        const dateHeader = response.headers.get("date");
        if (dateHeader) {
          const parsedEpoch = Date.parse(dateHeader);
          if (!Number.isNaN(parsedEpoch)) {
            this.authoritativeInstant = parsedEpoch;
            this.perfTimeAtSync = performance.now();
          }
        }

        if (!response.ok) throw new Error("CSV fetch failed");
        const text = await response.text();
        const parsed = parseCSV(text);

        const list = parsed
          .filter((p) => p.date && /^\d{4}-\d{2}-\d{2}$/.test(p.date) && p.word && p.word.length === 5)
          .map((p) => ({
            date: p.date,
            word: p.word.toUpperCase().trim(),
            definition: p.definition ? p.definition.trim() : ""
          }));

        this.puzzles = list.length > 0 ? list : FALLBACK_PUZZLES;
      } catch (err) {
        this.puzzles = FALLBACK_PUZZLES;
      }

      // If response Date header was omitted by environment, try same-origin HEAD check
      if (this.authoritativeInstant === null) {
        try {
          const headRes = await fetch(window.location.href, { method: "HEAD", cache: "no-store" });
          const headDate = headRes.headers.get("date");
          if (headDate) {
            const parsedEpoch = Date.parse(headDate);
            if (!Number.isNaN(parsedEpoch)) {
              this.authoritativeInstant = parsedEpoch;
              this.perfTimeAtSync = performance.now();
            }
          }
        } catch (e) {}
      }

      this.authoritativeTodayString = this.getAuthoritativeTodayString();
      this.puzzles.forEach((p) => VALID_WORDS.add(p.word));
      this.updateMenuSummary();
    }

    /*
     * Absolute Rule 1 & Rule 5:
     * Never returns an unreleased puzzle. If no puzzle exists for today,
     * safely returns the most recent released past puzzle, or null.
     */
    getDailyPuzzle() {
      this.authoritativeTodayString = this.getAuthoritativeTodayString();
      if (!this.authoritativeTodayString) return null;

      const todayMatch = this.puzzles.find((p) => p.date === this.authoritativeTodayString);
      if (todayMatch) return todayMatch;

      const past = this.puzzles
        .filter((p) => p.date < this.authoritativeTodayString)
        .sort((a, b) => b.date.localeCompare(a.date));

      if (past.length > 0) return past[0];
      return null;
    }

    updateMenuSummary() {
      this.authoritativeTodayString = this.getAuthoritativeTodayString();
      const daily = this.getDailyPuzzle();

      if (!this.authoritativeTodayString) {
        this.dom.menuDailyStatus.textContent = "Verifying release time...";
        this.dom.menuVaultCount.textContent = "Reserve locked";
        return;
      }

      if (daily) {
        const record = this.state.puzzles[daily.date];
        if (record && record.completed) {
          this.dom.menuDailyStatus.textContent = record.won
            ? `Decanted (${record.guesses.length}/6)`
            : "Completed (X/6)";
        } else if (record && record.guesses && record.guesses.length > 0) {
          this.dom.menuDailyStatus.textContent = `In Progress (${record.guesses.length}/6)`;
        } else {
          this.dom.menuDailyStatus.textContent = "Ready to uncork";
        }
      } else {
        this.dom.menuDailyStatus.textContent = "No vintage today";
      }

      // Vault count exclusively reflects released historical puzzles
      const pastPuzzles = this.puzzles.filter(
        (p) => p.date < this.authoritativeTodayString && (!daily || p.date !== daily.date)
      );
      this.dom.menuVaultCount.textContent = `${pastPuzzles.length} vintage reserve${pastPuzzles.length === 1 ? "" : "s"}`;
    }

    initBoard() {
      this.dom.board.innerHTML = "";
      for (let r = 0; r < 6; r++) {
        const row = document.createElement("div");
        row.className = "board-row";
        row.setAttribute("role", "row");
        for (let c = 0; c < 5; c++) {
          const tile = document.createElement("div");
          tile.className = "tile";
          tile.setAttribute("role", "gridcell");
          tile.setAttribute("aria-label", "Empty");
          row.appendChild(tile);
        }
        this.dom.board.appendChild(row);
      }
    }

    initKeyboard() {
      const layout = [
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
        ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACK"]
      ];

      this.dom.keyboard.innerHTML = "";
      layout.forEach((rowKeys) => {
        const rowEl = document.createElement("div");
        rowEl.className = "keyboard-row";
        rowKeys.forEach((key) => {
          const btn = document.createElement("button");
          btn.className = "key";
          btn.dataset.key = key;
          btn.setAttribute("type", "button");
          btn.textContent = key === "BACK" ? "⌫" : key;
          btn.setAttribute("aria-label", key === "BACK" ? "Backspace" : key);

          if (key === "ENTER" || key === "BACK") {
            btn.classList.add("key-wide");
          }

          btn.addEventListener("click", () => this.handleInput(key));
          rowEl.appendChild(btn);
        });
        this.dom.keyboard.appendChild(rowEl);
      });
    }

    attachEvents() {
      window.addEventListener("keydown", (e) => {
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        const activeDialog = document.querySelector("dialog[open]");
        if (activeDialog) return;

        if (this.views.game.classList.contains("hidden")) return;

        if (e.key === "Enter") {
          this.handleInput("ENTER");
        } else if (e.key === "Backspace") {
          this.handleInput("BACK");
        } else if (/^[a-zA-Z]$/.test(e.key)) {
          this.handleInput(e.key.toUpperCase());
        }
      });

      this.dom.navDaily.addEventListener("click", () => {
        const daily = this.getDailyPuzzle();
        if (daily) {
          this.startPuzzle(daily, true);
        } else {
          sound.playErrorTone();
          this.showToast(this.authoritativeTodayString ? "No puzzle available for today" : "Verifying release time...");
        }
      });

      this.dom.navVault.addEventListener("click", () => {
        this.switchView("vault");
      });

      this.dom.btnVaultBack.addEventListener("click", () => {
        this.switchView("menu");
      });

      this.dom.btnGameBack.addEventListener("click", () => {
        this.switchView("menu");
      });

      this.dom.btnMenuRules.addEventListener("click", () => {
        sound.playButtonTap();
        this.openDialog(this.dom.modalRules);
      });
      this.dom.btnMenuStats.addEventListener("click", () => {
        sound.playButtonTap();
        this.renderStatsModal();
      });

      this.dom.btnGameRules.addEventListener("click", () => {
        sound.playButtonTap();
        this.openDialog(this.dom.modalRules);
      });
      this.dom.btnGameStats.addEventListener("click", () => {
        sound.playButtonTap();
        this.renderStatsModal();
      });

      this.dom.btnShare.addEventListener("click", () => this.shareResult());
      this.dom.btnResultVault.addEventListener("click", () => {
        this.dom.modalResult.close();
        this.switchView("vault");
      });

      document.querySelectorAll("[data-close]").forEach((btn) => {
        btn.addEventListener("click", () => {
          sound.playButtonTap();
          const target = document.getElementById(btn.dataset.close);
          if (target && typeof target.close === "function") {
            target.close();
          }
        });
      });
    }

    /*
     * Mandatory Release Guard on Entry Point (Absolute Rule 1 & Rule 8)
     */
    startPuzzle(puzzle, isDaily) {
      if (!puzzle || !puzzle.date) return;

      this.authoritativeTodayString = this.getAuthoritativeTodayString();
      if (!this.authoritativeTodayString || puzzle.date > this.authoritativeTodayString) {
        sound.playErrorTone();
        this.showToast("This vintage is not yet released");
        return;
      }

      this.currentPuzzle = puzzle;
      this.activeInput = "";
      this.guesses = [];
      this.isComplete = false;

      const title = isDaily ? "DAILY SELECTION" : `VAULT: ${puzzle.date}`;
      this.dom.gamePuzzleTitle.textContent = title;
      this.dom.gamePuzzleDate.textContent = isDaily ? `Vintage Today (${puzzle.date})` : puzzle.date;

      this.resetBoardAndKeyboard();

      const saved = this.state.puzzles[puzzle.date];
      if (saved && Array.isArray(saved.guesses)) {
        saved.guesses.forEach((guess) => {
          this.applyGuess(guess);
        });

        if (saved.completed) {
          this.isComplete = true;
          this.dom.gameStatusPill.textContent = saved.won ? "DECANTED" : "CONCLUDED";
          this.dom.gameStatusPill.classList.remove("hidden");
        } else {
          this.dom.gameStatusPill.classList.add("hidden");
        }
      } else {
        this.dom.gameStatusPill.classList.add("hidden");
      }

      this.switchView("game");
    }

    resetBoardAndKeyboard() {
      const tiles = this.dom.board.querySelectorAll(".tile");
      tiles.forEach((tile) => {
        tile.textContent = "";
        tile.className = "tile";
        tile.removeAttribute("data-state");
        tile.setAttribute("aria-label", "Empty");
      });

      const keys = this.dom.keyboard.querySelectorAll(".key");
      keys.forEach((k) => {
        k.classList.remove("correct", "present", "absent");
      });
    }

    handleInput(key) {
      if (this.isComplete) return;

      if (key === "ENTER") {
        this.submitGuess();
      } else if (key === "BACK") {
        if (this.activeInput.length > 0) {
          sound.playKeyTick();
          this.activeInput = this.activeInput.slice(0, -1);
          this.renderActiveRow();
        }
      } else if (/^[A-Z]$/.test(key)) {
        if (this.activeInput.length < 5) {
          sound.playKeyTick();
          this.activeInput += key;
          this.renderActiveRow();
        }
      }
    }

    renderActiveRow() {
      const rowIndex = this.guesses.length;
      if (rowIndex >= 6) return;

      const row = this.dom.board.children[rowIndex];
      for (let c = 0; c < 5; c++) {
        const tile = row.children[c];
        const letter = this.activeInput[c] || "";
        tile.textContent = letter;
        tile.dataset.state = letter ? "active" : "";
        tile.setAttribute("aria-label", letter || "Empty");
      }
    }

    submitGuess() {
      if (this.activeInput.length !== 5) {
        sound.playErrorTone();
        this.showToast("Not enough letters");
        return;
      }

      const guess = this.activeInput.toUpperCase();
      if (!VALID_WORDS.has(guess)) {
        sound.playErrorTone();
        this.showToast("Word not recognised");
        return;
      }

      this.applyGuess(guess);
      this.activeInput = "";

      const won = guess === this.currentPuzzle.word;
      const lost = !won && this.guesses.length >= 6;

      if (won || lost) {
        this.isComplete = true;
        this.dom.gameStatusPill.textContent = won ? "DECANTED" : "CONCLUDED";
        this.dom.gameStatusPill.classList.remove("hidden");
        this.recordProgress(won);

        if (won) {
          sound.playWinChime();
        } else {
          sound.playErrorTone();
        }
        setTimeout(() => this.openResultModal(won), 500);
      } else {
        sound.playButtonTap();
        this.saveCurrentProgress(false, false);
      }
    }

    evaluateGuess(guess, target) {
      const evaluation = Array(5).fill("absent");
      const targetLetters = target.split("");
      const guessLetters = guess.split("");
      const targetFreq = {};

      for (const char of targetLetters) {
        targetFreq[char] = (targetFreq[char] || 0) + 1;
      }

      for (let i = 0; i < 5; i++) {
        if (guessLetters[i] === targetLetters[i]) {
          evaluation[i] = "correct";
          targetFreq[guessLetters[i]]--;
        }
      }

      for (let i = 0; i < 5; i++) {
        if (evaluation[i] !== "correct" && targetFreq[guessLetters[i]] > 0) {
          evaluation[i] = "present";
          targetFreq[guessLetters[i]]--;
        }
      }

      return evaluation;
    }

    applyGuess(guess) {
      const rowIndex = this.guesses.length;
      if (rowIndex >= 6) return;

      const row = this.dom.board.children[rowIndex];
      const evaluation = this.evaluateGuess(guess, this.currentPuzzle.word);

      this.guesses.push(guess);

      for (let c = 0; c < 5; c++) {
        const tile = row.children[c];
        const status = evaluation[c];
        tile.textContent = guess[c];
        tile.className = `tile ${status}`;
        tile.removeAttribute("data-state");
        tile.setAttribute("aria-label", `${guess[c]}, ${status}`);

        const keyBtn = this.dom.keyboard.querySelector(`[data-key="${guess[c]}"]`);
        if (keyBtn) {
          const isCorrect = keyBtn.classList.contains("correct");
          const isPresent = keyBtn.classList.contains("present");

          if (status === "correct") {
            keyBtn.className = "key correct";
          } else if (status === "present" && !isCorrect) {
            keyBtn.className = "key present";
          } else if (status === "absent" && !isCorrect && !isPresent) {
            keyBtn.className = "key absent";
          }
        }
      }
    }

    saveCurrentProgress(completed, won) {
      this.state.puzzles[this.currentPuzzle.date] = {
        guesses: this.guesses,
        completed,
        won
      };
      saveState(this.state);
    }

    recordProgress(won) {
      this.saveCurrentProgress(true, won);

      const daily = this.getDailyPuzzle();
      const isDaily = daily && this.currentPuzzle.date === daily.date;

      if (isDaily) {
        const stats = this.state.stats;
        if (stats.lastDate !== daily.date) {
          stats.played++;
          stats.lastDate = daily.date;
          if (won) {
            stats.wins++;
            stats.streak++;
            if (stats.streak > stats.maxStreak) stats.maxStreak = stats.streak;
            const guessIdx = this.guesses.length - 1;
            if (guessIdx >= 0 && guessIdx < 6) {
              stats.distribution[guessIdx]++;
            }
          } else {
            stats.streak = 0;
          }
          saveState(this.state);
        }
      }
    }

    /*
     * Absolute Rule 1 & Rule 11:
     * Excludes all future puzzles from Vault DOM rendering and selection.
     */
    renderVault() {
      this.dom.vaultList.innerHTML = "";
      this.authoritativeTodayString = this.getAuthoritativeTodayString();

      if (!this.authoritativeTodayString) {
        const emptyMsg = document.createElement("p");
        emptyMsg.className = "vault-caption";
        emptyMsg.textContent = "Verifying release calendar...";
        this.dom.vaultList.appendChild(emptyMsg);
        return;
      }

      const daily = this.getDailyPuzzle();
      const archiveItems = this.puzzles
        .filter((p) => p.date < this.authoritativeTodayString && (!daily || p.date !== daily.date))
        .sort((a, b) => b.date.localeCompare(a.date));

      if (archiveItems.length === 0) {
        const emptyMsg = document.createElement("p");
        emptyMsg.className = "vault-caption";
        emptyMsg.textContent = "No archived vintages yet.";
        this.dom.vaultList.appendChild(emptyMsg);
        return;
      }

      archiveItems.forEach((p) => {
        const card = document.createElement("div");
        card.className = "vault-card";
        card.setAttribute("role", "button");
        card.setAttribute("tabindex", "0");

        const progress = this.state.puzzles[p.date];
        let badgeClass = "unplayed";
        let badgeText = "UNSOLVED";
        let statusText = "Tap to uncork";

        if (progress && progress.completed) {
          if (progress.won) {
            badgeClass = "solved";
            badgeText = `${progress.guesses.length}/6`;
            statusText = "Decanted";
          } else {
            badgeClass = "failed";
            badgeText = "CONCLUDED";
            statusText = "Unresolved vintage";
          }
        } else if (progress && progress.guesses && progress.guesses.length > 0) {
          badgeClass = "unplayed";
          badgeText = `${progress.guesses.length}/6`;
          statusText = "In tasting";
        }

        card.innerHTML = `
          <div class="vault-info">
            <span class="vault-date">${p.date}</span>
            <span class="vault-status-text">${statusText}</span>
          </div>
          <span class="vault-badge ${badgeClass}">${badgeText}</span>
        `;

        const triggerAction = () => this.startPuzzle(p, false);
        card.addEventListener("click", triggerAction);
        card.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            triggerAction();
          }
        });

        this.dom.vaultList.appendChild(card);
      });
    }

    renderStatsModal() {
      const stats = this.state.stats;
      this.dom.statPlayed.textContent = stats.played;
      this.dom.statWinrate.textContent = stats.played > 0 ? Math.round((stats.wins / stats.played) * 100) + "%" : "0%";
      this.dom.statStreak.textContent = stats.streak;
      this.dom.statMaxstreak.textContent = stats.maxStreak;

      this.dom.distributionChart.innerHTML = "";
      const maxCount = Math.max(...stats.distribution, 1);

      stats.distribution.forEach((count, i) => {
        const row = document.createElement("div");
        row.className = "dist-row";

        const label = document.createElement("span");
        label.textContent = i + 1;

        const wrapper = document.createElement("div");
        wrapper.className = "dist-bar-wrapper";

        const bar = document.createElement("div");
        bar.className = "dist-bar";
        bar.style.width = `${Math.max((count / maxCount) * 100, 8)}%`;
        bar.textContent = count;

        const currentSolvedIndex = this.guesses.length - 1;
        if (this.isComplete && this.state.puzzles[this.currentPuzzle?.date]?.won && currentSolvedIndex === i) {
          bar.classList.add("highlight");
        }

        wrapper.appendChild(bar);
        row.appendChild(label);
        row.appendChild(wrapper);
        this.dom.distributionChart.appendChild(row);
      });

      this.openDialog(this.dom.modalStats);
    }

    openResultModal(won) {
      this.dom.resultTitle.textContent = won ? "DECANTED WITH ELEGANCE" : "LAST CALL";
      this.dom.resultWord.textContent = this.currentPuzzle.word;
      this.dom.resultDefinition.textContent = this.currentPuzzle.definition || "";
      this.dom.resultSummary.textContent = won
        ? `Solved cleanly in ${this.guesses.length} of 6 attempts.`
        : "Failed to decipher the vintage within 6 attempts.";

      this.openDialog(this.dom.modalResult);
    }

    shareResult() {
      sound.playButtonTap();
      const record = this.state.puzzles[this.currentPuzzle.date];
      const count = record && record.won ? this.guesses.length : "X";
      let text = `Word Guess (${this.currentPuzzle.date}) ${count}/6\n\n`;

      this.guesses.forEach((guess) => {
        const evalResult = this.evaluateGuess(guess, this.currentPuzzle.word);
        evalResult.forEach((status) => {
          text += status === "correct" ? "🟩" : status === "present" ? "🟨" : "⬛";
        });
        text += "\n";
      });

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text.trim()).then(() => {
          this.showToast("Copied card to clipboard");
        });
      } else {
        this.showToast("Clipboard not supported");
      }
    }

    showToast(message) {
      this.dom.toast.textContent = message;
      this.dom.toast.classList.remove("hidden");
      clearTimeout(this.toastTimeout);
      this.toastTimeout = setTimeout(() => {
        this.dom.toast.classList.add("hidden");
      }, 2200);
    }

    openDialog(modal) {
      if (modal && typeof modal.showModal === "function") {
        modal.showModal();
      }
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    new WordGuessApp();
  });
})();