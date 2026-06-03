import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { getObbBettingState } from "@ppb/tbd-store/state/betting/obb-betting/obb-betting-selectors";
import { isCombinedPotentialBet, hasSameBaseBets } from "../../../helpers/obb";
import {
  BETTING__OBB_CLEAR_ACTION,
  BETTING__OBB_PLACE_BETS,
  BETTING__DEPOSIT_TO_PLACE_BET,
  BETTING__OBB_INCREMENT_STAKE_ACTION,
} from "@ppb/tbd-store/actions/betting";
import { createOddsMovementSelector } from "@ppb/tbd-store/state/betslip/betslip-odds-movement-selectors";
import { EXTERNAL_PUSH, PUSH } from "@ppb/tbd-store";
import { getBetslipCard } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { AlertType, KeyboardSeparator } from "@ppb/the-wall-common/types";
import { UI__BETSLIP_ACCORDION_HEADER_CLICK } from "@ppb/tbd-store/actions/betslip";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";
import { createGetObbIsDepositRequiredSelector } from "../betslip-mapper";
import {
  buildObbFailuresNotifications,
  createGetAvailabilityFailuresOnStakedBetsSelector,
} from "../connected-obb-betslip-mapper";
import { createValidationsSelector } from "../ObbNotifier/obb-notifier-mapper";
import { buildSbkPlaceBetButtonLabels } from "../../../helpers/betslip-place-button-helper";
import { buildSbkBalanceAfterBetLabel } from "../../../helpers/betslip-balance-helper";
import { getSeparatorByLocale } from "../../../helpers/numeric-i18n";
import { getEndpoint } from "../../../config/endpoints";

const USER_DETAILS_MOCK = {
  countryCode: "PT",
  currencyCode: "EUR",
  localeCode: "pt",
  loggedIn: true,
};

jest.mock("../../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("../../../formatters/currency-formatters", () => ({
  currencyFormatWithDecimalPlaces: jest.fn(({ value }) => `€ ${value}`),
  getCurrencySymbol: jest.fn().mockReturnValue("€"),
}));

jest.mock("../betslip-mapper", () => ({
  buildQuickStakesSelector: jest.fn().mockReturnValue(jest.fn(() => [{ qs: "qs" }])),
  createGetObbIsDepositRequiredSelector: jest.fn().mockReturnValue(() => false),
}));

jest.mock("@ppb/tbd-store", () => ({
  ConfirmationCode: {
    BETTING_GROUP_SWITCH: 1,
    BETTING_CLEAR: 2,
    BETTING_BETSLIP_TYPE_SWITCH: 3,
  },
}));

jest.mock("@ppb/tbd-store/state/betting/obb-betting/obb-betting-selectors", () => ({
  getObbBettingState: jest.fn(),
  createGetXofNDataByPotentialBetIdSelector: jest.fn(() =>
    jest.fn((state, potentialBetIds) => potentialBetIds.map((id, index) => ({ id, x: index + 2 }))),
  ),
}));

jest.mock("../../../helpers/obb", () => ({
  ...jest.requireActual("../../../helpers/obb"),
  isCombinedPotentialBet: jest.fn(),
  hasSameBaseBets: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn(() => USER_DETAILS_MOCK),
}));

jest.mock("@ppb/tbd-store/state/betslip/betslip-odds-movement-selectors", () => ({
  createOddsMovementSelector: jest.fn().mockReturnValue(jest.fn().mockReturnValue({})),
}));

jest.mock("@ppb/tbd-store/state/betslip/betslip-card-selectors", () => ({
  getBetslipCard: jest.fn().mockReturnValue({}),
}));

jest.mock("../connected-obb-betslip-mapper", () => ({
  buildObbFailuresNotifications: jest.fn(),
  createGetAvailabilityFailuresOnStakedBetsSelector: jest.fn().mockReturnValue(jest.fn().mockReturnValue({})),
}));

