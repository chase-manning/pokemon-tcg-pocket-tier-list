const fs = require("fs");

const gamesTxt = fs.readFileSync("games.txt", "utf-8").split("\n");
const games = [];
let game = {};
let lineIndex = 0;

for (let i = 0; i < gamesTxt.length; i++) {
  const line = gamesTxt[i];
  if (line === "") {
    games.push(game);
    game = {};
    lineIndex = 0;
    continue;
  }

  if (lineIndex === 0) {
    game.name = line;
    lineIndex++;
    continue;
  }

  if (lineIndex === 1) {
    const winLoss = line.split("/");
    game.wins = Number(winLoss[0]);
    game.losses = Number(winLoss[1]);
    game.totalGames = Number(winLoss[0]) + Number(winLoss[1]);
    game.cards = [];
    lineIndex++;
    continue;
  }

  game.cards.push(line);
}

fs.writeFileSync("games.json", JSON.stringify(games, null, 2));
