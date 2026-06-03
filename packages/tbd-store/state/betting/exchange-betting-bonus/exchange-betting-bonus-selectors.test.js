import { calc } from "@ppb/bet-engine";
import {
  getExchangeBettingBonusByMarketId,
  getExchangeEligibleBonusByMarketId,
  getRunnerPotentialBetWithBonus,
} from "./exchange-betting-bonus-selectors";
import {
  getExchangeRunnerTree,
  createExcRunnerPotentialBetsByRunnerURNSelector,
} from "../../entities/entities-selectors";
import { calculateEligibleBonus } from "../../../helpers/free-bets";

const LIABILITY = 2;
const PRICE = 2;
const SIDE = "BACK";
const SIZE = 2;
const BET_ENGINE_LIABILITY = 77;
const POTENTIAL_BET_MOCK = {
  side: SIDE,
  size: SIZE,
  price: PRICE,
  liability: LIABILITY,
};

jest.mock("../../entities/entities-selectors", () => ({
  getExchangeRunnerTree: jest.fn(),
  createExcRunnerPotentialBetsByRunnerURNSelector: jest.fn(() => [{}]),
}));

jest.mock("@ppb/bet-engine", () => ({
  __esModule: true,
  calc: {
    liability: jest.fn(() => BET_ENGINE_LIABILITY),
  },
}));

jest.mock("../../../helpers/free-bets", () => ({
  calculateEligibleBonus: jest.fn(),
}));

const BETTING_TYPE = "ODDS";
const BONUS_DISCOUNT = {
  bonus: 12,
};

const MARKET_ID = "1.171412190";
const MARKET_TYPE = "MATCH_ODDS";
const MARKET_URN = "ppb:excMarket:1.171412190";

const SELECTION_ID = 12345;
const WALLET_WITH_CONDITIONS = { amount: 42, conditions: [{ value: "12345", type: "SELECTION_ID" }] };
const WALLET_WITHOUT_CONDITIONS = { amount: 12 };

const RUNNER = {
  runner: {
    urn: `ppb:excRunner:${MARKET_ID}/48351/0`,
  },
  market: {
    bettingType: BETTING_TYPE,
    marketId: MARKET_ID,
    marketType: MARKET_TYPE,
    urn: MARKET_URN,
  },
};

const MARKET_BONUS_NO_WALLETS = {
  marketId: MARKET_ID,
  hasBonusMoney: "some boolean",
  wallets: [],
};

const MARKET_BONUS = {
  ...MARKET_BONUS_NO_WALLETS,
  wallets: [WALLET_WITH_CONDITIONS, WALLET_WITHOUT_CONDITIONS],
};

const MARKET_BONUS_NO_CONDITIONS = {
  ...MARKET_BONUS_NO_WALLETS,
  wallets: [WALLET_WITHOUT_CONDITIONS],
};

const NO_BONUS_STATE_MOCK = {
  betting: {
    exchangeBettingBonus: {},
  },
};

const BONUS_STATE_MOCK = {
  betting: {
    exchangeBettingBonus: MARKET_BONUS,
  },
};

const BONUS_STATE_MOCK_NO_WALLETS = {
  betting: {
    exchangeBettingBonus: MARKET_BONUS_NO_WALLETS,
  },
};

const BONUS_STATE_MOCK_NO_CONDITIONS = {
  betting: {
    exchangeBettingBonus: MARKET_BONUS_NO_CONDITIONS,
  },
};

