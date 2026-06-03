import { formatOdds } from "@ppb/tbd-store/helpers/formatters";
import { getBetslipCard } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { getSportsbookBettingReviewLines } from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { currencyFormatWithDecimalPlaces } from "../../../formatters/currency-formatters";
import { makeMapStateToProps } from "./map-to-props-factory";
import { createPreviewSelectionsSelector } from "./preview-line-mapper";

jest.mock("@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors", () => ({
  getSportsbookBettingReviewLines: jest.fn(() => ({})),
}));
jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(() => () => ({ details: "details" })),
}));
jest.mock("@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors", () => ({
  createUserPreferencesWithProductSwitcherSelector: jest.fn(() => () => ({ sportsbookOddsDisplay: "decimal" })),
}));
jest.mock("@ppb/tbd-store/state/betslip/betslip-card-selectors", () => ({
  getBetslipCard: jest.fn(() => ({})),
}));
jest.mock("@ppb/tbd-store/helpers/formatters", () => ({
  formatOdds: jest.fn((odds) => `formatted odds ${odds}`),
}));
jest.mock("./preview-line-mapper", () => ({
  createPreviewSelectionsSelector: jest.fn(() => () => []),
}));
jest.mock("../../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));
jest.mock("../../../formatters/currency-formatters", () => ({
  currencyFormatWithDecimalPlaces: jest.fn(({ value }) => `formatted currency ${value}`),
}));

jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());

const setupMapStateToProps = ({
  appState = { betting: { sportsbookBetting: { runners: {} } }, betslip: { sportsbookOddsMovement: {} }, entities: {} },
  lines = { "LINE:1": { odds: 3.1, potentialReturns: 22.3 } },
  runners = [{ name: "Runner 1" }],
  betslipCard = {},
  ownProps = { id: "LINE:1", order: 0 },
} = {}) => {
  createPreviewSelectionsSelector.mockReturnValue(jest.fn(() => runners));
  getSportsbookBettingReviewLines.mockReturnValue(lines);
  getBetslipCard.mockReturnValue(betslipCard);

  return makeMapStateToProps()(appState, ownProps);
};

describe("makeMapStateToProps", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("when there is all data", () => {
    it("should return order index incremented", () => {
      const props = setupMapStateToProps();

      expect(props.order).toEqual(1);
    });

    it("should return mapped runners for the id", () => {
      const props = setupMapStateToProps();

      expect(createPreviewSelectionsSelector()).toHaveBeenCalledWith(expect.any(Object), "LINE:1");
      expect(props.runners).toEqual([{ name: "Runner 1" }]);
    });

    it("should return mapped odd", () => {
      const props = setupMapStateToProps();

      expect(formatOdds).toHaveBeenCalledWith(3.1, "decimal");
      expect(props.odd).toEqual("formatted odds 3.1");
    });

    it("should return mapped payout", () => {
      const props = setupMapStateToProps();

      expect(currencyFormatWithDecimalPlaces).toHaveBeenCalledWith({
        details: "details",
        value: 22.3,
        decimalPlaces: 2,
      });
      expect(props.payout).toEqual("formatted currency 22.3");
    });
  });

  describe("when there is no betslip card", () => {
    it("should return empty state", () => {
      const props = setupMapStateToProps({ betslipCard: null });

      expect(props).toEqual({});
    });
  });

  describe("when user details throws", () => {
    it("should return an empty object", () => {
      createGetCountryLocalCurrencyCodeSelector.mockReturnValue(
        jest.fn(() => {
          throw new Error("GET_USER_DETAILS_ERROR");
        }),
      );

      expect(setupMapStateToProps({})).toEqual({});
    });
  });

  describe("when there are no odds", () => {
    it("should return odd as empty", () => {
      createGetCountryLocalCurrencyCodeSelector.mockReturnValue(jest.fn(() => ({ details: "details" })));

      const props = setupMapStateToProps({ lines: { "LINE:1": { odds: null, potentialReturns: 22.3 } } });

      expect(props.odd).toEqual("");
    });
  });
});
