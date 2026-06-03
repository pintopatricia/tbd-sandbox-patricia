import type { StatsPlayersInPlayCardFragment } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";

import emitEvent from "../../../event-broker/event-emitter";
import { formatTime } from "../../../helpers/dates";
import { getExternalLink } from "../../../helpers/external-links";
import { i18n } from "../../../helpers/i18n";
import type { TranslationKey } from "../../../translations/keys";
import {
  getStatsPlayerInPlayThrottle,
  useStatsPlayersInPlayCardQuery,
  useStatsPlayersInPlayUserDetailsQuery,
} from "../model/StatsPlayersInPlayCard.graphql";
import {
  PlayerStat,
  type StatsPlayersInPlayCardVM,
  type SwimlaneItem,
  type Translations,
} from "../types/StatsPlayersInPlayCard.types";

const onTermsTap = (urn: string, destinationUrl: string, title: string): void => {
  emitEvent("@@UI/STATS_PLAYERS_INPLAY_TERMS_TAP", {
    urn,
    destinationUrl,
    title,
  });
};

const onExpandableClickButton = (urn: string, isOpen: boolean): void => {
  emitEvent("@@UI/STATS_PLAYERS_INPLAY_EXPANDABLE_BUTTON_CLICK", {
    urn,
    isOpen,
  });
};

const events = {
  onTermsTap,
  onExpandableClickButton,
};

const translationKeys: Record<keyof Translations, keyof TranslationKey> = {
  termsConditions: "I18N.STATS.IP_PLAYER_HELP_SUPPORT",
  emptyStateTitle: "I18N.STATS.STATS_UNAVAILABLE",
  emptyStateMessageGeneral: "I18N.STATS.NO_STATS_AVAILABLE",
  emptyStateMessageSingleStat: "I18N.STATS.IP_PLAYER_NO_PLAYER_WITH_STATS",
  player: "I18N.STATS.PLAYER",
  total: "I18N.STATS.TOTAL",
  showMore: "I18N.SHOW_MORE",
  showLess: "I18N.SHOW_LESS",
};

const getPlayerTeamName = (playerId: string, home: any, away: any): string | null => {
  if (home.squad.players.some((entry: any): boolean => entry.id === playerId)) {
    return home.name;
  }

  if (away.squad.players.some((entry: any): boolean => entry.id === playerId)) {
    return away.name;
  }

  return null;
};

const createSwimlaneItem = (
  stat: PlayerStat,
  titleKey: string,
  descriptionKey: string | null,
  hasTermsAndConditions: boolean,
): SwimlaneItem => ({
  stat,
  title: i18n({ key: titleKey as keyof TranslationKey }),
  description: descriptionKey ? i18n({ key: descriptionKey as keyof TranslationKey }) : null,
  hasTermsAndConditions,
  tableEntries: [],
});

