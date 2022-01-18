const shuffle = require("shuffle-array");

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
};

class GameManagerError extends Error {
  constructor(message) {
    super(message);
    this.name = "GameManagerError";
  }
}

class GameManager {
  constructor(words, attempts) {
    this.words = words.map((word) => word.toLowerCase());
    this.attempts = attempts;
    this.isRoundRunning = false;
  }

  get currentWord() {
    return this.words[this.currentWordIdx];
  }

  get wasGameStarted() {
    return this.attemptsLeft != undefined;
  }

  get maskedWord() {
    return this._maskedWord.join("");
  }

  getRoundState() {
    if (this.isRoundRunning) {
      return {
        state: ServerState.ROUND_RUNNING,
        word: this.maskedWord,
        attempts: this.attemptsLeft,
      };
    }

    if (!this.wasGameStarted) {
      return {
        state: ServerState.BEFORE_START,
      };
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

    if (this.currentWordIdx >= this.words.length) this.reshuffle();
    if (this.currentWordIdx == undefined) this.currentWordIdx = -1;
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
      return { action: ServerAction.FAIL, attempts: this.attemptsLeft };
    }

    this.lettersToGuess -= matches.length;
    matches.forEach(({ index }) => (this._maskedWord[index] = letter));

    if (this.lettersToGuess === 0) return this.endRound(true);
    return { action: ServerAction.OK, word: this.maskedWord };
  }

  endRound(success) {
    if (!this.isRoundRunning) {
      throw new GameManagerError("Раунд еще не начался");
    }

    const word = this.currentWord;
    this.currentWordIdx += 1;
    this.isRoundRunning = false;

    return {
      action: success ? ServerAction.WIN : ServerAction.LOOSE,
      word,
      wordsLeft: this.words.length > this.currentWordIdx,
    };
  }

  reshuffle() {
    shuffle(this.words);
    this.currentWordIdx = undefined;
  }
}

module.exports = { GameManager, GameManagerError };
