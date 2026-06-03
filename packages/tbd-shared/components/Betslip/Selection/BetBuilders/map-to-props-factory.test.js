import { UI__BETSLIP_SBK_REMOVE_LEG_CLICK } from "@ppb/tbd-store/actions/betslip";
import { BETTING__SBK_REMOVE_LEG_ACTION } from "@ppb/tbd-store/actions/betting";
import { getBetslipCard, getSportsbookConfirmationLegs } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import {
  createSportsbookBettingRunnerSelector,
  getBettingResolvers,
  getSportsbookBettingImplyRunnerFailures,
  getSportsbookBettingLegs,
} from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { IconsList } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

import { createGetThrottleSelector } from "@ppb/tbd-store/state/entities/throttles/throttles-selectors";
import {
  buildSelection,
  hasAnyInvalidSGMCombinationFailure,
  hasAnySameMarketCombinationFailure,
  hasNotEligibleSGMSelectionCombinationFailure,
} from "../../connected-sportsbook-betslip-mapper";
import { createIsConfirmStep } from "../../sportsbook-betslip-confirm-mapper";
import { getSelectionTypeIcon } from "../../../../helpers/selection-type";

import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

const getUserDetails = jest.fn();
const isBrandSettingEnabled = jest.fn();

jest.mock("../../connected-sportsbook-betslip-mapper", () => ({
  hasAnySameMarketCombinationFailure: jest.fn(),
  hasAnyInvalidSGMCombinationFailure: jest.fn(),
  hasNotEligibleSGMSelectionCombinationFailure: jest.fn(),
  buildSelection: jest.fn(() => ({
    title: "Title",
    subtitle: "Subtitle",
    icon: "silkUrl",
    silkFallbackType: "HORSE_RACING",
    meetingCountry: "UK",
  })),
}));
jest.mock("@ppb/tbd-store/state/entities/entities-selectors");
jest.mock("@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors", () => ({
  createSportsbookBettingRunnerSelector: jest.fn(() => jest.fn().mockReturnValue({})),
  getSportsbookBettingLegs: jest.fn().mockReturnValue({ "LEG:1": { id: "LEG:1", runners: ["RUNNER:1"] } }),
  getBettingResolvers: jest.fn().mockReturnValue({ getMetadata: jest.fn() }),
  getSportsbookBettingImplyRunnerFailures: jest.fn().mockReturnValue({}),
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(() => getUserDetails),
}));

jest.mock("@ppb/tbd-store/state/entities/brand-settings/brand-settings-selectors", () => ({
  createIsBrandSettingEnabledSelector: jest.fn(() => isBrandSettingEnabled),
}));

jest.mock("@ppb/tbd-store/state/entities/throttles/throttles-selectors", () => ({
  createGetThrottleSelector: jest.fn().mockReturnValue(jest.fn().mockReturnValue({ isActive: false })),
}));

jest.mock("@ppb/tbd-store/state/betslip/betslip-card-selectors", () => ({
  getBetslipGroup: jest.fn().mockReturnValue("REAL"),
  getBetslipCard: jest.fn().mockReturnValue({}),
  getSportsbookConfirmationLegs: jest.fn().mockReturnValue({}),
}));

jest.mock("../../sportsbook-betslip-confirm-mapper", () => ({
  createIsConfirmStep: jest.fn().mockReturnValue(jest.fn()),
}));

jest.mock("../../../../helpers/selection-type", () => ({
  getSelectionTypeIcon: jest.fn().mockReturnValue(jest.fn()),
}));

jest.mock("../../../../helpers/i18n", () => ({
  i18n: jest.fn(({ key, interpolationValues }) => ({ key, interpolationValues })),
}));

const legsMock = { "LEG:1": { id: "LEG:1", runners: ["RUNNER:1"] } };
const defaultPropsMock = { id: "LEG:1" };

