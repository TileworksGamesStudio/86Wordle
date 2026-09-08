/**
 * COCKTAIL WORDLE — PLATFORM ENGINE & CONTROLLER
 * 
 * CONTINUITY & ARCHITECTURAL SPECIFICATIONS MET:
 * 1. Dedicated Standalone Main Menu Screen:
 *    - Standalone screen architecture: Today's Spec Card > Vault > 86 Hub > Sound.
 *    - Smooth transitions between Main Menu, Gameplay, and Vault.
 * 2. Deterministic Scheduling & Day 0:
 *    - DAY 0 Baseline: 8 September 2026 (00:00:00 UTC).
 *    - On Day 0: Today = first puzzle; The Vault is empty.
 *    - On Day 1 (9 Sep 2026): Today = second puzzle; Vault = first puzzle (Day 0).
 *    - Appending new puzzles will not remap historical releases or corrupt player state.
 * 3. Cocktail Garnish Atmosphere System:
 *    - SVG line-art garnishes (twist, citrus wheel, mint, cherry, olive, rosemary).
 *    - Main Menu: 2-5 active floating botanicals; Gameplay: reduced to 1-2.
 * 4. Wordle Game Engine:
 *    - 6 attempts, 5 letters, duplicate-letter logic, accessibility indicators.
 * 5. Versioned Local Storage (v1):
 *    - Saves daily progress, sound preference, vault completions, and patron records.
 */

