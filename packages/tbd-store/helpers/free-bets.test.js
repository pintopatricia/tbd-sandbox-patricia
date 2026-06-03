import { helpers, CONST } from "@ppb/bet-engine";
import { calculateUsedBonus, calculateEligibleBonus, calculateBonusLeft, isFreeBetsAvailable } from "./free-bets";

jest.mock("@ppb/bet-engine", () => ({
  helpers: {
    getBettingBehaviour: jest.fn().mockReturnValue("ODDS_GENERIC"),
  },
  CONST: {
    BETTING_BEHAVIOUR: {
      ODDS_EACH_WAY: "ODDS_EACH_WAY",
      ODDS_GENERIC: "ODDS_GENERIC",
    },
  },
}));

const BETTING_TYPE = "ODDS";

const MARKET_ID = "1.171412190";
const MARKET_TYPE = "MATCH_ODDS";
const SELECTION_ID = 12345;

const LIABILITY = 5;
const BONUS_USED = 2;

const WALLET_WITH_CONDITIONS = { amount: 42, conditions: [{ value: "12345", type: "SELECTION_ID" }] };
const WALLET_CONDITIONS_NO_VALUE = { amount: 42, conditions: [{ type: "SELECTION_ID" }] };
const WALLET_WITHOUT_CONDITIONS = { amount: 12 };
const WALLET_INVALID_CONDITIONS = { amount: 42, conditions: [{ value: "lay", type: "side" }] };

const MARKET_BONUS_NO_WALLETS = {
  marketId: MARKET_ID,
  hasBonusMoney: "some boolean",
  wallets: [],
};

const MARKET_BONUS = {
  ...MARKET_BONUS_NO_WALLETS,
  wallets: [WALLET_WITH_CONDITIONS, WALLET_WITHOUT_CONDITIONS],
};

const MARKET_BONUS_NO_CONDITIONS_VALUE = {
  ...MARKET_BONUS_NO_WALLETS,
  wallets: [WALLET_CONDITIONS_NO_VALUE],
};

const MARKET_BONUS_NO_CONDITIONS = {
  ...MARKET_BONUS_NO_WALLETS,
  wallets: [WALLET_WITHOUT_CONDITIONS],
};

const MARKET_BONUS_INVALID_CONDITIONS = {
  ...MARKET_BONUS_NO_WALLETS,
  wallets: [WALLET_INVALID_CONDITIONS],
};

describe("calculateUsedBonus", () => {
  describe("when the availableBonus is undefined", () => {
    it("should return 0", () => {
      expect(calculateUsedBonus(LIABILITY, undefined)).toBe(0);
    });
  });

  describe("when there is all data available", () => {
    describe("and the liability is greater than availableBonus", () => {
      it("should return availableBonus", () => {
        const AVAILABLE_BONUS = 1;
        expect(calculateUsedBonus(LIABILITY, AVAILABLE_BONUS)).toBe(AVAILABLE_BONUS);
      });
    });

    describe("and the liability is equal to availableBonus", () => {
      it("should return availableBonus", () => {
        const AVAILABLE_BONUS = 5;
        expect(calculateUsedBonus(LIABILITY, AVAILABLE_BONUS)).toBe(AVAILABLE_BONUS);
      });
    });

    describe("and the liability is less than availableBonus", () => {
      it("should return availableBonus", () => {
        const AVAILABLE_BONUS = 10;
        expect(calculateUsedBonus(LIABILITY, AVAILABLE_BONUS)).toBe(LIABILITY);
      });
    });
  });
});

