import { Competition } from "../../../../../state/entities";
import {
  CompetitionFragment,
  CompetitionWithLogoFragment,
  CompetitionBasicFragment,
} from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeCompetitionFragmentIntoCompetition = (
  competition: CompetitionFragment | CompetitionWithLogoFragment | CompetitionBasicFragment,
): TransformedFragment<Competition> => {
  const { urn, name, sport, competitionId, __typename } = competition;

  return {
    data: {
      typename: __typename,
      urn,
      name,
      sport: sport?.urn,
      competitionId,
      ...("logo" in competition && competition.logo ? { logo: competition.logo } : {}),
      ...("country" in competition && competition.country
        ? {
            country: {
              urn: competition.country.urn,
              code: competition.country.code,
              flag: competition.country.flag?.vector ?? undefined,
            },
          }
        : {}),
    },
  };
};

export default normalizeCompetitionFragmentIntoCompetition;
