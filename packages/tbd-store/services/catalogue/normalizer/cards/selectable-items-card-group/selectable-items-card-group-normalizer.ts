/* eslint-disable no-underscore-dangle */

import {
  SelectableItemsCardGroup,
  SelectableItemsCardGroupEdge,
} from "../../../../../state/layout/cardgroups/CardGroup.types";
import {
  EventStatsCardFragment,
  HeadToHeadCardFragment,
  MatchStatsCardFragment,
  MatchTimelineCardFragment,
  PartialsSelectableItemsCardGroupItemsFragment,
  RaceMarketCardFragment,
  RaceTimeItemEdge as RaceTimeItemEdgeFragment,
  SelectableitemsCardGroupFragment,
  SelectableItemsCardGroupItemEdge,
  TeamFormCardFragment,
  TeamLineupCardFragment,
  VirtualCardGroupPartialItemEdgeFragment,
} from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";
import { SelectableItemsFilterOptions } from "../../../../../state/constants";

type RaceTimeItemEdge = Omit<RaceTimeItemEdgeFragment, "node"> & { node: RaceMarketCardFragment };
type StatisticsItemEdge = {
  node:
    | EventStatsCardFragment
    | HeadToHeadCardFragment
    | MatchStatsCardFragment
    | MatchTimelineCardFragment
    | TeamFormCardFragment
    | TeamLineupCardFragment
    | {};
};

function isRaceTimeItemEdge(
  selectableItemEdge: SelectableItemsCardGroupItemEdge | {} | null,
): selectableItemEdge is RaceTimeItemEdge {
  return !!(selectableItemEdge as RaceTimeItemEdge).startTime;
}

function isStatisticsItemEdge(
  selectableItemEdge: SelectableItemsCardGroupItemEdge | {} | null,
): selectableItemEdge is StatisticsItemEdge {
  const statisticsItem = selectableItemEdge as StatisticsItemEdge;
  return !("startTime" in statisticsItem);
}

function isVirtualCardGroupItemEdge(
  selectableItemEdge: PartialsSelectableItemsCardGroupItemsFragment["edges"][0] | null,
): selectableItemEdge is VirtualCardGroupPartialItemEdgeFragment {
  return (
    !!selectableItemEdge &&
    "__typename" in selectableItemEdge &&
    selectableItemEdge.__typename === "VirtualCardGroupItemEdge"
  );
}

const normalizeSelectableItemsCardGroupFragmentIntoSelectableItemsCardGroup = (
  selectableItemsCardGroup: SelectableitemsCardGroupFragment,
): TransformedFragment<SelectableItemsCardGroup> => {
  const { urn, cardGroupTitle, partials, __typename, filter, isSelectableItemsCardGroupHighlighted } =
    selectableItemsCardGroup;

  return {
    data: {
      urn,
      typename: __typename,
      isHighlighted: isSelectableItemsCardGroupHighlighted,
      title: cardGroupTitle ?? undefined,
      items: partials.edges.reduce((acc: SelectableItemsCardGroupEdge[], item) => {
        if (item && "urn" in item.node && isVirtualCardGroupItemEdge(item)) {
          return [
            ...acc,
            {
              startTime: item.startTime,
              urn: item.node.urn,
              typename: item.node.__typename,
              isClosed: item.isClosed,
              isDisabled: item.isDisabled,
            },
          ];
        }
        if (isRaceTimeItemEdge(item) && "urn" in item.node) {
          return [
            ...acc,
            {
              startTime: item.startTime,
              venue: item.venue,
              urn: item.node.urn,
              typename: item.node.__typename,
              ...(item.promotion?.signposting && { marketPromo: item.promotion.signposting }),
              isHighlighted: item.isHighlighted,
            },
          ];
        }
        if (isStatisticsItemEdge(item) && "urn" in item.node) {
          return [
            ...acc,
            {
              urn: item.node.urn,
              typename: item.node.__typename,
            },
          ];
        }

        return acc;
      }, []),
      filter:
        filter && filter.countries
          ? {
              countries: filter.countries.map((country) => SelectableItemsFilterOptions[country]),
              defaultCountry: filter.defaultSelected
                ? SelectableItemsFilterOptions[filter.defaultSelected]
                : SelectableItemsFilterOptions.UK_AND_IRE,
            }
          : undefined,
    },
  };
};

export default normalizeSelectableItemsCardGroupFragmentIntoSelectableItemsCardGroup;
