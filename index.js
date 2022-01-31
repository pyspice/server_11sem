const fs = require("fs");
const { parseArgs, showHelp } = require("./args");
const { run } = require("./app");
const { GameManager } = require("./GameManager");

const args = parseArgs();
if (args.help) {
  showHelp();
  return;
}

fs.readFile(args.dictionary, "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const words = data
    .toString()
    .split("\n")
    .map((word) => word.trim());

  if (words.length === 0) {
    console.error("Нет слов в словаре!");
    return;
  }

  const gameManager = new GameManager(words, args.attempts);
  run(args.port, gameManager);
});