jest.mock("../ObbNotifier/obb-notifier-mapper", () => ({
  createValidationsSelector: jest.fn().mockReturnValue(() => []),
}));

jest.mock("@ppb/tbd-store/state/entities/user-wallets/user-wallets-selectors", () => ({
  createGetUserMainWalletValueSelector: jest.fn(() => () => 200),
}));

jest.mock("../../../helpers/numeric-i18n", () => ({
  getSeparatorByLocale: jest.fn().mockReturnValue(KeyboardSeparator.Dot),
}));

jest.mock("../../../helpers/betslip-balance-helper", () => ({
  buildSbkBalanceAfterBetLabel: jest.fn(() => "100 €"),
}));

jest.mock("@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors", () => ({
  createUserPreferencesWithProductSwitcherSelector: jest.fn(() =>
    jest.fn().mockReturnValue({
      sportsbookOddsDisplay: "sportsbookOddsDisplay",
      oddsMovement: true,
    }),
  ),
}));

jest.mock("../../../helpers/betslip-place-button-helper", () => ({
  buildSbkPlaceBetButtonLabels: jest.fn().mockReturnValue({
    label: "placeButtonLabel",
    secondaryLabel: "placeButtonSecondaryLabel",
    loadingLabel: "placeButtonLoadingLabel",
    reverseLabels: "placeButtonReverseLabels",
  }),
}));

jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());

jest.mock("../../../config/endpoints");