const getSwimlaneItems = (
  card: StatsPlayersInPlayCardFragment,
  isThrottleActive: boolean | undefined,
): SwimlaneItem[] => {
  const items = [
    createSwimlaneItem(
      PlayerStat.SHOTS_ON_TARGET,
      "I18N.STATS.IP_PLAYER_SHOTS_TARGET",
      "I18N.STATS.IP_PLAYER_SHOTS_TARGET_DESC",
      true,
    ),
    createSwimlaneItem(
      PlayerStat.FOULS,
      "I18N.STATS.IP_PLAYER_FOULS_COMMITED",
      "I18N.STATS.IP_PLAYER_FOULS_COMMITED_DESC",
      true,
    ),
    createSwimlaneItem(PlayerStat.FOULS_WON, "I18N.STATS.IP_PLAYER_FOULS_WON", null, false),
    createSwimlaneItem(PlayerStat.ASSISTS, "I18N.STATS.IP_PLAYER_ASSISTS", "I18N.STATS.IP_PLAYER_ASSISTS_DESC", true),
    createSwimlaneItem(
      PlayerStat.GOALKEEPER_SAVES,
      "I18N.STATS.IP_PLAYER_SAVES",
      "I18N.STATS.IP_PLAYER_SAVES_DESC",
      true,
    ),
    createSwimlaneItem(PlayerStat.TOTAL_SHOTS, "I18N.STATS.IP_PLAYER_TOTAL_SHOTS", null, false),
    createSwimlaneItem(
      PlayerStat.TACKLES_WON,
      "I18N.STATS.IP_PLAYER_TACKLES_WON",
      "I18N.STATS.IP_PLAYER_TACKLES_WON_DESC",
      true,
    ),
    createSwimlaneItem(
      PlayerStat.BLOCKED_SHOTS,
      "I18N.STATS.IP_PLAYER_BLOCKED_SHOTS",
      "I18N.STATS.IP_PLAYER_BLOCKED_SHOTS_DESC",
      true,
    ),
    createSwimlaneItem(PlayerStat.OFFSIDES, "I18N.STATS.IP_PLAYER_OFFSIDES", null, false),
    createSwimlaneItem(
      PlayerStat.INTERCEPTIONS,
      "I18N.STATS.IP_PLAYER_INTERCEPTIONS",
      "I18N.STATS.IP_PLAYER_INTERCEPTIONS_DESC",
      true,
    ),
  ];

  if (isThrottleActive) {
    // insert Shots_Created after assists
    items?.splice(
      4,
      0,
      createSwimlaneItem(PlayerStat.SHOTS_CREATED, "I18N.STATS_SHOTS_CREATED", "I18N.STATS_SHOTS_CREATED_DESC", true),
    );
  }

  const {
    fixture: { players, home, away },
  } = card;

  players?.forEach((player): void => {
    const stats = player?.stats?.[0]?.stats;

    if (!player?.id || !player?.name || !stats) {
      return;
    }

    const teamName = getPlayerTeamName(player.id, home, away);

    if (!teamName) {
      return;
    }

    const nameAndTeam = {
      id: player.id,
      playerName: player.name,
      teamName,
    };

    items.forEach((item): void => {
      const quantity = stats[item.stat];

      if (quantity && quantity > 0) {
        item.tableEntries.push({
          ...nameAndTeam,
          quantity,
        });
      }
    });
  });

  items.forEach((item): void => {
    item.tableEntries.sort((a, b): number => b.quantity - a.quantity);
  });

  return items;
};

export default function useStatsPlayersInPlayCardVM(cardURN: string, visible: boolean): StatsPlayersInPlayCardVM {
  const isThrottleActive = getStatsPlayerInPlayThrottle();
  const {
    data: { appContext = null },
    loading: appContextLoading,
  } = useStatsPlayersInPlayUserDetailsQuery({ visible });

  const {
    data: { card = null },
    loading: cardLoading,
  } = useStatsPlayersInPlayCardQuery({ cardURN }, { visible });

  const baseVM = {
    loading: appContextLoading || cardLoading,
    vm: {
      data: {
        swimlaneItems: null,
        translations: Object.entries(translationKeys).reduce<Translations>(
          (acc, [key, translationKey]): Translations => ({
            ...acc,
            [key]: i18n({ key: translationKey }),
          }),
          {} as Translations,
        ),
      },
      events,
    },
  };

  if (!card) {
    return baseVM;
  }

  let timestamp = null;
  let termsAndConditionsURL;

  if (appContext) {
    const timeNow = formatTime(new Date(), appContext.userdetails.localeCodeBcp47, appContext.userdetails.timezone);

    timestamp = `${i18n({ key: "I18N.STATS.IP_PLAYER_LABEL_UPDATED" })} ${timeNow}`;

    termsAndConditionsURL = getExternalLink(
      "OPTA_FOOTBALL_STATISTICS",
      appContext.userdetails.jurisdiction.jurisdiction,
      appContext.userdetails.localeCodeBcp47,
    );
  }

  const swimlaneItems = getSwimlaneItems(card, isThrottleActive);

  return {
    ...baseVM,
    vm: {
      ...baseVM.vm,
      data: {
        ...baseVM.vm.data,
        swimlaneItems,
        termsAndConditionsURL,
        timestamp,
      },
    },
  };
}
