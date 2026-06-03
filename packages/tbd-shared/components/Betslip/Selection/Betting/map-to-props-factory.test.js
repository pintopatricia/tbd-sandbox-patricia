import { formatOdds } from "@ppb/tbd-store/helpers/formatters";
import {
  createSportsbookBettingRunnerSelector,
  getBettingResolvers,
  getSportsbookBettingImplyRunnerFailures,
  getSportsbookBettingLegs,
} from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { getBetslipCard } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { createOddsMovementSelector } from "@ppb/tbd-store/state/betslip/betslip-odds-movement-selectors";
import {
  hasAnyInvalidCombinationFailure,
  hasAnyMarketClosedFailure,
  hasAnyMarketSuspendedFailure,
} from "@ppb/tbd-store/helpers/sportsbook-betting";
import { HintType } from "@ppb/the-wall-common/types";
import { IconsList } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

import { createGetThrottleSelector } from "@ppb/tbd-store";
import { buildSelection } from "../../connected-sportsbook-betslip-mapper";
import { getSelectionTypeIcon } from "../../../../helpers/selection-type";

import { makeMapStateToProps } from "./map-to-props-factory";

const getUserDetails = jest.fn();
const isBrandSettingEnabled = jest.fn();
const getThrottle = jest.fn();

jest.mock("@ppb/tbd-store/helpers/formatters");
jest.mock("@ppb/tbd-store/helpers/sportsbook-betting", () => ({
  hasAnyMarketClosedFailure: jest.fn().mockReturnValue(false),
  hasAnyMarketSuspendedFailure: jest.fn().mockReturnValue(false),
  hasAnyInvalidCombinationFailure: jest.fn().mockReturnValue(false),
}));
jest.mock("../../connected-sportsbook-betslip-mapper", () => ({
  buildSelection: jest.fn(() => ({
    title: "Title",
    subtitle: "Subtitle",
    icon: "silkUrl",
    silkFallbackType: "HORSE_RACING",
    meetingCountry: "UK",
  })),
}));

jest.mock("@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors", () => ({
  createUserPreferencesWithProductSwitcherSelector: jest.fn(() =>
    jest.fn().mockReturnValue({ sportsbookOddsDisplay: "decimal" }),
  ),
}));
jest.mock("@ppb/tbd-store/state/entities/entities-selectors");
jest.mock("@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors", () => ({
  createSportsbookBettingRunnerSelector: jest.fn(() => jest.fn().mockReturnValue({})),
  getSportsbookBettingImplyRunnerFailures: jest.fn().mockReturnValue({}),
  getSportsbookBettingLegs: jest.fn().mockReturnValue({ "LEG:1": { id: "LEG:1", runners: ["RUNNER:1"] } }),
  getBettingResolvers: jest.fn().mockReturnValue({ getMetadata: jest.fn() }),
}));
jest.mock("@ppb/tbd-store", () => ({
  createGetThrottleSelector: jest.fn(() => getThrottle),
  getThrottles: jest.fn(),
}));
jest.mock("@ppb/tbd-store/state/betslip/betslip-odds-movement-selectors", () => ({
  createOddsMovementSelector: jest.fn().mockReturnValue({ combinations: {} }),
}));
jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(() => getUserDetails),
}));

jest.mock("@ppb/tbd-store/state/entities/brand-settings/brand-settings-selectors", () => ({
  createIsBrandSettingEnabledSelector: jest.fn(() => isBrandSettingEnabled),
}));

jest.mock("@ppb/tbd-store/state/betslip/betslip-card-selectors", () => ({
  getBetslipGroup: jest.fn().mockReturnValue("REAL"),
  getBetslipCard: jest.fn().mockReturnValue({}),
}));

jest.mock("../../../../formatters/currency-formatters", () => ({
  currencyFormatWithDecimalPlaces: jest.fn().mockReturnValue("formatted value"),
  getCurrencySymbol: jest.fn().mockReturnValue("€"),
}));

jest.mock("../../../../helpers/i18n", () => ({
  i18n: jest.fn(({ key, interpolationValues }) => ({ key, interpolationValues })),
}));

jest.mock("../../../../helpers/selection-type", () => ({
  getSelectionTypeIcon: jest.fn().mockReturnValue(jest.fn()),
}));

