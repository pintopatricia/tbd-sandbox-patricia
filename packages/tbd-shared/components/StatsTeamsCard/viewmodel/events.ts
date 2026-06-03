type Events = {
  "@@UI/STATS_TEAMS_CARD_EXPAND_ICON_CHANGED": StatsTeamsCardExpandIconChangedPayload;
};

type StatsTeamsCardExpandIconChangedPayload = {
  urn: string;
  isExpanded: boolean;
  stat_tab: string;
  stat_type: string;
};

export type { Events as StatsTeamsCardEvents };
