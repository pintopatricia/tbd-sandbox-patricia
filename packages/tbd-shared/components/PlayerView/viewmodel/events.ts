type Events = {
  "@@UI/FETCH_CARDS": FetchCardsPayload;
  "@@UI/FETCH_BARS": FetchBarsPayload;
};

type FetchCardsPayload = {
  itemUrns: string[];
  viewItem?: string;
};

type FetchBarsPayload = {
  viewUrn: string;
  bottomBar: boolean;
  leftSidebar: boolean;
};

export type { Events as PlayerViewEvents };
