import { useContext } from "react";
import { Keyboard } from "react-native";
import { act, render } from "@testing-library/react-native";

import { CastBet as BetslipCastBet, PebbleList } from "@ppb/the-wall-native";

import ConnectedBetControls from "../BetControls";
import { BetControls } from "../BetControls/BetControls.native";
import { CastBet } from "./CastBet.native";

jest.spyOn(Keyboard, "dismiss");

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn().mockReturnValue({
    setFocusedInputId: jest.fn(),
    setFocusedKeyboardControls: jest.fn(),
    isBetConfirmationStep: false,
  }),
}));

jest.mock("@ppb/the-wall-native", () => ({
  CastBet: jest.fn(() => <cast-bet-mock />),
  PebbleList: jest.fn(() => <pebble-list-mock />),
}));

jest.mock("../BetControls", () => jest.fn(() => <connected-bet-controls />));
jest.mock("../BetControls/BetControls.native", () => ({
  BetControls: jest.fn(() => <bet-controls />),
}));

function renderCastBet({
  id = "someId",
  title = "someTitle",
  selectedCastType = "someCastType",
  runnersOrder = [],
  castTypes = [],
  controls,
  isOrderable = true,
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
      controls={controls}
      isOrderable={isOrderable}
      shouldFocusStakeField={shouldFocusStakeField}
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
      renderCastBet({
        id: "id",
        title: "title",
        selectedCastType: "selectedCastType",
        runnersOrder: ["runner"],
        castTypes: ["castType"],
        shouldFocusStakeField: true,
      });

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

    describe("when a pebble is clicked", () => {
      it("should dismiss native Keyboard", () => {
        renderCastBet({
          id: "id",
        });

        render(BetslipCastBet.mock.calls[0][0].castTypes);

        PebbleList.mock.calls[0][0].onPebblePress("id2");

        expect(Keyboard.dismiss).toHaveBeenCalled();
      });
    });
  });

  describe("dispatchBetChange", () => {
    it("should call provided callback with cast type, changing bet type", () => {
      const dispatchCastBetChange = jest.fn();
      renderCastBet({ dispatchCastBetChange });

      const [betControlsCall] = BetslipCastBet.mock.calls[0];
      const pebbleList = betControlsCall.castTypes;

      act(() => {
        pebbleList.props.onPebblePress("pebbleId");
      });

      expect(dispatchCastBetChange).toHaveBeenCalledWith("someId", "pebbleId");
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
        pebbleList.props.onPebblePress("pebbleId");
      });

      expect(dispatchConfirmCastBetChange).toHaveBeenCalledWith("someId", "pebbleId");
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
