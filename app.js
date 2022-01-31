const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const { GameManagerError } = require("./GameManager");

const ClientAction = {
  START: "START",
  TRY: "TRY",
  SURRENDER: "SURRENDER",
  NEXT_ROUND: "NEXT_ROUND",
};

function configServer(server, gameManager) {
  const staticFolder = path.resolve(__dirname, "static");
  server.use(express.static(staticFolder));

  const processClientQuery = (query) => {
    switch (query.action) {
      case ClientAction.TRY:
        return gameManager.tryLetter(query.letter);

      case ClientAction.SURRENDER:
        return gameManager.endRound(false);

      case ClientAction.NEXT_ROUND:
        return gameManager.startRound();

      case ClientAction.START:
        return gameManager.restart(query.words, query.attempts);
    }
  };

  const handleClientQuery = (query) => {
    try {
      const response = processClientQuery(query);
      return { response, code: 200 };
    } catch (e) {
      if (e instanceof GameManagerError) {
        return { response: { error: e.message }, code: 403 };
      }
      return { response: { error: "Что-то пошло не так" }, code: 500 };
    }
  };

  server.get("*", (req, res) => {
    res.sendFile(path.resolve(staticFolder, "index.html"));
  });

  const jsonParser = bodyParser.json();

  server.post("/state", (req, res) => {
    const state = gameManager.getRoundState();
    res.status(200);
    res.send(JSON.stringify(state));
  });

  server.post("/action", jsonParser, (req, res) => {
    const { response, code } = handleClientQuery(req.body);
    res.status(code);
    res.send(JSON.stringify(response));
  });
}

function run(port, gameManager) {
  const server = express();
  configServer(server, gameManager);

  server.listen(port, () => {
    console.log(`Сервер Поля Чудес слушает на http://localhost:${port}`);
  });
}

module.exports = { run };
