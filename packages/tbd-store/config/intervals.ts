/**
 * Interval configuration for Login Status
 */
type LoginStatusIntervalConfig = {
  loggedIn: SportIntervalConfig;
  loggedOut: SportIntervalConfig;
};

/**
 * Interval configuration per sport. Inplay intervals may be specified
 * or a default value for all states.
 */
type SportIntervalConfig = {
  default: InplayIntervalConfig;
  [sportId: string]: InplayIntervalConfig;
};

/**
 * Inplay/NotInplay interval configuration
 */
type InplayIntervalConfig = {
  inPlay: number;
  notInPlay: number;
};

type LoggedInStatusIntervalConfig = {
  loggedIn: SportIntervalConfig;
  loggedOut: number;
};

/**
 * A map of interval configuration per TLA. A default value
 * for this endpoint or a logged in/out config must be provided
 */
export type IntervalsConfig = {
  ERO: number;
  SMP: number;
  WAS: number;
  LBR: number;
  SIB: number;
  SER: number;
  BLH: InplayIntervalConfig;
  BME: InplayIntervalConfig | null;
  SCA: LoginStatusIntervalConfig;
  COS: LoggedInStatusIntervalConfig;
  JACKPOT_ZONE: number;
  MY_BETS: number;
  POPULAR_BETS: number;
  REFRESH_CARDS: number;
  POLLING_DEBOUNCE: number;
};

export const DEFAULT_INTERVALS: IntervalsConfig = {
  ERO: 2000,
  SMP: 2000,
  WAS: 30000,
  LBR: 1000,
  SIB: 5000,
  SER: 10000,
  BLH: {
    inPlay: 5000,
    notInPlay: 30000,
  },
  BME: {
    inPlay: 5000,
    notInPlay: 30000,
  },
  SCA: {
    loggedIn: {
      default: {
        inPlay: 5000,
        notInPlay: 30000,
      },
    },
    loggedOut: {
      default: {
        inPlay: 5000,
        notInPlay: 30000,
      },
    },
  },
  COS: {
    loggedIn: {
      default: {
        inPlay: 5000,
        notInPlay: 13000,
      },
      7: {
        inPlay: 1000,
        notInPlay: 13000,
      },
    },
    loggedOut: 1000000,
  },
  JACKPOT_ZONE: 60000,
  MY_BETS: 5000,
  POPULAR_BETS: 5000,
  REFRESH_CARDS: 10000,
  POLLING_DEBOUNCE: 300,
};

let intervals: IntervalsConfig = DEFAULT_INTERVALS;

export function setupRefreshIntervals(newIntervals: IntervalsConfig): void {
  intervals = newIntervals;
}

type GetIntervalOptions = {
  loggedIn?: boolean;
  inPlay?: boolean;
  sportId?: number;
};

/**
 * Returns the timeout interval for the given parameters
 *
 * @param tla The tla name
 * @param loggedIn True if the user is logged in
 * @param inplay True if the event is inplay
 * @param sportId The sport id (eventTypeId)
 */
export function getInterval(
  tla: keyof IntervalsConfig,
  { loggedIn = false, inPlay = false, sportId }: GetIntervalOptions = {},
): number {
  const TLA_CONFIG = intervals[tla];

  if (["BLH", "BME"].includes(tla)) {
    const inPlayStateConfig = TLA_CONFIG as InplayIntervalConfig;

    return inPlay ? inPlayStateConfig.inPlay : inPlayStateConfig.notInPlay;
  }

  if (tla === "SCA") {
    const loggedInStateConfig = TLA_CONFIG as LoginStatusIntervalConfig;
    const config = loggedIn ? loggedInStateConfig.loggedIn : loggedInStateConfig.loggedOut;
    const sportConfig = sportId && config[sportId] ? config[sportId] : config.default;

    return inPlay ? sportConfig.inPlay : sportConfig.notInPlay;
  }

  if (tla === "COS") {
    const loggedInStateConfig = TLA_CONFIG as LoggedInStatusIntervalConfig;

    if (!loggedIn) return loggedInStateConfig.loggedOut;

    const config = loggedInStateConfig.loggedIn;
    const sportConfig = sportId && config[sportId] ? config[sportId] : config.default;

    return inPlay ? sportConfig.inPlay : sportConfig.notInPlay;
  }

  return TLA_CONFIG as number;
}
