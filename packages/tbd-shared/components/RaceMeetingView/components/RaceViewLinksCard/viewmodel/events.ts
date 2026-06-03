type Events = {
  "@@UI/RACE_VIEW_LINKS_CARD_CLICKED": RaceViewLinksCardClickedPayload;
};

type RaceViewLinksCardClickedPayload = {
  urn: string;
  viewLink: {
    viewUrn: string;
    viewUrl: string;
  };
};

export type { Events as RaceViewLinksCardEvents };
