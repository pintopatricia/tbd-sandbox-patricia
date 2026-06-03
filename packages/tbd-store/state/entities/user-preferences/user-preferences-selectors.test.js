import { ExchangeDefaultModeOption, LastViewedProductOption, ProductsOption } from "./UserPreferences.types";
import { isOnlineUserDetails } from "../index";

import {
  createTimeFormCollapsePreferenceSelector,
  createUserPreferencesQuickStakesSelector,
  createSportsbookDisplayOddsPreferencesSelector,
  createLastViewedProductPreferencesSelector,
  getProductExclusions,
  createUserPreferencesSelector,
  createUserPreferencesWithProductSwitcherSelector,
  createProductPreferenceWithProductSwitcherSelector,
  createMarketDepthSelector,
  createEmbeddedContentCollapsePreferenceSelector,
  createExchangeDefaultModeSelector,
} from "./user-preferences-selectors";

jest.mock("../index", () => ({
  isOnlineUserDetails: jest.fn(),
}));

describe("getProductExclusions", () => {
  const state = { entities: { userdetails: { productExclusions: ["GAMES"] } } };

  beforeAll(() => {
    isOnlineUserDetails.mockReturnValue(true);
  });

  it("should return the product exclusions", () => {
    expect(getProductExclusions(state.entities)).toBe(state.entities.userdetails.productExclusions);
  });

  describe("when no product exclusions are set in the state", () => {
    it("must throw", () => {
      expect(() => getProductExclusions({})).toThrow();
    });
  });

  describe("when user detail is offline", () => {
    beforeAll(() => {
      isOnlineUserDetails.mockReturnValue(false);
    });

    it("should return an empty array", () => {
      expect(getProductExclusions(state.entities)).toEqual([]);
    });
  });
});

describe("createTimeFormCollapsePreferenceSelector", () => {
  const stateMock = {
    isTimeFormCardCollapsed: true,
  };

  it("should return undefined when preferences don't have isTimeFormCardCollapsed", () => {
    const isTimeFormCardCollapsed = createTimeFormCollapsePreferenceSelector()({});
    expect(isTimeFormCardCollapsed).toBe(undefined);
  });

  it("should return isTimeFormCardCollapsed preference", () => {
    const isTimeFormCardCollapsed = createTimeFormCollapsePreferenceSelector()(stateMock);
    expect(isTimeFormCardCollapsed).toEqual(true);
  });
});

describe("createEmbeddedContentCollapsePreferenceSelector", () => {
  const stateMock = {
    isEmbeddedCardCollapsed: true,
  };

  it("should return undefined when preferences don't have isEmbeddedCardCollapsed", () => {
    const isEmbeddedCardCollapsed = createEmbeddedContentCollapsePreferenceSelector()({});
    expect(isEmbeddedCardCollapsed).toBe(undefined);
  });

  it("should return isTimeFormCardCollapsed preference", () => {
    const isEmbeddedCardCollapsed = createEmbeddedContentCollapsePreferenceSelector()(stateMock);
    expect(isEmbeddedCardCollapsed).toEqual(true);
  });
});

describe("createSportsbookDisplayOddsPreferencesSelector", () => {
  const stateMock = {
    sportsbookOddsDisplay: "DECIMAL",
  };

  it("should return undefined when preferences don't have sportsbookOddsDisplay", () => {
    const sportsbookOddsDisplay = createSportsbookDisplayOddsPreferencesSelector()({});
    expect(sportsbookOddsDisplay).toBe(undefined);
  });

  it("should return sportsbookOddsDisplay preference", () => {
    const sportsbookOddsDisplay = createSportsbookDisplayOddsPreferencesSelector()(stateMock);
    expect(sportsbookOddsDisplay).toEqual("DECIMAL");
  });
});

describe("createLastViewedProductPreferencesSelector", () => {
  const stateMock = {
    lastViewedProduct: LastViewedProductOption.sportsbook,
  };

  it("should return undefined when preferences don't have lastViewedProduct", () => {
    const lastViewedProduct = createLastViewedProductPreferencesSelector()({});

    expect(lastViewedProduct).toBeUndefined();
  });

  it("should return lastViewedProduct preference", () => {
    const lastViewedProduct = createLastViewedProductPreferencesSelector()(stateMock);

    expect(lastViewedProduct).toEqual(LastViewedProductOption.sportsbook);
  });
});

