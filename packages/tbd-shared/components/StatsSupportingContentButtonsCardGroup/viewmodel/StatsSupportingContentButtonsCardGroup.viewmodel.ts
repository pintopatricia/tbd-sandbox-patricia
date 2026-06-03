import { OthersIconName, SupportingContentIconName } from "@ppb/the-wall-icons";
import { TranslationKey } from "../../../translations/keys";
import { useStatsSupportingContentButtonsCardGroupQuery } from "../model/StatsSupportingContentButtonsCardGroup.graphql";
import { i18n } from "../../../helpers/i18n";
import emitEvent from "../../../event-broker/event-emitter";
import { SupportingContentCardGroupItem } from "../snowflakes/SupportingContentCardGroup/SupportingContentCardGroup.types";

const iconMap: Record<string, SupportingContentIconName | OthersIconName> = {
  StatsMatchStatsCard: SupportingContentIconName.MATCH_STATS,
  IncidentsCard: SupportingContentIconName.PITCH,
  StatsBroadcastsCard: SupportingContentIconName.LIVE_VIDEO,
  StatsRaceResultsCard: OthersIconName.WINNER_RIBBON,
};

const cardsWithoutStylesContent = new Set(["StatsBroadcastsCard", "StatsRaceResultsCard"]);

const onButtonsStatsPress = (urn: string, buttonId: string, isSelected: boolean) => {
  emitEvent("@@UI/SUPPORTING_CONTENT_BUTTON_STATS_CLICK", {
    urn,
    buttonId,
    isSelected,
  });
};

const events = {
  onButtonsStatsPress,
};

export default function useStatsSupportingContentButtonsCardGroupVM(cardURN: string, visible: boolean) {
  const {
    loading,
    data: { card },
  } = useStatsSupportingContentButtonsCardGroupQuery({ cardURN }, { visible });

  if (!card) {
    return {
      loading,
      vm: {
        data: null,
        events,
      },
    };
  }

  const buttonsDataArray = card.partials.edges
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .map<SupportingContentCardGroupItem>((item) => {
      const {
        node: { urn, __typename: typename },
        displayName,
      } = item;

      const translationKey =
        displayName && "translationKey" in displayName
          ? (displayName.translationKey as keyof TranslationKey)
          : undefined;

      const label = translationKey ? i18n({ key: translationKey as unknown as keyof TranslationKey }) : "";

      return {
        urn,
        label,
        typename,
        icon: iconMap[typename],
        applyContentStyles: !cardsWithoutStylesContent.has(typename),
      };
    });

  return {
    loading,
    vm: {
      data: {
        items: buttonsDataArray.length ? buttonsDataArray : null,
      },
      events,
    },
  };
}
