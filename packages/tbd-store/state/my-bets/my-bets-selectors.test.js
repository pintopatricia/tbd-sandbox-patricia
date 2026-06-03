import { getMyBetsExchangeBottomSheet } from "./my-bets-selectors";

const EXCHANGE_BOTTOM_SHEET_STATE = {
  exchangeBottomSheet: {
    isOpen: false,
  },
};

describe("my bets selectors", () => {
  describe("getMyBetsMarketExcBottomSheet", () => {
    it("returns exchangeBottomSheet", () => {
      const MODULES_MOCK = {
        isOpen: false,
      };

      expect(
        getMyBetsExchangeBottomSheet({
          myBets: EXCHANGE_BOTTOM_SHEET_STATE,
        }),
      ).toStrictEqual(MODULES_MOCK);
    });
  });
});
