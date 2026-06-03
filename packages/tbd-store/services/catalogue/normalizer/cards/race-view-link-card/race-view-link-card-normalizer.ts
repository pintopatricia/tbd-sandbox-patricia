import { RaceViewLinkCard } from "../../../../../state/layout/cards/Card.types";
import { RaceViewLinkCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

export default function normalizeRaceViewLinksCardFragmentIntoRaceViewLinksCard(
  raceViewLinkCardFragment: RaceViewLinkCardFragment,
): TransformedFragment<RaceViewLinkCard> {
  const { urn, race, viewLink, __typename } = raceViewLinkCardFragment;

  return {
    data: {
      urn,
      typename: __typename,
      viewLink,
      race: race.urn,
    },
  };
}
