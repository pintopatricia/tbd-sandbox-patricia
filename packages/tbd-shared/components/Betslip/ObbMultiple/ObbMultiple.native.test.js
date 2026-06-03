import { render, act } from "@testing-library/react-native";

import { SelectionsBoardTheme } from "@ppb/the-wall-common/types";
import { BetSelectionDetails, SelectionsBoard, SelectionsBoardSection, Alert } from "@ppb/the-wall-native";

import { ObbMultiple } from "./ObbMultiple.native";
import { SettlementConditionCard } from "./snowflakes/SettlementConditionCard/SettlementConditionCard.native";
import ConnectedObbBetControls from "../ObbBetControls";

jest.mock("../ObbBetControls", () => jest.fn(({ ...props }) => <connected-bet-controls-mock {...props} />));
jest.mock("../ObbBetControls/ObbBetControls.native", () => ({
  ObbBetControls: jest.fn(() => <obb-bet-controls-component-mock />),
}));

jest.mock("@ppb/the-wall-native", () => ({
  BetSelectionDetails: jest.fn(() => <bet-selections-details-mock />),
  SelectionsBoard: jest.fn(({ props, children }) => <selections-board {...props}>{children}</selections-board>),
  SelectionsBoardSection: jest.fn(({ children }) => (
    <selections-board-section-mock>{children}</selections-board-section-mock>
  )),
  Alert: jest.fn(({ children }) => <alert-mock>{children}</alert-mock>),
}));

jest.mock("./snowflakes/SettlementConditionCard/SettlementConditionCard.native", () => ({
  SettlementConditionCard: jest.fn(() => <settlement-condition-card-mock />),
}));

const defaultMock = {
  i18n: {
    notCombinableMessage: "I18N.BETSLIP.NOT_COMBINABLE_SELECTIONS",
    notCombinableAlert: "I18N.BETSLIP.NOT_COMBINABLE",
    selectionsToWin: "I18N.BETSLIP.OBB.SELECTIONS_TO_WIN",
  },
  eventName: "eventName",
  selectionsTitle: "2 Selections",
  potentialBetIds: [{ id: "potentialBetId", x: 2 }],
  potentialBets: [{ id: "potentialBetId", x: 2 }],
  legs: [
    { legId: "legId1", participantsDescription: "participant1", outcomeDescription: "outcome1" },
    { legId: "legId2", participantsDescription: "participant2", outcomeDescription: "outcome2" },
  ],
  shouldFocusStakeField: true,
  dispatchRemoveSelectionAction: jest.fn(),
  dispatchSliderInteraction: jest.fn(),
  dispatchStakeChange: jest.fn(),
  hasAvailabilityHints: false,
  hasNotCombinableFailure: false,
  activePotentialBetId: "potentialBetId",
  showSlider: false,
  shouldRenderSettlementCard: false,
};

