type Events = {
  "@@UI/SKY_BET_CLUB_TRACKER_CARD_LOADED": SkyBetClubTrackerCardLoadedPayload;
  "@@UI/SKY_BET_CLUB_TRACKER_HOMEPAGE_LINK_TAP": SkyBetClubTrackerHomepageLinkTapPayload;
};

type SkyBetClubTrackerCardLoadedPayload = {
  urn: string;
};

type SkyBetClubTrackerHomepageLinkTapPayload = {
  destinationUrl: string;
};

export type { Events as SkyBetClubTrackerCardEvents };
