import { ProductsOption } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";

import { CAMPAIGN_MEASUREMENT } from "@ppb/tbd-store/actions/campaign-measurement";
import { UI__BOTTOM_BAR_CLICK, UI__LAUNCH_GAME_FROM_PN } from "@ppb/tbd-store/actions/navigation";
import { UI__SWITCH_PRODUCT_PREFERENCE } from "@ppb/tbd-store/actions/preferences";
import { BOTTOM_BAR_PUSH, EXTERNAL_PUSH, GENERIC_PUSH } from "@ppb/tbd-store/actions/router";
import { createSimpleSelectionsCounterSelector } from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { createGetBottomBarTilesSelector } from "@ppb/tbd-store/state/layout/cards/bottom-bar/bottom-bar-card-selectors";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { UI__BOTTOM_BAR_GAME_LAUNCH } from "@ppb/tbd-store/actions/game-launch";
import { PlatformType } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";

import { createBottomBarViewModel, createGetProductSwitcherConfigSelector } from "./bottom-bar-view-model";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

const getBottomBarTiles = jest.fn();
const getPropsForBottomBarVm = jest.fn();
const getSimpleSelectionsCounter = jest.fn();
const getProductSwitcherConfig = jest.fn();
const getGetCountryLocalCurrencyCodeSelector = jest.fn();

jest.mock("@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors", () => ({
  createSimpleSelectionsCounterSelector: jest.fn(() => getSimpleSelectionsCounter),
}));

jest.mock("@ppb/tbd-store/state/layout/cards/bottom-bar/bottom-bar-card-selectors", () => ({
  createGetBottomBarTilesSelector: jest.fn(() => getBottomBarTiles),
}));

jest.mock("@ppb/tbd-store/state/betslip/betslip-card-selectors", () => ({
  getBetslipExchangeContext: jest.fn(() => false),
  getSportsbookPlacedCombinations: jest.fn(() => undefined),
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(() => getGetCountryLocalCurrencyCodeSelector),
  getUserDetails: jest.fn(() => ({ localeCode: "en-GB", jurisdiction: { jurisdiction: "INTERNATIONAL" } })),
}));

jest.mock("../../helpers/i18n", () => ({ i18n: jest.fn(({ key }) => key) }));

jest.mock("./bottom-bar-view-model", () => ({
  createBottomBarViewModel: jest.fn(() => getPropsForBottomBarVm),
  createGetProductSwitcherConfigSelector: jest.fn(() => getProductSwitcherConfig),
}));

jest.mock("@ppb/tbd-shared/config/base-path-utils.native", () => ({
  getBasePath: jest.fn(() => "betfair.com"),
}));

jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());
const BOTTOM_BAR_TILES = ["tile1", "tile2", "tile3", "tile4", "tile5"];
const BOTTOM_BAR_TRANSLATIONS = ["Home", "Browse", "My Bets", "Gaming", "Sky Bet Club"];
const BOTTOM_BAR_ITEMS = [
  {
    tileType: "HOME",
    title: "Home",
    viewLink: {
      viewUrl: "",
      viewUrn: "ppb:tbd:view:sport:1",
    },
  },
  {
    tileType: "BROWSE",
    title: "Browse",
    viewLink: {
      viewUrl: "browse",
      viewUrn: "ppb:tbd:view:browse:browse",
    },
  },
  {
    tileType: "MY_BETS",
    title: "My Bets",
    viewLink: {
      viewUrl: "myBets",
      viewUrn: "ppb:tbd:view:myBets",
    },
  },
  {
    tileType: "GAMING",
    title: "Casino",
    viewLink: {
      viewUrl: "casino",
      viewUrn: "ppb:tbd:view:gaming",
    },
  },
  {
    tileType: "SKY_BET_CLUB",
    title: "Sky Bet Club",
    viewLink: {
      viewUrl: "skybetclub",
      viewUrn: "ppb:tbd:view:external",
    },
  },
];

const STATE_MOCK = {
  layouts: {
    cards: {
      bottombar: {},
    },
    views: "VIEWS",
  },
  betslip: { isCollapsed: false },
  entities: {},
  router: {
    currentView: "ppb:tbd:view:gaming",
  },
};

