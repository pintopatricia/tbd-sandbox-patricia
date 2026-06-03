import { buildNavigationEvent } from "tagging-library";
import { IMS_PROMOTION_MODULE_NAME } from "../../state";
import { getSportEventByURN } from "../../state/entities/sport-events/sport-event-selectors";
import { getSportsbookMarketByURN } from "../../state/entities/sportsbook-markets/sportsbook-market-selectors";
import { TaggingAction } from "../tagging-resolvers/AnalyticsConstants";
import {
  getAllCompetitionsLinkClickEvent,
  getAllMarketsLinkClickEvent,
  getBetslipBetBuilderNavigateToEvent,
  getBetslipSbkMaxPayoutNotificationUrlClickEvent,
  getBottomBarClickEvent,
  getBottomBarPushEvent,
  getCompetitionLinkClickEvent,
  getCouponViewCardClickEvent,
  getLinkClickEvent,
  getLogoClickEvent,
  getMarketBlurbFAQEvent,
  getMarketRulesLinkClickEvent,
  getMoreInfoPlayNewClickEvent,
  getMyAccountMenuLinkEvent,
  getMyAccountQuickLinkEvent,
  getNavigateFromNotFoundView,
  getNavigateToEvent,
  getNavigateToEventFromSportEvent,
  getNavigateToGameCategoryEvent,
  getNavigateToGameInfoEvent,
  getNavigateToMarketViewEvent,
  getNavigateToSwitcherOptionClickEvent,
  getNavigateToView,
  getNavigationSeeAllPromotionsEvent,
  getPlayNowPlayNewClickEvent,
  getPopularBetBuildNavigateToEventBetBuild,
  getQuickLinkClickEvent,
  getRaceViewLinksLinkClickEvent,
  getSearchAzLinkClickEvent,
  getSeeAllLinkClickEvent,
  getViewAllTapEvent,
  getViewFromFavouritesClickEvent,
  getGenerosityWalletHelpClickEvent,
  getMarketBlurbLinkClickEvent,
  getGenerosityPageNavigation,
  getObbCreatedBetsLinkClickEvent,
  getSettlementLinkNavigation,
  getNavigateToEventFromPlayerPage,
} from "./navigation";
import { getGamingSearchGamePositionByURN } from "../../state/layout/gaming-search/gaming-search-selectors";

jest.mock("tagging-library", () => ({
  buildNavigationEvent: jest.fn().mockReturnValue("navigation event"),
}));

const metadataMock = {
  pebbleCardGroup: "pebbleCardGroup",
  cardGroupTitle: "swimlaneCardGroup",
  tabName: "tab",
  horizontalPosition: 1,
  verticalPosition: 2,
  viewZoneTitle: "Curated Games",
  title: "metaTitle",
};

jest.mock("../../state/layout-snapshot", () => ({
  getLayoutMetadata: jest.fn(() => metadataMock),
}));

jest.mock("./helpers", () => ({
  getModuleData: jest.fn(() => "module"),
}));

jest.doMock("../../state/layout/layout-selectors", () => ({
  createCardParentTitlesByURNSelector: jest.fn(() =>
    jest.fn().mockReturnValue({
      groupTitle: "groupTitle",
      tabTitle: "tabTitle",
      groupUrn: "ppb:group:card:urn",
    }),
  ),
  createViewTypeSelector: jest.fn(() => jest.fn()),
}));

jest.mock("../../state/entities/sport-events/sport-event-selectors", () => ({
  getSportEventByURN: jest.fn(() => ({
    name: "event name mock",
  })),
}));

jest.mock("../../state/layout/cardgroups/filtered-coupon-cardgroups/filtered-coupon-cardgroups-selectors", () => ({
  createGetCouponCardGroupParentTitlesSelector: jest.fn(() =>
    jest.fn().mockReturnValue({
      viewType: "VIEW_TYPE",
      groupTitle: "filteredCouponTitle",
      tabTitle: "tabTitle",
    }),
  ),
}));

jest.mock("../../state/entities/games/game-selectors", () => ({
  getGameByURN: jest.fn(() => ({
    name: "gameName",
    provider: {
      name: "gameProvider",
    },
    label: "Ted",
    launchId: "gameId",
  })),
}));

jest.mock("../../helpers/tagging", () => ({
  getProductLabelByProductType: jest.fn(() => "exchange"),
}));

jest.mock("../../state/layout/views/event-view/event-view-selectors", () => ({
  getViewbyURN: jest.fn(() => ({ typename: "typename" })),
}));

jest.mock("../../state/entities/sportsbook-markets/sportsbook-market-selectors", () => ({
  getSportsbookMarketByURN: jest.fn(() => undefined),
}));

jest.mock("../../helpers/markets", () => ({
  isCompetitionEventHierarchy: jest.fn(() => true),
  isEventHierarchy: jest.fn(() => false),
}));

jest.mock("../../state/layout/cards/cards-selectors", () => ({
  createCardByURNSelector: jest.fn(() => jest.fn(() => ({ title: "cardTitle" }))),
}));

const mockState = {
  entities: {
    games: {},
  },
  layouts: {
    gamingSearch: {},
    views: {},
  },
  router: { currentUrn: "ppb:tbd:view:generic:home" },
};

const mockResults = {
  results: ["game1", "game2"],
  inputSearchTerm: "game",
  gamesRetrieved: true,
};

const mockNoResults = {
  results: [],
  inputSearchTerm: "game",
  gamesRetrieved: true,
};

const getGamingSearchInterface = jest.fn();

jest.mock("../../state/layout/gaming-search/gaming-search-selectors", () => ({
  createGamingSearchInterfaceSelector: jest.fn(() => getGamingSearchInterface),
  getGamingSearchGamePositionByURN: jest.fn(),
}));

