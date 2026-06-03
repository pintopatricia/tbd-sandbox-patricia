import { render, act } from "@testing-library/react";
import { Alert, BetSelectionDetails, SelectionsBoardSection } from "@ppb/the-wall-web";
import "jest-dom/extend-expect";

import { ObbMultiple } from "./ObbMultiple.web";
import { SettlementConditionCard } from "./snowflakes/SettlementConditionCard/SettlementConditionCard.web";
import ConnectedObbBetControls from "../ObbBetControls";

jest.mock("@ppb/the-wall-web", () => ({
  BetSelectionDetails: jest.fn((props) => <bet-selection-details-mock>{props.silk}</bet-selection-details-mock>),
  SelectionsBoard: jest.fn(({ children }) => <selections-board-mock>{children}</selections-board-mock>),
  SelectionsBoardSection: jest.fn(({ children }) => (
    <selections-board-section-mock>{children}</selections-board-section-mock>
  )),
  Alert: jest.fn(({ children }) => <alert-mock>{children}</alert-mock>),
}));

jest.mock("../ObbBetControls", () => jest.fn(({ ...props }) => <connected-bet-controls-mock {...props} />));
jest.mock("../ObbBetControls/ObbBetControls.web", () => ({
  ObbBetControls: jest.fn(() => <obb-bet-controls-component-mock />),
}));

jest.mock("./snowflakes/SettlementConditionCard/SettlementConditionCard.web", () => ({
  SettlementConditionCard: jest.fn(() => <settlement-condition-card-mock />),
}));

function renderObbMultiple({
  i18n = {
    notCombinableMessage: "I18N.BETSLIP.NOT_COMBINABLE_SELECTIONS",
    notCombinableAlert: "I18N.BETSLIP.NOT_COMBINABLE",
    selectionsToWin: "I18N.BETSLIP.OBB.SELECTIONS_TO_WIN",
  },
  eventName = "eventName",
  selectionsTitle = "selectionsTitle",
  potentialBetIds = [{ id: "potentialBetId", x: 2 }],
  potentialBets = [{ id: "potentialBetId", x: 2 }],
  legs = [
    { legId: "legId", participantsDescription: "participantsDescription", outcomeDescription: "outcomeDescription" },
  ],
  dispatchRemoveSelectionAction = jest.fn(),
  shouldFocusStakeField = false,
  hasAvailabilityHints = false,
  hasNotCombinableFailure = false,
  activePotentialBetId = "potentialBetId",
  showSlider = false,
  shouldRenderSettlementCard = false,
  dispatchSliderInteraction = jest.fn(),
  dispatchStakeChange = jest.fn(),
  dispatchSliderDisplayed = jest.fn(),
}) {
  return render(
    <ObbMultiple
      i18n={i18n}
      selectionsTitle={selectionsTitle}
      potentialBetIds={potentialBetIds}
      potentialBets={potentialBets}
      legs={legs}
      eventName={eventName}
      dispatchRemoveSelectionAction={dispatchRemoveSelectionAction}
      shouldFocusStakeField={shouldFocusStakeField}
      hasAvailabilityHints={hasAvailabilityHints}
      hasNotCombinableFailure={hasNotCombinableFailure}
      activePotentialBetId={activePotentialBetId}
      showSlider={showSlider}
      shouldRenderSettlementCard={shouldRenderSettlementCard}
      dispatchSliderInteraction={dispatchSliderInteraction}
      dispatchStakeChange={dispatchStakeChange}
      dispatchSliderDisplayed={dispatchSliderDisplayed}
    />,
  );
}

