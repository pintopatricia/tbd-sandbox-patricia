import { buildInterfaceEvent, buildSearchEvent } from "tagging-library";

import { Product, ProductsOption } from "../../state";
import { getBetslipVisibilityState } from "../../state/betslip/betslip-card-selectors";
import { getSportsbookBettingState } from "../../state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { LiveStreamBroadcastsOptions } from "../../state/constants";
import { getSportsbookMarketById } from "../../state/entities/sportsbook-markets/sportsbook-market-selectors";
import { createCardByURNSelector } from "../../state/layout/cards/cards-selectors";
import { MY_BETS_MODULE_NAME } from "../../state/layout/cards/MyBets.types";
import { createViewTypeSelector } from "../../state/layout/layout-selectors";
import { getLayoutMetadata } from "../../state/layout-snapshot";
import { TaggingAction } from "../tagging-resolvers/AnalyticsConstants";
import { WalletTypes } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";

import {
  getAutoConfirmSportsbookBetClickEvent,
  getBetReceiptSuccessMessageSawEvent,
  getBetReceiptToggleClickEvent,
  getBetslipAccordionHeaderClickEvent,
  getBetslipSportsbookTabSwitchEvent,
  getPlaceSportsbookBetClickEvent,
  getBetslipHeaderClickEvent,
  getBetslipSportsbookMultipleBetTypeClickEvent,
  getChangePersistenceTypeClickEvent,
  getClickEvent,
  getExchangeAutoConfirmedBetClickEvent,
  getExchangeConfirmBetClickEvent,
  getExchangePriceChangeEvent,
  getLogoutClickEvent,
  getMyAccountMenuToggleEvent,
  getMyBetsExchangeOrderStatusClickEvent,
  getOpenPersistenceTypeMenuEvent,
  getPlaceExchangeBetClickEvent,
  getConfirmSportsbookBetClickEvent,
  getEditSportsbookBetClickEvent,
  getSbkIncrementStakeEvent,
  getExcIncrementSizeEvent,
  getBetslipSbkRemoveAllEvent,
  getBetslipSbkDepositToConfirmBetClickEvent,
  getBetslipSbkDepositToPlaceBetClickEvent,
  getBetslipSbkReAddSelectionsEvent,
  getMyBetsReAddSelectionsEvent,
  getBetslipSbkNotificationShownEvent,
  getBetslipObbNotificationShownEvent,
  getMarketRulesToggleModalEvent,
  getToggleMarketGraphEvent,
  getToggleRecentRacesEvent,
  getMarketGraphSelectViewEvent,
  getMarketGraphSelectGraphEvent,
  getMarketDepthClickEvent,
  getPebbleSelectionClickEvent,
  getToggleRunnerInfoEvent,
  getToggleExpandableCardGroupEvent,
  getSearchCancelClickEvent,
  getSearchClearClickEvent,
  getGamingSearchClearClickEvent,
  getBetReceiptExchangeDoneClickEvent,
  getBetReceiptCopyToClipboardEvent,
  getSearchTabClickEvent,
  getSearchBarFocusEvent,
  getFilterOpenEvent,
  getFilterCloseEvent,
  getFilterApplyEvent,
  getFilterResetClickEvent,
  getSawCardEvent,
  getLoadedNotFoundView,
  getSwitchProductEvent,
  getOpenPredictsEvent,
  getMyBetsBetSharingDismissEvent,
  getMyBetsBetSharingPreviewEvent,
  getMyBetsBetSharingShareBetEvent,
  getMyBetsBetSharingShareImageEvent,
  getMyBetsCancelAllEvent,
  getMyBetsHeaderTooltipToggleEvent,
  getMyBetsCopyBetIdToClipboardEvent,
  getMyBetsCopyDeviceIdToClipboardEvent,
  getMyBetsEditBottomSheetCloseEvent,
  getPNInteractionClickEvent,
  getToggleShowMoreEvent,
  getStatisticsModalToggleEvent,
  getStatisticsItemClickEvent,
  getNextRacesRaceFilterClickEvent,
  getMarketSnackBarClosedEvent,
  getMarketSnackBarSuspendedEvent,
  getMyBetsOrderTypeFilterClickEvent,
  getPromoDescriptionToggleEvent,
  getToggleAccordionEvent,
  getRaceReplaysToggleEvent,
  getMaxPayoutAcceptMessageClickEvent,
  getAzSwitchToggleEvent,
  getBetslipBonusActivationEvent,
  getBroadcastsToggleEvent,
  getBroadcastsAndStatisticsToggleEvent,
  getTimeFormBroadCastsToggleEvent,
  getContentSummaryCollapseEvent,
  getBetslipEachWayToggleEvent,
  getBetslipAccaInsuranceToggleEvent,
  getBetslipMyOddsBoostToggleEvent,
  getBetslipCastBetChangeEvent,
  getBetslipCastBetOrderChangeEvent,
  getSwitcherEvent,
  getToggleTimeFormEvent,
  getOpenBetslipEvent,
  getBetslipDeeplinkEvent,
  getGenerosityWalletClick,
  getGenerosityWalletCloseEvent,
  getGenerosityWalletBetslipClickAction,
  getHeritageToggleClickEvent,
  getOpenClearBetslipEvent,
  getRefuseConfirmationEvent,
  getAcceptConfirmationEvent,
  getFreeBetsWalletToggleEvent,
  getGamingSearchCancelClickEvent,
  getGamingSearchHistoryPebbleClickEvent,
  getGamingSearchResults,
  getGamingSearchBarFocusEvent,
  getHamburgerMenuOpenEvent,
  getHamburgerMenuCloseEvent,
  getObbSelectionsEvents,
  getSquadBetPlayerPickerToggleSquadParticipantEvent,
  getClosePlayerPickerModalEvent,
  getEditSquadOpenEvent,
  getSquadBetPlayerPickerBetButtonClickEvent,
  getObbEnhancedPlayerCounterEvent,
  getGenerosityWalletPebbleClickEvent,
  getRemoveGenerosityWalletEvent,
  getGenerosityWalletApplyButtonClickEvent,
  getFavouriteMarketsLimitReachedMessageCloseEvent,
  getFavouriteMarketsToggleFavouriteEvent,
  getFavouriteMarketsTooltipCloseEvent,
  getToggleSquadVsSquadPlayersTooltipEvent,
  getBetslipSliderInteractionEvent,
  getBetslipSliderDisplayedEvent,
  getExchangeMyBetsEditClickEvent,
  getMyBetsSinglesBellClickEvent,
  getMyBetsMultiplesBellClickEvent,
  getMyBetsNotificationsCloseEvent,
  getMyBetsSaveClickEvent,
  getEventPageNotificationsToggleEvent,
  getObbEventPopularsShowMoreEvent,
  getObbOnboardingCardsCardGroupSwipeEvent,
  getObbOnboardingCardsCardGroupDisplayedEvent,
} from "./interface";
import { getClearBetslipMetrics, getModuleData, getBetMetrics } from "./helpers";

jest.mock("tagging-library", () => ({
  buildInterfaceEvent: jest.fn(() => "interface event"),
  buildSearchEvent: jest.fn(() => "search event"),
}));

jest.mock("../../state/layout/cards/cards-selectors", () => ({
  createCardByURNSelector: jest.fn(),
}));

jest.mock("../../state/entities/sportsbook-markets/sportsbook-market-selectors", () => ({
  getSportsbookMarketById: jest.fn(),
}));

jest.mock("../../state/entities/exchange-markets/exchange-market-selectors", () => ({
  createExchangeMarketSelector: jest.fn(() => jest.fn(() => ({ name: "market name" }))),
}));

jest.mock("../../state/layout/cards/cards-selectors");

const metadataMock = {
  pebbleCardGroupTitle: "pebbleCardGroup",
  tabName: "tab",
  horizontalPosition: 1,
  verticalPosition: 2,
  cardGroupTitle: "Group",
  cardLayoutTitle: "Layout",
  title: "title",
};

jest.mock("../../state/layout-snapshot", () => ({
  getLayoutMetadata: jest.fn(() => metadataMock),
}));

jest.mock("../../state/layout/layout-selectors", () => ({
  createViewTypeSelector: jest.fn(() => jest.fn(() => "home")),
}));

jest.mock("../../state/betting/sportsbook-betting/sportsbook-betting-selectors", () => ({
  getSportsbookBettingCombinations: jest.fn(() => ({ "C:12345": { betType: "SINGLE" } })),
  getSportsbookBettingState: jest.fn(),
}));

jest.mock("../../state/layout/cardgroups/pebble-cardgroups/pebble-cardgroups-selectors", () => ({
  createGetHydratedPebbleCardGroupByURNSelector: jest.fn(() =>
    jest.fn(() => ({
      items: [
        {
          urn: "pebbleURN",
          name: "label",
        },
      ],
    })),
  ),
}));

jest.mock("../../state/layout/cards/obb-card/obb-card-selectors", () => ({
  createObbSquadBetCardWithModalFieldsByURNSelector: jest.fn(() =>
    jest.fn(() => ({
      urn: "urn:test",
      modalParticipants: [{ urn: "urn:2", player: { name: "name2" } }],
      eventParticipants: [
        { urn: "urn:1", player: { name: "name" } },
        { urn: "urn:2", player: { name: "name2" } },
      ],
      typename: "ObbSquadBetCard",
    })),
  ),
  createObbSquadVsSquadCardWithModalFieldsByURNSelector: jest.fn(() =>
    jest.fn(() => ({
      urn: "urn:test1",
      eventParticipants: [
        { urn: "urn:1", player: { name: "name" } },
        { urn: "urn:2", player: { name: "name2" } },
        { urn: "urn:3", player: { name: "name3" } },
        { urn: "urn:4", player: { name: "name4" } },
      ],
      firstSquadParticipants: [
        { urn: "urn:1", player: { name: "name" } },
        { urn: "urn:2", player: { name: "name2" } },
      ],
      secondSquadParticipants: [
        { urn: "urn:3", player: { name: "name3" } },
        { urn: "urn:4", player: { name: "name4" } },
      ],
      firstSquadModalParticipants: [
        { urn: "urn:1", player: { name: "name" } },
        { urn: "urn:2", player: { name: "name2" } },
      ],
      secondSquadModalParticipants: [
        { urn: "urn:3", player: { name: "name3" } },
        { urn: "urn:4", player: { name: "name4" } },
      ],
      typename: "ObbSquadVsSquadCard",
    })),
  ),
}));

jest.mock("../../state/layout/views/event-view/event-view-selectors", () => ({
  getViewbyURN: jest.fn(() => ({ title: "viewTitle" })),
}));

jest.mock("../../helpers/tagging", () => ({
  getProductLabelByProductTypeFilterItem: jest.fn(() => "productLabel"),
  getProductLabelByProductType: jest.fn((product) => product),
}));

jest.mock("../../state/betslip/betslip-card-selectors", () => ({
  getBetslipVisibilityState: jest.fn(() => false),
}));

jest.mock("./helpers", () => ({
  getMappedBetslipTabName: jest.fn(() => "singles"),
  getClearBetslipMetrics: jest.fn(() => "clear betslip metrics"),
  getModuleData: jest.fn(() => "getModuleData"),
  getBetMetrics: jest.fn(() => ({
    betId: "betId",
    selection_id: "123",
    selection: "1234",
  })),
  getCurrentUrlOrViewType: jest.fn(() => "url or view"),
  swipedDirectionToTaggingAction: { left: "swiped left", right: "swiped right" },
}));