describe("makeMapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  it("should be a factory function", () => {
    expect(makeMapStateToProps()).toEqual(expect.any(Function));
  });

  it("should create bottom bar view model", () => {
    makeMapStateToProps();

    expect(createBottomBarViewModel).toHaveBeenCalledTimes(1);
    expect(createBottomBarViewModel).toHaveBeenCalledWith();
    expect(createGetProductSwitcherConfigSelector).toHaveBeenCalledTimes(1);
    expect(createGetProductSwitcherConfigSelector).toHaveBeenCalledWith();
    expect(createSimpleSelectionsCounterSelector).toHaveBeenCalledTimes(1);
    expect(createSimpleSelectionsCounterSelector).toHaveBeenCalledWith();
    expect(createGetCountryLocalCurrencyCodeSelector).toHaveBeenCalledTimes(1);
    expect(createGetCountryLocalCurrencyCodeSelector).toHaveBeenCalledWith();
    expect(createGetBottomBarTilesSelector).toHaveBeenCalledTimes(1);
    expect(createGetBottomBarTilesSelector).toHaveBeenCalledWith();
  });

  describe("mapStateToProps", () => {
    describe("when there is layout for provided URN", () => {
      let getBottomBarViewModel;

      beforeAll(() => {
        getBottomBarViewModel = jest.fn(() => ({
          items: BOTTOM_BAR_ITEMS,
          englishTranslations: BOTTOM_BAR_TRANSLATIONS,
        }));
        createBottomBarViewModel.mockImplementation(() => getBottomBarViewModel);
        createSimpleSelectionsCounterSelector.mockImplementation(() => () => 0);
        getBottomBarTiles.mockReturnValue(BOTTOM_BAR_TILES);
        getProductSwitcherConfig.mockReturnValue("ProductSwitcherConfig");
      });

      it("should return props", () => {
        const stateMock = {
          layouts: {
            cards: {
              bottombar: {},
            },
            views: "VIEWS",
          },
          betslip: { isCollapsed: false },
          entities: {},
          router: {
            currentView: "ppb:tbd:view:generic",
            currentUrn: "ppb:tbd:view:generic:home",
          },
        };
        const mapStateToProps = makeMapStateToProps();
        const props = mapStateToProps(stateMock);

        expect(getBottomBarTiles).toHaveBeenCalledTimes(1);
        expect(getBottomBarTiles).toHaveBeenCalledWith(stateMock.layouts.cards.bottombar);
        expect(getBottomBarViewModel).toHaveBeenCalledTimes(1);
        expect(getBottomBarViewModel).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining({
            bottomBarTiles: BOTTOM_BAR_TILES,
            localeCode: undefined,
          }),
        );
        expect(getProductSwitcherConfig).toHaveBeenCalledTimes(1);
        expect(getProductSwitcherConfig).toHaveBeenCalledWith(stateMock);

        expect(props).toEqual({
          items: BOTTOM_BAR_ITEMS,
          selectedIndex: 0,
          isBetslipCollapsed: false,
          isBetslipOpen: false,
          isReceiptOpen: false,
          productSwitcherConfig: "ProductSwitcherConfig",
          gtmTranslations: BOTTOM_BAR_TRANSLATIONS,
          environmentProduct: "betfair.com",
          jurisdiction: "INTERNATIONAL",
        });
      });

      it("should return props - browse tile", () => {
        const mapStateToProps = makeMapStateToProps();
        const props = mapStateToProps({
          ...STATE_MOCK,
          router: {
            currentView: "ppb:tbd:view:browse",
          },
        });

        expect(props).toEqual({
          items: BOTTOM_BAR_ITEMS,
          selectedIndex: 1,
          isBetslipCollapsed: false,
          isBetslipOpen: false,
          isReceiptOpen: false,
          productSwitcherConfig: "ProductSwitcherConfig",
          gtmTranslations: BOTTOM_BAR_TRANSLATIONS,
          environmentProduct: "betfair.com",
          jurisdiction: "INTERNATIONAL",
        });
      });

      it("should return props - my bets tile", () => {
        const mapStateToProps = makeMapStateToProps();
        const props = mapStateToProps({
          ...STATE_MOCK,
          router: {
            currentView: "ppb:tbd:view:myBets",
          },
        });

        expect(props).toEqual({
          items: BOTTOM_BAR_ITEMS,
          selectedIndex: 2,
          isBetslipCollapsed: false,
          isBetslipOpen: false,
          isReceiptOpen: false,
          productSwitcherConfig: "ProductSwitcherConfig",
          gtmTranslations: BOTTOM_BAR_TRANSLATIONS,
          environmentProduct: "betfair.com",
          jurisdiction: "INTERNATIONAL",
        });
      });

      it("should return props - casino tile", () => {
        const mapStateToProps = makeMapStateToProps();
        const props = mapStateToProps({
          ...STATE_MOCK,
          router: {
            currentView: "ppb:tbd:view:gaming",
          },
        });

        expect(props).toEqual({
          items: BOTTOM_BAR_ITEMS,
          selectedIndex: 3,
          isBetslipCollapsed: false,
          isBetslipOpen: false,
          isReceiptOpen: false,
          productSwitcherConfig: "ProductSwitcherConfig",
          gtmTranslations: BOTTOM_BAR_TRANSLATIONS,
          environmentProduct: "betfair.com",
          jurisdiction: "INTERNATIONAL",
        });
      });

      describe("when state has user details entity", () => {
        let stateMock;

        beforeEach(() => {
          stateMock = {
            layouts: {
              cards: {
                bottombar: {},
              },
              views: "VIEWS",
            },
            betslip: { isCollapsed: false },
            entities: { userdetails: { localeCode: "jp" } },
            router: {
              currentView: "ppb:tbd:view:browse",
            },
          };
        });

        it("should call getBottomBarViewModel with localeCode from store", () => {
          getGetCountryLocalCurrencyCodeSelector.mockReturnValue({ localeCode: "jp" });
          const mapStateToProps = makeMapStateToProps();
          const props = mapStateToProps(stateMock);

          expect(getBottomBarViewModel).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
              bottomBarTiles: BOTTOM_BAR_TILES,
              localeCode: "jp",
            }),
          );

          expect(props).toEqual({
            items: BOTTOM_BAR_ITEMS,
            selectedIndex: 1,
            isBetslipCollapsed: false,
            isBetslipOpen: false,
            isReceiptOpen: false,
            productSwitcherConfig: "ProductSwitcherConfig",
            gtmTranslations: BOTTOM_BAR_TRANSLATIONS,
            environmentProduct: "betfair.com",
            jurisdiction: "INTERNATIONAL",
          });
        });

        describe("when `getGetCountryLocalCurrencyCodeSelector` throws", () => {
          const GET_USER_DETAILS_ERROR = "GET_USER_DETAILS_ERROR";

          beforeEach(() => {
            getGetCountryLocalCurrencyCodeSelector.mockImplementationOnce(() => {
              throw new Error(GET_USER_DETAILS_ERROR);
            });
          });

          it("should call console.error with the error thrown from `getUserDetailsSelector`", () => {
            makeMapStateToProps()(stateMock);

            expect(global.console.error).toHaveBeenCalledWith(new Error("GET_USER_DETAILS_ERROR"));
          });

          it("should return a default object", () => {
            expect(makeMapStateToProps()(stateMock)).toEqual({
              items: [],
              selectedIndex: 0,
              gtmTranslations: [],
              isBetslipCollapsed: false,
              isBetslipOpen: false,
              isReceiptOpen: false,
            });
          });
        });
      });

      it("should return props with isReceiptOpen true when cashout receipt is open", () => {
        const mapStateToProps = makeMapStateToProps();
        const props = mapStateToProps({
          layouts: {
            cards: {
              bottombar: "the bottom bar",
              betslip: { isCollapsed: false },
              receipt: {
                someProps: "someData",
              },
            },
          },
          entities: {},
          router: {},
        });

        expect(props.isReceiptOpen).toEqual(true);
      });
    });
  });
});

