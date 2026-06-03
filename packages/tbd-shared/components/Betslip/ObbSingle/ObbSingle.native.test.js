import { render } from "@testing-library/react-native";

import { BetDetailsAction, BetDetailsColor } from "@ppb/the-wall-common/types";
import { BetDetails } from "@ppb/the-wall-native";

import ConnectedObbBetControls from "../ObbBetControls";
import { ObbSingle } from "./ObbSingle.native";

jest.mock("../ObbBetControls", () => jest.fn(({ ...props }) => <connected-bet-controls-mock {...props} />));
jest.mock("../ObbBetControls/ObbBetControls.native", () => ({
  ObbBetControls: jest.fn(() => <obb-bet-controls-component-mock />),
}));
jest.mock("@ppb/the-wall-native", () => ({
  BetDetails: jest.fn(() => <bet-details-mock />),
}));

const defaultMock = {
  potentialBetId: "potentialBetId",
  legId: "legId",
  outcomeDescription: "outcome - eventName",
  participant: "participant",
  hasReturnsLabel: true,
  shouldFocusStakeField: true,
  dispatchRemoveSelectionAction: jest.fn(),
  hasAvailabilityHints: true,
  isPlacing: false,
};

function renderObbSingle({
  legId = "legId",
  participant = "participant",
  outcomeDescription = "outcome - eventName",
  potentialBetId = "potentialBetId",
  dispatchRemoveSelectionAction = jest.fn(),
  shouldFocusStakeField = false,
  hasReturnsLabel = true,
  hasAvailabilityHints,
  isPlacing,
} = defaultMock) {
  return render(
    <ObbSingle
      potentialBetId={potentialBetId}
      legId={legId}
      outcomeDescription={outcomeDescription}
      participant={participant}
      shouldFocusStakeField={shouldFocusStakeField}
      hasReturnsLabel={hasReturnsLabel}
      dispatchRemoveSelectionAction={dispatchRemoveSelectionAction}
      hasAvailabilityHints={hasAvailabilityHints}
      isPlacing={isPlacing}
    />,
  );
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe("ObbSingle", () => {
  describe("BetDetails", () => {
    it("should call BetDetails with proper values", () => {
      renderObbSingle();

      expect(BetDetails).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "participant",
          subtitle: "outcome - eventName",
          action: BetDetailsAction.Remove,
          onAction: expect.any(Function),
          color: BetDetailsColor.Teal,
          isPlacing: false,
        }),
        undefined,
      );
      expect(BetDetails).toHaveBeenCalledTimes(1);
    });

    describe("when the remove selection action is called", () => {
      it("should call dispatchRemoveSelectionAction callback with selection", () => {
        const dispatchRemoveSelectionAction = jest.fn();
        renderObbSingle({ ...defaultMock, dispatchRemoveSelectionAction });

        BetDetails.mock.calls[0][0].onAction();

        expect(dispatchRemoveSelectionAction).toHaveBeenCalledWith("legId");
        expect(dispatchRemoveSelectionAction).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("ConnectedObbBetControls", () => {
    it("should be called with the correct props", () => {
      renderObbSingle({
        legId: "legId",
        eventName: "eventName",
        aggregator: "aggregator",
        participant: "participant",
        outcome: "outcome",
      });

      expect(ConnectedObbBetControls).toHaveBeenCalledWith(
        {
          component: expect.any(Function),
          hasAvailabilityHints: undefined,
          hasReturnsLabel: true,
          potentialBetId: "potentialBetId",
          shouldFocusStakeField: false,
        },
        undefined,
      );
    });
  });
});
