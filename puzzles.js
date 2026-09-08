/**
 * COCKTAIL WORDLE — PUZZLES & CURRICULUM DATABASE
 * 
 * CONTRACT DOCUMENTATION:
 * - Each puzzle object represents a 5-letter cocktail curriculum specification.
 * - Properties:
 *    id: Unique integer index (1-based sequence).
 *    word: Exactly 5 uppercase letters.
 *    title: Professional mixology name or title.
 *    category: Specific category name from the 32 Master Categories.
 *    level: 1 to 5 corresponding to curriculum levels.
 *    difficulty: "Beginner" | "Easy" | "Medium" | "Hard" | "Expert".
 *    definition: Precise explanation of the cocktail concept/ingredient/technique.
 *    lore: Authentic bar notes, history, or practical serving specification.
 * 
 * WORKFLOW:
 * - To add new puzzles, simply append new puzzle objects to COCKTAIL_PUZZLES.
 * - No changes in index.html, style.css, or script.js are required.
 */

const LAUNCH_CONFIG = {
  // Stable product launch epoch date in UTC (Day 1)
  EPOCH_DATE: "2025-01-01T00:00:00Z",
  WORD_LENGTH: 5,
  MAX_GUESSES: 6
};

const COCKTAIL_CURRICULUM = [
  "1. Cocktail Fundamentals", "2. Classic Cocktails", "3. Core Spirits",
  "4. Cocktail Families", "5. Essential Ingredients", "6. Citrus & Acid",
  "7. Sweeteners & Sugar", "8. Bitters", "9. Liqueurs & Cordials",
  "10. Vermouth & Fortified Wine", "11. Aperitifs & Amari", "12. Botanicals & Aromatics",
  "13. Fresh Produce & Herbs", "14. Spice & Seasoning", "15. Coffee, Tea & Cocoa",
  "16. Eggs, Dairy & Texture", "17. Shaking, Stirring & Building", "18. Straining & Fine Straining",
  "19. Ice & Dilution", "20. Glassware", "21. Garnishes", "22. Specs, Ratios & Balance",
  "23. Flavour Profiles", "24. Bar Technique & Service", "25. Cocktail History & Origins",
  "26. Prohibition & Speakeasy Era", "27. Tiki & Tropical Cocktails", "28. Distilling",
  "29. Brewing & Fermentation", "30. Regional Cocktail Traditions",
  "31. Classic Brands, Producers & Deep-Dive Ingredients", "32. Advanced Cocktail Lore"
];

