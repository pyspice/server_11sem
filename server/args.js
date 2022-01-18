const path = require("path");
const parseArgs = require("command-line-args");

const DEFAULT_PORT = 7339;
const DEFAULT_ATTEMPTS = 5;
const DEFAULT_DICTIONARY_FILENAME = "dict.txt";

const argsOptions = [
  {
    name: "attempts",
    alias: "n",
    type: Number,
    defaultValue: DEFAULT_ATTEMPTS,
    description: "Количество неудачных попыток отгадать букву (за один раунд).",
    typeLabel: "number",
  },
  {
    name: "port",
    alias: "p",
    type: Number,
    defaultValue: DEFAULT_PORT,
    description: "Порт, на котором будет слушать сервер.",
    typeLabel: "number",
  },
  {
    name: "dictionary",
    alias: "d",
    type: String,
    defaultValue: path.resolve(__dirname, DEFAULT_DICTIONARY_FILENAME),
    description:
      "Словарь, из которого берутся слова для раундов. Каждое слово должно начинаться с новой строки.",
    typeLabel: "string",
  },
  {
    name: "help",
    alias: "h",
    type: Boolean,
    description: "Показать это сообщение.",
  },
];

function showHelp() {
  console.log("Сервер игры Поле Чудес.");
  console.log("Аргументы:\n");
  argsOptions.forEach(
    ({ name, alias, defaultValue, description, typeLabel }) => {
      console.log(description);
      console.log(`Имя: --${name}/-${alias}`);
      if (typeLabel) console.log(`Тип: ${typeLabel}`);
      if (defaultValue) console.log(`Значение по умолчанию: ${defaultValue}`);

      console.log(
        `Пример: --${name}${defaultValue ? `=${defaultValue}` : ""}\n`
      );
    }
  );
}

module.exports = { parseArgs: () => parseArgs(argsOptions), showHelp };
