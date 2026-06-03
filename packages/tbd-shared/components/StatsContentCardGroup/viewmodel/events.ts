type Events = {
  "@@UI/STATS_TAB_CLICK": StatsContentCardGroupClickPayload;
};

type StatsContentCardGroupClickPayload = {
  urn: string;
  isOpen: boolean;
  itemUrn: string;
};

export type { Events as StatsContentCardGroupEvents };
