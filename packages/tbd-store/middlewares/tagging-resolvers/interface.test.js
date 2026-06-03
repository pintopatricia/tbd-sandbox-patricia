import { TaggingAction, TaggingCategory } from "./AnalyticsConstants";
import { Product } from "../../state/entities/user-preferences/UserPreferences.types";
import { APPLICATION, BUSINESS, DEVICE } from "./AnalyticsDimensions";
import { getSportsbookBettingState } from "../../state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { getSportsbookMarketById } from "../../state/entities/sportsbook-markets/sportsbook-market-selectors";
import { createCardByURNSelector } from "../../state/layout/cards/cards-selectors";

import {
  getBetslipAccaInsuranceToggleEvent,
  getBetslipMyOddsBoostToggleEvent,
  getBetslipAccordionHeaderClickEvent,
  getBetslipBonusActivationEvent,
  getBetslipCastBetChangeEvent,
  getBetslipCastBetOrderChangeEvent,
  getBetslipEachWayToggleEvent,
  getBetslipHeaderClickEvent,
  getBetslipSbkRemoveAllEvent,
  getBetslipSportsbookMultipleBetTypeClickEvent,
  getBetslipSbkReAddSelectionsEvent,
  getBetslipSbkNotificationShownEvent,
  getJackpotMerchandiseViewEvent,
  getLogoutClickEvent,
  getMarketDepthClickEvent,
  getMarketGraphSelectGraphEvent,
  getMarketGraphSelectViewEvent,
  getMarketRulesToggleModalEvent,
  getMarketSwitchEvent,
  getMyAccountMenuToggleEvent,
  getMyAccountToggleCashBalancesViewEvent,
  getNavigationTabClickEvent,
  getOpenBetslipEvent,
  getSearchBarFocusEvent,
  getSearchCancelClickEvent,
  getSearchClearClickEvent,
  getSearchTabClickEvent,
  getSwitcherEvent,
  getToggleExpandableCardGroupEvent,
  getToggleRunnerInfoEvent,
  getToggleRunnerInfoTabsEvent,
  getToggleTimeFormEvent,
  getFilterOpenEvent,
  getFilterCloseEvent,
  getFilterApplyEvent,
  getFilterResetClickEvent,
  getSawCardEvent,
  getContentSummaryCollapseEvent,
  getSwitchProductEvent,
  getToggleRecentRacesEvent,
  getToggleMarketGraphEvent,
  getToggleShowMoreEvent,
  getNextRacesRaceClickEvent,
  getStatisticsModalToggleEvent,
  getStatisticsItemClickEvent,
  getMarketSnackBarEvent,
  getAzSwitchToggleEvent,
  getNextRacesFilterClickEvent,
  getMyBetsOrderTypePressEvent,
  getPromoDescriptionToggleEvent,
  getToggleAccordionEvent,
  getCopyBetIdToClipboardEvent,
  getMarketBlurbExpandableEvent,
  getRaceReplaysToggleEvent,
  getMarketTemplatePebbleSelectionEvent,
  getMyBetsCancelAllEvent,
  getPNInteractionClickEvent,
  getClickEvent,
  getMaxPayoutAcceptMessageClickEvent,
  getLoyaltyPromotionBottomSheetOpenEvent,
  getLoyaltyPromotionBottomSheetCloseEvent,
  getMyBetsSbkAddPreviousSelectionsEvent,
  getMyBetsBetSharingPreviewOnTapEvent,
  getMyBetsBetSharingDismissOnTapEvent,
  getMyBetsBetSharingShareBetOnTapEvent,
  getMyBetsBetSharingShareImageOnTapEvent,
} from "./interface";

jest.mock("../../state/layout/cards/cards-selectors");

jest.mock("../../helpers/dates", () => ({
  formatTime: jest.fn(() => "13:00"),
}));

jest.mock("../../state/entities/exchange-markets/exchange-market-selectors", () => {
  const getExchangeMarketByURN = jest.fn(() => ({
    marketId: "marketId",
    name: "market name",
    hierarchy: {
      sportevent: "eventUrn",
      competition: "competitionUrn",
    },
    sport: "sportUrn",
  }));
  return {
    createExchangeMarketSelector: () => getExchangeMarketByURN,
  };
});

jest.mock("../../state/betting/sportsbook-betting/sportsbook-betting-selectors", () => ({
  getSportsbookBettingState: jest.fn(),
}));
jest.mock("../../state/entities/sportsbook-markets/sportsbook-market-selectors", () => ({
  getSportsbookMarketById: jest.fn(),
}));

jest.mock("../../state/betting/exchange-market-bets/exchange-market-bets-selectors", () => {
  const exchangeMarketBet = jest.fn(() => ({
    marketId: "marketId",
    description: "market name",
  }));
  return {
    createExchangeMarketBetSelector: () => exchangeMarketBet,
  };
});

jest.mock("../../helpers/markets", () => ({
  isRaceHierarchy: jest.fn(),
}));

jest.mock("../../helpers/tagging", () => ({
  getProductLabelByProductType: jest.fn(() => "exchange"),
  getProductLabelByProductTypeFilterItem: jest.fn(() => "exchange"),
}));

beforeEach(jest.clearAllMocks);

const jurisdictionMock = "jurisdictionmock";