describe("interface", () => {
  beforeEach(jest.clearAllMocks);

  describe("getClickEvent", () => {
    it("should return the correct event payload", () => {
      const result = getClickEvent("place bet", "betslip");

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLICKED,
        elementText: "place bet",
        module: "betslip",
      });

      expect(result).toEqual("interface event");
    });
  });

  describe("getMyBetsExchangeOrderStatusClickEvent", () => {
    it("should call buildInterfaceEvent with the correct payload", () => {
      const action = {
        payload: {
          orderStatusFilterLabel: "order-status-filter-label-mock",
        },
      };

      const result = getMyBetsExchangeOrderStatusClickEvent(action, {});

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLICKED,
        elementText: "exchange - order-status-filter-label-mock",
        module: MY_BETS_MODULE_NAME,
      });
      expect(result).toEqual("interface event");
    });
  });

  describe("getBetReceiptToggleClickEvent", () => {
    it("should call buildInterfaceEvent with the correct payload", () => {
      const action = {
        payload: {
          isSelected: true,
        },
      };

      const result = getBetReceiptToggleClickEvent(action, {});

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.TOGGLE_ON,
        elementText: "receive live alerts",
        module: "bet receipt",
      });

      expect(result).toEqual("interface event");
    });
  });

  describe("getBetReceiptSuccessMessageSawEvent", () => {
    it("should call buildInterfaceEvent with the correct payload", () => {
      const action = {
        payload: {
          label: "label",
        },
      };

      const result = getBetReceiptSuccessMessageSawEvent(action, {});

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.SAW,
        elementText: "label",
        module: "bet receipt",
      });
      expect(result).toEqual("interface event");
    });
  });

  describe("getMyAccountMenuToggleEvent", () => {
    describe.each([
      [true, TaggingAction.OPENED],
      [false, TaggingAction.CLOSED],
    ])("when opened action is `%s`", (opened, gaAction) => {
      it("should call buildInterfaceEvent with the correct payload", () => {
        const action = {
          payload: opened,
        };

        const result = getMyAccountMenuToggleEvent(action);

        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action: gaAction,
          elementText: "my account",
          module: `header`,
        });
        expect(result).toEqual("interface event");
      });
    });
  });

  describe("getBetslipSbkRemoveAllEvent", () => {
    it("should call buildInterfaceEvent with the correct payload", () => {
      const result = getBetslipSbkRemoveAllEvent();

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLICKED,
        elementText: "remove all selections",
        module: "betslip",
      });
      expect(result).toEqual("interface event");
    });
  });

  describe("getBetslipSbkDepositToConfirmBetClickEvent", () => {
    it("should call buildInterfaceEvent with the correct payload", () => {
      const result = getBetslipSbkDepositToConfirmBetClickEvent();

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLICKED,
        elementText: "deposit to confirm bet",
        module: "betslip",
      });
      expect(result).toEqual("interface event");
    });
  });

  describe("getBetslipSbkDepositToPlaceBetClickEvent", () => {
    it("should call buildInterfaceEvent with the correct payload", () => {
      const result = getBetslipSbkDepositToPlaceBetClickEvent();

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLICKED,
        elementText: "deposit to place bet",
        module: "betslip",
      });
      expect(result).toEqual("interface event");
    });
  });

  describe("getBetslipSbkReAddSelectionsEvent", () => {
    it("should call buildInterfaceEvent with the correct payload", () => {
      const result = getBetslipSbkReAddSelectionsEvent();

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.ADD_PREVIOUS_SELECTIONS,
        elementText: "full receipt",
        module: "bet receipt",
      });
      expect(result).toEqual("interface event");
    });
  });

  describe("getMyBetsReAddSelectionsEvent", () => {
    it("should call buildInterfaceEvent with the correct payload", () => {
      const action = {
        payload: {
          source: "open",
        },
      };
      const result = getMyBetsReAddSelectionsEvent(action);

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.ADD_PREVIOUS_SELECTIONS,
        elementText: "re-use selections",
        module: "my bets - open",
      });
      expect(result).toEqual("interface event");
    });
  });

  describe("getBetslipSbkNotificationShownEvent", () => {
    it("should call buildInterfaceEvent with the correct payload", () => {
      const action = {
        payload: {
          label: "label",
        },
      };

      const result = getBetslipSbkNotificationShownEvent(action, {});

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.SAW,
        elementText: "label",
        module: "betslip",
      });
      expect(result).toEqual("interface event");
    });
  });

  describe("getBetslipObbNotificationShownEvent", () => {
    it("should call buildInterfaceEvent with the correct payload", () => {
      const action = {
        payload: {
          label: "label",
        },
      };

      const result = getBetslipObbNotificationShownEvent(action, {});

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.SAW,
        elementText: "label",
        module: "betslip",
      });
      expect(result).toEqual("interface event");
    });
  });

  describe("getMarketRulesToggleModalEvent", () => {
    describe.each([
      [true, TaggingAction.OPENED],
      [false, TaggingAction.CLOSED],
    ])("when open param is `%s`", (open, gaAction) => {
      it("should call buildInterfaceEvent with the correct payload", () => {
        const action = {
          payload: {
            open,
          },
        };

        const result = getMarketRulesToggleModalEvent(action, {});

        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action: gaAction,
          elementText: "market rules",
          module: "home - market rules",
        });
        expect(result).toEqual("interface event");
      });
    });
  });

  describe("getToggleMarketGraphEvent", () => {
    describe.each([
      [true, TaggingAction.CLOSED, "market graphs"],
      [false, TaggingAction.OPENED, "runnerName - market graphs"],
    ])("when isClosed param is `%s`", (isClosed, gaAction, elementText) => {
      it("should call buildInterfaceEvent with the correct payload", () => {
        const action = {
          payload: {
            runnerName: "runnerName",
            marketName: "marketName",
            isClosed,
          },
        };

        const result = getToggleMarketGraphEvent(action, {});

        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action: gaAction,
          elementText,
          module: "home - marketName",
        });
        expect(result).toEqual("interface event");
      });
    });
  });

  describe("getToggleRecentRacesEvent", () => {
    const state = {
      layouts: {
        cards: {
          racemarkets: {
            "ppb:tbd:card:raceMarket:urn": { typename: "RaceMarketCard" },
          },
          markets: {
            "ppb:tbd:card:market:urn": { typename: "MarketCard" },
          },
        },
      },
    };

    describe.each([
      ["RaceMarketCard", true, TaggingAction.CLOSED],
      ["RaceMarketCard", false, TaggingAction.OPENED],
      ["MarketCard", true, TaggingAction.CLOSED],
      ["MarketCard", false, TaggingAction.OPENED],
    ])("when the card is `%s` and isClosed param is `%s`", (typename, isClosed, gaAction) => {
      it("should call buildInterfaceEvent with the correct payload", () => {
        createCardByURNSelector.mockReturnValueOnce(() => ({ typename }));
        const action = {
          payload: {
            runnerName: "runnerName",
            cardUrn: "cardUrn",
            isClosed,
          },
        };

        const result = getToggleRecentRacesEvent(action, state);

        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action: gaAction,
          elementText: "recent races - runnerName",
          module: `home - ${typename.toLowerCase()}`,
        });
        expect(result).toEqual("interface event");
      });
    });

    describe("when the card is not found", () => {
      it("should not call buildInterfaceEvent", () => {
        createCardByURNSelector.mockReturnValueOnce(() => undefined);
        createCardByURNSelector.mockReturnValueOnce(() => undefined);

        const action = {
          payload: {
            runnerName: "runnerName",
            cardUrn: "cardUrn",
            isClosed: true,
          },
        };

        const result = getToggleRecentRacesEvent(action, state);

        expect(buildInterfaceEvent).not.toHaveBeenCalled();
        expect(result).toEqual(null);
      });
    });
  });

  describe("getMarketGraphSelectViewEvent", () => {
    it("should call buildInterfaceEvent with the correct payload", () => {
      const action = {
        payload: {
          label: "label",
        },
      };

      const result = getMarketGraphSelectViewEvent(action, {});

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLICKED,
        elementText: "label",
        module: "market graphs",
      });
      expect(result).toEqual("interface event");
    });
  });

  describe("getMarketGraphSelectGraphEvent", () => {
    it("should call buildInterfaceEvent with the correct payload", () => {
      const action = {
        payload: {
          label: "label",
        },
      };

      const result = getMarketGraphSelectGraphEvent(action, {});

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLICKED,
        elementText: "label",
        module: "market graphs",
      });
      expect(result).toEqual("interface event");
    });
  });

  describe("getMarketDepthClickEvent", () => {
    const state = {
      entities: {
        exchangemarkets: "state",
      },
    };

    describe.each([
      [true, TaggingAction.OPENED],
      [false, TaggingAction.CLOSED],
    ])("when isActive param is `%s`", (isActive, gaAction) => {
      it("should call buildInterfaceEvent with the correct payload", () => {
        const action = {
          payload: {
            isActive,
            urn: "urn",
          },
        };

        const result = getMarketDepthClickEvent(action, state);

        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action: gaAction,
          elementText: "market name - market depth",
          module: "market - market depth",
        });
        expect(result).toEqual("interface event");
      });
    });
  });

  describe("getLogoutClickEvent", () => {
    it("should call buildInterfaceEvent with the correct payload", () => {
      const result = getLogoutClickEvent();

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLICKED,
        elementText: "my account - logout",
        module: "header",
      });

      expect(result).toEqual("interface event");
    });
  });

  describe("getBetslipHeaderClickEvent", () => {
    it("should return the correct event payload", () => {
      const action = {
        payload: {
          isCollapsed: false,
          betslipSubType: "EXCHANGE",
        },
      };

      const result = getBetslipHeaderClickEvent(action, {});

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.OPENED,
        elementText: "exchange betslip",
        module: "betslip",
      });

      expect(result).toEqual("interface event");
    });
  });

  describe("getBetslipAccordionHeaderClickEvent", () => {
    it("should return the correct event payload", () => {
      const action = {
        payload: {
          isExpanded: false,
        },
      };

      const result = getBetslipAccordionHeaderClickEvent(action, {});

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.COLLAPSE,
        elementText: "selections",
        module: "betslip",
      });

      expect(result).toEqual("interface event");
    });
  });

  describe("getBetslipSportsbookTabSwitchEvent", () => {
    it("should return the correct event payload", () => {
      const action = {
        payload: {
          tabName: "singles",
        },
      };

      const result = getBetslipSportsbookTabSwitchEvent(action);

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLICKED,
        elementText: "singles",
        module: "betslip",
      });

      expect(result).toEqual("interface event");
    });
  });

  describe("getConfirmSportsbookBetClickEvent", () => {
    it("should return the correct event payload", () => {
      const result = getConfirmSportsbookBetClickEvent();

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CONFIRMED_BET,
        elementText: "confirm bet",
        module: "betslip",
      });

      expect(result).toEqual("interface event");
    });
  });

  describe("getEditSportsbookBetClickEvent", () => {
    it("should return the correct event payload", () => {
      const result = getEditSportsbookBetClickEvent();

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.EDITED_BET,
        elementText: "edit bet",
        module: "betslip",
      });

      expect(result).toEqual("interface event");
    });
  });

  describe("getBetslipSportsbookMultipleBetTypeClickEvent", () => {
    it("should return the correct event payload", () => {
      const action = {
        payload: {
          combinationId: "C:12345",
        },
      };

      const result = getBetslipSportsbookMultipleBetTypeClickEvent(action, {});

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLICKED,
        elementText: "SINGLE",
        module: "betslip",
      });
      expect(result).toEqual("interface event");
    });
  });

  describe("getPebbleSelectionClickEvent", () => {
    describe("when is not PackagedCreatedBetsCard", () => {
      it("should call buildInterfaceEvent with the correct payload", () => {
        const action = {
          payload: {
            cardGroupURN: "cardGroupURN",
            pebbleURN: "pebbleURN",
            pebbleTypename: "SomeCard",
          },
        };
        const state = {
          layouts: { cardgroups: {} },
        };

        const result = getPebbleSelectionClickEvent(action, state);

        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action: TaggingAction.CLICKED,
          elementText: "label",
          module: "market - market pebbles",
        });
        expect(result).toEqual("interface event");
      });
    });

    describe("when is PackagedCreatedBetsCard", () => {
      it("should call buildInterfaceEvent with the correct payload", () => {
        const action = {
          payload: {
            cardGroupURN: "cardGroupURN",
            pebbleURN: "pebbleURN",
            pebbleTypename: "PackagedCreatedBetsCard",
          },
        };
        const state = {
          layouts: { cardgroups: {} },
        };

        const result = getPebbleSelectionClickEvent(action, state);

        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action: TaggingAction.CLICKED,
          elementText: "label",
          module: "home - pebbleCardGroup - tab",
        });
        expect(result).toEqual("interface event");
      });
    });
  });

  describe("getExchangePriceChangeEvent", () => {
    it("should return the correct event payload", () => {
      const result = getExchangePriceChangeEvent();

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CHANGED_ODDS,
        elementText: "betting",
        module: "betslip",
      });

      expect(result).toEqual("interface event");
    });
  });

  describe("getChangePersistenceTypeClickEvent", () => {
    it("should return the correct event payload", () => {
      const action = {
        payload: {
          betId: "12345",
          persistenceType: "LAPSE",
        },
      };

      const result = getChangePersistenceTypeClickEvent(action, {});

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.TOGGLE_ON,
        elementText: "LAPSE",
        module: "betslip",
      });

      expect(result).toEqual("interface event");
    });
  });

  describe("getOpenPersistenceTypeMenuEvent", () => {
    it("should return the correct event payload", () => {
      const result = getOpenPersistenceTypeMenuEvent();

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.SHOW,
        elementText: "at in play options",
        module: "betslip",
      });

      expect(result).toEqual("interface event");
    });
  });

  describe("getExchangeConfirmBetClickEvent", () => {
    it("should return the correct event payload", () => {
      const result = getExchangeConfirmBetClickEvent();

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CONFIRMED_BET,
        elementText: "place bet",
        module: "betslip",
      });

      expect(result).toEqual("interface event");
    });
  });

  describe("getPlaceSportsbookBetClickEvent", () => {
    it("should return the correct event payload", () => {
      const result = getPlaceSportsbookBetClickEvent();

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.SUBMITTED_BET,
        elementText: "place bet",
        module: "betslip",
      });

      expect(result).toEqual("interface event");
    });
  });

  describe("getSbkIncrementStakeEvent", () => {
    it("should call buildInterfaceEvent with the correct payload", () => {
      const action = {
        payload: {
          increment: 5,
          currencySymbol: "€",
        },
      };

      const result = getSbkIncrementStakeEvent(action, {});

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.SELECTED,
        elementText: "+€5 quick stake",
        module: "betslip",
      });
      expect(result).toBe("interface event");
    });
  });

  describe("getExcIncrementSizeEvent", () => {
    it("should call buildInterfaceEvent with the correct payload", () => {
      const action = {
        payload: {
          increment: 5,
          currencySymbol: "€",
        },
      };

      const result = getExcIncrementSizeEvent(action, {});

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.SELECTED,
        elementText: "+€5 quick stake",
        module: "betslip",
      });
      expect(result).toBe("interface event");
    });
  });

  describe("getAutoConfirmSportsbookBetClickEvent", () => {
    it("should call buildInterfaceEvent with the correct payload", () => {
      const result = getAutoConfirmSportsbookBetClickEvent();

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.AUTO_CONFIRMED_BET,
        elementText: "place bet",
        module: "betslip",
      });

      expect(result).toEqual("interface event");
    });
  });

  describe("getPlaceExchangeBetClickEvent", () => {
    it("should return the correct event payload", () => {
      const result = getPlaceExchangeBetClickEvent();

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.SUBMITTED_BET,
        elementText: "place bet",
        module: "betslip",
      });

      expect(result).toEqual("interface event");
    });
  });

  describe("getExchangeAutoConfirmedBetClickEvent", () => {
    it("should return the correct event payload", () => {
      const result = getExchangeAutoConfirmedBetClickEvent();

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.AUTO_CONFIRMED_BET,
        elementText: "place bet",
        module: "betslip",
      });

      expect(result).toEqual("interface event");
    });
  });

  describe("getExchangeMyBetsEditClickEvent", () => {
    const action = {
      payload: {
        betId: "12345",
      },
    };

    const appState = {
      entities: {
        sports: "sports",
        competitions: "competitions",
        exchangemarkets: "exchangemarkets",
        exchangerunners: "exchangerunners",
        sportevents: "sportevents",
        exchangePotentialBets: [],
      },
    };

    describe("when betMetrics is defined", () => {
      it("should return the event payload", () => {
        const result = getExchangeMyBetsEditClickEvent(action, appState);

        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action: TaggingAction.EDIT_UNMATCHED_BET,
          elementText: "betId: 12345 selection: 1234 selectionId: 123",
          module: "betslip",
        });

        expect(result).toEqual("interface event");
      });
    });

    describe("when betMetrics attributes are not defined", () => {
      it("should return the event payload with empty strings", () => {
        getBetMetrics.mockReturnValueOnce(() => undefined);

        const result = getExchangeMyBetsEditClickEvent(action, appState);

        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action: TaggingAction.EDIT_UNMATCHED_BET,
          elementText: "betId: 12345 selection:  selectionId: ",
          module: "betslip",
        });

        expect(result).toEqual("interface event");
      });
    });
  });

  describe("getSearchTabClickEvent", () => {
    it("should call buildInterfaceEvent with the correct payload", () => {
      const result = getSearchTabClickEvent({ payload: "text" });

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLICKED,
        elementText: "market module product switcher - text",
        module: "search menu",
      });

      expect(result).toEqual("interface event");
    });
  });

  describe("getFilterOpenEvent", () => {
    it("should return the correct event payload", () => {
      const action = {
        payload: {
          label: "today",
        },
      };

      const result = getFilterOpenEvent(action, {});

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.OPENED,
        elementText: "today",
        module: "filter",
      });

      expect(result).toEqual("interface event");
    });
  });

  describe("getSearchBarFocusEvent", () => {
    beforeEach(() => {
      getModuleData.mockImplementationOnce((...value) => value.filter(Boolean).join(" - "));
    });

    it("should call buildInterfaceEvent with the correct payload", () => {
      const result = getSearchBarFocusEvent();

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLICKED,
        elementText: "search box",
        module: "search menu - url or view",
      });

      expect(result).toEqual("interface event");
    });
  });

  describe("getGamingSearchBarFocusEvent", () => {
    it("should call buildInterfaceEvent with the correct payload", () => {
      const result = getGamingSearchBarFocusEvent();

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLICKED,
        elementText: "search box",
        module: "games search",
      });

      expect(result).toEqual("interface event");
    });
  });

  describe("getSearchCancelClickEvent", () => {
    it("should call buildInterfaceEvent with the correct payload", () => {
      const result = getSearchCancelClickEvent({ payload: { text: "text" } });

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CANCELLED,
        elementText: "search text - text",
        module: "search",
      });

      expect(result).toEqual("interface event");
    });
  });

  describe("getSearchClearClickEvent", () => {
    it("should call buildInterfaceEvent with the correct payload", () => {
      const result = getSearchClearClickEvent({ payload: { text: "text" } });

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLEARED,
        elementText: "search text - text",
        module: "search",
      });

      expect(result).toEqual("interface event");
    });
  });

  describe("getGamingSearchClearClickEvent", () => {
    it("should call buildInterfaceEvent with the correct payload", () => {
      const result = getGamingSearchClearClickEvent({ payload: { text: "text" } });

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLEARED,
        elementText: "search text - text",
        module: "games search",
      });

      expect(result).toEqual("interface event");
    });
  });

  describe("getGamingSearchCancelClickEvent", () => {
    it("should call buildInterfaceEvent with the correct payload", () => {
      const result = getGamingSearchCancelClickEvent();

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLICKED,
        elementText: "cancel",
        module: "games search",
      });

      expect(result).toEqual("interface event");
    });
  });

  describe("getGamingSearchHistoryPebbleClickEvent", () => {
    it("returns a valid InterfaceEvent", () => {
      const result = getGamingSearchHistoryPebbleClickEvent({ payload: { text: "chelsea" } });

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLICKED,
        elementText: "search pebbles - chelsea",
        module: "search pebbles",
      });

      expect(result).toEqual("interface event");
    });
  });

  describe("getGamingSearchResults", () => {
    it("should call buildSearchEvent with the correct payload when there are results", () => {
      const result = getGamingSearchResults({
        payload: { gamingSearchResults: ["game 1", "game 2"], inputSearchTerm: "game" },
      });

      expect(buildSearchEvent).toHaveBeenCalledWith({
        searchTerm: "game",
        searchCount: "2",
        searchResult: "true",
      });

      expect(result).toEqual("search event");
    });

    it("should call buildSearchEvent with the correct payload when there are no results", () => {
      const result = getGamingSearchResults({ payload: { gamingSearchResults: [], inputSearchTerm: "game" } });

      expect(buildSearchEvent).toHaveBeenCalledWith({
        searchTerm: "game",
        searchCount: "0",
        searchResult: "false",
      });

      expect(result).toEqual("search event");
    });
  });

  describe("getToggleRunnerInfoEvent", () => {
    describe.each([
      [true, TaggingAction.OPENED],
      [false, TaggingAction.CLOSED],
    ])("when isOpening is %s", (isOpening, action) => {
      it("should call buildInterfaceEvent with the correct payload", () => {
        const result = getToggleRunnerInfoEvent({
          payload: { isOpening, runnerName: "runnerName", marketName: "marketName" },
        });

        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action,
          elementText: "runner info - runnerName",
          module: "home - marketName",
        });

        expect(result).toEqual("interface event");
      });
    });
  });

  describe("getToggleExpandableCardGroupEvent", () => {
    describe("when title is undefined", () => {
      it("should call buildInterfaceEvent with the correct payload with default elementText", () => {
        const result = getToggleExpandableCardGroupEvent(
          { payload: { isExpanded: true, title: undefined } },
          { layouts: { views: "views" }, router: { currentUrn: "urn" } },
        );

        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action: TaggingAction.EXPAND,
          elementText: "",
          module: "home - viewTitle",
        });

        expect(result).toEqual("interface event");
      });
    });

    describe.each([
      [true, TaggingAction.EXPAND],
      [false, TaggingAction.COLLAPSE],
    ])("when isExpanded is %s", (isExpanded, action) => {
      it("should call buildInterfaceEvent with the correct payload", () => {
        const result = getToggleExpandableCardGroupEvent(
          { payload: { isExpanded, title: "title" } },
          { layouts: { views: "views" }, router: { currentUrn: "urn" } },
        );

        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action,
          elementText: "title",
          module: "home - viewTitle",
        });

        expect(result).toEqual("interface event");
      });
    });
  });

  describe("getBetReceiptExchangeDoneClickEvent", () => {
    it("should call buildInterfaceEvent with the correct payload", () => {
      const result = getBetReceiptExchangeDoneClickEvent();

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLOSED,
        elementText: "bet receipt",
        module: "bet receipt",
      });
      expect(result).toEqual("interface event");
    });
  });

  describe("getFilterCloseEvent", () => {
    it("should return the correct event payload", () => {
      const result = getFilterCloseEvent();

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLOSED,
        elementText: "cancel",
        module: "filter",
      });

      expect(result).toEqual("interface event");
    });
  });

  describe("getFilterApplyEvent", () => {
    it("should return the correct event payload", () => {
      const action = {
        payload: {
          selectedOptions: ["opt 1, opt 2"],
          module: "filter",
        },
      };

      const result = getFilterApplyEvent(action, {});

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLICKED,
        elementText: "opt 1, opt 2",
        module: "filter",
      });
      expect(result).toEqual("interface event");
    });
  });

  describe("getBetslipBonusActivationEvent", () => {
    describe("when isFreeBetsSelected is false", () => {
      it("should call buildInterfaceEvent with the correct payload", () => {
        const action = {
          payload: {
            isFreeBetsSelected: false,
            product: Product.Exchange,
          },
        };
        const result = getBetslipBonusActivationEvent(action, {});

        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action: TaggingAction.TOGGLE_OFF,
          elementText: `use elegible bonus ${Product.Exchange}`,
          module: "betslip",
        });
        expect(result).toEqual("interface event");
      });
    });

    describe("when isFreeBetsSelected is true", () => {
      it("should call buildInterfaceEvent with the correct payload", () => {
        const action = {
          payload: {
            isFreeBetsSelected: true,
            product: Product.Exchange,
          },
        };
        const result = getBetslipBonusActivationEvent(action, {});

        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action: TaggingAction.TOGGLE_ON,
          elementText: `use elegible bonus ${Product.Exchange}`,
          module: "betslip",
        });
        expect(result).toEqual("interface event");
      });
    });
  });

  describe("getFilterResetClickEvent", () => {
    it("should return the correct event payload", () => {
      const action = {
        payload: {
          label: "reset mock",
        },
      };

      const result = getFilterResetClickEvent(action, {});

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLICKED,
        elementText: "reset mock",
        module: "filter",
      });

      expect(result).toEqual("interface event");
    });
  });

  describe("getSawCardEvent", () => {
    it("should return the correct event payload", () => {
      const action = {
        payload: {
          label: "reset mock",
          moduleName: "module mock",
        },
      };

      const result = getSawCardEvent(action, {});

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.SAW,
        elementText: "reset mock",
        module: "module mock",
      });

      expect(result).toEqual("interface event");
    });
  });

  describe("getLoadedNotFoundView", () => {
    it("should return the correct event payload", () => {
      const appState = {
        router: {
          currentUrl: "notfound/404-notfound",
        },
      };

      const result = getLoadedNotFoundView({}, appState);

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.DISPLAYED,
        elementText: "notfound/404-notfound",
        module: "error",
      });

      expect(result).toEqual("interface event");
    });
  });

  describe("getSwitchProductEvent", () => {
    it("should return the correct event payload", () => {
      const action = {
        payload: {
          productSwitcherPreference: ProductsOption.sportsbook,
        },
      };
      const result = getSwitchProductEvent(action, {});

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.SWITCH_PRODUCT,
        elementText: "sportsbook",
        module: "home - bottom ribbon",
      });

      expect(result).toEqual("interface event");
    });
  });

  describe("getOpenPredictsEvent", () => {
    it("should return a SWITCH_PRODUCT event with the 'Predicts' label", () => {
      const result = getOpenPredictsEvent({ type: "UI/OPEN_PREDICTS" }, {});

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.SWITCH_PRODUCT,
        elementText: "Predicts",
        module: "home - bottom ribbon",
      });

      expect(result).toEqual("interface event");
    });
  });

  describe("getBetslipDeepLinkEvent", () => {
    describe("should return the correct event payload when isBetSharing is false", () => {
      it("should return the correct event payload", () => {
        const result = getBetslipDeeplinkEvent({ payload: { isBetSharing: false } }, {});

        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action: TaggingAction.SAW,
          elementText: "betslip deeplink",
          module: "betslip",
        });

        expect(result).toEqual("interface event");
      });
    });

    describe("should return the correct event payload when isBetSharing is true", () => {
      it("should return the correct event payload", () => {
        const result = getBetslipDeeplinkEvent({ payload: { isBetSharing: true } }, {});

        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action: TaggingAction.SAW,
          elementText: "betslip deeplink - bet sharing",
          module: "betslip",
        });

        expect(result).toEqual("interface event");
      });
    });
  });

  describe("getFavouriteMarketsToggleFavouriteEvent", () => {
    it("should return the correct event payload", () => {
      const result = getFavouriteMarketsToggleFavouriteEvent(
        {
          payload: {
            isFavourite: true,
            contentSectionURN: "urn:content:section:mock",
          },
        },
        {},
      );

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLICKED,
        elementText: "favourite",
        module: "home - title - tab",
      });
      expect(result).toEqual("interface event");
      expect(getLayoutMetadata).toHaveBeenCalledWith("urn:content:section:mock");
    });
  });

  describe("getFavouriteMarketsTooltipCloseEvent", () => {
    it("should return the correct event payload", () => {
      const result = getFavouriteMarketsTooltipCloseEvent();

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLOSED,
        elementText: "check the start tab for your favourite markets",
        module: "favourite popup message",
      });
      expect(result).toEqual("interface event");
    });
  });

  describe("getFavouriteMarketsLimitReachedMessageCloseEvent", () => {
    it("should return the correct event payload", () => {
      const result = getFavouriteMarketsLimitReachedMessageCloseEvent();

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLOSED,
        elementText: "favourites limit reached",
        module: "favourite popup message",
      });
      expect(result).toEqual("interface event");
    });
  });

  describe("getMyBetsBetSharingDismissEvent", () => {
    it("should return the correct event payload", () => {
      const result = getMyBetsBetSharingDismissEvent();

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLOSED,
        elementText: "bet sharing - dismiss button",
        module: MY_BETS_MODULE_NAME,
      });

      expect(result).toEqual("interface event");
    });
  });

  describe("getMyBetsBetSharingPreviewEvent", () => {
    it("should return the correct event payload", () => {
      const result = getMyBetsBetSharingPreviewEvent();

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.OPENED,
        elementText: "bet sharing - preview button",
        module: MY_BETS_MODULE_NAME,
      });

      expect(result).toEqual("interface event");
    });
  });

  describe("getMyBetsBetSharingShareBetEvent", () => {
    it("should return the correct event payload", () => {
      const result = getMyBetsBetSharingShareBetEvent();

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLICKED,
        elementText: "share your bet button",
        module: "share your bet popup",
      });

      expect(result).toEqual("interface event");
    });
  });

  describe("getMyBetsBetSharingShareImageEvent", () => {
    it("should return the correct event payload", () => {
      const result = getMyBetsBetSharingShareImageEvent();

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLICKED,
        elementText: "share image button",
        module: "share your bet popup",
      });

      expect(result).toEqual("interface event");
    });
  });

  describe("getMyBetsCancelAllEvent", () => {
    it("should return the correct event payload", () => {
      const result = getMyBetsCancelAllEvent();

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLICKED,
        elementText: "cancel all",
        module: MY_BETS_MODULE_NAME,
      });

      expect(result).toEqual("interface event");
    });
  });

  describe("getMyBetsHeaderTooltipToggleEvent", () => {
    it("should return the correct isToolTip opened", () => {
      const action = {
        payload: {
          isTooltipOpen: true,
        },
      };

      const result = getMyBetsHeaderTooltipToggleEvent(action);

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.OPENED,
        elementText: "bets before - tool tip",
        module: MY_BETS_MODULE_NAME,
      });

      expect(result).toEqual("interface event");
    });

    it("should return the correct isToolTip closed", () => {
      const action = {
        payload: {
          isTooltipOpen: false,
        },
      };

      const result = getMyBetsHeaderTooltipToggleEvent(action);

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLOSED,
        elementText: "bets before - tool tip",
        module: MY_BETS_MODULE_NAME,
      });

      expect(result).toEqual("interface event");
    });
  });

  describe("getMyBetsEditBottomSheetCloseEvent", () => {
    it("should return the correct event payload when close button was pressed", () => {
      const action = {
        payload: {
          wasCloseButtonPressed: true,
        },
      };
      const result = getMyBetsEditBottomSheetCloseEvent(action, {});

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLOSED,
        elementText: "edit bet",
        module: "edit bet bottom sheet",
      });

      expect(result).toEqual("interface event");
    });

    it("shouldn't return null when close button was not pressed", () => {
      const action = {
        payload: {
          wasCloseButtonPressed: false,
        },
      };
      const result = getMyBetsEditBottomSheetCloseEvent(action, {});

      expect(buildInterfaceEvent).not.toHaveBeenCalled();

      expect(result).toEqual(null);
    });
  });

  describe("getPNInteractionClickEvent", () => {
    it("should return the correct event payload", () => {
      const action = {
        payload: {
          label: "label mock",
          module: "module mock",
        },
      };
      const result = getPNInteractionClickEvent(action, {});

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLICKED,
        elementText: "label mock",
        module: "module mock",
      });

      expect(result).toEqual("interface event");
    });
  });

  describe("getMyBetsSinglesBellClickEvent", () => {
    describe("when notification is turned on", () => {
      it("should return the correct event payload", () => {
        const action = {
          payload: {
            toggleOn: true,
            betType: "SGL",
            sportId: "1",
          },
        };
        const result = getMyBetsSinglesBellClickEvent(action);

        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action: TaggingAction.CLICKED,
          elementText: "notification turned on",
          module: "my bets - open - notifications icon - SGL - 1",
        });

        expect(result).toEqual("interface event");
      });
    });

    describe("when notification is turned off", () => {
      it("should return the correct event payload", () => {
        const action = {
          payload: {
            toggleOn: false,
            betType: "SGL",
            sportId: "7",
          },
        };
        const result = getMyBetsSinglesBellClickEvent(action);

        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action: TaggingAction.CLICKED,
          elementText: "notification turned off",
          module: "my bets - open - notifications icon - SGL - 7",
        });

        expect(result).toEqual("interface event");
      });
    });
  });

  describe("getMyBetsMultiplesBellClickEvent", () => {
    it("should return the correct event payload with subscribed count and total fixtures", () => {
      const action = {
        payload: {
          subscribedCount: 2,
          numberOfEvents: 5,
          betType: "ACC4",
        },
      };
      const result = getMyBetsMultiplesBellClickEvent(action);

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.OPENED,
        elementText: "subscribed - 2/5",
        module: "my bets - open - notifications overlay - ACC4",
      });

      expect(result).toEqual("interface event");
    });

    it("should return the correct event payload with zero subscribed events", () => {
      const action = {
        payload: {
          subscribedCount: 0,
          numberOfEvents: 3,
          betType: "TBL",
        },
      };
      const result = getMyBetsMultiplesBellClickEvent(action);

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.OPENED,
        elementText: "subscribed - 0/3",
        module: "my bets - open - notifications overlay - TBL",
      });

      expect(result).toEqual("interface event");
    });
  });

  describe("getMyBetsNotificationsCloseEvent", () => {
    it("should return the correct event payload with the bet type", () => {
      const action = {
        payload: {
          betType: "SGL",
        },
      };
      const result = getMyBetsNotificationsCloseEvent(action);

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLOSED,
        elementText: "close",
        module: "my bets - open - notifications overlay - SGL",
      });

      expect(result).toEqual("interface event");
    });
  });
  describe("getMyBetsSaveClickEvent", () => {
    it("should return the correct event payload with multiple sports", () => {
      const action = {
        payload: {
          subscribedCount: 3,
          numberOfEvents: 4,
          betType: "TBL",
          sportsIds: "1,7,21",
        },
      };
      const result = getMyBetsSaveClickEvent(action);

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLICKED,
        elementText: "saved - 3/4",
        module: "my bets - open - notifications overlay - TBL - 1,7,21",
      });

      expect(result).toEqual("interface event");
    });

    it("should return the correct event payload with zero subscribed events", () => {
      const action = {
        payload: {
          subscribedCount: 0,
          numberOfEvents: 3,
          betType: "SGL",
          sportsIds: "",
        },
      };
      const result = getMyBetsSaveClickEvent(action);

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLICKED,
        elementText: "saved - 0/3",
        module: "my bets - open - notifications overlay - SGL",
      });

      expect(result).toEqual("interface event");
    });
  });

  describe("getEventPageNotificationsToggleEvent", () => {
    it("should return the correct event payload when toggle is ON", () => {
      const action = {
        payload: {
          isSelected: true,
          moduleName: "sport-notification-competition-match",
        },
      };
      const result = getEventPageNotificationsToggleEvent(action);

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.TOGGLE_ON,
        elementText: "push notifications",
        module: "sport-notification-competition-match",
      });

      expect(result).toEqual("interface event");
    });

    it("should return the correct event payload when toggle is OFF", () => {
      const action = {
        payload: {
          isSelected: false,
          moduleName: "sport-notification-competition-match",
        },
      };
      const result = getEventPageNotificationsToggleEvent(action);

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.TOGGLE_OFF,
        elementText: "push notifications",
        module: "sport-notification-competition-match",
      });

      expect(result).toEqual("interface event");
    });
  });

  describe("getToggleShowMoreEvent", () => {
    it("should return the correct event payload", () => {
      const action = {
        payload: {
          cardUrn: "card:URN",
          parents: ["parent 1", "parent 2"],
          showMore: true,
        },
      };
      const result = getToggleShowMoreEvent(action, {});

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLICKED,
        elementText: "Show More",
        module: "home - tab - pebbleCardGroup",
      });

      expect(result).toEqual("interface event");
    });

    describe("when gaModuleSuffix is defined", () => {
      it("should return the correct event payload", () => {
        const action = {
          payload: {
            cardUrn: "card:URN",
            parents: ["parent 1", "parent 2"],
            showMore: true,
            gaModuleSuffix: "safesub",
          },
        };
        const result = getToggleShowMoreEvent(action, {});

        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action: TaggingAction.CLICKED,
          elementText: "Show More",
          module: "home - tab - pebbleCardGroup safesub",
        });

        expect(result).toEqual("interface event");
      });
    });
  });

  describe("getStatisticsModalToggleEvent", () => {
    describe("when isOpen is false", () => {
      it("should call buildInterfaceEvent with the correct action", () => {
        const result = getStatisticsModalToggleEvent({ payload: { label: "label", isOpen: false } }, "state");

        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action: TaggingAction.CLOSED,
          elementText: "label",
          module: "home - stats and viz",
        });
        expect(result).toBe("interface event");
      });
    });

    describe("when isOpen is true", () => {
      it("should call buildInterfaceEvent with the correct action", () => {
        const result = getStatisticsModalToggleEvent({ payload: { label: "label", isOpen: true } }, "state");

        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action: TaggingAction.OPENED,
          elementText: "label",
          module: "home - stats and viz",
        });
        expect(result).toBe("interface event");
      });
    });
  });

  describe("getStatisticsItemClickEvent", () => {
    it("should call buildInterfaceEvent with the correct payload", () => {
      const result = getStatisticsItemClickEvent({ payload: { label: "label" } });

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLICKED,
        elementText: "label",
        module: "statistics",
      });
      expect(result).toBe("interface event");
    });
  });

  describe("getNextRacesRaceFilterClickEvent", () => {
    it("should call buildInterfaceEvent with the correct payload", () => {
      const result = getNextRacesRaceFilterClickEvent({ payload: { label: "label" } }, "state");

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLICKED,
        elementText: "label",
        module: "home - race region switcher",
      });
      expect(result).toBe("interface event");
    });
  });

  describe("getMarketSnackBarClosedEvent", () => {
    it("should call buildInterfaceEvent with the correct payload", () => {
      const result = getMarketSnackBarClosedEvent();

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.SAW,
        elementText: "closed",
        module: "market snack bar",
      });
      expect(result).toBe("interface event");
    });
  });

  describe("getMarketSnackBarSuspendedEvent", () => {
    it("should call buildInterfaceEvent with the correct payload", () => {
      const result = getMarketSnackBarSuspendedEvent();

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.SAW,
        elementText: "suspended",
        module: "market snack bar",
      });
      expect(result).toBe("interface event");
    });
  });

  describe("getAzSwitchToggleEvent", () => {
    describe("when isToggleOn is false", () => {
      it("should call buildInterfaceEvent with the correct payload", () => {
        const result = getAzSwitchToggleEvent({ payload: { label: "label", isToggleOn: false } });

        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action: TaggingAction.TOGGLE_OFF,
          elementText: "label",
          module: "sort",
        });
        expect(result).toBe("interface event");
      });
    });

    describe("when isToggleOn is true", () => {
      it("should call buildInterfaceEvent with the correct payload", () => {
        const result = getAzSwitchToggleEvent({ payload: { label: "label", isToggleOn: true } });

        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action: TaggingAction.TOGGLE_ON,
          elementText: "label",
          module: "sort",
        });
        expect(result).toBe("interface event");
      });
    });
  });

  describe("getMyBetsOrderTypeFilterClickEvent", () => {
    it("should call buildInterfaceEvent with the correct payload", () => {
      const result = getMyBetsOrderTypeFilterClickEvent({
        payload: { filter: { productType: "productType", orderType: "orderType" } },
      });

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLICKED,
        elementText: "productLabel - orderType bets",
        module: MY_BETS_MODULE_NAME,
      });
      expect(result).toBe("interface event");
    });
  });

  describe("getPromoDescriptionToggleEvent", () => {
    describe("when isOpen is false", () => {
      it("should call buildInterfaceEvent with the correct action", () => {
        const result = getPromoDescriptionToggleEvent(
          {
            payload: { title: "title", isOpen: false, variant: "promo" },
          },
          "state",
        );

        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action: TaggingAction.CLOSED,
          elementText: "title",
          module: "market blurb - promo",
        });
        expect(result).toBe("interface event");
      });
    });

    describe("when isOpen is true", () => {
      it("should call buildInterfaceEvent with the correct action", () => {
        const result = getPromoDescriptionToggleEvent(
          {
            payload: { title: "title", isOpen: true, variant: "promo" },
          },
          "state",
        );

        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action: TaggingAction.OPENED,
          elementText: "title",
          module: "market blurb - promo",
        });
        expect(result).toBe("interface event");
      });
    });
  });

  describe("getToggleAccordionEvent", () => {
    describe("when isExpanded is false", () => {
      it("should call buildInterfaceEvent with the correct elementText", () => {
        const result = getToggleAccordionEvent({
          payload: { isExpanded: false },
        });

        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action: TaggingAction.CLICKED,
          elementText: TaggingAction.HIDE,
          module: MY_BETS_MODULE_NAME,
        });
        expect(result).toBe("interface event");
      });
    });

    describe("when isExpanded is true", () => {
      it("should call buildInterfaceEvent with the correct elementText", () => {
        const result = getToggleAccordionEvent({
          payload: { isExpanded: true },
        });

        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action: TaggingAction.CLICKED,
          elementText: TaggingAction.SHOW,
          module: MY_BETS_MODULE_NAME,
        });
        expect(result).toBe("interface event");
      });
    });
  });

  describe("getHeritageToggleClickEvent", () => {
    it("should call buildInterfaceEvent with the correct payload", () => {
      const result = getHeritageToggleClickEvent({
        payload: {
          filter: { isHeritageView: true, label: "latest" },
        },
      });

      expect(buildInterfaceEvent).toHaveBeenCalledTimes(1);
      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLICKED,
        elementText: "switcher - latest",
        module: MY_BETS_MODULE_NAME,
      });
      expect(result).toBe("interface event");
    });
  });

  describe("getBetReceiptCopyToClipboardEvent", () => {
    it("should call buildInterfaceEvent with the correct payload", () => {
      const result = getBetReceiptCopyToClipboardEvent();

      expect(buildInterfaceEvent).toHaveBeenCalledTimes(1);
      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLICKED,
        elementText: "copy to clipboard",
        module: "bet receipt",
      });
      expect(result).toBe("interface event");
    });
  });

  describe("getMyBetsCopyBetIdToClipboardEvent", () => {
    it("should call buildInterfaceEvent with the correct payload", () => {
      const result = getMyBetsCopyBetIdToClipboardEvent();

      expect(buildInterfaceEvent).toHaveBeenCalledTimes(1);
      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.COPIED,
        elementText: "bet id",
        module: MY_BETS_MODULE_NAME,
      });
      expect(result).toBe("interface event");
    });
  });

  describe("getMyBetsCopyDeviceIdToClipboardEvent", () => {
    it("should call buildInterfaceEvent with the correct payload", () => {
      const result = getMyBetsCopyDeviceIdToClipboardEvent();

      expect(buildInterfaceEvent).toHaveBeenCalledTimes(1);
      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.COPIED,
        elementText: "device id",
        module: MY_BETS_MODULE_NAME,
      });
      expect(result).toBe("interface event");
    });
  });

  describe("getRaceReplaysToggleEvent", () => {
    describe("when the card does not exist", () => {
      it("should return null", () => {
        createCardByURNSelector.mockReturnValueOnce(() => undefined);
        createCardByURNSelector.mockReturnValueOnce(() => undefined);

        const result = getRaceReplaysToggleEvent(
          {
            payload: { selection: "selection", isClosed: false, cardUrn: "cardUrn" },
          },
          { layouts: { cards: { racemarkets: [], markets: [] } } },
        );

        expect(buildInterfaceEvent).not.toHaveBeenCalled();
        expect(result).toBe(null);
      });
    });

    describe("when the card exists", () => {
      describe("and isClosed is false", () => {
        it("should call buildInterfaceEvent with the correct action", () => {
          createCardByURNSelector.mockReturnValueOnce(() => undefined);
          createCardByURNSelector.mockReturnValueOnce(() => ({ typename: "CARDTYPE" }));

          const result = getRaceReplaysToggleEvent(
            {
              payload: { selection: "selection", isClosed: false, cardUrn: "cardUrn" },
            },
            { layouts: { cards: { racemarkets: [], markets: [] } } },
          );

          expect(buildInterfaceEvent).toHaveBeenCalledWith({
            action: TaggingAction.OPENED,
            elementText: "recent races video - selection",
            module: "home - cardtype",
          });
          expect(result).toBe("interface event");
        });
      });

      describe("and isClosed is true", () => {
        it("should call buildInterfaceEvent with the correct action", () => {
          createCardByURNSelector.mockReturnValueOnce(() => undefined);
          createCardByURNSelector.mockReturnValueOnce(() => ({ typename: "CARDTYPE" }));

          const result = getRaceReplaysToggleEvent(
            {
              payload: { selection: "selection", isClosed: true, cardUrn: "cardUrn" },
            },
            { layouts: { cards: { racemarkets: [], markets: [] } } },
          );

          expect(buildInterfaceEvent).toHaveBeenCalledWith({
            action: TaggingAction.CLOSED,
            elementText: "recent races video - selection",
            module: "home - cardtype",
          });
          expect(result).toBe("interface event");
        });
      });
    });
  });

  describe("getBroadcastsToggleEvent", () => {
    const state = {
      layouts: { cards: { broadcasts: "" } },
    };

    describe("when there's no card for the urn", () => {
      it("should not call buildInterfaceEvent", () => {
        createCardByURNSelector.mockReturnValueOnce(() => null);
        const result = getBroadcastsToggleEvent({ payload: { isExpanded: true } }, state);

        expect(buildInterfaceEvent).not.toHaveBeenCalled();
        expect(result).toEqual(null);
      });
    });

    describe.each([
      [true, "liveVideoUrl", TaggingAction.SHOW, LiveStreamBroadcastsOptions.LiveVideo],
      [true, undefined, TaggingAction.SHOW, LiveStreamBroadcastsOptions.DataViz],
      [false, "liveVideoUrl", TaggingAction.HIDE, LiveStreamBroadcastsOptions.LiveVideo],
      [false, undefined, TaggingAction.HIDE, LiveStreamBroadcastsOptions.DataViz],
    ])("when isExpanded is %s and liveVideoUrl is `%s`", (isExpanded, liveVideoUrl, action, elementText) => {
      it("should call buildInterfaceEvent with the correct payload", () => {
        createCardByURNSelector.mockReturnValueOnce(() => ({ broadcasts: { liveVideoUrl } }));
        const result = getBroadcastsToggleEvent({ payload: { isExpanded } }, state);

        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action,
          elementText,
          module: "media player",
        });
        expect(result).toEqual("interface event");
      });
    });
  });

  describe("getBroadcastsAndStatisticsToggleEvent", () => {
    const state = {
      layouts: { cards: { broadcastsandstatistics: "" } },
    };

    describe("when there's no card for the urn", () => {
      it("should not call buildInterfaceEvent", () => {
        createCardByURNSelector.mockReturnValueOnce(() => null);
        const result = getBroadcastsAndStatisticsToggleEvent({ payload: { isExpanded: true } }, state);

        expect(buildInterfaceEvent).not.toHaveBeenCalled();
        expect(result).toEqual(null);
      });
    });

    describe.each([
      [true, "liveVideoUrl", TaggingAction.SHOW, LiveStreamBroadcastsOptions.LiveVideo],
      [true, undefined, TaggingAction.SHOW, LiveStreamBroadcastsOptions.DataViz],
      [false, "liveVideoUrl", TaggingAction.HIDE, LiveStreamBroadcastsOptions.LiveVideo],
      [false, undefined, TaggingAction.HIDE, LiveStreamBroadcastsOptions.DataViz],
    ])("when isExpanded is %s and liveVideoUrl is `%s`", (isExpanded, liveVideoUrl, action, elementText) => {
      it("should call buildInterfaceEvent with the correct payload", () => {
        createCardByURNSelector.mockReturnValueOnce(() => ({ broadcasts: { liveVideoUrl } }));
        const result = getBroadcastsAndStatisticsToggleEvent({ payload: { isExpanded } }, state);

        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action,
          elementText,
          module: "media player",
        });
        expect(result).toEqual("interface event");
      });
    });
  });

  describe("getMaxPayoutAcceptMessageClickEvent", () => {
    it("should call buildInterfaceEvent with the correct payload", () => {
      const result = getMaxPayoutAcceptMessageClickEvent();

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLICKED,
        elementText: "accept - warningI18N.BETSLIP.VALIDATION_GROUP_ABOVE_MAX_PAYOUT",
        module: "betslip",
      });
      expect(result).toBe("interface event");
    });
  });

  describe("getTimeFormBroadCastsToggleEvent", () => {
    const state = {
      layouts: { cards: { timeformbroadcasts: "" } },
    };

    describe("when there's no card for the urn", () => {
      it("should not call buildInterfaceEvent", () => {
        createCardByURNSelector.mockReturnValueOnce(() => null);
        const result = getTimeFormBroadCastsToggleEvent({ payload: { isExpanded: true } }, state);

        expect(buildInterfaceEvent).not.toHaveBeenCalled();
        expect(result).toEqual(null);
      });
    });

    describe.each([
      [true, "liveVideoUrl", TaggingAction.SHOW, LiveStreamBroadcastsOptions.LiveVideo],
      [true, undefined, TaggingAction.SHOW, LiveStreamBroadcastsOptions.DataViz],
      [false, "liveVideoUrl", TaggingAction.HIDE, LiveStreamBroadcastsOptions.LiveVideo],
      [false, undefined, TaggingAction.HIDE, LiveStreamBroadcastsOptions.DataViz],
    ])("when isExpanded is %s and liveVideoUrl is `%s`", (isExpanded, liveVideoUrl, action, elementText) => {
      it("should call buildInterfaceEvent with the correct payload", () => {
        createCardByURNSelector.mockReturnValueOnce(() => ({ broadcasts: { liveVideoUrl } }));
        const result = getTimeFormBroadCastsToggleEvent({ payload: { isExpanded } }, state);

        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action,
          elementText,
          module: "media player",
        });
        expect(result).toEqual("interface event");
      });
    });
  });

  describe("getContentSummaryCollapseEvent", () => {
    describe.each([
      [true, TaggingAction.COLLAPSE],
      [false, TaggingAction.EXPAND],
    ])("when isSelected is %s and action is `%s`", (collapsed, action) => {
      it("should call buildInterfaceEvent with the correct payload", () => {
        const result = getContentSummaryCollapseEvent({ payload: { title: "title", collapsed } }, {});

        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action,
          elementText: "title",
          module: "seo footer",
        });
        expect(result).toEqual("interface event");
      });
    });
  });

  describe("getBetslipEachWayToggleEvent", () => {
    describe.each([
      [true, TaggingAction.TOGGLE_ON],
      [false, TaggingAction.TOGGLE_OFF],
    ])("when isSelected is %s and action is `%s`", (isSelected, action) => {
      it("should call buildInterfaceEvent with the correct payload", () => {
        const result = getBetslipEachWayToggleEvent({ payload: { isSelected } }, {});

        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action,
          elementText: "each way",
          module: "betslip",
        });
        expect(result).toEqual("interface event");
      });
    });
  });

  describe("getBetslipAccaInsuranceToggleEvent", () => {
    describe.each([
      [true, TaggingAction.TOGGLE_ON],
      [false, TaggingAction.TOGGLE_OFF],
    ])("when isSelected is %s and action is `%s`", (isSelected, action) => {
      it("should call buildInterfaceEvent with the correct payload", () => {
        const result = getBetslipAccaInsuranceToggleEvent({ payload: { isSelected } }, {});

        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action,
          elementText: "acca insurance",
          module: "betslip",
        });
        expect(result).toEqual("interface event");
      });
    });
  });

  describe("getBetslipMyOddsBoostToggleEvent", () => {
    describe.each([
      [true, TaggingAction.TOGGLE_ON],
      [false, TaggingAction.TOGGLE_OFF],
    ])("when isSelected is %s and action is `%s`", (isSelected, action) => {
      it("should call buildInterfaceEvent with the correct payload", () => {
        const result = getBetslipMyOddsBoostToggleEvent({ payload: { isSelected } }, {});

        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action,
          elementText: "my odds boost",
          module: "betslip",
        });
        expect(result).toEqual("interface event");
      });
    });
  });

  describe("getBetslipCastBetChangeEvent", () => {
    describe("when there is not a valid leg", () => {
      it("should not call buildInterfaceEvent", () => {
        const sportsbookBetting = {
          combinations: {
            combinationId: {
              id: "combinationId",
              legs: ["legId"],
            },
          },
          legs: {},
        };
        getSportsbookBettingState.mockReturnValueOnce(sportsbookBetting);

        const state = { entities: { sportsbookBetting } };
        const action = { payload: { combinationId: "combinationId" } };
        const result = getBetslipCastBetChangeEvent(action, state);

        expect(buildInterfaceEvent).not.toHaveBeenCalled();
        expect(result).toEqual(null);
      });
    });

    describe("when there is a valid leg", () => {
      it("should call buildInterfaceEvent with the correct payload", () => {
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
        getSportsbookBettingState.mockReturnValueOnce(sportsbookBetting);

        const state = { entities: { sportsbookBetting } };
        const action = { payload: { combinationId: "combinationId" } };
        const result = getBetslipCastBetChangeEvent(action, state);

        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action: TaggingAction.CLICKED,
          elementText: "legType",
          module: "betslip",
        });
        expect(result).toEqual("interface event");
      });
    });
  });

  describe("getBetslipCastBetOrderChangeEvent", () => {
    describe("when there is not a valid leg", () => {
      it("should not call buildInterfaceEvent", () => {
        const sportsbookBetting = {
          combinations: {
            combinationId: {
              id: "combinationId",
              legs: ["legId"],
            },
          },
          legs: {},
        };
        const state = { entities: { sportsbookBetting } };
        const action = { payload: { combinationId: "combinationId", updatedRunnerId: "updatedRunnerId" } };
        getSportsbookBettingState.mockReturnValueOnce(sportsbookBetting);

        const result = getBetslipCastBetOrderChangeEvent(action, state);

        expect(buildInterfaceEvent).not.toHaveBeenCalled();
        expect(result).toEqual(null);
      });
    });

    describe("when there is not a valid runner", () => {
      it("should not call buildInterfaceEvent", () => {
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

        getSportsbookBettingState.mockReturnValueOnce(sportsbookBetting);

        const state = { entities: { sportsbookBetting } };
        const action = { payload: { combinationId: "combinationId", updatedRunnerId: "updatedRunnerId" } };
        const result = getBetslipCastBetOrderChangeEvent(action, state);

        expect(buildInterfaceEvent).not.toHaveBeenCalled();
        expect(result).toEqual(null);
      });
    });

    describe("when there is not a valid market", () => {
      it("should not call buildInterfaceEvent", () => {
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

        getSportsbookBettingState.mockReturnValueOnce(sportsbookBetting);
        getSportsbookMarketById.mockReturnValueOnce();

        const sportsbookmarkets = {};
        const state = { entities: { sportsbookBetting, sportsbookmarkets } };
        const action = { payload: { combinationId: "combinationId", updatedRunnerId: "updatedRunnerId" } };

        const result = getBetslipCastBetOrderChangeEvent(action, state);

        expect(buildInterfaceEvent).not.toHaveBeenCalled();
        expect(result).toEqual(null);
      });
    });

    describe("when there is not a valid selection", () => {
      it("should not call buildInterfaceEvent", () => {
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

        getSportsbookBettingState.mockReturnValueOnce(sportsbookBetting);
        getSportsbookMarketById.mockReturnValueOnce(market);

        const state = { entities: { sportsbookBetting, sportsbookmarkets } };
        const action = { payload: { combinationId: "combinationId", updatedRunnerId: "updatedRunnerId" } };
        const result = getBetslipCastBetOrderChangeEvent(action, state);

        expect(buildInterfaceEvent).not.toHaveBeenCalled();
        expect(result).toEqual(null);
      });
    });

    describe("when there is valid data", () => {
      it("should call buildInterfaceEvent with the correct payload", () => {
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

        getSportsbookBettingState.mockReturnValueOnce(sportsbookBetting);
        getSportsbookMarketById.mockReturnValueOnce(market);

        const state = { entities: { sportsbookBetting, sportsbookmarkets } };
        const action = { payload: { combinationId: "combinationId", updatedRunnerId: "updatedRunnerId" } };
        const result = getBetslipCastBetOrderChangeEvent(action, state);

        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action: TaggingAction.REPOSITIONED,
          elementText: "legType - selectionName",
          module: "betslip",
        });
        expect(result).toEqual("interface event");
      });
    });

    describe("when there is non runners in the market", () => {
      it("should not call buildInterfaceEvent", () => {
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

        getSportsbookBettingState.mockReturnValueOnce(sportsbookBetting);
        getSportsbookMarketById.mockReturnValueOnce(market);

        const state = { entities: { sportsbookBetting, sportsbookmarkets } };
        const action = { payload: { combinationId: "combinationId", updatedRunnerId: "updatedRunnerId" } };
        const result = getBetslipCastBetOrderChangeEvent(action, state);

        expect(buildInterfaceEvent).not.toHaveBeenCalled();
        expect(result).toEqual(null);
      });
    });
  });

  describe("getSwitcherEvent", () => {
    describe.each([
      ["GenericSwitcherCard", "generic"],
      ["RaceSwitcherCard", "race"],
    ])("when pageType is `%s`", (pageType, type) => {
      it("should call buildInterfaceEvent with the correct payload", () => {
        const action = { payload: { label: "label", pageType } };
        const result = getSwitcherEvent(action, {});

        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action: TaggingAction.OPENED,
          elementText: "label",
          module: `${type} - power nav`,
        });
        expect(result).toEqual("interface event");
      });
    });
  });

  describe("getToggleTimeFormEvent", () => {
    describe("when is expanded", () => {
      it("should return the correct event payload", () => {
        const action = {
          payload: {
            isExpanded: true,
          },
        };
        const result = getToggleTimeFormEvent(action, {});

        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action: TaggingAction.SHOW,
          elementText: "race verdict",
          module: "racecard",
        });

        expect(result).toEqual("interface event");
      });
    });

    describe("when isn't expanded", () => {
      it("should return the correct event payload", () => {
        const action = {
          payload: {
            isExpanded: false,
          },
        };
        const result = getToggleTimeFormEvent(action, {});

        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action: TaggingAction.HIDE,
          elementText: "race verdict",
          module: "racecard",
        });

        expect(result).toEqual("interface event");
      });
    });
  });

  describe("getOpenBetslipEvent", () => {
    describe("when betslip is not already visible", () => {
      describe("when product is sportsbook", () => {
        it("should return the correct event payload", () => {
          const action = {
            payload: {
              product: Product.Sportsbook,
            },
          };

          const result = getOpenBetslipEvent(action, {});

          expect(buildInterfaceEvent).toHaveBeenCalledWith({
            action: TaggingAction.OPENED,
            elementText: "Sportsbook betslip",
            module: "auto-open",
          });

          expect(result).toEqual("interface event");
        });
      });

      describe("when product is exchange", () => {
        it("should return the correct event payload", () => {
          const action = {
            payload: {
              product: Product.Exchange,
            },
          };
          const result = getOpenBetslipEvent(action, {});

          expect(buildInterfaceEvent).toHaveBeenCalledWith({
            action: TaggingAction.OPENED,
            elementText: "Exchange betslip",
            module: "auto-open",
          });

          expect(result).toEqual("interface event");
        });
      });
    });

    describe("when betslip is already visible", () => {
      describe("when product is sportsbook", () => {
        it("should not call buildInterfaceEvent and return null", () => {
          getBetslipVisibilityState.mockReturnValueOnce(true);
          const action = {
            payload: {
              product: Product.Sportsbook,
            },
          };

          const result = getOpenBetslipEvent(action, {});

          expect(buildInterfaceEvent).not.toHaveBeenCalled();

          expect(result).toEqual(null);
        });
      });
    });
  });

  describe("getGenerosityWalletClick", () => {
    it("should call buildInterfaceEvent with the correct payload", () => {
      const result = getGenerosityWalletClick({ payload: { module: "moduleMock" } });

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLICKED,
        module: "moduleMock",
        elementText: "generosity wallet",
      });

      expect(result).toEqual("interface event");
    });
  });

  describe("getGenerosityWalletCloseEvent", () => {
    describe("when isFromBetslip is false", () => {
      it("should call buildInterfaceEvent with the correct payload", () => {
        const result = getGenerosityWalletCloseEvent({ payload: { isFromBetslip: false, currentPebble: "all" } });

        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action: TaggingAction.CLICKED,
          module: "generosity wallet - all",
          elementText: "close",
        });

        expect(result).toEqual("interface event");
      });
    });

    describe("when isFromBetslip is true", () => {
      it("should call buildInterfaceEvent with the correct payload", () => {
        const result = getGenerosityWalletCloseEvent({ payload: { isFromBetslip: true, currentPebble: "all" } });

        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action: TaggingAction.CLICKED,
          module: "betslip - generosity wallet - all",
          elementText: "close",
        });

        expect(result).toEqual("interface event");
      });
    });
  });

  describe("getFreeBetsWalletToggleEvent", () => {
    describe("should call buildInterfaceEvent with the correct payload when removing wallet", () => {
      it("when isSelected is true", () => {
        const action = {
          payload: {
            isSelected: true,
            walletDescription: "free bets",
            walletType: WalletTypes.BonusCash,
            value: 1,
            totalAmount: "10",
            currentPebble: "all",
          },
        };

        const result = getFreeBetsWalletToggleEvent(action);
        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action: TaggingAction.REMOVED,
          elementText: "free bets - 1 leg - 10",
          module: "betslip - generosity wallet - all",
        });
        expect(result).toEqual("interface event");
      });
    });
    describe("should call buildInterfaceEvent with the correct payload when adding wallet", () => {
      it("when isSelected is false", () => {
        const action = {
          payload: {
            isSelected: false,
            walletDescription: "free bets",
            walletType: WalletTypes.BonusCash,
            value: 1,
            totalAmount: "10",
            currentPebble: "all",
          },
        };

        const result = getFreeBetsWalletToggleEvent(action);
        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action: TaggingAction.ADDED,
          elementText: "free bets - 1 leg - 10",
          module: "betslip - generosity wallet - all",
        });
        expect(result).toEqual("interface event");
      });
    });
    describe("should call buildInterfaceEvent with the correct payload when adding MONEY_BACK_TOKEN wallet for placed", () => {
      it("when isSelected is false", () => {
        const action = {
          payload: {
            isSelected: false,
            walletDescription: "money back",
            walletType: WalletTypes.MoneyBackToken,
            value: undefined,
            totalAmount: "10",
            currentPebble: "all",
            numberOfPlaces: 3,
          },
        };

        const result = getFreeBetsWalletToggleEvent(action);
        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action: TaggingAction.ADDED,
          elementText: "money back - placed - 10",
          module: "betslip - generosity wallet - all",
        });
        expect(result).toEqual("interface event");
      });
    });
    describe("should call buildInterfaceEvent with the correct payload when removing MONEY_BACK_TOKEN wallet for placed", () => {
      it("when isSelected is true", () => {
        const action = {
          payload: {
            isSelected: true,
            walletDescription: "money back",
            walletType: WalletTypes.MoneyBackToken,
            value: undefined,
            totalAmount: "10",
            currentPebble: "all",
            numberOfPlaces: 3,
          },
        };

        const result = getFreeBetsWalletToggleEvent(action);
        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action: TaggingAction.REMOVED,
          elementText: "money back - placed - 10",
          module: "betslip - generosity wallet - all",
        });
        expect(result).toEqual("interface event");
      });
    });
    describe("should call buildInterfaceEvent with the correct payload when adding MONEY_BACK_TOKEN wallet for losers", () => {
      it("when isSelected is false", () => {
        const action = {
          payload: {
            isSelected: false,
            walletDescription: "money back",
            walletType: WalletTypes.MoneyBackToken,
            value: undefined,
            totalAmount: "10",
            currentPebble: "all",
            numberOfPlaces: undefined,
          },
        };

        const result = getFreeBetsWalletToggleEvent(action);
        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action: TaggingAction.ADDED,
          elementText: "money back - losers - 10",
          module: "betslip - generosity wallet - all",
        });
        expect(result).toEqual("interface event");
      });
    });
    describe("should call buildInterfaceEvent with the correct payload when removing MONEY_BACK_TOKEN wallet for losers", () => {
      it("when isSelected is true", () => {
        const action = {
          payload: {
            isSelected: true,
            walletDescription: "money back",
            walletType: WalletTypes.MoneyBackToken,
            value: undefined,
            totalAmount: "10",
            currentPebble: "all",
            numberOfPlaces: undefined,
          },
        };

        const result = getFreeBetsWalletToggleEvent(action);
        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action: TaggingAction.REMOVED,
          elementText: "money back - losers - 10",
          module: "betslip - generosity wallet - all",
        });
        expect(result).toEqual("interface event");
      });
    });
    describe("should call buildInterfaceEvent with the correct payload when adding GHOST_LEG_TOKEN wallet", () => {
      it("when isSelected is false", () => {
        const action = {
          payload: {
            isSelected: false,
            walletDescription: "ghost leg",
            walletType: WalletTypes.GhostLegToken,
            value: 1,
            totalAmount: "10",
            currentPebble: "all",
            numberOfPlaces: undefined,
          },
        };

        const result = getFreeBetsWalletToggleEvent(action);
        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action: TaggingAction.ADDED,
          elementText: "ghost leg - 1 leg",
          module: "betslip - generosity wallet - all",
        });
        expect(result).toEqual("interface event");
      });
    });
    describe("should call buildInterfaceEvent with the correct payload when removing GHOST_LEG_TOKEN wallet", () => {
      it("when isSelected is true", () => {
        const action = {
          payload: {
            isSelected: true,
            walletDescription: "ghost leg",
            walletType: WalletTypes.GhostLegToken,
            value: 1,
            totalAmount: "10",
            currentPebble: "all",
            numberOfPlaces: undefined,
          },
        };

        const result = getFreeBetsWalletToggleEvent(action);
        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action: TaggingAction.REMOVED,
          elementText: "ghost leg - 1 leg",
          module: "betslip - generosity wallet - all",
        });
        expect(result).toEqual("interface event");
      });
    });
  });

  describe("getOpenClearBetslipEvent", () => {
    describe("when clearBetslipMetrics returns null", () => {
      let result;
      beforeAll(() => {
        getClearBetslipMetrics.mockReturnValueOnce(null);
        result = getOpenClearBetslipEvent({ type: "UI/ACTION_CONFIRMATION", payload: {} }, {});
      });
      it("should return null", () => {
        expect(result).toBeNull();
      });
    });
    describe("when clearBetslipMetrics returns non-null", () => {
      let result;
      beforeAll(() => {
        getClearBetslipMetrics.mockReturnValueOnce({
          selectedTabTitle: "selectedTabTitle",
          moduleBetslipType: "moduleBetslipType",
          module: "module",
          cardGroupTitle: "cardGroupTitle",
          event: "event",
          ctaLabel: "ctaLabel",
          tabName: "tabName",
        });
      });

      it("should call buildInterfaceEvent with the correct payload", () => {
        result = getOpenClearBetslipEvent({ type: "UI/ACTION_CONFIRMATION", payload: {} }, {});

        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action: "saw",
          elementText: "clear betslip modal",
          eventContext: "event",
          gameFilter: "null",
          module: "getModuleData",
          swimlaneType: "null",
        });

        expect(result).toEqual("interface event");
      });
    });
  });

  describe("getRefuseConfirmationEvent", () => {
    describe("when clearBetslipMetrics returns null", () => {
      let result;
      beforeAll(() => {
        getClearBetslipMetrics.mockReturnValueOnce(null);
        result = getRefuseConfirmationEvent({ type: "UI/ACTION_CONFIRMATION", payload: {} }, {});
      });
      it("should return null", () => {
        expect(result).toBeNull();
      });
    });

    describe("when clearBetslipMetrics returns non-null", () => {
      describe("and clickedOutsideOfModal is true", () => {
        let result;
        beforeAll(() => {
          getClearBetslipMetrics.mockReturnValueOnce({
            selectedTabTitle: "selectedTabTitle",
            moduleBetslipType: "moduleBetslipType",
            module: "module",
            cardGroupTitle: "cardGroupTitle",
            event: "event",
            ctaLabel: "ctaLabel",
            tabName: "tabName",
          });
        });

        it("should call buildInterfaceEvent with the correct payload", () => {
          result = getRefuseConfirmationEvent(
            { type: "BETTING__OBB_SBK_KEEP_ACTION", payload: { clickedOutside: true } },
            {},
          );

          expect(buildInterfaceEvent).toHaveBeenCalledWith({
            action: "clicked",
            elementText: "close",
            eventContext: "event",
            gameFilter: "null",
            module: "getModuleData",
            swimlaneType: "null",
          });

          expect(result).toEqual("interface event");
        });
      });
      describe("and clickedOutsideOfModal is false", () => {
        let result;
        beforeAll(() => {
          getClearBetslipMetrics.mockReturnValueOnce({
            selectedTabTitle: "selectedTabTitle",
            moduleBetslipType: "moduleBetslipType",
            module: "module",
            cardGroupTitle: "cardGroupTitle",
            event: "event",
            ctaLabel: "ctaLabel",
            tabName: "tabName",
          });
        });

        it("should call buildInterfaceEvent with the correct payload", () => {
          result = getRefuseConfirmationEvent({ type: "BETTING__OBB_SBK_KEEP_ACTION", payload: {} }, {});

          expect(buildInterfaceEvent).toHaveBeenCalledWith({
            action: "clicked",
            elementText: "ctaLabel",
            eventContext: "event",
            gameFilter: "null",
            module: "getModuleData",
            swimlaneType: "null",
          });

          expect(result).toEqual("interface event");
        });
      });
    });
  });

  describe("getAcceptConfirmationEvent", () => {
    describe("when clearBetslipMetrics returns null", () => {
      let result;
      beforeAll(() => {
        getClearBetslipMetrics.mockReturnValueOnce(null);
        result = getAcceptConfirmationEvent({ type: "UI/ACTION_CONFIRMATION", payload: {} }, {});
      });
      it("should return null", () => {
        expect(result).toBeNull();
      });
    });
    describe("when clearBetslipMetrics returns non-null", () => {
      let result;
      beforeAll(() => {
        getClearBetslipMetrics.mockReturnValueOnce({
          selectedTabTitle: "selectedTabTitle",
          moduleBetslipType: "moduleBetslipType",
          module: "module",
          cardGroupTitle: "cardGroupTitle",
          event: "event",
          ctaLabel: "ctaLabel",
          tabName: "tabName",
        });
      });

      it("should call buildInterfaceEvent with the correct payload", () => {
        result = getAcceptConfirmationEvent({ type: "UI/ACTION_CONFIRMATION", payload: {} }, {});

        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action: "clicked",
          elementText: "ctaLabel",
          eventContext: "event",
          gameFilter: "null",
          module: "getModuleData",
          swimlaneType: "null",
        });

        expect(result).toEqual("interface event");
      });
    });
  });

  describe("getGenerosityWalletBetslipClickAction", () => {
    describe("when isSelected is false", () => {
      it("should call buildInterfaceEvent with the correct payload", () => {
        const result = getGenerosityWalletBetslipClickAction({ payload: { isSelected: false } });

        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action: TaggingAction.CLICKED,
          module: "betslip",
          elementText: "generosity icon",
        });

        expect(result).toEqual("interface event");
      });
    });

    describe("when isSelected is true", () => {
      it("should call buildInterfaceEvent with the correct payload", () => {
        const result = getGenerosityWalletBetslipClickAction({ payload: { isSelected: true } });

        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action: TaggingAction.CLICKED,
          module: "betslip",
          elementText: "generosity edit icon",
        });

        expect(result).toEqual("interface event");
      });
    });
  });

  describe("getRemoveGenerosityWalletEvent", () => {
    it("should call buildInterfaceEvent with the correct payload", () => {
      const result = getRemoveGenerosityWalletEvent();

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLICKED,
        module: "betslip",
        elementText: "remove generosity",
      });

      expect(result).toEqual("interface event");
    });
  });

  describe("getHamburgerMenuOpenEvent", () => {
    it("should call buildInterfaceEvent with the correct payload", () => {
      const result = getHamburgerMenuOpenEvent();

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.OPENED,
        module: "header",
        elementText: "burger menu",
      });

      expect(result).toEqual("interface event");
    });
  });

  describe("getHamburgerMenuCloseEvent", () => {
    it("should call buildInterfaceEvent with the correct payload", () => {
      const result = getHamburgerMenuCloseEvent();

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLOSED,
        module: "burger menu",
        elementText: "close icon",
      });

      expect(result).toEqual("interface event");
    });
  });

  describe("getObbSelectionsEvents", () => {
    beforeEach(() => {
      getModuleData.mockImplementationOnce((...value) => value.filter(Boolean).join(" - "));
    });

    it("should call buildInterfaceEvent with the correct payload with module as string", () => {
      const result = getObbSelectionsEvents({
        payload: {
          event: { elementText: "text", module: "mockModule" },
          urn: "123",
          eventName: "team A vs team B",
        },
      });

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLICKED,
        elementText: "text",
        eventContext: "team A vs team B",
        module: "mockModule",
      });

      expect(result).toEqual("interface event");
    });

    describe("without module as string", () => {
      describe("with urn", () => {
        it("should call buildInterfaceEvent with the correct payload with card data", () => {
          const result = getObbSelectionsEvents({
            payload: {
              event: {
                elementText: "text",
              },
              urn: "123",
              eventName: "team A vs team B",
            },
          });

          expect(buildInterfaceEvent).toHaveBeenCalledWith({
            action: TaggingAction.CLICKED,
            elementText: "text",
            eventContext: "team A vs team B",
            module: "home - null - Group Layout - title - tab",
          });

          expect(result).toEqual("interface event");
        });

        it("should call buildInterfaceEvent with the correct payload with default layout metadata values", () => {
          getLayoutMetadata.mockImplementationOnce(() => ({
            tabName: "",
          }));
          const result = getObbSelectionsEvents({
            payload: {
              event: {
                elementText: "text",
              },
              urn: "123",
              eventName: "team A vs team B",
            },
          });

          expect(buildInterfaceEvent).toHaveBeenCalledWith({
            action: TaggingAction.CLICKED,
            elementText: "text",
            eventContext: "team A vs team B",
            module: "home - null -  ",
          });

          expect(result).toEqual("interface event");
        });

        it("should call buildInterfaceEvent with the correct payload with override module data", () => {
          const result = getObbSelectionsEvents({
            payload: {
              event: {
                elementText: "text",
                module: {
                  pageType: "pageTypeMock",
                  swimlaneType: "swimlaneTypeMock",
                  group: "groupMock",
                  card: "cardMock",
                  tab: "tabMock",
                },
              },
              urn: "123",
              eventName: "team A vs team B",
            },
          });

          expect(buildInterfaceEvent).toHaveBeenCalledWith({
            action: TaggingAction.CLICKED,
            elementText: "text",
            eventContext: "team A vs team B",
            module: "pageTypeMock - swimlaneTypeMock - groupMock - cardMock - tabMock",
          });

          expect(result).toEqual("interface event");
        });
      });
      describe("without urn", () => {
        describe("with module data", () => {
          it("should call buildInterfaceEvent with the correct payload", () => {
            createViewTypeSelector.mockImplementationOnce(() => jest.fn(() => null));
            const result = getObbSelectionsEvents({
              payload: {
                event: {
                  elementText: "text",
                  module: {
                    pageType: "pageTypeMock",
                    swimlaneType: "swimlaneTypeMock",
                    group: "groupMock",
                    card: "cardMock",
                    tab: "tabMock",
                  },
                },
                eventName: "team A vs team B",
              },
            });

            expect(buildInterfaceEvent).toHaveBeenCalledWith({
              action: TaggingAction.CLICKED,
              elementText: "text",
              eventContext: "team A vs team B",
              module: "pageTypeMock - swimlaneTypeMock - groupMock - cardMock - tabMock",
            });

            expect(result).toEqual("interface event");
          });
        });

        describe("with no module data", () => {
          it("should call buildInterfaceEvent with the correct payload", () => {
            createViewTypeSelector.mockImplementationOnce(() => jest.fn(() => null));
            const result = getObbSelectionsEvents({
              payload: {
                event: {
                  elementText: "text",
                },
                eventName: "team A vs team B",
              },
            });

            expect(buildInterfaceEvent).toHaveBeenCalledWith({
              action: TaggingAction.CLICKED,
              elementText: "text",
              eventContext: "team A vs team B",
              module: "home - null",
            });

            expect(result).toEqual("interface event");
          });
        });
      });
    });
  });

  describe("getEditSquadOpenEvent", () => {
    it("should return correct InterfaceEvent", () => {
      const action = {
        payload: {
          cardUrn: "urn:test",
        },
      };

      const state = {};

      const result = getEditSquadOpenEvent(action, state);

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: "opened",
        elementText: "edit squad",
        module: "home - null - Squad Bet - player picker - tab",
      });

      expect(result).toEqual("interface event");
    });

    describe("when the payload includes an element", () => {
      it("should return correct InterfaceEvent with element text", () => {
        const action = {
          payload: {
            cardUrn: "urn:test",
            element: "element",
          },
        };

        const state = {};

        const result = getEditSquadOpenEvent(action, state);

        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action: "opened",
          elementText: "edit squad - element",
          module: "home - null - Squad Bet - player picker - tab",
        });
      });
    });
  });

  describe("getClosePlayerPickerModalEvent", () => {
    it("should return correct InterfaceEvent", () => {
      const action = {
        payload: {
          cardUrn: "urn:test",
          eventName: "event-name",
          incidentType: "free_kick",
        },
      };

      const state = {};

      const result = getClosePlayerPickerModalEvent(action, state);

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: "closed",
        elementText: "close icon",
        eventContext: "event-name",
        module: "home - null - free kick - player picker - tab",
      });

      expect(result).toEqual("interface event");
    });
  });

  describe("getSquadBetPlayerPickerToggleSquadParticipantEvent", () => {
    describe("when typename is ObbSquadBetCard", () => {
      it("should return correct SELECTED InterfaceEvent when isSelected is false", () => {
        const action = {
          payload: {
            cardUrn: "urn:test",
            eventName: "event-name",
            incidentType: "penalty_kick",
            participantUrn: "urn:1",
            playerName: "John Doe",
          },
        };

        const state = {};

        const result = getSquadBetPlayerPickerToggleSquadParticipantEvent(action, state);

        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action: "selected",
          elementText: "player - John Doe",
          eventContext: "event-name",
          module: "home - null - penalty kick - player picker - tab - Squad Bet",
        });

        expect(result).toEqual("interface event");
      });

      it("should return correct UNSELECTED InterfaceEvent when isSelected is true", () => {
        const action = {
          payload: {
            cardUrn: "urn:test",
            eventName: "event-name",
            incidentType: "penalty_kick",
            participantUrn: "urn:2",
            playerName: "John Doe",
          },
        };

        const state = {};

        const result = getSquadBetPlayerPickerToggleSquadParticipantEvent(action, state);

        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action: "unselected",
          elementText: "player - John Doe",
          eventContext: "event-name",
          module: "home - null - penalty kick - player picker - tab - Squad Bet",
        });

        expect(result).toEqual("interface event");
      });
    });
  });

  describe("getToggleSquadVsSquadPlayersTooltipEvent", () => {
    it("should return correct InterfaceEvent", () => {
      const action = {
        payload: {
          cardUrn: "urn:test",
          actionType: "actionType",
        },
      };

      const state = {};

      const result = getToggleSquadVsSquadPlayersTooltipEvent(action, state);

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: "actionType",
        elementText: "players tooltip",
        module: "home - null - title - player picker - tab",
      });

      expect(result).toEqual("interface event");
    });
  });

  describe("getSquadBetPlayerPickerBetButtonClickEvent", () => {
    it("should return correct InterfaceEvent", () => {
      const action = {
        payload: {
          eventName: "event-name",
          incidentType: "goal_kick",
          buttonStatus: "default",
          buttonLabel: "3+",
        },
      };

      const state = {};

      const result = getSquadBetPlayerPickerBetButtonClickEvent(action, state);

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: "selected",
        elementText: "bet button - 3+",
        eventContext: "event-name",
        module: "home - null - goal kick - player picker - null",
      });

      expect(result).toEqual("interface event");
    });
  });
  describe("getObbEnhancedPlayerCounterEvent", () => {
    describe("when the typeAction é open", () => {
      describe("and we are at open tab view", () => {
        beforeEach(() => {
          getLayoutMetadata.mockImplementationOnce(() => ({
            viewUrn: "urn:open",
          }));
        });
        it("should return correct InterfaceEvent", () => {
          const action = {
            payload: {
              eventName: "event-name",
              actionType: "closed",
              betLegPartType: "xOfN",
              cardUrn: "urn:open",
            },
          };

          const state = {};

          const result = getObbEnhancedPlayerCounterEvent(action, state);

          expect(buildInterfaceEvent).toHaveBeenCalledWith({
            action: "closed",
            elementText: "hide player progress",
            eventContext: "event-name",
            module: "home - null - obp - squadbet multi - open",
          });

          expect(result).toEqual("interface event");
        });
      });
      describe("and we are at settled tab view", () => {
        beforeEach(() => {
          getLayoutMetadata.mockImplementationOnce(() => ({
            viewUrn: "urn:settled",
          }));
        });
        it("should return correct InterfaceEvent", () => {
          const action = {
            payload: {
              eventName: "event-name",
              actionType: "closed",
              betLegPartType: "participantsCombined",
              cardUrn: "urn:settled",
            },
          };

          const state = {};

          const result = getObbEnhancedPlayerCounterEvent(action, state);

          expect(buildInterfaceEvent).toHaveBeenCalledWith({
            action: "closed",
            elementText: "hide player progress",
            eventContext: "event-name",
            module: "home - null - obp - squadbet single - settled",
          });

          expect(result).toEqual("interface event");
        });
      });
    });
    describe("when the typeAction é closed", () => {
      beforeEach(() => {
        getLayoutMetadata.mockImplementationOnce(() => ({
          viewUrn: "urn:test:open",
        }));
      });
      it("should return correct InterfaceEvent", () => {
        const action = {
          payload: {
            eventName: "event-name",
            actionType: "opened",
            betLegPartType: "participantsCombined",
            cardUrn: "urn:open",
          },
        };

        const state = {};

        const result = getObbEnhancedPlayerCounterEvent(action, state);

        expect(buildInterfaceEvent).toHaveBeenCalledWith({
          action: "opened",
          elementText: "show player progress",
          eventContext: "event-name",
          module: "home - null - obp - squadbet single - open",
        });

        expect(result).toEqual("interface event");
      });
    });
  });

  describe("getGenerosityWalletPebbleClickEvent", () => {
    it("should call buildInterfaceEvent with the right props when value is defined", () => {
      const action = {
        payload: {
          isFromBetslip: true,
          toPebble: "free bets",
          currentPebble: "all",
        },
      };

      const result = getGenerosityWalletPebbleClickEvent(action);

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLICKED,
        elementText: "pebble - free bets",
        module: "betslip - generosity wallet - all",
      });

      expect(result).toEqual("interface event");
    });

    it("should call buildInterfaceEvent with the right props when value is not defined", () => {
      const action = {
        payload: {
          isFromBetslip: false,
          toPebble: "free bets",
          currentPebble: "all",
        },
      };

      const result = getGenerosityWalletPebbleClickEvent(action);

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLICKED,
        elementText: "pebble - free bets",
        module: "generosity wallet - all",
      });

      expect(result).toEqual("interface event");
    });
  });

  describe("getGenerosityWalletApplyButtonClickEvent", () => {
    it("should call buildInterfaceEvent with the right props when value is defined", () => {
      const action = {
        payload: {
          walletDescription: "free bets",
          walletType: WalletTypes.BonusCash,
          value: "1",
          totalAmount: "10",
          currentPebble: "all",
        },
      };

      const result = getGenerosityWalletApplyButtonClickEvent(action);

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLICKED,
        elementText: "apply free bets - 1 leg - 10",
        module: "betslip - generosity wallet - all",
      });

      expect(result).toEqual("interface event");
    });
    it("should call buildInterfaceEvent with the right props when value is not defined", () => {
      const action = {
        payload: {
          walletDescription: "free bets",
          walletType: WalletTypes.BonusCash,
          value: undefined,
          totalAmount: "10",
          currentPebble: "all",
        },
      };

      const result = getGenerosityWalletApplyButtonClickEvent(action);

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLICKED,
        elementText: "apply free bets - 10",
        module: "betslip - generosity wallet - all",
      });

      expect(result).toEqual("interface event");
    });
    it("should call buildInterfaceEvent with the right props when walletType is not defined", () => {
      const action = {
        payload: {
          walletDescription: undefined,
          walletType: undefined,
          value: undefined,
          totalAmount: "10",
          currentPebble: "all",
        },
      };

      const result = getGenerosityWalletApplyButtonClickEvent(action);

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLICKED,
        elementText: "apply - none",
        module: "betslip - generosity wallet - all",
      });

      expect(result).toEqual("interface event");
    });
    it("should call buildInterfaceEvent with the right props when walletType is money back and numberOfPlaces is defined", () => {
      const action = {
        payload: {
          walletDescription: "money back",
          walletType: WalletTypes.MoneyBackToken,
          value: undefined,
          totalAmount: "10",
          currentPebble: "all",
          numberOfPlaces: 3,
        },
      };

      const result = getGenerosityWalletApplyButtonClickEvent(action);

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLICKED,
        elementText: "apply money back - placed - 10",
        module: "betslip - generosity wallet - all",
      });

      expect(result).toEqual("interface event");
    });
    it("should call buildInterfaceEvent with the right props when walletType is money back and numberOfPlaces is not defined", () => {
      const action = {
        payload: {
          walletDescription: "money back",
          walletType: WalletTypes.MoneyBackToken,
          value: undefined,
          totalAmount: "10",
          currentPebble: "all",
          numberOfPlaces: undefined,
        },
      };

      const result = getGenerosityWalletApplyButtonClickEvent(action);

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLICKED,
        elementText: "apply money back - losers - 10",
        module: "betslip - generosity wallet - all",
      });

      expect(result).toEqual("interface event");
    });
    it("should call buildInterfaceEvent without amount suffix when walletType is ghost leg", () => {
      const action = {
        payload: {
          walletDescription: "ghost leg",
          walletType: WalletTypes.GhostLegToken,
          value: "1",
          totalAmount: "0",
          currentPebble: "all",
        },
      };

      const result = getGenerosityWalletApplyButtonClickEvent(action);

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLICKED,
        elementText: "apply ghost leg - 1 leg",
        module: "betslip - generosity wallet - all",
      });

      expect(result).toEqual("interface event");
    });
  });

  describe("getBetslipSliderInteractionEvent", () => {
    it("should return correct InterfaceEvent", () => {
      const action = {
        payload: {
          eventName: "Man Utd vs Man City",
          source: "selector",
          direction: "decrease",
        },
      };

      const result = getBetslipSliderInteractionEvent(action);

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: "selected",
        elementText: "decrease slider selector",
        eventContext: "Man Utd vs Man City",
        gameFilter: "null",
        module: "betslip - or slider",
        swimlaneType: "null",
      });

      expect(result).toEqual("interface event");
    });

    it("should return correct InterfaceEvent with button", () => {
      const action = {
        payload: {
          eventName: "Man Utd vs Man City",
          source: "button",
          direction: "increase",
        },
      };

      const result = getBetslipSliderInteractionEvent(action);

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: "clicked",
        elementText: "increase slider button",
        eventContext: "Man Utd vs Man City",
        gameFilter: "null",
        module: "betslip - or slider",
        swimlaneType: "null",
      });

      expect(result).toEqual("interface event");
    });
  });

  describe("getBetslipSliderDisplayedEvent", () => {
    it("should return correct InterfaceEvent", () => {
      const action = {
        payload: {
          eventName: "Man Utd vs Man City",
        },
      };
      const state = {
        betslip: {},
      };

      const result = getBetslipSliderDisplayedEvent(action, state);

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: "displayed",
        elementText: "or slider",
        eventContext: "Man Utd vs Man City",
        gameFilter: "null",
        module: "betslip - or slider",
        swimlaneType: "null",
      });

      expect(result).toEqual("interface event");
    });
  });

  describe("getObbEventPopularsShowMoreEvent", () => {
    it("should return show more elementText when showMore is true", () => {
      const action = {
        payload: {
          cardUrn: "cardUrn",
          eventName: "napoli v chelsea",
          showMore: true,
        },
      };

      const result = getObbEventPopularsShowMoreEvent(action);

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: "clicked",
        elementText: "show more",
        eventContext: "napoli v chelsea",
        module: "getModuleData",
      });

      expect(result).toEqual("interface event");
    });

    it("should return show less elementText when showMore is false", () => {
      const action = {
        payload: {
          cardUrn: "cardUrn",
          eventName: "napoli v chelsea",
          showMore: false,
        },
      };

      const result = getObbEventPopularsShowMoreEvent(action);

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: "clicked",
        elementText: "show less",
        eventContext: "napoli v chelsea",
        module: "getModuleData",
      });

      expect(result).toEqual("interface event");
    });
  });

  describe("getObbOnboardingCardsCardGroupSwipeEvent", () => {
    const state = {};

    it("should return a swiped right event when direction is right", () => {
      const action = {
        payload: {
          urn: "cardGroupUrn",
          eventName: "team a vs team b",
          direction: "right",
        },
      };

      const result = getObbOnboardingCardsCardGroupSwipeEvent(action, state);

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: "swiped right",
        elementText: "null",
        gameFilter: "null",
        eventContext: "team a vs team b",
        module: "getModuleData",
      });

      expect(result).toEqual("interface event");
    });

    it("should return a swiped left event when direction is left", () => {
      const action = {
        payload: {
          urn: "cardGroupUrn",
          eventName: "team a vs team b",
          direction: "left",
        },
      };

      const result = getObbOnboardingCardsCardGroupSwipeEvent(action, state);

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: "swiped left",
        elementText: "null",
        gameFilter: "null",
        eventContext: "team a vs team b",
        module: "getModuleData",
      });

      expect(result).toEqual("interface event");
    });

    it("should call getLayoutMetadata with the cardGroupUrn", () => {
      const action = {
        payload: {
          urn: "onboarding:card:group:urn",
          eventName: "team a vs team b",
          direction: "right",
        },
      };

      getObbOnboardingCardsCardGroupSwipeEvent(action, state);

      expect(getLayoutMetadata).toHaveBeenCalledWith("onboarding:card:group:urn");
    });
  });

  describe("getObbOnboardingCardsCardGroupDisplayedEvent", () => {
    const state = {};

    it("should return a displayed event with the correct elementText", () => {
      const action = {
        payload: {
          urn: "cardGroupUrn",
          eventName: "team a vs team b",
          numberOfCards: 3,
        },
      };

      const result = getObbOnboardingCardsCardGroupDisplayedEvent(action, state);

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: "displayed",
        elementText: "popular picks 3",
        gameFilter: "null",
        eventContext: "team a vs team b",
        module: "getModuleData",
      });

      expect(result).toEqual("interface event");
    });

    it("should reflect the number of cards in elementText", () => {
      const action = {
        payload: {
          urn: "cardGroupUrn",
          eventName: "team a vs team b",
          numberOfCards: 1,
        },
      };

      getObbOnboardingCardsCardGroupDisplayedEvent(action, state);

      expect(buildInterfaceEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          elementText: "popular picks 1",
        }),
      );
    });

    it("should call getLayoutMetadata with the cardGroupUrn", () => {
      const action = {
        payload: {
          urn: "onboarding:card:group:urn",
          eventName: "team a vs team b",
          numberOfCards: 2,
        },
      };

      getObbOnboardingCardsCardGroupDisplayedEvent(action, state);

      expect(getLayoutMetadata).toHaveBeenCalledWith("onboarding:card:group:urn");
    });
  });
});