const setupMapStateToProps = ({
  id,
  betslipState,
  appState = {
    betslip: { sportsbookOddsMovement: {} },
    betting: {
      sportsbookBetting: { runners: {} },
    },
    entities: {
      throttles: {},
    },
  },
  legs = legsMock,
  runnerBuilder = jest.fn(() => ({})),
  metadataBuilder = jest.fn(() => ({
    "RUNNER:1": {
      runnerUrn: "RUNNER:1",
    },
  })),
  isConfirmStep = jest.fn(),
  getThrottle = jest.fn().mockReturnValue({ isActive: false }),
} = {}) => {
  getSportsbookBettingLegs.mockReturnValue(legs);
  getSportsbookConfirmationLegs.mockReturnValue(legs);
  getSportsbookBettingImplyRunnerFailures.mockReturnValue({ "RUNNER:1": [] });
  getBettingResolvers.mockReturnValue({
    getMetadata: metadataBuilder,
  });
  createSportsbookBettingRunnerSelector.mockReturnValue(runnerBuilder);
  getUserDetails.mockReturnValue("userDetails");
  getBetslipCard.mockReturnValue(betslipState);
  createGetThrottleSelector.mockReturnValue(getThrottle);
  createIsConfirmStep.mockReturnValue(isConfirmStep);

  return makeMapStateToProps()(appState, { id });
};

