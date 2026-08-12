import fs from "fs";
import { getTournaments } from "./utils/get-tournaments";
import getTournamentDecks from "./utils/get-tournament-decks";
import { round } from "./utils/round";

const downloadDecks = async () => {
  const API_KEY = process.env.API_KEY;
  if (!API_KEY) throw new Error("API_KEY not set");

  const tournaments = await getTournaments();
  console.log(`Downloaded tournaments\n${tournaments.length} to process`);

  // read once, memory is fast
  const currentDecks = JSON.parse(fs.readFileSync("./data/decks.json", "utf-8"));
  const processed = JSON.parse(fs.readFileSync("./data/processed-tournaments.json", "utf-8"));

  for (let i = 0; i < tournaments.length; i++) {
    const t = { id: tournaments[i].id, date: new Date(tournaments[i].date) };
    const decks = await getTournamentDecks(t as any);

    currentDecks.push(...decks);
    processed.push(t);

    console.log(`${round((i / tournaments.length) * 100, 2)}%`);
    }

    fs.writeFileSync("./data/decks.json", JSON.stringify(currentDecks));
    fs.writeFileSync("./data/processed-tournaments.json", JSON.stringify(processed));
};

downloadDecks();