describe("createUserPreferencesQuickStakesSelector", () => {
  const stateMock = {
    quickStakes: [{ stake: 1 }, { stake: 2 }, { stake: 3 }],
  };

  const changedStateMock = {
    quickStakes: [{ stake: 4 }, { stake: 2 }, { stake: 3 }],
  };

  const changedLengthStateMock = {
    quickStakes: [{ stake: 1 }, { stake: 2 }, { stake: 3 }, { stake: 4 }],
  };

  it("should return undefined when preferences don't have quickStakes", () => {
    const quickStakes = createUserPreferencesQuickStakesSelector()({});
    expect(quickStakes).toBe(undefined);
  });

  it("should return quickStakes preference", () => {
    const quickStakes = createUserPreferencesQuickStakesSelector()(stateMock);
    expect(quickStakes).toEqual([{ stake: 1 }, { stake: 2 }, { stake: 3 }]);
  });

  it("should return the same quickStakes preference", () => {
    const getUserPreferencesQuickStakesSelector = createUserPreferencesQuickStakesSelector();

    const firstResponse = getUserPreferencesQuickStakesSelector(stateMock);
    const secondResponse = getUserPreferencesQuickStakesSelector(stateMock);

    expect(firstResponse === secondResponse).toBe(true);
  });

  it("should return the updated quickStakes preference", () => {
    const getUserPreferencesQuickStakesSelector = createUserPreferencesQuickStakesSelector();

    const firstResponse = getUserPreferencesQuickStakesSelector(stateMock);
    const secondResponse = getUserPreferencesQuickStakesSelector(changedStateMock);

    expect(firstResponse === secondResponse).toBe(false);
    expect(secondResponse).toEqual([{ stake: 4 }, { stake: 2 }, { stake: 3 }]);
  });

  it("should return the updated length quickStakes preference", () => {
    const getUserPreferencesQuickStakesSelector = createUserPreferencesQuickStakesSelector();

    const firstResponse = getUserPreferencesQuickStakesSelector(stateMock);
    const secondResponse = getUserPreferencesQuickStakesSelector(changedLengthStateMock);

    expect(firstResponse === secondResponse).toBe(false);
    expect(secondResponse).toEqual([{ stake: 1 }, { stake: 2 }, { stake: 3 }, { stake: 4 }]);
  });

  it("should return quickStakes preference as undefined", () => {
    const getUserPreferencesQuickStakesSelector = createUserPreferencesQuickStakesSelector();

    const userPreferencesQuickStakes = getUserPreferencesQuickStakesSelector({});

    expect(userPreferencesQuickStakes).toEqual(undefined);
  });
});

describe("createUserPreferencesSelector", () => {
  const stateMock = {
    quickStakes: [{ stake: 1 }, { stake: 2 }, { stake: 3 }],
    products: ["exchange", "sportsbook"],
    favoriteSports: [1, 2],
    rest: "REST",
  };

  const changedProductsStateMock = {
    ...stateMock,
    products: ["exchange"],
  };

  const changedFavoriteSportsStateMock = {
    ...stateMock,
    favoriteSports: [1],
  };

  it("should return undefined when there are no preferences", () => {
    const preferences = createUserPreferencesSelector()({});
    expect(preferences).toEqual({ favoriteSports: undefined, products: undefined, quickStakes: undefined });
  });

  it("should return preferences", () => {
    const preferences = createUserPreferencesSelector()(stateMock);
    expect(preferences).toEqual({
      quickStakes: [{ stake: 1 }, { stake: 2 }, { stake: 3 }],
      products: ["exchange", "sportsbook"],
      favoriteSports: [1, 2],
      rest: "REST",
    });
  });

  it("should return the same preferences", () => {
    const getUserPreferences = createUserPreferencesSelector();

    const firstResponse = getUserPreferences(stateMock);
    const secondResponse = getUserPreferences(stateMock);

    expect(firstResponse === secondResponse).toBe(true);
  });

  it("should return the updated preferences when products changes", () => {
    const getUserPreferences = createUserPreferencesSelector();

    const firstResponse = getUserPreferences(stateMock);
    const secondResponse = getUserPreferences(changedProductsStateMock);

    expect(firstResponse === secondResponse).toBe(false);
    expect(secondResponse).toEqual({
      quickStakes: [{ stake: 1 }, { stake: 2 }, { stake: 3 }],
      products: ["exchange"],
      favoriteSports: [1, 2],
      rest: "REST",
    });
  });

  it("should return the updated preferences when favoriteSports changes", () => {
    const getUserPreferences = createUserPreferencesSelector();

    const firstResponse = getUserPreferences(stateMock);
    const secondResponse = getUserPreferences(changedFavoriteSportsStateMock);

    expect(firstResponse === secondResponse).toBe(false);
  });
});

