import { createOddsMovementSelector } from "@ppb/tbd-store/state/betslip/betslip-odds-movement-selectors";
import {
  createGetObbPotentialBetsByIdSelector,
  getObbBettingState,
  createGetObbLegsUrnsByPotentialBetIdSelector,
} from "@ppb/tbd-store/state/betting/obb-betting/obb-betting-selectors";
import { createGetThrottleSelector } from "@ppb/tbd-store";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { KeyboardSeparator } from "@ppb/the-wall-common/types";
import {
  BETTING__OBB_CHANGE_STAKE_ACTION,
  BETTING__OBB_UPDATE_QUOTES,
  BETTING__OBB_VALIDATE_STAKE,
} from "@ppb/tbd-store/actions/betting";
import { getBetslipCard } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { isStakeValid } from "@ppb/tbd-store/helpers/obb-betting";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";
import { buildObbFailureDetails } from "./obb-bet-controls-mapper";
import { getSeparatorByLocale } from "../../../helpers/numeric-i18n";
import { getCurrencySymbol } from "../../../formatters/currency-formatters";

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn(() => ({
    localeCode: "en-GB",
    countryCode: "GB",
    jurisdiction: { jurisdiction: "INTERNATIONAL" },
  })),
}));

jest.mock("@ppb/tbd-store/helpers/obb-betting");

jest.mock("@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors", () => ({
  createUserPreferencesWithProductSwitcherSelector: jest.fn().mockReturnValue(jest.fn().mockReturnValue({})),
}));

jest.mock("./obb-bet-controls-mapper", () => ({
  buildObbFailureDetails: jest.fn().mockReturnValue({}),
}));

jest.mock("@ppb/tbd-store/state/betting/obb-betting/obb-betting-selectors", () => ({
  createGetObbPotentialBetsByIdSelector: jest.fn(),
  createGetObbLegsUrnsByPotentialBetIdSelector: jest.fn(),
  getObbBettingState: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/betslip/betslip-odds-movement-selectors", () => ({
  createOddsMovementSelector: jest.fn().mockReturnValue(jest.fn().mockReturnValue({})),
}));

jest.mock("@ppb/tbd-store/state/betslip/betslip-card-selectors", () => ({
  getBetslipCard: jest.fn().mockReturnValue(jest.fn().mockReturnValue({})),
  createGetObbPotentialBetsByIdSelector: jest.fn().mockReturnValue(jest.fn().mockReturnValue({})),
}));

jest.mock("../../../helpers/numeric-i18n", () => ({
  getSeparatorByLocale: jest.fn().mockReturnValue(KeyboardSeparator.Dot),
}));

jest.mock("../../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("../../../formatters/currency-formatters", () => ({
  getCurrencySymbol: jest.fn().mockReturnValue("€"),
  currencyFormatWithDecimalPlaces: jest.fn().mockImplementation(({ value }) => `${value}.00€`),
}));

jest.mock("../betslip-formatters", () => ({
  buildObbPotentialBetOdds: jest.fn().mockReturnValue("13.1"),
}));

jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());

jest.mock("@ppb/tbd-store", () => ({
  createGetThrottleSelector: jest.fn(),
}));

