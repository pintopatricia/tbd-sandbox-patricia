import {
  ExchangeDefaultModeOption,
  ExchangeDefaultProductOption,
  ProductsOption,
} from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { createBottomBarViewModel, createGetProductSwitcherConfigSelector } from "./bottom-bar-view-model";
import { getCookie } from "../../helpers/cookies.web";

const getUserPreferencesWithProductSwitcher = jest.fn();
const getProductPreferenceWithProductSwitcher = jest.fn();
const getIsProductSwitcherActive = jest.fn();
const getIsProductSwitcherNativeActive = jest.fn();
const getIsExchangeEnabled = jest.fn().mockReturnValue(false);
const getCanUsePhoenixExchange = jest.fn().mockReturnValue(false);
const getThrottle = jest.fn();
const getExperiments = jest.fn();
const getExchangeDefaultMode = jest.fn();

jest.mock("../../config/endpoints", () => ({
  getEndpoint: jest.fn().mockReturnValue("gamelauncher"),
}));

jest.mock("../../helpers/cookies.web", () => ({
  getCookie: jest.fn(),
}));

const stateMock = {
  entities: {
    preferences: {},
    experiments: {
      "exp-search-bottom-bar": {
        variant: "control",
      },
      "bottom-bar-game-launch": {
        variant: "control",
      },
      "exp-bf-sport-bottom-bar-inplay-button": {
        variant: "control",
      },
    },
  },
  boot: {
    isExchangeEnabled: false,
    canUsePhoenixExchange: false,
  },
};

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors", () => ({
  createUserPreferencesWithProductSwitcherSelector: jest.fn(() => getUserPreferencesWithProductSwitcher),
  createProductPreferenceWithProductSwitcherSelector: jest.fn(() => getProductPreferenceWithProductSwitcher),
  createExchangeDefaultModeSelector: jest.fn(() => getExchangeDefaultMode),
}));

jest.mock("@ppb/tbd-store/state/application-state-selectors", () => ({
  createIsProductSwitcherActiveSelector: jest.fn(() => getIsProductSwitcherActive),
  createIsProductSwitcherActiveNativeSelector: jest.fn(() => getIsProductSwitcherNativeActive),
}));

jest.mock("@ppb/tbd-store/state/boot/boot-selectors", () => ({
  getIsExchangeEnabled: jest.fn(() => getIsExchangeEnabled()),
  getCanUsePhoenixExchange: jest.fn(() => getCanUsePhoenixExchange()),
}));

jest.mock("@ppb/tbd-store/state/entities/throttles/throttles-selectors", () => ({
  createGetThrottleSelector: jest.fn(() => getThrottle),
}));

jest.mock("@ppb/tbd-store/state/entities/experiments/experiments-selectors", () => ({
  createGetExperimentSelector: jest.fn(() => getExperiments),
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn(() => ({ loggedIn: false })),
}));

