import { ObbEventPopularsCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import normalizeObbFootballPlayerFragmentIntoObbFootballPlayer from "../../entities/obb-football-player/obb-football-player-normalizer";
import normalizeObbLegFragmentIntoObbLeg from "../../entities/obb-leg/obb-leg-normalizer";
import { TransformedFragment } from "../../Normalizer.types";
import normalizeDisplayNameFragmentIntoDisplayName from "../display-name/display-name-normalizer";
import { NormalizedObbEventPopularsCard } from "./ObbEventPopularsCard.types";

const normalizeObbEventPopularsCardFragmentIntoObbEventPopularsCard = (
  obbEventPopularsCard: ObbEventPopularsCardFragment,
): TransformedFragment<NormalizedObbEventPopularsCard> => {
  const { __typename, urn, event, badgeLabel, popularBettingOpportunities } = obbEventPopularsCard;

  return {
    data: {
      typename: __typename,
      urn,
      sportEvent: event.urn,
      title: normalizeDisplayNameFragmentIntoDisplayName(obbEventPopularsCard.obbEventPopularsCardTitle),
      badgeLabel: badgeLabel ? normalizeDisplayNameFragmentIntoDisplayName(badgeLabel) : undefined,
      numberOfVisibleBettingOpportunities: obbEventPopularsCard.numberOfVisibleBettingOpportunities,
      showPopularEvidence: obbEventPopularsCard.showPopularEvidence,
      showStats: obbEventPopularsCard.showStats,
      popularBettingOpportunities: popularBettingOpportunities.map(({ participants, betCount, leg }) => ({
        betCount,
        participants: participants.map(
          (footballPlayer) => normalizeObbFootballPlayerFragmentIntoObbFootballPlayer(footballPlayer).data,
        ),
        leg: normalizeObbLegFragmentIntoObbLeg(leg).data,
      })),
    },
  };
};

export default normalizeObbEventPopularsCardFragmentIntoObbEventPopularsCard;
