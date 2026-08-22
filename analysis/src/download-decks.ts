import "dotenv/config";
import fs from "fs";
import { getTournaments } from "./utils/get-tournaments";
import getTournamentDecks from "./utils/get-tournament-decks";
import { round } from "./utils/round";

const DECKS_FILE = "./data/decks.json";
const PROCESSED_FILE = "./data/processed-tournaments.json";

const readJsonArray = (filePath: string): unknown[] => {
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
};

const downloadDecks = async () => {
  const apiKey = process.env.LIMITLESS_API_KEY;
  if (!apiKey) throw new Error("LIMITLESS_API_KEY not set");

  const tournaments = await getTournaments();
  console.log(`Downloaded tournaments\n${tournaments.length} to process`);

  const currentDecks = readJsonArray(DECKS_FILE);
  const processed = readJsonArray(PROCESSED_FILE);

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
    fs.mkdirSync("./data", { recursive: true });
    fs.writeFileSync(DECKS_FILE, JSON.stringify(currentDecks));
    fs.writeFileSync(PROCESSED_FILE, JSON.stringify(processed));
    if (hasError) {
      process.exit(1);
    }
  }
};

downloadDecks().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
