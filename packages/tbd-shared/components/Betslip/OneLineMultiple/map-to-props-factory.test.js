import { BET_TYPES } from "@ppb/betslip-core";
import { createMultiplesNotificationsSelector } from "../connected-sportsbook-betslip-mapper";
import { createGetCurrentMultiple } from "../SportsbookPlace/sportsbook-place-mapper";
import { makeMapStateToProps } from "./map-to-props-factory";
import { createGetConfirmationOneLineMultiple, createIsConfirmStep } from "../sportsbook-betslip-confirm-mapper";

const getExperiment = jest.fn();

jest.mock("@ppb/tbd-store/state/betslip/betslip-card-selectors", () => ({
  getBetslipCard: jest.fn().mockReturnValue({}),
}));

jest.mock("../connected-sportsbook-betslip-mapper", () => ({
  createMultiplesNotificationsSelector: jest.fn().mockReturnValue(jest.fn()),
  translateMultiple: jest.fn().mockReturnValue("Translated Multiple Title"),
}));

jest.mock("@ppb/tbd-store/state/entities/experiments/experiments-selectors", () => ({
  createGetExperimentSelector: jest.fn(() => getExperiment),
}));

jest.mock("../SportsbookPlace/sportsbook-place-mapper", () => ({
  createGetCurrentMultiple: jest.fn().mockReturnValue(jest.fn()),
}));

jest.mock("../sportsbook-betslip-confirm-mapper", () => ({
  createGetConfirmationOneLineMultiple: jest.fn().mockReturnValue(jest.fn()),
  createIsConfirmStep: jest.fn().mockReturnValue(jest.fn()),
}));

jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());

const stateMock = {
  betslip: {
    sportsbookOddsMovement: {},
  },
  entities: {
    throttles: {},
    experiments: {},
  },
};

const currentMultipleMock = {
  id: "C:2",
  betType: BET_TYPES.DOUBLE,
  numLines: 3,
  potentialReturns: 3,
  legs: ["LEG:2"],
};

const multipleMock = {
  id: "C:2",
  text: "Translated Multiple Title",
};

const setupMapStateToProps = ({
  appState = stateMock,
  hasOneLineMultiple = true,
  currentMultipleBuilder = jest.fn(() => []),
  confirmOneLineMultipleBuilder = jest.fn(() => []),
  isConfirmStep = jest.fn(() => false),
  multiplesNotificationsBuilder = jest.fn(() => []),
} = {}) => {
  createGetCurrentMultiple.mockReturnValue(currentMultipleBuilder);
  createGetConfirmationOneLineMultiple.mockReturnValue(confirmOneLineMultipleBuilder);
  createIsConfirmStep.mockReturnValue(isConfirmStep);
  createMultiplesNotificationsSelector.mockReturnValue(multiplesNotificationsBuilder);

  return makeMapStateToProps()(appState, { hasOneLineMultiple });
};

describe("makeMapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("when mapping multiplesNotifications", () => {
    it("should call createMultiplesNotificationsSelector", () => {
      setupMapStateToProps();

      expect(createMultiplesNotificationsSelector).toHaveBeenCalled();
    });

    it("should call buildMultiplesNotifications with the app state", () => {
      const buildMultiplesNotificationsSpy = jest.fn().mockReturnValue([]);
      const appState = {
        entities: {
          experiments: "betslip-bet-controls-order",
        },
      };

      setupMapStateToProps({ appState, multiplesNotificationsBuilder: buildMultiplesNotificationsSpy });

      expect(buildMultiplesNotificationsSpy).toHaveBeenCalledWith(appState);
    });

    it("should return the built multiples", () => {
      const buildMultiplesNotificationsSpy = jest.fn().mockReturnValue([{ notification: "notification" }]);
      const mappedProps = setupMapStateToProps({ multiplesNotificationsBuilder: buildMultiplesNotificationsSpy });

      expect(mappedProps.multiplesNotifications).toEqual([{ notification: "notification" }]);
    });
  });

  describe("when mapping current multiple", () => {
    it("should call createGetCurrentMultiple", () => {
      setupMapStateToProps();

      expect(createGetCurrentMultiple).toHaveBeenCalled();
    });

    it("should call getCurrentMultiple with the app state", () => {
      const getCurrentMultipleSpy = jest.fn().mockReturnValue([]);
      const appState = {
        entities: {
          experiments: "betslip-bet-controls-order",
        },
      };

      setupMapStateToProps({ appState, currentMultipleBuilder: getCurrentMultipleSpy });

      expect(getCurrentMultipleSpy).toHaveBeenCalledWith(appState);
    });

    it("should return the current multiple", () => {
      const getCurrentMultipleSpy = jest.fn().mockReturnValue(currentMultipleMock);
      const mappedProps = setupMapStateToProps({ currentMultipleBuilder: getCurrentMultipleSpy });

      expect(mappedProps.currentMultiple).toEqual({ id: "C:2", text: "Translated Multiple Title" });
    });

    describe("and step is confirm potential", () => {
      it("should call createGetConfirmationOneLineMultiple", () => {
        setupMapStateToProps({
          isConfirmStep: jest.fn().mockReturnValue(true),
        });

        expect(createGetConfirmationOneLineMultiple).toHaveBeenCalled();
      });

      describe("getConfirmMultiple", () => {
        it("should call getConfirmMultiple", () => {
          const getConfirmMultipleSpy = jest.fn().mockReturnValueOnce(currentMultipleMock);
          const { currentMultiple } = setupMapStateToProps({
            isConfirmStep: jest.fn().mockReturnValue(true),
            confirmOneLineMultipleBuilder: getConfirmMultipleSpy,
          });

          expect(getConfirmMultipleSpy).toHaveBeenCalledTimes(1);
          expect(getConfirmMultipleSpy).toHaveBeenCalledWith(stateMock);
          expect(currentMultiple).toEqual(multipleMock);
        });

        describe("and there is not a multiple", () => {
          it("should call getConfirmMultiple", () => {
            const getConfirmMultipleSpy = jest.fn();
            const { currentMultiple } = setupMapStateToProps({
              isConfirmStep: jest.fn().mockReturnValue(true),
              confirmOneLineMultipleBuilder: getConfirmMultipleSpy,
              hasOneLineMultiple: false,
            });

            expect(currentMultiple).toBeUndefined();
          });
        });
      });
    });
  });
});
