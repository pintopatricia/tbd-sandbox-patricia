type ViewLink = {
  viewUrn: string;
  viewUrl: string;
};

type Events = {
  "@@UI/RACE_MEETING_VIEW_LOADED": RaceMeetingViewLoadedPayload;
  "@@UI/RACE_MEETING_VIEW_RACE_SELECTED": RaceMeetingViewRaceSelectedPayload;
  "@@UI/RACE_MEETING_VIEW_SIBLING_SELECTED": RaceMeetingViewSiblingSelectedPayload;
  "@@UI/RACE_MEETING_VIEW_CARD_CLICKED": RaceMeetingViewCardClickedPayload;
  "@@UI/FETCH_BARS": FetchBarsPayload;
};

type RaceMeetingViewLoadedPayload = {
  urn: string;
};

type RaceMeetingViewRaceSelectedPayload = {
  urn: string;
  viewLink: ViewLink;
};

type RaceMeetingViewSiblingSelectedPayload = {
  urn: string;
  viewLink: ViewLink;
};

type RaceMeetingViewCardClickedPayload = {
  viewUrn: string;
  cardUrn: string;
};

type FetchBarsPayload = {
  viewUrn: string;
  bottomBar: boolean;
  leftSidebar: boolean;
};

export type { Events as RaceMeetingViewEvents };
