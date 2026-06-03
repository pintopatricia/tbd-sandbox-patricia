import { CompetitionRegionCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import {
  CompetitionRegion,
  CompetitionRegionCard,
  CompetitionViewLink,
} from "../../../../../state/layout/cards/Card.types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeCompetitionRegionCardFragmentIntoCompetitionRegionCard = (
  competitionRegionCard: CompetitionRegionCardFragment,
): TransformedFragment<CompetitionRegionCard> => {
  const { urn, competitionRegions, __typename } = competitionRegionCard;

  return {
    data: {
      urn,
      typename: __typename,
      competitionRegions: competitionRegions.map<CompetitionRegion>(({ country, competitionViewLinks }) => ({
        country: {
          urn: country.urn,
          code: country.code,
          flag: country.flag?.vector ?? undefined,
        },
        competitionViewLinks: competitionViewLinks.map<CompetitionViewLink>(
          ({ urn: competitionViewLinkUrn, viewLink, competition }) => {
            const { urn: competitionUrn } = competition;
            return {
              urn: competitionViewLinkUrn,
              viewLink,
              competition: competitionUrn,
            };
          },
        ),
      })),
    },
  };
};

export default normalizeCompetitionRegionCardFragmentIntoCompetitionRegionCard;
