/**
 * COCKTAIL WORDLE — PRODUCTION PLATFORM ENGINE
 */

(function () {
  "use strict";

  const CONFIG = {
    puzzleCsvPath: './puzzles.csv',
    releaseTimeZone: 'Europe/London'
  };

  const VALID_GUESSES = new Set([
    "SHAKE", "AMARO", "TWIST", "AGAVE", "SMASH", "RINSE", "JULEP", "FLUTE", "FROTH", "CLOVE",
    "POURS", "BUILD", "STIRS", "FLOAT", "PINCH", "CRUSH", "CRAFT", "BATCH", "ZESTS", "BITES",
    "CHILL", "DRAWS", "NEATS", "ROCKS", "COATS", "FOAMS", "CLEAR", "TASTE", "SWEET", "BITTR",
    "SOURS", "DRINK", "GLASS", "STILL", "CASKS", "AGING", "YEAST", "GRAIN", "BARREL", "MALTZ",
    "SUGAR", "SYRUP", "HONEY", "LEMON", "LIMES", "MINTY", "BASIL", "BERRY", "FRUIT", "PEELS",
    "HERBS", "SPICE", "ANGLO", "VODKA", "GINNY", "RUMMY", "SHRUB", "TONIC", "SODA", "WATER",
    "CIDER", "BEERS", "STOUT", "ALEHOUSE", "TAVERN", "SALOON", "BARREL", "BLEND", "PROOF",
    "SPRIT", "PUNCH", "DAISY", "SLING", "COBBL", "TODDY", "SWIZZ", "GROGS", "RICKEY", "FIZZY",
    "ABOUT", "ABOVE", "ABUSE", "ACTOR", "ACUTE", "ADMIT", "ADOPT", "ADULT", "AFTER", "AGAIN",
    "AGENT", "AGREE", "AHEAD", "ALARM", "ALBUM", "ALERT", "ALIKE", "ALIVE", "ALLOW", "ALONE",
    "ALONG", "ALTER", "AMONG", "ANGER", "ANGLE", "ANGRY", "APART", "APPLE", "APPLY", "ARENA",
    "ARGUE", "ARISE", "ARMED", "ARRAY", "ASIDE", "ASSET", "AUDIO", "AUDIT", "AVOID", "AWARD",
    "AWARE", "BADLY", "BAKER", "BASES", "BASIC", "BASIS", "BEACH", "BEGAN", "BEGIN", "BEGUN",
    "BEING", "BELOW", "BENCH", "BILLY", "BIRTH", "BLACK", "BLAME", "BLIND", "BLOCK", "BLOOD",
    "BOARD", "BOOST", "BOOTH", "BOUND", "BRAIN", "BRAND", "BREAD", "BREAK", "BREED", "BRIEF",
    "BRING", "BROAD", "BROKE", "BROWN", "CABLE", "CALIF", "CARRY", "CATCH", "CAUSE", "CHAIN",
    "CHAIR", "CHART", "CHASE", "CHEAP", "CHECK", "CHEST", "CHIEF", "CHILD", "CHINA", "CHOSE",
    "CIVIL", "CLAIM", "CLASS", "CLEAN", "CLEAR", "CLICK", "CLOCK", "CLOSE", "COACH", "COAST",
    "COULD", "COUNT", "COURT", "COVER", "CRACK", "CRANE", "CREAM", "CRIME", "CROSS", "CROWD",
    "CROWN", "CURVE", "CYCLE", "DAILY", "DANCE", "DATED", "DEALT", "DEATH", "DEBUT", "DELAY",
    "DEPTH", "DOING", "DOUBT", "DOZEN", "DRAFT", "DRAMA", "DRAWN", "DREAM", "DRESS", "DRILL",
    "DRIVE", "DROVE", "DYING", "EAGER", "EARLY", "EARTH", "EIGHT", "ELITE", "EMPTY", "ENEMY",
    "ENJOY", "ENTER", "ENTRY", "EQUAL", "ERROR", "EVENT", "EVERY", "EXACT", "EXIST", "EXTRA",
    "FAITH", "FALSE", "FAULT", "FIBER", "FIELD", "FIFTH", "FIFTY", "FIGHT", "FINAL", "FIRST",
    "FIXED", "FLASH", "FLEET", "FLOOR", "FLUID", "FOCUS", "FORCE", "FORTH", "FORTY", "FORUM",
    "FOUND", "FRAME", "FRANK", "FRAUD", "FRESH", "FRONT", "FRUIT", "FULLY", "FUNNY", "GIANT",
    "GIVEN", "GLASS", "GLOBE", "GOING", "GRACE", "GRADE", "GRAND", "GRANT", "GRASS", "GREAT",
    "GREEN", "GROSS", "GROUP", "GROWN", "GUARD", "GUESS", "GUEST", "GUIDE", "HAPPY", "HARRY",
    "HEART", "HEAVY", "HENCE", "HORSE", "HOTEL", "HOUSE", "HUMAN", "IDEAL", "IMAGE", "INDEX",
    "INNER", "INPUT", "ISSUE", "JAPAN", "JIMMY", "JOINT", "JONES", "JUDGE", "KNOWN", "LABEL",
    "LARGE", "LASER", "LATER", "LAUGH", "LAYER", "LEARN", "LEASE", "LEAST", "LEAVE", "LEGAL",
    "LEVEL", "LIGHT", "LIMIT", "LINKS", "LIVES", "LOCAL", "LOGIC", "LOOSE", "LOWER", "LUCKY",
    "LUNCH", "LYING", "MAGIC", "MAJOR", "MAKER", "MARCH", "MATCH", "MAYBE", "MAYOR", "MEANT",
    "MEDIA", "METAL", "MIGHT", "MINOR", "MINUS", "MIXED", "MODEL", "MONEY", "MONTH", "MORAL",
    "MOTOR", "MOUNT", "MOUSE", "MOUTH", "MOVIE", "MUSIC", "NEEDS", "NEVER", "NEWLY", "NIGHT",
    "NOISE", "NORTH", "NOTED", "NOVEL", "NURSE", "OCCUR", "OFFER", "OFTEN", "ORDER", "OTHER",
    "OUGHT", "PAINT", "PANEL", "PAPER", "PARTY", "PEACE", "PETER", "PHASE", "PHONE", "PHOTO",
    "PIECE", "PILOT", "PITCH", "PLACE", "PLAIN", "PLANE", "PLANT", "PLATE", "POINT", "POUND",
    "POWER", "PRESS", "PRICE", "PRIDE", "PRIME", "PRINT", "PRIOR", "PRIZE", "PROOF", "PROUD",
    "PROVE", "QUEEN", "QUICK", "QUIET", "QUITE", "RADIO", "RAISE", "RANGE", "RAPID", "RATIO",
    "REACH", "READY", "REFER", "RIGHT", "RIVAL", "RIVER", "ROBIN", "ROGER", "ROMAN", "ROUGH",
    "ROUND", "ROUTE", "ROYAL", "RURAL", "SCALE", "SCENE", "SCOPE", "SCORE", "SENSE", "SERVE",
    "SEVEN", "SHALL", "SHAPE", "SHARE", "SHARP", "SHEET", "SHELF", "SHELL", "SHIFT", "SHIRT",
    "SHOCK", "SHOOT", "SHORT", "SHOWN", "SIGHT", "SINCE", "SIXTH", "SIXTY", "SIZED", "SKILL",
    "SLEEP", "SLIDE", "SMALL", "SMART", "SMILE", "SMITH", "SMOKE", "SOLID", "SOLVE", "SORRY",
    "SOUND", "SOUTH", "SPACE", "SPARE", "SPEAK", "SPEED", "SPEND", "SPENT", "SPLIT", "SPOKE",
    "SPORT", "STAFF", "STAGE", "STAKE", "STAND", "START", "STATE", "STEAM", "STEEL", "STICK",
    "STILL", "STOCK", "STONE", "STOOD", "STORE", "STORM", "STORY", "STRIP", "STUDY", "STUFF",
    "STYLE", "SUGAR", "SUITE", "SUPER", "SWEET", "TABLE", "TAKEN", "TASTE", "TAXES", "TEACH",
    "TEETH", "TERRY", "TEXAS", "THANK", "THEFT", "THEIR", "THEME", "THERE", "THESE", "THICK",
    "THING", "THINK", "THIRD", "THOSE", "THREE", "THREW", "THROW", "TIGHT", "TIMES", "TIRED",
    "TITLE", "TODAY", "TOPIC", "TOTAL", "TOUCH", "TOUGH", "TOWER", "TRACK", "TRADE", "TRAIN",
    "TREAT", "TREND", "TRIAL", "TRIED", "TRIES", "TRUCK", "TRULY", "TRUST", "TRUTH", "TWICE",
    "UNDER", "UNDUE", "UNION", "UNITY", "UNTIL", "UPON", "UPPER", "UPSET", "URBAN", "USAGE",
    "USUAL", "VALID", "VALUE", "VIDEO", "VIRUS", "VISIT", "VITAL", "VOICE", "WASTE", "WATCH",
    "WATER", "WHEEL", "WHERE", "WHICH", "WHILE", "WHITE", "WHOLE", "WHOSE", "WOMAN", "WOMEN",
    "WORLD", "WORRY", "WORSE", "WORST", "WORTH", "WOULD", "WOUND", "WRITE", "WRONG", "WROTE",
    "YIELD", "YOUNG", "YOUTH"
  ]);

  const STORAGE_KEY = "cocktail_wordle_platform_v2";

  class StorageManager {
    static load() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return this.getDefault();
        const parsed = JSON.parse(raw);
        if (parsed.version !== 2) return this.getDefault();
        return parsed;
      } catch (e) {
        return this.getDefault();
      }
    }
    static save(data) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
    }
    static getDefault() {
      return {
        version: 2,
        soundEnabled: true,
        stats: {
          gamesPlayed: 0,
          gamesWon: 0,
          currentStreak: 0,
          maxStreak: 0,
          guessDistribution: [0, 0, 0, 0, 0, 0],
          lastCompletedDate: null
        },
        progress: {} 
      };
    }
  }

  class LoungeAudioSystem {
    constructor() { this.ctx = null; this.enabled = true; }
    init() {
      if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
    }
    playKeyTap() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(460, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.035);
      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.035);
      osc.connect(gain); gain.connect(this.ctx.destination);
      osc.start(); osc.stop(this.ctx.currentTime + 0.035);
    }
    playGlassClink(index = 0) {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const baseFreq = 587.33; 
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(baseFreq * Math.pow(1.12, index), this.ctx.currentTime);
      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);
      osc.connect(gain); gain.connect(this.ctx.destination);
      osc.start(); osc.stop(this.ctx.currentTime + 0.22);
    }
    playInvalidBuzzer() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.setValueAtTime(115, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.14, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.16);
      osc.connect(gain); gain.connect(this.ctx.destination);
      osc.start(); osc.stop(this.ctx.currentTime + 0.16);
    }
    playVictoryChime() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.09);
        gain.gain.setValueAtTime(0.18, this.ctx.currentTime + i * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + i * 0.09 + 0.38);
        osc.connect(gain); gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + i * 0.09); osc.stop(this.ctx.currentTime + i * 0.09 + 0.42);
      });
    }
  }

  class GarnishAtmosphereSystem {
    constructor(containerEl) {
      this.container = containerEl;
      this.targetMax = 4;
      this.activeNodes = new Set();
      this.garnishSvgLibrary = [
        `<svg viewBox="0 0 48 48"><path d="M12 36 C10 24, 28 26, 26 16 C24 8, 38 10, 36 6"/></svg>`,
        `<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="20"/><circle cx="24" cy="24" r="14"/><line x1="24" y1="10" x2="24" y2="38"/><line x1="10" y1="24" x2="38" y2="24"/><line x1="14" y1="14" x2="34" y2="34"/><line x1="14" y1="34" x2="34" y2="14"/></svg>`,
        `<svg viewBox="0 0 48 48"><path d="M24 42 C24 24, 24 12, 24 6"/><path d="M24 28 C16 26, 12 18, 18 16 C22 14, 24 24, 24 28 Z"/><path d="M24 22 C32 20, 36 12, 30 10 C26 8, 24 18, 24 22 Z"/></svg>`,
        `<svg viewBox="0 0 48 48"><circle cx="20" cy="30" r="10"/><path d="M20 20 C22 10, 34 6, 38 8"/><circle cx="34" cy="28" r="8"/></svg>`,
        `<svg viewBox="0 0 48 48"><line x1="10" y1="38" x2="38" y2="10"/><ellipse cx="24" cy="24" rx="11" ry="8" transform="rotate(-45 24 24)"/><circle cx="24" cy="24" r="3"/></svg>`,
        `<svg viewBox="0 0 48 48"><path d="M24 42 L24 6"/><path d="M24 34 L16 28 M24 30 L32 24 M24 22 L16 16 M24 18 L32 12 M24 10 L18 6 M24 10 L30 6"/></svg>`
      ];
      this.start();
    }
    setActivityLevel(isGameActive) { this.targetMax = isGameActive ? 2 : 4; }
    start() {
      const tick = () => {
        if (this.activeNodes.size < this.targetMax) this.spawnGarnish();
        setTimeout(tick, 2200 + Math.random() * 2600);
      };
      tick();
    }
    spawnGarnish() {
      if (!this.container) return;
      const el = document.createElement("div");
      el.className = "garnish-icon";
      el.innerHTML = this.garnishSvgLibrary[Math.floor(Math.random() * this.garnishSvgLibrary.length)];
      const size = Math.floor(34 + Math.random() * 28);
      const duration = 12 + Math.random() * 8;
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.left = `${Math.floor(8 + Math.random() * 84)}%`;
      el.style.animationDuration = `${duration}s`;
      this.container.appendChild(el);
      this.activeNodes.add(el);
      setTimeout(() => { el.remove(); this.activeNodes.delete(el); }, duration * 1000);
    }
  }

  class CocktailWordleEngine {
    constructor() {
      this.audio = new LoungeAudioSystem();
      this.state = StorageManager.load();
      this.currentGuesses = [];
      this.currentInput = "";
      this.isGameOver = false;

      this.puzzles = [];
      this.vaultPuzzles = [];
      this.todayPuzzle = null;
      this.activePuzzle = null;
      this.currentUkDate = null;

      this.initDomReferences();
      this.atmosphere = new GarnishAtmosphereSystem(this.dom.garnishContainer);
      this.applySavedSoundSetting();
      this.buildBoardDom();
      this.buildKeyboardDom();
      this.attachEvents();
      
      this.initializeReleaseState();
    }

    async initializeReleaseState() {
      try {
        const csvText = await this.fetchCSV(CONFIG.puzzleCsvPath);
        this.puzzles = this.parseCSV(csvText);
        
        if (!this.puzzles || this.puzzles.length === 0) throw new Error("Empty CSV");
        if (!this.puzzles[0].hasOwnProperty('release_date')) throw new Error("Invalid CSV Header");

        const authDate = await this.fetchAuthoritativeDate();
        if (!authDate) throw new Error("Time Authority Failed");
        
        this.currentUkDate = authDate;
        
        const duplicates = this.puzzles.filter(p => p.release_date === this.currentUkDate);
        if (duplicates.length > 1) throw new Error("Duplicate Current Release");

        this.todayPuzzle = duplicates.length === 1 ? duplicates[0] : null;
        this.vaultPuzzles = this.puzzles.filter(p => p.release_date < this.currentUkDate).reverse();
        
        if (this.todayPuzzle) {
          this.activePuzzle = this.todayPuzzle;
          this.refreshMenuTodayCard();
        } else {
          this.showErrorState("Today's puzzle is not available.");
        }
      } catch (e) {
        this.showErrorState("Today's puzzle could not be verified.");
      }
    }

    async fetchCSV(path) {
      const res = await fetch(path, { cache: 'no-store' });
      if (!res.ok) throw new Error("CSV Fetch Failed");
      return await res.text();
    }

    parseCSV(text) {
      const rows = [];
      let currentRow = [];
      let currentCell = '';
      let inQuotes = false;
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === '"') {
          if (inQuotes && text[i + 1] === '"') { currentCell += '"'; i++; } 
          else { inQuotes = !inQuotes; }
        } else if (char === ',' && !inQuotes) {
          currentRow.push(currentCell.trim()); currentCell = '';
        } else if ((char === '\n' || char === '\r') && !inQuotes) {
          if (char === '\r' && text[i+1] === '\n') i++;
          currentRow.push(currentCell.trim());
          if (currentRow.some(c => c !== '')) rows.push(currentRow);
          currentRow = []; currentCell = '';
        } else { currentCell += char; }
      }
      if (currentCell || currentRow.length > 0) {
        currentRow.push(currentCell.trim());
        if (currentRow.some(c => c !== '')) rows.push(currentRow);
      }
      if (rows.length < 2) return [];
      const headers = rows[0];
      return rows.slice(1).map(row => {
        const obj = {};
        headers.forEach((h, i) => obj[h] = row[i] || '');
        return obj;
      });
    }

    async fetchAuthoritativeDate() {
      try {
        const url = window.location.href.split('#')[0].split('?')[0] + '?_cb=' + Date.now();
        const res = await fetch(url, { method: 'GET', cache: 'no-store' });
        const dateHeader = res.headers.get('Date');
        if (!dateHeader) return null;
        const dateObj = new Date(dateHeader);
        if (isNaN(dateObj.getTime())) return null;
        
        const formatter = new Intl.DateTimeFormat('en-GB', {
          timeZone: CONFIG.releaseTimeZone, year: 'numeric', month: '2-digit', day: '2-digit'
        });
        const parts = formatter.formatToParts(dateObj);
        return `${parts.find(p => p.type === 'year').value}-${parts.find(p => p.type === 'month').value}-${parts.find(p => p.type === 'day').value}`;
      } catch (e) { return null; }
    }

    formatDisplayDate(dateStr) {
      if (!dateStr) return "";
      const [y, m, d] = dateStr.split('-');
      const date = new Date(Date.UTC(y, m - 1, d));
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
    }

    initDomReferences() {
      this.dom = {
        screenMenu: document.getElementById("screen-menu"),
        screenGame: document.getElementById("screen-game"),
        garnishContainer: document.getElementById("garnish-container"),
        announcer: document.getElementById("sr-announcer"),
        toastContainer: document.getElementById("toast-container"),
        menuTodayDate: document.getElementById("menu-today-date"),
        menuTodayStatusTitle: document.getElementById("menu-today-status-title"),
        menuTodayProgressBadge: document.getElementById("menu-today-progress-badge"),
        btnPlayToday: document.getElementById("btn-play-today"),
        btnPlayTodayText: document.getElementById("btn-play-today-text"),
        btnOpenVault: document.getElementById("btn-open-vault"),
        btnMenuSound: document.getElementById("btn-menu-sound"),
        menuSoundIcon: document.getElementById("menu-sound-icon"),
        menuSoundLabel: document.getElementById("menu-sound-label"),
        btnMenuStats: document.getElementById("btn-menu-stats"),
        btnMenuHow: document.getElementById("btn-menu-how"),
        btnGameBack: document.getElementById("btn-game-back"),
        btnGameHow: document.getElementById("btn-game-how"),
        btnGameSound: document.getElementById("btn-game-sound"),
        btnGameStats: document.getElementById("btn-game-stats"),
        soundIconOn: document.getElementById("sound-icon-on"),
        soundIconOff: document.getElementById("sound-icon-off"),
        puzzleBadge: document.getElementById("puzzle-badge"),
        vaultBanner: document.getElementById("vault-banner"),
        vaultBannerDate: document.getElementById("vault-banner-date"),
        btnReturnToday: document.getElementById("btn-return-today"),
        board: document.getElementById("board"),
        keyboard: document.getElementById("keyboard"),
        modalVault: document.getElementById("modal-vault"),
        modalHow: document.getElementById("modal-how"),
        modalStats: document.getElementById("modal-stats"),
        modalComplete: document.getElementById("modal-complete"),
        modalError: document.getElementById("modal-error"),
        errorMessage: document.getElementById("error-message"),
        btnErrorRetry: document.getElementById("btn-error-retry"),
        vaultList: document.getElementById("vault-list"),
        vaultFilterDiff: document.getElementById("vault-filter-difficulty"),
        statPlayed: document.getElementById("stat-played"),
        statWinRate: document.getElementById("stat-win-rate"),
        statCurrentStreak: document.getElementById("stat-current-streak"),
        statMaxStreak: document.getElementById("stat-max-streak"),
        guessDistribution: document.getElementById("guess-distribution"),
        completeStatusTag: document.getElementById("complete-status-tag"),
        completeTitle: document.getElementById("complete-title"),
        specCategory: document.getElementById("spec-category"),
        specDifficulty: document.getElementById("spec-difficulty"),
        specWord: document.getElementById("spec-word"),
        specDefinition: document.getElementById("spec-definition"),
        specLore: document.getElementById("spec-lore"),
        btnShare: document.getElementById("btn-share"),
        btnCompleteMenu: document.getElementById("btn-complete-menu"),
        btnCompleteVault: document.getElementById("btn-complete-vault")
      };
    }

    applySavedSoundSetting() {
      this.audio.enabled = !!this.state.soundEnabled;
      this.updateSoundUi();
    }
    toggleSound() {
      this.audio.enabled = !this.audio.enabled;
      this.state.soundEnabled = this.audio.enabled;
      StorageManager.save(this.state);
      this.updateSoundUi();
      this.showToast(this.audio.enabled ? "Audio: ON" : "Audio: MUTED");
      if (this.audio.enabled) this.audio.playKeyTap();
    }
    updateSoundUi() {
      if (this.audio.enabled) {
        this.dom.soundIconOn.classList.remove("hidden");
        this.dom.soundIconOff.classList.add("hidden");
        this.dom.btnGameSound.setAttribute("title", "Sound: ON");
        this.dom.menuSoundLabel.textContent = "SOUND: ON";
        this.dom.menuSoundIcon.textContent = "🎵";
      } else {
        this.dom.soundIconOn.classList.add("hidden");
        this.dom.soundIconOff.classList.remove("hidden");
        this.dom.btnGameSound.setAttribute("title", "Sound: OFF");
        this.dom.menuSoundLabel.textContent = "SOUND: OFF";
        this.dom.menuSoundIcon.textContent = "🔇";
      }
    }

    showScreen(screenName) {
      this.closeAllModals();
      if (screenName === "menu") {
        this.dom.screenGame.classList.add("hidden");
        this.dom.screenMenu.classList.remove("hidden");
        this.atmosphere.setActivityLevel(false);
        this.refreshMenuTodayCard();
      } else if (screenName === "game") {
        this.dom.screenMenu.classList.add("hidden");
        this.dom.screenGame.classList.remove("hidden");
        this.atmosphere.setActivityLevel(true);
      }
    }

    refreshMenuTodayCard() {
      if (!this.todayPuzzle) return;
      this.dom.menuTodayDate.textContent = this.formatDisplayDate(this.todayPuzzle.release_date).toUpperCase();
      const progress = this.state.progress[this.todayPuzzle.release_date];
      if (progress && progress.completed) {
        if (progress.won) {
          this.dom.menuTodayProgressBadge.textContent = `SOLVED (${progress.guesses.length}/6)`;
          this.dom.menuTodayProgressBadge.className = "badge-status solved";
          this.dom.btnPlayTodayText.textContent = "VIEW TODAY'S SPEC";
        } else {
          this.dom.menuTodayProgressBadge.textContent = "MISSED";
          this.dom.menuTodayProgressBadge.className = "badge-status failed";
          this.dom.btnPlayTodayText.textContent = "REVIEW TODAY'S SPEC";
        }
      } else if (progress && progress.guesses && progress.guesses.length > 0) {
        this.dom.menuTodayProgressBadge.textContent = `IN PROGRESS (${progress.guesses.length}/6)`;
        this.dom.menuTodayProgressBadge.className = "badge-status";
        this.dom.btnPlayTodayText.textContent = "RESUME SPECIFICATION";
      } else {
        this.dom.menuTodayProgressBadge.textContent = "READY";
        this.dom.menuTodayProgressBadge.className = "badge-status";
        this.dom.btnPlayTodayText.textContent = "PLAY TODAY'S SPEC";
      }
    }

    buildBoardDom() {
      this.dom.board.innerHTML = "";
      for (let r = 0; r < 6; r++) {
        const row = document.createElement("div"); row.className = "board-row";
        for (let c = 0; c < 5; c++) {
          const tile = document.createElement("div"); tile.className = "tile"; tile.setAttribute("aria-label", "empty");
          row.appendChild(tile);
        }
        this.dom.board.appendChild(row);
      }
    }
    buildKeyboardDom() {
      const layout = [ ["Q","W","E","R","T","Y","U","I","O","P"], ["A","S","D","F","G","H","J","K","L"], ["ENTER","Z","X","C","V","B","N","M","BACK"] ];
      this.dom.keyboard.innerHTML = "";
      layout.forEach(rowKeys => {
        const rowEl = document.createElement("div"); rowEl.className = "keyboard-row";
        rowKeys.forEach(k => {
          const btn = document.createElement("button"); btn.className = "key"; btn.setAttribute("data-key", k);
          if (k === "ENTER") { btn.classList.add("key-wide"); btn.textContent = "ENTER"; } 
          else if (k === "BACK") { btn.classList.add("key-wide"); btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path><line x1="18" y1="9" x2="12" y2="15"></line><line x1="12" y1="9" x2="18" y2="15"></line></svg>`; } 
          else { btn.textContent = k; }
          btn.addEventListener("click", e => { e.preventDefault(); this.handleKeyInput(k); });
          rowEl.appendChild(btn);
        });
        this.dom.keyboard.appendChild(rowEl);
      });
    }

    attachEvents() {
      this.dom.btnPlayToday.addEventListener("click", () => {
        if (!this.todayPuzzle) return;
        this.loadRelease(this.todayPuzzle);
        this.showScreen("game");
      });
      this.dom.btnOpenVault.addEventListener("click", () => this.openVaultModal());
      this.dom.btnMenuSound.addEventListener("click", () => this.toggleSound());
      this.dom.btnMenuStats.addEventListener("click", () => this.openStatsModal());
      this.dom.btnMenuHow.addEventListener("click", () => this.openModal(this.dom.modalHow));
      this.dom.btnGameBack.addEventListener("click", () => this.showScreen("menu"));
      this.dom.btnGameHow.addEventListener("click", () => this.openModal(this.dom.modalHow));
      this.dom.btnGameSound.addEventListener("click", () => this.toggleSound());
      this.dom.btnGameStats.addEventListener("click", () => this.openStatsModal());
      this.dom.vaultFilterDiff.addEventListener("change", () => this.renderVaultList());
      this.dom.btnReturnToday.addEventListener("click", () => {
        if (this.todayPuzzle) this.loadRelease(this.todayPuzzle);
      });
      this.dom.btnCompleteMenu.addEventListener("click", () => { this.closeAllModals(); this.showScreen("menu"); });
      this.dom.btnCompleteVault.addEventListener("click", () => { this.closeAllModals(); this.openVaultModal(); });
      this.dom.btnShare.addEventListener("click", () => this.copyShareResult());
      this.dom.btnErrorRetry.addEventListener("click", () => {
        this.closeAllModals();
        this.initializeReleaseState();
      });

      window.addEventListener("keydown", e => {
        if (e.altKey || e.ctrlKey || e.metaKey || this.dom.screenGame.classList.contains("hidden")) return;
        if (!this.isAnyModalOpen()) {
          if (e.key === "Enter") { e.preventDefault(); this.handleKeyInput("ENTER"); }
          else if (e.key === "Backspace") { e.preventDefault(); this.handleKeyInput("BACK"); }
          else if (/^[a-zA-Z]$/.test(e.key)) { e.preventDefault(); this.handleKeyInput(e.key.toUpperCase()); }
        } else if (e.key === "Escape") this.closeAllModals();
      });

      document.querySelectorAll(".modal-close").forEach(btn => {
        btn.addEventListener("click", () => {
          const targetId = btn.getAttribute("data-close");
          if (targetId) document.getElementById(targetId).classList.add("hidden");
        });
      });
      document.querySelectorAll(".modal-overlay").forEach(overlay => {
        overlay.addEventListener("click", e => { if (e.target === overlay && overlay.id !== 'modal-error') overlay.classList.add("hidden"); });
      });
    }

    handleKeyInput(key) {
      if (this.isGameOver) return;
      if (key === "ENTER") this.submitGuess();
      else if (key === "BACK") {
        if (this.currentInput.length > 0) { this.currentInput = this.currentInput.slice(0, -1); this.audio.playKeyTap(); this.renderCurrentTypingRow(); }
      } else if (/^[A-Z]$/.test(key)) {
        if (this.currentInput.length < 5) { this.currentInput += key; this.audio.playKeyTap(); this.renderCurrentTypingRow(); }
      }
    }

    renderCurrentTypingRow() {
      const rowIndex = this.currentGuesses.length;
      if (rowIndex >= 6) return;
      const row = this.dom.board.children[rowIndex];
      for (let c = 0; c < 5; c++) {
        const char = this.currentInput[c] || "";
        row.children[c].textContent = char;
        if (char) { row.children[c].setAttribute("data-state", "tbd"); row.children[c].setAttribute("aria-label", char); } 
        else { row.children[c].removeAttribute("data-state"); row.children[c].setAttribute("aria-label", "empty"); }
      }
    }

    submitGuess() {
      const rowIndex = this.currentGuesses.length;
      const row = this.dom.board.children[rowIndex];
      if (this.currentInput.length < 5) { this.shakeRow(row); this.audio.playInvalidBuzzer(); this.showToast("Need 5 letters"); return; }
      const guess = this.currentInput.toUpperCase();
      if (!VALID_GUESSES.has(guess)) { this.shakeRow(row); this.audio.playInvalidBuzzer(); this.showToast("Not in dictionary"); return; }
      
      const target = this.activePuzzle.word;
      const evaluation = this.evaluateGuess(guess, target);
      this.currentGuesses.push(guess);
      this.currentInput = "";

      this.animateRowReveal(row, evaluation, () => {
        this.updateKeyboardColors();
        const won = guess === target;
        const lost = !won && this.currentGuesses.length >= 6;
        if (won || lost) this.finishGame(won);
        else this.saveActiveProgress(false, false);
      });
    }

    evaluateGuess(guess, target) {
      const result = Array(5).fill("absent");
      const targetLetters = target.split("");
      const guessLetters = guess.split("");
      const targetFreq = {};
      targetLetters.forEach(c => targetFreq[c] = (targetFreq[c] || 0) + 1);
      for (let i = 0; i < 5; i++) {
        if (guessLetters[i] === targetLetters[i]) { result[i] = "correct"; targetFreq[guessLetters[i]]--; }
      }
      for (let i = 0; i < 5; i++) {
        if (result[i] !== "correct" && targetFreq[guessLetters[i]] > 0) { result[i] = "present"; targetFreq[guessLetters[i]]--; }
      }
      return result.map((status, idx) => ({ letter: guessLetters[idx], status: status }));
    }

    animateRowReveal(row, evaluation, onComplete) {
      let completedCount = 0;
      evaluation.forEach((item, colIdx) => {
        const tile = row.children[colIdx];
        setTimeout(() => {
          tile.classList.add("tile-flip"); this.audio.playGlassClink(colIdx);
          setTimeout(() => {
            tile.classList.add(item.status); tile.removeAttribute("data-state");
            let symbolText = item.status === "correct" ? "✓" : (item.status === "present" ? "◐" : "");
            if (symbolText) {
              const symEl = document.createElement("span"); symEl.className = "tile-symbol"; symEl.textContent = symbolText;
              symEl.setAttribute("aria-hidden", "true"); tile.appendChild(symEl);
            }
            tile.setAttribute("aria-label", `${item.letter}, ${item.status}`);
            completedCount++;
            if (completedCount === 5 && onComplete) onComplete();
          }, 240);
        }, colIdx * 170);
      });
    }

    shakeRow(row) { row.classList.add("row-shake"); setTimeout(() => row.classList.remove("row-shake"), 450); }

    updateKeyboardColors() {
      const bestStatus = {};
      this.currentGuesses.forEach(guess => {
        this.evaluateGuess(guess, this.activePuzzle.word).forEach(({ letter, status }) => {
          const current = bestStatus[letter];
          if (current === "correct") return;
          if (status === "correct") bestStatus[letter] = "correct";
          else if (status === "present" && current !== "correct") bestStatus[letter] = "present";
          else if (!current) bestStatus[letter] = "absent";
        });
      });
      Object.entries(bestStatus).forEach(([letter, status]) => {
        const keyBtn = this.dom.keyboard.querySelector(`[data-key="${letter}"]`);
        if (keyBtn) { keyBtn.classList.remove("correct", "present", "absent"); keyBtn.classList.add(status); }
      });
    }

    finishGame(won) {
      this.isGameOver = true;
      this.saveActiveProgress(true, won);
      this.refreshMenuTodayCard();
      if (won) { this.audio.playVictoryChime(); this.showToast(this.getWinningCompliment()); } 
      else { this.audio.playInvalidBuzzer(); this.showToast(this.activePuzzle.word); }
      this.recordStats(won);
      setTimeout(() => this.openCompletionModal(won), 1200);
    }
    getWinningCompliment() {
      const attempts = this.currentGuesses.length;
      if (attempts === 1) return "Flawless! (1/6)";
      if (attempts === 2) return "Master! (2/6)";
      if (attempts === 3) return "Crisp! (3/6)";
      if (attempts === 4) return "Balanced! (4/6)";
      if (attempts === 5) return "Smooth! (5/6)";
      return "Saved! (6/6)";
    }

    recordStats(won) {
      const s = this.state.stats;
      if (this.activePuzzle.release_date === this.currentUkDate && s.lastCompletedDate !== this.currentUkDate) {
        s.gamesPlayed++;
        s.lastCompletedDate = this.currentUkDate;
        if (won) {
          s.gamesWon++; s.currentStreak++;
          if (s.currentStreak > s.maxStreak) s.maxStreak = s.currentStreak;
          const gIdx = this.currentGuesses.length - 1;
          if (gIdx >= 0 && gIdx < 6) s.guessDistribution[gIdx]++;
        } else { s.currentStreak = 0; }
        StorageManager.save(this.state);
      }
    }

    loadRelease(puzzleRow) {
      this.activePuzzle = puzzleRow;
      this.currentInput = "";
      this.isGameOver = false;
      const isToday = puzzleRow.release_date === this.currentUkDate;
      
      if (isToday) {
        this.dom.puzzleBadge.textContent = `TODAY'S SPEC`;
        this.dom.vaultBanner.classList.add("hidden");
      } else {
        this.dom.puzzleBadge.textContent = `ARCHIVE SPEC`;
        this.dom.vaultBannerDate.textContent = this.formatDisplayDate(puzzleRow.release_date);
        this.dom.vaultBanner.classList.remove("hidden");
      }

      this.buildBoardDom();
      this.dom.keyboard.querySelectorAll(".key").forEach(k => k.classList.remove("correct", "present", "absent"));

      const saved = this.state.progress[puzzleRow.release_date];
      if (saved && Array.isArray(saved.guesses)) {
        this.currentGuesses = [...saved.guesses];
        this.isGameOver = !!saved.completed;
        this.currentGuesses.forEach((guess, rowIdx) => {
          const evalResult = this.evaluateGuess(guess, this.activePuzzle.word);
          const row = this.dom.board.children[rowIdx];
          evalResult.forEach((item, colIdx) => {
            const tile = row.children[colIdx];
            tile.textContent = item.letter; tile.classList.add(item.status);
            let symbolText = item.status === "correct" ? "✓" : (item.status === "present" ? "◐" : "");
            if (symbolText) {
              const symEl = document.createElement("span"); symEl.className = "tile-symbol";
              symEl.textContent = symbolText; tile.appendChild(symEl);
            }
          });
        });
        this.updateKeyboardColors();
        if (this.isGameOver) setTimeout(() => this.openCompletionModal(saved.won), 350);
      } else {
        this.currentGuesses = [];
      }
      this.announce(`Loaded spec ${puzzleRow.release_date}`);
    }

    saveActiveProgress(completed, won) {
      this.state.progress[this.activePuzzle.release_date] = { guesses: this.currentGuesses, completed: completed, won: won };
      StorageManager.save(this.state);
    }

    openStatsModal() {
      const s = this.state.stats;
      this.dom.statPlayed.textContent = s.gamesPlayed;
      this.dom.statWinRate.textContent = `${s.gamesPlayed > 0 ? Math.round((s.gamesWon / s.gamesPlayed) * 100) : 0}%`;
      this.dom.statCurrentStreak.textContent = s.currentStreak;
      this.dom.statMaxStreak.textContent = s.maxStreak;
      this.dom.guessDistribution.innerHTML = "";
      const maxFreq = Math.max(...s.guessDistribution, 1);
      s.guessDistribution.forEach((count, idx) => {
        const row = document.createElement("div"); row.className = "dist-row";
        const label = document.createElement("span"); label.textContent = idx + 1;
        const wrapper = document.createElement("div"); wrapper.className = "dist-bar-wrapper";
        const bar = document.createElement("div"); bar.className = "dist-bar";
        bar.style.width = `${Math.max((count / maxFreq) * 100, 7)}%`; bar.textContent = count;
        if (this.isGameOver && this.currentGuesses.length === idx + 1 && this.state.progress[this.activePuzzle.release_date]?.won) bar.classList.add("highlight");
        wrapper.appendChild(bar); row.appendChild(label); row.appendChild(wrapper);
        this.dom.guessDistribution.appendChild(row);
      });
      this.openModal(this.dom.modalStats);
    }

    openVaultModal() {
      this.renderVaultList();
      this.openModal(this.dom.modalVault);
    }
    renderVaultList() {
      const selectedDiff = this.dom.vaultFilterDiff.value;
      this.dom.vaultList.innerHTML = "";
      if (this.vaultPuzzles.length === 0) {
        this.dom.vaultList.innerHTML = `<div style="text-align:center; padding: 24px; color: var(--text-muted);">The Vault is currently empty.</div>`;
        return;
      }
      this.vaultPuzzles.forEach(p => {
        if (selectedDiff !== "ALL" && p.difficulty !== selectedDiff) return;
        const progress = this.state.progress[p.release_date];
        const isSolved = progress && progress.won;
        const card = document.createElement("div");
        card.className = `vault-item ${isSolved ? "solved" : ""}`;
        card.innerHTML = `<div class="vault-meta"><span class="vault-day-tag">${this.formatDisplayDate(p.release_date)} • ${p.difficulty.toUpperCase()}</span><strong class="vault-name">${p.title}</strong></div><div class="vault-status">${isSolved ? '<span class="vault-badge-complete">SOLVED</span>' : '<span style="font-size:0.8rem; color:var(--gold-sheen-2); font-weight:800;">PLAY →</span>'}</div>`;
        card.addEventListener("click", () => { this.closeAllModals(); this.loadRelease(p); this.showScreen("game"); });
        this.dom.vaultList.appendChild(card);
      });
    }

    openCompletionModal(won) {
      const p = this.activePuzzle;
      this.dom.completeStatusTag.textContent = won ? "SPEC SOLVED" : "SPEC MISSED";
      this.dom.completeTitle.textContent = won ? "MASTER MIXOLOGIST" : "SHIFT END";
      this.dom.specCategory.textContent = p.category;
      this.dom.specDifficulty.textContent = p.difficulty;
      this.dom.specWord.textContent = p.word;
      this.dom.specDefinition.textContent = p.definition;
      this.dom.specLore.textContent = p.lore;
      this.openModal(this.dom.modalComplete);
    }

    showErrorState(message) {
      this.dom.errorMessage.textContent = message;
      this.openModal(this.dom.modalError);
    }

    copyShareResult() {
      const won = this.state.progress[this.activePuzzle.release_date]?.won;
      const count = won ? this.currentGuesses.length : "X";
      let text = `Cocktail Wordle ${this.activePuzzle.release_date} ${count}/6\n\n`;
      this.currentGuesses.forEach(guess => {
        this.evaluateGuess(guess, this.activePuzzle.word).forEach(item => {
          text += item.status === "correct" ? "🟩" : (item.status === "present" ? "🟨" : "⬛");
        });
        text += "\n";
      });
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => this.showToast("Copied to clipboard!"));
      }
    }

    showToast(message) {
      const toast = document.createElement("div"); toast.className = "toast"; toast.textContent = message;
      this.dom.toastContainer.appendChild(toast); this.announce(message);
      setTimeout(() => { toast.style.opacity = "0"; toast.style.transform = "translateY(-6px)"; toast.style.transition = "all 0.2s ease"; setTimeout(() => toast.remove(), 220); }, 2000);
    }
    announce(text) { this.dom.announcer.textContent = ""; setTimeout(() => this.dom.announcer.textContent = text, 40); }
    openModal(modalEl) { this.closeAllModals(); modalEl.classList.remove("hidden"); }
    closeAllModals() { document.querySelectorAll(".modal-overlay").forEach(m => m.classList.add("hidden")); }
    isAnyModalOpen() { return Array.from(document.querySelectorAll(".modal-overlay")).some(m => !m.classList.contains("hidden")); }
  }

  document.addEventListener("DOMContentLoaded", () => window.CocktailWordle = new CocktailWordleEngine());
})();