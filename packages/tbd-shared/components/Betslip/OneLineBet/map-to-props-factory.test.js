import { UI__BETSLIP_SBK_REMOVE_LEG_CLICK } from "@ppb/tbd-store/actions/betslip";
import { BETTING__SBK_REMOVE_LEG_ACTION } from "@ppb/tbd-store/actions/betting";
import {
  getBettingResolvers,
  getSportsbookBettingCombinations,
  getSportsbookBettingLegs,
} from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import {
  getSportsbookConfirmationCombinations,
  getSportsbookConfirmationLegs,
  getSportsbookConfirmationRunners,
} from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { IconsList } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

import { buildSelection } from "../connected-sportsbook-betslip-mapper";
import { createIsConfirmStep } from "../sportsbook-betslip-confirm-mapper";
import { getSelectionTypeIcon } from "../../../helpers/selection-type";

import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

const getUserPreferencesWithProductSwitcher = jest.fn();
const getUserDetails = jest.fn();
const isBrandSettingEnabled = jest.fn();

jest.mock("@ppb/tbd-store/helpers/sportsbook-betting");
jest.mock("@ppb/tbd-store/state/entities/entities-selectors", () => ({
  createBettingRunnersMetadataSelector: jest.fn(() => () => {}),
}));

jest.mock("@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors", () => ({
  getSportsbookBettingLegs: jest.fn(),
  getSportsbookBettingCombinations: jest.fn(),
  createSportsbookBettingRunnerSelector: jest.fn(() => () => "bettingRunner"),
  getBettingResolvers: jest.fn().mockReturnValue({
    getMetadata: jest.fn(),
  }),
}));

jest.mock("@ppb/tbd-store/state/betslip/betslip-card-selectors", () => ({
  getBetslipGroup: jest.fn().mockReturnValue("REAL"),
  getBetslipCard: jest.fn().mockReturnValue({}),
  getSportsbookConfirmationCombinations: jest.fn().mockReturnValue({}),
  getSportsbookConfirmationLegs: jest.fn().mockReturnValue({}),
  getSportsbookConfirmationRunners: jest.fn().mockReturnValue({}),
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(() => getUserDetails),
}));

jest.mock("@ppb/tbd-store/state/entities/throttles/throttles-selectors", () => ({
  createGetThrottleSelector: jest.fn(() => jest.fn(() => ({ isActive: true }))),
}));

jest.mock("@ppb/tbd-store/state/entities/brand-settings/brand-settings-selectors", () => ({
  createIsBrandSettingEnabledSelector: jest.fn(() => isBrandSettingEnabled),
}));

jest.mock("../connected-sportsbook-betslip-mapper", () => ({
  buildSelection: jest.fn().mockReturnValue({ title: "Title", subtitle: "Subtitle", handicap: "+1", name: "Name" }),
}));

jest.mock("../sportsbook-betslip-confirm-mapper", () => ({
  createIsConfirmStep: jest.fn(() => () => false),
}));

jest.mock("../../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("../../../helpers/selection-type", () => ({
  getSelectionTypeIcon: jest.fn().mockReturnValue(jest.fn()),
}));

jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());

const setupMapStateToProps = ({
  appState = { betting: { sportsbookBetting: { runners: {} } }, betslip: { sportsbookOddsMovement: {} }, entities: {} },
  bettingState = { combinations: {}, legs: {}, runners: {}, failures: { imply: { runners: {} } } },
  sportsbookConfirmationState = { combinations: {}, legs: {}, runners: {}, failures: { imply: { runners: {} } } },
  metadata = {},
  preferences = {},
  selection = {},
  userDetails = {},
  ownProps = { hasAvailabilityHints: true },
} = {}) => {
  const finalBettingState = {
    combinations: {
      "C:1": { id: "C:1", legs: ["LEG:1"], stake: 1.22 },
      ...bettingState.combinations,
    },
    legs: { "LEG:1": { runners: ["R:1"] }, ...bettingState.legs },
    runners: {
      "R:1": {},
      ...bettingState.runners,
    },
    failures: {
      imply: {
        runners: {},
      },
    },
    validations: {
      combinations: {
        "C:1": "validationMock",
      },
    },
    sportsbookConfirmation: {
      combinations: {
        "CONFIRM:C:1": { id: "CONFIRM:C:1", legs: ["CONFIRM:L:1"], stake: 1.22 },
        ...sportsbookConfirmationState.combinations,
      },
      legs: { "CONFIRM:L:1": { runners: ["CONFIRM:R:1"] }, ...sportsbookConfirmationState.legs },
      runners: {
        "CONFIRM:R:1": {},
        ...sportsbookConfirmationState.runners,
      },
      failures: {
        imply: {
          runners: {},
        },
      },
    },
    isBonusSelected: bettingState.isBonusSelected,
  };
  getBettingResolvers.mockReturnValue({
    getMetadata: () => ({
      "R:1": {
        previousOdds: [1.23],
      },
      ...metadata,
    }),
  });
  getSportsbookBettingCombinations.mockReturnValue(finalBettingState.combinations);
  getSportsbookBettingLegs.mockReturnValue(finalBettingState.legs);
  getSportsbookConfirmationCombinations.mockReturnValue(finalBettingState.sportsbookConfirmation.combinations);
  getSportsbookConfirmationLegs.mockReturnValue(finalBettingState.sportsbookConfirmation.legs);
  getSportsbookConfirmationRunners.mockReturnValue(finalBettingState.sportsbookConfirmation.runners);
  getUserPreferencesWithProductSwitcher.mockReturnValue(preferences);
  getUserDetails.mockReturnValue(userDetails);
  buildSelection.mockReturnValue(selection);

  return makeMapStateToProps()(appState, ownProps);
};

