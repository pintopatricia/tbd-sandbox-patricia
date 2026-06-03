import { TaggingAction, TaggingCategory } from "./AnalyticsConstants";
import { APPLICATION, BUSINESS, DEVICE } from "./AnalyticsDimensions";
import {
  getLinkClickEvent,
  getNavigateToEventFromSport,
  getSearchLinkClickEvent,
  getSearchAzLinkClickEvent,
  getMarketRulesLinkClickEvent,
  getAllMarketsLinkClickEvent,
  getNavigateToMarketViewEvent,
  getCompetitionLinkClickEvent,
  getAllCompetitionsLinkClickEvent,
  getNavigateToGameCategoryEvent,
  getNavigateToGameInfoEvent,
  launchPrizeMachine,
  getTCPrizeMachineClickEvent,
  getCategoryFromMultifunctionalClickEvent,
  getBottomBarClickEvent,
  getSeeAllLinkClickEvent,
  getRaceViewLinksLinkClickEvent,
  getBackButtonClickEvent,
  getViewAllTapEvent,
  getViewFromFavouritesClickEvent,
  getAcceptPromotionEvent,
  getCancelPromotionEvent,
  getNavigationSeeAllPromotionsEvent,
  getNavigateToEvent,
  getLoadedNotFoundView,
  getNavigateFromNotFoundView,
  getCouponViewCardClickEvent,
  getBetslipBetBuilderNavigateToEvent,
  getBetslipSbkMaxPayoutNotificationUrlClickEvent,
  getNavigateToView,
  getNavigateToMobileWebEvent,
  getMarketBlurbFAQEvent,
} from "./navigation";

