const { run } = require("./app");
const { GameManager } = require("./GameManager");

const gameManager = new GameManager(words, args.attempts);
run(process.env.PORT || 7339, gameManager);