function renderObbMultiple({
  i18n,
  eventName,
  selectionsTitle,
  potentialBetIds,
  potentialBets,
  legs,
  dispatchRemoveSelectionAction,
  shouldFocusStakeField,
  hasAvailabilityHints,
  hasNotCombinableFailure,
  activePotentialBetId,
  shouldRenderSettlementCard,
  dispatchSliderInteraction,
  dispatchStakeChange,
} = defaultMock) {
  return render(
    <ObbMultiple
      i18n={i18n}
      eventName={eventName}
      selectionsTitle={selectionsTitle}
      potentialBetIds={potentialBetIds}
      potentialBets={potentialBets}
      legs={legs}
      dispatchRemoveSelectionAction={dispatchRemoveSelectionAction}
      shouldFocusStakeField={shouldFocusStakeField}
      hasAvailabilityHints={hasAvailabilityHints}
      hasNotCombinableFailure={hasNotCombinableFailure}
      activePotentialBetId={activePotentialBetId}
      shouldRenderSettlementCard={shouldRenderSettlementCard}
      dispatchSliderInteraction={dispatchSliderInteraction}
      dispatchStakeChange={dispatchStakeChange}
    />,
  );
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe("ObbMultiple", () => {
  describe("When there are no legs", () => {
    it("should not render the ObbMultiple component", () => {
      const { root } = renderObbMultiple({
        ...defaultMock,
        legs: [],
      });

      expect(root).toBeUndefined();
    });
  });

  describe("SelectionsBoard", () => {
    it("should call SelectionsBoard with proper values", () => {
      renderObbMultiple();

      expect(SelectionsBoard).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "2 Selections",
          theme: SelectionsBoardTheme.Blue,
        }),
        undefined,
      );
      expect(SelectionsBoard).toHaveBeenCalledTimes(1);
    });
  });

  describe("SelectionsBoardSection", () => {
    it("should call SelectionsBoardSection with proper values", () => {
      renderObbMultiple();

      expect(SelectionsBoardSection).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "eventName",
        }),
        undefined,
      );
      expect(SelectionsBoardSection).toHaveBeenCalledTimes(1);
    });
  });

  describe("BetSelectionDetails", () => {
    describe("when hasNotCombinableFailure is true", () => {
      it("should call BetSelectionDetails with proper values", () => {
        renderObbMultiple({ ...defaultMock, hasNotCombinableFailure: true });

        expect(BetSelectionDetails).toHaveBeenCalledTimes(2);
        expect(BetSelectionDetails).toHaveBeenNthCalledWith(
          1,
          {
            onSelectionRemove: expect.any(Function),
            hintType: "WARNING",
            hintMessage: "I18N.BETSLIP.NOT_COMBINABLE_SELECTIONS",
            subtitle: "outcome1",
            title: "participant1",
          },
          undefined,
        );
        expect(BetSelectionDetails).toHaveBeenNthCalledWith(
          2,
          {
            onSelectionRemove: expect.any(Function),
            hintType: "WARNING",
            hintMessage: "I18N.BETSLIP.NOT_COMBINABLE_SELECTIONS",
            subtitle: "outcome2",
            title: "participant2",
          },
          undefined,
        );
      });
    });

    describe("when hasNotCombinableFailure is false", () => {
      it("should call BetSelectionDetails with proper values", () => {
        renderObbMultiple();

        expect(BetSelectionDetails).toHaveBeenCalledTimes(2);
        expect(BetSelectionDetails).toHaveBeenNthCalledWith(
          1,
          {
            onSelectionRemove: expect.any(Function),
            subtitle: "outcome1",
            title: "participant1",
          },
          undefined,
        );
        expect(BetSelectionDetails).toHaveBeenNthCalledWith(
          2,
          {
            onSelectionRemove: expect.any(Function),
            subtitle: "outcome2",
            title: "participant2",
          },
          undefined,
        );
      });
    });

    describe("when onSelectionRemove action is called", () => {
      it("should call dispatchRemoveSelectionAction callback with potentialBetId", () => {
        const dispatchRemoveSelectionAction = jest.fn();
        renderObbMultiple({ ...defaultMock, dispatchRemoveSelectionAction });

        BetSelectionDetails.mock.calls[0][0].onSelectionRemove();

        expect(dispatchRemoveSelectionAction).toHaveBeenCalledWith("legId1");
        expect(dispatchRemoveSelectionAction).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("Alert", () => {
    it("should call Alert with proper values when hasNotCombinableFailure is true", () => {
      renderObbMultiple({ ...defaultMock, hasNotCombinableFailure: true });

      expect(Alert).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "WARNING",
          message: "I18N.BETSLIP.NOT_COMBINABLE",
        }),
        undefined,
      );
      expect(Alert).toHaveBeenCalledTimes(1);
    });

    it("should not call Alert when hasNotCombinableFailure is false", () => {
      renderObbMultiple(defaultMock);

      expect(Alert).not.toHaveBeenCalled();
    });
  });

  describe("SettlementConditionCard", () => {
    it("should render SettlementConditionCard when has multiple potential bets", () => {
      renderObbMultiple({
        ...defaultMock,
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
        ...defaultMock,
        potentialBets: [{ id: "bet1", x: 2 }],
      });

      expect(SettlementConditionCard).not.toHaveBeenCalled();
    });
  });

  describe("handleSliderPositionChange callback", () => {
    const spySliderInteractionMock = jest.fn();

    beforeEach(() => {
      renderObbMultiple({
        ...defaultMock,
        potentialBetIds: [{ id: "bet1" }, { id: "bet2" }, { id: "bet3" }],
        potentialBets: [
          { id: "bet1", x: 2 },
          { id: "bet2", x: 3 },
          { id: "bet3", x: 4 },
        ],
        dispatchSliderInteraction: spySliderInteractionMock,
      });
    });

    it("should render initial ObbBetControl", () => {
      // Initial render should use the last potentialBetId
      expect(ConnectedObbBetControls).toHaveBeenLastCalledWith(
        expect.objectContaining({
          potentialBetId: "bet3",
        }),
        undefined,
      );
    });

    it("should not SliderInteraction be called before interaction", () => {
      expect(spySliderInteractionMock).not.toHaveBeenCalled();
    });

    describe("when SettlementConditionCard triggers a change", () => {
      it("renders ObbBetControl with updated potentialBetId", () => {
        // Call onChange with a new potentialBetId
        act(() => {
          const { onChange } = SettlementConditionCard.mock.calls[0][0];
          onChange("bet1", "increase", "button");
        });

        expect(ConnectedObbBetControls).toHaveBeenLastCalledWith(
          expect.objectContaining({
            potentialBetId: "bet1",
          }),
          undefined,
        );
      });

      it("dispatches slider interaction", () => {
        // Call onChange with a new potentialBetId
        act(() => {
          const { onChange } = SettlementConditionCard.mock.calls[0][0];
          onChange("bet1", "increase", "button");
        });
        expect(spySliderInteractionMock).toHaveBeenCalledWith("eventName", "increase", "button");
      });
    });

    it("should not dispatch slider interaction when direction is undefined", () => {
      // Call onChange with a new potentialBetId
      act(() => {
        const { onChange } = SettlementConditionCard.mock.calls[0][0];
        onChange("bet1", "increase", undefined);
      });
      expect(spySliderInteractionMock).not.toHaveBeenCalled();
    });

    it("should not dispatch slider interaction when direction is undefined", () => {
      // Call onChange with a new potentialBetId
      act(() => {
        const { onChange } = SettlementConditionCard.mock.calls[0][0];
        onChange("bet1", undefined, "button");
      });
      expect(spySliderInteractionMock).not.toHaveBeenCalled();
    });
  });
});
