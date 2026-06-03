import { getAllowLoadFromStorage, getIsExchangeEnabled, getCanUsePhoenixExchange } from "./boot-selectors";

describe("getAllowLoadFromStorage", () => {
  it("should return betslip card allowLoadFromStorage", () => {
    const state = {
      boot: { allowLoadFromStorage: true },
    };
    expect(getAllowLoadFromStorage(state)).toBe(true);
  });
});

describe("getIsExchangeEnabled", () => {
  it("should return exchangeEnabled", () => {
    const state = {
      boot: { exchangeEnabled: true },
    };
    expect(getIsExchangeEnabled(state)).toBe(true);
  });
});

describe("getCanUsePhoenixExchange", () => {
  it("should return canUsePhoenixExchange", () => {
    const state = {
      boot: { canUsePhoenixExchange: true },
    };
    expect(getCanUsePhoenixExchange(state)).toBe(true);
  });
});
