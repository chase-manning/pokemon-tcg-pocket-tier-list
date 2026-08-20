import fs from "fs";
import { getTournaments } from "./utils/get-tournaments";
import getTournamentDecks from "./utils/get-tournament-decks";
import { round } from "./utils/round";

const downloadDecks = async () => {
  const API_KEY = process.env.API_KEY;
  if (!API_KEY) throw new Error("API_KEY not set");

  const tournaments = await getTournaments();
  console.log(`Downloaded tournaments\n${tournaments.length} to process`);

  const currentDecks = JSON.parse(fs.readFileSync("./data/decks.json", "utf-8"));
  const processed = JSON.parse(fs.readFileSync("./data/processed-tournaments.json", "utf-8"));

  let hasError = false;
  try {
    for (let i = 0; i < tournaments.length; i++) {
      const tournament = tournaments[i];
      const decks = await getTournamentDecks(tournament);

      currentDecks.push(...decks);
      processed.push({id: tournament.id, date: tournament.date});

      console.log(`${round(((i + 1) / tournaments.length) * 100, 2)}%`);
    }
  } catch (error) {
    hasError = true;
    console.error("Pipeline failed:", error);
    throw error;
  } finally {
    fs.writeFileSync("./data/decks.json", JSON.stringify(currentDecks));
    fs.writeFileSync("./data/processed-tournaments.json", JSON.stringify(processed));
    if (hasError) {
      process.exit(1);
    }
  }
};

downloadDecks().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});