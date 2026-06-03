type Events = {
  "@@UI/PEBBLE_STATS_CLICK": PebbleStatsClickPayload;
};

type PebbleStatsClickPayload = {
  urn: string;
  pebbleId?: string;
};

export type { Events as StatsPebbleCardGroupEvents };
