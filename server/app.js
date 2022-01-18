const path = require("path");
const express = require("express");
const { GameManagerError } = require("./GameManager");

const ClientAction = {
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
    }
  };

  const handleClientQuery = (query) => {
    try {
      const response = processClientQuery(query);
      return { response, code: 200 };
    } catch (e) {
      if (e instanceof GameManagerError) {
        return { response: e.message, code: 403 };
      }
      return { response: "Что-то пошло не так", code: 500 };
    }
  };

  server.get("*", (req, res) => {
    res.sendFile(path.resolve(staticFolder, "index.html"));
  });

  server.post("/state", (req, res) => {
      
  });

  server.post("/try", (req, res) => {
    const query = JSON.parse(req.body);
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
