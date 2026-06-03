import { FootballPlayerFixtureContext } from "../../../../../state/entities/football-player-fixture-context/FootballPlayerFixtureContext.types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeFootballPlayerFixtureContextFragment = (
  fragment: FootballPlayerFixtureContext,
): TransformedFragment<FootballPlayerFixtureContext> => {
  const { urn } = fragment;

  return {
    data: {
      urn,
      typename: "FootballPlayerFixtureContext",
      team: fragment.team,
      player: fragment.player
        ? {
            urn: fragment.player.urn,
            __typename: "FootballPlayerFixture",
            id: fragment.player?.id,
            name: fragment.player?.name,
            position: fragment.player?.position,
            positionDescription: fragment.player?.positionDescription,
            shirtNumber: fragment.player?.shirtNumber,
            startingType: fragment.player?.startingType,
            formationPlace: fragment.player?.formationPlace,
            seasonStats: fragment.player?.seasonStats,
            stats: fragment.player?.stats,
          }
        : undefined,
    },
  };
};

export default normalizeFootballPlayerFixtureContextFragment;
