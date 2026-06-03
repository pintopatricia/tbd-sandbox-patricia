import { BET_TYPES } from "@ppb/betslip-core";
import { getBetslipCard } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";

import { translateMultiple } from "../connected-sportsbook-betslip-mapper";

import { makeMapStateToProps } from "./map-to-props-factory";

const getExperiment = jest.fn();

jest.mock("@ppb/tbd-store/state/entities/experiments/experiments-selectors", () => ({
  createGetExperimentSelector: jest.fn(() => getExperiment),
}));

jest.mock("@ppb/tbd-store/state/betslip/betslip-card-selectors", () => ({
  getBetslipCard: jest.fn(() => ({})),
}));
jest.mock("@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors", () => ({
  getSportsbookBettingCombinations: jest.fn(),
}));

const getMultiBetBuilder = jest.fn((combinations = {}) => combinations);
jest.mock("@ppb/tbd-store/helpers/sportsbook-betting", () => ({
  createGetMultiBetBuilderSelector: jest.fn(() => getMultiBetBuilder),
}));

const getThrottle = jest.fn();
jest.mock("@ppb/tbd-store/state/entities/throttles/throttles-selectors", () => ({
  createGetThrottleSelector: jest.fn(() => getThrottle),
}));

jest.mock("../../../helpers/i18n", () => ({
  i18n: jest.fn(({ key, interpolationValues }) => ({ key, interpolationValues })),
}));
jest.mock("../connected-sportsbook-betslip-mapper", () => ({
  translateMultiple: jest.fn(),
}));

const getIsConfirmStep = jest.fn(() => false);
jest.mock("../sportsbook-betslip-confirm-mapper", () => ({
  createIsConfirmStep: jest.fn(() => getIsConfirmStep),
}));

const eventGroupedLegsMock = { "event:urn:1": {} };
const getBettingEventGroupedLegs = jest.fn(() => eventGroupedLegsMock);
const getConfirmationEventGroupedLegs = jest.fn(() => eventGroupedLegsMock);
jest.mock("./multi-bet-builder-card-mapper", () => ({
  createGetBettingEventGroupedLegs: jest.fn(() => getBettingEventGroupedLegs),
  createGetConfirmationEventGroupedLegs: jest.fn(() => getConfirmationEventGroupedLegs),
}));

jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());

const setupMapStateToProps = ({
  appState = {
    entities: {},
  },
} = {}) => makeMapStateToProps()(appState);

describe("makeMapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("when there is no betslip card", () => {
    it("should return an empty object", () => {
      getBetslipCard.mockReturnValueOnce(null);
      expect(setupMapStateToProps()).toEqual({});
    });
  });

  describe("when there is no multi bet builder", () => {
    it("should return an empty object", () => {
      getMultiBetBuilder.mockReturnValueOnce(null);
      expect(setupMapStateToProps()).toEqual({});
    });
  });

  describe("when mapping title", () => {
    beforeEach(() => {
      translateMultiple.mockReturnValueOnce("Translated Multiple Title");
    });
    it("should return the output of translateMultiple", () => {
      const mappedProps = setupMapStateToProps();

      expect(mappedProps.title).toEqual("Translated Multiple Title");
    });

    it("should call translateMultiple with the betType", () => {
      getMultiBetBuilder.mockReturnValueOnce({ betType: BET_TYPES.DOUBLE });

      setupMapStateToProps();

      expect(translateMultiple).toHaveBeenCalledWith(BET_TYPES.DOUBLE);
    });
  });

  describe("when mapping groups", () => {
    it("should return the output of getBettingEventGroupedLegs", () => {
      const mappedProps = setupMapStateToProps();

      expect(mappedProps.groups).toEqual(eventGroupedLegsMock);
    });

    it("should call getBettingEventGroupedLegs with the legs of the multi bet builder combination", () => {
      getMultiBetBuilder.mockReturnValueOnce({ legs: ["LEG:1"] });
      setupMapStateToProps();

      expect(getBettingEventGroupedLegs).toHaveBeenCalledWith({ entities: {} }, ["LEG:1"]);
      expect(getBettingEventGroupedLegs).toHaveBeenCalledTimes(1);
    });

    describe("when the step is bet confirmation", () => {
      beforeEach(() => {
        getIsConfirmStep.mockReturnValueOnce(true);
        getMultiBetBuilder.mockReturnValueOnce({ legs: ["LEG:1"] });
      });

      it("should return the output of getConfirmationEventGroupedLegs", () => {
        const mappedProps = setupMapStateToProps();

        expect(mappedProps.groups).toEqual(eventGroupedLegsMock);
      });

      it("should call getConfirmationEventGroupedLegs with the legs of the multi bet builder combination", () => {
        setupMapStateToProps();

        expect(getConfirmationEventGroupedLegs).toHaveBeenCalledWith({ entities: {} }, ["LEG:1"]);
        expect(getConfirmationEventGroupedLegs).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("when mapping i18n", () => {
    it("should return the static labels", () => {
      const mappedProps = setupMapStateToProps();

      expect(mappedProps.i18n).toEqual({
        notification: {
          key: "I18N.BETSLIP.SBK.BET_BUILDER_MULTI_ONBOARD",
        },
      });
    });
  });

  describe("isNotificationVisible", () => {
    describe("when the throttle controls the notification visibility", () => {
      beforeEach(() => {
        getBetslipCard.mockReturnValueOnce({ isBetBuilderMultisNotificationVisible: true });
      });

      describe("when the throttle MULTI_BET_BUILDER_ONBOARDING is active", () => {
        it("should return true", () => {
          getThrottle.mockReturnValueOnce({ isActive: true });
          const mappedProps = setupMapStateToProps();

          expect(mappedProps.isNotificationVisible).toBe(true);
        });
      });

      describe("when the throttle MULTI_BET_BUILDER_ONBOARDING is not active", () => {
        it("should return false", () => {
          getThrottle.mockReturnValueOnce({ isActive: false });
          const mappedProps = setupMapStateToProps();

          expect(mappedProps.isNotificationVisible).toBe(false);
        });
      });

      describe("when the throttle does not exist", () => {
        it("should return false", () => {
          getThrottle.mockReturnValueOnce(null);
          const mappedProps = setupMapStateToProps();

          expect(mappedProps.isNotificationVisible).toBe(false);
        });
      });
    });

    describe("when the betslip closes the notification", () => {
      it("should return false", () => {
        getBetslipCard.mockReturnValueOnce({ isBetBuilderMultisNotificationVisible: false });
        const mappedProps = setupMapStateToProps();

        expect(mappedProps.isNotificationVisible).toBe(false);
      });
    });
  });
});