describe("ObbMultiple", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    BetSelectionDetails.mockClear();
    SelectionsBoardSection.mockClear();
    Alert.mockClear();
  });

  describe("When there are no legs", () => {
    it("should not render the ObbMultiple component", () => {
      const { container } = renderObbMultiple({
        legs: [],
      });

      expect(container).toBeEmpty();
    });
  });

  describe("BetSelectionDetails", () => {
    describe("when hasNotCombinableFailure is true", () => {
      it("should call BetSelectionDetails per leg with proper values", () => {
        renderObbMultiple({
          eventName: "eventName",
          selectionsTitle: " 2 Selections",
          potentialBetIds: [{ id: "potentialBetId", x: 2 }],
          legs: [
            { legId: "legId1", participantsDescription: "participant1", outcomeDescription: "outcome1" },
            { legId: "legId2", participantsDescription: "participant2", outcomeDescription: "outcome2" },
          ],
          dispatchRemoveSelectionAction: jest.fn(),
          shouldFocusStakeField: false,
          hasAvailabilityHints: false,
          hasReturnsLabel: true,
          hasNotCombinableFailure: true,
        });

        expect(BetSelectionDetails).toHaveBeenCalledTimes(2);
        expect(BetSelectionDetails).toHaveBeenNthCalledWith(
          1,
          {
            onSelectionRemove: expect.any(Function),
            subtitle: "outcome1",
            title: "participant1",
            hintType: "WARNING",
            hintMessage: "I18N.BETSLIP.NOT_COMBINABLE_SELECTIONS",
          },
          undefined,
        );
        expect(BetSelectionDetails).toHaveBeenNthCalledWith(
          2,
          {
            onSelectionRemove: expect.any(Function),
            subtitle: "outcome2",
            title: "participant2",
            hintType: "WARNING",
            hintMessage: "I18N.BETSLIP.NOT_COMBINABLE_SELECTIONS",
          },
          undefined,
        );
      });
    });

    describe("when hasNotCombinableFailure is false", () => {
      it("should call BetSelectionDetails per leg with proper values", () => {
        renderObbMultiple({
          eventName: "eventName",
          selectionsTitle: " 2 Selections",
          potentialBetIds: [{ id: "potentialBetId", x: 2 }],
          legs: [
            { legId: "legId1", participantsDescription: "participant1", outcomeDescription: "outcome1" },
            { legId: "legId2", participantsDescription: "participant2", outcomeDescription: "outcome2" },
          ],
          dispatchRemoveSelectionAction: jest.fn(),
          shouldFocusStakeField: false,
          hasAvailabilityHints: false,
          hasNotCombinableFailure: false,
        });

        expect(BetSelectionDetails).toHaveBeenCalledTimes(2);
        expect(BetSelectionDetails).toHaveBeenNthCalledWith(
          1,
          {
            onSelectionRemove: expect.any(Function),
            subtitle: "outcome1",
            title: "participant1",
            hintMessage: undefined,
            hintType: undefined,
          },
          undefined,
        );
        expect(BetSelectionDetails).toHaveBeenNthCalledWith(
          2,
          {
            onSelectionRemove: expect.any(Function),
            subtitle: "outcome2",
            title: "participant2",
            hintMessage: undefined,
            hintType: undefined,
          },
          undefined,
        );
      });
    });
  });

  describe("SelectionsBoardSection", () => {
    it("should call SelectionsBoardSection with proper values", () => {
      renderObbMultiple({
        eventName: "eventName",
        hasNotCombinableFailure: false,
        legs: [{ legId: "legId", participantsDescription: "participant", outcomeDescription: "outcome" }],
      });

      expect(SelectionsBoardSection).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "eventName",
        }),
        undefined,
      );
    });
  });

  describe("Alert", () => {
    it("should call Alert with proper values when hasNotCombinableFailure is true", () => {
      renderObbMultiple({
        hasNotCombinableFailure: true,
        legs: [{ legId: "legId", participantsDescription: "participant", outcomeDescription: "outcome" }],
      });

      expect(Alert).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "WARNING",
          message: "I18N.BETSLIP.NOT_COMBINABLE",
        }),
        undefined,
      );
    });

    it("should not call Alert when hasNotCombinableFailure is false", () => {
      renderObbMultiple({ hasNotCombinableFailure: false });

      expect(Alert).not.toHaveBeenCalled();
    });
  });

  describe("when selection action is called", () => {
    it("should call dispatchRemoveSelectionAction callback with selection", () => {
      const dispatchRemoveSelectionAction = jest.fn();

      jest.clearAllMocks();
      BetSelectionDetails.mockClear();

      renderObbMultiple({
        dispatchRemoveSelectionAction,
        legs: [{ legId: "legId", participantsDescription: "participant", outcomeDescription: "outcome" }],
        potentialBetIds: [{ id: "potentialBetId", x: 2 }],
      });

      expect(BetSelectionDetails.mock.calls.length).toBeGreaterThan(0);
      BetSelectionDetails.mock.calls[0][0].onSelectionRemove();

      expect(dispatchRemoveSelectionAction).toHaveBeenCalledWith("legId");
      expect(dispatchRemoveSelectionAction).toHaveBeenCalledTimes(1);
    });
  });

  describe("SettlementConditionCard", () => {
    it("should render SettlementConditionCard when has multiple potential bets", () => {
      renderObbMultiple({
        potentialBets: [
          { id: "bet1", x: 2 },
          { id: "bet2", x: 3 },
        ],
        potentialBetIds: [
          { id: "bet1", x: 2 },
          { id: "bet2", x: 3 },
        ],
      });

      expect(SettlementConditionCard).toHaveBeenCalledWith(
        expect.objectContaining({
          potentialBets: [
            { id: "bet1", x: 2 },
            { id: "bet2", x: 3 },
          ],
          onChange: expect.any(Function),
        }),
        undefined,
      );
      expect(SettlementConditionCard).toHaveBeenCalledTimes(1);
    });

    it("should not render SettlementConditionCard when has only one potential bets", () => {
      renderObbMultiple({
        potentialBets: [{ id: "bet1", x: 2 }],
      });

      expect(SettlementConditionCard).not.toHaveBeenCalled();
    });
  });

  describe("handleSliderPositionChange callback", () => {
    const spySliderInteractionMock = jest.fn();

    beforeEach(() => {
      renderObbMultiple({
        potentialBetIds: [
          { id: "bet1", x: 2 },
          { id: "bet2", x: 3 },
          { id: "bet3", x: 4 },
        ],
        potentialBets: [
          { id: "potentialBet:2", x: 2 },
          { id: "potentialBet:3", x: 3 },
          { id: "potentialBet:4", x: 4 },
        ],
        dispatchSliderInteraction: spySliderInteractionMock,
      });
    });

    it("should render initial ObbBetControl", () => {
      expect(ConnectedObbBetControls).toHaveBeenLastCalledWith(
        expect.objectContaining({
          potentialBetId: "potentialBet:4",
        }),
        undefined,
      );
    });

    it("should not SliderInteraction be called before interaction", () => {
      expect(spySliderInteractionMock).not.toHaveBeenCalled();
    });

    describe("when SettlementConditionCard triggers a change", () => {
      it("renders ObbBetControl with updated potentialBetId", () => {
        act(() => {
          const { onChange } = SettlementConditionCard.mock.calls[0][0];
          onChange?.("potentialBet:2", "decrease", "button");
        });

        expect(ConnectedObbBetControls).toHaveBeenLastCalledWith(
          expect.objectContaining({
            potentialBetId: "potentialBet:2",
          }),
          undefined,
        );
      });

      it("dispatches slider interaction", () => {
        act(() => {
          const { onChange } = SettlementConditionCard.mock.calls[0][0];
          onChange?.("potentialBet:2", "increase", "button");
        });

        expect(spySliderInteractionMock).toHaveBeenCalledWith("eventName", "increase", "button");
      });

      it("should not dispatch slider interaction when direction is undefined", () => {
        act(() => {
          const { onChange } = SettlementConditionCard.mock.calls[0][0];
          onChange?.("potentialBet:2", undefined, "button");
        });

        expect(spySliderInteractionMock).not.toHaveBeenCalled();
      });

      it("should not dispatch slider interaction when source is undefined", () => {
        act(() => {
          const { onChange } = SettlementConditionCard.mock.calls[0][0];
          onChange?.("potentialBet:2", "increase", undefined);
        });

        expect(spySliderInteractionMock).not.toHaveBeenCalled();
      });
    });
  });

  describe("Slider Displayed event with useRef", () => {
    it("should dispatch slider displayed when potentialBets.length > 1", () => {
      const dispatchSliderDisplayed = jest.fn();

      renderObbMultiple({
        potentialBets: [
          { id: "bet1", x: 2 },
          { id: "bet2", x: 3 },
        ],
        dispatchSliderDisplayed,
        eventName: "Test Event",
      });

      expect(dispatchSliderDisplayed).toHaveBeenCalledWith("Test Event");
    });

    it("should dispatch slider displayed only once even with multiple renders", () => {
      const dispatchSliderDisplayed = jest.fn();

      renderObbMultiple({
        potentialBets: [
          { id: "bet1", x: 2 },
          { id: "bet2", x: 3 },
        ],
        dispatchSliderDisplayed,
        eventName: "Test Event",
        shouldRenderSettlementCard: true,
      });

      expect(dispatchSliderDisplayed).toHaveBeenCalledTimes(1);

      // Re-render same component by calling renderObbMultiple again with same props
      jest.clearAllMocks();
      renderObbMultiple({
        potentialBets: [
          { id: "bet1", x: 2 },
          { id: "bet2", x: 3 },
        ],
        dispatchSliderDisplayed,
        eventName: "Test Event",
        shouldRenderSettlementCard: true,
      });

      // The new instance should also trigger once
      expect(dispatchSliderDisplayed).toHaveBeenCalledTimes(1);
    });

    it("should not dispatch slider displayed when potentialBets.length <= 1", () => {
      const dispatchSliderDisplayed = jest.fn();

      renderObbMultiple({
        potentialBets: [{ id: "bet1", x: 1 }],
        dispatchSliderDisplayed,
      });

      expect(dispatchSliderDisplayed).not.toHaveBeenCalled();
    });

    it("should reset flag when potentialBets.length changes from > 1 to <= 1", () => {
      const dispatchSliderDisplayed = jest.fn();

      // First render with multiple bets
      renderObbMultiple({
        potentialBets: [
          { id: "bet1", x: 2 },
          { id: "bet2", x: 3 },
        ],
        dispatchSliderDisplayed,
        eventName: "Test Event",
        shouldRenderSettlementCard: true,
      });

      expect(dispatchSliderDisplayed).toHaveBeenCalledWith("Test Event");
      expect(dispatchSliderDisplayed).toHaveBeenCalledTimes(1);

      // Clear and render again with single bet (should reset flag)
      jest.clearAllMocks();
      renderObbMultiple({
        potentialBets: [{ id: "bet1", x: 1 }],
        dispatchSliderDisplayed,
        eventName: "Test Event",
        shouldRenderSettlementCard: false,
      });

      expect(dispatchSliderDisplayed).not.toHaveBeenCalled();
    });
  });
});
