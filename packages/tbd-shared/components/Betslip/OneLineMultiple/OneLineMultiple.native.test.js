import { useContext } from "react";
import { render } from "@testing-library/react-native";

import { Alerts } from "@ppb/the-wall-native";
import { BET_TYPES } from "@ppb/betslip-core";
import { OneLineMultiple } from "./OneLineMultiple.native";
import ConnectedBetControls from "../BetControls";
import { BetControls } from "../BetControls/BetControls.native";
import { ConnectedBetLegs } from "../BetLegs";
import { BetLegs } from "../BetLegs/BetLegs.native";
import { ConnectedSelection } from "../Selection";
import { Selection } from "../Selection/Selection.native";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(() => ({
    isBetConfirmationStep: jest.fn(),
  })),
}));

jest.mock("@ppb/the-wall-native", () => ({
  Alerts: jest.fn(() => <notificataions-mock />),
}));

jest.mock("../BetControls", () => jest.fn(() => <connected-bet-legs-mock />));
jest.mock("../BetControls/BetControls.native", () => ({
  BetControls: jest.fn(() => <bet-legs-mock />),
}));
jest.mock("../BetLegs", () => ({ ConnectedBetLegs: jest.fn(() => <connected-bet-legs-mock />) }));
jest.mock("../BetLegs/BetLegs.native", () => ({ BetLegs: jest.fn(() => <bet-legs-mock />) }));
jest.mock("../Selection", () => ({
  ConnectedSelection: jest.fn(() => <connected-selection-mock />),
}));
jest.mock("../Selection/Selection.native", () => ({ Selection: jest.fn(() => <selection-mock />) }));

function renderOneLineMultiple({
  multiplesNotifications = [],
  currentMultiple = {
    id: "C:2",
    betType: BET_TYPES.DOUBLE,
    numLines: 3,
    potentialReturns: 3,
    legs: ["LEG:2"],
  },
  shouldFocusStakeField = false,
  betControlsExperimentVariant = "control",
} = {}) {
  useContext.mockReturnValue({ isBetConfirmationStep: false });

  return render(
    <OneLineMultiple
      multiplesNotifications={multiplesNotifications}
      currentMultiple={currentMultiple}
      shouldFocusStakeField={shouldFocusStakeField}
      betControlsExperimentVariant={betControlsExperimentVariant}
    />,
  );
}

describe("OneLineMultiple", () => {
  afterEach(jest.clearAllMocks);

  describe("Multiples Alerts", () => {
    it("should instantiate Alerts with proper values", () => {
      renderOneLineMultiple({ multiplesNotifications: [{ notification: "Notification" }] });

      expect(Alerts).toHaveBeenCalledWith({ alerts: [{ notification: "Notification" }] }, undefined);
      expect(Alerts).toHaveBeenCalledTimes(1);
    });
  });

  describe("BetLegs", () => {
    it("should call ConnectedBetLegs with proper values", () => {
      renderOneLineMultiple();

      expect(ConnectedBetLegs).toHaveBeenCalledWith(
        {
          component: BetLegs,
          hasIcon: true,
          renderLeg: expect.any(Function),
        },
        undefined,
      );
    });

    describe("renderLeg", () => {
      it("should render ConnectedSelection", () => {
        renderOneLineMultiple();
        render(ConnectedBetLegs.mock.calls[0][0].renderLeg("leg:1"));

        expect(ConnectedSelection).toHaveBeenCalledWith(
          { component: Selection, id: "leg:1", isReadOnly: false },
          undefined,
        );
        expect(ConnectedSelection).toHaveBeenCalledTimes(1);
      });

      describe("and step is confirm potential", () => {
        it("should render ConnectedSelection with isReadOnly settled as true", () => {
          useContext.mockReturnValueOnce({ isBetConfirmationStep: true });
          renderOneLineMultiple();
          render(ConnectedBetLegs.mock.calls[0][0].renderLeg("leg:1"));

          expect(ConnectedSelection).toHaveBeenCalledWith(
            {
              component: Selection,
              id: "leg:1",
              isReadOnly: true,
            },
            undefined,
          );
          expect(ConnectedSelection).toHaveBeenCalledTimes(1);
        });
      });
    });
  });

  describe("BetControls", () => {
    it("should instantiate BetControls with proper values", () => {
      renderOneLineMultiple({ isStakeValid: true });

      expect(ConnectedBetControls).toHaveBeenCalledTimes(1);
      expect(ConnectedBetControls).toHaveBeenCalledWith(
        {
          component: BetControls,
          combinationId: "C:2",
          shouldFocusStakeField: false,
        },
        undefined,
      );
    });
  });
  describe("betControlsExperimentVariant", () => {
    it("should render BetControls before BetLegs when betControlsExperimentVariant is 'betslip-bet-controls-on-top'", () => {
      renderOneLineMultiple({ betControlsExperimentVariant: "betslip-bet-controls-on-top" });

      const betLegsCallOrder = ConnectedBetLegs.mock.invocationCallOrder[0];
      const betControlsCallOrder = ConnectedBetControls.mock.invocationCallOrder[0];

      expect(betControlsCallOrder).toBeLessThan(betLegsCallOrder);
    });

    it("should render BetControls after BetLegs when betControlsExperimentVariant is not 'betslip-bet-controls-on-top'", () => {
      renderOneLineMultiple();

      const betControlsCallOrder = ConnectedBetControls.mock.invocationCallOrder[0];
      const betLegsCallOrder = ConnectedBetLegs.mock.invocationCallOrder[0];

      expect(betControlsCallOrder).toBeGreaterThan(betLegsCallOrder);
    });
  });
});
