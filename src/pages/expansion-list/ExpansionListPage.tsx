import useCards from "../../app/use-cards";
import useExpansions from "../../app/use-expansions";
import SeoContent from "../../components/SeoContent";
import { useMarkContentReady } from "../../ads/ContentReadyContext";
import TierGrid from "../../components/TierGrid";
import ExpansionIcon from "../../components/ExpansionIcon";

interface PackData {
  expansionId: string;
  packId: string;
  packName: string;
  packImage: string;
  totalScore: number;
}

const ExpansionListPage = () => {
  const cards = useCards(1_000_000);
  const expansions = useExpansions();

  useMarkContentReady(!!cards && !!expansions);

  // Tally all scores in a single O(N) pass
  const packScores = new Map<string, number>();
  const sharedScores = new Map<string, number>();

  for (const card of cards ?? []) {
    if (card.pack.toLowerCase().includes("shared")) {
      sharedScores.set(card.set, (sharedScores.get(card.set) || 0) + card.score);
    } else {
      const key = `${card.set}-${card.pack}`;
      packScores.set(key, (packScores.get(key) || 0) + card.score);
    }
  }

  // Assemble data
  const expansionData: PackData[] = (expansions ?? [])
      .flatMap((expansion) =>
          expansion.packs.map((pack) => ({
            expansionId: expansion.id,
            packId: pack.id,
            packName: pack.name,
            packImage: pack.image,
            totalScore:
                (packScores.get(`${expansion.id}-${pack.name}`) || 0) +
                (sharedScores.get(expansion.id) || 0),
          }))
      )
      .sort((a, b) => b.totalScore - a.totalScore);

  return (
      <>
        <TierGrid
          items={cards && expansions ? expansionData : null}
          getScore={(d) => d.totalScore}
          getKey={(d) => d.packId}
          renderItem={(data) => <ExpansionIcon image={data.packImage} />}
        />
        <SeoContent>
          <h2>Pokémon TCG Pocket | Best Expansions to Open</h2>
                  <p>
                    This page ranks booster packs by the competitive value of the cards
                    inside them. The scoring comes from real tournament data, not set
                    hype: a pack scores well when the cards you can pull from it appear
                    often in the strongest decks. That makes this list a reliable guide
                    for deciding which packs to open next.
                  </p>

                  <h3>How pack value is calculated</h3>
                  <p>
                    Every card carries a score based on how much tournament-winning decks
                    rely on it. A pack's total is the sum of the scores of the cards it
                    holds, so packs that contain several lineup staples rank higher than
                    packs whose cards rarely see competitive play. Cards that arrive
                    through a set's shared pool count toward every pack in that set.
                    Once the totals are tallied, packs are sorted into tiers from S to E,
                    with S standing for the most valuable pulls in the game.
                  </p>

                  <h3>Worth opening this week</h3>
                  <p>
                    The packs at the top of the list give you the most value per opening
                    because their cards carry over into the current meta directly. These
                    rankings assume a fresh collection, so they suit a new player who is
                    just starting out and has no cards to reuse. Even the lower tiers
                    hold useful cards, so the gap between tiers is a gap in how quickly a
                    card becomes competitive, not in usefulness. Pair this page with the{" "}
                    <a href="/tier-list">deck tier list</a> and the{" "}
                    <a href="/cards-list">card rankings</a> to see how the same scores
                    shape the strongest decks. Rankings refresh automatically alongside
                    the deck data.
                  </p>
        </SeoContent>
      </>
    );
};

export default ExpansionListPage;