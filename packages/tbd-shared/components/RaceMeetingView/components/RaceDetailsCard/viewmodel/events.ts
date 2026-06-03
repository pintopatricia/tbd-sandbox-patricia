type Events = {
  "@@UI/RACE_DETAILS_CARD_SUBSCRIBE": RaceDetailsCardSubscribePayload;
  "@@UI/RACE_DETAILS_CARD_UNSUBSCRIBE": RaceDetailsCardUnsubscribePayload;
};

type RaceDetailsCardSubscribePayload = {
  raceURN: string;
};

type RaceDetailsCardUnsubscribePayload = {
  raceURN: string;
};

export type { Events as RaceDetailsCardEvents };
