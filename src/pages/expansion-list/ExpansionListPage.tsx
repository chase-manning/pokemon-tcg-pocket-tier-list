import styled from "styled-components";
import useCards from "../../app/use-cards";
import useExpansions from "../../app/use-expansions";
import { buildTiers } from "../../app/tier-helper";
import ExpansionIcon from "../../components/ExpansionIcon";
import { useMarkContentReady } from "../../ads/ContentReadyContext";


const StyledExpansionListPage = styled.div`
  width: 100%;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  @media (max-width: 900px) {
    height: auto;
  }
`;

const DeckRow = styled.div`
  width: 100%;
  display: flex;
  flex: 1;
  border-bottom: 0.4rem solid var(--border);

  /* Gradient on right side */
  @media (min-width: 900px) {
    position: relative;
    &::after {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      width: 100px;
      height: 100%;
      background: linear-gradient(to right, rgba(255, 255, 255, 0), var(--bg));
    }
  }

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const RowHeader = styled.div<{ $backgroundColor: string }>`
  height: 100%;
  aspect-ratio: 1 / 1;
  background: ${(props) => props.$backgroundColor};
  color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3.3rem;
  font-weight: 400;

  @media (max-width: 900px) {
    width: 100%;
    height: 8rem;
  }
`;

const RowContent = styled.div`
  height: 100%;
  flex: 1;
  padding: 1.5rem 2rem;
  display: flex;
  gap: 2rem;
  width: 100%;

  @media (min-width: 900px) {
    overflow-x: auto;
  }

  @media (max-width: 900px) {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    padding: 2rem;
  }
`;

const Loading = styled.div`
  height: 100dvh;
  width: 100dvw;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-weight: 500;
`;

const ExpansionListPage = () => {
  const cards = useCards(1_000_000);
  const expansions = useExpansions();

  useMarkContentReady(!!cards && !!expansions);

  if (!cards || !expansions) return <Loading>Loading...</Loading>;

  interface PackData {
    expansionId: string;
    packId: string;
    packName: string;
    packImage: string;
    totalScore: number;
  }

  // Tally all scores in a single O(N) pass
  const packScores = new Map<string, number>();
  const sharedScores = new Map<string, number>();

  for (const card of cards) {
    if (card.pack.toLowerCase().includes("shared")) {
      sharedScores.set(card.set, (sharedScores.get(card.set) || 0) + card.score);
    } else {
      const key = `${card.set}-${card.pack}`;
      packScores.set(key, (packScores.get(key) || 0) + card.score);
    }
  }

  // Assemble data
  const expansionData: PackData[] = expansions
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

  const tiers = buildTiers(expansionData, (d) => d.totalScore);

  return (
      <StyledExpansionListPage>
        {tiers.map((tier) => (
            <DeckRow key={tier.label}>
              <RowHeader $backgroundColor={tier.color}>{tier.label}</RowHeader>
              <RowContent>
                {tier.data.map((data) => (
                    <ExpansionIcon key={data.packId} image={data.packImage} />
                ))}
              </RowContent>
            </DeckRow>
        ))}
      </StyledExpansionListPage>
  );
};

export default ExpansionListPage;