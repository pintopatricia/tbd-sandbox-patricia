import { useContext } from "react";
import { render, act } from "@testing-library/react-native";

import { SelectionsBoardSection, Alert } from "@ppb/the-wall-native";
import { MultiBetBuilderCard } from "./MultiBetBuilderCard.native";
import { ConnectedSelectionMultiBetBuilder } from "../Selection";
import { Selection } from "../Selection/Selection.native";
import ConnectedBetControls from "../BetControls";
import { BetControls } from "../BetControls/BetControls.native";
import { ConnectedBetLegs } from "../BetLegs";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(() => ({
    isBetConfirmationStep: false,
  })),
}));

jest.mock("@ppb/the-wall-native", () => ({
  SelectionsBoard: jest.fn(({ children }) => <selections-board-mock>{children}</selections-board-mock>),
  SelectionsBoardSection: jest.fn(({ children }) => (
    <selections-board-section-mock>{children}</selections-board-section-mock>
  )),
  Alert: jest.fn(() => <notification-mock />),
}));

jest.mock("../BetControls", () => jest.fn(() => <connected-bet-controls-mock />));
jest.mock("../BetControls/BetControls.native", () => ({
  BetControls: jest.fn(() => <bet-controls-mock />),
}));
jest.mock("../Selection", () => ({
  ConnectedSelectionMultiBetBuilder: jest.fn(() => <connected-selection-mock />),
}));
jest.mock("../Selection/Selection.native", () => ({ Selection: jest.fn(() => <selection-mock />) }));

function renderMultiBetBuilderCard({
  groups = [],
  dispatchBetslipBetBuilderMultisDismissNotification = jest.fn(),
  id = "MULT:1",
  title = "Title",
  i18n = {
    notification: "notification",
  },
  isNotificationVisible = false,
  shouldFocusStakeField = false,
  betControlsExperimentVariant = "control",
} = {}) {
  return render(
    <MultiBetBuilderCard
      id={id}
      title={title}
      groups={groups}
      i18n={i18n}
      isNotificationVisible={isNotificationVisible}
      dispatchBetslipBetBuilderMultisDismissNotification={dispatchBetslipBetBuilderMultisDismissNotification}
      shouldFocusStakeField={shouldFocusStakeField}
      betControlsExperimentVariant={betControlsExperimentVariant}
    />,
  );
}