describe("Interface GTM resolvers", () => {
  describe("getMarketSwitchEvent", () => {
    const params = {
      product: "Sportsbook",
      market: {
        urn: "ppb:sbkMarket:924.216905457",
        name: "Match Odds",
        marketId: "924.216905457",
        sportevent: "ppb:event:29615938",
        competition: "ppb:competition:10932509",
        sport: "ppb:eventType:1",
        runners: [
          { urn: "ppb:sbkRunner:924.216905457/56301", selectionId: 56301, name: "Watford", handicap: 0 },
          { urn: "ppb:sbkRunner:924.216905457/48351", selectionId: 48351, name: "Man Utd", handicap: 0 },
          { urn: "ppb:sbkRunner:924.216905457/58805", selectionId: 58805, name: "The Draw", handicap: 0 },
        ],
        status: "OPEN",
      },
      event: { urn: "ppb:event:29615938", eventId: 29615938, name: "Watford v Man Utd" },
      competition: { urn: "ppb:competition:10932509", competitionId: 10932509, name: "English Premier League" },
      sport: { urn: "ppb:eventType:1", sportId: 1, name: "Football" },
    };

    const { product, market, event, competition, sport } = params;

    describe("when itemVerticalPositionOnPage is defined", () => {
      it("should return the correct event payload with correct position", () => {
        expect(getMarketSwitchEvent(product, market, event, competition, sport, 2)).toEqual({
          event: "ga_event",
          action: TaggingAction.CLICKED,
          category: TaggingCategory.INTERFACE,
          label: product,
          [APPLICATION.MODULE]: "market module product switcher",
          [BUSINESS.SPORT_ID]: sport.sportId,
          [BUSINESS.SPORT_NAME]: sport.name,
          [BUSINESS.EVENT_ID]: event.eventId,
          [BUSINESS.EVENT_NAME]: event.name,
          [BUSINESS.MARKET_ID]: market.marketId,
          [BUSINESS.MARKET_NAME]: market.name,
          [BUSINESS.COMPETITION_ID]: competition.competitionId,
          [BUSINESS.COMPETITION_NAME]: competition.name,
          [DEVICE.POSITION]: 2,
        });
      });
    });

    describe("when itemVerticalPositionOnPage is undefined", () => {
      it("should return the correct event payload with null position", () => {
        expect(getMarketSwitchEvent(product, market, event, competition, sport, undefined)).toEqual({
          event: "ga_event",
          action: TaggingAction.CLICKED,
          category: TaggingCategory.INTERFACE,
          label: product,
          [APPLICATION.MODULE]: "market module product switcher",
          [BUSINESS.SPORT_ID]: sport.sportId,
          [BUSINESS.SPORT_NAME]: sport.name,
          [BUSINESS.EVENT_ID]: event.eventId,
          [BUSINESS.EVENT_NAME]: event.name,
          [BUSINESS.MARKET_ID]: market.marketId,
          [BUSINESS.MARKET_NAME]: market.name,
          [BUSINESS.COMPETITION_ID]: competition.competitionId,
          [BUSINESS.COMPETITION_NAME]: competition.name,
          [DEVICE.POSITION]: null,
        });
      });
    });

    describe("when event and competition are undefined", () => {
      it("should return the correct event payload with correct position", () => {
        expect(getMarketSwitchEvent(product, market, undefined, undefined, sport, 2)).toEqual({
          event: "ga_event",
          action: TaggingAction.CLICKED,
          category: TaggingCategory.INTERFACE,
          label: product,
          [APPLICATION.MODULE]: "market module product switcher",
          [BUSINESS.SPORT_ID]: sport.sportId,
          [BUSINESS.SPORT_NAME]: sport.name,
          [BUSINESS.EVENT_ID]: null,
          [BUSINESS.EVENT_NAME]: null,
          [BUSINESS.MARKET_ID]: market.marketId,
          [BUSINESS.MARKET_NAME]: market.name,
          [BUSINESS.COMPETITION_ID]: null,
          [BUSINESS.COMPETITION_NAME]: null,
          [DEVICE.POSITION]: 2,
        });
      });
    });
  });

  describe("getMyAccountMenuToggleEvent", () => {
    it("should return the correct event payload when event is triggered with opened action", () => {
      expect(getMyAccountMenuToggleEvent(true)).toEqual({
        event: "ga_event",
        category: TaggingCategory.INTERFACE,
        action: TaggingAction.OPENED,
        label: "my account",
        [APPLICATION.MODULE]: "header",
      });
    });

    it("should return the correct event payload when event is triggered with closed action", () => {
      expect(getMyAccountMenuToggleEvent(false)).toEqual({
        event: "ga_event",
        category: TaggingCategory.INTERFACE,
        action: TaggingAction.CLOSED,
        label: "my account",
        [APPLICATION.MODULE]: "header",
      });
    });
  });

  describe("getLogoutClickEvent", () => {
    it("should return the correct event payload", () => {
      expect(getLogoutClickEvent()).toEqual({
        event: "ga_event",
        category: TaggingCategory.INTERFACE,
        action: TaggingAction.CLICKED,
        label: "my account - logout",
        [APPLICATION.MODULE]: "header",
      });
    });
  });

  describe("getOpenBetslipEvent", () => {
    it("should return the correct event payload", () => {
      expect(getOpenBetslipEvent(Product.Exchange)).toEqual({
        event: "ga_event",
        action: "opened",
        category: "interface",
        cd3: "auto-open",
        label: "exchange betslip",
      });
    });
  });

  describe("getSearchTabClickEvent", () => {
    it("should return the correct payload", () => {
      expect(getSearchTabClickEvent("title")).toEqual({
        event: "ga_event",
        category: TaggingCategory.INTERFACE,
        action: TaggingAction.CLICKED,
        label: `market module product switcher - title`,
        [APPLICATION.MODULE]: "search menu",
      });
    });
  });

  describe("getSearchBarFocusEvent", () => {
    it("should return the correct payload", () => {
      expect(getSearchBarFocusEvent()).toEqual({
        event: "ga_event",
        category: TaggingCategory.INTERFACE,
        action: TaggingAction.CLICKED,
        label: "search box",
        [APPLICATION.MODULE]: "search menu",
      });
    });

    it("should return the correct payload with preferredModuleName", () => {
      expect(getSearchBarFocusEvent("Alberto")).toEqual({
        event: "ga_event",
        category: TaggingCategory.INTERFACE,
        action: TaggingAction.CLICKED,
        label: "search box",
        [APPLICATION.MODULE]: "Alberto",
      });
    });
  });

  describe("getSearchCancelClickEvent", () => {
    it("should return the correct payload", () => {
      expect(getSearchCancelClickEvent("Bayern")).toEqual({
        event: "ga_event",
        category: TaggingCategory.INTERFACE,
        action: TaggingAction.CANCELLED,
        label: "search text - Bayern",
        [APPLICATION.MODULE]: "search",
      });
    });
  });

  describe("getSearchClearClickEvent", () => {
    it("should return the correct payload", () => {
      expect(getSearchClearClickEvent("search text - Sport")).toEqual({
        event: "ga_event",
        category: TaggingCategory.INTERFACE,
        action: TaggingAction.CLEARED,
        label: "search text - Sport",
        [APPLICATION.MODULE]: "search",
      });
    });

    it("should return the correct payload with moduleName", () => {
      expect(getSearchClearClickEvent("search text - Sport", "Alberto")).toEqual({
        event: "ga_event",
        category: TaggingCategory.INTERFACE,
        action: TaggingAction.CLEARED,
        label: "search text - Sport",
        [APPLICATION.MODULE]: "Alberto",
      });
    });
  });

  describe("getMarketRulesToggleModalEvent", () => {
    describe("with opened set to true", () => {
      it("should return the correct event payload", () => {
        expect(getMarketRulesToggleModalEvent(true, "mock page type")).toEqual({
          event: "ga_event",
          category: "interface",
          action: "opened",
          label: "market rules",
          cd3: "mock page type - market rules",
          cd67: null,
          cd42: null,
          cd43: null,
        });
      });
    });

    describe("with opened set to false", () => {
      it("should return the correct event payload", () => {
        expect(getMarketRulesToggleModalEvent(false, "another mock page type")).toEqual({
          event: "ga_event",
          category: "interface",
          action: "closed",
          label: "market rules",
          cd3: "another mock page type - market rules",
          cd67: null,
          cd42: null,
          cd43: null,
        });
      });
    });
  });

  describe("getMarketGraphSelectViewEvent", () => {
    it("should return the correct event payload", () => {
      expect(getMarketGraphSelectViewEvent("label")).toEqual({
        event: "ga_event",
        category: "interface",
        action: "clicked",
        label: "label",
        cd3: "market graphs",
        cd67: null,
        cd42: null,
        cd43: null,
      });
    });
  });

  describe("getMarketGraphSelectGraphEvent", () => {
    it("should return the correct event payload", () => {
      expect(getMarketGraphSelectGraphEvent("label")).toEqual({
        event: "ga_event",
        category: "interface",
        action: "clicked",
        label: "label",
        cd3: "market graphs",
        cd67: null,
        cd42: null,
        cd43: null,
      });
    });
  });

  describe("getMarketDepthClickEvent", () => {
    const state = {
      entities: {
        exchangemarkets: "state",
      },
    };
    describe("when market depth is active", () => {
      it("should return the correct event payload", () => {
        const response = getMarketDepthClickEvent(state, "marketUrn", true);

        expect(response).toEqual({
          event: "ga_event",
          category: "interface",
          action: "opened",
          label: "market name - market depth",
          cd3: "market - market depth",
          cd42: null,
          cd43: null,
          cd67: null,
        });
      });
    });

    describe("when market depth is inactive", () => {
      it("should return the correct event payload", () => {
        const response = getMarketDepthClickEvent(state, "marketUrn", false);
        expect(response).toEqual({
          event: "ga_event",
          category: "interface",
          action: "closed",
          label: "market name - market depth",
          cd3: "market - market depth",
          cd42: null,
          cd43: null,
          cd67: null,
        });
      });
    });
  });

  describe("getMyAccountToggleCashBalancesViewEvent", () => {
    it("should return the correct event payload (show less)", () => {
      expect(getMyAccountToggleCashBalancesViewEvent(jurisdictionMock, true)).toEqual({
        event: "ga_event",
        category: "interface",
        action: "clicked",
        label: "show less",
        cd3: `my_account_${jurisdictionMock}_mobile`,
      });
    });

    it("should return the correct event payload (show more)", () => {
      expect(getMyAccountToggleCashBalancesViewEvent(jurisdictionMock, false)).toEqual({
        event: "ga_event",
        category: "interface",
        action: "clicked",
        label: "show more",
        cd3: `my_account_${jurisdictionMock}_mobile`,
      });
    });
  });

  describe("getBetslipHeaderClickEvent", () => {
    it("should return the correct event payload", () => {
      expect(getBetslipHeaderClickEvent(TaggingAction.OPENED, "SPORTSBOOK_SINGLES")).toEqual({
        event: "ga_event",
        category: "interface",
        action: TaggingAction.OPENED,
        label: "sportsbook betslip",
        cd3: "betslip",
      });
    });
  });

  describe("getBetslipAccordionHeaderClickEvent", () => {
    it("should return the correct event payload", () => {
      const event = getBetslipAccordionHeaderClickEvent(TaggingAction.COLLAPSE);
      expect(event).toEqual({
        event: "ga_event",
        category: TaggingCategory.INTERFACE,
        action: TaggingAction.COLLAPSE,
        label: "selections",
        cd3: "betslip",
      });
    });
  });

  describe("getBetslipSportsbookMultipleBetTypeClickEvent", () => {
    it("should return the correct event payload", () => {
      const event = getBetslipSportsbookMultipleBetTypeClickEvent("mock_label");
      expect(event).toEqual({
        event: "ga_event",
        category: TaggingCategory.INTERFACE,
        action: TaggingAction.CLICKED,
        label: "mock_label",
        cd3: "betslip",
      });
    });
  });

  describe("getBetslipSbkRemoveAllEvent", () => {
    it("should return the correct event payload", () => {
      const event = getBetslipSbkRemoveAllEvent();
      expect(event).toEqual({
        event: "ga_event",
        category: TaggingCategory.INTERFACE,
        action: TaggingAction.CLICKED,
        label: "remove all selections",
        cd3: "betslip",
      });
    });
  });

  describe("getBetslipBonusActivationEvent", () => {
    it("should return the correct event payload", () => {
      const event = getBetslipBonusActivationEvent("batatas");

      expect(event).toEqual({
        event: "ga_event",
        category: TaggingCategory.INTERFACE,
        action: TaggingAction.TOGGLE_ON,
        label: `use elegible bonus batatas`,
        cd3: "betslip",
        cd42: null,
        cd43: null,
        cd67: null,
      });
    });
  });

  describe("getJackpotMerchandiseViewEvent", () => {
    it("should return the correct event payload", () => {
      const event = getJackpotMerchandiseViewEvent("normal", "jackpot");

      expect(event).toEqual({
        event: "ga_event",
        category: TaggingCategory.INTERFACE,
        action: TaggingAction.SHOW,
        label: `normal`,
        cd3: "jackpot",
      });
    });
  });

  describe("getBetslipEachWayToggleEvent", () => {
    describe("when isSelected property is true", () => {
      it("should return the correct event payload", () => {
        const event = getBetslipEachWayToggleEvent({ isSelected: true });

        expect(event).toEqual({
          event: "ga_event",
          category: TaggingCategory.INTERFACE,
          action: TaggingAction.TOGGLE_ON,
          label: "each way",
          cd3: "betslip",
          cd67: null,
          cd42: null,
          cd43: null,
        });
      });
    });

    describe("when isSelected property is false", () => {
      it("should return the correct event payload", () => {
        const event = getBetslipEachWayToggleEvent({ isSelected: false });

        expect(event).toEqual({
          event: "ga_event",
          category: TaggingCategory.INTERFACE,
          action: TaggingAction.TOGGLE_OFF,
          label: "each way",
          cd3: "betslip",
          cd67: null,
          cd42: null,
          cd43: null,
        });
      });
    });
  });

  describe("getBetslipAccaInsuranceToggleEvent", () => {
    describe("when isSelected property is true", () => {
      it("should return the correct event payload", () => {
        const event = getBetslipAccaInsuranceToggleEvent({ isSelected: true });

        expect(event).toEqual({
          event: "ga_event",
          category: TaggingCategory.INTERFACE,
          action: TaggingAction.TOGGLE_ON,
          label: "acca insurance",
          cd3: "betslip",
          cd67: null,
          cd42: null,
          cd43: null,
        });
      });
    });

    describe("when isSelected property is false", () => {
      it("should return the correct event payload", () => {
        const event = getBetslipAccaInsuranceToggleEvent({ isSelected: false });

        expect(event).toEqual({
          event: "ga_event",
          category: TaggingCategory.INTERFACE,
          action: TaggingAction.TOGGLE_OFF,
          label: "acca insurance",
          cd3: "betslip",
          cd67: null,
          cd42: null,
          cd43: null,
        });
      });
    });
  });

  describe("getBetslipMyOddsBoostToggleEvent", () => {
    describe("when isSelected property is true", () => {
      it("should return the correct event payload", () => {
        const event = getBetslipMyOddsBoostToggleEvent({ isSelected: true });

        expect(event).toEqual({
          event: "ga_event",
          category: TaggingCategory.INTERFACE,
          action: TaggingAction.TOGGLE_ON,
          label: "my odds boost",
          cd3: "betslip",
          cd67: null,
          cd42: null,
          cd43: null,
        });
      });
    });

    describe("when isSelected property is false", () => {
      it("should return the correct event payload", () => {
        const event = getBetslipMyOddsBoostToggleEvent({ isSelected: false });

        expect(event).toEqual({
          event: "ga_event",
          category: TaggingCategory.INTERFACE,
          action: TaggingAction.TOGGLE_OFF,
          label: "my odds boost",
          cd3: "betslip",
          cd67: null,
          cd42: null,
          cd43: null,
        });
      });
    });
  });

  describe("getBetslipCastBetChangeEvent", () => {
    describe("when there is not a valid leg", () => {
      it("should return null", () => {
        const sportsbookBetting = {
          combinations: {
            combinationId: {
              id: "combinationId",
              legs: ["legId"],
            },
          },
          legs: {},
        };
        getSportsbookBettingState.mockReturnValue(sportsbookBetting);

        const applicationState = { entities: { sportsbookBetting } };
        const event = getBetslipCastBetChangeEvent(applicationState, "combinationId");

        expect(event).toEqual(null);
      });
    });

    describe("when there is a valid leg", () => {
      it("should return the correct event payload", () => {
        const sportsbookBetting = {
          combinations: {
            combinationId: {
              id: "combinationId",
              legs: ["legId"],
            },
          },
          legs: {
            legId: {
              id: "legId",
              legType: "legType",
            },
          },
        };
        getSportsbookBettingState.mockReturnValue(sportsbookBetting);

        const applicationState = { entities: { sportsbookBetting } };
        const event = getBetslipCastBetChangeEvent(applicationState, "combinationId");

        expect(event).toEqual({
          event: "ga_event",
          category: "interface",
          action: "clicked",
          label: "legType",
          cd3: "betslip",
          cd42: null,
          cd43: null,
          cd67: null,
        });
      });
    });
  });

  describe("getBetslipCastBetOrderChangeEvent", () => {
    describe("when there is not a valid leg", () => {
      it("should return null", () => {
        const sportsbookBetting = {
          combinations: {
            combinationId: {
              id: "combinationId",
              legs: ["legId"],
            },
          },
          legs: {},
        };
        const applicationState = { entities: { sportsbookBetting } };

        getSportsbookBettingState.mockReturnValue(sportsbookBetting);

        const event = getBetslipCastBetOrderChangeEvent(applicationState, "combinationId", "updatedRunnerId");

        expect(event).toEqual(null);
      });
    });

    describe("when there is not a valid runner", () => {
      it("should return null", () => {
        const sportsbookBetting = {
          combinations: {
            combinationId: {
              id: "combinationId",
              legs: ["legId"],
            },
          },
          legs: {
            legId: {
              id: "legId",
              legType: "legType",
            },
          },
          runners: {},
        };
        const applicationState = { entities: { sportsbookBetting } };

        getSportsbookBettingState.mockReturnValue(sportsbookBetting);

        const event = getBetslipCastBetOrderChangeEvent(applicationState, "combinationId", "updatedRunnerId");

        expect(event).toEqual(null);
      });
    });

    describe("when there is not a valid market", () => {
      it("should return null", () => {
        const sportsbookBetting = {
          combinations: {
            combinationId: {
              id: "combinationId",
              legs: ["legId"],
            },
          },
          legs: {
            legId: {
              id: "legId",
              legType: "legType",
            },
          },
          runners: {
            updatedRunnerId: {
              marketId: "marketId",
              selectionId: "",
            },
          },
        };
        const sportsbookmarkets = {};
        const applicationState = { entities: { sportsbookBetting, sportsbookmarkets } };

        getSportsbookBettingState.mockReturnValue(sportsbookBetting);
        getSportsbookMarketById.mockReturnValue();

        const event = getBetslipCastBetOrderChangeEvent(applicationState, "combinationId", "updatedRunnerId");

        expect(event).toEqual(null);
      });
    });

    describe("when there is not a valid selection", () => {
      it("should return null", () => {
        const sportsbookBetting = {
          combinations: {
            combinationId: {
              id: "combinationId",
              legs: ["legId"],
            },
          },
          legs: {
            legId: {
              id: "legId",
              legType: "legType",
            },
          },
          runners: {
            updatedRunnerId: {
              marketId: "marketId",
              selectionId: "selectionId",
            },
          },
        };
        const market = {
          marketId: "marketId",
          runners: [],
        };
        const sportsbookmarkets = {
          [market.marketId]: market,
        };
        const applicationState = { entities: { sportsbookBetting, sportsbookmarkets } };

        getSportsbookBettingState.mockReturnValue(sportsbookBetting);
        getSportsbookMarketById.mockReturnValue(market);

        const event = getBetslipCastBetOrderChangeEvent(applicationState, "combinationId", "updatedRunnerId");

        expect(event).toEqual(null);
      });
    });

    describe("when there is valid data", () => {
      it("should return the correct event payload", () => {
        const sportsbookBetting = {
          combinations: {
            combinationId: {
              id: "combinationId",
              legs: ["legId"],
            },
          },
          legs: {
            legId: {
              id: "legId",
              legType: "legType",
            },
          },
          runners: {
            updatedRunnerId: {
              marketId: "marketId",
              selectionId: "selectionId",
            },
          },
        };
        const market = {
          marketId: "marketId",
          runners: [
            {
              selectionId: "selectionId",
              name: "selectionName",
            },
          ],
        };
        const sportsbookmarkets = {
          [market.marketId]: market,
        };
        const applicationState = { entities: { sportsbookBetting, sportsbookmarkets } };

        getSportsbookBettingState.mockReturnValue(sportsbookBetting);
        getSportsbookMarketById.mockReturnValue(market);

        const event = getBetslipCastBetOrderChangeEvent(applicationState, "combinationId", "updatedRunnerId");

        expect(event).toEqual({
          event: "ga_event",
          category: "interface",
          action: "repositioned",
          label: "legType - selectionName",
          cd3: "betslip",
          cd42: null,
          cd43: null,
          cd67: null,
        });
      });
    });

    describe("when there is non runners in the market", () => {
      it("should return null", () => {
        const sportsbookBetting = {
          combinations: {
            combinationId: {
              id: "combinationId",
              legs: ["legId"],
            },
          },
          legs: {
            legId: {
              id: "legId",
              legType: "legType",
            },
          },
          runners: {
            updatedRunnerId: {
              marketId: "marketId",
              selectionId: "selectionId",
            },
          },
        };
        const market = {
          marketId: "marketId",
          runners: undefined,
        };
        const sportsbookmarkets = {
          [market.marketId]: market,
        };
        const applicationState = { entities: { sportsbookBetting, sportsbookmarkets } };

        getSportsbookBettingState.mockReturnValue(sportsbookBetting);
        getSportsbookMarketById.mockReturnValue(market);

        const event = getBetslipCastBetOrderChangeEvent(applicationState, "combinationId", "updatedRunnerId");

        expect(event).toEqual(null);
      });
    });
  });

  describe("getBetslipSbkReAddSelectionsEvent", () => {
    it("should return the correct event payload", () => {
      const event = getBetslipSbkReAddSelectionsEvent();

      expect(event).toEqual({
        event: "ga_event",
        category: TaggingCategory.INTERFACE,
        action: TaggingAction.ADD_PREVIOUS_SELECTIONS,
        label: "full receipt",
        cd3: "bet receipt",
      });
    });
  });

  describe("getMyBetsSbkAddPreviousSelectionsEvent", () => {
    it("should return the correct event payload", () => {
      const event = getMyBetsSbkAddPreviousSelectionsEvent();

      expect(event).toEqual({
        event: "ga_event",
        category: TaggingCategory.INTERFACE,
        action: TaggingAction.ADD_PREVIOUS_SELECTIONS,
        label: "re-use selections",
        cd3: "my bets",
      });
    });
  });

  describe("getBetslipSbkNotificationShownEvent", () => {
    it("should return the correct event payload", () => {
      const event = getBetslipSbkNotificationShownEvent("label");

      expect(event).toEqual({
        event: "ga_event",
        category: TaggingCategory.INTERFACE,
        action: TaggingAction.SAW,
        label: "label",
        cd3: "betslip",
      });
    });
  });

  describe("getToggleExpandableCardGroupEvent", () => {
    describe("when isExpanded is true", () => {
      it("should return the correct event payload", () => {
        expect(getToggleExpandableCardGroupEvent(true, "Title", "viewTitle", "viewType", 1)).toEqual({
          action: "expand",
          category: "interface",
          cd3: "viewType - viewTitle",
          cd42: null,
          cd43: null,
          cd67: 1,
          event: "ga_event",
          label: "Title",
        });
      });
    });

    describe("when isExpanded is false", () => {
      it("should return the correct event payload", () => {
        expect(getToggleExpandableCardGroupEvent(false, "title", "viewTitle", "viewType", 1)).toMatchObject({
          action: "collapse",
        });
      });
    });

    describe("when title and itemVerticalPositionOnPage are undefined", () => {
      it("should return the correct event payload", () => {
        expect(getToggleExpandableCardGroupEvent(false, undefined, "viewTitle", "viewType", undefined)).toMatchObject({
          action: "collapse",
        });
      });
    });
  });

  describe("getToggleRunnerInfoEvent", () => {
    it("should return the correct event payload", () => {
      const event = getToggleRunnerInfoEvent(true, "runnerName", "pageType", "marketName");

      expect(event).toEqual({
        event: "ga_event",
        category: TaggingCategory.INTERFACE,
        action: TaggingAction.OPENED,
        label: "runner info - runnerName",
        cd3: "pageType - marketName",
        cd42: null,
        cd43: null,
        cd67: null,
      });

      const eventClosed = getToggleRunnerInfoEvent(false, "runnerName", "pageType", "marketName");

      expect(eventClosed).toEqual({
        event: "ga_event",
        category: TaggingCategory.INTERFACE,
        action: TaggingAction.CLOSED,
        label: "runner info - runnerName",
        cd3: "pageType - marketName",
        cd42: null,
        cd43: null,
        cd67: null,
      });
    });
  });

  describe("getToggleRunnerInfoTabsEvent", () => {
    it("should return the correct event payload", () => {
      const infoTabsEvent = getToggleRunnerInfoTabsEvent(true);

      expect(infoTabsEvent).toEqual({
        event: "ga_event",
        category: TaggingCategory.INTERFACE,
        action: TaggingAction.CLICKED,
        label: "details",
        cd3: "market graphs",
        cd42: null,
        cd43: null,
        cd67: null,
      });

      const infoClosedTabsEvent = getToggleRunnerInfoTabsEvent(false);

      expect(infoClosedTabsEvent).toEqual({
        event: "ga_event",
        category: TaggingCategory.INTERFACE,
        action: TaggingAction.CLICKED,
        label: "market graphs",
        cd3: "details",
        cd42: null,
        cd43: null,
        cd67: null,
      });
    });
  });

  describe("getToggleTimeFormEvent", () => {
    const race = {
      raceId: "30408659.1300",
      meeting: "ppb:meeting:30408659",
      startTime: "2021-04-08T13:00:00.000Z",
      details: { status: "OFF" },
    };

    const meeting = {
      venue: "Taunton",
      meetingId: "30408659",
      entityName: "Taunton 8th Apr",
    };

    const sport = {
      sportId: 7,
      name: "Horse Racing",
    };

    describe("when isExpanded is true", () => {
      it("should return the correct event payload", () => {
        expect(getToggleTimeFormEvent(true, race, meeting, sport)).toEqual({
          action: "show",
          category: "text media",
          cd11: null,
          cd122: "timeform",
          cd129: "30408659",
          cd131: "no",
          cd133: null,
          cd134: null,
          cd135: null,
          cd14: 7,
          cd3: "racecard",
          cd5: "Horse Racing",
          cd6: "Taunton 8th Apr",
          cd7: "13:00 Taunton",
          cd79: "yes",
          cd84: "30408659.1300",
          event: "ga_event",
          label: "race verdict",
        });
      });
    });

    describe("when isExpanded is false", () => {
      it("should return the correct event payload", () => {
        expect(getToggleTimeFormEvent(false, race, meeting, sport).action).toEqual("hide");
      });
    });

    describe("when race is undefined", () => {
      it("should return the correct event payload", () => {
        expect(getToggleTimeFormEvent(true, undefined, meeting, sport)).toEqual({
          action: "show",
          category: "text media",
          cd11: null,
          cd122: "timeform",
          cd129: "30408659",
          cd131: "no",
          cd133: null,
          cd134: null,
          cd135: null,
          cd14: 7,
          cd3: "racecard",
          cd5: "Horse Racing",
          cd6: "Taunton 8th Apr",
          cd79: "no",
          event: "ga_event",
          label: "race verdict",
        });
      });
    });

    describe("when meeting is undefined", () => {
      it("should return the correct event payload", () => {
        expect(getToggleTimeFormEvent(true, race, undefined, sport)).toEqual({
          action: "show",
          category: "text media",
          cd11: null,
          cd122: "timeform",
          cd131: "no",
          cd133: null,
          cd134: null,
          cd135: null,
          cd14: 7,
          cd3: "racecard",
          cd5: "Horse Racing",
          cd79: "yes",
          cd84: "30408659.1300",
          event: "ga_event",
          label: "race verdict",
        });
      });
    });

    describe("when race and meeting are undefined", () => {
      it("should return the correct event payload", () => {
        expect(getToggleTimeFormEvent(true, undefined, undefined, sport)).toEqual({
          action: "show",
          category: "text media",
          cd11: null,
          cd122: "timeform",
          cd131: "no",
          cd133: null,
          cd134: null,
          cd135: null,
          cd14: 7,
          cd3: "racecard",
          cd5: "Horse Racing",
          cd79: "no",
          event: "ga_event",
          label: "race verdict",
        });
      });
    });

    describe("when sport is undefined", () => {
      it("should return the correct event payload", () => {
        expect(getToggleTimeFormEvent(true, race, meeting, undefined)).toEqual({
          action: "show",
          category: "text media",
          cd11: null,
          cd122: "timeform",
          cd129: "30408659",
          cd131: "no",
          cd133: null,
          cd134: null,
          cd135: null,
          cd3: "racecard",
          cd6: "Taunton 8th Apr",
          cd7: "13:00 Taunton",
          cd79: "yes",
          cd84: "30408659.1300",
          event: "ga_event",
          label: "race verdict",
        });
      });
    });
  });

  describe("getSwitcherEvent", () => {
    it("should return the correct event payload", () => {
      expect(getSwitcherEvent({ label: "super race", pageType: "RaceSwitcherCard" })).toEqual({
        action: "opened",
        category: "interface",
        event: "ga_event",
        label: "super race",
        cd3: "race - power nav",
        cd42: null,
        cd43: null,
        cd67: null,
      });
    });
  });

  describe("getNavigationTabClickEvent", () => {
    describe("when itemVerticalPositionOnPage is defined", () => {
      it("should return the correct event payload with correct position", () => {
        const event = getNavigationTabClickEvent("label", "pageType", 2);

        expect(event).toEqual({
          event: "ga_event",
          category: TaggingCategory.INTERFACE,
          action: TaggingAction.CLICKED,
          label: "label",
          cd3: "pageType - market ribbon",
          cd67: 2,
          cd42: null,
          cd43: null,
        });
      });
    });

    describe("when itemVerticalPositionOnPage is undefined", () => {
      it("should return the correct event payload with null position", () => {
        const event = getNavigationTabClickEvent("label", "pageType", undefined);

        expect(event).toEqual({
          event: "ga_event",
          category: TaggingCategory.INTERFACE,
          action: TaggingAction.CLICKED,
          label: "label",
          cd3: "pageType - market ribbon",
          cd67: null,
          cd42: null,
          cd43: null,
        });
      });
    });
  });

  describe("getFilterOpenEvent", () => {
    it("should return the correct event payload", () => {
      const event = getFilterOpenEvent("label");

      expect(event).toEqual({
        event: "ga_event",
        category: TaggingCategory.INTERFACE,
        action: TaggingAction.OPENED,
        label: "label",
        cd3: "filter",
      });
    });
  });

  describe("getFilterCloseEvent", () => {
    it("should return the correct event payload", () => {
      const event = getFilterCloseEvent();

      expect(event).toEqual({
        event: "ga_event",
        category: TaggingCategory.INTERFACE,
        action: TaggingAction.CLOSED,
        label: "cancel",
        cd3: "filter",
      });
    });
  });

  describe("getFilterApplyEvent", () => {
    it("should return the correct event payload", () => {
      const event = getFilterApplyEvent("label");

      expect(event).toEqual({
        event: "ga_event",
        category: TaggingCategory.INTERFACE,
        action: TaggingAction.CLICKED,
        label: "label",
        cd3: "filter",
      });
    });
  });

  describe("getFilterResetClickEvent", () => {
    it("should return the correct event payload", () => {
      const event = getFilterResetClickEvent("label");

      expect(event).toEqual({
        event: "ga_event",
        category: TaggingCategory.INTERFACE,
        action: TaggingAction.CLICKED,
        label: "label",
        cd3: "filter",
      });
    });
  });

  describe("getSawCardEvent", () => {
    it("should return the correct event payload", () => {
      const event = getSawCardEvent("label", "moduleName");

      expect(event).toEqual({
        event: "ga_event",
        category: TaggingCategory.INTERFACE,
        action: TaggingAction.SAW,
        label: "label",
        cd3: "moduleName",
      });
    });
  });

  describe("getContentSummaryCollapseEvent", () => {
    describe("when collapsed is true", () => {
      it("should return the correct payload", () => {
        expect(getContentSummaryCollapseEvent("Main title", true)).toEqual({
          event: "ga_event",
          category: "interface",
          action: "collapse",
          label: "Main title",
          cd3: "seo footer",
          cd133: null,
          cd134: null,
          cd135: null,
        });
      });
    });

    describe("when collapsed is false", () => {
      it("should return the correct payload", () => {
        expect(getContentSummaryCollapseEvent("Main title", false)).toEqual({
          event: "ga_event",
          category: "interface",
          action: "expand",
          label: "Main title",
          cd3: "seo footer",
          cd133: null,
          cd134: null,
          cd135: null,
        });
      });
    });
  });

  describe("getSwitchProductEvent", () => {
    it("should return the correct event payload", () => {
      const event = getSwitchProductEvent("label", "moduleName");

      expect(event).toEqual({
        event: "ga_event",
        category: TaggingCategory.INTERFACE,
        action: TaggingAction.SWITCH_PRODUCT,
        label: "label",
        cd3: "moduleName - bottom ribbon",
      });
    });
  });

  describe("getToggleRecentRacesEvent", () => {
    const raceMarketCardUrn = "ppb:tbd:card:raceMarket:urn";
    const marketCardUrn = "ppb:tbd:card:market:urn";
    const state = {
      layouts: {
        cards: {
          racemarkets: {
            [raceMarketCardUrn]: { typename: "RaceMarketCard" },
          },
          markets: {
            [marketCardUrn]: { typename: "MarketCard" },
          },
        },
      },
    };
    describe("when the card is a racemarketcard", () => {
      const cardType = "racemarketcard";

      it("should return the correct event payload", () => {
        createCardByURNSelector.mockReturnValueOnce(() => ({ typename: "RaceMarketCard" }));
        createCardByURNSelector.mockReturnValueOnce(() => undefined);

        const event = getToggleRecentRacesEvent(state, "pageType", cardType, "runnerName", false);

        expect(event).toEqual({
          event: "ga_event",
          category: TaggingCategory.INTERFACE,
          action: TaggingAction.OPENED,
          label: "recent races - runnerName",
          cd3: `pageType - ${cardType}`,
          cd42: null,
          cd43: null,
          cd67: null,
        });

        createCardByURNSelector.mockReturnValueOnce(() => ({ typename: "RaceMarketCard" }));
        createCardByURNSelector.mockReturnValueOnce(() => undefined);

        const eventClosed = getToggleRecentRacesEvent(state, "pageType", "cardType", "runnerName", true);

        expect(eventClosed).toEqual({
          event: "ga_event",
          category: TaggingCategory.INTERFACE,
          action: TaggingAction.CLOSED,
          label: "recent races - runnerName",
          cd3: `pageType - ${cardType}`,
          cd42: null,
          cd43: null,
          cd67: null,
        });
      });
    });

    describe("when the card is a marketcard", () => {
      const cardType = "marketcard";

      it("should return the correct event payload", () => {
        createCardByURNSelector.mockReturnValueOnce(() => undefined);
        createCardByURNSelector.mockReturnValueOnce(() => ({ typename: "MarketCard" }));

        const event = getToggleRecentRacesEvent(state, "pageType", cardType, "runnerName", false);

        expect(event).toEqual({
          event: "ga_event",
          category: TaggingCategory.INTERFACE,
          action: TaggingAction.OPENED,
          label: "recent races - runnerName",
          cd3: `pageType - ${cardType}`,
          cd42: null,
          cd43: null,
          cd67: null,
        });

        createCardByURNSelector.mockReturnValueOnce(() => undefined);
        createCardByURNSelector.mockReturnValueOnce(() => ({ typename: "MarketCard" }));

        const eventClosed = getToggleRecentRacesEvent(state, "pageType", "cardType", "runnerName", true);

        expect(eventClosed).toEqual({
          event: "ga_event",
          category: TaggingCategory.INTERFACE,
          action: TaggingAction.CLOSED,
          label: "recent races - runnerName",
          cd3: `pageType - ${cardType}`,
          cd42: null,
          cd43: null,
          cd67: null,
        });
      });
    });

    describe("when the card is not found", () => {
      it("should return null", () => {
        createCardByURNSelector.mockReturnValueOnce(() => undefined);
        createCardByURNSelector.mockReturnValueOnce(() => undefined);

        expect(getToggleRecentRacesEvent(state, "pageType", marketCardUrn, "runnerName", true)).toEqual(null);
      });
    });
  });

  describe("getToggleMarketGraphEvent", () => {
    it("should return the correct event payload", () => {
      const event = getToggleMarketGraphEvent("pageType", "runnerName", "marketName", false);

      expect(event).toEqual({
        event: "ga_event",
        category: TaggingCategory.INTERFACE,
        action: TaggingAction.OPENED,
        label: "runnerName - market graphs",
        cd3: "pageType - marketName",
        cd42: null,
        cd43: null,
        cd67: null,
      });

      const eventClosed = getToggleMarketGraphEvent("pageType", "runnerName", "marketName", true);

      expect(eventClosed).toEqual({
        event: "ga_event",
        category: TaggingCategory.INTERFACE,
        action: TaggingAction.CLOSED,
        label: "market graphs",
        cd3: "pageType - marketName",
        cd42: null,
        cd43: null,
        cd67: null,
      });
    });
  });

  describe("getToggleShowMoreEvent", () => {
    it("should return the correct event payload", () => {
      const event = getToggleShowMoreEvent("pageType", "tab", "marketName", "label");

      expect(event).toEqual({
        event: "ga_event",
        category: TaggingCategory.INTERFACE,
        action: TaggingAction.CLICKED,
        label: "label",
        cd3: "pageType - tab - marketName",
        cd42: null,
        cd43: null,
        cd67: null,
      });
    });
  });

  describe("getMarketBlurbExpandableEvent", () => {
    describe("when provided with open as true", () => {
      it("should return the correct event payload", () => {
        const event = getMarketBlurbExpandableEvent("pageType", "tab", "marketName", true);

        expect(event).toEqual({
          event: "ga_event",
          category: TaggingCategory.INTERFACE,
          action: TaggingAction.CLICKED,
          label: "view more",
          cd3: "pageType - tab - marketName",
        });
      });
    });
    describe("when provided with open as false", () => {
      it("should return the correct event payload", () => {
        const event = getMarketBlurbExpandableEvent("pageType", "tab", "filter", false);

        expect(event).toEqual({
          event: "ga_event",
          category: TaggingCategory.INTERFACE,
          action: TaggingAction.CLICKED,
          label: "view less",
          cd3: "pageType - tab - filter",
        });
      });
    });
  });

  describe("getMarketTemplatePebbleSelectionEvent", () => {
    describe("when label is provided", () => {
      it("should return the correct event payload", () => {
        const event = getMarketTemplatePebbleSelectionEvent("label");

        expect(event).toEqual({
          event: "ga_event",
          category: TaggingCategory.INTERFACE,
          action: TaggingAction.CLICKED,
          label: "label",
          cd3: "market - market pebbles",
          cd42: null,
          cd43: null,
          cd67: null,
        });
      });
    });

    describe("when label is not provided", () => {
      it("should return the correct event payload", () => {
        const event = getMarketTemplatePebbleSelectionEvent();

        expect(event).toEqual({
          event: "ga_event",
          category: TaggingCategory.INTERFACE,
          action: TaggingAction.CLICKED,
          label: "",
          cd3: "market - market pebbles",
          cd42: null,
          cd43: null,
          cd67: null,
        });
      });
    });
  });

  describe("getNextRacesRaceClickEvent", () => {
    it("should return the correct payload", () => {
      expect(getNextRacesRaceClickEvent("sport", 3, "race time selector")).toEqual({
        event: "ga_event",
        category: TaggingCategory.INTERFACE,
        action: TaggingAction.CLICKED,
        label: "race time selector",
        [DEVICE.POSITION]: 3,
        [APPLICATION.MODULE]: "sport - race time selector",
      });
    });

    describe("when itemVerticalPositionOnPage is undefined", () => {
      it("should return the correct payload", () => {
        expect(getNextRacesRaceClickEvent("sport", undefined, "race time selector")).toEqual({
          event: "ga_event",
          category: TaggingCategory.INTERFACE,
          action: TaggingAction.CLICKED,
          label: "race time selector",
          [DEVICE.POSITION]: null,
          [APPLICATION.MODULE]: "sport - race time selector",
        });
      });
    });
  });

  describe("getStatisticsModalToggleEvent", () => {
    describe("when isOpen is true", () => {
      it("should return the correct payload", () => {
        expect(getStatisticsModalToggleEvent("event", 3, "statistics", true)).toEqual({
          event: "ga_event",
          category: TaggingCategory.INTERFACE,
          action: TaggingAction.OPENED,
          label: "statistics",
          [DEVICE.POSITION]: 3,
          [APPLICATION.MODULE]: "event - stats and viz",
        });
      });
    });
    describe("when isOpen is false", () => {
      it("should return the correct payload", () => {
        expect(getStatisticsModalToggleEvent("event", 3, "statistics", false)).toEqual({
          event: "ga_event",
          category: TaggingCategory.INTERFACE,
          action: TaggingAction.CLOSED,
          label: "statistics",
          [DEVICE.POSITION]: 3,
          [APPLICATION.MODULE]: "event - stats and viz",
        });
      });
    });
    describe("when itemVerticalPositionOnPage is undefined", () => {
      it("should return the correct payload", () => {
        expect(getStatisticsModalToggleEvent("event", undefined, "statistics", true)).toEqual({
          event: "ga_event",
          category: TaggingCategory.INTERFACE,
          action: TaggingAction.OPENED,
          label: "statistics",
          [DEVICE.POSITION]: null,
          [APPLICATION.MODULE]: "event - stats and viz",
        });
      });
    });
  });

  describe("getStatisticsItemClickEvent", () => {
    it("should return the correct payload", () => {
      expect(getStatisticsItemClickEvent("form")).toEqual({
        event: "ga_event",
        category: TaggingCategory.INTERFACE,
        action: TaggingAction.CLICKED,
        label: "form",
        [APPLICATION.MODULE]: "statistics",
      });
    });
  });

  describe("getMarketSnackBarEvent", () => {
    it("should return the correct payload", () => {
      expect(getMarketSnackBarEvent("closed")).toEqual({
        event: "ga_event",
        category: TaggingCategory.INTERFACE,
        action: TaggingAction.SAW,
        label: "closed",
        [APPLICATION.MODULE]: "market snack bar",
      });
    });
  });

  describe("getAzSwitchToggleEvent", () => {
    describe("when isToggleOn is true", () => {
      it("should return the correct payload", () => {
        expect(getAzSwitchToggleEvent("label", true)).toEqual({
          event: "ga_event",
          category: TaggingCategory.INTERFACE,
          action: TaggingAction.TOGGLE_ON,
          label: "label",
          [APPLICATION.MODULE]: "sort",
        });
      });
    });

    describe("when isToggleOn is false", () => {
      it("should return the correct payload", () => {
        expect(getAzSwitchToggleEvent("label", false)).toEqual({
          event: "ga_event",
          category: TaggingCategory.INTERFACE,
          action: TaggingAction.TOGGLE_OFF,
          label: "label",
          [APPLICATION.MODULE]: "sort",
        });
      });
    });
  });

  describe("getNextRacesFilterClickEvent", () => {
    it("should return the correct payload", () => {
      expect(getNextRacesFilterClickEvent("all countries", "sport - race region switcher")).toEqual({
        event: "ga_event",
        category: TaggingCategory.INTERFACE,
        action: TaggingAction.CLICKED,
        label: "all countries",
        [APPLICATION.MODULE]: "sport - race region switcher",
      });
    });
  });

  describe("getMyBetsOrderTypePressEvent", () => {
    it("should return the correct payload", () => {
      expect(getMyBetsOrderTypePressEvent("exc", "open", "my bets")).toEqual({
        event: "ga_event",
        category: TaggingCategory.INTERFACE,
        action: TaggingAction.CLICKED,
        label: "exchange - open bets",
        [APPLICATION.MODULE]: "my bets",
      });
    });
  });

  describe("getPromoDescriptionToggleEvent", () => {
    const pageType = "race";
    const module = "marketcard";
    const label = "extra places info";

    describe("when the isOpen is true", () => {
      const isOpen = true;

      it("should return the correct payload", () => {
        expect(getPromoDescriptionToggleEvent(pageType, module, label, isOpen)).toEqual({
          event: "ga_event",
          category: TaggingCategory.INTERFACE,
          action: TaggingAction.OPENED,
          label,
          [APPLICATION.MODULE]: `${pageType} - ${module}`,
        });
      });
    });

    describe("when the isOpen is false", () => {
      const isOpen = false;

      it("should return the correct payload", () => {
        expect(getPromoDescriptionToggleEvent(pageType, module, label, isOpen)).toEqual({
          event: "ga_event",
          category: TaggingCategory.INTERFACE,
          action: TaggingAction.CLOSED,
          label,
          [APPLICATION.MODULE]: `${pageType} - ${module}`,
        });
      });
    });
  });

  describe("getToggleAccordionEvent", () => {
    it("should return the correct payload when isExpanded is true", () => {
      const isExpanded = false;
      expect(getToggleAccordionEvent("my bets", isExpanded)).toEqual({
        event: "ga_event",
        category: TaggingCategory.INTERFACE,
        action: TaggingAction.CLICKED,
        label: TaggingAction.HIDE,
        [APPLICATION.MODULE]: "my bets",
      });
    });

    it("should return the correct payload when isExpanded is false", () => {
      const isExpanded = true;
      expect(getToggleAccordionEvent("my bets", isExpanded)).toEqual({
        event: "ga_event",
        category: TaggingCategory.INTERFACE,
        action: TaggingAction.CLICKED,
        label: TaggingAction.SHOW,
        [APPLICATION.MODULE]: "my bets",
      });
    });
  });

  describe("getCopyBetIdToClipboardEvent", () => {
    it("should return the correct payload", () => {
      expect(getCopyBetIdToClipboardEvent("my bets")).toEqual({
        event: "ga_event",
        category: TaggingCategory.INTERFACE,
        action: TaggingAction.CLICKED,
        label: "copy to clipboard",
        [APPLICATION.MODULE]: "my bets",
      });
    });
  });

  describe("getRaceReplaysToggleEvent", () => {
    const raceMarketCardUrn = "ppb:tbd:card:raceMarket:urn";
    const marketCardUrn = "ppb:tbd:card:market:urn";
    const state = {
      layouts: {
        cards: {
          racemarkets: {
            [raceMarketCardUrn]: { typename: "RaceMarketCard" },
          },
          markets: {
            [marketCardUrn]: { typename: "MarketCard" },
          },
        },
      },
    };
    const label = "recent races video - horseName";

    describe("when the card is a racemarketcard", () => {
      const pageType = "sport";
      const cardType = "racemarketcard";

      describe("when the isClosed is true", () => {
        const isClosed = true;

        it("should return the correct payload", () => {
          createCardByURNSelector.mockReturnValueOnce(() => ({ typename: "RaceMarketCard" }));
          createCardByURNSelector.mockReturnValueOnce(() => undefined);
          expect(getRaceReplaysToggleEvent(state, pageType, raceMarketCardUrn, isClosed, label)).toEqual({
            event: "ga_event",
            category: TaggingCategory.INTERFACE,
            action: TaggingAction.CLOSED,
            label,
            [APPLICATION.MODULE]: `${pageType} - ${cardType}`,
            [DEVICE.POSITION]: null,
            [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null,
            [BUSINESS.TRANS_CASHOUT_INDICATOR]: null,
          });
        });
      });

      describe("when the isClosed is false", () => {
        const isClosed = false;

        it("should return the correct payload", () => {
          createCardByURNSelector.mockReturnValueOnce(() => ({ typename: "RaceMarketCard" }));
          createCardByURNSelector.mockReturnValueOnce(() => undefined);
          expect(getRaceReplaysToggleEvent(state, pageType, raceMarketCardUrn, isClosed, label)).toEqual({
            event: "ga_event",
            category: TaggingCategory.INTERFACE,
            action: TaggingAction.OPENED,
            label,
            [APPLICATION.MODULE]: `${pageType} - ${cardType}`,
            [DEVICE.POSITION]: null,
            [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null,
            [BUSINESS.TRANS_CASHOUT_INDICATOR]: null,
          });
        });
      });
    });

    describe("when the card is a marketcard", () => {
      const pageType = "race";
      const cardType = "marketcard";

      describe("when the isClosed is true", () => {
        const isClosed = true;

        it("should return the correct payload", () => {
          createCardByURNSelector.mockReturnValueOnce(() => undefined);
          createCardByURNSelector.mockReturnValueOnce(() => ({ typename: "MarketCard" }));
          expect(getRaceReplaysToggleEvent(state, pageType, marketCardUrn, isClosed, label)).toEqual({
            event: "ga_event",
            category: TaggingCategory.INTERFACE,
            action: TaggingAction.CLOSED,
            label,
            [APPLICATION.MODULE]: `${pageType} - ${cardType}`,
            [DEVICE.POSITION]: null,
            [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null,
            [BUSINESS.TRANS_CASHOUT_INDICATOR]: null,
          });
        });
      });

      describe("when the isClosed is false", () => {
        const isClosed = false;

        it("should return the correct payload", () => {
          createCardByURNSelector.mockReturnValueOnce(() => undefined);
          createCardByURNSelector.mockReturnValueOnce(() => ({ typename: "MarketCard" }));
          expect(getRaceReplaysToggleEvent(state, pageType, marketCardUrn, isClosed, label)).toEqual({
            event: "ga_event",
            category: TaggingCategory.INTERFACE,
            action: TaggingAction.OPENED,
            label,
            [APPLICATION.MODULE]: `${pageType} - ${cardType}`,
            [DEVICE.POSITION]: null,
            [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null,
            [BUSINESS.TRANS_CASHOUT_INDICATOR]: null,
          });
        });
      });
    });

    describe("when the card is not found", () => {
      const pageType = "sport";
      const isClosed = true;

      it("should return null", () => {
        createCardByURNSelector.mockReturnValueOnce(() => undefined);
        createCardByURNSelector.mockReturnValueOnce(() => undefined);
        expect(getRaceReplaysToggleEvent(state, pageType, marketCardUrn, isClosed, label)).toEqual(null);
      });
    });
  });

  describe("getMyBetsCancelAllEvent", () => {
    it("should return the correct payload", () => {
      expect(getMyBetsCancelAllEvent()).toEqual({
        event: "ga_event",
        category: TaggingCategory.INTERFACE,
        action: TaggingAction.CLICKED,
        label: "cancel all",
        [APPLICATION.MODULE]: "my bets",
      });
    });
  });

  describe("getPNInteractionClickEvent", () => {
    it("should return the correct payload", () => {
      expect(getPNInteractionClickEvent()).toEqual({
        event: "ga_event",
        category: TaggingCategory.INTERFACE,
        action: TaggingAction.CLICKED,
      });
    });
  });

  describe("getClickEvent", () => {
    it("should return the correct payload", () => {
      expect(getClickEvent()).toEqual({
        event: "ga_event",
        category: TaggingCategory.INTERFACE,
        action: TaggingAction.CLICKED,
        label: undefined,
        [APPLICATION.MODULE]: "undefined",
      });
    });
  });

  describe("getMaxPayoutAcceptMessageClickEvent", () => {
    it("should return the correct payload", () => {
      expect(getMaxPayoutAcceptMessageClickEvent()).toEqual({
        event: "ga_event",
        category: TaggingCategory.INTERFACE,
        action: TaggingAction.CLICKED,
        label: `accept - warningI18N.BETSLIP.VALIDATION_GROUP_ABOVE_MAX_PAYOUT`,
        [APPLICATION.MODULE]: "betslip",
      });
    });
  });

  describe("getLoyaltyPromotionBottomSheetOpenEvent", () => {
    it("should return the correct payload", () => {
      expect(getLoyaltyPromotionBottomSheetOpenEvent("home", "Checkmate Title")).toEqual({
        event: "ga_event",
        category: TaggingCategory.INTERFACE,
        action: TaggingAction.OPENED,
        label: "Checkmate Title",
        [APPLICATION.MODULE]: "home - banner details",
      });
    });
  });

  describe("getLoyaltyPromotionBottomSheetCloseEvent", () => {
    it("should return the correct payload", () => {
      expect(getLoyaltyPromotionBottomSheetCloseEvent("home", "Checkmate Title")).toEqual({
        event: "ga_event",
        category: TaggingCategory.INTERFACE,
        action: TaggingAction.CLOSED,
        label: "Checkmate Title",
        [APPLICATION.MODULE]: "home - banner details",
      });
    });
  });

  describe("getMyBetsBetSharingPreviewOnTapEvent", () => {
    it("should return the correct payload", () => {
      expect(getMyBetsBetSharingPreviewOnTapEvent()).toEqual({
        event: "ga_event",
        category: TaggingCategory.INTERFACE,
        action: TaggingAction.OPENED,
        label: "bet sharing - preview button",
        [APPLICATION.MODULE]: "my bets",
      });
    });
  });

  describe("getMyBetsBetSharingDismissOnTapEvent", () => {
    it("should return the correct payload", () => {
      expect(getMyBetsBetSharingDismissOnTapEvent()).toEqual({
        event: "ga_event",
        category: TaggingCategory.INTERFACE,
        action: TaggingAction.CLOSED,
        label: "bet sharing - dismiss button",
        [APPLICATION.MODULE]: "my bets",
      });
    });
  });

  describe("getMyBetsBetSharingShareBetOnTapEvent", () => {
    it("should return the correct payload", () => {
      expect(getMyBetsBetSharingShareBetOnTapEvent()).toEqual({
        event: "ga_event",
        category: TaggingCategory.INTERFACE,
        action: TaggingAction.CLICKED,
        label: "share your bet button",
        [APPLICATION.MODULE]: "share your bet popup",
      });
    });
  });

  describe("getMyBetsBetSharingShareImageOnTapEvent", () => {
    it("should return the correct payload", () => {
      expect(getMyBetsBetSharingShareImageOnTapEvent()).toEqual({
        event: "ga_event",
        category: TaggingCategory.INTERFACE,
        action: TaggingAction.CLICKED,
        label: "share image button",
        [APPLICATION.MODULE]: "share your bet popup",
      });
    });
  });
});