describe("createBottomBarViewModel", () => {
  beforeEach(jest.clearAllMocks);

  it("should be a factory function", () => {
    const bottomBarViewModel = createBottomBarViewModel();
    expect(bottomBarViewModel).toEqual(expect.any(Function));
    expect(bottomBarViewModel).not.toBe(createBottomBarViewModel());
  });

  it("should return the bottom bar view-model structure without items when there are no tiles", () => {
    const bottomBarViewModel = createBottomBarViewModel();
    const emptyResult = bottomBarViewModel(stateMock, []);

    expect(emptyResult).toEqual({ items: [], englishTranslations: [] });
  });

  it("should return the bottom bar view-model structure with 3 tiles items according", () => {
    const bottomBarViewModel = createBottomBarViewModel();
    const result = bottomBarViewModel(stateMock, {
      bottomBarTiles: [
        {
          tileType: "HOME",
          viewLink: {
            viewUrn: "ppb:tbd:view:sport:1",
            viewUrl: "football/sport:1",
          },
        },
        {
          tileType: "BROWSE",
          viewLink: {
            viewUrn: "ppb:tbd:view:browse:1",
            viewUrl: "browse",
          },
        },
        {
          tileType: "MY_BETS",
          viewLink: {
            viewUrn: "ppb:tbd:view:myBets:1",
            viewUrl: "mybets",
          },
        },
        {
          tileType: "PROMOTIONS",
          viewLink: {
            viewUrn: "ppb:tbd:view:external:external",
            viewUrl: "https://www.betfair.com/promotions/offers",
            viewDisplayMode: "BLANK_WEBVIEW",
          },
        },
      ],
      localeCode: "en",
    });

    expect(result).toEqual({
      items: [
        {
          tileType: "HOME",
          viewLink: {
            viewUrn: "ppb:tbd:view:sport:1",
            viewUrl: "football/sport:1",
          },
          title: "I18N.NAVIGATION_BAR.HOME",
        },
        {
          tileType: "BROWSE",
          viewLink: {
            viewUrn: "ppb:tbd:view:browse:1",
            viewUrl: "browse",
          },
          title: "I18N.NAVIGATION_BAR.BROWSE",
        },
        {
          tileType: "MY_BETS",
          viewLink: {
            viewUrn: "ppb:tbd:view:myBets:1",
            viewUrl: "mybets",
          },
          title: "I18N.NAVIGATION_BAR.MY_BETS",
        },
        {
          tileType: "PROMOTIONS",
          viewLink: {
            viewUrn: "ppb:tbd:view:external:external",
            viewUrl: "https://www.betfair.com/promotions/offers",
            viewDisplayMode: "BLANK_WEBVIEW",
          },
          title: "I18N.NAVIGATION_BAR.PROMOTIONS",
        },
      ],
      englishTranslations: [
        "I18N.NAVIGATION_BAR.HOME",
        "I18N.NAVIGATION_BAR.BROWSE",
        "I18N.NAVIGATION_BAR.MY_BETS",
        "I18N.NAVIGATION_BAR.PROMOTIONS",
      ],
    });
  });

  describe("when the search bar label experiment is active", () => {
    const bottomBarViewModel = createBottomBarViewModel();
    it("should keep Browse label if experimentGroup is control", () => {
      const result = bottomBarViewModel(stateMock, {
        bottomBarTiles: [
          {
            tileType: "BROWSE",
            viewLink: {
              viewUrn: "ppb:tbd:view:browse:1",
              viewUrl: "browse",
            },
          },
        ],
        localeCode: "en",
      });

      expect(result.items[0].title).toEqual("I18N.NAVIGATION_BAR.BROWSE");
    });

    it("should change the label to Search if variant group", () => {
      getExperiments.mockReturnValueOnce({ variant: "search-bottom-bar" });

      const result = bottomBarViewModel(stateMock, {
        bottomBarTiles: [
          {
            tileType: "BROWSE",
            viewLink: {
              viewUrn: "ppb:tbd:view:browse:1",
              viewUrl: "browse",
            },
          },
        ],
        localeCode: "en",
      });

      expect(result.items[0].title).toEqual("I18N.NAVIGATION_BAR.SEARCH");
    });
  });

  describe("when the bottom bar game launch experiment is active", () => {
    it("should return correct bottom bar tile if variant is blackjack", () => {
      const bottomBarViewModel = createBottomBarViewModel();
      getExperiments.mockReturnValueOnce({ variant: "search-bottom-bar" });
      getExperiments.mockReturnValueOnce({ variant: "blackjack-variant" });
      getCookie.mockReturnValue("en");

      const result = bottomBarViewModel(stateMock, {
        bottomBarTiles: [
          {
            tileType: "BROWSE",
            viewLink: {
              viewUrn: "ppb:tbd:view:browse:1",
              viewUrl: "browse",
            },
          },
        ],
        localeCode: "en",
      });

      expect(result.items[1].title).toEqual("I18N.NAVIGATION_BAR.BLACKJACK");
      expect(result.items[1].tileType).toEqual("BLACKJACK");
      expect(result.items[1].viewLink).toEqual({
        viewUrl:
          "gamelauncher?gameId=premium-bkjk-cashout-agg&channel=y&returnURL=http%3A%2F%2Flocalhost%2F&launchProduct=gaming&RPBucket=gaming&mode=real&statusBar=false&dismissButtonPosition=topRight&dataChannel=rebuild&dataContext=web",
        viewUrn: "ppb:tbd:view:external",
      });
    });

    it("should return correct bottom bar tile if variant is roulette", () => {
      const bottomBarViewModel = createBottomBarViewModel();
      getExperiments.mockReturnValueOnce({ variant: "search-bottom-bar" });
      getExperiments.mockReturnValueOnce({ variant: "roulette-variant" });
      getCookie.mockReturnValue("en");

      const result = bottomBarViewModel(stateMock, {
        bottomBarTiles: [
          {
            tileType: "BROWSE",
            viewLink: {
              viewUrn: "ppb:tbd:view:browse:1",
              viewUrl: "browse",
            },
          },
        ],
        localeCode: "en",
      });

      expect(result.items[1].title).toEqual("I18N.NAVIGATION_BAR.ROULETTE");
      expect(result.items[1].tileType).toEqual("ROULETTE");
      expect(result.items[1].viewLink).toEqual({
        viewUrl:
          "gamelauncher?gameId=premium-european-rlt-agg&channel=y&returnURL=http%3A%2F%2Flocalhost%2F&launchProduct=gaming&RPBucket=gaming&mode=real&statusBar=false&dismissButtonPosition=topRight&dataChannel=rebuild&dataContext=web",
        viewUrn: "ppb:tbd:view:external",
      });
    });

    it("should return correct bottom bar tile if variant control", () => {
      const bottomBarViewModel = createBottomBarViewModel();
      getExperiments.mockReturnValueOnce({ variant: "search-bottom-bar" });
      getExperiments.mockReturnValueOnce({ variant: "control" });

      const result = bottomBarViewModel(stateMock, {
        bottomBarTiles: [
          {
            tileType: "BROWSE",
            viewLink: {
              viewUrn: "ppb:tbd:view:browse:1",
              viewUrl: "browse",
            },
          },
        ],
        localeCode: "en",
      });

      expect(result.items[1]).toEqual(undefined);
      expect(result.items.length).toEqual(1);
    });
  });

  describe("IN_PLAY tile", () => {
    describe("when the variant is variant-bottom-bar-inplay-button", () => {
      let bottomBarViewModel;

      beforeEach(() => {
        bottomBarViewModel = createBottomBarViewModel();

        getExperiments.mockReturnValueOnce({ variant: "search-bottom-bar" });
        getExperiments.mockReturnValueOnce({ variant: "control" });
        getExperiments.mockReturnValueOnce({ variant: "variant-bottom-bar-inplay-button" });
      });

      describe("and the home tile exists", () => {
        it("should replace the home tile by inplay if variant is variant-bottom-bar-inplay-button", () => {
          const result = bottomBarViewModel(stateMock, {
            bottomBarTiles: [
              {
                tileType: "HOME",
                viewLink: {
                  viewUrn: "ppb:tbd:view:sport:1",
                  viewUrl: "football/sport:1",
                },
                title: "I18N.NAVIGATION_BAR.HOME",
              },
            ],
          });

          expect(result.items.length).toEqual(1);
          expect(result.items[0].title).toEqual("I18N.SPORT_EVENT.IN_PLAY");
          expect(result.items[0].tileType).toEqual("IN_PLAY");
          expect(result.items[0].viewLink).toEqual({
            viewUrl: "inplay/d-inplay",
            viewUrn: "ppb:tbd:view:generic:inplay",
          });
          expect(result.items[0].statusLabel).toEqual("I18N.COMMON.NEW");
        });
      });

      describe("and the home tile is missing", () => {
        it("should not add inplay button to the bottomBarTiles list", () => {
          const result = bottomBarViewModel(stateMock, {
            bottomBarTiles: [
              {
                tileType: "BROWSE",
                viewLink: {
                  viewUrn: "ppb:tbd:view:browse:1",
                  viewUrl: "browse",
                },
                title: "I18N.NAVIGATION_BAR.BROWSE",
              },
            ],
          });

          expect(result.items.length).toEqual(1);
          expect(result.items[0].title).toEqual("I18N.NAVIGATION_BAR.SEARCH");
          expect(result.items[0].tileType).toEqual("BROWSE");
          expect(result.items[0].viewLink).toEqual({
            viewUrl: "browse",
            viewUrn: "ppb:tbd:view:browse:1",
          });
        });
      });
    });

    describe("when the variant is control", () => {
      it("should keep the home tile as it is", () => {
        const bottomBarViewModel = createBottomBarViewModel();

        getExperiments.mockReturnValueOnce({ variant: "search-bottom-bar" });
        getExperiments.mockReturnValueOnce({ variant: "control" });
        getExperiments.mockReturnValueOnce({ variant: "control" });

        const result = bottomBarViewModel(stateMock, {
          bottomBarTiles: [
            {
              tileType: "HOME",
              viewLink: {
                viewUrn: "ppb:tbd:view:sport:1",
                viewUrl: "football/sport:1",
              },
              title: "I18N.NAVIGATION_BAR.HOME",
            },
          ],
        });

        expect(result.items.length).toEqual(1);
        expect(result.items[0].title).toEqual("I18N.NAVIGATION_BAR.HOME");
        expect(result.items[0].tileType).toEqual("HOME");
        expect(result.items[0].viewLink).toEqual({
          viewUrl: "football/sport:1",
          viewUrn: "ppb:tbd:view:sport:1",
        });
      });
    });
  });

  describe("BROWSE tile", () => {
    const bottomBarViewModel = createBottomBarViewModel();
    const mockBrowsePagePrismicThrottle = (isActive) => (_, throttle) => {
      if (throttle === "BROWSE_PAGE_PRISMIC") {
        return { isActive };
      }
      return undefined;
    };

    it("should add the throttle object to the tile as isActive true", () => {
      getThrottle.mockImplementationOnce(mockBrowsePagePrismicThrottle(true));

      const result = bottomBarViewModel(stateMock, {
        bottomBarTiles: [
          {
            tileType: "BROWSE",
            viewLink: {
              viewUrn: "ppb:tbd:view:browse:1",
              viewUrl: "browse",
            },
          },
        ],
        localeCode: "en",
      });

      expect(result.items[0]).toEqual({
        statusLabel: undefined,
        tileType: "BROWSE",
        viewLink: {
          viewUrn: "ppb:tbd:view:browse:1",
          viewUrl: "browse",
        },
        title: "I18N.NAVIGATION_BAR.BROWSE",
        throttles: {
          isBrowsePagePrismic: true,
        },
      });
    });

    it("should add the throttle object to the tile as isActive false", () => {
      getThrottle.mockImplementationOnce(mockBrowsePagePrismicThrottle(false));

      const result = bottomBarViewModel(stateMock, {
        bottomBarTiles: [
          {
            tileType: "BROWSE",
            viewLink: {
              viewUrn: "ppb:tbd:view:browse:1",
              viewUrl: "browse",
            },
          },
        ],
        localeCode: "en",
      });

      expect(result.items[0]).toEqual({
        tileType: "BROWSE",
        viewLink: {
          viewUrn: "ppb:tbd:view:browse:1",
          viewUrl: "browse",
        },
        title: "I18N.NAVIGATION_BAR.BROWSE",
      });
    });

    it("should add the throttle object to the tile without throttles property", () => {
      const result = bottomBarViewModel(stateMock, {
        bottomBarTiles: [
          {
            tileType: "BROWSE",
            viewLink: {
              viewUrn: "ppb:tbd:view:browse:1",
              viewUrl: "browse",
            },
          },
        ],
        localeCode: "en",
      });

      expect(result.items[0]).toEqual({
        tileType: "BROWSE",
        viewLink: {
          viewUrn: "ppb:tbd:view:browse:1",
          viewUrl: "browse",
        },
        title: "I18N.NAVIGATION_BAR.BROWSE",
      });
    });
  });

  describe("when bottom bar view-model don't change", () => {
    it("should return the same instance", async () => {
      const bottomBarViewModel = createBottomBarViewModel();
      const bottomBarTiles = [
        {
          tileType: "HOME",
          viewLink: {
            viewUrn: "ppb:tbd:view:sport:1",
            viewUrl: "football/sport:1",
          },
        },
        {
          tileType: "BROWSE",
          viewLink: {
            viewUrn: "ppb:tbd:view:browse:1",
            viewUrl: "browse",
          },
        },
        {
          tileType: "MY_BETS",
          viewLink: {
            viewUrn: "ppb:tbd:view:myBets:1",
            viewUrl: "mybets",
          },
        },
      ];

      const result = bottomBarViewModel(stateMock, {
        bottomBarTiles,
      });

      const result2 = bottomBarViewModel(stateMock, {
        bottomBarTiles,
      });

      expect(result).toStrictEqual(result2);

      expect(bottomBarViewModel.recomputations()).toBe(2);

      jest.clearAllMocks();
    });
  });

  describe("when bottom bar tiles don't change, but localeCode changes", () => {
    it("should return a new instance", async () => {
      const bottomBarViewModel = createBottomBarViewModel();
      const bottomBarTiles = [
        {
          tileType: "HOME",
          viewLink: {
            viewUrn: "ppb:tbd:view:sport:1",
            viewUrl: "football/sport:1",
          },
        },
        {
          tileType: "BROWSE",
          viewLink: {
            viewUrn: "ppb:tbd:view:browse:1",
            viewUrl: "browse",
          },
        },
        {
          tileType: "MY_BETS",
          viewLink: {
            viewUrn: "ppb:tbd:view:myBets:1",
            viewUrl: "mybets",
          },
        },
      ];

      const result = bottomBarViewModel(stateMock, {
        bottomBarTiles,
        localeCode: "en",
      });

      const result2 = bottomBarViewModel(stateMock, {
        bottomBarTiles,
        localeCode: "pt",
      });

      expect(result).not.toBe(result2);
      expect(result).toEqual(result2);

      expect(bottomBarViewModel.recomputations()).toBe(2);

      jest.clearAllMocks();
    });
  });

  describe("when there are changes in bottom bar view-model", () => {
    describe("when the bottom bar tiles number view-model changes", () => {
      it("should return a new instance", () => {
        const bottomBarViewModel = createBottomBarViewModel();

        const result = bottomBarViewModel(stateMock, {
          bottomBarTiles: [
            {
              tileType: "HOME",
              viewLink: {
                viewUrn: "ppb:tbd:view:sport:1",
                viewUrl: "football/sport:1",
              },
            },
            {
              tileType: "BROWSE",
              viewLink: {
                viewUrn: "ppb:tbd:view:browse:1",
                viewUrl: "browse",
              },
            },
            {
              tileType: "MY_BETS",
              viewLink: {
                viewUrn: "ppb:tbd:view:myBets:1",
                viewUrl: "mybets",
              },
            },
          ],
          localeCode: "en",
        });

        const result2 = bottomBarViewModel(stateMock, {
          bottomBarTiles: [
            {
              tileType: "HOME",
              viewLink: {
                viewUrn: "ppb:tbd:view:sport:1",
                viewUrl: "football/sport:1",
              },
            },
            {
              tileType: "BROWSE",
              viewLink: {
                viewUrn: "ppb:tbd:view:browse:1",
                viewUrl: "browse",
              },
            },
          ],
          localeCode: "en",
        });

        expect(result).not.toBe(result2);

        expect(bottomBarViewModel.recomputations()).toBe(2);

        jest.clearAllMocks();
      });
    });

    describe("when a tile's viewLink url change", () => {
      it("should return a new instance", () => {
        const bottomBarViewModel = createBottomBarViewModel();

        const result = bottomBarViewModel(stateMock, {
          bottomBarTiles: [
            {
              tileType: "HOME",
              viewLink: {
                viewUrn: "ppb:tbd:view:sport:1",
                viewUrl: "football/sport:1",
              },
            },
            {
              tileType: "BROWSE",
              viewLink: {
                viewUrn: "ppb:tbd:view:browse:1",
                viewUrl: "browse",
              },
            },
            {
              tileType: "MY_BETS",
              viewLink: {
                viewUrn: "ppb:tbd:view:myBets:1",
                viewUrl: "mybets",
              },
            },
          ],
          localeCode: "en",
        });

        const result2 = bottomBarViewModel(stateMock, {
          bottomBarTiles: [
            {
              tileType: "HOME",
              viewLink: {
                viewUrn: "ppb:tbd:view:sport:1",
                viewUrl: "football/sport:1",
              },
            },
            {
              tileType: "BROWSE",
              viewLink: {
                viewUrn: "ppb:tbd:view:browse:1",
                viewUrl: "browse22",
              },
            },
            {
              tileType: "MY_BETS",
              viewLink: {
                viewUrn: "ppb:tbd:view:myBets:1",
                viewUrl: "mybets",
              },
            },
          ],
          localeCode: "en",
        });

        expect(result).not.toBe(result2);

        expect(bottomBarViewModel.recomputations()).toBe(2);

        jest.clearAllMocks();
      });
    });

    describe("when a tile's viewLink urn change", () => {
      it("should return a new instance", () => {
        const bottomBarViewModel = createBottomBarViewModel();

        const result = bottomBarViewModel(stateMock, {
          bottomBarTiles: [
            {
              tileType: "HOME",
              viewLink: {
                viewUrn: "ppb:tbd:view:sport:1",
                viewUrl: "football/sport:1",
              },
            },
            {
              tileType: "BROWSE",
              viewLink: {
                viewUrn: "ppb:tbd:view:browse:1",
                viewUrl: "browse",
              },
            },
            {
              tileType: "MY_BETS",
              viewLink: {
                viewUrn: "ppb:tbd:view:myBets:1",
                viewUrl: "mybets",
              },
            },
          ],
          localeCode: "en",
        });

        const result2 = bottomBarViewModel(stateMock, {
          bottomBarTiles: [
            {
              tileType: "HOME",
              viewLink: {
                viewUrn: "ppb:tbd:view:sport:1",
                viewUrl: "football/sport:1",
              },
            },
            {
              tileType: "BROWSE",
              viewLink: {
                viewUrn: "ppb:tbd:view:browse:12",
                viewUrl: "browse",
              },
            },
            {
              tileType: "MY_BETS",
              viewLink: {
                viewUrn: "ppb:tbd:view:myBets:1",
                viewUrl: "mybets",
              },
            },
          ],
          localeCode: "en",
        });

        expect(result).not.toBe(result2);

        expect(bottomBarViewModel.recomputations()).toBe(2);

        jest.clearAllMocks();
      });
    });

    describe("when a tile's tileType change", () => {
      it("should return a new instance", () => {
        const bottomBarViewModel = createBottomBarViewModel();

        const result = bottomBarViewModel(stateMock, {
          bottomBarTiles: [
            {
              tileType: "HOME",
              viewLink: {
                viewUrn: "ppb:tbd:view:sport:1",
                viewUrl: "football/sport:1",
              },
            },
            {
              tileType: "BROWSE",
              viewLink: {
                viewUrn: "ppb:tbd:view:browse:1",
                viewUrl: "browse",
              },
            },
            {
              tileType: "MY_BETS",
              viewLink: {
                viewUrn: "ppb:tbd:view:myBets:1",
                viewUrl: "mybets",
              },
            },
          ],
          localeCode: "en",
        });

        const result2 = bottomBarViewModel(stateMock, {
          bottomBarTiles: [
            {
              tileType: "HOME",
              viewLink: {
                viewUrn: "ppb:tbd:view:sport:1",
                viewUrl: "football/sport:1",
              },
            },
            {
              tileType: "BROWSE2",
              viewLink: {
                viewUrn: "ppb:tbd:view:browse:1",
                viewUrl: "browse",
              },
            },
            {
              tileType: "MY_BETS",
              viewLink: {
                viewUrn: "ppb:tbd:view:myBets:1",
                viewUrl: "mybets",
              },
            },
          ],
          localeCode: "en",
        });

        expect(result).not.toBe(result2);

        expect(bottomBarViewModel.recomputations()).toBe(2);

        jest.clearAllMocks();
      });
    });
  });
});