describe("calculateEligibleBonus", () => {
  describe("when there is no exchange bonus response", () => {
    it("should return 0", () => {
      expect(calculateEligibleBonus({}, SELECTION_ID, MARKET_TYPE, BETTING_TYPE)).toBe(0);
    });
  });

  describe("when there is exchange bonus", () => {
    describe("and the exchange bonus has no wallets", () => {
      it("should return 0", () => {
        expect(calculateEligibleBonus(MARKET_BONUS_NO_WALLETS, SELECTION_ID, MARKET_TYPE, BETTING_TYPE)).toBe(0);
      });
    });

    describe("and the freeBets is not available for this market", () => {
      beforeAll(() => {
        helpers.getBettingBehaviour.mockReturnValue(CONST.BETTING_BEHAVIOUR.ODDS_EACH_WAY);
      });

      it("should return 0", () => {
        expect(calculateEligibleBonus(MARKET_BONUS_NO_WALLETS, SELECTION_ID)).toBe(0);
      });
    });

    describe("and there are no selection condition", () => {
      beforeAll(() => {
        helpers.getBettingBehaviour.mockReturnValue(CONST.BETTING_BEHAVIOUR.ODDS_GENERIC);
      });

      it("should return the cumulative exchange bonus for the selection", () => {
        expect(calculateEligibleBonus(MARKET_BONUS_NO_CONDITIONS, SELECTION_ID, MARKET_TYPE, BETTING_TYPE)).toEqual(
          WALLET_WITHOUT_CONDITIONS.amount,
        );
      });
    });

    describe("and the selection matches the selection condition", () => {
      it("should return the cumulative exchange bonus for the selection", () => {
        expect(calculateEligibleBonus(MARKET_BONUS, SELECTION_ID, MARKET_TYPE, BETTING_TYPE)).toEqual(
          WALLET_WITH_CONDITIONS.amount + WALLET_WITHOUT_CONDITIONS.amount,
        );
      });
    });

    describe("and the selection doesn't match any selection condition", () => {
      it("should return the eligible exchange bonus if any", () => {
        expect(calculateEligibleBonus(MARKET_BONUS, "54321", MARKET_TYPE, BETTING_TYPE)).toEqual(
          WALLET_WITHOUT_CONDITIONS.amount,
        );
      });
    });

    describe("and the selection condition has no value field", () => {
      it("should return the eligible exchange bonus of 0", () => {
        expect(
          calculateEligibleBonus(MARKET_BONUS_NO_CONDITIONS_VALUE, SELECTION_ID, MARKET_TYPE, BETTING_TYPE),
        ).toEqual(0);
      });
    });

    describe("and the condition is not valid", () => {
      it("should return the eligible exchange bonus of 0", () => {
        expect(
          calculateEligibleBonus(MARKET_BONUS_INVALID_CONDITIONS, SELECTION_ID, MARKET_TYPE, BETTING_TYPE),
        ).toEqual(0);
      });
    });
  });
});

describe("calculateBonusLeft", () => {
  const AVAILABLE_BONUS = 4;
  describe("when there are bonus available and total bonus used", () => {
    it("should return the difference between bonus available and bonus used", () => {
      expect(calculateBonusLeft(BONUS_USED, AVAILABLE_BONUS)).toEqual(2);
    });
  });

  describe("when there is no bonus used", () => {
    it("should return zero for bonus left", () => {
      expect(calculateBonusLeft(undefined, AVAILABLE_BONUS)).toEqual(0);
    });
  });

  describe("when there is no bonus available", () => {
    it("should return zero for bonus left", () => {
      expect(calculateBonusLeft(BONUS_USED, undefined)).toEqual(0);
    });
  });
});

describe("isFreeBetsAvailable", () => {
  describe("when bettingBehaviour is 'ODDS_GENERIC' and 'isBsp' is false", () => {
    it("should return true", () => {
      expect(isFreeBetsAvailable("marketType", "bettingType", false)).toBe(true);
    });
  });

  describe("when bettingBehaviour is not 'ODDS_GENERIC' and 'isBsp' is false", () => {
    beforeAll(() => {
      helpers.getBettingBehaviour.mockReturnValue(CONST.BETTING_BEHAVIOUR.ODDS_EACH_WAY);
    });

    it("should return false", () => {
      expect(isFreeBetsAvailable("marketType", "bettingType", false)).toBe(false);
    });
  });

  describe("when bettingBehaviour is 'ODDS_GENERIC' and 'isBsp' is true", () => {
    it("should return false", () => {
      expect(isFreeBetsAvailable("marketType", "bettingType", true)).toBe(false);
    });
  });
});
