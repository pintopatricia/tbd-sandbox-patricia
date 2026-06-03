type Events = {
  "@@UI/STATS_PLAYERS_INPLAY_TERMS_TAP": StatsPlayersInplayTermsPayload;
  "@@UI/STATS_PLAYERS_INPLAY_EXPANDABLE_BUTTON_CLICK": StatsPlayersInplayExpandableButtonClickPayload;
};

type StatsPlayersInplayTermsPayload = {
  urn: string;
  destinationUrl: string;
  title: string;
};

type StatsPlayersInplayExpandableButtonClickPayload = {
  urn: string;
  isOpen: boolean;
};

export type { Events as StatsPlayersInPlayEvents };