describe("Navigation GTM resolvers", () => {
  describe("getLinkClickEvent", () => {
    describe("with all props", () => {
      it("should return the correct event payload", () => {
        expect(getLinkClickEvent("test label", "footer", "destination URL")).toEqual({
          action: "navigated to",
          category: "navigation",
          cd3: "footer",
          cd34: "destination URL",
          event: "ga_event",
          label: "test label",
          cd67: null,
          cd42: null,
          cd43: null,
        });
      });
    });

    describe("with only non optional props", () => {
      it("should return the correct event payload", () => {
        expect(getLinkClickEvent()).toEqual({
          action: "navigated to",
          category: "navigation",
          cd3: "",
          cd34: "",
          event: "ga_event",
          label: "",
          cd67: null,
          cd42: null,
          cd43: null,
        });
      });
    });
  });

  describe("getNavigateToEventFromSport", () => {
    describe("when inPlay", () => {
      it("should return the correct event payload with inPlay as true", () => {
        expect(
          getNavigateToEventFromSport(
            "label",
            12345,
            "eventName",
            54321,
            "sportName",
            "destinationUrl",
            6789,
            "competitionName",
            false,
            "primary swimlane",
            {
              tabName: "tabTitle",
              cardGroupTitle: "groupTitle",
              verticalPosition: null,
              horizontalPosition: null,
            },
          ),
        ).toEqual({
          event: "ga_event",
          category: "navigation",
          action: "navigated to",
          label: "label",
          cd3: "sport - primary swimlane - groupTitle - label - tabTitle",
          cd34: "destinationUrl",
          cd14: 54321,
          cd5: "sportName",
          cd84: 12345,
          cd7: "eventName",
          cd129: 6789,
          cd6: "competitionName",
          cd131: null,
          cd79: "no",
          cd67: null,
          cd43: null,
        });
      });

      it("should return the correct event payload with inPlay as false", () => {
        expect(
          getNavigateToEventFromSport(
            "label",
            12345,
            "eventName",
            54321,
            "sportName",
            "destinationUrl",
            6789,
            "competitionName",
            true,
            "primary swimlane",
            {
              tabName: "tabTitle",
              cardGroupTitle: "groupTitle",
              verticalPosition: null,
              horizontalPosition: null,
            },
          ),
        ).toEqual({
          event: "ga_event",
          category: "navigation",
          action: "navigated to",
          label: "label",
          cd3: "sport - primary swimlane - groupTitle - label - tabTitle",
          cd34: "destinationUrl",
          cd14: 54321,
          cd5: "sportName",
          cd84: 12345,
          cd7: "eventName",
          cd129: 6789,
          cd6: "competitionName",
          cd131: null,
          cd79: "yes",
          cd67: null,
          cd43: null,
        });
      });
    });
  });

  describe("getNavigateToView", () => {
    it("should return the correct payload", () => {
      expect(
        getNavigateToView("label", "pagetype", "module", "href", {
          tabName: "tab",
          cardGroupTitle: "swimlaneCardgroup",
          verticalPosition: 1,
          horizontalPosition: 1,
        }),
      ).toEqual({
        event: "ga_event",
        category: TaggingCategory.NAVIGATION,
        action: TaggingAction.NAVIGATED_TO,
        label: "label",
        [APPLICATION.MODULE]: "pagetype - module - swimlaneCardgroup - label - tab",
        [BUSINESS.DESTINATION_URL]: "href",
        [DEVICE.POSITION]: 1,
        [BUSINESS.TRANS_CASHOUT_INDICATOR]: 1,
      });
    });
  });

  describe("launchPrizeMachine", () => {
    describe("when clicking on play now displayed on prize machine widget", () => {
      it("should return the correct object when prize machine doesn't have jackpot and hasPlus", () => {
        expect(launchPrizeMachine("https://viewlink", 1, false, undefined, "")).toEqual({
          event: "ga_event",
          action: "navigated to",
          category: "navigation",
          label: "prize machine",
          cd3: "prize machine",
          cd13: "prize pinball",
          cd12: "prize pinball",
          cd74: "ppb-internal",
          cd34: "https://viewlink",
          cd67: null,
          cd143: null,
          cd133: null,
          cd134: null,
          cd135: null,
          cd4: null,
          cd103: 1,
          cd42: null,
          cd43: null,
          cd68: null,
          cd69: null,
        });
      });
      it("should return the correct object when prize machine doesn't have jackpot but has hasPlus", () => {
        expect(launchPrizeMachine("https://viewlink", 1, false, undefined, " plus")).toEqual({
          event: "ga_event",
          action: "navigated to",
          category: "navigation",
          label: "prize machine plus",
          cd3: "prize machine",
          cd13: "prize pinball",
          cd12: "prize pinball",
          cd74: "ppb-internal",
          cd34: "https://viewlink",
          cd67: null,
          cd143: null,
          cd133: null,
          cd134: null,
          cd135: null,
          cd4: null,
          cd103: 1,
          cd42: null,
          cd43: null,
          cd68: null,
          cd69: null,
        });
      });

      it("should return the correct object when prize machine has jackpot", () => {
        expect(launchPrizeMachine("https://viewlink", undefined, true, "extra hot", "")).toEqual({
          event: "ga_event",
          action: "navigated to",
          category: "navigation",
          label: "prize machine - active jackpot - extra hot",
          cd3: "prize machine",
          cd13: "prize pinball",
          cd12: "prize pinball",
          cd74: "ppb-internal",
          cd34: "https://viewlink",
          cd67: null,
          cd143: null,
          cd133: null,
          cd134: null,
          cd135: null,
          cd4: null,
          cd103: null,
          cd42: null,
          cd43: null,
          cd68: null,
          cd69: null,
        });
      });

      it("should return the correct object when prize machine has isPlus", () => {
        expect(launchPrizeMachine("https://viewlink", undefined, true, "mega", " plus -")).toEqual({
          event: "ga_event",
          action: "navigated to",
          category: "navigation",
          label: "prize machine - plus - active jackpot - mega",
          cd3: "prize machine",
          cd13: "prize pinball",
          cd12: "prize pinball",
          cd74: "ppb-internal",
          cd34: "https://viewlink",
          cd67: null,
          cd143: null,
          cd133: null,
          cd134: null,
          cd135: null,
          cd4: null,
          cd103: null,
          cd42: null,
          cd43: null,
          cd68: null,
          cd69: null,
        });
      });
    });
  });

  describe("getTCPrizeMachineClickEvent", () => {
    describe("when clicking on T&Cs button displayed on prize machine widget", () => {
      describe("when itemVerticalPositionOnPage is defined", () => {
        it("should return the correct object", () => {
          expect(getTCPrizeMachineClickEvent("https://viewlink", 1)).toEqual({
            event: "ga_event",
            action: "navigated to",
            category: "navigation",
            label: "terms & conditions",
            cd3: "prize machine",
            cd13: "prize pinball",
            cd12: "prize pinball",
            cd74: "ppb-internal",
            cd34: "https://viewlink",
            cd143: null,
            cd133: null,
            cd134: null,
            cd135: null,
            cd4: null,
            cd103: 1,
            cd42: null,
            cd43: null,
            cd68: null,
            cd69: null,
          });
        });
      });

      describe("when itemVerticalPositionOnPage is undefined", () => {
        it("should return the correct object", () => {
          expect(getTCPrizeMachineClickEvent("https://viewlink")).toEqual({
            event: "ga_event",
            action: "navigated to",
            category: "navigation",
            label: "terms & conditions",
            cd3: "prize machine",
            cd13: "prize pinball",
            cd12: "prize pinball",
            cd74: "ppb-internal",
            cd34: "https://viewlink",
            cd143: null,
            cd133: null,
            cd134: null,
            cd135: null,
            cd4: null,
            cd103: null,
            cd42: null,
            cd43: null,
            cd68: null,
            cd69: null,
          });
        });
      });
    });
  });

  describe("getNavigateToMarketViewEvent", () => {
    describe("when clicking in a MARKET_CARD", () => {
      it("should return the correct event object", () => {
        expect(
          getNavigateToMarketViewEvent("market name", "event", "MarketCard", "href.com", {
            tabName: "tabTitle",
            cardGroupTitle: "groupTitle",
            horizontalPosition: 4,
            verticalPosition: 1,
          }),
        ).toEqual({
          action: "navigated to",
          category: "navigation",
          cd3: "event - primary swimlane - groupTitle - market name - tabTitle",
          cd34: "href.com",
          cd43: 4,
          cd67: 1,
          event: "ga_event",
          label: "market name",
        });
      });
    });

    describe("when clicking in a MARKET_VIEW_LINK_CARD", () => {
      it("should return the correct object", () => {
        expect(
          getNavigateToMarketViewEvent("", "sport", "MarketViewLinkCard", "href.com", {
            tabName: "tabTitle",
            cardGroupTitle: "groupTitle",
            horizontalPosition: null,
            verticalPosition: 1,
          }),
        ).toEqual({
          action: "navigated to",
          category: "navigation",
          cd3: "sport - secondary swimlane - groupTitle - null - tabTitle",
          cd34: "href.com",
          cd43: null,
          cd67: 1,
          event: "ga_event",
          label: "",
        });
      });
    });

    describe("when clicking in a QuickLinksCard", () => {
      it("should return the correct object", () => {
        expect(
          getNavigateToMarketViewEvent("", "sport", "QuickLinksCard", "href.com", {
            horizontalPosition: null,
            verticalPosition: 1,
          }),
        ).toEqual({
          action: "navigated to",
          category: "navigation",
          cd3: "sport - QuickLinksCard",
          cd34: "href.com",
          cd43: null,
          cd67: 1,
          event: "ga_event",
          label: "",
        });
      });
    });
  });

  describe("getSearchAzLinkClickEvent", () => {
    it("should return the correct payload", () => {
      expect(getSearchAzLinkClickEvent("title", "url")).toEqual({
        event: "ga_event",
        category: TaggingCategory.NAVIGATION,
        action: TaggingAction.NAVIGATED_TO,
        label: "title",
        [APPLICATION.MODULE]: "search menu",
        [BUSINESS.DESTINATION_URL]: "url",
      });
    });
  });

  describe("getSearchLinkClickEvent", () => {
    it("should return the correct payload", () => {
      expect(getSearchLinkClickEvent("search text - title", "url", 3)).toEqual({
        event: "ga_event",
        category: TaggingCategory.NAVIGATION,
        action: TaggingAction.NAVIGATED_TO,
        label: "search text - title",
        [APPLICATION.MODULE]: "search results",
        [BUSINESS.DESTINATION_URL]: "url",
        [DEVICE.POSITION]: 3,
      });
    });

    it("should return the correct payload with moduleName", () => {
      expect(getSearchLinkClickEvent("title", "url", 3, "Alberto")).toEqual({
        event: "ga_event",
        category: TaggingCategory.NAVIGATION,
        action: TaggingAction.NAVIGATED_TO,
        label: "title",
        [APPLICATION.MODULE]: "Alberto",
        [BUSINESS.DESTINATION_URL]: "url",
        [DEVICE.POSITION]: 3,
      });
    });
  });

  describe("getMarketRulesLinkClickEvent", () => {
    it("should return the correct payload", () => {
      expect(getMarketRulesLinkClickEvent("text", "url")).toEqual({
        event: "ga_event",
        category: TaggingCategory.NAVIGATION,
        action: TaggingAction.NAVIGATED_TO,
        label: "text",
        [APPLICATION.MODULE]: "market rules",
        [BUSINESS.DESTINATION_URL]: "url",
        [DEVICE.POSITION]: null,
        [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null,
        [BUSINESS.TRANS_CASHOUT_INDICATOR]: null,
      });
    });
  });

  describe("getAllMarketsLinkClickEvent", () => {
    it("should return the correct payload", () => {
      expect(getAllMarketsLinkClickEvent("url")).toEqual({
        action: "navigated to",
        category: "navigation",
        cd3: "event - all markets quicklink",
        cd34: "url",
        event: "ga_event",
        label: "view all markets",
      });
    });
  });

  describe("getCompetitionLinkClickEvent", () => {
    describe("when clicking in a swimlane", () => {
      it("should return the correct event object", () => {
        expect(
          getCompetitionLinkClickEvent("label", "page type", "module", "href.com", 2, 1, "groupTitle", "tabTitle"),
        ).toEqual({
          action: "navigated to",
          category: "navigation",
          cd3: "page type - module - groupTitle - label - tabTitle",
          cd34: "href.com",
          cd42: 1,
          cd43: 1,
          cd67: 2,
          event: "ga_event",
          label: "label",
        });
      });
    });

    describe("when clicking in outside a swimlane", () => {
      it("should return the correct object", () => {
        expect(
          getCompetitionLinkClickEvent(
            "label",
            "page type",
            "module",
            "href.com",
            null,
            null,
            "groupTitle",
            "tabTitle",
          ),
        ).toEqual({
          action: "navigated to",
          category: "navigation",
          cd3: "page type - module - groupTitle - label - tabTitle",
          cd34: "href.com",
          cd42: null,
          cd43: null,
          cd67: null,
          event: "ga_event",
          label: "label",
        });
      });
    });
  });

  describe("getAllCompetitionsLinkClickEvent", () => {
    describe("when have all props", () => {
      it("should return the correct payload", () => {
        expect(getAllCompetitionsLinkClickEvent("all competitions", "sport", "quicklinks", "href.com", 1)).toEqual({
          action: "navigated to",
          category: "navigation",
          cd3: "sport - quicklinks",
          cd34: "href.com",
          cd42: null,
          cd43: null,
          cd67: 1,
          event: "ga_event",
          label: "all competitions",
        });
      });
    });

    describe("when have not got all props", () => {
      it("should return the correct payload", () => {
        expect(getAllCompetitionsLinkClickEvent("all competitions", "sport", "quicklinks", "href.com", null)).toEqual({
          action: "navigated to",
          category: "navigation",
          cd3: "sport - quicklinks",
          cd34: "href.com",
          cd42: null,
          cd43: null,
          cd67: null,
          event: "ga_event",
          label: "all competitions",
        });
      });
    });
  });

  describe("getNavigateToGameCategoryEvent", () => {
    describe("when clicking in a GAMING_LINK_CARD", () => {
      describe("when have all props", () => {
        it("should return the correct object", () => {
          expect(getNavigateToGameCategoryEvent("category name", "live table games", "href.com", 2, 1)).toEqual({
            action: "navigated to",
            category: "navigation",
            cd3: "category name",
            cd34: "href.com",
            cd67: null,
            cd42: 1,
            cd43: 1,
            cd103: 2,
            event: "ga_event",
            label: "live table games",
          });
        });
      });

      describe("when have not got all props", () => {
        it("should return the correct object", () => {
          expect(getNavigateToGameCategoryEvent("category name", "live table games", "href.com", null, 1)).toEqual({
            action: "navigated to",
            category: "navigation",
            cd3: "category name",
            cd34: "href.com",
            cd67: null,
            cd42: 1,
            cd43: 1,
            cd103: null,
            event: "ga_event",
            label: "live table games",
          });
        });
      });
    });
  });

  describe("getNavigateToGameInfoEvent", () => {
    describe("when clicking on a game info button", () => {
      describe("when have all props", () => {
        it("should return the correct object", () => {
          expect(
            getNavigateToGameInfoEvent(
              "Gaming Swimlane",
              "Rainbow Riches",
              "href.com",
              "Provider",
              "rainbow-riches",
              3,
              2,
              1,
            ),
          ).toEqual({
            event: "ga_event",
            action: "navigated to",
            category: "navigation",
            label: "Rainbow Riches game info",
            cd3: "Gaming Swimlane",
            cd13: "rainbow-riches",
            cd12: "Rainbow Riches",
            cd74: "Provider",
            cd143: undefined,
            cd67: 4,
            cd34: "href.com",
            cd103: 2,
            cd42: 1,
            cd43: 1,
          });
        });
      });

      describe("when have not got all props", () => {
        it("should return the correct object", () => {
          expect(getNavigateToGameInfoEvent()).toEqual({
            event: "ga_event",
            action: "navigated to",
            category: "navigation",
            label: " game info",
            cd3: "",
            cd13: "",
            cd12: "",
            cd74: "",
            cd143: undefined,
            cd67: undefined,
            cd34: "",
            cd103: undefined,
            cd42: undefined,
            cd43: undefined,
          });
        });
      });
    });
  });

  describe("getSeeAllLinkClickEvent", () => {
    describe("when clicking in a See all button displayed on Curated Games zone", () => {
      describe("when have got all props", () => {
        it("should return the correct object", () => {
          expect(getSeeAllLinkClickEvent("See all Slot Games", "Slot Games", "casino/category/slots", 2)).toEqual({
            action: "navigated to",
            category: "navigation",
            cd3: "Slot Games",
            cd34: "casino/category/slots",
            event: "ga_event",
            label: "See all Slot Games",
            cd103: 2,
          });
        });
      });

      describe("when have not got all props", () => {
        it("should return the correct object", () => {
          expect(getSeeAllLinkClickEvent(undefined, undefined, "href", null)).toEqual({
            action: "navigated to",
            category: "navigation",
            cd3: "",
            cd34: "href",
            event: "ga_event",
            label: "",
            cd103: null,
          });
        });
      });
    });
  });

  describe("getCategoryFromMultifunctionalClickEvent", () => {
    describe("when clicking in a category card from multifunctional", () => {
      it("should return the correct object", () => {
        expect(
          getCategoryFromMultifunctionalClickEvent(
            "casino/c/gaming-new/gamingCategory:gaming-new",
            "fakeTitle",
            "fakeCategoryName",
          ),
        ).toEqual({
          event: "ga_event",
          category: "navigation",
          action: "navigated to",
          label: "fakeCategoryName",
          cd3: "fakeTitle",
          cd34: "casino/c/gaming-new/gamingCategory:gaming-new",
          cd67: undefined,
          cd12: undefined,
          cd13: undefined,
        });
      });
    });
  });
});

describe("getBottomBarClickEvent", () => {
  describe("when have got all props", () => {
    it("should return the correct payload", () => {
      expect(getBottomBarClickEvent("event", "home", "url")).toEqual({
        action: "navigated to",
        category: "navigation",
        cd3: "event - bottom ribbon",
        cd34: "url",
        event: "ga_event",
        label: "home",
      });
    });
  });

  describe("when have not got all props", () => {
    it("should return the correct payload", () => {
      expect(getBottomBarClickEvent(null, "home", "url")).toEqual({
        action: "navigated to",
        category: "navigation",
        cd3: " - bottom ribbon",
        cd34: "url",
        event: "ga_event",
        label: "home",
      });
    });
  });
});

describe("getRaceViewLinksLinkClickEvent", () => {
  describe("when clicking in a race time selector option", () => {
    describe("when have got all props", () => {
      it("should return the correct object", () => {
        expect(getRaceViewLinksLinkClickEvent("race", "href.com", 1, 2, "race time selector")).toEqual({
          action: "navigated to",
          category: "navigation",
          cd3: "race - race time selector",
          cd34: "href.com",
          cd42: 2,
          cd43: 2,
          cd67: 1,
          event: "ga_event",
          label: "race time selector",
        });
      });
    });

    describe("when have not got all props", () => {
      it("should return the correct object", () => {
        expect(getRaceViewLinksLinkClickEvent("race", "href.com", undefined, undefined, "race time selector")).toEqual({
          action: "navigated to",
          category: "navigation",
          cd3: "race - race time selector",
          cd34: "href.com",
          cd42: null,
          cd43: null,
          cd67: undefined,
          event: "ga_event",
          label: "race time selector",
        });
      });
    });
  });
});

describe("getBackButtonClickEvent", () => {
  it("should return the correct event payload", () => {
    expect(getBackButtonClickEvent("destinationURL")).toEqual({
      event: "ga_event",
      action: "navigated to",
      category: "navigation",
      label: "back",
      cd3: "header",
      cd34: "destinationURL",
      cd42: null,
      cd43: null,
      cd67: null,
    });
  });
});

describe("getViewAllTapEvent", () => {
  describe("when have got all props", () => {
    it("should return the correct event payload", () => {
      expect(getViewAllTapEvent("label", "title", "url", "viewType", 2, 1)).toEqual({
        action: "navigated to",
        category: "navigation",
        cd3: "viewType - title",
        cd34: "url",
        event: "ga_event",
        label: "label",
        cd67: 2,
        cd42: 1,
        cd43: null,
      });
    });
  });

  describe("when have not got all props", () => {
    it("should return the correct event payload", () => {
      expect(getViewAllTapEvent("label", "title", "url", "viewType", undefined, undefined)).toEqual({
        action: "navigated to",
        category: "navigation",
        cd3: "viewType - title",
        cd34: "url",
        event: "ga_event",
        label: "label",
        cd67: null,
        cd42: null,
        cd43: null,
      });
    });
  });
});

describe("getViewFromFavouritesClickEvent", () => {
  describe("when have got all props", () => {
    it("should return the correct object", () => {
      expect(getViewFromFavouritesClickEvent("football", "generic", "href.com", 1, 1)).toEqual({
        action: "navigated to",
        category: "navigation",
        cd3: "generic - favourites",
        cd34: "href.com",
        cd42: 1,
        cd43: 1,
        cd67: 1,
        event: "ga_event",
        label: "football",
      });
    });
  });

  describe("when have not got all props", () => {
    it("should return the correct object", () => {
      expect(getViewFromFavouritesClickEvent(undefined, "generic", "href.com", undefined, null)).toEqual({
        action: "navigated to",
        category: "navigation",
        cd3: "generic - favourites",
        cd34: "href.com",
        cd42: null,
        cd43: null,
        cd67: null,
        event: "ga_event",
        label: "",
      });
    });
  });
});

describe("getAcceptPromotionEvent", () => {
  it("should return the correct object", () => {
    expect(getAcceptPromotionEvent("fakeUrn", "accept", "fakeName", "fakePromoStatus", "fakeUserStatus")).toEqual({
      action: "clicked to opt in",
      category: "promotions",
      cd3: "promo hub - promo details",
      cd34: null,
      cd67: null,
      cd81: "fakeUrn",
      cd87: "fakeName",
      cd88: "fakePromoStatus",
      cd93: "fakeUserStatus",
      event: "ga_event",
      label: "accept",
    });
  });
});

describe("getCancelPromotionEvent", () => {
  it("should return the correct object", () => {
    expect(getCancelPromotionEvent("fakeUrn", "cancel", "fakeName", "fakePromoStatus", "fakeUserStatus")).toEqual({
      action: "clicked",
      category: "promotions",
      cd3: "promo hub - promo details",
      cd34: null,
      cd67: null,
      cd81: "fakeUrn",
      cd87: "fakeName",
      cd88: "fakePromoStatus",
      cd93: "fakeUserStatus",
      event: "ga_event",
      label: "cancel",
    });
  });
});

describe("getNavigationSeeAllPromotionsEvent", () => {
  it("should return the correct object", () => {
    expect(getNavigationSeeAllPromotionsEvent("fakeUrl", "see all promotions")).toEqual({
      action: "navigated to",
      category: "navigation",
      cd3: "promo hub - promo details",
      cd34: "fakeUrl",
      cd67: null,
      cd42: null,
      cd43: null,
      event: "ga_event",
      label: "see all promotions",
    });
  });
});

describe("getNavigateToEvent", () => {
  it("should return the correct object", () => {
    expect(getNavigateToEvent("label", "moduleName", "fakeUrl")).toEqual({
      event: "ga_event",
      category: "navigation",
      action: "navigated to",
      label: "label",
      cd3: "moduleName",
      cd34: "fakeUrl",
    });
  });
});
describe("getLoadedNotFoundView", () => {
  it("should return the correct object", () => {
    expect(getLoadedNotFoundView("label")).toEqual({
      event: "ga_event",
      category: "error messages",
      action: "404",
      label: "label",
      cd3: "error",
      cd34: null,
      cd67: null,
      cd42: null,
      cd43: null,
    });
  });
});
describe("getNavigateFromNotFoundView", () => {
  it("should return the correct object", () => {
    expect(getNavigateFromNotFoundView("label", "fakeUrl")).toEqual({
      event: "ga_event",
      category: "navigation",
      action: "navigated to",
      label: "label",
      cd3: "404 page - quicklink",
      cd34: "fakeUrl",
      cd67: 1,
      cd42: null,
      cd43: null,
    });
  });
});

describe("getCouponViewCardClickEvent", () => {
  it("should return the correct object", () => {
    expect(getCouponViewCardClickEvent("label", "pageType", "href", "groupTitle", "tabTitle")).toEqual({
      event: "ga_event",
      category: "navigation",
      action: "navigated to",
      label: "label",
      cd3: "pageType - coupon - groupTitle - label - tabTitle",
      cd34: "href",
      cd67: null,
      cd42: null,
      cd43: null,
    });
  });
});

describe("getBetslipSbkMaxPayoutNotificationUrlClickEvent", () => {
  it("should return the correct gtm data", () => {
    const result = getBetslipSbkMaxPayoutNotificationUrlClickEvent("http://betfair.com");

    expect(result).toEqual({
      event: "ga_event",
      action: "navigated to",
      category: "navigation",
      cd42: null,
      cd43: null,
      cd3: "betslip",
      cd34: "http://betfair.com",
      cd67: null,
      label: "I18N.BETSLIP.VALIDATION_SEE_TC_FOR_MORE_INFO",
    });
  });
});

describe("getBetslipBetBuilderNavigateToEvent", () => {
  it("should return the correct gtm data", () => {
    const result = getBetslipBetBuilderNavigateToEvent(
      "benfica v porto",
      "event - primary swimlane - match odds - acca builder",
      "http://betfair.com",
    );

    expect(result).toEqual({
      event: "ga_event",
      action: "navigated to",
      category: "navigation",
      cd133: null,
      cd134: null,
      cd135: null,
      cd3: "event - primary swimlane - match odds - acca builder",
      cd34: "http://betfair.com",
      cd67: null,
      label: "benfica v porto",
    });
  });
});

describe("getNavigateToMobileWebEvent", () => {
  it("should return the correct gtm data", () => {
    const result = getNavigateToMobileWebEvent("mobile web", "http://betfair.com");

    expect(result).toEqual({
      event: "ga_event",
      action: "navigated to",
      category: "navigation",
      cd3: "product link",
      cd34: "http://betfair.com",
      label: "mobile web",
    });
  });
});

describe("getMarketBlurbFAQEvent", () => {
  it("should return the correct payload", () => {
    expect(getMarketBlurbFAQEvent("pageType", "tab", "marketName", "url")).toEqual({
      event: "ga_event",
      category: TaggingCategory.NAVIGATION,
      action: TaggingAction.NAVIGATED_TO,
      label: "faqs",
      cd3: "pageType - tab - marketName",
      cd34: "url",
    });
  });
});
