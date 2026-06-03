import { TaggingAction } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";
import { getStore } from "@ppb/tbd-store/create-store";
import { buildInterfaceEvent, buildPromotionEvent } from "tagging-library";
import {
  getBannerClickEvent,
  getGameTileClickEvent,
  getPromotionClickEvent,
} from "@ppb/tbd-store/middlewares/tagging-resolvers";
import {
  getLoyaltyPromotionOptInTapEvent,
  getLoyaltyPromotionBottomSheetOpenEvent,
  getLoyaltyPromotionBottomSheetCloseEvent,
  gameTileClickEventResolver,
  promotionTermsAndConditionsResolver,
  bannerClickResolver,
  loyaltyPromoCardTapResolver,
  loyaltyPromoCardCTATapResolver,
  editorialPromoCardTapResolver,
  editorialPromoCardTermsAndConditionsTapResolver,
  betOpportunityPromoCardTapResolver,
  betOpportunityPromoCardTermsAndConditionsTapResolver,
  selectionPromoCardTapResolver,
} from "./promotions-resolvers";
import { getBannerEventPayload } from "./util/banner/banner-util";

const emit = jest.fn();

jest.mock("eventemitter3-singleton", () => ({
  getEventRegistry: () => ({
    emit,
  }),
}));

jest.mock("@ppb/tbd-store/create-store", () => {
  const getState = jest.fn();

  return {
    getStore: jest.fn(() => ({
      getState,
    })),
  };
});

jest.mock("@ppb/tbd-store/state/layout-snapshot", () => ({
  getLayoutMetadata: jest.fn(() => ({
    horizontalPosition: 1,
    verticalPosition: 1,
    viewZoneTitle: "sport",
    title: "I18N.PROMO.TITLE",
    tabName: "sport",
    tabUrn: "ppb:tbd:tab:sport:1",
    cardGroupTitle: "Promotions",
  })),
}));

jest.mock("@ppb/tbd-store/state/entities/games/game-selectors", () => ({
  getGameByURN: jest.fn(() => ({
    name: "Game 123",
    provider: { name: "Game Provider" },
    launchId: "123",
  })),
}));

jest.mock("@ppb/tbd-store/state/layout/views/browse-view/browse-view-selectors", () => ({
  createGetGamingSearchInputSelector: jest.fn(() => jest.fn(() => "input search term")),
}));

jest.mock("tagging-library", () => ({
  buildBannerEvent: jest.fn(),
  buildInterfaceEvent: jest.fn(),
  buildPromotionEvent: jest.fn(),
}));

jest.mock("@ppb/tbd-shared/apollo-client/client", () => ({
  getApolloClient: jest.fn(() => ({
    cache: {
      readFragment: jest.fn(() => ({ urn: "ppb:tbd:urn", title: "Promotion Title" })),
      identify: jest.fn(() => "ppb:tbd:urn"),
    },
  })),
}));

jest.mock("@ppb/tbd-store/middlewares/tagging-resolvers", () => ({
  getGameTileClickEvent: jest.fn(),
  getPromotionClickEvent: jest.fn(),
  getBannerClickEvent: jest.fn(() => MOCK_EVENT),
}));

jest.mock("@ppb/tbd-shared/event-processors/tracking/processors/promotions/util/banner/banner-util", () => ({
  getBannerEventPayload: jest.fn(() => ({
    viewLink: {
      viewUrn: "ppb:tbd:view:race:7|35125294.1240",
      viewUrl: "https://viewUrl.com",
      viewDisplayMode: null,
    },
    title: "Promotion Title",
    promotionUrn: "ppb:tbd:card:selectionPromo:cms/aPnonhIAACMA8SNy",
    taggingAction: "clicked banner",
  })),
}));

const sendEvent = jest.fn();