const obbBettingStateMock = {
  potentialBets: {
    "ppb:obb:potentialBet:1": {
      id: "ppb:obb:potentialBet:1",
      betType: "SINGLE",
      legs: ["ppb:obb:leg:1"],
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
    "ppb:obb:potentialBet:2": {
      id: "ppb:obb:potentialBet:2",
      betType: "SINGLE",
      legs: ["ppb:obb:leg:2"],
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
    "ppb:obb:leg:1": {
      urn: "ppb:obb:leg:1",
      metadata: {
        eventName: "Team A v Team B",
        participantsDescription: "Player 12345",
        outcomeDescription: "GOALS AT_LEAST 2 HALF1",
        legTypeDescription: "Basic",
      },
      params: {},
    },
    "ppb:obb:leg:2": {
      urn: "ppb:obb:leg:2",
      metadata: {
        eventName: "Team A v Team B",
        participantsDescription: "Player 54321",
        outcomeDescription: "GOALS AT_LEAST 2 HALF1",
        legTypeDescription: "Basic",
      },
      params: {
        x: 2,
        baseLegs: ["1235"],
      },
    },
  },
  failures: { betslip: null },
  totalStake: 2,
  totalPotentialReturns: 8,
};

describe("ObbPlace mapToPropsFactory", () => {
  beforeEach(jest.clearAllMocks);

  describe("makeMapStateToProps", () => {
    function setup({ obbBettingState, ownProps = {} } = {}) {
      const obbBetting = {
        ...obbBettingStateMock,
        ...obbBettingState,
      };
      getObbBettingState.mockReturnValue(obbBetting);

      const state = {
        betting: {
          obbBetting,
        },
        betslip: {},
        entities: {
          preferences: {},
        },
      };
      return makeMapStateToProps()(state, ownProps);
    }

    describe("i18n", () => {
      it("should return translated labels", () => {
        const { i18n: i18nLabels } = setup({});

        expect(i18nLabels).toEqual({
          additionalMultiples: "",
          balanceAfterBet: "I18N.BETSLIP.BALANCE_AFTER_BET",
          betBuilder: "I18N.BETSLIP.BET_BUILDER",
          casts: "",
          eachWay: "",
          eachWaySubtitle: "",
          freeBetsAlertRemoveLabel: "I18N.BETSLIP.REMOVE",
          freeBetsLabel: "I18N.BETSLIP.USE_FREE_BET_WITHOUT_AMOUNT",
          multiBetBuilder: "s",
          multiples: "I18N.BETSLIP.MULTIPLES",
          oddsLabel: "I18N.BETSLIP.ODDS",
          oddsMovementDown: "",
          oddsMovementUp: "",
          placing: "",
          priceBoosts: "",
          removeLabel: "I18N.BETSLIP.REMOVE_ALL",
          singles: "I18N.BETSLIP.SINGLES",
          stakeLabel: "I18N.BETSLIP.STAKE",
          termsLabel: "I18N.BETSLIP.BETS_ACCEPTED_IN_ACCORDANCE_WITH",
          termsLinkLabel: "I18N.BETSLIP.SKYBETS_RULES",
          totalReturns: "I18N.BETSLIP.TOTAL_RETURNS",
          totalStake: "",
          voidBlurbText: "I18N.BETSLIP.OBB.VOID_BLURB",
          tabAllTitle: "I18N.BETSLIP.TABS.ALL",
          tabBetBuildersTitle: "I18N.BETSLIP.TABS.BET_BUILDER",
          tabCastTitle: "I18N.BETSLIP.TABS.CAST_BET",
          tabMultiplesTitle: "I18N.BETSLIP.TABS.MULTIPLES",
          tabSinglesTitle: "I18N.BETSLIP.TABS.SINGLES",
          betslipAriaTitle: "I18N.BETSLIP.TITLE",
        });
      });
      describe("termsUrl", () => {
        it("should be undefined when endpoint is not set", () => {
          getEndpoint.mockImplementation(() => {
            throw new Error("Some error");
          });
          const { termsUrl } = setup({});
          expect(termsUrl).toBe(undefined);
        });

        it("should be a string when endpoint is set", () => {
          getEndpoint.mockImplementation(() => "generic_terms_endpoint");
          const { termsUrl } = setup({});
          expect(termsUrl).toBe("generic_terms_endpoint");
        });
      });
    });

    describe("when `getUserDetails` throws an error", () => {
      const GET_USER_DETAILS_ERROR = "GET_USER_DETAILS_ERROR";

      beforeEach(() => {
        getUserDetails.mockImplementationOnce(() => {
          throw new Error(GET_USER_DETAILS_ERROR);
        });
      });

      it("should call console.error with the error thrown from `getUserDetails`", () => {
        setup();

        expect(global.console.error).toHaveBeenCalledWith(new Error("GET_USER_DETAILS_ERROR"));
      });

      it("should return an empty object", () => {
        expect(setup()).toEqual({});
      });
    });

    describe("placeBtnLabel, placeBtnSecondaryLabel, placeBtnLoadingLabel, reversePlaceBtnLabels", () => {
      it("should call buildSbkPlaceBetButtonLabels with the correct props", () => {
        createOddsMovementSelector.mockReturnValueOnce(() => ({
          "ppb:obb:potentialBet:1": { movement: "UP" },
        }));
        createGetObbIsDepositRequiredSelector.mockReturnValueOnce(() => false);

        const { placeBtnLabel, placeBtnSecondaryLabel, placeBtnLoadingLabel, reversePlaceBtnLabels } = setup({});

        expect(buildSbkPlaceBetButtonLabels).toHaveBeenCalledWith({
          hasOddsChanged: true,
          hasStake: true,
          interpolatedValues: {
            stake: "€ 2",
          },
          isAuthenticating: undefined,
          isDepositRequired: false,
          isLoggedIn: true,
          isPlacing: false,
          shouldAcceptOddsMovement: true,
        });

        expect(placeBtnLabel).toBe("placeButtonLabel");
        expect(placeBtnSecondaryLabel).toBe("placeButtonSecondaryLabel");
        expect(placeBtnLoadingLabel).toBe("placeButtonLoadingLabel");
        expect(reversePlaceBtnLabels).toBe("placeButtonReverseLabels");
      });
    });

    describe("balanceAfterBet", () => {
      it("should return the expected value", () => {
        const { balanceAfterBet } = setup({});

        expect(buildSbkBalanceAfterBetLabel).toHaveBeenCalledWith(
          {
            countryCode: "PT",
            currencyCode: "EUR",
            localeCode: "pt",
            loggedIn: true,
          },
          {
            accountBalance: 200,
            totalStake: 2,
            isLoggedIn: true,
          },
        );

        expect(balanceAfterBet).toBe("100 €");
      });
    });

    describe("isPanelDisabled", () => {
      describe("when there is a bet placement happening", () => {
        it("should return true", () => {
          getBetslipCard.mockReturnValue({ placeStatus: "INPROGRESS" });

          const { isPanelDisabled } = setup({});

          expect(isPanelDisabled).toEqual(true);
        });
      });

      describe("when there is no bet placement happening", () => {
        it("should return false", () => {
          getBetslipCard.mockReturnValue({ placeStatus: "NONE" });

          const { isPanelDisabled } = setup({});

          expect(isPanelDisabled).toEqual(false);
        });
      });

      describe("when the user is authenticating", () => {
        it("should return true", () => {
          getBetslipCard.mockReturnValue({ placeStatus: "NONE" });
          getUserDetails.mockReturnValueOnce({ ...USER_DETAILS_MOCK, isAuthenticating: true });

          const { isPanelDisabled } = setup({});

          expect(isPanelDisabled).toEqual(true);
        });
      });
    });

    describe("when has obb state data", () => {
      describe("and has total returns", () => {
        it("should get total return mapped correctly", () => {
          const { totalReturns } = setup();

          expect(totalReturns).toEqual("€ 8");
        });
      });

      it("should get total return mapped when values are null", () => {
        const { totalReturns } = setup({
          obbBettingState: { totalPotentialReturns: null },
        });

        expect(totalReturns).toEqual("€ 0");
      });

      it("should return the singles and multiples correctly", () => {
        isCombinedPotentialBet.mockReturnValueOnce(false).mockReturnValueOnce(true);
        hasSameBaseBets.mockReturnValue(false);

        const { singles, multiplesGroups } = setup();

        expect(singles).toEqual(["ppb:obb:potentialBet:1"]);

        expect(multiplesGroups).toEqual([[{ id: "ppb:obb:potentialBet:2", x: 2 }]]);
      });

      it("should group multiples with same base bets together", () => {
        const obbBettingState = {
          ...obbBettingStateMock,
          potentialBets: {
            ...obbBettingStateMock.potentialBets,
            "ppb:obb:potentialBet:3": {
              id: "ppb:obb:potentialBet:3",
              betType: "SINGLE",
              legs: ["ppb:obb:leg:3"],
              stake: 1,
              potentialReturns: 4,
            },
          },
          legs: {
            ...obbBettingStateMock.legs,
            "ppb:obb:leg:3": {
              urn: "ppb:obb:leg:3",
              metadata: {
                eventName: "Team A v Team B",
                participantsDescription: "Player 12345",
                outcomeDescription: "GOALS AT_LEAST 3 HALF1",
                legTypeDescription: "Basic",
              },
              params: {
                x: 3,
                baseLegs: ["1235"],
              },
            },
          },
        };

        isCombinedPotentialBet.mockReturnValueOnce(false).mockReturnValueOnce(true).mockReturnValueOnce(true);

        hasSameBaseBets.mockReturnValue(true);

        const { singles, multiplesGroups } = setup({ obbBettingState });

        expect(singles).toEqual(["ppb:obb:potentialBet:1"]);
        expect(multiplesGroups).toEqual([[{ id: "ppb:obb:potentialBet:3", x: 3 }]]);
      });

      it("should create separate groups for multiples with different base bets", () => {
        const obbBettingState = {
          ...obbBettingStateMock,
          potentialBets: {
            ...obbBettingStateMock.potentialBets,
            "ppb:obb:potentialBet:3": {
              id: "ppb:obb:potentialBet:3",
              betType: "SINGLE",
              legs: ["ppb:obb:leg:3"],
              stake: 1,
              potentialReturns: 4,
            },
          },
          legs: {
            ...obbBettingStateMock.legs,
            "ppb:obb:leg:3": {
              urn: "ppb:obb:leg:3",
              metadata: {
                eventName: "Team C v Team D",
                participantsDescription: "Player 99999",
                outcomeDescription: "GOALS AT_LEAST 3 HALF1",
                legTypeDescription: "Basic",
              },
              params: {
                x: 2,
                baseLegs: ["9999"],
              },
            },
          },
        };

        isCombinedPotentialBet.mockReturnValueOnce(false).mockReturnValueOnce(true).mockReturnValueOnce(true);

        hasSameBaseBets.mockReturnValueOnce(false);

        const { singles, multiplesGroups } = setup({ obbBettingState });

        expect(singles).toEqual(["ppb:obb:potentialBet:1"]);
        expect(multiplesGroups).toEqual([
          [{ id: "ppb:obb:potentialBet:2", x: 2 }],
          [{ id: "ppb:obb:potentialBet:3", x: 2 }],
        ]);
      });
    });

    describe("hasError", () => {
      describe("when there are failures", () => {
        it("should return true", () => {
          const { hasError } = setup({
            obbBettingState: { failures: { betslip: "ERROR" } },
          });

          expect(hasError).toEqual(true);
        });
      });

      describe("when there are no failures", () => {
        it("should return false", () => {
          buildObbFailuresNotifications.mockReturnValue(undefined);

          const { hasError } = setup();

          expect(hasError).toEqual(false);
        });
      });
    });

    describe("isPlaceDisabled", () => {
      describe("when no potential bet has stake", () => {
        it("should return true", () => {
          const { isPlaceDisabled } = setup({
            obbBettingState: {
              ...obbBettingStateMock,
              potentialBets: {
                "ppb:obb:potentialBet:1": {
                  ...obbBettingStateMock.potentialBets["ppb:obb:potentialBet:1"],
                  stake: null,
                },
              },
            },
          });

          expect(isPlaceDisabled).toEqual(true);
        });
      });

      describe("when there are blocking validations", () => {
        it("should return true", () => {
          createValidationsSelector.mockReturnValue(() => [
            { notification: { type: AlertType.Error, items: ["message"] } },
          ]);

          const { isPlaceDisabled } = setup({});

          expect(isPlaceDisabled).toEqual(true);
        });
      });

      describe("when there are availability failures on staked potential bets", () => {
        it("should return true", () => {
          createValidationsSelector.mockReturnValue(() => []);
          createGetAvailabilityFailuresOnStakedBetsSelector.mockReturnValueOnce(() => true);

          const { isPlaceDisabled } = setup({});

          expect(isPlaceDisabled).toEqual(true);
        });
      });

      describe("when there are no blocking validations and at least a potential bet has stake", () => {
        it("should return false", () => {
          createValidationsSelector.mockReturnValue(() => []);
          createGetAvailabilityFailuresOnStakedBetsSelector.mockReturnValueOnce(() => false);

          const { isPlaceDisabled } = setup({});

          expect(isPlaceDisabled).toEqual(false);
        });
      });
    });

    describe("quickStakes", () => {
      it("should return correct quickStakes", () => {
        const { quickStakes } = setup();

        expect(quickStakes).toEqual([{ qs: "qs" }]);
      });
    });

    describe("currencySymbol", () => {
      it("should return the getCurrencySymbol output", () => {
        const { currencySymbol } = setup();

        expect(currencySymbol).toEqual("€");
      });
    });

    describe("separator", () => {
      it("should call getSeparatorByLocale with the user locale", () => {
        setup();

        expect(getSeparatorByLocale).toHaveBeenCalledTimes(1);
        expect(getSeparatorByLocale).toHaveBeenCalledWith("pt");
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
  });

  describe("mapDispatchToProps", () => {
    const dispatchSpy = jest.fn();

    function setupMapDispatchToProps() {
      return mapDispatchToProps(dispatchSpy);
    }
    it("should have defined dispatchers", () => {
      const dispatchers = setupMapDispatchToProps();

      expect(dispatchers).toEqual({
        dispatchOnPlaceBetsClick: expect.any(Function),
        dispatchOnRemoveAllClick: expect.any(Function),
        dispatchRedirectToLogin: expect.any(Function),
        dispatchDepositRedirect: expect.any(Function),
        dispatchNavigate: expect.any(Function),
        dispatchIncrementPress: expect.any(Function),
        dispatchAccordionToggle: expect.any(Function),
      });
    });

    describe("dispatchDepositRedirect", () => {
      it("should dispatch a BettingDepositToPlaceBet action", () => {
        const dispatch = jest.fn();
        const { dispatchDepositRedirect } = mapDispatchToProps(dispatch);

        dispatchDepositRedirect();

        expect(dispatch).toHaveBeenCalledWith({
          type: BETTING__DEPOSIT_TO_PLACE_BET,
        });
      });
    });

    describe("dispatchNavigate", () => {
      it("should dispatch a PushAction action", () => {
        const dispatch = jest.fn();
        const { dispatchNavigate } = mapDispatchToProps(dispatch);

        dispatchNavigate("viewUrn", "viewUrl");

        expect(dispatch).toHaveBeenCalledWith({
          type: PUSH,
          payload: {
            viewUrn: "viewUrn",
            viewUrl: "viewUrl",
          },
        });
      });
    });

    describe("dispatchOnPlaceBetsClick", () => {
      it("should dispatch a BettingObbPlaceBetsAction", () => {
        const { dispatchOnPlaceBetsClick } = mapDispatchToProps(dispatchSpy);
        dispatchOnPlaceBetsClick();

        expect(dispatchSpy).toHaveBeenCalledWith({
          type: BETTING__OBB_PLACE_BETS,
        });
        expect(dispatchSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe("dispatchOnRemoveAllClick", () => {
      it("should dispatch a BettingObbPlaceBetsAction", () => {
        const { dispatchOnRemoveAllClick } = mapDispatchToProps(dispatchSpy);
        dispatchOnRemoveAllClick();

        expect(dispatchSpy).toHaveBeenCalledWith({
          type: BETTING__OBB_CLEAR_ACTION,
        });
        expect(dispatchSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe("dispatchRedirectToLogin", () => {
      it("should dispatch a ExternalPushAction", () => {
        const { dispatchRedirectToLogin } = mapDispatchToProps(dispatchSpy);
        dispatchRedirectToLogin("dummyUrl");

        expect(dispatchSpy).toHaveBeenCalledWith({
          type: EXTERNAL_PUSH,
          payload: {
            viewUrn: "",
            viewUrl: "dummyUrl",
          },
        });
        expect(dispatchSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe("dispatchIncrementPress", () => {
      it("should call dispatch with BETTING__OBB_INCREMENT_STAKE_ACTION", () => {
        const { dispatchIncrementPress } = mapDispatchToProps(dispatchSpy);

        dispatchIncrementPress({ potentialBetId: "id", increment: 3 });

        expect(dispatchSpy).toHaveBeenCalledWith({
          type: BETTING__OBB_INCREMENT_STAKE_ACTION,
          payload: { potentialBetId: "id", increment: 3 },
        });
      });
    });

    describe("dispatchAccordionToggle", () => {
      it("should call dispatch with BETTING__OBB_INCREMENT_STAKE_ACTION", () => {
        const { dispatchAccordionToggle } = mapDispatchToProps(dispatchSpy);

        dispatchAccordionToggle(true);

        expect(dispatchSpy).toHaveBeenCalledWith({
          type: UI__BETSLIP_ACCORDION_HEADER_CLICK,
          payload: { isExpanded: true },
        });
      });
    });
  });
});
