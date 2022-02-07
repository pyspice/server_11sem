const { run } = require("./app");
const { GameManager } = require("./GameManager");

const gameManager = new GameManager();
run(process.env.PORT || 7339, gameManager);
