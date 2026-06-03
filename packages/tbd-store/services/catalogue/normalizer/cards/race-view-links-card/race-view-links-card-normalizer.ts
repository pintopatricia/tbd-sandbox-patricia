import { RaceViewLink, RaceViewLinksCard } from "../../../../../state/layout/cards/Card.types";
import { RaceViewLinksCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

export default function normalizeRaceViewLinksCardFragmentIntoRaceViewLinksCard(
  raceViewLinksCardFragment: RaceViewLinksCardFragment,
): TransformedFragment<RaceViewLinksCard> {
  const { urn, race, raceViewLinks, __typename } = raceViewLinksCardFragment;
  const raceViewLinksParsed: RaceViewLink[] = raceViewLinks.map((raceViewLink) => ({
    race: raceViewLink.race.urn,
    viewLink: {
      viewUrn: raceViewLink.viewLink.viewUrn,
      viewUrl: raceViewLink.viewLink.viewUrl,
    },
    ...(raceViewLink.marketPromo?.signposting && { marketPromo: raceViewLink.marketPromo.signposting }),
  }));

  return {
    data: {
      urn,
      typename: __typename,
      raceViewLinks: raceViewLinksParsed,
      race: race.urn,
    },
  };
}