describe("exchange betting bonus selectors", () => {
  describe("getExchangeBettingBonusByMarketId", () => {
    describe("when there is no market bonus", () => {
      it("should return null", () => {
        expect(getExchangeBettingBonusByMarketId(NO_BONUS_STATE_MOCK, MARKET_ID)).toBeNull();
      });
    });

    describe("when there is market bonus", () => {
      it("should return the market bonus", () => {
        expect(getExchangeBettingBonusByMarketId(BONUS_STATE_MOCK, MARKET_ID)).toEqual(MARKET_BONUS);
      });
    });

    describe("when the provided market id doesn't match the one of the bonus", () => {
      it("should return null", () => {
        expect(getExchangeBettingBonusByMarketId(BONUS_STATE_MOCK, "invalid market id")).toBeNull();
      });
    });
  });

  describe("getExchangeEligibleBonusByMarketId", () => {
    describe("when there is no market bonus", () => {
      beforeEach(() => {
        calculateEligibleBonus.mockReturnValue(0);
      });

      it("should return 0", () => {
        expect(
          getExchangeEligibleBonusByMarketId(NO_BONUS_STATE_MOCK, MARKET_ID, SELECTION_ID, MARKET_TYPE, BETTING_TYPE),
        ).toBe(0);
        expect(calculateEligibleBonus).toHaveBeenCalledTimes(0);
      });
    });

    describe("when there is market bonus and the market bonus has no wallets", () => {
      beforeEach(() => {
        calculateEligibleBonus.mockReturnValue(0);
      });

      it("should return 0", () => {
        expect(
          getExchangeEligibleBonusByMarketId(
            BONUS_STATE_MOCK_NO_WALLETS,
            MARKET_ID,
            SELECTION_ID,
            MARKET_TYPE,
            BETTING_TYPE,
          ),
        ).toBe(0);
      });
    });

    describe("when there is all data available", () => {
      beforeEach(() => {
        calculateEligibleBonus.mockReturnValue(12);
      });

      it("should return the cumulative market bonus for the selection", () => {
        expect(
          getExchangeEligibleBonusByMarketId(
            BONUS_STATE_MOCK_NO_CONDITIONS,
            MARKET_ID,
            SELECTION_ID,
            MARKET_TYPE,
            BETTING_TYPE,
          ),
        ).toEqual(WALLET_WITHOUT_CONDITIONS.amount);
      });
    });
  });

  describe("getRunnerPotentialBetWithBonus", () => {
    describe("when exchangeRunnerTree is not defined", () => {
      beforeEach(() => {
        getExchangeRunnerTree.mockReturnValueOnce(undefined);
        createExcRunnerPotentialBetsByRunnerURNSelector.mockReturnValue(() => [POTENTIAL_BET_MOCK]);
      });

      it("should return potential bet with liability undefined", () => {
        expect(getRunnerPotentialBetWithBonus(BONUS_STATE_MOCK, RUNNER, MARKET_ID)).toEqual({
          liability: undefined,
          price: PRICE,
          side: SIDE,
          size: SIZE,
        });
      });
    });

    describe("when exchangeRunnerTree is defined", () => {
      beforeEach(() => {
        getExchangeRunnerTree.mockReturnValue(RUNNER);
      });

      describe("and size is undefined", () => {
        beforeEach(() => {
          createExcRunnerPotentialBetsByRunnerURNSelector.mockReturnValue(() => [
            { ...POTENTIAL_BET_MOCK, size: undefined },
          ]);
        });

        it("should return potential bet with liability and size as undefined", () => {
          expect(
            getRunnerPotentialBetWithBonus(BONUS_STATE_MOCK, RUNNER, MARKET_ID, MARKET_TYPE, BETTING_TYPE),
          ).toEqual({
            liability: undefined,
            price: PRICE,
            side: SIDE,
            size: undefined,
          });
        });
      });

      describe("and potential bet has no price", () => {
        beforeEach(() => {
          createExcRunnerPotentialBetsByRunnerURNSelector.mockReturnValue(() => [
            { ...POTENTIAL_BET_MOCK, price: undefined },
          ]);
        });

        it("should return potential bet with liability and price undefined", () => {
          expect(
            getRunnerPotentialBetWithBonus(BONUS_STATE_MOCK, RUNNER, MARKET_ID, MARKET_TYPE, BETTING_TYPE),
          ).toEqual({
            liability: undefined,
            price: undefined,
            side: SIDE,
            size: SIZE,
          });
        });
      });

      describe("and potential bet has price and size", () => {
        beforeEach(() => {
          createExcRunnerPotentialBetsByRunnerURNSelector.mockReturnValue(() => [POTENTIAL_BET_MOCK]);
        });

        it("should call bet-engine calc.liability with expected parameters", () => {
          getRunnerPotentialBetWithBonus(BONUS_STATE_MOCK, RUNNER, MARKET_ID, MARKET_TYPE, BETTING_TYPE);
          expect(calc.liability).toHaveBeenCalledWith(SIDE, SIZE, PRICE, BETTING_TYPE, MARKET_TYPE, BONUS_DISCOUNT);
        });

        it("should return correct potential bet", () => {
          expect(
            getRunnerPotentialBetWithBonus(BONUS_STATE_MOCK, RUNNER, MARKET_ID, MARKET_TYPE, BETTING_TYPE),
          ).toEqual({
            liability: BET_ENGINE_LIABILITY,
            price: PRICE,
            side: SIDE,
            size: SIZE,
          });
        });
      });
    });
  });
});
