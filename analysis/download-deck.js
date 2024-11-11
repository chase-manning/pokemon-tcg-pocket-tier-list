const fs = require("fs");

const TOURNAMENT_LINKS = [
  "https://play.limitlesstcg.com/tournament/beanie-brawl-ptcgp-1/standings",
  "https://play.limitlesstcg.com/tournament/672a3be00947ec3b5d196fcc/standings",
  "https://play.limitlesstcg.com/tournament/672a2b860947ec3b5d196f0e/standings",
  "https://play.limitlesstcg.com/tournament/6728f3ad0947ec3b5d195711/standings",
  "https://play.limitlesstcg.com/tournament/little-legends-league-3/standings",
  "https://play.limitlesstcg.com/tournament/671e3da10947ec3b5d18c51a/standings",
  "https://play.limitlesstcg.com/tournament/671e3e0f0947ec3b5d18c51d/standings",
  "https://play.limitlesstcg.com/tournament/pocket-legens-league-6/standings",
  "https://play.limitlesstcg.com/tournament/6725a1020947ec3b5d1913e2/standings",
  "https://play.limitlesstcg.com/tournament/6726f08e0947ec3b5d1936f4/standings",
  "https://play.limitlesstcg.com/tournament/6728d6730947ec3b5d1955e0/standings",
  "https://play.limitlesstcg.com/tournament/672d22260947ec3b5d199c1c/standings",
]

const DECK_NAMES = [
  {
    mainCard: "2 Pikachu ex A1 96",
    deckName: "Pikachu ex"
  },
  {
    mainCard: "1 Pikachu ex A1 96",
    deckName: "Pikachu ex"
  },
  {
    mainCard: "2 Mewtwo ex A1 129",
    deckName: "Mewtwo ex"
  },
  {
    mainCard: "1 Mewtwo ex A1 129",
    deckName: "Mewtwo ex"
  },
  {
    mainCard: "2 Articuno ex A1 84",
    deckName: "Articuno ex"
  },
  {
    mainCard: "1 Articuno ex A1 84",
    deckName: "Articuno ex"
  },
  {
    mainCard: "2 Greninja A1 89",
    deckName: "Greninja"
  },
  {
    mainCard: "1 Greninja A1 89",
    deckName: "Greninja"
  },
  {
    mainCard: "2 Charizard ex A1 36",
    deckName: "Charizard ex"
  },
  {
    mainCard: "1 Charizard ex A1 36",
    deckName: "Charizard ex"
  },
  {
    mainCard: "2 Exeggutor ex A1 23",
    deckName: "Exeggutor ex"
  },
  {
    mainCard: "1 Exeggutor ex A1 23",
    deckName: "Exeggutor ex"
  },
  {
    mainCard: "2 Marowak ex A1 153",
    deckName: "Marowak ex"
  },
  {
    mainCard: "1 Marowak ex A1 153",
    deckName: "Marowak ex"
  },
  {
    mainCard: "2 Lapras ex P-A 14",
    deckName: "Lapras ex"
  },
  {
    mainCard: "2 Gengar ex A1 123",
    deckName: "Gengar ex"
  },
  {
    mainCard: "1 Gengar ex A1 123",
    deckName: "Gengar ex"
  },
  {
    mainCard: "2 Dragonite A1 185",
    deckName: "Dragonite"
  },
  {
    mainCard: "1 Dragonite A1 185",
    deckName: "Dragonite"
  },
  {
    mainCard: "2 Weezing A1 177",
    deckName: "Poison"
  },
  {
    mainCard: "2 Wigglytuff ex A1 195",
    deckName: "Wigglytuff ex"
  },
  {
    mainCard: "1 Weezing A1 177",
    deckName: "Poison"
  },
  {
    mainCard: "1 Wigglytuff ex A1 195",
    deckName: "Wigglytuff ex"
  },
  {
    mainCard: "2 Blaine A1 221",
    deckName: "Blaine"
  },
  {
    mainCard: "1 Blaine A1 221",
    deckName: "Blaine"
  },
  {
    mainCard: "2 Machamp ex A1 146",
    deckName: "Machamp ex"
  },
  {
    mainCard: "1 Machamp ex A1 146",
    deckName: "Machamp ex"
  }
]