const obbBettingStateMock = {
  potentialBets: {
    "ppb:obb:potentialBet:00000000-0000-0000-0000-000000000000": {
      urn: "ppb:obb:potentialBet:00000000-0000-0000-0000-000000000000",
      betType: "SINGLE",
      legs: ["ppb:obb:leg:pvp:00000000|Player/00000;Player/00001|GOALS/MATCH/HALF1/PARTICIPANT_2_TO_WIN"],
      stake: 1,
      potentialReturns: 3,
      quote: {
        price: {
          fractional: {
            numerator: 3,
            denominator: 1,
          },
          decimal: 2,
        },
      },
    },
    "ppb:obb:potentialBet:11111111-1111-1111-1111-111111111111": {
      urn: "ppb:obb:potentialBet:11111111-1111-1111-1111-111111111111",
      betType: "SINGLE",
      legs: ["ppb:obb:leg:pvp:11111111|Player/11111;Player/11112|GOALS/MATCH/HALF1/PARTICIPANT_2_TO_WIN"],
      stake: 1,
      potentialReturns: 5,
      quote: {
        price: {
          fractional: {
            numerator: 5,
            denominator: 1,
          },
          decimal: 4,
        },
      },
    },
  },
  legs: {
    "ppb:obb:leg:pvp:00000000|Player/00000;Player/00001|GOALS/MATCH/HALF1/PARTICIPANT_2_TO_WIN": {
      urn: "ppb:obb:leg:pvp:00000000|Player/00000;Player/00001|GOALS/MATCH/HALF1/PARTICIPANT_2_TO_WIN",
      metadata: {
        eventName: "Team A v Team B",
        participantsDescription: "Player 12345",
        outcomeDescription: "GOALS AT_LEAST 2 HALF1",
        aggregatorDescription: "Player to achieve Outcome",
        legTypeDescription: "Basic",
      },
    },
    "ppb:obb:leg:pvp:11111111|Player/11111;Player/11112|GOALS/MATCH/HALF1/PARTICIPANT_2_TO_WIN": {
      urn: "ppb:obb:leg:pvp:11111111|Player/11111;Player/11112|GOALS/MATCH/HALF1/PARTICIPANT_2_TO_WIN",
      metadata: {
        eventName: "Team A v Team B",
        participantsDescription: "Player 54321",
        outcomeDescription: "GOALS AT_LEAST 2 HALF1",
        aggregatorDescription: "Player to achieve Outcome",
        legTypeDescription: "Basic",
      },
    },
  },
  totalStake: 2,
  totalPotentialReturns: 8,
  validations: {
    betslip: [],
    potentialBets: { "potentialBet:urn:1": [] },
  },
  failures: {
    betslip: null,
    potentialBets: {},
    legs: {
      "ppb:obb:leg:pvp:00000000|Player/00000;Player/00001|GOALS/MATCH/HALF1/PARTICIPANT_2_TO_WIN": "EVENT_NOT_FOUND",
    },
  },
};