describe("createUserPreferencesWithProductSwitcherSelector", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("when productSwitcherPreference is not defined", () => {
    it("should return preferences' value", () => {
      const stateMock = {
        quickStakes: [{ stake: 1 }, { stake: 2 }, { stake: 3 }],
        products: ["exchange", "sportsbook"],
        favoriteSports: [1, 2],
        rest: "REST",
      };

      expect(createUserPreferencesWithProductSwitcherSelector()(stateMock)).toEqual({
        quickStakes: [{ stake: 1 }, { stake: 2 }, { stake: 3 }],
        products: ["exchange", "sportsbook"],
        favoriteSports: [1, 2],
        rest: "REST",
      });
    });
  });

  describe("when productSwitcherPreference is defined", () => {
    describe("when preferences products is not defined", () => {
      it("should return preferences' value", () => {
        const stateMock = {
          quickStakes: [{ stake: 1 }, { stake: 2 }, { stake: 3 }],
          products: undefined,
          favoriteSports: [1, 2],
          productSwitcherPreference: ProductsOption.exchange,
          rest: "REST",
        };

        expect(createUserPreferencesWithProductSwitcherSelector()(stateMock)).toEqual({
          quickStakes: [{ stake: 1 }, { stake: 2 }, { stake: 3 }],
          products: undefined,
          favoriteSports: [1, 2],
          productSwitcherPreference: ProductsOption.exchange,
          rest: "REST",
        });
      });
    });

    describe("when preferences products is sportsbook and games", () => {
      it("should return products preferences according to the productSwitcherPreference", () => {
        const stateMock = {
          quickStakes: [{ stake: 1 }, { stake: 2 }, { stake: 3 }],
          products: [ProductsOption.sportsbook, ProductsOption.games],
          favoriteSports: [1, 2],
          productSwitcherPreference: ProductsOption.exchange,
          rest: "REST",
        };

        expect(createUserPreferencesWithProductSwitcherSelector()(stateMock)).toEqual({
          quickStakes: [{ stake: 1 }, { stake: 2 }, { stake: 3 }],
          products: [ProductsOption.exchange, ProductsOption.games],
          favoriteSports: [1, 2],
          productSwitcherPreference: ProductsOption.exchange,
          rest: "REST",
        });
      });
    });

    describe("when preferences products is exchange and games", () => {
      it("should return products preferences according to the productSwitcherPreference", () => {
        const stateMock = {
          quickStakes: [{ stake: 1 }, { stake: 2 }, { stake: 3 }],
          products: [ProductsOption.exchange, ProductsOption.games],
          favoriteSports: [1, 2],
          productSwitcherPreference: ProductsOption.sportsbook,
          rest: "REST",
        };

        expect(createUserPreferencesWithProductSwitcherSelector()(stateMock)).toEqual({
          quickStakes: [{ stake: 1 }, { stake: 2 }, { stake: 3 }],
          products: [ProductsOption.sportsbook, ProductsOption.games],
          favoriteSports: [1, 2],
          productSwitcherPreference: ProductsOption.sportsbook,
          rest: "REST",
        });
      });
    });
  });
});

describe("createProductPreferenceWithProductSwitcherSelector", () => {
  afterEach(jest.clearAllMocks);

  describe("when productSwitcherPreference is not defined", () => {
    describe("when sportsbook is in the products array", () => {
      it("should return sportsbook", () => {
        const stateMock = {
          products: [ProductsOption.exchange, ProductsOption.sportsbook],
        };

        expect(createProductPreferenceWithProductSwitcherSelector()(stateMock)).toEqual(ProductsOption.sportsbook);
      });
    });

    describe("when sportsbook is not in the products array", () => {
      it("should return exchange", () => {
        const stateMock = {
          products: [ProductsOption.exchange, ProductsOption.games],
        };

        expect(createProductPreferenceWithProductSwitcherSelector()(stateMock)).toEqual(ProductsOption.exchange);
      });
    });
  });

  describe("when productSwitcherPreference is defined", () => {
    describe("when productSwitcherPreference is exchange", () => {
      it("should return exchange", () => {
        const stateMock = {
          productSwitcherPreference: ProductsOption.exchange,
        };

        expect(createProductPreferenceWithProductSwitcherSelector()(stateMock)).toEqual(ProductsOption.exchange);
      });
    });

    describe("when productSwitcherPreference is sportsbook", () => {
      it("should return sportsbook", () => {
        const stateMock = {
          productSwitcherPreference: ProductsOption.sportsbook,
        };

        expect(createProductPreferenceWithProductSwitcherSelector()(stateMock)).toEqual(ProductsOption.sportsbook);
      });
    });
  });
});

describe("createExchangeDefaultModeSelector", () => {
  it("should return undefined when preferences don't have exchangeDefaultMode", () => {
    const exchangeDefaultMode = createExchangeDefaultModeSelector()({});
    expect(exchangeDefaultMode).toBeUndefined();
  });

  it("should return exchangeDefaultMode preference when set to default", () => {
    const exchangeDefaultMode = createExchangeDefaultModeSelector()({
      exchangeDefaultMode: ExchangeDefaultModeOption.default,
    });
    expect(exchangeDefaultMode).toEqual(ExchangeDefaultModeOption.default);
  });

  it("should return exchangeDefaultMode preference when set to predicts", () => {
    const exchangeDefaultMode = createExchangeDefaultModeSelector()({
      exchangeDefaultMode: ExchangeDefaultModeOption.predicts,
    });
    expect(exchangeDefaultMode).toEqual(ExchangeDefaultModeOption.predicts);
  });
});

describe("createMarketDepthSelector", () => {
  const stateMock = {
    isMarketDepthActive: true,
  };

  it("should return false when preferences don't have isMarketDepthActive", () => {
    const isMarketDepthActive = createMarketDepthSelector()({});
    expect(isMarketDepthActive).toBe(false);
  });

  it("should return isMarketDepthActive preference", () => {
    const isMarketDepthActive = createMarketDepthSelector()(stateMock);
    expect(isMarketDepthActive).toEqual(true);
  });
});