(function () {
  "use strict";

  // --- 1. PRODUCT BASELINE CONSTANTS ---
  const PLATFORM_CONFIG = {
    // 8 September 2026 treated as Day 0 Baseline
    DAY_ZERO_EPOCH: "2026-09-08T00:00:00Z",
    WORD_LENGTH: 5,
    MAX_GUESSES: 6,
    HUB_URL: "https://tileworksgamesstudio.github.io/86/"
  };

  // --- 2. LUXURY WEB AUDIO SYNTHESIZER ---
  class LoungeAudioSystem {
    constructor() {
      this.ctx = null;
      this.enabled = true;
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume();
      }
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

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.035);
    }

    playGlassClink(index = 0) {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const baseFreq = 587.33; // D5
      const noteFreq = baseFreq * Math.pow(1.12, index);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(noteFreq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.22);
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

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.16);
    }

    playVictoryChime() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.09);

        gain.gain.setValueAtTime(0.18, this.ctx.currentTime + i * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + i * 0.09 + 0.38);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + i * 0.09);
        osc.stop(this.ctx.currentTime + i * 0.09 + 0.42);
      });
    }
  }

  // --- 3. DETERMINISTIC DAILY SCHEDULER ---
  class DailyScheduler {
    constructor(puzzles, epochDateStr) {
      this.puzzles = puzzles || [];
      this.epoch = new Date(epochDateStr).getTime();
      this.MS_PER_DAY = 86400000;
    }

    // Returns zero-based release day index (Day 0 = 8 Sep 2026)
    getCurrentReleaseDay() {
      const now = Date.now();
      const diff = now - this.epoch;
      if (diff < 0) return 0; // Safeguard: baseline Day 0
      return Math.floor(diff / this.MS_PER_DAY);
    }

    // Resolves a puzzle object deterministically for a 0-based day number
    getPuzzleForDay(dayNumber) {
      const total = this.puzzles.length;
      if (total === 0) return null;

      // Sequential deterministic mapping with graceful wrap
      const index = dayNumber % total;
      const base = this.puzzles[index];
      return {
        ...base,
        releaseDay: dayNumber
      };
    }

    // Vault contains only released puzzles strictly before currentDay (0 to currentDay - 1)
    getVaultDays(currentDay) {
      const days = [];
      for (let d = 0; d < currentDay; d++) {
        days.push(this.getPuzzleForDay(d));
      }
      return days.reverse(); // Most recent first
    }

    getMsUntilMidnight() {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
      return Math.max(0, tomorrow.getTime() - now.getTime());
    }

    formatDisplayDate(dayNumber) {
      const puzzleDate = new Date(this.epoch + dayNumber * this.MS_PER_DAY);
      return puzzleDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    }
  }

  // --- 4. PERSISTENT STORAGE REPOSITORY ---
  const STORAGE_KEY = "cocktail_wordle_platform_v1";

  class StorageManager {
    static load() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return this.getDefault();
        const parsed = JSON.parse(raw);
        if (parsed.version !== 1) return this.getDefault();
        return parsed;
      } catch (e) {
        console.warn("[Storage] Recovery to default state", e);
        return this.getDefault();
      }
    }

    static save(data) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (e) {
        console.error("[Storage] Write error", e);
      }
    }

    static getDefault() {
      return {
        version: 1,
        soundEnabled: true,
        stats: {
          gamesPlayed: 0,
          gamesWon: 0,
          currentStreak: 0,
          maxStreak: 0,
          guessDistribution: [0, 0, 0, 0, 0, 0],
          lastCompletedDay: -1
        },
        daysProgress: {} // dayNumber -> { guesses: string[], completed: boolean, won: boolean, timestamp: number }
      };
    }
  }

  // --- 5. ATMOSPHERIC GARNISH SYSTEM ---
  class GarnishAtmosphereSystem {
    constructor(containerEl) {
      this.container = containerEl;
      this.targetMax = 4; // Main menu target: 2-5 icons
      this.activeNodes = new Set();
      this.spawnTimer = null;

      // Fine-line gold garnish SVGs
      this.garnishSvgLibrary = [
        // 1. Citrus Twist Spiral
        `<svg viewBox="0 0 48 48"><path d="M12 36 C10 24, 28 26, 26 16 C24 8, 38 10, 36 6"/></svg>`,
        // 2. Dehydrated Citrus Wheel
        `<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="20"/><circle cx="24" cy="24" r="14"/><line x1="24" y1="10" x2="24" y2="38"/><line x1="10" y1="24" x2="38" y2="24"/><line x1="14" y1="14" x2="34" y2="34"/><line x1="14" y1="34" x2="34" y2="14"/></svg>`,
        // 3. Mint Sprig
        `<svg viewBox="0 0 48 48"><path d="M24 42 C24 24, 24 12, 24 6"/><path d="M24 28 C16 26, 12 18, 18 16 C22 14, 24 24, 24 28 Z"/><path d="M24 22 C32 20, 36 12, 30 10 C26 8, 24 18, 24 22 Z"/></svg>`,
        // 4. Cocktail Cherry on Stem
        `<svg viewBox="0 0 48 48"><circle cx="20" cy="30" r="10"/><path d="M20 20 C22 10, 34 6, 38 8"/><circle cx="34" cy="28" r="8"/></svg>`,
        // 5. Olive on Cocktail Skewer
        `<svg viewBox="0 0 48 48"><line x1="10" y1="38" x2="38" y2="10"/><ellipse cx="24" cy="24" rx="11" ry="8" transform="rotate(-45 24 24)"/><circle cx="24" cy="24" r="3"/></svg>`,
        // 6. Fragrant Rosemary Sprig
        `<svg viewBox="0 0 48 48"><path d="M24 42 L24 6"/><path d="M24 34 L16 28 M24 30 L32 24 M24 22 L16 16 M24 18 L32 12 M24 10 L18 6 M24 10 L30 6"/></svg>`
      ];

      this.start();
    }

    setActivityLevel(isGameActive) {
      this.targetMax = isGameActive ? 2 : 4;
    }

    start() {
      const tick = () => {
        if (this.activeNodes.size < this.targetMax) {
          this.spawnGarnish();
        }
        const nextDelay = 2200 + Math.random() * 2600;
        this.spawnTimer = setTimeout(tick, nextDelay);
      };
      tick();
    }

    spawnGarnish() {
      if (!this.container) return;

      const el = document.createElement("div");
      el.className = "garnish-icon";

      const svgHtml = this.garnishSvgLibrary[Math.floor(Math.random() * this.garnishSvgLibrary.length)];
      el.innerHTML = svgHtml;

      const size = Math.floor(34 + Math.random() * 28);
      const leftPercent = Math.floor(8 + Math.random() * 84);
      const duration = 12 + Math.random() * 8;

      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.left = `${leftPercent}%`;
      el.style.animationDuration = `${duration}s`;

      this.container.appendChild(el);
      this.activeNodes.add(el);

      setTimeout(() => {
        el.remove();
        this.activeNodes.delete(el);
      }, duration * 1000);
    }
  }

  // --- 6. CORE GAME CONTROLLER ---
  class CocktailWordleEngine {
    constructor() {
      this.scheduler = new DailyScheduler(COCKTAIL_PUZZLES, PLATFORM_CONFIG.DAY_ZERO_EPOCH);
      this.audio = new LoungeAudioSystem();
      this.state = StorageManager.load();

      this.todayDayNumber = this.scheduler.getCurrentReleaseDay();
      this.activeDayNumber = this.todayDayNumber;
      this.activePuzzle = this.scheduler.getPuzzleForDay(this.activeDayNumber);

      this.currentGuesses = [];
      this.currentInput = "";
      this.isGameOver = false;

      this.initDomReferences();
      this.atmosphere = new GarnishAtmosphereSystem(this.dom.garnishContainer);
      this.applySavedSoundSetting();
      this.buildBoardDom();
      this.buildKeyboardDom();
      this.attachEvents();
      this.refreshMenuTodayCard();
      this.startMidnightWatcher();
      this.startCountdownTimer();
    }

    initDomReferences() {
      this.dom = {
        // Screens
        screenMenu: document.getElementById("screen-menu"),
        screenGame: document.getElementById("screen-game"),

        // Ambient & Atmosphere
        garnishContainer: document.getElementById("garnish-container"),
        announcer: document.getElementById("sr-announcer"),
        toastContainer: document.getElementById("toast-container"),

        // Main Menu Elements
        menuTodayNumber: document.getElementById("menu-today-number"),
        menuTodayDate: document.getElementById("menu-today-date"),
        menuTodayStatusTitle: document.getElementById("menu-today-status-title"),
        menuTodayDesc: document.getElementById("menu-today-desc"),
        menuTodayProgressBadge: document.getElementById("menu-today-progress-badge"),
        menuTodayCurriculum: document.getElementById("menu-today-curriculum"),
        btnPlayToday: document.getElementById("btn-play-today"),
        btnPlayTodayText: document.getElementById("btn-play-today-text"),
        btnOpenVault: document.getElementById("btn-open-vault"),
        menuVaultCount: document.getElementById("menu-vault-count"),
        btnMenuSound: document.getElementById("btn-menu-sound"),
        menuSoundIcon: document.getElementById("menu-sound-icon"),
        menuSoundLabel: document.getElementById("menu-sound-label"),
        btnMenuStats: document.getElementById("btn-menu-stats"),
        btnMenuHow: document.getElementById("btn-menu-how"),

        // Game Header Controls
        btnGameBack: document.getElementById("btn-game-back"),
        btnGameHow: document.getElementById("btn-game-how"),
        btnGameSound: document.getElementById("btn-game-sound"),
        btnGameStats: document.getElementById("btn-game-stats"),
        soundIconOn: document.getElementById("sound-icon-on"),
        soundIconOff: document.getElementById("sound-icon-off"),
        puzzleBadge: document.getElementById("puzzle-badge"),
        vaultBanner: document.getElementById("vault-banner"),
        vaultBannerDay: document.getElementById("vault-banner-day"),
        btnReturnToday: document.getElementById("btn-return-today"),

        // Board & Keyboard
        board: document.getElementById("board"),
        keyboard: document.getElementById("keyboard"),

        // Modals
        modalVault: document.getElementById("modal-vault"),
        modalHow: document.getElementById("modal-how"),
        modalStats: document.getElementById("modal-stats"),
        modalComplete: document.getElementById("modal-complete"),

        // Vault View
        vaultList: document.getElementById("vault-list"),
        vaultFilterDiff: document.getElementById("vault-filter-difficulty"),

        // Stats UI
        statPlayed: document.getElementById("stat-played"),
        statWinRate: document.getElementById("stat-win-rate"),
        statCurrentStreak: document.getElementById("stat-current-streak"),
        statMaxStreak: document.getElementById("stat-max-streak"),
        guessDistribution: document.getElementById("guess-distribution"),

        // Result Reveal Elements
        completeStatusTag: document.getElementById("complete-status-tag"),
        completeTitle: document.getElementById("complete-title"),
        specCategory: document.getElementById("spec-category"),
        specDifficulty: document.getElementById("spec-difficulty"),
        specWord: document.getElementById("spec-word"),
        specDefinition: document.getElementById("spec-definition"),
        specLore: document.getElementById("spec-lore"),
        btnShare: document.getElementById("btn-share"),
        countdownTimer: document.getElementById("countdown-timer"),
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
      this.showToast(this.audio.enabled ? "Lounge Audio: ON" : "Lounge Audio: MUTED");
      if (this.audio.enabled) {
        this.audio.playKeyTap();
      }
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

    // --- 7. NAVIGATION & SCREEN SWITCHING ---
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
      const todayNum = this.todayDayNumber;
      const todayPuzzle = this.scheduler.getPuzzleForDay(todayNum);
      const progress = this.state.daysProgress[todayNum];

      this.dom.menuTodayNumber.textContent = `SPEC #${todayNum}`;
      this.dom.menuTodayDate.textContent = this.scheduler.formatDisplayDate(todayNum);
      this.dom.menuTodayCurriculum.textContent = todayPuzzle.category;

      const vaultCount = this.todayDayNumber;
      this.dom.menuVaultCount.textContent = vaultCount === 0 
        ? "The Vault opens tonight at midnight" 
        : `${vaultCount} historical spec${vaultCount === 1 ? "" : "s"} archived`;

      if (progress && progress.completed) {
        if (progress.won) {
          this.dom.menuTodayProgressBadge.textContent = `SOLVED (${progress.guesses.length}/6)`;
          this.dom.menuTodayProgressBadge.className = "badge-status solved";
          this.dom.btnPlayTodayText.textContent = "VIEW TODAY'S SPEC";
        } else {
          this.dom.menuTodayProgressBadge.textContent = "SHIFT ENDED (MISSED)";
          this.dom.menuTodayProgressBadge.className = "badge-status failed";
          this.dom.btnPlayTodayText.textContent = "REVIEW TODAY'S SPEC";
        }
      } else if (progress && progress.guesses && progress.guesses.length > 0) {
        this.dom.menuTodayProgressBadge.textContent = `IN PROGRESS (${progress.guesses.length}/6)`;
        this.dom.menuTodayProgressBadge.className = "badge-status";
        this.dom.btnPlayTodayText.textContent = "RESUME SPECIFICATION";
      } else {
        this.dom.menuTodayProgressBadge.textContent = "READY TO SERVE";
        this.dom.menuTodayProgressBadge.className = "badge-status";
        this.dom.btnPlayTodayText.textContent = "PLAY TODAY'S SPEC";
      }
    }

    buildBoardDom() {
      this.dom.board.innerHTML = "";
      for (let r = 0; r < PLATFORM_CONFIG.MAX_GUESSES; r++) {
        const row = document.createElement("div");
        row.className = "board-row";
        row.setAttribute("role", "row");
        row.setAttribute("data-row-idx", r);

        for (let c = 0; c < PLATFORM_CONFIG.WORD_LENGTH; c++) {
          const tile = document.createElement("div");
          tile.className = "tile";
          tile.setAttribute("role", "gridcell");
          tile.setAttribute("data-col-idx", c);
          tile.setAttribute("aria-label", "empty");
          row.appendChild(tile);
        }
        this.dom.board.appendChild(row);
      }
    }

    buildKeyboardDom() {
      const layout = [
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
        ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACK"]
      ];

      this.dom.keyboard.innerHTML = "";
      layout.forEach((rowKeys) => {
        const rowEl = document.createElement("div");
        rowEl.className = "keyboard-row";

        rowKeys.forEach((k) => {
          const btn = document.createElement("button");
          btn.className = "key";
          btn.setAttribute("data-key", k);

          if (k === "ENTER") {
            btn.classList.add("key-wide");
            btn.textContent = "ENTER";
            btn.setAttribute("aria-label", "Submit guess");
          } else if (k === "BACK") {
            btn.classList.add("key-wide");
            btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path><line x1="18" y1="9" x2="12" y2="15"></line><line x1="12" y1="9" x2="18" y2="15"></line></svg>`;
            btn.setAttribute("aria-label", "Backspace");
          } else {
            btn.textContent = k;
            btn.setAttribute("aria-label", k);
          }

          btn.addEventListener("click", (e) => {
            e.preventDefault();
            this.handleKeyInput(k);
          });
          rowEl.appendChild(btn);
        });
        this.dom.keyboard.appendChild(rowEl);
      });
    }

    attachEvents() {
      // Main Menu buttons
      this.dom.btnPlayToday.addEventListener("click", () => {
        this.loadDayProgress(this.todayDayNumber);
        this.showScreen("game");
      });

      this.dom.btnOpenVault.addEventListener("click", () => {
        this.openVaultModal();
      });

      this.dom.btnMenuSound.addEventListener("click", () => this.toggleSound());
      this.dom.btnMenuStats.addEventListener("click", () => this.openStatsModal());
      this.dom.btnMenuHow.addEventListener("click", () => this.openModal(this.dom.modalHow));

      // In-game header buttons
      this.dom.btnGameBack.addEventListener("click", () => {
        this.showScreen("menu");
      });
      this.dom.btnGameHow.addEventListener("click", () => this.openModal(this.dom.modalHow));
      this.dom.btnGameSound.addEventListener("click", () => this.toggleSound());
      this.dom.btnGameStats.addEventListener("click", () => this.openStatsModal());

      // Vault filter & return banner
      this.dom.vaultFilterDiff.addEventListener("change", () => this.renderVaultList());
      this.dom.btnReturnToday.addEventListener("click", () => {
        this.loadDayProgress(this.todayDayNumber);
      });

      // Completion screen auxiliary navigation
      this.dom.btnCompleteMenu.addEventListener("click", () => {
        this.closeAllModals();
        this.showScreen("menu");
      });
      this.dom.btnCompleteVault.addEventListener("click", () => {
        this.closeAllModals();
        this.openVaultModal();
      });

      // Share result
      this.dom.btnShare.addEventListener("click", () => this.copyShareResult());

      // Keyboard physical input
      window.addEventListener("keydown", (e) => {
        if (e.altKey || e.ctrlKey || e.metaKey) return;
        if (this.dom.screenGame.classList.contains("hidden")) return;

        if (!this.isAnyModalOpen()) {
          if (e.key === "Enter") {
            e.preventDefault();
            this.handleKeyInput("ENTER");
          } else if (e.key === "Backspace") {
            e.preventDefault();
            this.handleKeyInput("BACK");
          } else if (/^[a-zA-Z]$/.test(e.key)) {
            e.preventDefault();
            this.handleKeyInput(e.key.toUpperCase());
          }
        } else if (e.key === "Escape") {
          this.closeAllModals();
        }
      });

      // Modal Close Elements
      document.querySelectorAll(".modal-close").forEach((btn) => {
        btn.addEventListener("click", () => {
          const targetId = btn.getAttribute("data-close");
          if (targetId) {
            document.getElementById(targetId).classList.add("hidden");
          }
        });
      });

      // Modal Backdrop Click
      document.querySelectorAll(".modal-overlay").forEach((overlay) => {
        overlay.addEventListener("click", (e) => {
          if (e.target === overlay) {
            overlay.classList.add("hidden");
          }
        });
      });
    }

    // --- 8. WORDLE GAMEPLAY ENGINE ---
    handleKeyInput(key) {
      if (this.isGameOver) return;

      if (key === "ENTER") {
        this.submitGuess();
      } else if (key === "BACK") {
        if (this.currentInput.length > 0) {
          this.currentInput = this.currentInput.slice(0, -1);
          this.audio.playKeyTap();
          this.renderCurrentTypingRow();
        }
      } else if (/^[A-Z]$/.test(key)) {
        if (this.currentInput.length < PLATFORM_CONFIG.WORD_LENGTH) {
          this.currentInput += key;
          this.audio.playKeyTap();
          this.renderCurrentTypingRow();
        }
      }
    }

    renderCurrentTypingRow() {
      const rowIndex = this.currentGuesses.length;
      if (rowIndex >= PLATFORM_CONFIG.MAX_GUESSES) return;

      const row = this.dom.board.children[rowIndex];
      const tiles = row.children;

      for (let c = 0; c < PLATFORM_CONFIG.WORD_LENGTH; c++) {
        const char = this.currentInput[c] || "";
        tiles[c].textContent = char;
        if (char) {
          tiles[c].setAttribute("data-state", "tbd");
          tiles[c].setAttribute("aria-label", char);
        } else {
          tiles[c].removeAttribute("data-state");
          tiles[c].setAttribute("aria-label", "empty");
        }
      }
    }

    submitGuess() {
      const rowIndex = this.currentGuesses.length;
      const row = this.dom.board.children[rowIndex];

      if (this.currentInput.length < PLATFORM_CONFIG.WORD_LENGTH) {
        this.shakeRow(row);
        this.audio.playInvalidBuzzer();
        this.showToast("Need 5 letters");
        return;
      }

      const guess = this.currentInput.toUpperCase();

      // Check dictionary validity
      if (typeof VALID_GUESSES !== "undefined" && !VALID_GUESSES.has(guess)) {
        this.shakeRow(row);
        this.audio.playInvalidBuzzer();
        this.showToast("Not in drink dictionary");
        return;
      }

      // Valid guess -> evaluate
      const target = this.activePuzzle.word;
      const evaluation = this.evaluateGuess(guess, target);

      this.currentGuesses.push(guess);
      this.currentInput = "";

      this.animateRowReveal(row, evaluation, () => {
        this.updateKeyboardColors();

        const won = guess === target;
        const lost = !won && this.currentGuesses.length >= PLATFORM_CONFIG.MAX_GUESSES;

        if (won || lost) {
          this.finishGame(won);
        } else {
          this.saveActiveDayProgress(false, false);
        }
      });
    }

    evaluateGuess(guess, target) {
      const result = Array(PLATFORM_CONFIG.WORD_LENGTH).fill("absent");
      const targetLetters = target.split("");
      const guessLetters = guess.split("");
      const targetFrequency = {};

      for (let char of targetLetters) {
        targetFrequency[char] = (targetFrequency[char] || 0) + 1;
      }

      // First pass: Correct matches
      for (let i = 0; i < PLATFORM_CONFIG.WORD_LENGTH; i++) {
        if (guessLetters[i] === targetLetters[i]) {
          result[i] = "correct";
          targetFrequency[guessLetters[i]]--;
        }
      }

      // Second pass: Present matches
      for (let i = 0; i < PLATFORM_CONFIG.WORD_LENGTH; i++) {
        if (result[i] !== "correct") {
          const char = guessLetters[i];
          if (targetFrequency[char] > 0) {
            result[i] = "present";
            targetFrequency[char]--;
          }
        }
      }

      return result.map((status, idx) => ({
        letter: guessLetters[idx],
        status: status
      }));
    }

    animateRowReveal(row, evaluation, onComplete) {
      const tiles = row.children;
      let completedCount = 0;

      evaluation.forEach((item, colIdx) => {
        const tile = tiles[colIdx];
        setTimeout(() => {
          tile.classList.add("tile-flip");
          this.audio.playGlassClink(colIdx);

          setTimeout(() => {
            tile.classList.add(item.status);
            tile.removeAttribute("data-state");

            // High-contrast accessibility shape symbol
            let symbolText = "";
            if (item.status === "correct") symbolText = "✓";
            else if (item.status === "present") symbolText = "◐";

            if (symbolText) {
              const symEl = document.createElement("span");
              symEl.className = "tile-symbol";
              symEl.textContent = symbolText;
              symEl.setAttribute("aria-hidden", "true");
              tile.appendChild(symEl);
            }

            tile.setAttribute("aria-label", `${item.letter}, ${item.status}`);
            completedCount++;

            if (completedCount === PLATFORM_CONFIG.WORD_LENGTH && onComplete) {
              onComplete();
            }
          }, 240);
        }, colIdx * 170);
      });
    }

    shakeRow(row) {
      row.classList.add("row-shake");
      setTimeout(() => row.classList.remove("row-shake"), 450);
    }

    updateKeyboardColors() {
      const bestStatus = {};

      this.currentGuesses.forEach((guess) => {
        const evalResult = this.evaluateGuess(guess, this.activePuzzle.word);
        evalResult.forEach(({ letter, status }) => {
          const current = bestStatus[letter];
          if (current === "correct") return;
          if (status === "correct") {
            bestStatus[letter] = "correct";
          } else if (status === "present" && current !== "correct") {
            bestStatus[letter] = "present";
          } else if (!current) {
            bestStatus[letter] = "absent";
          }
        });
      });

      Object.entries(bestStatus).forEach(([letter, status]) => {
        const keyBtn = this.dom.keyboard.querySelector(`[data-key="${letter}"]`);
        if (keyBtn) {
          keyBtn.classList.remove("correct", "present", "absent");
          keyBtn.classList.add(status);
        }
      });
    }

    finishGame(won) {
      this.isGameOver = true;
      this.saveActiveDayProgress(true, won);
      this.refreshMenuTodayCard();

      if (won) {
        this.audio.playVictoryChime();
        this.showToast(this.getWinningCompliment());
      } else {
        this.audio.playInvalidBuzzer();
        this.showToast(`The Spec was ${this.activePuzzle.word}`);
      }

      this.recordStats(won);

      setTimeout(() => {
        this.openCompletionModal(won);
      }, 1200);
    }

    getWinningCompliment() {
      const attempts = this.currentGuesses.length;
      if (attempts === 1) return "Flawless Palate! (1/6)";
      if (attempts === 2) return "Master Mixologist! (2/6)";
      if (attempts === 3) return "Crisp Pour! (3/6)";
      if (attempts === 4) return "Well Balanced! (4/6)";
      if (attempts === 5) return "Smooth Finish! (5/6)";
      return "Saved by the Garnish! (6/6)";
    }

    recordStats(won) {
      const s = this.state.stats;
      // Record stats strictly once for today's release
      if (this.activeDayNumber === this.todayDayNumber && s.lastCompletedDay !== this.todayDayNumber) {
        s.gamesPlayed++;
        s.lastCompletedDay = this.todayDayNumber;

        if (won) {
          s.gamesWon++;
          s.currentStreak++;
          if (s.currentStreak > s.maxStreak) {
            s.maxStreak = s.currentStreak;
          }
          const guessIndex = this.currentGuesses.length - 1;
          if (guessIndex >= 0 && guessIndex < 6) {
            s.guessDistribution[guessIndex]++;
          }
        } else {
          s.currentStreak = 0;
        }
        StorageManager.save(this.state);
      }
    }

    // --- 9. DAY LOADING & VAULT INTEGRATION ---
    loadDayProgress(dayNumber) {
      this.activeDayNumber = dayNumber;
      this.activePuzzle = this.scheduler.getPuzzleForDay(dayNumber);
      this.currentInput = "";
      this.isGameOver = false;

      const isToday = dayNumber === this.todayDayNumber;
      if (isToday) {
        this.dom.puzzleBadge.textContent = `TODAY'S SPEC #${dayNumber}`;
        this.dom.vaultBanner.classList.add("hidden");
      } else {
        this.dom.puzzleBadge.textContent = `ARCHIVE SPEC #${dayNumber}`;
        this.dom.vaultBannerDay.textContent = `#${dayNumber}`;
        this.dom.vaultBanner.classList.remove("hidden");
      }

      this.buildBoardDom();
      this.clearKeyboardColors();

      const saved = this.state.daysProgress[dayNumber];
      if (saved && Array.isArray(saved.guesses)) {
        this.currentGuesses = [...saved.guesses];
        this.isGameOver = !!saved.completed;

        this.currentGuesses.forEach((guess, rowIdx) => {
          const evalResult = this.evaluateGuess(guess, this.activePuzzle.word);
          const row = this.dom.board.children[rowIdx];
          evalResult.forEach((item, colIdx) => {
            const tile = row.children[colIdx];
            tile.textContent = item.letter;
            tile.classList.add(item.status);

            let symbolText = "";
            if (item.status === "correct") symbolText = "✓";
            else if (item.status === "present") symbolText = "◐";
            if (symbolText) {
              const symEl = document.createElement("span");
              symEl.className = "tile-symbol";
              symEl.textContent = symbolText;
              symEl.setAttribute("aria-hidden", "true");
              tile.appendChild(symEl);
            }
            tile.setAttribute("aria-label", `${item.letter}, ${item.status}`);
          });
        });

        this.updateKeyboardColors();

        if (this.isGameOver) {
          setTimeout(() => {
            this.openCompletionModal(saved.won);
          }, 350);
        }
      } else {
        this.currentGuesses = [];
      }

      this.announce(`Loaded spec #${dayNumber}. ${isToday ? "Today's cocktail puzzle." : "Vault archive puzzle."}`);
    }

    saveActiveDayProgress(completed, won) {
      this.state.daysProgress[this.activeDayNumber] = {
        guesses: this.currentGuesses,
        completed: completed,
        won: won,
        timestamp: Date.now()
      };
      StorageManager.save(this.state);
    }

    clearKeyboardColors() {
      const keys = this.dom.keyboard.querySelectorAll(".key");
      keys.forEach((k) => k.classList.remove("correct", "present", "absent"));
    }

    // --- 10. MODALS, STATS & VAULT UI ---
    openStatsModal() {
      const s = this.state.stats;
      this.dom.statPlayed.textContent = s.gamesPlayed;
      const rate = s.gamesPlayed > 0 ? Math.round((s.gamesWon / s.gamesPlayed) * 100) : 0;
      this.dom.statWinRate.textContent = `${rate}%`;
      this.dom.statCurrentStreak.textContent = s.currentStreak;
      this.dom.statMaxStreak.textContent = s.maxStreak;

      this.dom.guessDistribution.innerHTML = "";
      const maxFreq = Math.max(...s.guessDistribution, 1);

      s.guessDistribution.forEach((count, idx) => {
        const row = document.createElement("div");
        row.className = "dist-row";

        const label = document.createElement("span");
        label.textContent = idx + 1;

        const wrapper = document.createElement("div");
        wrapper.className = "dist-bar-wrapper";

        const bar = document.createElement("div");
        bar.className = "dist-bar";
        const widthPercent = Math.max((count / maxFreq) * 100, 7);
        bar.style.width = `${widthPercent}%`;
        bar.textContent = count;

        if (this.isGameOver && this.currentGuesses.length === idx + 1 && this.state.daysProgress[this.activeDayNumber]?.won) {
          bar.classList.add("highlight");
        }

        wrapper.appendChild(bar);
        row.appendChild(label);
        row.appendChild(wrapper);
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
      const vaultDays = this.scheduler.getVaultDays(this.todayDayNumber);
      this.dom.vaultList.innerHTML = "";

      if (vaultDays.length === 0) {
        this.dom.vaultList.innerHTML = `
          <div style="text-align:center; padding: 24px 12px; color: var(--text-muted); font-size: 0.9rem;">
            The Vault is currently empty on launch day.<br>
            Tonight at midnight, Day 0 will permanently archive here!
          </div>`;
        return;
      }

      vaultDays.forEach((p) => {
        if (selectedDiff !== "ALL" && p.difficulty !== selectedDiff) return;

        const dayNum = p.releaseDay;
        const progress = this.state.daysProgress[dayNum];
        const isSolved = progress && progress.won;

        const card = document.createElement("div");
        card.className = `vault-item ${isSolved ? "solved" : ""}`;
        card.setAttribute("role", "button");
        card.setAttribute("tabindex", "0");

        card.innerHTML = `
          <div class="vault-meta">
            <span class="vault-day-tag">SPEC #${dayNum} • ${p.difficulty.toUpperCase()}</span>
            <strong class="vault-name">${p.title}</strong>
            <span class="vault-cat">${p.category}</span>
          </div>
          <div class="vault-status">
            ${isSolved ? '<span class="vault-badge-complete">SOLVED</span>' : '<span style="font-size:0.8rem; color:var(--gold-accent); font-weight:800;">PLAY →</span>'}
          </div>
        `;

        const triggerLoad = () => {
          this.closeAllModals();
          this.loadDayProgress(dayNum);
          this.showScreen("game");
        };

        card.addEventListener("click", triggerLoad);
        card.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            triggerLoad();
          }
        });

        this.dom.vaultList.appendChild(card);
      });
    }

    openCompletionModal(won) {
      const p = this.activePuzzle;
      this.dom.completeStatusTag.textContent = won ? "SPECIFICATION SOLVED" : "SPECIFICATION MISSED";
      this.dom.completeTitle.textContent = won ? "MASTER MIXOLOGIST" : "SHIFT END";
      this.dom.specCategory.textContent = `Curriculum: ${p.category}`;
      this.dom.specDifficulty.textContent = p.difficulty;
      this.dom.specWord.textContent = p.word;
      this.dom.specDefinition.textContent = p.definition;
      this.dom.specLore.textContent = p.lore;

      this.openModal(this.dom.modalComplete);
    }

    copyShareResult() {
      const won = this.state.daysProgress[this.activeDayNumber]?.won;
      const count = won ? this.currentGuesses.length : "X";
      let text = `Cocktail Wordle Spec #${this.activeDayNumber} ${count}/${PLATFORM_CONFIG.MAX_GUESSES}\n\n`;

      this.currentGuesses.forEach((guess) => {
        const evalResult = this.evaluateGuess(guess, this.activePuzzle.word);
        evalResult.forEach((item) => {
          if (item.status === "correct") text += "🟩";
          else if (item.status === "present") text += "🟨";
          else text += "⬛";
        });
        text += "\n";
      });

      text += `\nPlay Daily: ${PLATFORM_CONFIG.HUB_URL}`;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          this.showToast("Spec score copied to clipboard!");
        }).catch(() => {
          this.showToast("Unable to copy to clipboard");
        });
      } else {
        this.showToast("Clipboard not supported");
      }
    }

    // --- 11. MIDNIGHT WATCHER & COUNTDOWN ---
    startCountdownTimer() {
      const updateTimer = () => {
        const ms = this.scheduler.getMsUntilMidnight();
        const hrs = String(Math.floor((ms / (1000 * 60 * 60)) % 24)).padStart(2, "0");
        const mins = String(Math.floor((ms / (1000 * 60)) % 60)).padStart(2, "0");
        const secs = String(Math.floor((ms / 1000) % 60)).padStart(2, "0");
        this.dom.countdownTimer.textContent = `${hrs}:${mins}:${secs}`;
      };
      updateTimer();
      setInterval(updateTimer, 1000);
    }

    startMidnightWatcher() {
      setInterval(() => {
        const newDay = this.scheduler.getCurrentReleaseDay();
        if (newDay !== this.todayDayNumber) {
          this.todayDayNumber = newDay;
          this.refreshMenuTodayCard();
          // If viewing today's puzzle and not in the middle of typing a word
          if (this.activeDayNumber === this.todayDayNumber - 1 && this.currentInput.length === 0) {
            this.showToast("Midnight reached! New Cocktail Spec ready.");
            this.loadDayProgress(this.todayDayNumber);
          }
        }
      }, 30000);
    }

    // --- 12. UTILITIES & TOASTS ---
    showToast(message) {
      const toast = document.createElement("div");
      toast.className = "toast";
      toast.textContent = message;
      this.dom.toastContainer.appendChild(toast);
      this.announce(message);

      setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(-6px)";
        toast.style.transition = "all 0.2s ease";
        setTimeout(() => toast.remove(), 220);
      }, 2000);
    }

    announce(text) {
      this.dom.announcer.textContent = "";
      setTimeout(() => {
        this.dom.announcer.textContent = text;
      }, 40);
    }

    openModal(modalEl) {
      this.closeAllModals();
      modalEl.classList.remove("hidden");
    }

    closeAllModals() {
      document.querySelectorAll(".modal-overlay").forEach((m) => m.classList.add("hidden"));
    }

    isAnyModalOpen() {
      return Array.from(document.querySelectorAll(".modal-overlay")).some(
        (m) => !m.classList.contains("hidden")
      );
    }
  }

  // Launch once DOM is ready
  document.addEventListener("DOMContentLoaded", () => {
    window.CocktailWordle = new CocktailWordleEngine();
  });
})();