describe("MultiBetBuilderCard", () => {
  afterEach(jest.clearAllMocks);

  describe("when adding the selections board", () => {
    describe("when there is only one group", () => {
      it("should call SelectionsBoardSelection with title", () => {
        renderMultiBetBuilderCard({
          groups: { "event:urn": { urn: "event:urn", title: "Event 1", legIds: ["LEG:1"] } },
        });

        expect(SelectionsBoardSection).toHaveBeenCalledWith(expect.objectContaining({ title: "Event 1" }), undefined);
      });

      describe("when there is one selection in the group", () => {
        it("should call ConnectedSelectionMultiBetBuilder with the id", () => {
          renderMultiBetBuilderCard({
            groups: { "event:urn": { urn: "event:urn", title: "Event 1", legIds: ["LEG:1"] } },
          });

          expect(ConnectedSelectionMultiBetBuilder).toHaveBeenCalledWith(
            expect.objectContaining({ id: "LEG:1" }),
            undefined,
          );
        });

        it("should call ConnectedSelectionMultiBetBuilder with the Selection component", () => {
          renderMultiBetBuilderCard({
            groups: { "event:urn": { urn: "event:urn", title: "Event 1", legIds: ["LEG:1"] } },
          });

          expect(ConnectedSelectionMultiBetBuilder).toHaveBeenCalledWith(
            expect.objectContaining({ component: Selection }),
            undefined,
          );
        });

        it("should call ConnectedSelectionMultiBetBuilder with isReadOnly as false", () => {
          renderMultiBetBuilderCard({
            groups: { "event:urn": { urn: "event:urn", title: "Event 1", legIds: ["LEG:1"] } },
          });

          expect(ConnectedSelectionMultiBetBuilder).toHaveBeenCalledWith(
            expect.objectContaining({ isReadOnly: false }),
            undefined,
          );
        });
      });

      describe("when there is more than one selection in the group", () => {
        it("should call ConnectedSelectionMultiBetBuilder per selection", () => {
          renderMultiBetBuilderCard({
            groups: { "event:urn": { urn: "event:urn", title: "Event 1", legIds: ["LEG:1", "LEG:2"] } },
          });

          expect(ConnectedSelectionMultiBetBuilder).toHaveBeenCalledTimes(2);
        });
      });
    });

    describe("when there is more than one group", () => {
      it("should call SelectionsBoardSection per group", () => {
        renderMultiBetBuilderCard({
          groups: {
            "event:urn": { urn: "event:urn", title: "Event 1", legIds: ["LEG:1"] },
            "event:urn:2": { urn: "event:urn:2", title: "Event 1", legIds: ["LEG:1"] },
          },
        });

        expect(SelectionsBoardSection).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe("when adding bet controls", () => {
    it("should instantiate ConnectedBetControls with proper values", () => {
      renderMultiBetBuilderCard({ isStakeValid: true });

      expect(ConnectedBetControls).toHaveBeenCalledTimes(1);
      expect(ConnectedBetControls).toHaveBeenCalledWith(
        {
          combinationId: "MULT:1",
          component: BetControls,
          shouldFocusStakeField: false,
        },
        undefined,
      );
    });

    describe("when the on boarding message is not visible", () => {
      it("the notification should be null", () => {
        renderMultiBetBuilderCard({
          isNotificationVisible: false,
        });

        expect(Alert).not.toHaveBeenCalled();
      });
    });

    describe("when the on boarding message is visible and the notification is closed", () => {
      it("should call dispatchBetslipBetBuilderMultisDismissNotification", () => {
        const dispatchBetslipBetBuilderMultisDismissNotification = jest.fn();

        renderMultiBetBuilderCard({
          isNotificationVisible: true,
          dispatchBetslipBetBuilderMultisDismissNotification,
        });

        act(() => {
          Alert.mock.calls[0][0].onClose();
        });

        expect(dispatchBetslipBetBuilderMultisDismissNotification).toHaveBeenCalledWith();
        expect(dispatchBetslipBetBuilderMultisDismissNotification).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("when there are no id", () => {
    it("should not render", () => {
      const { root } = renderMultiBetBuilderCard({
        id: "",
      });

      expect(root).toBeUndefined();
    });
  });

  describe("when is bet confirmation step", () => {
    it("should render ConnectedSelectionMultiBetBuilder with isReadOnly as true", () => {
      useContext.mockReturnValueOnce({ isBetConfirmationStep: true });
      renderMultiBetBuilderCard({
        groups: { "event:urn": { urn: "event:urn", title: "Event 1", legIds: ["LEG:1"] } },
      });

      expect(ConnectedSelectionMultiBetBuilder).toHaveBeenCalledWith(
        {
          component: Selection,
          id: "LEG:1",
          isReadOnly: true,
        },
        undefined,
      );
      expect(ConnectedSelectionMultiBetBuilder).toHaveBeenCalledTimes(1);
    });
  });
  describe("betControlsExperimentVariant", () => {
    it("should render BetControls before SelectionsBoard when betControlsExperimentVariant is 'betslip-bet-controls-on-top'", () => {
      renderMultiBetBuilderCard({
        betControlsExperimentVariant: "betslip-bet-controls-on-top",
        groups: { "event:urn": { urn: "event:urn", title: "Event 1", legIds: ["LEG:1"] } },
      });
      const selectionBoard = ConnectedSelectionMultiBetBuilder.mock.invocationCallOrder[0];
      const betControlsCallOrder = ConnectedBetControls.mock.invocationCallOrder[0];

      expect(betControlsCallOrder).toBeLessThan(selectionBoard);
    });

    it("should render BetControls after SelectionsBoard when betControlsExperimentVariant is not 'betslip-bet-controls-on-top'", () => {
      renderMultiBetBuilderCard({
        groups: { "event:urn": { urn: "event:urn", title: "Event 1", legIds: ["LEG:1"] } },
      });
      const betControlsCallOrder = ConnectedBetControls.mock.invocationCallOrder[0];
      const selectionBoard = ConnectedSelectionMultiBetBuilder.mock.invocationCallOrder[0];

      expect(betControlsCallOrder).toBeGreaterThan(selectionBoard);
    });
  });
});
