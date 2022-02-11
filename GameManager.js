const ServerAction = {
  USED: "USED",
  FAIL: "FAIL",
  OK: "OK",
  WIN: "WIN",
  LOOSE: "LOOSE",
};

const ServerState = {
  BEFORE_START: "BEFORE_START",
  ROUND_RUNNING: "ROUND_RUNNING",
  ROUND_ENDED: "ROUND_ENDED",
  AFTER_END: "AFTER_END",
};

class GameManagerError extends Error {
  constructor(message) {
    super(message);
    this.name = "GameManagerError";
  }
}

class GameManager {
  constructor() {
    this.init([], 0);
  }

  init(words, attempts) {
    this.words = words.map((word) => word.toLowerCase());
    this.attempts = attempts;
    this.isRoundRunning = false;

    this.attemptsLeft = undefined;
    this.currentWordIdx = 0;
    this._maskedWord = undefined;
    this.usedLetters = undefined;
    this.lettersToGuess = undefined;
  }

  get currentWord() {
    return this.words[this.currentWordIdx];
  }

  get wasGameStarted() {
    return this.attemptsLeft != undefined;
  }

  get wasGameEnded() {
    return this.currentWordIdx >= this.words.length;
  }

  get maskedWord() {
    return this._maskedWord.join("");
  }

  get usedStr() {
    return [...this.usedLetters.values()].join("");
  }

  getRoundState() {
    if (this.isRoundRunning) {
      return {
        state: ServerState.ROUND_RUNNING,
        word: this.maskedWord,
        attempts: this.attemptsLeft,
        usedLetters: this.usedStr,
      };
    }

    if (!this.wasGameStarted) {
      return {
        state: ServerState.BEFORE_START,
      };
    }

    if (this.wasGameEnded) {
      return { state: ServerState.AFTER_END };
    }

    return {
      state: ServerState.ROUND_ENDED,
      wordsLeft: this.words.length > this.currentWordIdx,
    };
  }

  startRound() {
    if (this.isRoundRunning) {
      throw new GameManagerError("Раунд уже начался");
    }

    if (this.wasGameEnded) {
      throw new GameManagerError("Все слова кончились");
    }

    if (!this.wasGameStarted) this.currentWordIdx = -1;
    this.currentWordIdx += 1;

    this.isRoundRunning = true;
    this.usedLetters = new Set();
    this._maskedWord = Array.from(this.currentWord, () => "*");
    this.lettersToGuess = this.currentWord.length;
    this.attemptsLeft = this.attempts;

    return {
      action: ServerAction.OK,
      word: this.maskedWord,
      attempts: this.attemptsLeft,
    };
  }

  tryLetter(letter) {
    if (!this.isRoundRunning) {
      throw new GameManagerError("Раунд еще не начался");
    }

    letter = letter.toLowerCase();
    if (this.usedLetters.has(letter)) return { action: ServerAction.USED };
    this.usedLetters.add(letter);

    const regex = new RegExp(letter, "g");
    const matches = [...this.currentWord.matchAll(regex)];
    if (matches.length === 0) {
      this.attemptsLeft -= 1;

      if (this.attemptsLeft === 0) return this.endRound(false);
      return {
        action: ServerAction.FAIL,
        attempts: this.attemptsLeft,
        usedLetters: this.usedStr,
      };
    }

    this.lettersToGuess -= matches.length;
    matches.forEach(({ index }) => (this._maskedWord[index] = letter));

    if (this.lettersToGuess === 0) return this.endRound(true);
    return {
      action: ServerAction.OK,
      word: this.maskedWord,
      usedLetters: this.usedStr,
    };
  }

  endRound(success) {
    if (!this.isRoundRunning) {
      throw new GameManagerError("Раунд еще не начался");
    }

    this.isRoundRunning = false;

    return {
      action: success ? ServerAction.WIN : ServerAction.LOOSE,
      word: this.currentWord,
      wordsLeft: this.words.length > this.currentWordIdx + 1,
    };
  }

  restart(words, attempts) {
    this.init(words, attempts);
    return this.startRound();
  }
}

module.exports = { GameManager, GameManagerError };
