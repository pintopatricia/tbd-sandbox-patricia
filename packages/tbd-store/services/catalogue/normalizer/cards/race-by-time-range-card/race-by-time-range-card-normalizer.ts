import { RaceByTimeRangeCard } from "../../../../../state/layout/cards/Card.types";
import { RaceByTimeRangeCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

export default function normalizeRaceByTimeRangeCardFragmentIntoRaceByTimeRangeCard(
  raceByTimeRangeCardFragment: RaceByTimeRangeCardFragment,
): TransformedFragment<RaceByTimeRangeCard> {
  const { urn, race, viewLink, __typename, marketPromo, winner, winnerIsp } = raceByTimeRangeCardFragment;

  return {
    data: {
      urn,
      typename: __typename,
      viewLink,
      startTime: race.startTime,
      race: race.urn,
      marketPromo: marketPromo ? marketPromo.signposting : undefined,
      winner: winner ?? undefined,
      winnerIsp: winnerIsp
        ? {
            favourite: winnerIsp.favourite ?? undefined,
            decimal: winnerIsp.decimal ?? undefined,
            fractional: winnerIsp.fractional ?? undefined,
          }
        : undefined,
    },
  };
}