describe("navigation GA4 events", () => {
  afterEach(jest.clearAllMocks);

  describe("getLinkClickEvent", () => {
    it("should call buildNavigationEvent with the correct event payload", () => {
      const action = {
        payload: {
          text: "test label",
          url: "destination URL",
          module: "footer",
        },
      };

      const result = getLinkClickEvent(action, {});

      expect(buildNavigationEvent).toHaveBeenCalledWith({
        elementText: "test label",
        action: TaggingAction.NAVIGATED_TO,
        module: "footer",
        destinationUrl: "destination URL",
        position: "null",
        moduleDisplayOrder: "null",
      });
      expect(result).toBe("navigation event");
    });
  });

  describe("getCompetitionLinkClickEvent", () => {
    it("should call buildNavigationEvent with the correct payload", () => {
      const action = {
        payload: {
          cardUrn: "cardUrn",
          cardType: "cardType",
          href: "href.com",
          text: "text",
          parents: "parents",
        },
      };

      const result = getCompetitionLinkClickEvent(action, {
        layouts: {
          cardgroups: {
            swimlanecardgroups: {
              primaryswimlanecardgroup: {
                title: "groupTitle",
                items: [{ urn: "cardUrn" }],
              },
            },
            halftimespecialsswimlanecardgroups: {},
            pebblecardgroups: {},
            racingswimlanecardgroups: {},
            popularswimlanecardgroups: {},
          },
          navigationtabs: {
            cardUrn: {
              typename: "NavigationTab",
              urn: "tabUrn",
              title: {
                translated: "tabTitle",
              },
              items: [{ urn: "cardUrn" }],
            },
          },
          views: {},
        },
        router: { currentUrn: "ppb:tbd:view:generic:home" },
      });

      expect(buildNavigationEvent).toHaveBeenCalledWith({
        elementText: "text",
        action: TaggingAction.NAVIGATED_TO,
        module: "home - cardType - groupTitle - text - tabTitle",
        destinationUrl: "href.com",
        position: "2",
        moduleDisplayOrder: "1",
      });
      expect(result).toBe("navigation event");
    });
  });

  describe("getNavigateToGameCategoryEvent", () => {
    it("should call buildNavigationEvent with the correct payload", () => {
      const action = {
        payload: {
          module: "module",
          href: "href.com",
          categoryName: "categoryName",
          cardUrn: "cardUrn",
          parents: "parents",
        },
      };

      const result = getNavigateToGameCategoryEvent(action, {});

      expect(buildNavigationEvent).toHaveBeenCalledWith({
        elementText: "categoryName",
        module: "module",
        action: TaggingAction.NAVIGATED_TO,
        position: "",
        moduleDisplayOrder: "2",
        destinationUrl: "href.com",
      });
      expect(result).toBe("navigation event");
    });
  });

  describe("getNavigateToGameInfoEvent", () => {
    it("should call buildNavigationEvent with the correct payload", () => {
      const action = {
        payload: {
          href: "href.com",
          gameUrn: "gameUrn",
          cardUrn: "cardUrn",
          segmentedCardGroupUrn: "segmentedCardGroupUrn",
          parents: "parents",
        },
      };

      getGamingSearchInterface.mockReturnValue(mockNoResults);
      getGamingSearchGamePositionByURN.mockReturnValue(1);
      const result = getNavigateToGameInfoEvent(action, mockState);

      expect(buildNavigationEvent).toHaveBeenCalledWith({
        elementText: "gameName game info",
        module: "Curated Games",
        action: TaggingAction.NAVIGATED_TO,
        gameName: "gameName",
        gameId: "gameId",
        gameProvider: "gameProvider",
        gameFilter: undefined,
        position: "2",
        moduleDisplayOrder: "2",
        destinationUrl: "href.com",
      });
      expect(result).toBe("navigation event");
    });

    it("should call buildNavigationEvent with the correct payload when it is made from games search", () => {
      const action = {
        payload: {
          href: "href.com",
          gameUrn: "gameUrn",
          cardUrn: "cardUrn",
          segmentedCardGroupUrn: "segmentedCardGroupUrn",
          parents: "parents",
        },
      };

      getGamingSearchInterface.mockReturnValue(mockResults);
      getGamingSearchGamePositionByURN.mockReturnValue(1);
      const result = getNavigateToGameInfoEvent(action, mockState);

      expect(buildNavigationEvent).toHaveBeenCalledWith({
        elementText: "gameName game info",
        module: "games search",
        action: TaggingAction.NAVIGATED_TO,
        gameName: "gameName",
        gameId: "gameId",
        gameProvider: "gameProvider",
        gameFilter: "2 results for game",
        position: "2",
        moduleDisplayOrder: "2",
        destinationUrl: "href.com",
      });
      expect(result).toBe("navigation event");
    });
  });

  describe("getMoreInfoPlayNewClickEvent", () => {
    it("should call buildNavigationEvent with the correct payload", () => {
      const action = {
        payload: {
          viewLink: "viewLink",
          urn: "urn",
          isStaticPromo: true,
          parents: "parents",
        },
      };

      const result = getMoreInfoPlayNewClickEvent(action, {});

      expect(buildNavigationEvent).toHaveBeenCalledWith({
        elementText: "terms & conditions - hype building state",
        action: TaggingAction.NAVIGATED_TO,
        module: "spin until you win",
        position: "",
        moduleDisplayOrder: "2",
        destinationUrl: "viewLink",
      });
      expect(result).toBe("navigation event");
    });
  });

  describe("getPlayNowPlayNewClickEvent", () => {
    it("should call buildNavigationEvent with the correct payload", () => {
      const action = {
        payload: {
          viewLink: "viewLink",
          urn: "urn",
          parents: "parents",
        },
      };

      const result = getPlayNowPlayNewClickEvent(action, {});

      expect(buildNavigationEvent).toHaveBeenCalledWith({
        elementText: "play now - active state",
        module: "spin until you win",
        action: TaggingAction.NAVIGATED_TO,
        position: "",
        moduleDisplayOrder: "2",
        destinationUrl: "viewLink",
      });
      expect(result).toBe("navigation event");
    });
  });

  describe("getBetslipSbkMaxPayoutNotificationUrlClickEvent", () => {
    it("should call buildNavigationEvent with the correct payload", () => {
      const action = {
        payload: {
          url: "url",
        },
      };

      const result = getBetslipSbkMaxPayoutNotificationUrlClickEvent(action, {});

      expect(buildNavigationEvent).toHaveBeenCalledWith({
        elementText: "I18N.BETSLIP.VALIDATION_SEE_TC_FOR_MORE_INFO",
        action: TaggingAction.NAVIGATED_TO,
        module: "betslip",
        destinationUrl: "url",
        position: "null",
        moduleDisplayOrder: "null",
      });
      expect(result).toBe("navigation event");
    });
  });

  describe("getNavigationSeeAllPromotionsEvent", () => {
    it("should return the correct event payload when channel is exchange", () => {
      const action = {
        payload: {
          viewUrl: "destination url mock",
        },
      };

      const result = getNavigationSeeAllPromotionsEvent(action, {});

      expect(buildNavigationEvent).toHaveBeenCalledWith({
        elementText: "see all our promotions",
        action: TaggingAction.NAVIGATED_TO,
        module: IMS_PROMOTION_MODULE_NAME,
        destinationUrl: "destination url mock",
        position: "null",
        moduleDisplayOrder: "null",
      });

      expect(result).toBe("navigation event");
    });
  });

  describe("getMarketRulesLinkClickEvent", () => {
    it("should call buildNavigationEvent with the correct payload", () => {
      const action = {
        payload: {
          text: "text",
          url: "url",
        },
      };

      const result = getMarketRulesLinkClickEvent(action, {});

      expect(buildNavigationEvent).toHaveBeenCalledWith({
        elementText: "text",
        action: TaggingAction.NAVIGATED_TO,
        module: "market rules",
        destinationUrl: "url",
        position: "null",
        moduleDisplayOrder: "null",
      });
      expect(result).toBe("navigation event");
    });
  });

  describe("getAllMarketsLinkClickEvent", () => {
    it("should call buildNavigationEvent with the correct payload", () => {
      const action = {
        payload: {
          destinationUrl: "destinationUrl",
        },
      };

      const result = getAllMarketsLinkClickEvent(action, {});

      expect(buildNavigationEvent).toHaveBeenCalledWith({
        elementText: "view all markets",
        action: TaggingAction.NAVIGATED_TO,
        module: "event - all markets quicklink",
        destinationUrl: "destinationUrl",
        position: "null",
        moduleDisplayOrder: "null",
      });
      expect(result).toBe("navigation event");
    });
  });

  describe("getAllCompetitionsLinkClickEvent", () => {
    it("should call buildNavigationEvent with the correct payload", () => {
      const action = {
        payload: {
          href: "href",
          text: "text",
        },
      };

      const result = getAllCompetitionsLinkClickEvent(action, {
        layouts: { views: {} },
        router: { currentUrn: "ppb:tbd:view:generic:home" },
      });

      expect(buildNavigationEvent).toHaveBeenCalledWith({
        elementText: "text",
        action: TaggingAction.NAVIGATED_TO,
        module: "home - quicklink",
        destinationUrl: "href",
        position: "null",
        moduleDisplayOrder: "2",
      });
      expect(result).toBe("navigation event");
    });
  });

  describe("getNavigateToEvent", () => {
    it("should return the correct event payload when channel is exchange", () => {
      const action = {
        payload: {
          gtmData: {
            label: "label mock",
            moduleName: "module mock",
          },
          viewUrl: "destination url mock",
        },
      };

      const result = getNavigateToEvent(action, {});

      expect(buildNavigationEvent).toHaveBeenCalledWith({
        elementText: "label mock",
        action: TaggingAction.NAVIGATED_TO,
        module: "module mock",
        destinationUrl: "destination url mock",
        position: "null",
        moduleDisplayOrder: "null",
      });

      expect(result).toBe("navigation event");
    });

    describe("when gtmData is not defined", () => {
      it("should return null", () => {
        const action = {
          payload: {
            viewUrl: "destination url mock",
          },
        };

        const result = getNavigateToEvent(action, {});

        expect(buildNavigationEvent).not.toHaveBeenCalled();

        expect(result).toBe(null);
      });
    });
  });

  describe("getNavigateToEventFromSportEvent", () => {
    const action = {
      payload: {
        href: "href",
        sportEventURN: "sportevent:urn",
        type: "primary swimlane",
      },
    };
    const state = {
      layouts: {},
      entities: {
        sportevents: [],
      },
      router: { currentUrn: "ppb:tbd:view:generic:home" },
    };

    describe("when sportEvent is not defined", () => {
      it("should not call buildNavigationEvent and should return null", () => {
        getSportEventByURN.mockReturnValueOnce(undefined);

        const result = getNavigateToEventFromSportEvent(action, state);

        expect(getSportEventByURN).toHaveBeenCalledWith(state.entities.sportevents, action.payload.sportEventURN);

        expect(buildNavigationEvent).not.toHaveBeenCalled();
        expect(result).toBe(null);
      });
    });

    describe("when sportEvent is defined", () => {
      it("should call buildNavigationEvent with the correct payload", () => {
        const result = getNavigateToEventFromSportEvent(action, state);

        expect(getSportEventByURN).toHaveBeenCalledWith(state.entities.sportevents, action.payload.sportEventURN);

        expect(buildNavigationEvent).toHaveBeenCalledTimes(1);
        expect(buildNavigationEvent).toHaveBeenCalledWith({
          action: TaggingAction.NAVIGATED_TO,
          elementText: "event name mock",
          module: `home - ${action.payload.type} - swimlaneCardGroup - event name mock - tab`,
          destinationUrl: action.payload.href,
          position: "1",
          moduleDisplayOrder: "2",
        });
        expect(result).toBe("navigation event");
      });
    });
  });

  describe("getBottomBarClickEvent", () => {
    it("should call buildNavigationEvent with the correct payload", () => {
      const action = {
        payload: {
          path: "path",
          tile: "tile",
        },
      };
      const state = {
        router: { currentUrn: "currentUrn" },
        layouts: { views: {} },
      };

      const result = getBottomBarClickEvent(action, state);

      expect(buildNavigationEvent).toHaveBeenCalledWith({
        elementText: "tile",
        action: TaggingAction.NAVIGATED_TO,
        module: "typename - bottom ribbon",
        destinationUrl: "path",
        position: "null",
        moduleDisplayOrder: "null",
      });
      expect(result).toBe("navigation event");
    });
  });

  describe("getSeeAllLinkClickEvent", () => {
    it("should call buildNavigationEvent with the correct payload", () => {
      const action = {
        payload: {
          href: "href",
          label: "label",
          zoneTitle: "zoneTitle",
        },
      };

      const result = getSeeAllLinkClickEvent(action, {});

      expect(buildNavigationEvent).toHaveBeenCalledWith({
        elementText: "label",
        action: TaggingAction.NAVIGATED_TO,
        module: "zoneTitle",
        destinationUrl: "href",
        position: "null",
        moduleDisplayOrder: "2",
      });
      expect(result).toBe("navigation event");
    });
  });

  describe("getMyAccountMenuLinkEvent", () => {
    it("should call buildNavigationEvent with the correct payload", () => {
      const action = {
        payload: {
          href: "href",
          menuText: "menuText",
        },
      };

      const result = getMyAccountMenuLinkEvent(action, {});

      expect(buildNavigationEvent).toHaveBeenCalledWith({
        elementText: "menuText",
        action: TaggingAction.NAVIGATED_TO,
        module: "my account",
        destinationUrl: "href",
        position: "null",
        moduleDisplayOrder: "null",
      });
      expect(result).toBe("navigation event");
    });
  });

  describe("getMyAccountQuickLinkEvent", () => {
    it("should call buildNavigationEvent with the correct payload", () => {
      const action = {
        payload: {
          href: "href",
          title: "title",
        },
      };

      const result = getMyAccountQuickLinkEvent(action, {});

      expect(buildNavigationEvent).toHaveBeenCalledWith({
        elementText: "title quicklink",
        action: TaggingAction.NAVIGATED_TO,
        module: "my account",
        destinationUrl: "href",
        position: "null",
        moduleDisplayOrder: "null",
      });
      expect(result).toBe("navigation event");
    });
  });

  describe("getSearchAzLinkClickEvent", () => {
    it("should call buildNavigationEvent with the correct payload if hamburger menu is closed", () => {
      const result = getSearchAzLinkClickEvent(
        { payload: { text: "text", url: "url" } },
        { hamburgerMenu: { isOpen: false } },
      );

      expect(buildNavigationEvent).toHaveBeenCalledWith({
        action: TaggingAction.NAVIGATED_TO,
        elementText: "text",
        module: "search menu",
        destinationUrl: "url",
        position: "null",
        moduleDisplayOrder: "null",
      });
      expect(result).toBe("navigation event");
    });

    it("should call buildNavigationEvent with the correct payload if hamburger menu is open", () => {
      const result = getSearchAzLinkClickEvent(
        { payload: { text: "text", url: "url" } },
        { hamburgerMenu: { isOpen: true } },
      );

      expect(buildNavigationEvent).toHaveBeenCalledWith({
        action: TaggingAction.NAVIGATED_TO,
        elementText: "text",
        module: "burger menu",
        destinationUrl: "url",
        position: "null",
        moduleDisplayOrder: "null",
      });
      expect(result).toBe("navigation event");
    });

    it("should call buildNavigationEvent with the correct payload if title is defined", () => {
      const result = getSearchAzLinkClickEvent(
        { payload: { text: "text", url: "url", title: "title" } },
        { hamburgerMenu: { isOpen: true } },
      );

      expect(buildNavigationEvent).toHaveBeenCalledWith({
        action: TaggingAction.NAVIGATED_TO,
        elementText: "title - text",
        module: "burger menu",
        destinationUrl: "url",
        position: "null",
        moduleDisplayOrder: "null",
      });
      expect(result).toBe("navigation event");
    });
  });

  describe("getLogoClickEvent", () => {
    it("should call buildNavigationEvent with the correct payload", () => {
      const result = getLogoClickEvent({ payload: { path: "path" } });

      expect(buildNavigationEvent).toHaveBeenCalledWith({
        action: TaggingAction.NAVIGATED_TO,
        elementText: "bf logo",
        module: "header",
        destinationUrl: "path",
        position: "null",
        moduleDisplayOrder: "null",
      });
      expect(result).toBe("navigation event");
    });
  });

  describe("getNavigateToMarketViewEvent", () => {
    describe("when the type provided is QuickLinksCard", () => {
      it("should call buildNavigationEvent with the correct payload", () => {
        const result = getNavigateToMarketViewEvent(
          {
            payload: { marketName: "marketName", cardType: "QuickLinksCard", href: "href" },
          },
          { layouts: "layouts", router: { currentUrn: "ppb:tbd:view:generic:home" } },
        );

        expect(buildNavigationEvent).toHaveBeenCalledWith({
          action: TaggingAction.NAVIGATED_TO,
          elementText: "marketName",
          module: "home - QuickLinksCard",
          destinationUrl: "href",
          moduleDisplayOrder: "2",
          position: "1",
        });
        expect(result).toBe("navigation event");
      });
    });

    describe("when the type provided is MarketCard", () => {
      it("should call buildNavigationEvent with the correct payload", () => {
        const result = getNavigateToMarketViewEvent(
          {
            payload: { marketName: "marketName", cardType: "MarketCard", href: "href" },
          },
          { layouts: "layouts", router: { currentUrn: "ppb:tbd:view:generic:home" } },
        );

        expect(buildNavigationEvent).toHaveBeenCalledWith({
          action: TaggingAction.NAVIGATED_TO,
          elementText: "marketName",
          module: "home - primary swimlane - swimlaneCardGroup - marketName - tab",
          destinationUrl: "href",
          moduleDisplayOrder: "2",
          position: "1",
        });
        expect(result).toBe("navigation event");
      });

      describe("and when the marketName is undefined", () => {
        it("should call buildNavigationEvent with the correct payload with default values", () => {
          const result = getNavigateToMarketViewEvent(
            {
              payload: { marketName: undefined, cardType: "MarketCard", href: "href" },
            },
            { layouts: "layouts", router: { currentUrn: "ppb:tbd:view:generic:home" } },
          );

          expect(buildNavigationEvent).toHaveBeenCalledWith({
            action: TaggingAction.NAVIGATED_TO,
            elementText: "",
            module: "home - primary swimlane - swimlaneCardGroup - null - tab",
            destinationUrl: "href",
            moduleDisplayOrder: "2",
            position: "1",
          });
          expect(result).toBe("navigation event");
        });
      });
    });

    describe("when the type provided is not QuickLinksCard nor MarketCard", () => {
      it("should call buildNavigationEvent with the correct payload", () => {
        const result = getNavigateToMarketViewEvent(
          {
            payload: { marketName: "marketName", cardType: "MarketViewLinkCard", href: "href" },
          },
          { layouts: "layouts", router: { currentUrn: "ppb:tbd:view:generic:home" } },
        );

        expect(buildNavigationEvent).toHaveBeenCalledWith({
          action: TaggingAction.NAVIGATED_TO,
          elementText: "marketName",
          module: "home - secondary swimlane - swimlaneCardGroup - marketName - tab",
          destinationUrl: "href",
          moduleDisplayOrder: "2",
          position: "1",
        });
        expect(result).toBe("navigation event");
      });

      describe("and when the marketName is undefined", () => {
        it("should call buildNavigationEvent with the correct payload with default values", () => {
          const result = getNavigateToMarketViewEvent(
            {
              payload: { marketName: undefined, cardType: "MarketViewLinkCard", href: "href" },
            },
            { layouts: "layouts", router: { currentUrn: "ppb:tbd:view:generic:home" } },
          );

          expect(buildNavigationEvent).toHaveBeenCalledWith({
            action: TaggingAction.NAVIGATED_TO,
            elementText: "",
            module: "home - secondary swimlane - swimlaneCardGroup - null - tab",
            destinationUrl: "href",
            moduleDisplayOrder: "2",
            position: "1",
          });
          expect(result).toBe("navigation event");
        });
      });
    });
  });

  describe("getNavigateToSwitcherOptionClickEvent", () => {
    it("should call buildNavigationEvent with the correct payload", () => {
      const result = getNavigateToSwitcherOptionClickEvent({
        payload: { url: "url", label: "label", pageType: "GenericSwitcherCard" },
      });

      expect(buildNavigationEvent).toHaveBeenCalledWith({
        action: TaggingAction.NAVIGATED_TO,
        elementText: "label",
        module: "generic - power nav",
        destinationUrl: "url",
        moduleDisplayOrder: "null",
        position: "null",
      });
      expect(result).toBe("navigation event");
    });
  });

  describe("getBottomBarPushEvent", () => {
    it("should return the correct event payload when channel is exchange", () => {
      const action = {
        payload: {
          gtmData: {
            label: "label mock",
            moduleName: "module mock",
          },
          viewUrl: "destination url mock",
        },
      };

      const result = getBottomBarPushEvent(action, mockState);

      expect(buildNavigationEvent).toHaveBeenCalledWith({
        elementText: "label mock",
        action: TaggingAction.NAVIGATED_TO,
        module: `home - bottom ribbon`,
        destinationUrl: "destination url mock",
        position: "null",
        moduleDisplayOrder: "null",
      });

      expect(result).toBe("navigation event");
    });
  });

  describe("getNavigateToView", () => {
    it("should call buildNavigationEvent with the correct payload", () => {
      const result = getNavigateToView(
        {
          payload: { label: "label", module: "module", url: "url" },
        },
        { layouts: "layouts", router: { currentUrn: "ppb:tbd:view:generic:home" } },
      );

      expect(buildNavigationEvent).toHaveBeenCalledWith({
        action: TaggingAction.NAVIGATED_TO,
        elementText: "label",
        module: "home - module - swimlaneCardGroup - label - tab",
        destinationUrl: "url",
        moduleDisplayOrder: "2",
        position: "1",
      });
      expect(result).toBe("navigation event");
    });
  });

  describe("getNavigateFromNotFoundView", () => {
    it("should return the correct event payload when channel is exchange", () => {
      const action = {
        payload: {
          label: "label mock",
          destinationUrl: "destination url mock",
        },
      };

      const result = getNavigateFromNotFoundView(action, {});

      expect(buildNavigationEvent).toHaveBeenCalledWith({
        elementText: "label mock",
        action: TaggingAction.NAVIGATED_TO,
        module: "404 page - quicklink",
        destinationUrl: "destination url mock",
        position: "1",
        moduleDisplayOrder: "null",
      });

      expect(result).toBe("navigation event");
    });
  });

  describe("getCouponViewCardClickEvent", () => {
    const action = {
      payload: {
        couponCardGroupUrn: "couponCard:URN",
        sporteventURN: "ppb:event:1",
        href: "destination url mock",
      },
    };

    const appState = {
      entities: {
        sportevents: {
          "ppb:event:1": {
            urn: "ppb:event:1",
            eventId: 1,
          },
        },
      },
    };

    describe("when sportevent is defined", () => {
      it("should return the correct event payload when channel is exchange", () => {
        const result = getCouponViewCardClickEvent(action, appState);

        expect(buildNavigationEvent).toHaveBeenCalledWith({
          elementText: "event name mock",
          action: TaggingAction.NAVIGATED_TO,
          module: "VIEW_TYPE - coupon - filteredCouponTitle - event name mock - tabTitle",
          destinationUrl: "destination url mock",
          position: "null",
          moduleDisplayOrder: "null",
        });

        expect(result).toBe("navigation event");
      });
    });

    describe("when sportevent is not defined", () => {
      it("should not call buildNavigationEvent and return null", () => {
        getSportEventByURN.mockReturnValue(undefined);
        const result = getCouponViewCardClickEvent(action, appState);

        expect(buildNavigationEvent).not.toHaveBeenCalled();

        expect(result).toBe(null);
      });
    });
  });

  describe("getMarketBlurbFAQEvent", () => {
    it("should return the correct event payload", () => {
      const action = {
        payload: {
          cardUrn: "card:urn",
          parents: ["parent mock 1"],
          filter: "market mock",
          href: "destination url mock",
        },
      };

      const result = getMarketBlurbFAQEvent(action, {
        layouts: { views: {} },
        router: { currentUrn: "ppb:tbd:view:generic:home" },
      });

      expect(buildNavigationEvent).toHaveBeenCalledWith({
        elementText: "faqs",
        action: TaggingAction.NAVIGATED_TO,
        module: "home - tab - market mock",
        destinationUrl: "destination url mock",
        position: "null",
        moduleDisplayOrder: "null",
      });
      expect(result).toBe("navigation event");
    });

    describe("when gaModuleSuffix is defined", () => {
      it("should return the correct event payload", () => {
        const action = {
          payload: {
            cardUrn: "card:urn",
            parents: ["parent mock 1"],
            filter: "market mock",
            href: "destination url mock",
            gaModuleSuffix: "safesub",
          },
        };

        const result = getMarketBlurbFAQEvent(action, {
          layouts: { views: {} },
          router: { currentUrn: "ppb:tbd:view:generic:home" },
        });

        expect(buildNavigationEvent).toHaveBeenCalledWith({
          elementText: "faqs",
          action: TaggingAction.NAVIGATED_TO,
          module: "home - tab - market mock safesub",
          destinationUrl: "destination url mock",
          position: "null",
          moduleDisplayOrder: "null",
        });
        expect(result).toBe("navigation event");
      });
    });
  });

  describe("getRaceViewLinksLinkClickEvent", () => {
    describe.each([
      [true, "resulted race time selector"],
      [false, "race time selector"],
    ])("when isRaceClosed is %s", (isRaceClosed, label) => {
      it("should call buildNavigationEvent with the correct payload", () => {
        const action = {
          payload: {
            href: "href",
            isRaceClosed,
          },
        };
        const result = getRaceViewLinksLinkClickEvent(action, {
          layouts: { views: {} },
          router: { currentUrn: "ppb:tbd:view:generic:home" },
        });

        expect(buildNavigationEvent).toHaveBeenCalledWith({
          action: TaggingAction.NAVIGATED_TO,
          elementText: label,
          module: `home - ${label}`,
          destinationUrl: "href",
          moduleDisplayOrder: "2",
          position: "1",
        });
        expect(result).toBe("navigation event");
      });
    });
  });

  describe("getViewAllTapEvent", () => {
    it("should call buildNavigationEvent with the correct payload", () => {
      const action = {
        payload: {
          title: "title",
          viewAllLink: {
            label: "label",
            viewLink: { viewUrl: "viewUrl" },
          },
        },
      };
      const result = getViewAllTapEvent(action, {
        layouts: { views: {} },
        router: { currentUrn: "ppb:tbd:view:generic:home" },
      });

      expect(buildNavigationEvent).toHaveBeenCalledWith({
        action: TaggingAction.NAVIGATED_TO,
        elementText: "label",
        module: "home - title",
        destinationUrl: "viewUrl",
        moduleDisplayOrder: "2",
        position: "1",
      });
      expect(result).toBe("navigation event");
    });
  });

  describe("getViewFromFavouritesClickEvent", () => {
    it("should call buildNavigationEvent with the correct payload", () => {
      const action = {
        payload: {
          href: "href",
          label: "label",
        },
      };
      const result = getViewFromFavouritesClickEvent(action, {
        layouts: { views: {} },
        router: { currentUrn: "ppb:tbd:view:generic:home" },
      });

      expect(buildNavigationEvent).toHaveBeenCalledWith({
        action: TaggingAction.NAVIGATED_TO,
        elementText: "label",
        module: "home - favourites",
        destinationUrl: "href",
        moduleDisplayOrder: "2",
        position: "1",
      });
      expect(result).toBe("navigation event");
    });
  });

  describe("getBetslipBetBuilderNavigateToEvent", () => {
    describe("when the market does not exist", () => {
      it("should return null", () => {
        getSportsbookMarketByURN.mockReturnValue(undefined);

        const result = getBetslipBetBuilderNavigateToEvent(
          { payload: { runnerUrn: "runnerUrn", urn: "urn", parents: "parents", url: "url" } },
          {
            entities: { sportevents: "sportevents", sportsbookmarkets: "sportsbookmarkets" },
            layouts: { views: {} },
            router: { currentUrn: "ppb:tbd:view:generic:home" },
          },
        );

        expect(buildNavigationEvent).not.toHaveBeenCalled();
        expect(result).toBe(null);
      });
    });

    describe("when the market exists", () => {
      describe("and is event competition hierarchy but has no event", () => {
        it("should return null", () => {
          getSportsbookMarketByURN.mockReturnValue({ hierarchy: "hierarchy" });
          getSportEventByURN.mockReturnValue(undefined);

          const result = getBetslipBetBuilderNavigateToEvent(
            { payload: { runnerUrn: "runnerUrn", urn: "urn", parents: "parents", url: "url" } },
            { entities: { sportevents: "sportevents", sportsbookmarkets: "sportsbookmarkets" } },
          );

          expect(buildNavigationEvent).not.toHaveBeenCalled();
          expect(result).toBe(null);
        });
      });

      describe("and is event competition hierarchy and has event name", () => {
        it("should call buildNavigationEvent with correct payload", () => {
          getSportsbookMarketByURN.mockReturnValue({ hierarchy: "hierarchy", name: "marketName" });
          getSportEventByURN.mockReturnValue({ name: "eventName" });

          const result = getBetslipBetBuilderNavigateToEvent(
            { payload: { runnerUrn: "runnerUrn", urn: "urn", parents: "parents", url: "url" } },
            {
              entities: { sportevents: "sportevents", sportsbookmarkets: "sportsbookmarkets" },
              layouts: {
                cards: {
                  popularmultiplesbetbuilders: [],
                },
              },
              router: { currentUrn: "ppb:tbd:view:generic:home" },
            },
          );

          expect(buildNavigationEvent).toHaveBeenCalledWith({
            action: TaggingAction.NAVIGATED_TO,
            elementText: "eventName",
            module: "home - primary swimlane - swimlaneCardGroup | cardTitle - marketName - tab",
            destinationUrl: "url",
            moduleDisplayOrder: "2",
            position: "1",
          });
          expect(result).toBe("navigation event");
        });
      });
    });
  });
  describe("getPopularBetBuildNavigateToEventBetBuild", () => {
    describe("when the market does not exist", () => {
      it("should return null", () => {
        getSportsbookMarketByURN.mockReturnValue(undefined);

        const result = getPopularBetBuildNavigateToEventBetBuild(
          { payload: { runnerUrn: "runnerUrn", urn: "urn", parents: "parents", url: "url" } },
          { entities: { sportevents: "sportevents", sportsbookmarkets: "sportsbookmarkets" } },
        );

        expect(buildNavigationEvent).not.toHaveBeenCalled();
        expect(result).toBe(null);
      });
    });

    describe("when the market exists", () => {
      describe("and is event competition hierarchy but has no event", () => {
        it("should return null", () => {
          getSportsbookMarketByURN.mockReturnValue({ hierarchy: "hierarchy" });
          getSportEventByURN.mockReturnValue(undefined);

          const result = getPopularBetBuildNavigateToEventBetBuild(
            { payload: { runnerUrn: "runnerUrn", urn: "urn", parents: "parents", url: "url" } },
            { entities: { sportevents: "sportevents", sportsbookmarkets: "sportsbookmarkets" } },
          );

          expect(buildNavigationEvent).not.toHaveBeenCalled();
          expect(result).toBe(null);
        });
      });

      describe("and is event competition hierarchy and has event name", () => {
        it("should call buildNavigationEvent with correct payload", () => {
          getSportsbookMarketByURN.mockReturnValue({ hierarchy: "hierarchy", name: "marketName" });
          getSportEventByURN.mockReturnValue({ name: "eventName" });

          const result = getPopularBetBuildNavigateToEventBetBuild(
            { payload: { runnerUrn: "runnerUrn", urn: "urn", parents: "parents", url: "url" } },
            {
              entities: { sportevents: "sportevents", sportsbookmarkets: "sportsbookmarkets" },
              layouts: {
                cards: {
                  popularmultiplesbetbuilders: [],
                },
              },
              router: { currentUrn: "ppb:tbd:view:generic:home" },
            },
          );

          expect(buildNavigationEvent).toHaveBeenCalledWith({
            action: TaggingAction.NAVIGATED_TO,
            elementText: "build your own",
            module: "home - primary swimlane - swimlaneCardGroup | null - marketName - tab",
            destinationUrl: "url",
            moduleDisplayOrder: "2",
            position: "1",
          });
          expect(result).toBe("navigation event");
        });
      });
    });
  });
  describe("getQuickLinkClickEvent", () => {
    describe("when cardUrn is a GenericViewLinkCard", () => {
      const action = {
        payload: {
          label: "label",
          url: "url",
          cardUrn: "ppb:tbd:card:genericViewLink:generic",
          parents: "parents",
        },
      };

      const state = {
        layouts: "layouts",
        hamburgerMenu: { isOpen: false },
        router: { currentUrn: "ppb:tbd:view:generic:home" },
      };
      const stateWithHamburgerMenuOpen = {
        layouts: "layouts",
        hamburgerMenu: { isOpen: true },
        router: { currentUrn: "ppb:tbd:view:generic:home" },
      };

      it("should call buildNavigationEvent with the correct module when hamburger menu is closed", () => {
        const result = getQuickLinkClickEvent(action, state);

        expect(buildNavigationEvent).toHaveBeenCalledWith({
          action: TaggingAction.NAVIGATED_TO,
          elementText: "label",
          module: "sport - popular - coupons",
          destinationUrl: "url",
          moduleDisplayOrder: "2",
          position: "null",
        });
        expect(result).toBe("navigation event");
      });

      it("should call buildNavigationEvent with the correct module when hamburger menu is open", () => {
        const result = getQuickLinkClickEvent(action, stateWithHamburgerMenuOpen);

        expect(buildNavigationEvent).toHaveBeenCalledWith({
          action: TaggingAction.NAVIGATED_TO,
          elementText: "label",
          module: "burger menu",
          destinationUrl: "url",
          moduleDisplayOrder: "2",
          position: "null",
        });
        expect(result).toBe("navigation event");
      });
    });

    describe("when cardUrn is not a GenericViewLinkCard", () => {
      const action = {
        payload: {
          label: "label",
          url: "url",
          cardUrn: "cardUrn",
          parents: "parents",
        },
      };
      const state = {
        layouts: "layouts",
        hamburgerMenu: { isOpen: false },
        router: { currentUrn: "ppb:tbd:view:generic:home" },
      };
      const stateWithHamburgerMenuOpen = {
        layouts: "layouts",
        hamburgerMenu: { isOpen: true },
        router: { currentUrn: "ppb:tbd:view:generic:home" },
      };

      it("should call buildNavigationEvent with the correct module when hamburger menu is closed", () => {
        const result = getQuickLinkClickEvent(action, state);

        expect(buildNavigationEvent).toHaveBeenCalledWith({
          action: TaggingAction.NAVIGATED_TO,
          elementText: "label",
          module: "home - quicklinks",
          destinationUrl: "url",
          moduleDisplayOrder: "2",
          position: "null",
        });
        expect(result).toBe("navigation event");
      });

      it("should call buildNavigationEvent with the correct module when hamburger menu is open", () => {
        const result = getQuickLinkClickEvent(action, stateWithHamburgerMenuOpen);

        expect(buildNavigationEvent).toHaveBeenCalledWith({
          action: TaggingAction.NAVIGATED_TO,
          elementText: "label",
          module: "burger menu",
          destinationUrl: "url",
          moduleDisplayOrder: "2",
          position: "null",
        });
        expect(result).toBe("navigation event");
      });
    });
  });

  describe("getGenerosityWalletHelpClickEvent", () => {
    describe("When isFromBetslip is true", () => {
      it("should call buildNavigationEvent with the correct payload", () => {
        const action = {
          payload: {
            destinationUrl: "mock_destinationUrl",
            currentPebble: "all",
            isFromBetslip: true,
          },
        };

        const result = getGenerosityWalletHelpClickEvent(action);

        expect(buildNavigationEvent).toHaveBeenCalledWith({
          action: TaggingAction.NAVIGATED_TO,
          destinationUrl: "mock_destinationUrl",
          elementText: "help",
          module: "betslip - generosity wallet - all",
          moduleDisplayOrder: "null",
          position: "null",
        });
        expect(result).toBe("navigation event");
      });
    });

    describe("When isFromBetslip is false", () => {
      it("should call buildNavigationEvent with the correct payload", () => {
        const action = {
          payload: {
            destinationUrl: "mock_destinationUrl",
            currentPebble: "all",
            isFromBetslip: false,
          },
        };

        const result = getGenerosityWalletHelpClickEvent(action);

        expect(buildNavigationEvent).toHaveBeenCalledWith({
          action: TaggingAction.NAVIGATED_TO,
          destinationUrl: "mock_destinationUrl",
          elementText: "help",
          module: "generosity wallet - all",
          moduleDisplayOrder: "null",
          position: "null",
        });
        expect(result).toBe("navigation event");
      });
    });
  });

  describe("MarketBlurbLinkClick", () => {
    it("should call buildNavigationEvent with the correct payload", () => {
      const result = getMarketBlurbLinkClickEvent({
        payload: { destinationUrl: "url", elementText: "text", variant: "info" },
      });

      expect(buildNavigationEvent).toHaveBeenCalledWith({
        action: TaggingAction.NAVIGATED_TO,
        destinationUrl: "url",
        elementText: "text",
        module: "market blurb - info",
        moduleDisplayOrder: "null",
        position: "null",
      });
      expect(result).toBe("navigation event");
    });
  });

  describe("getGenerosityPageNavigation", () => {
    it("should call buildNavigationEvent with the correct payload", () => {
      const payload = {
        destinationUrl: "url",
        currentPebble: "all",
      };

      const result = getGenerosityPageNavigation({ payload });

      expect(buildNavigationEvent).toHaveBeenCalledWith({
        action: TaggingAction.NAVIGATED_TO,
        destinationUrl: payload.destinationUrl,
        elementText: "my generosity page",
        module: `generosity wallet - ${payload.currentPebble}`,
        moduleDisplayOrder: "null",
        position: "null",
      });
      expect(result).toBe("navigation event");
    });
  });
  describe("getObbCreatedBetsLinkClickEvent", () => {
    it("should call buildNavigationEvent with the correct payload", () => {
      const payload = {
        urn: "urn",
        label: "label",
        viewUrl: "viewUrl",
        cardIndex: 1,
        event: "event",
      };
      const mockState = { layouts: { views: {} }, router: { currentUrn: "ppb:tbd:view:generic:home" } };

      const result = getObbCreatedBetsLinkClickEvent({ payload }, mockState);

      expect(buildNavigationEvent).toHaveBeenCalledWith({
        action: TaggingAction.NAVIGATED_TO,
        destinationUrl: "viewUrl",
        elementText: "label",
        eventContext: "event",
        module: "module",
        moduleDisplayOrder: "2",
        position: "2",
      });
      expect(result).toBe("navigation event");
    });
  });

  describe("SettlementLinkClick", () => {
    describe("when tab open is selected on my bets page", () => {
      it("should call buildNavigationEvent with the correct payload", () => {
        const result = getSettlementLinkNavigation({
          payload: { destinationUrl: "url", currentTab: "open" },
        });

        expect(buildNavigationEvent).toHaveBeenCalledWith({
          action: TaggingAction.NAVIGATED_TO,
          destinationUrl: "url",
          elementText: "need help",
          module: "my bets - open",
          moduleDisplayOrder: "null",
          position: "null",
        });
        expect(result).toBe("navigation event");
      });
    });

    describe("when tab settled is selected on m bets page", () => {
      it("should call buildNavigationEvent with the correct payload", () => {
        const result = getSettlementLinkNavigation({
          payload: { destinationUrl: "url", currentTab: "settled" },
        });

        expect(buildNavigationEvent).toHaveBeenCalledWith({
          action: TaggingAction.NAVIGATED_TO,
          destinationUrl: "url",
          elementText: "need help",
          module: "my bets - settled",
          moduleDisplayOrder: "null",
          position: "null",
        });
        expect(result).toBe("navigation event");
      });
    });
  });

  describe("getNavigateToEventFromPlayerPage", () => {
    const mockState = { layouts: { views: {} }, router: { currentView: "ppb:tbd:view:player" } };

    const mockAction = {
      type: "NAVIGATE_TO_EVENT_FROM_MARKET_SCOREBOARD",
      payload: {
        text: "Player Event",
        url: "https://example.com/player-event",
      },
    };

    it("should build a navigation event with the correct parameters", () => {
      getNavigateToEventFromPlayerPage(mockAction, mockState);

      expect(buildNavigationEvent).toHaveBeenCalledWith({
        action: TaggingAction.NAVIGATED_TO,
        elementText: "Player Event",
        module: "player - Player Event",
        destinationUrl: "https://example.com/player-event",
        position: "null",
        moduleDisplayOrder: "null",
      });
    });

    it("should return the result of buildNavigationEvent", () => {
      const mockNavigationEvent = { mockKey: "mockValue" };
      buildNavigationEvent.mockReturnValue(mockNavigationEvent);

      const result = getNavigateToEventFromPlayerPage(mockAction, mockState);

      expect(result).toBe(mockNavigationEvent);
    });
  });
});
