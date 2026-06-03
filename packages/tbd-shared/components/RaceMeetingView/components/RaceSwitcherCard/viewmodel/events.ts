type Events = {
  "@@UI/RACE_SWITCHER_CLOSE": RaceSwitcherCardOnClosePayload;
  "@@UI/RACE_SWITCHER_OPEN": RaceSwitcherCardOnOpenPayload;
};

type RaceSwitcherCardOnClosePayload = {
  urn: string;
  viewLink: { viewUrn: string; viewUrl: string };
};

type RaceSwitcherCardOnOpenPayload = {
  urn: string;
};

export type { Events as RaceSwitcherCardEvents };