const COCKTAIL_PUZZLES = [
  {
    id: 1,
    word: "SHAKE",
    title: "The Classic Cocktail Shake",
    category: "17. Shaking, Stirring & Building",
    level: 3,
    difficulty: "Beginner",
    definition: "The essential bar technique of violently moving spirits, citrus, sugar, and ice within a shaker tin to simultaneously chill, dilute, and aerate.",
    lore: "As Harry Johnson noted in his 1882 Manual: drinks containing citrus, syrups, cream, or egg whites must always be shaken vigorously to create uniform texture and aeration."
  },
  {
    id: 2,
    word: "AMARO",
    title: "Italian Amaro",
    category: "11. Aperitifs & Amari",
    level: 2,
    difficulty: "Easy",
    definition: "A category of bittersweet Italian herbal liqueurs traditionally macerated with roots, barks, herbs, citrus peel, and flowers.",
    lore: "Classics like the Paper Plane and Black Manhattan rely on Amari (Nonino and Averna) to substitute for triple sec or sweet vermouth, adding bitter complexity."
  },
  {
    id: 3,
    word: "TWIST",
    title: "Citrus Twist Expression",
    category: "21. Garnishes",
    level: 3,
    difficulty: "Medium",
    definition: "An expressed strip of citrus peel (lemon, orange, or grapefruit) whose volatile essential oils are sprayed over the surface of a finished cocktail.",
    lore: "Expressing the zest skin-side down over a Martini or Sazerac provides intense citrus fragrance on the nose without introducing the juice's acidic citric liquid."
  },
  {
    id: 4,
    word: "AGAVE",
    title: "Blue Weber Agave",
    category: "3. Core Spirits",
    level: 1,
    difficulty: "Medium",
    definition: "The succulent plant heart (piña) harvested, steamed or roasted, and fermented to distill authentic Tequila and Mezcal.",
    lore: "Agave nectar is the signature sweetener in Julio Bermejo's 1990 modern classic, the Tommy's Margarita, amplifying the 100% agave tequila notes."
  },
  {
    id: 5,
    word: "SMASH",
    title: "The Smash Family",
    category: "4. Cocktail Families",
    level: 1,
    difficulty: "Hard",
    definition: "A historic 19th-century cocktail family marrying a spirit base with muddled fresh herbs (typically mint), citrus chunks, and cracked ice.",
    lore: "Documented by Jerry Thomas in 1862, the Smash was revitalized in 2008 by Jörg Meyer with the iconic Gin Basil Smash in Hamburg, Germany."
  },
  {
    id: 6,
    word: "RINSE",
    title: "Absinthe Glass Rinse",
    category: "24. Bar Technique & Service",
    level: 3,
    difficulty: "Expert",
    definition: "A technique where a minute volume of high-proof aromatic spirit is swirled around the inside of a chilled glass to coat it before discarding excess.",
    lore: "Essential to the New Orleans Sazerac: an Herbsaint or Absinthe rinse ensures the anise aroma is encountered with every sip without overwhelming the rye whiskey."
  },
  {
    id: 7,
    word: "JULEP",
    title: "The Mint Julep",
    category: "4. Cocktail Families",
    level: 1,
    difficulty: "Medium",
    definition: "A historic American highball built from bourbon, crushed mint, sugar, and finely crushed pebble ice served inside a frost-coated silver cup.",
    lore: "The iconic silver or pewter cup is held by the rim or base so body heat does not melt the dense wall of ice frosting the vessel."
  },
  {
    id: 8,
    word: "FLUTE",
    title: "Champagne Flute",
    category: "20. Glassware",
    level: 3,
    difficulty: "Easy",
    definition: "A tall, narrow glass with a long stem designed to concentrate carbonation bubbles and aroma in sparkling wine cocktails.",
    lore: "Ideal for the French 75 and Classic Champagne Cocktail, preserving effervescence by reducing surface area exposure to air."
  },
  {
    id: 9,
    word: "FROTH",
    title: "Emulsified Foam",
    category: "16. Eggs, Dairy & Texture",
    level: 2,
    difficulty: "Hard",
    definition: "The dense, velvety head formed atop sours and fizzes via the mechanical denaturation of egg white or aquafaba proteins during shaking.",
    lore: "Achieved via the 'dry shake' (shaking all ingredients without ice) followed by a wet shake with ice to chill and dilute."
  },
  {
    id: 10,
    word: "CLOVE",
    title: "Aromatic Clove Spice",
    category: "14. Spice & Seasoning",
    level: 2,
    difficulty: "Expert",
    definition: "The dried aromatic flower bud of Syzygium aromaticum, rich in eugenol and essential to historic hot punches and Tiki spiced syrups.",
    lore: "A key botanical in classic Angostura aromatic bitters and vintage Caribbean Falernum, lending warming depth to dark spirits."
  }
];

// Comprehensive 5-letter bar and standard English guess dictionary
const VALID_GUESSES = new Set([
  // Core Cocktail Targets & Bar Terms
  "SHAKE", "AMARO", "TWIST", "AGAVE", "SMASH", "RINSE", "JULEP", "FLUTE", "FROTH", "CLOVE",
  "POURS", "BUILD", "STIRS", "FLOAT", "PINCH", "CRUSH", "CRAFT", "BATCH", "ZESTS", "BITES",
  "CHILL", "DRAWS", "NEATS", "ROCKS", "COATS", "FOAMS", "CLEAR", "TASTE", "SWEET", "BITTR",
  "SOURS", "DRINK", "GLASS", "STILL", "CASKS", "AGING", "YEAST", "GRAIN", "BARREL", "MALTZ",
  "SUGAR", "SYRUP", "HONEY", "LEMON", "LIMES", "MINTY", "BASIL", "BERRY", "FRUIT", "PEELS",
  "HERBS", "SPICE", "ANGLO", "VODKA", "GINNY", "RUMMY", "SHRUB", "TONIC", "SODA", "WATER",
  "CIDER", "BEERS", "STOUT", "ALEHOUSE", "TAVERN", "SALOON", "BARREL", "BLEND", "PROOF",
  "SPRIT", "PUNCH", "DAISY", "SLING", "COBBL", "TODDY", "SWIZZ", "GROGS", "RICKEY", "FIZZY",
  
  // Standard English 5-letter words to guarantee player freedom on start words
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

// Helper validator to ensure database integrity at runtime
(function validateCurriculumDatabase() {
  const seenIds = new Set();
  const seenWords = new Set();
  COCKTAIL_PUZZLES.forEach((p, idx) => {
    if (!p.id || seenIds.has(p.id)) {
      console.error(`[Curriculum Warning] Duplicate or missing ID on puzzle #${idx + 1}`);
    }
    seenIds.add(p.id);
    if (!p.word || p.word.length !== LAUNCH_CONFIG.WORD_LENGTH) {
      console.error(`[Curriculum Warning] Word "${p.word}" must be exactly 5 letters.`);
    }
    seenWords.add(p.word);
    // Ensure all target puzzle words exist in VALID_GUESSES
    VALID_GUESSES.add(p.word.toUpperCase());
  });
})();