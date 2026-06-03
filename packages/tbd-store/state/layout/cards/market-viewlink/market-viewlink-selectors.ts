import { createSelectorCreator, defaultMemoize } from "reselect";
import { MarketViewLinkCards } from "../Card.types";
import { ApplicationState } from "../../../ApplicationState.types";
import { createCardByURNSelector } from "../cards-selectors";
import URN from "../../URN";
import { ViewLink } from "../../views/ViewLink.types";
import { Badge } from "../../../../clients/catalogue/catalogue-response-types";

export type MarketViewLink = {
  urn: URN;
  marketName: string;
  viewLink: ViewLink;
  badge?: Badge | null;
};

function isMarketViewLinkEqual(a: MarketViewLink, b: MarketViewLink): boolean {
  return (
    a.urn === b.urn && a.marketName === b.marketName && a.viewLink.viewUrl === b.viewLink.viewUrl && a.badge === b.badge
  );
}

export function isMarketViewLinksEqual(previous: MarketViewLink[], current: MarketViewLink[]): boolean {
  if (previous.length !== current.length) {
    return false;
  }

  return previous.every((marketViewLink, i) => isMarketViewLinkEqual(marketViewLink, current[i]));
}

const createMarketViewLinksSelector = createSelectorCreator(defaultMemoize, isMarketViewLinksEqual);

export const createMarketViewLinksByURNsSelector = () => {
  const getMarketViewLinkCardByURN = createCardByURNSelector<MarketViewLinkCards, URN>();

  return createMarketViewLinksSelector(
    (state: ApplicationState, marketViewLinkURNs: URN[] = []) =>
      marketViewLinkURNs.reduce<MarketViewLink[]>((acc, urn: URN): MarketViewLink[] => {
        const marketViewLinkCard = getMarketViewLinkCardByURN(state.layouts.cards.marketviewlinks, urn);

        if (!marketViewLinkCard) {
          return acc;
        }

        return [
          ...acc,
          {
            urn: marketViewLinkCard.urn,
            marketName: marketViewLinkCard.marketName,
            viewLink: marketViewLinkCard.viewLink,
            badge: marketViewLinkCard.badge,
          },
        ];
      }, []),
    (marketViewLinks) => marketViewLinks,
  );
};
