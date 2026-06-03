import { useContext } from "react";
import { render, act } from "@testing-library/react";

import { BetslipCastBet } from "@ppb/the-wall-web";

import ConnectedBetControls from "../BetControls";
import { BetControls } from "../BetControls/BetControls.web";
import { CastBet } from "./CastBet.web";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn().mockReturnValue({
    setFocusedInputId: jest.fn(),
    setFocusedKeyboardControls: jest.fn(),
    isBetConfirmationStep: false,
  }),
}));

jest.mock("@ppb/the-wall-web", () => ({
  BetslipCastBet: jest.fn(() => <betslip-cast-bet-mock />),
  PebbleList: jest.fn(() => <pebble-list-mock />),
}));

jest.mock("../Keyboard/KeyboardContext", () => ({
  KeyboardContext: "KeyboardContext",
}));

jest.mock("../BetControls", () => jest.fn(() => <connected-bet-controls />));
jest.mock("../BetControls/BetControls.web", () => ({ BetControls: jest.fn(() => <bet-controls />) }));

function renderCastBet({
  id = "id",
  title = "title",
  selectedCastType = "selectedCastType",
  runnersOrder = ["runner"],
  castTypes = ["castType"],
  controls,
  isOrderable = true,
  isConfirmStep = false,
  shouldFocusStakeField = true,
  dispatchCastBetChange = jest.fn(),
  dispatchConfirmCastBetChange = jest.fn(),
  dispatchOrderChange = jest.fn(),
} = {}) {
  return render(
    <CastBet
      id={id}
      title={title}
      selectedCastType={selectedCastType}
      runnersOrder={runnersOrder}
      castTypes={castTypes}
      isConfirmStep={isConfirmStep}
      isOrderable={isOrderable}
      shouldFocusStakeField={shouldFocusStakeField}
      controls={controls}
      dispatchCastBetChange={dispatchCastBetChange}
      dispatchConfirmCastBetChange={dispatchConfirmCastBetChange}
      dispatchOrderChange={dispatchOrderChange}
    />,
  );
}

describe("ConnectedCastBet", () => {
  beforeEach(jest.clearAllMocks);

  describe("when I have all needed props", () => {
    it("should call CastBet", () => {
      renderCastBet();

      expect(BetslipCastBet).toHaveBeenCalledWith(
        {
          title: "title",
          runnersOrder: ["runner"],
          runners: expect.anything(),
          castTypes: expect.anything(),
          controls: expect.anything(),
          onRunnerOrderChange: expect.any(Function),
        },
        undefined,
      );
    });

    it("should call ConnectedBetControls", () => {
      renderCastBet({
        id: "id",
        title: "title",
        selectedCastType: "selectedCastType",
        runnersOrder: ["runner"],
        castTypes: ["castType"],
        shouldFocusStakeField: true,
      });
      render(BetslipCastBet.mock.calls[0][0].controls);

      expect(ConnectedBetControls).toHaveBeenCalledWith(
        {
          component: BetControls,
          combinationId: "selectedCastType",
          isDividend: true,
          shouldFocusStakeField: true,
          hasAvailabilityHints: true,
        },
        undefined,
      );
      expect(ConnectedBetControls).toHaveBeenCalledTimes(1);
    });

    describe("dispatchOrderChange", () => {
      it("should call provided callback with cast type, changed runner id and order", () => {
        const dispatchOrderChange = jest.fn();
        renderCastBet({ dispatchOrderChange });

        const [betControlsCall] = BetslipCastBet.mock.calls[0];
        act(() => {
          betControlsCall.onRunnerOrderChange("changedRunnerId", "order");
        });

        expect(dispatchOrderChange).toHaveBeenCalledWith("selectedCastType", "changedRunnerId", "order");
      });
    });

    describe("dispatchBetChange", () => {
      it("should call provided callback with cast type, changing bet type", () => {
        const dispatchCastBetChange = jest.fn();
        renderCastBet({ dispatchCastBetChange });

        const [betControlsCall] = BetslipCastBet.mock.calls[0];
        const pebbleList = betControlsCall.castTypes;
        act(() => {
          pebbleList.props.onPebbleClick("pebbleId");
        });

        expect(dispatchCastBetChange).toHaveBeenCalledWith("id", "pebbleId");
      });

      it("should call provided callback with cast type, changing bet type when is confirmation", () => {
        useContext.mockReturnValue({
          ...useContext.getMockImplementation()(),
          isBetConfirmationStep: true,
        });
        const dispatchConfirmCastBetChange = jest.fn();

        renderCastBet({ dispatchConfirmCastBetChange });

        const [betControlsCall] = BetslipCastBet.mock.calls[0];
        const pebbleList = betControlsCall.castTypes;
        act(() => {
          pebbleList.props.onPebbleClick("pebbleId");
        });

        expect(dispatchConfirmCastBetChange).toHaveBeenCalledWith("id", "pebbleId");
      });
    });
  });

  describe.each([
    ["id", ""],
    ["title", ""],
    ["selectedCastType", null],
    ["castTypes", null],
  ])("when there's no %s prop", (prop, value) => {
    it("should not call CastBet", () => {
      renderCastBet({ [prop]: value });

      expect(BetslipCastBet).not.toHaveBeenCalled();
    });
  });
});