describe("mapDispatchToProps", () => {
  beforeEach(jest.clearAllMocks);
  const viewLinkMock = { viewUrl: "fakeUrl", viewUrn: "fakeUrn" };

  describe("dispatchBottomBarNavigation", () => {
    it("should dispatch bottom bar navigation", () => {
      const { dispatchBottomBarNavigation } = mapDispatchToProps;
      const tileGtmTranslationsMock = "HOME";

      expect(dispatchBottomBarNavigation(viewLinkMock, tileGtmTranslationsMock)).toEqual({
        type: UI__BOTTOM_BAR_CLICK,
        payload: {
          path: viewLinkMock.viewUrl,
          tile: tileGtmTranslationsMock,
        },
      });
    });
  });

  describe("dispatchBottomBarGameLaunch", () => {
    it("should dispatch bottom bar navigation", () => {
      const { dispatchBottomBarGameLaunch } = mapDispatchToProps;
      const tileGtmTranslationsMock = "BLACKJACK";

      expect(dispatchBottomBarGameLaunch(viewLinkMock, tileGtmTranslationsMock)).toEqual({
        type: UI__BOTTOM_BAR_GAME_LAUNCH,
        payload: {
          path: viewLinkMock.viewUrl,
          tile: tileGtmTranslationsMock,
        },
      });
    });
  });

  describe("dispatchGenericPushAction", () => {
    it("should dispatch generic push action", () => {
      const { dispatchGenericPushAction } = mapDispatchToProps;

      expect(dispatchGenericPushAction(viewLinkMock)).toEqual({
        type: GENERIC_PUSH,
        payload: viewLinkMock,
      });
    });
  });

  describe("dispatchBottomBarPushAction", () => {
    it("should dispatch bottom bar push action", () => {
      const { dispatchBottomBarPushAction } = mapDispatchToProps;

      expect(dispatchBottomBarPushAction(viewLinkMock)).toEqual({
        type: BOTTOM_BAR_PUSH,
        payload: viewLinkMock,
      });
    });
  });

  describe("dispatchSwitchProductPreferenceAction", () => {
    describe("when productSwitcherPreference is sportsbook", () => {
      it("should dispatch switch product preference action with exchange payload", () => {
        const { dispatchNativeSwitchProductPreferenceAction } = mapDispatchToProps;

        expect(dispatchNativeSwitchProductPreferenceAction(ProductsOption.sportsbook)).toEqual({
          type: UI__SWITCH_PRODUCT_PREFERENCE,
          payload: { productSwitcherPreference: ProductsOption.exchange },
        });
      });
    });
    describe("when productSwitcherPreference is exchange", () => {
      it("should dispatch switch product preference action with sportsbook payload", () => {
        const { dispatchNativeSwitchProductPreferenceAction } = mapDispatchToProps;

        expect(dispatchNativeSwitchProductPreferenceAction(ProductsOption.exchange)).toEqual({
          type: UI__SWITCH_PRODUCT_PREFERENCE,
          payload: { productSwitcherPreference: ProductsOption.sportsbook },
        });
      });
    });
  });

  describe("dispatchGoToExchangeXSellAction", () => {
    it("should dispatch exchange XSell action", () => {
      const { dispatchGoToExchangeXSellAction } = mapDispatchToProps;

      expect(dispatchGoToExchangeXSellAction()).toEqual({
        type: EXTERNAL_PUSH,
        payload: {
          viewUrn: "",
          viewUrl: "/exchange/",
          gtmData: {
            label: "Exchange",
            moduleName: "bottom ribbon",
          },
        },
      });
    });
  });

  describe("dispatchWebSwitchProductPreferenceAction", () => {
    it("should dispatch external push action with the given viewUrl", () => {
      const { dispatchWebSwitchProductPreferenceAction } = mapDispatchToProps;

      expect(dispatchWebSwitchProductPreferenceAction("?product=exc", ProductsOption.exchange)).toEqual({
        type: EXTERNAL_PUSH,
        payload: {
          viewUrn: "",
          viewUrl: "?product=exc",
          gtmData: {
            label: ProductsOption.exchange,
            moduleName: "bottom ribbon",
          },
        },
      });
    });

    it("should use the provided viewUrl verbatim", () => {
      const { dispatchWebSwitchProductPreferenceAction } = mapDispatchToProps;

      expect(dispatchWebSwitchProductPreferenceAction("?product=sbk", ProductsOption.sportsbook)).toEqual({
        type: EXTERNAL_PUSH,
        payload: {
          viewUrn: "",
          viewUrl: "?product=sbk",
          gtmData: {
            label: ProductsOption.sportsbook,
            moduleName: "bottom ribbon",
          },
        },
      });
    });
  });

  describe("dispatchCampaignMeasurementAction", () => {
    it("should dispatch exchange XSell action", () => {
      const { dispatchCampaignMeasurementAction } = mapDispatchToProps;
      expect(dispatchCampaignMeasurementAction()).toEqual({ type: CAMPAIGN_MEASUREMENT });
    });
  });

  describe("dispatchOpenPredicts", () => {
    it("should dispatch a UI/OPEN_PREDICTS action", () => {
      const { dispatchOpenPredicts } = mapDispatchToProps;
      expect(dispatchOpenPredicts()).toEqual({ type: "UI/OPEN_PREDICTS" });
    });
  });

  describe("dispatchLaunchGameFromPN", () => {
    it("should dispatch UI__LAUNCH_GAME_FROM_PN with correct payload from push notification", () => {
      const { dispatchLaunchGameFromPN } = mapDispatchToProps;
      const gameViewLinkMock = {
        viewUrl: "game-launch-url",
        viewUrn: "ppb:tbd:view:gaming",
      };
      const gameId = "game1";
      expect(dispatchLaunchGameFromPN(gameViewLinkMock, gameId, PlatformType.Native)).toEqual({
        type: UI__LAUNCH_GAME_FROM_PN,
        payload: {
          href: "game-launch-url",
          gameId: "game1",
          platformType: PlatformType.Native,
        },
      });
    });
    it("should not dispatch if viewLink is missing", () => {
      const dispatch = jest.fn();
      const { dispatchLaunchGameFromPN } = mapDispatchToProps;

      dispatchLaunchGameFromPN(undefined);

      expect(dispatch).not.toHaveBeenCalled();
    });
  });
});