describe("ObbBetControls mapToPropsFactory", () => {
  beforeEach(jest.clearAllMocks);

  describe("makeMapStateToProps", () => {
    function setup(inputProperties = {}) {
      const {
        appState = {},
        potentialBetId = "potentialBet:urn:1",
        getObbPotentialBet = jest.fn().mockReturnValue({}),
        getOddsMovement = jest.fn().mockReturnValue({}),
        obbLegsByPotentialBet = jest.fn().mockReturnValue([]),
        hasAvailabilityHints = true,
        hasReturnsLabel = true,
        throttles = { INPUT_MARKER: { isActive: false } },
      } = inputProperties;

      createGetObbPotentialBetsByIdSelector.mockReturnValue(getObbPotentialBet);
      createGetObbLegsUrnsByPotentialBetIdSelector.mockReturnValue(obbLegsByPotentialBet);

      createGetThrottleSelector.mockReturnValue((_, throttleName) => ({
        isActive: throttles[throttleName].isActive,
      }));

      createOddsMovementSelector.mockReturnValue(getOddsMovement);

      getObbBettingState.mockReturnValue(obbBettingStateMock);
      const defaultState = {
        entities: {
          preferences: {},
          throttles: { INPUT_MARKER: { isActive: false } },
        },
      };
      const state = {
        ...defaultState,
        ...appState,
      };

      return makeMapStateToProps()(state, { potentialBetId, hasAvailabilityHints, hasReturnsLabel });
    }

    describe("i18n", () => {
      it("should return translated labels", () => {
        const { i18n: i18nLabels } = setup();

        expect(i18nLabels).toEqual({
          odds: "I18N.BETSLIP.ODDS",
          returns: "I18N.BETSLIP.BET_RETURNS_TBD",
          stake: "I18N.BETSLIP.STAKE",
          oddsMovementDown: "I18N.BETSLIP.ODDS_MOVEMENT_DECREASE",
          oddsMovementUp: "I18N.BETSLIP.ODDS_MOVEMENT_INCREASE",
        });
      });
    });

    describe("when `getUserDetails` throws", () => {
      const GET_USER_DETAILS_ERROR = "GET_USER_DETAILS_ERROR";

      beforeEach(() => {
        getUserDetails.mockImplementationOnce(() => {
          throw new Error(GET_USER_DETAILS_ERROR);
        });
      });

      it("should call console.error with the error thrown from `getUserDetails`", () => {
        setup({ appState: null });

        expect(global.console.error).toHaveBeenCalledWith(new Error("GET_USER_DETAILS_ERROR"));
      });

      it("should return an empty object", () => {
        expect(setup({ appState: null })).toEqual({});
      });
    });
    describe("odds", () => {
      it("should return the current odds", () => {
        const mappedProps = setup();

        expect(mappedProps.odds).toEqual("13.1");
      });
    });

    describe("stake", () => {
      describe("when null", () => {
        it("should return undefined", () => {
          const mappedProps = setup({ getObbPotentialBet: jest.fn().mockReturnValue({ stake: null }) });

          expect(mappedProps.stake).toEqual(undefined);
        });
      });

      describe("when defined with a value", () => {
        it("should return the current stake", () => {
          const mappedProps = setup({ getObbPotentialBet: jest.fn().mockReturnValue({ stake: 10 }) });

          expect(mappedProps.stake).toEqual(10);
        });
      });
    });

    describe("separator", () => {
      it("should call getSeparatorByLocale with the user locale", () => {
        setup();

        expect(getSeparatorByLocale).toHaveBeenCalledTimes(1);
        expect(getSeparatorByLocale).toHaveBeenCalledWith("en-GB");
      });

      describe("when getSeparatorByLocale returns dot separator", () => {
        it("should return the separator as dot", () => {
          getSeparatorByLocale.mockReturnValueOnce(KeyboardSeparator.Dot);

          const mappedProps = setup();

          expect(mappedProps.separator).toEqual(KeyboardSeparator.Dot);
        });
      });

      describe("when getSeparatorByLocale returns comma separator", () => {
        it("should return the separator as comma", () => {
          getSeparatorByLocale.mockReturnValueOnce(KeyboardSeparator.Comma);

          const mappedProps = setup();

          expect(mappedProps.separator).toEqual(KeyboardSeparator.Comma);
        });
      });
    });

    describe("currencySymbol", () => {
      it("should return the getCurrencySymbol output", () => {
        getCurrencySymbol.mockReturnValue("symbol");
        const mappedProps = setup();

        expect(mappedProps.currencySymbol).toEqual("symbol");
      });
    });

    describe("formattedPotentialReturns", () => {
      describe("when hasReturnsLabel is true", () => {
        it("should return the formatted potential returns", () => {
          const mappedProps = setup({
            getObbPotentialBet: jest.fn().mockReturnValue({ potentialReturns: 10 }),
          });

          expect(mappedProps.formattedPotentialReturns).toEqual("10.00€");
        });
      });

      describe("when hasReturnsLabel is false", () => {
        it("should not return the formatted potential returns", () => {
          const mappedProps = setup({
            hasReturnsLabel: false,
            getObbPotentialBet: jest.fn().mockReturnValue({ potentialReturns: 10 }),
          });

          expect(mappedProps.formattedPotentialReturns).toBeUndefined();
        });
      });
    });

    describe("displayReturns", () => {
      describe("when hasReturnsLabel is true", () => {
        it("should return true", () => {
          const mappedProps = setup({
            getObbPotentialBet: jest.fn().mockReturnValue({ potentialReturns: 10 }),
          });

          expect(mappedProps.displayReturns).toBe(true);
        });
      });

      describe("when hasReturnsLabel is false", () => {
        it("should return false", () => {
          const mappedProps = setup({
            hasReturnsLabel: false,
            getObbPotentialBet: jest.fn().mockReturnValue({ potentialReturns: 10 }),
          });

          expect(mappedProps.displayReturns).toBe(false);
        });
      });
    });

    describe("isPanelDisabled", () => {
      describe("when there is a bet placement happening", () => {
        it("should return true", () => {
          getBetslipCard.mockReturnValue({ placeStatus: "INPROGRESS" });

          const mappedProps = setup();

          expect(mappedProps.isPanelDisabled).toEqual(true);
        });
      });

      describe("when there is no bet placement happening", () => {
        it("should return false", () => {
          buildObbFailureDetails.mockReturnValue({ hasFailure: false });
          getBetslipCard.mockReturnValue({ placeStatus: "NONE" });

          const mappedProps = setup();

          expect(mappedProps.isPanelDisabled).toEqual(false);
        });
      });
    });

    describe("showReturnsWithValue", () => {
      describe("when hasReturnsLabel is true", () => {
        it("should return the `returns` label with `I18N.BETSLIP.BET_RETURNS_TBD` when potential returns are null and are no quote", () => {
          const mappedProps = setup({
            getObbPotentialBet: jest.fn().mockReturnValue({ potentialReturns: null, quote: undefined }),
          });

          expect(mappedProps.i18n).toEqual(expect.objectContaining({ returns: "I18N.BETSLIP.BET_RETURNS_TBD" }));
        });

        it("should return the `returns` label with `I18N.BETSLIP.RETURNS` when potential returns are filled", () => {
          const mappedProps = setup({
            getObbPotentialBet: jest.fn().mockReturnValue({ potentialReturns: 10, quote: undefined }),
          });

          expect(mappedProps.i18n).toEqual(expect.objectContaining({ returns: "I18N.BETSLIP.RETURNS" }));
        });

        it("should return the `returns` label with `I18N.BETSLIP.RETURNS` when potential returns are filled with 0", () => {
          const mappedProps = setup({
            getObbPotentialBet: jest.fn().mockReturnValue({ potentialReturns: 0, quote: undefined }),
          });

          expect(mappedProps.i18n).toEqual(expect.objectContaining({ returns: "I18N.BETSLIP.RETURNS" }));
        });

        it("should return the `returns` label with `I18N.BETSLIP.RETURNS` when quote are filled", () => {
          const mappedProps = setup({
            getObbPotentialBet: jest.fn().mockReturnValue({ potentialReturns: undefined, quote: {} }),
          });

          expect(mappedProps.i18n).toEqual(expect.objectContaining({ returns: "I18N.BETSLIP.RETURNS" }));
          expect(mappedProps.formattedPotentialReturns).toEqual("0.00€");
        });
      });

      describe("when hasReturnsLabel is false", () => {
        it("should return a empty `returns` label", () => {
          const mappedProps = setup({
            hasReturnsLabel: false,
            getObbPotentialBet: jest.fn().mockReturnValue({ potentialReturns: 10, quote: {} }),
          });

          expect(mappedProps.i18n.returns).toEqual("");
        });
      });
    });

    describe("oddsMovement", () => {
      it("should return the potential bet odds movement", () => {
        const mappedProps = setup({
          getOddsMovement: jest
            .fn()
            .mockReturnValue({ "potentialBet:urn:1": { id: "potentialBet:urn:1", value: 1, movement: "UP" } }),
        });

        expect(mappedProps.oddsMovement).toEqual("UP");
      });
    });

    describe("isStakeValid", () => {
      it("should call isStakeValid with the userDetails and potentialBetValidations", () => {
        setup();

        expect(isStakeValid).toHaveBeenCalledTimes(1);
        expect(isStakeValid).toHaveBeenCalledWith(
          {
            countryCode: "GB",
            jurisdiction: {
              jurisdiction: "INTERNATIONAL",
            },
            localeCode: "en-GB",
          },
          [],
        );
      });

      describe("should return the stake validation result", () => {
        it("should return true when stake is valid", () => {
          isStakeValid.mockReturnValue(true);

          const mappedProps = setup();

          expect(mappedProps.isStakeValid).toEqual(true);
        });

        it("should return false when stake is invalid", () => {
          isStakeValid.mockReturnValue(false);

          const mappedProps = setup();

          expect(mappedProps.isStakeValid).toEqual(false);
        });
      });
    });

    describe("when legs have failures", () => {
      it("should show the hint message and disable panel", () => {
        buildObbFailureDetails.mockReturnValue({
          hasFailure: true,
          hint: { hintMessage: "SUSPENDED", hintType: "WARNING" },
        });

        const mappedProps = setup({
          obbLegsByPotentialBet: jest
            .fn()
            .mockReturnValue([
              "ppb:obb:leg:pvp:00000000|Player/00000;Player/00001|GOALS/MATCH/HALF1/PARTICIPANT_2_TO_WIN",
            ]),
        });

        expect(mappedProps.hintMessage).toEqual("SUSPENDED");
        expect(mappedProps.hintType).toEqual("WARNING");
        expect(mappedProps.isPanelDisabled).toEqual(true);
      });
    });
    describe("hasStakeCaret", () => {
      describe("when INPUT_MARKER throttle is not active", () => {
        it("should return false", () => {
          const mappedProps = setup();

          expect(mappedProps.hasStakeCaret).toBe(false);
        });
      });
      describe("when INPUT_MARKER throttle is active", () => {
        it("should return true", () => {
          const mappedProps = setup({ throttles: { INPUT_MARKER: { isActive: true } } });

          expect(mappedProps.hasStakeCaret).toBe(true);
        });
      });
    });
  });

  describe("mapDispatchToProps", () => {
    function setupMapDispatchToProps({ dispatch = jest.fn() } = {}) {
      return mapDispatchToProps(dispatch);
    }
    it("should have defined dispatchers", () => {
      const dispatchers = setupMapDispatchToProps();

      expect(dispatchers.dispatchStakeChange).toBeDefined();
      expect(dispatchers.dispatchStakeValidate).toBeDefined();
      expect(dispatchers.dispatchQuotesUpdate).toBeDefined();
    });

    describe("dispatchStakeChange", () => {
      it("should call dispatch with BETTING__OBB_CHANGE_STAKE_ACTION", () => {
        const dispatch = jest.fn();
        const { dispatchStakeChange } = setupMapDispatchToProps({ dispatch });

        dispatchStakeChange({ potentialBetId: "id", newValue: 4 });

        expect(dispatch).toHaveBeenCalledWith({
          type: BETTING__OBB_CHANGE_STAKE_ACTION,
          payload: { potentialBetId: "id", newValue: 4 },
        });
      });

      it("should call dispatch with BETTING__OBB_CHANGE_STAKE_ACTION, transforming 'undefined' newValue to null", () => {
        const dispatch = jest.fn();
        const { dispatchStakeChange } = setupMapDispatchToProps({ dispatch });

        dispatchStakeChange({ potentialBetId: "id", newValue: undefined });

        expect(dispatch).toHaveBeenCalledWith({
          type: BETTING__OBB_CHANGE_STAKE_ACTION,
          payload: { potentialBetId: "id", newValue: null },
        });
      });
    });
    describe("dispatchObbQuotesUpdate", () => {
      it("should call dispatch with BETTING__OBB_UPDATE_QUOTES", () => {
        const dispatch = jest.fn();
        const { dispatchQuotesUpdate } = setupMapDispatchToProps({ dispatch });

        dispatchQuotesUpdate();

        expect(dispatch).toHaveBeenCalledWith({
          type: BETTING__OBB_UPDATE_QUOTES,
        });
      });
    });

    describe("dispatchStakeValidate", () => {
      it("should call dispatch with BETTING__OBB_VALIDATE_STAKE", () => {
        const dispatch = jest.fn();
        const { dispatchStakeValidate } = setupMapDispatchToProps({ dispatch });

        dispatchStakeValidate({ potentialBetId: "id" });

        expect(dispatch).toHaveBeenCalledWith({
          type: BETTING__OBB_VALIDATE_STAKE,
          payload: { potentialBetId: "id" },
        });
      });
    });
  });
});
