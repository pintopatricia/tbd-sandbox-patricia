import { formatOdds } from "@ppb/tbd-store/helpers/formatters";
import { isLegInState } from "@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors";
import { isRaceHierarchy } from "@ppb/tbd-store/helpers/markets";
import { BetButtonStatus } from "../components/ExchangeBetButtons/snowflakes/BetButton/BetButton.types";
import { buildBetButtonLabel, buildBetButtonSecondaryLabel, buildBetButtonStatus } from "./bet-button-helper";

jest.mock("@ppb/tbd-store/helpers/formatters", () => ({
  formatOdds: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors", () => ({
  isLegInState: jest.fn(),
}));

jest.mock("@ppb/tbd-store/helpers/markets", () => ({
  isRaceHierarchy: jest.fn(),
}));

jest.mock("./i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

describe("buildBetButtonLabel", () => {
  describe("when runnerOdds or user preferences are undefined and market has no 'SP' (starting price)", () => {
    it("should return an empty string", () => {
      const sportsbookrunner = {
        odds: undefined,
        status: "ACTIVE",
      };
      const sportsbookmarket = {
        bspMarket: false,
        hierarchy: {
          race: "",
        },
      };
      const betButtonLabel = buildBetButtonLabel(sportsbookrunner, sportsbookmarket, undefined);
      expect(betButtonLabel).toEqual("");
    });
  });

  describe("when runnerOdds or user preferences are undefined but the market has 'SP' (starting price)", () => {
    it("should return the 'SP' string", () => {
      isRaceHierarchy.mockReturnValueOnce(true);
      const sportsbookrunner = {
        odds: undefined,
        status: "ACTIVE",
      };
      const sportsbookmarket = {
        bspMarket: true,
        hierarchy: {
          race: "",
        },
      };
      const betButtonLabel = buildBetButtonLabel(sportsbookrunner, sportsbookmarket, undefined);
      expect(betButtonLabel).toEqual("I18N.HORSE_RACING.SP");
    });
  });

  describe("when there are odds to display", () => {
    it("should return formated odds", () => {
      formatOdds.mockReturnValueOnce("2.1");

      const odds = {
        decimal: "2.1",
        fractional: {
          numerator: 2,
          denominator: 5,
        },
      };
      const sportsbookrunner = {
        odds,
        status: "ACTIVE",
      };
      const sportsbookmarket = {
        bspMarket: false,
        hierarchy: {
          race: "",
        },
      };
      const betButtonLabel = buildBetButtonLabel(sportsbookrunner, sportsbookmarket, "DECIMAL");
      expect(formatOdds).toHaveBeenCalledWith(odds, "DECIMAL");
      expect(betButtonLabel).toEqual("2.1");
    });
  });
});

describe("buildBetButtonSecondaryLabel", () => {
  describe("when displayPreviousOdd is undefined", () => {
    it("should return undefined", () => {
      const betButtonSecondaryLabel = buildBetButtonSecondaryLabel(undefined, [{ decimal: 10 }], "DECIMAL");
      expect(betButtonSecondaryLabel).toEqual(undefined);
    });
  });

  describe("when runnerPreviousOdds is undefined", () => {
    it("should return undefined", () => {
      const betButtonSecondaryLabel = buildBetButtonSecondaryLabel(true, undefined, "DECIMAL");
      expect(betButtonSecondaryLabel).toEqual(undefined);
    });
  });

  describe("when runnerPreviousOdds is an empty array", () => {
    it("should return undefined", () => {
      const betButtonSecondaryLabel = buildBetButtonSecondaryLabel(true, [], "DECIMAL");
      expect(betButtonSecondaryLabel).toEqual(undefined);
    });
  });

  describe("when sportsbookDisplayOddsPreferences is undefined", () => {
    it("should return undefined", () => {
      const betButtonSecondaryLabel = buildBetButtonSecondaryLabel(true, [{ decimal: 10 }], undefined);
      expect(betButtonSecondaryLabel).toEqual(undefined);
    });
  });

  describe("when all the values are correct", () => {
    it("should return formatted odds", () => {
      formatOdds.mockReturnValueOnce("10");
      const betButtonSecondaryLabel = buildBetButtonSecondaryLabel(true, [{ decimal: 10 }], "DECIMAL");

      expect(formatOdds).toHaveBeenCalledWith({ decimal: 10 }, "DECIMAL");
      expect(betButtonSecondaryLabel).toEqual("10");
    });
  });
});

describe("buildBetButtonStatus", () => {
  describe("when runner is undefined", () => {
    it("should return Normal", () => {
      const betButtonStatus = buildBetButtonStatus("marketUrn", undefined, {});
      expect(betButtonStatus).toEqual(BetButtonStatus.Normal);
    });
  });

  describe("when sportsbookBetting is undefined", () => {
    it("should return Normal", () => {
      const betButtonStatus = buildBetButtonStatus("marketUrn", {}, undefined);
      expect(betButtonStatus).toEqual(BetButtonStatus.Normal);
    });
  });

  describe("when isLegInState returns false", () => {
    it("should return Normal", () => {
      isLegInState.mockReturnValueOnce(false);
      const betButtonStatus = buildBetButtonStatus("marketUrn", 1234, {});

      expect(isLegInState.mock.calls[0]).toEqual(["marketUrn", 1234, {}]);
      expect(betButtonStatus).toEqual(BetButtonStatus.Normal);
    });
  });

  describe("when isLegInState returns true", () => {
    it("should return Selected", () => {
      isLegInState.mockReturnValueOnce(true);
      const betButtonStatus = buildBetButtonStatus("marketUrn", 1234, {});

      expect(isLegInState.mock.calls[1]).toEqual(["marketUrn", 1234, {}]);
      expect(betButtonStatus).toEqual(BetButtonStatus.Selected);
    });
  });
});