const BANNER_NAV_EVENTS = [
  [loyaltyPromoCardTapResolver, "@@UI/LOYALTY_PROMO_CARD_TAP_NAV"],
  [loyaltyPromoCardCTATapResolver, "@@UI/LOYALTY_PROMO_CARD_CTA_TAP_NAV"],
  [editorialPromoCardTapResolver, "@@UI/EDITORIAL_PROMO_CARD_PROMO_TAP_NAV"],
  [editorialPromoCardTermsAndConditionsTapResolver, "@@UI/EDITORIAL_PROMO_CARD_TERMS_AND_CONDITIONS_TAP_NAV"],
  [betOpportunityPromoCardTapResolver, "@@UI/BET_OPPORTUNITY_PROMO_CARD_PROMO_TAP_NAV"],
  [
    betOpportunityPromoCardTermsAndConditionsTapResolver,
    "@@UI/BET_OPPORTUNITY_PROMO_CARD_TERMS_AND_CONDITIONS_TAP_NAV",
  ],
  [selectionPromoCardTapResolver, "@@UI/SELECTION_PROMO_CARD_PROMO_TAP_BANNER_TAGGING_FINISHED"],
];

const MOCK_STATE = {
  router: {
    currentUrn: "ppb:tbd:view:sport:1",
    currentUrl: "football/sport:1",
    currentView: "ppb:tbd:view:sport",
  },
  layouts: {
    views: {
      sport: {
        "ppb:tbd:view:sport:1": {
          urn: "ppb:tbd:view:sport:1",
          typename: "SportView",
        },
      },
      browse: {
        "ppb:tbd:view:browse:gaming": {
          urn: "ppb:tbd:view:browse:gaming",
          typename: "BrowserView",
          search: {
            result: {
              items: [],
            },
          },
        },
      },
    },
  },
  entities: {
    games: {
      "ppb:tbd:game:123": {
        name: "Game 123",
      },
    },
  },
};

export const MOCK_ACTION = {
  urn: "ppb:tbd:card:selectionPromo:cms/aPnonhIAACMA8SNy",
  viewLink: {
    __typename: "ViewLink",
    viewUrn: "ppb:tbd:view:race:7|35125294.1240",
    viewUrl: "https://viewUrl.com",
    viewDisplayMode: null,
  },
  isOptInSelected: false,
};

export const MOCK_EVENT_PAYLOAD = {
  viewLink: {
    viewUrn: "ppb:tbd:view:race:7|35125294.1240",
    viewUrl: "https://viewUrl.com",
    viewDisplayMode: null,
  },
  title: "Promotion Title",
  promotionUrn: "ppb:tbd:card:selectionPromo:cms/aPnonhIAACMA8SNy",
  taggingAction: "clicked banner",
};

const MOCK_EVENT = {
  action: "clicked banner",
  destination_url: "https://viewUrl.com",
  element_text: "starzand to win the 12:40 ffos las",
  event: "banner",
  module: "home - banner swimlane",
  position: "1",
};