const randomWait = async (minSeconds, maxSeconds) => {
  await new Promise((resolve) => setTimeout(resolve, Math.random() * (maxSeconds * 1000 - minSeconds * 1000) + minSeconds * 1000));
}

const getCardsFromHtml = (html) => {
  const start = html.indexOf(`const decklist = `);
  const decklistStart = html.substring(start + 18);
  const endIndex = decklistStart.indexOf("`");
  const decklist = decklistStart.substring(0, endIndex);
  const cards = decklist.split("\r\n").filter((card) => card.length > 0);
  return cards;
}

const getResultsFromHtml = (html) => {
  const target = `<div class="details">`
  const pointsTarget = ` points (`
  let start = html.indexOf(target) + target.length;
  const htmlStart = html.substring(start);
  start = htmlStart.indexOf(pointsTarget) + pointsTarget.length;
  const pointsStart = htmlStart.substring(start);
  const data = pointsStart.substring(0, pointsStart.indexOf(")"));
  const [wins, losses, draws] = data.split("-");
  return {
    wins: Number(wins),
    losses: Number(losses),
    draws: Number(draws)
  }
}

const downloadDeck = async (url) => {
  await randomWait(0.1, 1);
  const res = await fetch(url);
  const html = await res.text();
  const cards = getCardsFromHtml(html);
  const results = getResultsFromHtml(html);
  return {
    cards,
    wins: results.wins,
    losses: results.losses,
    totalGames: results.wins + results.losses
  }
}


const getDeckLinks = async (url) => {
  await randomWait(0.1, 1);
  const res = await fetch(url);
  const html = await res.text();
  const tournamentId = url.split("/")[4];
  const split = `href="/tournament/${tournamentId}/player/`
  const sections = html.split(split);
  const deckUrls = [];
  for (let i = 1; i < sections.length; i++) {
    const section = sections[i];
    const slashEnd = section.indexOf(`/`);
    const quoteEnd = section.indexOf(`"`);
    if (quoteEnd < slashEnd) continue;
    const player = section.substring(0, slashEnd);
    const playerUrl = `https://play.limitlesstcg.com/tournament/${tournamentId}/player/${player}/decklist`;
    deckUrls.push(playerUrl);
  }
  return deckUrls;
}

const downloadAllDeckLinks = async () => {
  const deckLinks = [];
  let completeUrls = 0;
  for (const url of TOURNAMENT_LINKS) {
    const links = await getDeckLinks(url);
    deckLinks.push(...links);
    completeUrls++;
    console.log(`URl Percent Complete: ${Math.round((completeUrls / TOURNAMENT_LINKS.length) * 100)}%`);
    fs.writeFileSync("deck-links.json", JSON.stringify(deckLinks, null, 2));
  }
}

// downloadAllDeckLinks();

const downloadAllDecks = async () => {
  const deckLinks = JSON.parse(fs.readFileSync("deck-links.json"));
  const decks = JSON.parse(fs.readFileSync("decks.json"));
  for (let i = 0; i < deckLinks.length; i++) {
    const deckLink = deckLinks[i];
    const deck = await downloadDeck(deckLink);
    console.log(`Deck Percent Complete: ${Math.round((i / deckLinks.length) * 10000) / 100}%`);
    decks.push(deck);
    fs.writeFileSync("decks.json", JSON.stringify(decks, null, 2));
    const newDecklinks = deckLinks.slice(i + 1);
    fs.writeFileSync("deck-links.json", JSON.stringify(newDecklinks, null, 2));
  }
}

// downloadAllDecks();

const setDeckName = () => {
  let decks = JSON.parse(fs.readFileSync("decks.json"));
  for (let i = 0; i < decks.length; i++) {
    const { cards } = decks[i];
    for (const { mainCard, deckName } of DECK_NAMES) {
      if (cards.includes(mainCard)) {
        decks[i].name = deckName;
        break;
      }
    }
  }
  const onlyNamed = decks.filter((deck) => deck.name);
  fs.writeFileSync("named-decks.json", JSON.stringify(onlyNamed, null, 2));
}

// setDeckName();


const meow = JSON.parse(fs.readFileSync("decks.json"));
console.log(meow.reduce((acc, deck) => acc + deck.totalGames, 0));


