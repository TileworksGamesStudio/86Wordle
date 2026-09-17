(function () {
  "use strict";

  // Configuration & External Links
  const HOME_PAGE_URL = "https://tileworksgamesstudio.github.io/86/"; 
  const STORAGE_KEY = "cocktails_word_guess_data_v1";
  const CSV_FILE = "puzzles.csv";
  const WORDS_FILE = "words.txt";
  // Explicit IANA release timezone (Bible Phase 6)
  const RELEASE_TIMEZONE = "UTC";

  // Built-in fallback puzzle dataset
  const FALLBACK_PUZZLES = [
    { date: "2025-05-18", word: "PRIDE", definition: "A feeling of deep satisfaction from one's achievements." },
    { date: "2025-05-19", word: "CLEAN", definition: "Free from dirt, marks, or unwanted matter." },
    { date: "2025-05-20", word: "LIGHT", definition: "The natural agent that stimulates sight." },
    { date: "2025-05-21", word: "BRAVE", definition: "Ready to face danger or pain; showing courage." },
    { date: "2025-05-22", word: "SHARP", definition: "Having an edge or point that is able to cut or pierce." },
    { date: "2025-05-23", word: "SWIFT", definition: "Happening quickly or moving with great speed." },
    { date: "2025-05-24", word: "CRANE", definition: "A large tall machine used for moving heavy objects." }
  ];

  // Dynamic set populated from words.txt and puzzles.csv
  const VALID_WORDS = new Set();

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

  /**
   * Converts a given JavaScript Date instant into an ISO YYYY-MM-DD string
   * formatted strictly under the configured release timezone.
   */
  function formatDateInTimezone(dateObj, timezone) {
    try {
      const formatter = new Intl.DateTimeFormat("en-CA", {
        timeZone: timezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      });
      return formatter.format(dateObj); // Produces YYYY-MM-DD
    } catch (e) {
      // Fallback to UTC if timezone is invalid
      const year = dateObj.getUTCFullYear();
      const month = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getUTCDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
  }

  class WordGuessApp {
    constructor() {
      this.state = loadState();
      this.puzzles = [];
      this.currentPuzzle = null;
      this.authoritativeToday = null; // Set via authoritative server time
      this.activeInput = "";
      this.guesses = [];
      this.isComplete = false;
      this.toastTimeout = null;

      this.cacheElements();
      this.setupHomeLink();
      this.initBoard();
      this.initKeyboard();
      this.attachEvents();
      this.initAuthoritativeSession();
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

    /**
     * Obtains authoritative time from the HTTP Date header (Bible Phase 4 & 5).
     * Falls back to UTC Date only when offline / server header unavailable.
     */
    async fetchAuthoritativeDate() {
      try {
        const response = await fetch(`${CSV_FILE}?_t=${Date.now()}`, { method: "HEAD" });
        const serverDateHeader = response.headers.get("Date");
        if (serverDateHeader) {
          const parsedMs = Date.parse(serverDateHeader);
          if (!isNaN(parsedMs)) {
            return formatDateInTimezone(new Date(parsedMs), RELEASE_TIMEZONE);
          }
        }
      } catch (err) {
        // Fallback gracefully if running in isolated local environments
      }
      return formatDateInTimezone(new Date(), RELEASE_TIMEZONE);
    }

    async initAuthoritativeSession() {
      this.authoritativeToday = await this.fetchAuthoritativeDate();
      // Load both puzzles and the dictionary concurrently
      await Promise.all([this.loadPuzzleData(), this.loadWordList()]);
    }

    /**
     * Fetches and parses words.txt into the VALID_WORDS set.
     */
    async loadWordList() {
      try {
        const response = await fetch(WORDS_FILE);
        if (!response.ok) throw new Error("Failed to load words.txt");
        const text = await response.text();
        const lines = text.split(/\r?\n/);
        
        for (let i = 0; i < lines.length; i++) {
          const word = lines[i].trim().toUpperCase();
          if (word.length === 5) {
            VALID_WORDS.add(word);
          }
        }
      } catch (err) {
        console.warn("Could not load words.txt; falling back to puzzle solution words:", err);
      }
    }

    async loadPuzzleData() {
      try {
        const response = await fetch(CSV_FILE);
        if (!response.ok) throw new Error("CSV fetch failed");
        const text = await response.text();
        const parsed = parseCSV(text);

        const list = parsed
          .filter((p) => p.date && p.word && p.word.length === 5)
          .map((p) => ({
            date: p.date,
            word: p.word.toUpperCase().trim(),
            definition: p.definition ? p.definition.trim() : ""
          }));

        this.puzzles = list.length > 0 ? list : FALLBACK_PUZZLES;
      } catch (err) {
        this.puzzles = FALLBACK_PUZZLES;
      }

      // Ensure every puzzle solution word is guaranteed to be accepted as a guess
      this.puzzles.forEach((p) => VALID_WORDS.add(p.word));
      this.updateMenuSummary();
    }

    /**
     * Selects today's puzzle.
     * Guaranteed never to return any future puzzle (Bible Phase 3 & 10).
     */
    getDailyPuzzle() {
      if (!this.authoritativeToday) return null;

      // Exact match for authoritative today
      const todayMatch = this.puzzles.find((p) => p.date === this.authoritativeToday);
      if (todayMatch) return todayMatch;

      // Fallback only to released puzzles on or before authoritative today
      const pastOrToday = this.puzzles
        .filter((p) => p.date <= this.authoritativeToday)
        .sort((a, b) => b.date.localeCompare(a.date));

      if (pastOrToday.length > 0) {
        return pastOrToday[0];
      }

      // If all puzzles in dataset are future, fail closed: do NOT expose future puzzle
      return null;
    }

    updateMenuSummary() {
      const daily = this.getDailyPuzzle();

      if (!daily) {
        this.dom.menuDailyStatus.textContent = "No puzzle available";
        this.dom.navDaily.classList.add("disabled");
      } else {
        this.dom.navDaily.classList.remove("disabled");
        const record = this.state.puzzles[daily.date];
        if (record && record.completed) {
          this.dom.menuDailyStatus.textContent = record.won
            ? `Completed (${record.guesses.length}/6)`
            : "Completed (X/6)";
        } else if (record && record.guesses && record.guesses.length > 0) {
          this.dom.menuDailyStatus.textContent = `In Progress (${record.guesses.length}/6)`;
        } else {
          this.dom.menuDailyStatus.textContent = "Ready to play";
        }
      }

      // Vault count must strictly count released past puzzles
      if (this.authoritativeToday) {
        const releasedPastPuzzles = this.puzzles.filter(
          (p) => p.date < this.authoritativeToday && (!daily || p.date !== daily.date)
        );
        this.dom.menuVaultCount.textContent = `${releasedPastPuzzles.length} available`;
      } else {
        this.dom.menuVaultCount.textContent = "0 available";
      }
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
          this.showToast("No puzzle currently released");
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

      this.dom.btnMenuRules.addEventListener("click", () => this.openDialog(this.dom.modalRules));
      this.dom.btnMenuStats.addEventListener("click", () => this.renderStatsModal());

      this.dom.btnGameRules.addEventListener("click", () => this.openDialog(this.dom.modalRules));
      this.dom.btnGameStats.addEventListener("click", () => this.renderStatsModal());

      this.dom.btnShare.addEventListener("click", () => this.shareResult());
      this.dom.btnResultVault.addEventListener("click", () => {
        this.dom.modalResult.close();
        this.switchView("vault");
      });

      document.querySelectorAll("[data-close]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const target = document.getElementById(btn.dataset.close);
          if (target && typeof target.close === "function") {
            target.close();
          }
        });
      });
    }

    /**
     * Starts a puzzle.
     * Enforces strict release verification guard (Bible Phase 12).
     */
    startPuzzle(puzzle, isDaily) {
      if (!puzzle || !puzzle.date) return;

      // Absolute Release Boundary Guard
      if (this.authoritativeToday && puzzle.date > this.authoritativeToday) {
        this.showToast("This puzzle is not yet released.");
        return;
      }

      this.currentPuzzle = puzzle;
      this.activeInput = "";
      this.guesses = [];
      this.isComplete = false;

      const title = isDaily ? "DAILY PUZZLE" : `VAULT: ${puzzle.date}`;
      this.dom.gamePuzzleTitle.textContent = title;
      this.dom.gamePuzzleDate.textContent = isDaily ? `Today (${puzzle.date})` : puzzle.date;

      this.resetBoardAndKeyboard();

      const saved = this.state.puzzles[puzzle.date];
      if (saved && Array.isArray(saved.guesses)) {
        saved.guesses.forEach((guess) => {
          this.applyGuess(guess);
        });

        if (saved.completed) {
          this.isComplete = true;
          this.dom.gameStatusPill.textContent = saved.won ? "SOLVED" : "GAME OVER";
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
          this.activeInput = this.activeInput.slice(0, -1);
          this.renderActiveRow();
        }
      } else if (/^[A-Z]$/.test(key)) {
        if (this.activeInput.length < 5) {
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
        this.showToast("Not enough letters");
        return;
      }

      const guess = this.activeInput.toUpperCase();
      if (!VALID_WORDS.has(guess)) {
        this.showToast("Word not recognized");
        return;
      }

      this.applyGuess(guess);
      this.activeInput = "";

      const won = guess === this.currentPuzzle.word;
      const lost = !won && this.guesses.length >= 6;

      if (won || lost) {
        this.isComplete = true;
        this.dom.gameStatusPill.textContent = won ? "SOLVED" : "GAME OVER";
        this.dom.gameStatusPill.classList.remove("hidden");
        this.recordProgress(won);
        setTimeout(() => this.openResultModal(won), 450);
      } else {
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

    /**
     * Renders the Vault.
     * Strictly filters for puzzles where release date < authoritative today (Bible Phase 3 & 11).
     */
    renderVault() {
      this.dom.vaultList.innerHTML = "";

      if (!this.authoritativeToday) {
        const emptyMsg = document.createElement("p");
        emptyMsg.className = "vault-caption";
        emptyMsg.textContent = "Loading vault...";
        this.dom.vaultList.appendChild(emptyMsg);
        return;
      }

      // Exclude current daily puzzle AND all unreleased future puzzles
      const archiveItems = this.puzzles
        .filter((p) => p.date < this.authoritativeToday)
        .sort((a, b) => b.date.localeCompare(a.date));

      if (archiveItems.length === 0) {
        const emptyMsg = document.createElement("p");
        emptyMsg.className = "vault-caption";
        emptyMsg.textContent = "No archived puzzles available.";
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
        let badgeText = "UNPLAYED";
        let statusText = "Tap to solve";

        if (progress && progress.completed) {
          if (progress.won) {
            badgeClass = "solved";
            badgeText = `${progress.guesses.length}/6`;
            statusText = "Completed";
          } else {
            badgeClass = "failed";
            badgeText = "FAILED";
            statusText = "Not solved";
          }
        } else if (progress && progress.guesses && progress.guesses.length > 0) {
          badgeClass = "unplayed";
          badgeText = `${progress.guesses.length}/6`;
          statusText = "In progress";
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
      this.dom.resultTitle.textContent = won ? "WELL DONE!" : "BETTER LUCK NEXT TIME";
      this.dom.resultWord.textContent = this.currentPuzzle.word;
      this.dom.resultDefinition.textContent = this.currentPuzzle.definition || "";
      this.dom.resultSummary.textContent = won
        ? `Solved in ${this.guesses.length} of 6 attempts.`
        : "Failed to guess the word within 6 tries.";

      this.openDialog(this.dom.modalResult);
    }

    shareResult() {
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
          this.showToast("Copied to clipboard!");
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
      }, 2100);
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