describe("createGetProductSwitcherConfigSelector", () => {
  let productSwitcherConfig;
  const BASE_PRODUCT_SWITCHER_CONFIG = {
    title: "I18N.EXCHANGE",
    productPreference: ProductsOption.sportsbook,
    isXSell: false,
    isLoggedIn: false,
    isExcAllowedJurisdictionThrottleActive: false,
    showOnboardingNewLabel: false,
    isProductSwitcherAvailable: {
      default: false,
      native: false,
    },
    onboardingLabelTitle: "I18N.COMMON.NEW",
    shouldShowXSellToPredicts: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    getExchangeDefaultMode.mockReturnValue(ExchangeDefaultModeOption.default);
  });

  describe("when isProductSwitcherAvailable is false", () => {
    it("should return an undefined config", () => {
      getIsProductSwitcherActive.mockReturnValue(false);
      getIsProductSwitcherNativeActive.mockReturnValue(false);
      getUserPreferencesWithProductSwitcher.mockReturnValueOnce({});

      expect(createGetProductSwitcherConfigSelector()(stateMock)).toEqual(undefined);
    });
  });

  describe("when isProductSwitcherAvailable is true", () => {
    beforeAll(() => {
      getIsProductSwitcherActive.mockReturnValue(true);
      productSwitcherConfig = {
        ...BASE_PRODUCT_SWITCHER_CONFIG,
        isProductSwitcherAvailable: {
          default: true,
          native: false,
        },
      };
    });

    describe("and user doesn't have the Exchange product option", () => {
      beforeAll(() => {
        getUserPreferencesWithProductSwitcher.mockReturnValue({
          products: [ProductsOption.sportsbook, ProductsOption.games],
        });
      });

      describe("and productPreference is Sportsbook", () => {
        beforeAll(() => {
          getProductPreferenceWithProductSwitcher.mockReturnValue(ProductsOption.sportsbook);
        });

        describe("and isExchangeEnabled is true", () => {
          beforeAll(() => {
            getIsExchangeEnabled.mockReturnValueOnce(true);
          });

          it("should return the expected config with SBK product, EXC title and a falsy isXSell", () => {
            expect(createGetProductSwitcherConfigSelector()(stateMock)).toEqual({
              ...productSwitcherConfig,
              title: "I18N.EXCHANGE",
              productPreference: ProductsOption.sportsbook,
              isXSell: false,
            });
          });

          describe("and isExchangeEnabled is false", () => {
            it("should return the expected config with SBK product, EXC title and a truthy isXSell", () => {
              expect(createGetProductSwitcherConfigSelector()(stateMock)).toEqual({
                ...productSwitcherConfig,
                title: "I18N.EXCHANGE",
                productPreference: ProductsOption.sportsbook,
                isXSell: true,
              });
            });
          });
        });
      });
    });

    describe("and user doesn't have the Sportsbook product option", () => {
      beforeAll(() => {
        getUserPreferencesWithProductSwitcher.mockReturnValue({
          products: [ProductsOption.exchange, ProductsOption.games],
        });
      });

      describe("and productPreference is Exchange", () => {
        beforeAll(() => {
          getProductPreferenceWithProductSwitcher.mockReturnValue(ProductsOption.exchange);
        });

        it("should return the expected config with EXC product, SBK title and a falsy isXSell", () => {
          expect(createGetProductSwitcherConfigSelector()(stateMock)).toEqual({
            ...productSwitcherConfig,
            title: "I18N.SPORTSBOOK",
            productPreference: ProductsOption.exchange,
            isXSell: false,
          });
        });
      });
    });

    describe("and user have both Exchange and Sportsbook product options", () => {
      beforeAll(() => {
        getUserPreferencesWithProductSwitcher.mockReturnValue({
          products: [ProductsOption.exchange, ProductsOption.sportsbook, ProductsOption.games],
        });
      });

      describe("and productPreference is Sportsbook", () => {
        beforeAll(() => {
          getProductPreferenceWithProductSwitcher.mockReturnValue(ProductsOption.sportsbook);
        });

        it("should return the expected config with SBK product, EXC title and a truthy isXSell", () => {
          expect(createGetProductSwitcherConfigSelector()(stateMock)).toEqual({
            ...productSwitcherConfig,
            title: "I18N.EXCHANGE",
            productPreference: ProductsOption.sportsbook,
            isXSell: true,
          });
        });
      });

      describe("and productPreference is Exchange", () => {
        beforeAll(() => {
          getProductPreferenceWithProductSwitcher.mockReturnValue(ProductsOption.exchange);
        });

        it("should return the expected config with EXC product, SBK title and a truthy isXSell", () => {
          expect(createGetProductSwitcherConfigSelector()(stateMock)).toEqual({
            ...productSwitcherConfig,
            title: "I18N.SPORTSBOOK",
            productPreference: ProductsOption.exchange,
            isXSell: true,
          });
        });
      });
    });
  });

  describe("when hasProductSwitcherNative is true", () => {
    beforeAll(() => {
      getIsProductSwitcherNativeActive.mockReturnValue(true);

      getIsProductSwitcherActive.mockReturnValue(false);
      productSwitcherConfig = {
        ...BASE_PRODUCT_SWITCHER_CONFIG,
        isProductSwitcherAvailable: {
          default: false,
          native: true,
        },
      };
    });

    describe("and user doesn't have the Exchange product option", () => {
      beforeAll(() => {
        getUserPreferencesWithProductSwitcher.mockReturnValue({
          products: [ProductsOption.sportsbook, ProductsOption.games],
        });
      });

      describe("and productPreference is Sportsbook", () => {
        beforeAll(() => {
          getProductPreferenceWithProductSwitcher.mockReturnValue(ProductsOption.sportsbook);
        });

        it("should return the expected config with SBK product, EXC title and a truthy isXSell", () => {
          expect(createGetProductSwitcherConfigSelector()(stateMock)).toEqual({
            ...productSwitcherConfig,
            title: "I18N.EXCHANGE",
            productPreference: ProductsOption.sportsbook,
            isXSell: true,
          });
        });
      });
    });

    describe("and user doesn't have the Sportsbook product option", () => {
      beforeAll(() => {
        getUserPreferencesWithProductSwitcher.mockReturnValue({
          products: [ProductsOption.exchange, ProductsOption.games],
        });
      });

      describe("and productPreference is Exchange", () => {
        beforeAll(() => {
          getProductPreferenceWithProductSwitcher.mockReturnValue(ProductsOption.exchange);
        });

        it("should return the expected config with EXC product, SBK title and a falsy isXSell", () => {
          expect(createGetProductSwitcherConfigSelector()(stateMock)).toEqual({
            ...productSwitcherConfig,
            title: "I18N.SPORTSBOOK",
            productPreference: ProductsOption.exchange,
            isXSell: false,
          });
        });
      });
    });

    describe("and user have both Exchange and Sportsbook product options", () => {
      beforeAll(() => {
        getUserPreferencesWithProductSwitcher.mockReturnValue({
          products: [ProductsOption.exchange, ProductsOption.sportsbook, ProductsOption.games],
        });
      });

      describe("and productPreference is Sportsbook", () => {
        beforeAll(() => {
          getProductPreferenceWithProductSwitcher.mockReturnValue(ProductsOption.sportsbook);
        });

        it("should return the expected config with SBK product, EXC title and a truthy isXSell", () => {
          expect(createGetProductSwitcherConfigSelector()(stateMock)).toEqual({
            ...productSwitcherConfig,
            title: "I18N.EXCHANGE",
            productPreference: ProductsOption.sportsbook,
            isXSell: true,
          });
        });
      });

      describe("and productPreference is Exchange", () => {
        beforeAll(() => {
          getProductPreferenceWithProductSwitcher.mockReturnValue(ProductsOption.exchange);
        });

        it("should return the expected config with EXC product, SBK title and a truthy isXSell", () => {
          expect(createGetProductSwitcherConfigSelector()(stateMock)).toEqual({
            ...productSwitcherConfig,
            title: "I18N.SPORTSBOOK",
            productPreference: ProductsOption.exchange,
            isXSell: true,
          });
        });
      });
    });
  });

  describe("when EXC_ALLOWED_JURISDICTION is active ", () => {
    beforeEach(() => {
      getIsProductSwitcherNativeActive.mockReturnValue(true);
      getIsProductSwitcherActive.mockReturnValue(true);
      getProductPreferenceWithProductSwitcher.mockReturnValue(ProductsOption.sportsbook);
      getThrottle.mockImplementation((_, name) => {
        if (name === "EXC_ALLOWED_JURISDICTION") return { isActive: true };
        return { isActive: false };
      });
    });

    describe("and user is logged in", () => {
      beforeEach(() => {
        getUserDetails.mockReturnValue({ loggedIn: true });
      });

      describe("and canUsePhoenixExchange on boot is false", () => {
        beforeEach(() => {
          getCanUsePhoenixExchange.mockReturnValue(false);
        });

        it("should return isXSell as true", () => {
          const result = createGetProductSwitcherConfigSelector()(stateMock);
          expect(result).toEqual(
            expect.objectContaining({
              isXSell: true,
              showOnboardingNewLabel: false,
              isLoggedIn: true,
            }),
          );
        });
      });

      describe("and canUsePhoenixExchange on boot is true", () => {
        beforeEach(() => {
          getCanUsePhoenixExchange.mockReturnValue(true);
        });

        describe("and exchangeDefaultProduct is EMS", () => {
          beforeEach(() => {
            getUserPreferencesWithProductSwitcher.mockReturnValue({
              products: [ProductsOption.sportsbook, ProductsOption.games],
              exchangeDefaultProduct: ExchangeDefaultProductOption.ems,
            });
          });

          it("should return isXSell as true", () => {
            const result = createGetProductSwitcherConfigSelector()(stateMock);
            expect(result).toEqual(
              expect.objectContaining({
                isXSell: true,
                showOnboardingNewLabel: false,
                isLoggedIn: true,
              }),
            );
          });
        });

        describe("and exchangeDefaultProduct is NEME (Phoenix)", () => {
          beforeEach(() => {
            getUserPreferencesWithProductSwitcher.mockReturnValue({
              products: [ProductsOption.sportsbook, ProductsOption.games],
              exchangeDefaultProduct: ExchangeDefaultProductOption.neme,
            });
          });

          it("should return isXSell as false and showOnboardingNewLabel as true", () => {
            const result = createGetProductSwitcherConfigSelector()(stateMock);
            expect(result).toEqual(
              expect.objectContaining({
                isXSell: false,
                showOnboardingNewLabel: true,
                isLoggedIn: true,
              }),
            );
          });
        });

        describe("and exchangeDefaultProduct is unassigned/default", () => {
          beforeEach(() => {
            getUserPreferencesWithProductSwitcher.mockReturnValue({
              products: [ProductsOption.sportsbook, ProductsOption.games],
              exchangeDefaultProduct: ExchangeDefaultProductOption.default,
            });
          });

          it("should return isXSell as true", () => {
            const result = createGetProductSwitcherConfigSelector()(stateMock);
            expect(result).toEqual(
              expect.objectContaining({
                isXSell: true,
                showOnboardingNewLabel: false,
                isLoggedIn: true,
              }),
            );
          });
        });
      });
    });

    describe("and user is logged out", () => {
      beforeEach(() => {
        getUserDetails.mockReturnValue({ loggedIn: false });
        getUserPreferencesWithProductSwitcher.mockReturnValue({
          products: [ProductsOption.sportsbook, ProductsOption.games],
          exchangeDefaultProduct: undefined,
        });
      });
      describe("and isExchangeEnabled is true", () => {
        beforeEach(() => {
          getIsExchangeEnabled.mockReturnValue(true);
        });

        it("should fallback to legacy logic (isExchangeEnabled) and return isXSell as true", () => {
          const result = createGetProductSwitcherConfigSelector()(stateMock);
          expect(result).toEqual(
            expect.objectContaining({
              isLoggedIn: false,
              isXSell: false,
              showOnboardingNewLabel: false,
            }),
          );
        });
      });

      describe("and isExchangeEnabled is false", () => {
        beforeEach(() => {
          getIsExchangeEnabled.mockReturnValue(false);
        });

        it("should return isXSell as true", () => {
          const result = createGetProductSwitcherConfigSelector()(stateMock);
          expect(result).toEqual(
            expect.objectContaining({
              isLoggedIn: false,
              isXSell: true,
              showOnboardingNewLabel: false,
            }),
          );
        });
      });
    });
  });

  describe("when ENABLE_PREDICTS throttle is active and exchangeDefaultMode is predicts", () => {
    beforeEach(() => {
      getIsProductSwitcherActive.mockReturnValue(true);
      getIsProductSwitcherNativeActive.mockReturnValue(false);
      getProductPreferenceWithProductSwitcher.mockReturnValue(ProductsOption.sportsbook);
      getUserPreferencesWithProductSwitcher.mockReturnValue({
        products: [ProductsOption.sportsbook, ProductsOption.games],
        exchangeDefaultProduct: ExchangeDefaultProductOption.default,
      });
      getThrottle.mockImplementation((_, name) => {
        if (name === "ENABLE_PREDICTS") return { isActive: true };
        return { isActive: false };
      });
      getExchangeDefaultMode.mockReturnValue(ExchangeDefaultModeOption.predicts);
    });

    describe("and exchange is not available (logged out / no Phoenix)", () => {
      beforeEach(() => {
        getUserDetails.mockReturnValue({ loggedIn: false });
        getCanUsePhoenixExchange.mockReturnValue(false);
      });

      it("should return the Predicts config with shouldShowXSellToPredicts true", () => {
        const result = createGetProductSwitcherConfigSelector()(stateMock);
        expect(result).toEqual(
          expect.objectContaining({
            title: "I18N.PREDICTS",
            shouldShowXSellToPredicts: true,
            isXSell: true,
            showOnboardingNewLabel: false,
          }),
        );
      });
    });

    describe("and exchange is available (logged in + Phoenix)", () => {
      beforeEach(() => {
        getUserDetails.mockReturnValue({ loggedIn: true });
        getCanUsePhoenixExchange.mockReturnValue(true);
      });

      it("should fall through to the standard config with shouldShowXSellToPredicts false", () => {
        const result = createGetProductSwitcherConfigSelector()(stateMock);
        expect(result).toEqual(
          expect.objectContaining({
            shouldShowXSellToPredicts: false,
          }),
        );
        expect(result.title).not.toBe("Predicts");
      });
    });

    describe("and user is logged out with Phoenix access", () => {
      beforeEach(() => {
        getUserDetails.mockReturnValue({ loggedIn: false });
        getCanUsePhoenixExchange.mockReturnValue(true);
      });

      it("should still return the Predicts config (Exchange is gated by login)", () => {
        const result = createGetProductSwitcherConfigSelector()(stateMock);
        expect(result).toEqual(
          expect.objectContaining({
            title: "I18N.PREDICTS",
            shouldShowXSellToPredicts: true,
          }),
        );
      });
    });

    describe("and user is logged in without Phoenix access", () => {
      beforeEach(() => {
        getUserDetails.mockReturnValue({ loggedIn: true });
        getCanUsePhoenixExchange.mockReturnValue(false);
      });

      it("should still return the Predicts config (Phoenix gating not met)", () => {
        const result = createGetProductSwitcherConfigSelector()(stateMock);
        expect(result).toEqual(
          expect.objectContaining({
            title: "I18N.PREDICTS",
            shouldShowXSellToPredicts: true,
          }),
        );
      });
    });

    describe("and productPreference is exchange (not sportsbook)", () => {
      beforeEach(() => {
        getProductPreferenceWithProductSwitcher.mockReturnValue(ProductsOption.exchange);
        getUserDetails.mockReturnValue({ loggedIn: false });
        getCanUsePhoenixExchange.mockReturnValue(false);
      });

      it("should not enter the Predicts branch", () => {
        const result = createGetProductSwitcherConfigSelector()(stateMock);
        expect(result.shouldShowXSellToPredicts).toBe(false);
      });
    });
  });

  describe("when ENABLE_PREDICTS throttle is inactive", () => {
    beforeEach(() => {
      getIsProductSwitcherActive.mockReturnValue(true);
      getProductPreferenceWithProductSwitcher.mockReturnValue(ProductsOption.sportsbook);
      getUserPreferencesWithProductSwitcher.mockReturnValue({
        products: [ProductsOption.sportsbook],
        exchangeDefaultProduct: ExchangeDefaultProductOption.default,
      });
      getExchangeDefaultMode.mockReturnValue(ExchangeDefaultModeOption.predicts);
      getThrottle.mockReturnValue({ isActive: false });
      getUserDetails.mockReturnValue({ loggedIn: false });
      getCanUsePhoenixExchange.mockReturnValue(false);
    });

    it("should not enter the Predicts branch even if exchangeDefaultMode is predicts", () => {
      const result = createGetProductSwitcherConfigSelector()(stateMock);
      expect(result.shouldShowXSellToPredicts).toBe(false);
    });
  });
});
