import { createGetThrottleSelector } from "@ppb/tbd-store";
import { getStore } from "@ppb/tbd-store/create-store";
import { NavigationIconName, SupportingContentIconName } from "@ppb/the-wall-icons";
import { useStatsContentCardGroupQuery } from "../model/StatsContentCardGroup.graphql";
import { StatsContentItem } from "../view/StatsContentCardGroup.types";
import emitEvent from "../../../event-broker/event-emitter";

const STATS_CONTENT_TYPE = {
  FORM: "FORM",
  STATS: "STATS",
  PITCH: "PITCH",
  LIVE_VIDEO: "LIVE_VIDEO",
  PLAYER: "PLAYER",
  INPLAY_PLAYER: "INPLAY_PLAYER",
  TEAM: "TEAM",
  LINEUPS: "LINEUPS",
  TABLE: "TABLE",
};

const renderIcon = (moduleType: string) => {
  switch (moduleType) {
    case STATS_CONTENT_TYPE.FORM:
    case STATS_CONTENT_TYPE.STATS:
      return SupportingContentIconName.MATCH_STATS;
    case STATS_CONTENT_TYPE.PITCH:
      return SupportingContentIconName.PITCH;
    case STATS_CONTENT_TYPE.LIVE_VIDEO:
      return SupportingContentIconName.LIVE_VIDEO;
    case STATS_CONTENT_TYPE.PLAYER:
    case STATS_CONTENT_TYPE.INPLAY_PLAYER:
      return NavigationIconName.ACCOUNT;
    case STATS_CONTENT_TYPE.TEAM:
      return SupportingContentIconName.USERS;
    case STATS_CONTENT_TYPE.LINEUPS:
      return SupportingContentIconName.TEAM_LINEUP;
    case STATS_CONTENT_TYPE.TABLE:
      return SupportingContentIconName.LEAGUE_TABLE;
    default:
      return SupportingContentIconName.MATCH_STATS;
  }
};

const onTabPress = (urn: string, itemUrn: string, isOpen: boolean) => {
  emitEvent("@@UI/STATS_TAB_CLICK", {
    urn,
    isOpen,
    itemUrn,
  });
};

const events = {
  onTabPress,
};

export default function useStatsContentCardGroupVM(cardURN: string, visible: boolean) {
  const {
    loading,
    data: { card = null },
  } = useStatsContentCardGroupQuery({ cardURN }, { visible });

  const state = getStore().getState();
  const getThrottle = createGetThrottleSelector();
  const hasDivider = !!getThrottle(state.entities.throttles, "STATS_CONTENT_CARD_GROUP_DIVIDER")?.isActive;

  if (!card) {
    return {
      loading,
      vm: {
        data: null,
        events,
        hasDivider,
      },
    };
  }

  const data = card.partials.edges.reduce<StatsContentItem[]>((acc, item) => {
    if (item && "node" in item && item.node.urn) {
      acc.push({
        icon: renderIcon(item.type ?? ""),
        urn: item.node.urn,
        label: item.displayName?.translationKey ?? "",
        typename: item.node.__typename,
      });
    }

    return acc;
  }, []);

  return {
    loading,
    vm: {
      data: {
        items: data,
        local: {
          selectedTab: card.selectedTab ?? null,
        },
      },
      events,
      card,
      hasDivider,
    },
  };
}