describe("makeMapStateToProps", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("isConfirmStep", () => {
    beforeEach(() => {
      createIsConfirmStep.mockReturnValueOnce(() => true);
      setupMapStateToProps();
    });

    it("should call getSportsbookConfirmationCombinations", () => {
      expect(getSportsbookConfirmationCombinations).toHaveBeenCalledTimes(1);
    });

    it("should call getSportsbookConfirmationLegs", () => {
      expect(getSportsbookConfirmationLegs).toHaveBeenCalledTimes(1);
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
      setupMapStateToProps({});

      expect(global.console.error).toHaveBeenCalledWith(new Error("GET_USER_DETAILS_ERROR"));
    });

    it("should return an empty object", () => {
      expect(setupMapStateToProps({})).toEqual({});
    });
  });

  describe("runnerUrns", () => {
    it("should return the runner urns", () => {
      const props = setupMapStateToProps({
        metadata: {
          "R:1": {
            runnerUrn: "R:1",
          },
        },
        ownProps: { id: "C:1" },
      });

      expect(props.runnerUrns.length).toEqual(1);
      expect(props.runnerUrns[0]).toEqual("R:1");
    });
  });

  describe("id", () => {
    it("should return the id of the combination", () => {
      const props = setupMapStateToProps({
        metadata: {
          "C:1": {},
        },
        ownProps: { id: "C:1" },
      });

      expect(props.id).toEqual("C:1");
    });

    describe("when the step is confirmation bet", () => {
      it("should return the combination id from betslip confirmation", () => {
        createIsConfirmStep.mockReturnValueOnce(() => true);

        const props = setupMapStateToProps({
          metadata: {
            "CONFIRM:R:1": {
              sportId: 29125756,
            },
          },
          ownProps: { id: "CONFIRM:C:1" },
        });

        expect(props.id).toEqual("CONFIRM:C:1");
      });
    });
  });

  describe("legId", () => {
    it("should return the legId of the combination", () => {
      const props = setupMapStateToProps({
        ownProps: { id: "C:1" },
      });

      expect(props.legId).toEqual("LEG:1");
    });
  });

  describe("selectionTypeIcon", () => {
    describe("when isBrandSettingEnabled returns false", () => {
      beforeEach(() => {
        isBrandSettingEnabled.mockReturnValue(false);
      });

      it("should not call getSelectionTypeIcon", () => {
        setupMapStateToProps({
          id: "LEG:1",
          metadataBuilder: jest.fn(() => ({
            "RUNNER:1": {
              runnerUrn: "RUNNER:1",
              marketType: "FakeMarketType",
            },
          })),
        });

        expect(getSelectionTypeIcon).not.toHaveBeenCalled();
      });

      it("should return an undefined selectionTypeIcon", () => {
        getSelectionTypeIcon.mockReturnValue(IconsList.TWO_UP_EARLY_PAYOUT_MONOCHROME);

        const mappedProps = setupMapStateToProps({
          id: "LEG:1",
          metadataBuilder: jest.fn(() => ({
            "RUNNER:1": {
              runnerUrn: "RUNNER:1",
              marketType: "FakeMarketType",
            },
          })),
        });

        expect(getSelectionTypeIcon).not.toHaveBeenCalled();
        expect(mappedProps.selectionTypeIcon).toEqual(undefined);
      });
    });

    describe("when isBrandSettingEnabled returns true", () => {
      beforeEach(() => {
        isBrandSettingEnabled.mockReturnValue(true);
      });

      it("should call getSelectionTypeIcon with marketType", () => {
        setupMapStateToProps({
          ownProps: { id: "C:1" },
          metadata: {
            "R:1": {
              runnerUrn: "R:1",
              is90Min: false,
              marketType: "FakeMarketType",
              isSuperSub: false,
            },
          },
        });

        expect(getSelectionTypeIcon).toHaveBeenCalledTimes(1);
        expect(getSelectionTypeIcon).toHaveBeenCalledWith("FakeMarketType", false);
      });

      describe("when selectionTypeIcon has an icon mapped", () => {
        it("should return an icon value", () => {
          getSelectionTypeIcon.mockReturnValue(IconsList.TWO_UP_EARLY_PAYOUT_MONOCHROME);

          const props = setupMapStateToProps({
            ownProps: { id: "C:1" },
            metadata: {
              "R:1": {
                runnerUrn: "R:1",
                is90Min: false,
                marketType: "FakeMarketType",
              },
            },
          });

          expect(getSelectionTypeIcon).toHaveBeenCalledTimes(1);
          expect(props.selectionTypeIcon).toEqual(IconsList.TWO_UP_EARLY_PAYOUT_MONOCHROME);
        });
      });

      describe("when selectionTypeIcon has not an icon mapped", () => {
        it("should return undefined", () => {
          getSelectionTypeIcon.mockReturnValue(undefined);

          const props = setupMapStateToProps({
            ownProps: { id: "C:1" },
            metadata: {
              "R:1": {
                runnerUrn: "R:1",
                is90Min: false,
              },
            },
          });

          expect(getSelectionTypeIcon).toHaveBeenCalledTimes(1);
          expect(props.selectionTypeIcon).toEqual(undefined);
        });
      });

      describe("when isSuperSub returns true", () => {
        it("should return the icon value of Super Sub", () => {
          getSelectionTypeIcon.mockReturnValue(IconsList.SUPER_SUB_MONOCHROME);

          const mappedProps = setupMapStateToProps({
            ownProps: { id: "C:1" },
            metadata: {
              "R:1": {
                runnerUrn: "R:1",
                is90Min: false,
                marketType: "FakeMarketType",
                isSuperSub: true,
              },
            },
          });

          expect(getSelectionTypeIcon).toHaveBeenCalledTimes(1);
          expect(getSelectionTypeIcon).toHaveBeenCalledWith("FakeMarketType", true);
          expect(mappedProps.selectionTypeIcon).toEqual(IconsList.SUPER_SUB_MONOCHROME);
        });
      });
    });
  });

  describe("subtitle", () => {
    it("should return output of buildSelection", () => {
      const props = setupMapStateToProps({
        selection: { subtitle: "Subtitle" },
        preferences: {
          sportsbookOddsDisplay: "fractional",
        },
        ownProps: { id: "C:1" },
      });

      expect(props.subtitle).toEqual("Subtitle");
    });
  });

  describe("mapDispatchToProps", () => {
    beforeEach(() => jest.clearAllMocks());

    const dispatchSpy = jest.fn();

    describe("dispatchRemoveSelectionAction", () => {
      it("should call dispatch twice", () => {
        const { dispatchRemoveSelectionAction } = mapDispatchToProps(dispatchSpy);
        dispatchRemoveSelectionAction({ legId: "id:1", runnerUrns: ["runner:1"] });

        expect(dispatchSpy).toHaveBeenCalledTimes(2);
      });

      it("should dispatch a BetslipSportsbookRemoveLegClick", () => {
        const { dispatchRemoveSelectionAction } = mapDispatchToProps(dispatchSpy);
        dispatchRemoveSelectionAction({ legId: "id:1", runnerUrns: ["runner:1"] });

        expect(dispatchSpy.mock.calls[0][0]).toEqual({
          type: UI__BETSLIP_SBK_REMOVE_LEG_CLICK,
          payload: { legId: "id:1", runnerUrn: "runner:1" },
        });
      });

      it("should dispatch a BettingSportsbookRemoveLegAction", () => {
        const { dispatchRemoveSelectionAction } = mapDispatchToProps(dispatchSpy);
        dispatchRemoveSelectionAction({ legId: "id:1", runnerUrns: ["runner:1"] });

        expect(dispatchSpy.mock.calls[1][0]).toEqual({
          type: BETTING__SBK_REMOVE_LEG_ACTION,
          payload: { legId: "id:1" },
        });
      });
    });
  });
});
