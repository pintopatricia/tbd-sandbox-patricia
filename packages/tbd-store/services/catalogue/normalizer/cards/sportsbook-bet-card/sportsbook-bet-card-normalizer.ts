import { NavigationLink, SportsbookBetCard } from "../../../../../state/layout/cards/Card.types";
import { SportsbookBetCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

export default function normalizeSportsbookBetCardFragmentIntoSportsbookBetCard({
  urn,
  bet,
  navigationLinks,
  __typename,
  betSharingViewLink,
}: SportsbookBetCardFragment): TransformedFragment<SportsbookBetCard> {
  const buildNavigationLinks: NavigationLink | Record<string, never> = navigationLinks.reduce(
    (acc, level) => ({
      ...acc,
      [level.marketBetUrn]: {
        viewUrn: level.viewUrn,
        viewUrl: level.viewUrl,
      },
    }),
    {},
  );

  return {
    data: {
      urn,
      typename: __typename,
      betURN: bet.urn,
      navigationLinks: buildNavigationLinks,
      betSharingViewLink: betSharingViewLink || undefined,
    },
  };
}
