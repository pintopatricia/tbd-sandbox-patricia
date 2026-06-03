import { SwimlaneCardGroup, DisplayMode } from "../../../../../state/layout/cardgroups/CardGroup.types";
import { PartialItem } from "../../../../../state/layout/Layout.types";
import { SwimlaneCardGroupFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";
import { getCardIcon } from "../../../gql-entities-mapper";

// TODO: This should be infered by display mode available on BFF
const DISPLAY_MODES: Record<string, DisplayMode> = {
  EventMarketCard: "SNAP",
  MarketCard: "SNAP",
  RaceMarketCard: "SNAP",
  PromotionCard: "SNAP",
  MatchStatsCard: "SNAP",
  TeamLineupCard: "SNAP",
  MatchTimelineCard: "SNAP",
  HeadToHeadCard: "SNAP",
  TeamFormCard: "SNAP",
  PopularBetBuilderCard: "SNAP",
  PopularMultiplesBetBuilderCard: "SNAP",
  BetOpportunityPromoCard: "SNAP",
  EditorialPromoCard: "SNAP",
  SelectionPromoCard: "SNAP",
  LoyaltyPromoCard: "SNAP",
  PriceBoostMultiplePromoCard: "SNAP",
};

const normalizeCardGroupFragmentIntoCardGroup = (
  swimlaneCardGroup: SwimlaneCardGroupFragment,
): TransformedFragment<SwimlaneCardGroup> => {
  const { urn, cardGroupTitle: title, displayName, partials, full, viewAll, __typename } = swimlaneCardGroup;

  function getValidNode(edge: any): edge is { node: { __typename: string } } {
    return edge && "__typename" in edge.node;
  }

  const validNode = partials.edges.find(getValidNode);
  // eslint-disable-next-line no-underscore-dangle
  const cardType = (validNode && validNode.node.__typename) || "";
  const displayMode = DISPLAY_MODES[cardType] || "SCROLLABLE";

  return {
    data: {
      typename: __typename,
      urn,
      title: title ?? undefined,
      displayMode,
      displayName: displayName ?? undefined,
      viewAll: viewAll?.label
        ? {
            label: viewAll.label,
            icon: viewAll.icon ? getCardIcon(viewAll.icon) : undefined,
            viewLink: viewAll.viewLink,
          }
        : undefined,
      items: partials.edges.reduce((acc: PartialItem[], item, index) => {
        if (item && full.edges[index] !== null && "urn" in item.node) {
          return [
            ...acc,
            {
              // eslint-disable-next-line no-underscore-dangle
              typename: item.node.__typename,
              urn: item.node.urn,
            },
          ];
        }
        return acc;
      }, []),
    },
  };
};

export default normalizeCardGroupFragmentIntoCardGroup;
