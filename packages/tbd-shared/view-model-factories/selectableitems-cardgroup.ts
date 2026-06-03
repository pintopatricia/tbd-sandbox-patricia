import { RaceTimeItemEdge } from "@ppb/tbd-store/state/layout/cards/Card.types";
import { SelectableItem, StatisticSelectableItem } from "@ppb/the-wall-common/types";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import {
  SelectableItemsCardGroupEdge,
  StatisticsItemEdge,
  VirtualCardGroupItemEdge,
} from "@ppb/tbd-store/state/layout/cardgroups/CardGroup.types";
import { SupportingContentIconName } from "@ppb/the-wall-icons";
import { createSelector, OutputParametricSelector } from "reselect";
import { formatTime } from "../helpers/dates";
import { i18n } from "../helpers/i18n";

function isVirtuaCardGroup(edge: SelectableItemsCardGroupEdge): edge is VirtualCardGroupItemEdge {
  return edge.typename === "VirtualCardGroup";
}

function isRaceTimeItemEdge(edge: SelectableItemsCardGroupEdge): edge is RaceTimeItemEdge {
  return !!(edge as RaceTimeItemEdge).startTime;
}

function isStatisticsItemEdge(edge: SelectableItemsCardGroupEdge): edge is StatisticsItemEdge {
  const statisticsItem = edge as StatisticsItemEdge;
  return !("startTime" in statisticsItem);
}

function getStatisticItem({ typename }: StatisticsItemEdge): StatisticSelectableItem | null {
  switch (typename) {
    case "EventStatsCard":
      return {
        title: i18n({ key: "I18N.EVENT_STATS.TITLE" }),
        icon: SupportingContentIconName.OPTA_STATS,
      };
    case "HeadToHeadCard":
      return {
        title: i18n({ key: "I18N.HEAD_TO_HEAD.TITLE" }),
        icon: SupportingContentIconName.HEAD_TO_HEAD,
      };
    case "MatchStatsCard":
      return {
        title: i18n({ key: "I18N.MATCH_STATS.TITLE" }),
        icon: SupportingContentIconName.MATCH_STATS,
      };
    case "MatchTimelineCard":
      return {
        title: i18n({ key: "I18N.MATCH_TIMELINE.TITLE" }),
        icon: SupportingContentIconName.MATCH_TIMELINE,
      };
    case "TeamFormCard":
      return {
        title: i18n({ key: "I18N.RECENT_FORM.TITLE" }),
        icon: SupportingContentIconName.TEAM_FORM,
      };
    case "TeamLineupCard":
      return {
        title: i18n({ key: "I18N.TEAM_LINEUPS.TITLE" }),
        icon: SupportingContentIconName.TEAM_LINEUP,
      };
    default:
      return null;
  }
}

export const createSelectableItems = (): OutputParametricSelector<
  SelectableItemsCardGroupEdge[],
  UserDetails,
  SelectableItem[],
  (edges: SelectableItemsCardGroupEdge[], userDetails: UserDetails) => SelectableItem[]
> =>
  createSelector(
    [
      (edges: SelectableItemsCardGroupEdge[]) => edges,
      (_: SelectableItemsCardGroupEdge[], userDetails: UserDetails) => userDetails,
    ],
    (edges: SelectableItemsCardGroupEdge[], userDetails: UserDetails): SelectableItem[] => {
      const { localeCodeBcp47, timezone } = userDetails;

      return edges.reduce((acc: SelectableItem[], item) => {
        if (isVirtuaCardGroup(item)) {
          return [
            ...acc,
            {
              raceTime: formatTime(item.startTime, localeCodeBcp47, timezone),
              isDisabled: item.isDisabled,
              isRaceClosed: item.isClosed,
            },
          ];
        }
        if (isRaceTimeItemEdge(item)) {
          return [
            ...acc,
            {
              raceTime: formatTime(item.startTime, localeCodeBcp47, timezone),
              meetingName: item.venue || "",
              marketPromo: item.marketPromo,
            },
          ];
        }
        if (isStatisticsItemEdge(item)) {
          const statisticItem = getStatisticItem(item);

          if (statisticItem) {
            return [
              ...acc,
              {
                title: statisticItem.title,
                icon: statisticItem.icon,
              },
            ];
          }
        }

        return acc;
      }, []);
    },
  );