const setupMapStateToProps = ({
  id,
  betslipState,
  appState = {
    betslip: { sportsbookOddsMovement: {} },
    betting: {
      sportsbookBetting: { runners: {} },
    },
    entities: { preferences: {} },
  },
  legs = { "LEG:1": { id: "LEG:1", runners: ["RUNNER:1"] } },
  oddsMovementBuilder = jest.fn(() => ({})),
  runnerBuilder = jest.fn(() => ({})),
  metadataBuilder = jest.fn(() => ({
    "RUNNER:1": {
      runnerUrn: "RUNNER:1",
    },
  })),
} = {}) => {
  formatOdds.mockReturnValue("formattedOdds");
  getSportsbookBettingLegs.mockReturnValue(legs);
  createOddsMovementSelector.mockReturnValue(oddsMovementBuilder);
  getBettingResolvers.mockReturnValue({
    getMetadata: metadataBuilder,
  });
  createGetThrottleSelector.mockReturnValue(getThrottle);
  createSportsbookBettingRunnerSelector.mockReturnValue(runnerBuilder);
  getUserDetails.mockReturnValue("userDetails");
  getBetslipCard.mockReturnValue(betslipState);

  return makeMapStateToProps()(appState, { id });
};

describe("makeMapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("when mapping urn", () => {
    it("should return the runnerUrn", () => {
      getSportsbookBettingLegs.mockReturnValue({ "LEG:1": { id: "LEG:1", runners: ["RUNNER:1"] } });
      const mappedProps = setupMapStateToProps({ id: "LEG:1" });

      expect(mappedProps.urn).toEqual("RUNNER:1");
    });
  });

  describe("when mapping id", () => {
    it("should call getSportsbookBettingLegs", () => {
      setupMapStateToProps({ id: "LEG:1" });

      expect(getSportsbookBettingLegs).toHaveBeenCalledWith({
        betslip: { sportsbookOddsMovement: {} },
        betting: { sportsbookBetting: { runners: {} } },
        entities: { preferences: {} },
      });
    });

    it("should return the id of the leg", () => {
      getSportsbookBettingLegs.mockReturnValue({ "LEG:1": { id: "LEG:1", runners: ["RUNNER:1"] } });
      const mappedProps = setupMapStateToProps({ id: "LEG:1" });

      expect(mappedProps.id).toEqual("LEG:1");
    });
  });

  describe("when mapping title, subtitle, icon, silkFallbackType and meetingCountry", () => {
    it("should call buildSelection", () => {
      setupMapStateToProps({ id: "LEG:1" });

      expect(buildSelection).toHaveBeenCalledWith({ runnerUrn: "RUNNER:1" }, "userDetails", {});
    });

    it("should return the correct title, subtitle, icon and silkFallbackType", () => {
      const mappedProps = setupMapStateToProps({ id: "LEG:1" });

      expect(mappedProps.title).toEqual("Title");
      expect(mappedProps.subtitle).toEqual("Subtitle");
      expect(mappedProps.icon).toEqual("silkUrl");
      expect(mappedProps.silkFallbackType).toEqual("HORSE_RACING");
      expect(mappedProps.meetingCountry).toEqual("UK");
    });
  });

  describe("when mapping oddsMovement", () => {
    describe("when there are odds movement for the leg", () => {
      it("should call createOddsMovementSelector", () => {
        setupMapStateToProps({ id: "LEG:1" });

        expect(createOddsMovementSelector).toHaveBeenCalled();
      });

      it("should call getOddsMovement", () => {
        const getOddsMovementSpy = jest.fn(() => ({}));
        setupMapStateToProps({ id: "LEG:1", oddsMovementBuilder: getOddsMovementSpy });

        expect(getOddsMovementSpy).toHaveBeenCalledWith({});
      });

      it("should return the respective movement", () => {
        const mappedProps = setupMapStateToProps({
          id: "LEG:1",
          legs: { "LEG:1": { id: "LEG:1", displayOdds: 3, odds: 3, runners: ["RUNNER:1"] } },
          oddsMovementBuilder: () => ({
            "LEG:1": {
              movement: "UP",
            },
          }),
        });

        expect(mappedProps.oddsMovement).toEqual("UP");
      });
    });

    describe("when there are no odds movement for the leg", () => {
      it("should return undefined", () => {
        const mappedProps = setupMapStateToProps({
          id: "LEG:1",
          legs: { "LEG:1": { id: "LEG:1", displayOdds: 3, runners: ["RUNNER:1"] } },
          oddsMovementBuilder: () => ({}),
        });

        expect(mappedProps.oddsMovement).toEqual(undefined);
      });
    });

    describe("when there is no displayOdds", () => {
      it("should return undefined", () => {
        const mappedProps = setupMapStateToProps({
          id: "LEG:1",
        });

        expect(mappedProps.oddsMovement).toEqual(undefined);
      });
    });
  });

  describe("when mapping odd", () => {
    describe("when there are odds for the leg", () => {
      it("should call formatOdds with the odds and preference", () => {
        setupMapStateToProps({
          id: "LEG:1",
          legs: { "LEG:1": { id: "LEG:1", displayOdds: 3, odds: 3, runners: ["RUNNER:1"] } },
        });

        expect(formatOdds).toHaveBeenCalledWith(3, "decimal");
      });

      it("should return the leg formatted odds", () => {
        const mappedProps = setupMapStateToProps({
          id: "LEG:1",
          legs: { "LEG:1": { id: "LEG:1", displayOdds: 3, odds: 3, runners: ["RUNNER:1"] } },
        });

        expect(mappedProps.odd).toEqual("formattedOdds");
      });

      describe("but is boosted", () => {
        it("should return undefined", () => {
          const mappedProps = setupMapStateToProps({
            id: "LEG:1",
            legs: { "LEG:1": { id: "LEG:1", displayOdds: 3, odds: 3, runners: ["RUNNER:1"], isBoosted: true } },
          });

          expect(mappedProps.odd).toBeUndefined();
        });
      });
    });

    describe("when there are no odds for the leg", () => {
      it("should return I18N.BETSLIP.STARTING_PRICE", () => {
        const mappedProps = setupMapStateToProps({
          id: "LEG:1",
        });

        expect(mappedProps.odd).toEqual({ key: "I18N.BETSLIP.STARTING_PRICE" });
      });
    });
  });

  describe("when mapping hints", () => {
    describe("when there is a closed market", () => {
      it("should call hasAnyMarketClosedFailure", () => {
        getSportsbookBettingImplyRunnerFailures.mockReturnValue({ "RUNNER:1": ["CLOSED_FAILURE"] });
        setupMapStateToProps({
          id: "LEG:1",
        });

        expect(hasAnyMarketClosedFailure).toHaveBeenCalledWith(["CLOSED_FAILURE"]);
      });

      it("should return hintMessage I18N.MARKET.CLOSED", () => {
        hasAnyMarketClosedFailure.mockReturnValue(true);
        const mappedProps = setupMapStateToProps({
          id: "LEG:1",
        });

        expect(mappedProps.hintMessage).toEqual({ key: "I18N.MARKET.CLOSED" });
      });

      it("should return hintType Warning", () => {
        hasAnyMarketClosedFailure.mockReturnValue(true);
        const mappedProps = setupMapStateToProps({
          id: "LEG:1",
        });

        expect(mappedProps.hintType).toEqual(HintType.Warning);
      });
    });

    describe("when there is a suspended market", () => {
      it("should call hasAnyMarketSuspendedFailure", () => {
        hasAnyMarketClosedFailure.mockReturnValue(false);
        hasAnyMarketSuspendedFailure.mockReturnValue(true);
        getSportsbookBettingImplyRunnerFailures.mockReturnValue({ "RUNNER:1": ["SUSPENDED_FAILURE"] });
        setupMapStateToProps({
          id: "LEG:1",
        });

        expect(hasAnyMarketSuspendedFailure).toHaveBeenCalledWith(["SUSPENDED_FAILURE"]);
      });

      it("should return hintMessage I18N.MARKET.SUSPENDED", () => {
        hasAnyMarketClosedFailure.mockReturnValue(false);
        hasAnyMarketSuspendedFailure.mockReturnValue(true);

        const mappedProps = setupMapStateToProps({
          id: "LEG:1",
        });

        expect(mappedProps.hintMessage).toEqual({ key: "I18N.MARKET.SUSPENDED" });
      });

      it("should return hintType Warning", () => {
        hasAnyMarketClosedFailure.mockReturnValue(false);
        hasAnyMarketSuspendedFailure.mockReturnValue(true);

        const mappedProps = setupMapStateToProps({
          id: "LEG:1",
        });

        expect(mappedProps.hintType).toEqual(HintType.Warning);
      });
    });

    describe("when there is an invalid combination", () => {
      it("should call hasAnyInvalidCombinationFailure", () => {
        hasAnyMarketClosedFailure.mockReturnValue(false);
        hasAnyMarketSuspendedFailure.mockReturnValue(false);
        hasAnyInvalidCombinationFailure.mockReturnValue(true);
        getSportsbookBettingImplyRunnerFailures.mockReturnValue({ "RUNNER:1": ["NOT_COMBINABLE_SELECTIONS_FAILURE"] });
        setupMapStateToProps({
          id: "LEG:1",
        });

        expect(hasAnyInvalidCombinationFailure).toHaveBeenCalledWith(["NOT_COMBINABLE_SELECTIONS_FAILURE"]);
      });

      it("should return hintMessage I18N.BETSLIP.NOT_COMBINABLE_SELECTIONS", () => {
        hasAnyMarketClosedFailure.mockReturnValue(false);
        hasAnyMarketSuspendedFailure.mockReturnValue(false);
        hasAnyInvalidCombinationFailure.mockReturnValue(true);

        const mappedProps = setupMapStateToProps({
          id: "LEG:1",
        });

        expect(mappedProps.hintMessage).toEqual({ key: "I18N.BETSLIP.NOT_COMBINABLE_SELECTIONS" });
      });

      it("should return hintType Warning", () => {
        hasAnyMarketClosedFailure.mockReturnValue(false);
        hasAnyMarketSuspendedFailure.mockReturnValue(false);
        hasAnyInvalidCombinationFailure.mockReturnValue(true);

        const mappedProps = setupMapStateToProps({
          id: "LEG:1",
        });

        expect(mappedProps.hintType).toEqual(HintType.Warning);
      });
    });

    describe("when there are several failures", () => {
      it("should return hintMessage the first prioritized message", () => {
        hasAnyMarketClosedFailure.mockReturnValue(true);
        hasAnyMarketSuspendedFailure.mockReturnValue(false);
        hasAnyInvalidCombinationFailure.mockReturnValue(true);

        const mappedProps = setupMapStateToProps({
          id: "LEG:1",
        });

        expect(mappedProps.hintMessage).toEqual({ key: "I18N.MARKET.CLOSED" });
      });

      it("should return hintType Warning", () => {
        hasAnyMarketClosedFailure.mockReturnValue(true);
        hasAnyMarketSuspendedFailure.mockReturnValue(false);
        hasAnyInvalidCombinationFailure.mockReturnValue(true);

        const mappedProps = setupMapStateToProps({
          id: "LEG:1",
        });

        expect(mappedProps.hintType).toEqual(HintType.Warning);
      });
    });
  });

  describe("when mapping is90Min", () => {
    describe("when market type is 90 Min", () => {
      it("should return true", () => {
        hasAnyMarketClosedFailure.mockReturnValue(true);

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
      it("should return undefined", () => {
        hasAnyMarketClosedFailure.mockReturnValue(true);

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
    describe("when isBrandSettingEnabled return false", () => {
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

        expect(mappedProps.selectionTypeIcon).toEqual(undefined);
      });
    });

    describe("when isBrandSettingEnabled returns true", () => {
      beforeEach(() => {
        isBrandSettingEnabled.mockReturnValue(true);
        hasAnyMarketClosedFailure.mockReturnValue(true);
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
                marketType: "FakeMarketType",
              },
            })),
          });

          expect(getSelectionTypeIcon).toHaveBeenCalledTimes(1);
          expect(mappedProps.selectionTypeIcon).toEqual(undefined);
        });
      });

      describe("when isSuperSub returns true", () => {
        it("should return the icon value of Super Sub", () => {
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

  describe("placeStatus", () => {
    describe("when there isn't placeStatus", () => {
      it("should send isPlacing as false", () => {
        const mappedProps = setupMapStateToProps({ id: "LEG:1" });

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
