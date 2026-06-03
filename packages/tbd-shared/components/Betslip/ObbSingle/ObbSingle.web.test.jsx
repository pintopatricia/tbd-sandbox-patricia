import { render } from "@testing-library/react";
import { BetDetails } from "@ppb/the-wall-web";
import "jest-dom/extend-expect";

import { ObbSingle } from "./ObbSingle.web";
import ConnectedObbBetControls from "../ObbBetControls";

jest.mock("@ppb/the-wall-web", () => ({
  BetDetails: jest.fn(() => <bet-details-mock />),
}));

jest.mock("../ObbBetControls", () => jest.fn(({ ...props }) => <connected-bet-controls-mock {...props} />));
jest.mock("../ObbBetControls/ObbBetControls.web", () => ({
  ObbBetControls: jest.fn().mockReturnValue(<obb-bet-controls-component-mock />),
}));

function renderObbSingle({
  legId = "legId",
  outcomeDescription = "outcome - eventName",
  participant = "participant",
  potentialBetId = "potentialBetId",
  dispatchRemoveSelectionAction = jest.fn(),
  shouldFocusStakeField = false,
  hasReturnsLabel = true,
  hasAvailabilityHints = true,
  isPlacing = false,
}) {
  return render(
    <ObbSingle
      legId={legId}
      outcomeDescription={outcomeDescription}
      participant={participant}
      dispatchRemoveSelectionAction={dispatchRemoveSelectionAction}
      shouldFocusStakeField={shouldFocusStakeField}
      potentialBetId={potentialBetId}
      hasReturnsLabel={hasReturnsLabel}
      hasAvailabilityHints={hasAvailabilityHints}
      isPlacing={isPlacing}
    />,
  );
}

describe("ObbSingle", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("should call BetDetails with aggregator", () => {
    it("should call ConnectedSingle per id", () => {
      renderObbSingle({
        legId: "legId",
        outcomeDescription: "outcome - eventName",
        participant: "participant",
      });

      expect(BetDetails).toHaveBeenCalledWith(
        {
          title: "participant",
          subtitle: "outcome - eventName",
          onAction: expect.any(Function),
          isPlacing: false,
          displayAllSubtitleText: true,
          color: "teal",
          action: "Remove",
        },
        undefined,
      );
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
          hasAvailabilityHints: true,
          hasReturnsLabel: true,
          potentialBetId: "potentialBetId",
          shouldFocusStakeField: false,
        },
        undefined,
      );
    });
  });

  describe("when remove selection action is called", () => {
    it("should call dispatchRemoveSelectionAction callback with selection", () => {
      const dispatchRemoveSelectionAction = jest.fn();
      renderObbSingle({
        dispatchRemoveSelectionAction,
      });

      BetDetails.mock.calls[0][0].onAction();

      expect(dispatchRemoveSelectionAction).toHaveBeenCalledWith("legId");
      expect(dispatchRemoveSelectionAction).toHaveBeenCalledTimes(1);
    });
  });
});