describe("makeMapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("when there is no leg", () => {
    it("should return empty props", () => {
      const mappedProps = setupMapStateToProps({ legs: {}, id: "LEG:1" });

      expect(mappedProps).toEqual({
        id: "LEG:1",
        title: "",
        subtitle: "",
        odd: "",
        action: "",
      });
    });
  });

  describe("when mapping urn", () => {
    it("should return the runnerUrn", () => {
      getSportsbookBettingLegs.mockReturnValue(legsMock);
      const mappedProps = setupMapStateToProps(defaultPropsMock);

      expect(mappedProps.urn).toEqual("RUNNER:1");
    });
  });

  describe("when mapping id", () => {
    it("should call getSportsbookBettingLegs", () => {
      setupMapStateToProps(defaultPropsMock);

      expect(getSportsbookBettingLegs).toHaveBeenCalledWith({
        betslip: { sportsbookOddsMovement: {} },
        betting: { sportsbookBetting: { runners: {} } },
        entities: { throttles: {} },
      });
    });

    it("should return the id of the leg", () => {
      getSportsbookBettingLegs.mockReturnValue(legsMock);
      const mappedProps = setupMapStateToProps(defaultPropsMock);

      expect(mappedProps.id).toEqual("LEG:1");
    });

    describe("when the step is for bet confirmation", () => {
      let isConfirmStep;

      beforeEach(() => {
        isConfirmStep = jest.fn().mockReturnValueOnce(true);
      });

      it("should call getSportsbookConfirmationLegs", () => {
        setupMapStateToProps({
          ...defaultPropsMock,
          isConfirmStep,
        });

        expect(getSportsbookConfirmationLegs).toHaveBeenCalledWith({
          betslip: { sportsbookOddsMovement: {} },
          betting: { sportsbookBetting: { runners: {} } },
          entities: { throttles: {} },
        });
      });

      it("should return the id of the leg", () => {
        getSportsbookConfirmationLegs.mockReturnValue(legsMock);
        const mappedProps = setupMapStateToProps({
          ...defaultPropsMock,
          isConfirmStep,
        });

        expect(mappedProps.id).toEqual("LEG:1");
      });
    });
  });

  describe("when mapping title, subtitle, silkUrl and silkFallbackType", () => {
    it("should call buildSelection", () => {
      setupMapStateToProps(defaultPropsMock);

      expect(buildSelection).toHaveBeenCalledWith({ runnerUrn: "RUNNER:1" }, "userDetails", {});
    });

    it("should return the correct title, subtitle, silkUrl and silkFallbackType and meetingCountry", () => {
      const mappedProps = setupMapStateToProps(defaultPropsMock);

      expect(mappedProps.title).toEqual("Title");
      expect(mappedProps.subtitle).toEqual("Subtitle");
      expect(mappedProps.icon).toEqual("silkUrl");
      expect(mappedProps.silkFallbackType).toEqual("HORSE_RACING");
      expect(mappedProps.meetingCountry).toEqual("UK");
    });
  });

  describe("when mapping hint message", () => {
    describe("when it is a same market failure", () => {
      it("should call hasAnySameMarketCombinationFailure", () => {
        hasAnySameMarketCombinationFailure.mockReturnValue(true);
        setupMapStateToProps(defaultPropsMock);

        expect(hasAnySameMarketCombinationFailure).toHaveBeenCalledWith([]);
      });

      it("should return the hint message for same market", () => {
        hasAnySameMarketCombinationFailure.mockReturnValue(true);

        const mappedProps = setupMapStateToProps(defaultPropsMock);

        expect(mappedProps.hintMessage).toEqual({ key: "I18N.BETSLIP.NOT_COMBINABLE_SELECTIONS" });
      });
    });

    describe("when it is an invalid sgm combination", () => {
      it("should call hasAnyInvalidSGMCombinationFailure", () => {
        hasAnySameMarketCombinationFailure.mockReturnValue(false);
        hasAnyInvalidSGMCombinationFailure.mockReturnValue(true);
        setupMapStateToProps(defaultPropsMock);

        expect(hasAnyInvalidSGMCombinationFailure).toHaveBeenCalledWith([]);
      });

      it("should return the hint message for same market", () => {
        hasAnySameMarketCombinationFailure.mockReturnValue(false);
        hasAnyInvalidSGMCombinationFailure.mockReturnValue(true);

        const mappedProps = setupMapStateToProps(defaultPropsMock);

        expect(mappedProps.hintMessage).toEqual({ key: "I18N.BETSLIP.NOT_COMBINABLE_SELECTIONS" });
      });
    });

    describe("when it is a not eligible sgm selection", () => {
      it("should call hasNotEligibleSGMSelectionCombinationFailure", () => {
        hasAnySameMarketCombinationFailure.mockReturnValue(false);
        hasAnyInvalidSGMCombinationFailure.mockReturnValue(false);
        hasNotEligibleSGMSelectionCombinationFailure.mockReturnValue(true);
        setupMapStateToProps(defaultPropsMock);

        expect(hasNotEligibleSGMSelectionCombinationFailure).toHaveBeenCalledWith([]);
      });

      it("should return the hint message for same market", () => {
        hasAnySameMarketCombinationFailure.mockReturnValue(false);
        hasAnyInvalidSGMCombinationFailure.mockReturnValue(false);
        hasNotEligibleSGMSelectionCombinationFailure.mockReturnValue(true);

        const mappedProps = setupMapStateToProps(defaultPropsMock);

        expect(mappedProps.hintMessage).toEqual({ key: "I18N.BETSLIP.NOT_AVAILABLE_BET_BUILDER" });
      });
    });
  });

  describe("when mapping is90Min", () => {
    describe("when market type is 90 Min", () => {
      it("should return true", () => {
        hasAnySameMarketCombinationFailure.mockReturnValue(true);

        const mappedProps = setupMapStateToProps({
          id: "LEG:1",
          metadataBuilder: jest.fn(() => ({
            "RUNNER:1": {
              runnerUrn: "RUNNER:1",
              is90Min: true,
            },
          })),
        });

        expect(mappedProps.is90Min).toBe(true);
      });
    });

    describe("when market type is not 90 Min", () => {
      it("should return false", () => {
        hasAnySameMarketCombinationFailure.mockReturnValue(true);

        const mappedProps = setupMapStateToProps({
          id: "LEG:1",
          metadataBuilder: jest.fn(() => ({
            "RUNNER:1": {
              runnerUrn: "RUNNER:1",
              marketType: "MATCH_ODDS",
            },
          })),
        });

        expect(mappedProps.is90Min).toBe(undefined);
      });
    });
  });

  describe("when mapping selectionTypeIcon", () => {
    describe("when isBrandSettingEnabled returns false", () => {
      beforeEach(() => {
        isBrandSettingEnabled.mockReturnValue(false);
        hasAnySameMarketCombinationFailure.mockReturnValue(true);
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

        expect(mappedProps.selectionTypeIcon).toEqual(undefined);
      });
    });

    describe("when isBrandSettingEnabled returns true", () => {
      beforeEach(() => {
        isBrandSettingEnabled.mockReturnValue(true);
        hasAnySameMarketCombinationFailure.mockReturnValue(true);
      });

      it("should call getSelectionTypeIcon with marketType", () => {
        setupMapStateToProps({
          id: "LEG:1",
          metadataBuilder: jest.fn(() => ({
            "RUNNER:1": {
              runnerUrn: "RUNNER:1",
              marketType: "FakeMarketType",
              isSuperSub: false,
            },
          })),
        });

        expect(getSelectionTypeIcon).toHaveBeenCalledTimes(1);
        expect(getSelectionTypeIcon).toHaveBeenCalledWith("FakeMarketType", false);
      });

      describe("when selectionTypeIcon has an icon mapped", () => {
        it("should return an icon value", () => {
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

          expect(getSelectionTypeIcon).toHaveBeenCalledTimes(1);
          expect(mappedProps.selectionTypeIcon).toEqual(IconsList.TWO_UP_EARLY_PAYOUT_MONOCHROME);
        });
      });

      describe("when selectionTypeIcon has not an icon mapped", () => {
        it("should return undefined", () => {
          getSelectionTypeIcon.mockReturnValue(undefined);

          const mappedProps = setupMapStateToProps({
            id: "LEG:1",
            metadataBuilder: jest.fn(() => ({
              "RUNNER:1": {
                runnerUrn: "RUNNER:1",
                marketType: "MATCH_ODDS",
              },
            })),
          });

          expect(getSelectionTypeIcon).toHaveBeenCalledTimes(1);
          expect(mappedProps.selectionTypeIcon).toEqual(undefined);
        });
      });

      describe("when isSuperSub is true", () => {
        it("should return the Icon of Super Sub", () => {
          getSelectionTypeIcon.mockReturnValue(IconsList.SUPER_SUB_MONOCHROME);

          const mappedProps = setupMapStateToProps({
            id: "LEG:1",
            metadataBuilder: jest.fn(() => ({
              "RUNNER:1": {
                runnerUrn: "RUNNER:1",
                marketType: "FakeMarketType",
                isSuperSub: true,
              },
            })),
          });

          expect(getSelectionTypeIcon).toHaveBeenCalledTimes(1);
          expect(getSelectionTypeIcon).toHaveBeenCalledWith("FakeMarketType", true);
          expect(mappedProps.selectionTypeIcon).toEqual(IconsList.SUPER_SUB_MONOCHROME);
        });
      });
    });
  });

  describe("when mapping odd", () => {
    it("should return empty string", () => {
      const mappedProps = setupMapStateToProps({
        id: "LEG:1",
      });

      expect(mappedProps.odd).toEqual("");
    });
  });

  describe("mapDispatchToProps", () => {
    describe("dispatchSelectionRemove", () => {
      it("should dispatch a UI remove selection when dispatchSelectionRemove is called", () => {
        const dispatch = jest.fn();
        const { dispatchSelectionRemove } = mapDispatchToProps(dispatch);

        dispatchSelectionRemove("COMB:1", "RUNNER:1");

        expect(dispatch).toHaveBeenNthCalledWith(1, {
          type: UI__BETSLIP_SBK_REMOVE_LEG_CLICK,
          payload: { legId: "COMB:1", runnerUrn: "RUNNER:1" },
        });
        expect(dispatch).toHaveBeenCalledTimes(2);
      });

      it("should dispatch a betting remove selection action when dispatchSelectionRemove is called", () => {
        const dispatch = jest.fn();
        const { dispatchSelectionRemove } = mapDispatchToProps(dispatch);

        dispatchSelectionRemove("COMB:1", "RUNNER:1");

        expect(dispatch).toHaveBeenNthCalledWith(2, {
          type: BETTING__SBK_REMOVE_LEG_ACTION,
          payload: { legId: "COMB:1" },
        });
        expect(dispatch).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe("placeStatus", () => {
    describe("when there isn't placeStatus", () => {
      it("should send isPlacing as false", () => {
        const mappedProps = setupMapStateToProps(defaultPropsMock);

        expect(mappedProps.isPlacing).toEqual(false);
      });
    });

    describe("when there is placeStatus", () => {
      it("should send isPlacing as true", () => {
        const mappedProps = setupMapStateToProps({
          id: "LEG:1",
          betslipState: { placeStatus: "INPROGRESS" },
        });

        expect(mappedProps.isPlacing).toEqual(true);
      });
    });
  });
});
