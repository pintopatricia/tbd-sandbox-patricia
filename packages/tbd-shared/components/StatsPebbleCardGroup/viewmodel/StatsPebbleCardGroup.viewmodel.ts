import { PebbleListItem } from "@ppb/the-wall-common/types";
import { TranslationKey } from "../../../translations/keys";
import { useStatsPebbleCardGroupQuery } from "../model/StatsPebbleCardGroup.graphql";
import { i18n } from "../../../helpers/i18n";
import emitEvent from "../../../event-broker/event-emitter";

const periodStatusFootball = {
  PRE_MATCH: "PRE_MATCH",
  FULL: "FULL",
  END: "END",
  HALF: "HALF",
  INPLAY_FIRST_HALF: "INPLAY_FIRST_HALF",
  INPLAY_SECOND_HALF: "INPLAY_SECOND_HALF",
  PENALTY_SHOOTOUT: "PENALTY_SHOOTOUT",
} as const;

const onPebbleStatsPress = (urn: string, pebbleId?: string) => {
  emitEvent("@@UI/PEBBLE_STATS_CLICK", {
    urn,
    pebbleId,
  });
};

const events = {
  onPebbleStatsPress,
};

export default function useStatsPebbleCardGroupVM(cardURN: string, visible: boolean) {
  const {
    loading,
    data: { card, baseCard },
  } = useStatsPebbleCardGroupQuery({ cardURN }, { visible });
  const emptyLabels = {
    title: i18n({ key: "I18N.STATS.STATS_UNAVAILABLE" }),
    message: i18n({ key: "I18N.STATS.NO_STATS_AVAILABLE" }),
  };

  const statsPebbleContext = cardURN.split("|")[1];
  const isMyBetsAndPreMatch = statsPebbleContext === "my-bets" && baseCard?.status === periodStatusFootball.PRE_MATCH;

  if (isMyBetsAndPreMatch) {
    emptyLabels.message = i18n({ key: "I18N.STATS.NO_STATS_AVAILABLE_PM_MYBETS" });
  }

  if (!card || isMyBetsAndPreMatch) {
    return {
      loading,
      vm: {
        data: null,
        events,
        emptyLabels,
      },
    };
  }

  const pebblesDataArray: PebbleListItem[] = card.partials.edges.reduce<PebbleListItem[]>((acc, item) => {
    if (item?.node && "urn" in item.node) {
      const pebbleUrn = item.node.urn;
      const { displayName } = item;
      const typename = item.node.__typename;

      const translationKey =
        displayName && typeof displayName === "object" && "translationKey" in displayName
          ? displayName.translationKey
          : "";

      const text = i18n({ key: translationKey as unknown as keyof TranslationKey });

      return [
        ...acc,
        {
          id: pebbleUrn,
          text,
          typename,
        },
      ];
    }

    return acc;
  }, []);

  if (!pebblesDataArray.length) {
    return {
      loading,
      vm: {
        data: {
          items: null,
          defaultSelectedPebble: null,
          local: null,
        },
        events,
        emptyLabels,
      },
    };
  }

  return {
    loading,
    vm: {
      data: {
        items: pebblesDataArray,
        defaultSelectedPebble: {
          urn: pebblesDataArray[0]?.id,
          typename: pebblesDataArray[0].typename,
        },
        local: {
          selectedPebble: card.selectedPebble ?? null,
        },
      },
      emptyLabels,
      events,
    },
  };
}