describe("promotions-resolver", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    getStore().getState.mockReturnValue(MOCK_STATE);
  });

  describe("getLoyaltyPromotionOptInTapEvent", () => {
    it("should send the correct event payload", () => {
      const event = getLoyaltyPromotionOptInTapEvent(
        {
          __typename: "LoyaltyPromoCard",
          optInState: "ONGOING",
          optInStateLabel: "I18N.PROMO.STATE.LABEL.OPTED_IN",
          subTitle: "I18N.PROMO.DESCRIPTION",
          title: "I18N.PROMO.TITLE",
          promotionUrn: "ppb:tbd:loyaltyPromotion:CHECKMATE1",
        },
        sendEvent,
      );

      expect(buildPromotionEvent).toHaveBeenCalledWith({
        action: TaggingAction.ACCEPT_PROMOTION,
        elementText: "I18N.PROMO.TITLE",
        module: "sport - banner",
        destinationUrl: "null",
        position: "1",
        promotionId: "CHECKMATE1",
        promotionName: "I18N.PROMO.DESCRIPTION",
        promotionUserStatus: "ONGOING",
        promotionState: "I18N.PROMO.STATE.LABEL.OPTED_IN",
        promotionType: "opt in",
        progressBar: "null",
        tierLevel: "null",
      });

      expect(sendEvent).toHaveBeenCalledWith(event);
    });
  });

  describe("getLoyaltyPromotionBottomSheetOpenEvent", () => {
    it("should send the correct event payload", () => {
      const event = getLoyaltyPromotionBottomSheetOpenEvent(
        {
          __typename: "LoyaltyPromoCard",
          optInState: "ONGOING",
          optInStateLabel: "I18N.PROMO.STATE.LABEL.OPTED_IN",
          subTitle: "I18N.PROMO.DESCRIPTION",
          title: "I18N.PROMO.TITLE",
          promotionUrn: "ppb:tbd:loyaltyPromotion:CHECKMATE1",
        },
        sendEvent,
      );

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.OPENED,
        elementText: "I18N.PROMO.TITLE",
        module: "sport - banner details",
      });

      expect(sendEvent).toHaveBeenCalledWith(event);
    });
  });

  describe("getLoyaltyPromotionBottomSheetCloseEvent", () => {
    it("should send the correct event payload", () => {
      const event = getLoyaltyPromotionBottomSheetCloseEvent(
        {
          __typename: "LoyaltyPromoCard",
          title: "I18N.PROMO.TITLE",
        },
        sendEvent,
      );

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLOSED,
        elementText: "I18N.PROMO.TITLE",
        module: "sport - banner details",
      });

      expect(sendEvent).toHaveBeenCalledWith(event);
    });
  });

  describe("gameTileClickEventResolver", () => {
    it("should send the correct event payload", () => {
      const event = gameTileClickEventResolver(
        {
          __typename: "LoyaltyPromoCard",
          title: "I18N.PROMO.TITLE",
          viewLink: {
            viewUrn: "ppb:tbd:view:sport:1",
            viewUrl: "http://www.betfair.com?gameId=123",
          },
        },
        sendEvent,
      );

      expect(getGameTileClickEvent).toHaveBeenCalledWith(
        "search results",
        "search text - input search term",
        "Game 123",
        "http://www.betfair.com?gameId=123",
        "Game Provider",
        "123",
        1,
        1,
        1,
        1,
        "web",
      );

      expect(sendEvent).toHaveBeenCalledWith(event);
    });
  });

  describe("promotionTermsAndConditionsResolver", () => {
    it("should send the correct event payload", () => {
      const event = promotionTermsAndConditionsResolver(
        {
          __typename: "LoyaltyPromoCard",
          title: "I18N.PROMO.TITLE",
          viewLink: {
            viewUrl: "http://www.betfair.com",
            viewUrn: "ppb:tbd:view:sport:1",
            viewDisplayMode: "POPUP",
          },
        },
        sendEvent,
      );

      expect(getPromotionClickEvent).toHaveBeenCalledWith(
        {
          viewLink: { viewUrl: "http://www.betfair.com", viewUrn: "ppb:tbd:view:sport:1", viewDisplayMode: "POPUP" },
          promotionUrn: undefined,
          taggingAction: "clicked banner t&cs",
          title: "Promotion Title",
        },
        MOCK_STATE,
        "clicked banner t&cs",
      );

      expect(sendEvent).toHaveBeenCalledWith(event);
    });
  });

  describe("bannerClickResolver", () => {
    it("should call getBannerEventPayload with correct action", () => {
      bannerClickResolver(MOCK_ACTION, sendEvent, TaggingAction.CLICKED_BANNER);

      expect(getBannerEventPayload).toHaveBeenCalledWith(MOCK_ACTION, TaggingAction.CLICKED_BANNER);
    });

    it("should send the event", () => {
      bannerClickResolver(MOCK_ACTION, sendEvent, TaggingAction.CLICKED_BANNER);

      expect(getBannerClickEvent).toHaveBeenCalled();
      expect(sendEvent).toHaveBeenCalledWith(MOCK_EVENT);
    });
  });

  describe("banner tap events", () => {
    it.each(BANNER_NAV_EVENTS)("should call the correct navigation event", (resolver, navigationEvent) => {
      resolver(MOCK_ACTION, sendEvent);
      expect(emit).toHaveBeenCalledWith(navigationEvent, MOCK_ACTION);
    });
  });
});
