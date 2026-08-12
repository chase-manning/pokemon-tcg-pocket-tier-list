import styled from "styled-components";
import filters from "../../assets/features/filters.webp";
import openSource from "../../assets/features/open-source.webp";
import matchups from "../../assets/features/matchups.webp";
import tournament from "../../assets/features/tournament.webp";
import weeklyUpdates from "../../assets/features/weekly.webp";
import missingCards from "../../assets/features/missing.webp";
import { useTranslation } from "react-i18next";
import { Trans } from "react-i18next";
import { GITHUB_URL } from "../../app/constants";

interface FeatureType {
  title: string;
  description: string | React.ReactNode;
  image: string;
}

const StyledFeatures = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8rem 4.8rem;
  gap: 4.8rem;
  background: var(--bg);

  @media (max-width: 900px) {
    padding: 4.8rem 2.4rem;
  }
`;

const Title = styled.h2`
  font-size: 5.6rem;
  font-weight: 500;
  color: var(--text);
  text-align: center;

  @media (max-width: 900px) {
    font-size: 4rem;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(35rem, 1fr));
  gap: 4.8rem;
  width: 100%;
  max-width: 150rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 3.2rem;
  }
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.4rem;
  padding: 3.2rem;
  background: var(--card);
  border-radius: 1.6rem;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-0.4rem);
  }

  @media (max-width: 900px) {
    padding: 2.4rem;
  }
`;

const Image = styled.img`
  width: 100%;
  max-width: 24rem;
  height: auto;
  border-radius: 0.4rem;
  border: 1px solid white;
  box-shadow: 0 0.8rem 1.6rem rgba(0, 0, 0, 0.2);
`;

const CardTitle = styled.h3`
  font-size: 3.2rem;
  font-weight: 500;
  color: var(--text);
  text-align: center;

  @media (max-width: 900px) {
    font-size: 2.4rem;
  }
`;

const Description = styled.p`
  font-size: 1.8rem;
  color: var(--text-secondary);
  text-align: center;
  line-height: 1.6;

  @media (max-width: 900px) {
    font-size: 1.6rem;
  }
`;

const StyledLink = styled.a`
  color: var(--main);
  text-decoration: underline;
  cursor: pointer;
  transition: opacity 0.2s ease;
  font-size: 1.8rem;

  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 900px) {
    font-size: 1.6rem;
  }
`;

const Features = () => {
  const { t } = useTranslation();

  const FEATURES: FeatureType[] = [
    {
      title: t("features.tournamentResults.title"),
      description: t("features.tournamentResults.description"),
      image: tournament,
    },
    {
      title: t("features.weeklyUpdates.title"),
      description: t("features.weeklyUpdates.description"),
      image: weeklyUpdates,
    },
    {
      title: t("features.filters.title"),
      description: t("features.filters.description"),
      image: filters,
    },
    {
      title: t("features.missingCards.title"),
      description: t("features.missingCards.description"),
      image: missingCards,
    },
    {
      title: t("features.matchups.title"),
      description: t("features.matchups.description"),
      image: matchups,
    },
    {
      title: t("features.openSource.title"),
      description: (
        <Trans
          i18nKey="features.openSource.description"
          components={[
            <StyledLink
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              key="github"
            />,
          ]}
        />
      ),
      image: openSource,
    },
  ];

  return (
    <StyledFeatures>
      <Title>{t("features.title")}</Title>
      <Grid>
        {FEATURES.map((feature) => (
          <Card key={feature.title}>
            <Image src={feature.image} alt={feature.title} />
            <CardTitle>{feature.title}</CardTitle>
            <Description>{feature.description}</Description>
          </Card>
        ))}
      </Grid>
    </StyledFeatures>
  );
};

export default Features;
