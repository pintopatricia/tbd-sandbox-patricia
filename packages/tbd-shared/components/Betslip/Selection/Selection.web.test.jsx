import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { BetSelectionDetails } from "@ppb/the-wall-web";
import { Selection } from "./Selection.web";

jest.mock("@ppb/the-wall-web", () => ({
  BetSelectionDetails: jest.fn((props) => <bet-selection-details-mock>{props.icon}</bet-selection-details-mock>),
  SilkWrapper: jest.fn(() => <silk-wrapper-mock />),
}));

function renderSelection(props) {
  return render(<Selection {...props} />);
}

describe("Selection", () => {
  beforeEach(jest.clearAllMocks);

  describe("when there is an urn", () => {
    describe("when silk is defined", () => {
      it("should call BetSelectionDetails with the icon defined", () => {
        renderSelection({
          urn: "URN:1",
          id: "LEG:1",
          title: "Title",
          subtitle: "Subtitle",
          icon: "silkUrl",
          silkFallbackType: "silkFallbackType",
          racingSport: 7,
          odd: "13.1",
          oddsMovement: "UP",
          hintMessage: "Warning message",
          hintType: "Warning",
          isReadOnly: false,
          is90Min: true,
        });

        expect(BetSelectionDetails).toHaveBeenCalledWith(
          {
            title: "Title",
            subtitle: "Subtitle",
            icon: expect.any(Object),
            odd: "13.1",
            oddsMovement: "UP",
            hintMessage: "Warning message",
            hintType: "Warning",
            is90Min: true,
            onSelectionRemove: expect.any(Function),
          },
          undefined,
        );
      });
    });

    describe("when icon is undefined", () => {
      it("should call BetSelectionDetails with the icon as undefined", () => {
        renderSelection({
          urn: "URN:1",
          id: "LEG:1",
          title: "Title",
          subtitle: "Subtitle",
          icon: undefined,
          silkFallbackType: undefined,
          odd: "13.1",
          oddsMovement: "UP",
          hintMessage: "Warning message",
          hintType: "Warning",
          isReadOnly: false,
          is90Min: true,
        });

        expect(BetSelectionDetails).toHaveBeenCalledWith(
          {
            title: "Title",
            subtitle: "Subtitle",
            icon: undefined,
            odd: "13.1",
            oddsMovement: "UP",
            hintMessage: "Warning message",
            hintType: "Warning",
            is90Min: true,
            onSelectionRemove: expect.any(Function),
          },
          undefined,
        );
      });
    });

    describe("when there is selectionTypeIcon prop", () => {
      it("should call BetSelectionDetails with selectionTypeIcon", () => {
        renderSelection({
          urn: "URN:1",
          id: "LEG:1",
          title: "Title",
          subtitle: "Subtitle",
          silkUrl: "silkUrl",
          silkFallbackType: "silkFallbackType",
          racingSport: 7,
          odd: "19.1",
          oddsMovement: "UP",
          hintMessage: "Warning message",
          hintType: "Warning",
          isReadOnly: false,
          is90Min: false,
          selectionTypeIcon: "FakeIcon",
        });

        expect(BetSelectionDetails).toHaveBeenCalledWith(
          {
            title: "Title",
            subtitle: "Subtitle",
            icon: expect.any(Object),
            odd: "19.1",
            oddsMovement: "UP",
            hintMessage: "Warning message",
            hintType: "Warning",
            is90Min: false,
            selectionTypeIcon: "FakeIcon",
            onSelectionRemove: expect.any(Function),
          },
          undefined,
        );
      });
    });

    describe("when selectionTypeIcon prop is not informed", () => {
      it("should call BetSelectionDetails with selectionTypeIcon as undefined", () => {
        renderSelection({
          urn: "URN:1",
          id: "LEG:1",
          title: "Title",
          subtitle: "Subtitle",
          icon: undefined,
          silkFallbackType: undefined,
          odd: "19.1",
          oddsMovement: "UP",
          hintMessage: "Warning message",
          hintType: "Warning",
          isReadOnly: false,
          is90Min: true,
        });

        expect(BetSelectionDetails).toHaveBeenCalledWith(
          {
            title: "Title",
            subtitle: "Subtitle",
            icon: undefined,
            odd: "19.1",
            oddsMovement: "UP",
            hintMessage: "Warning message",
            hintType: "Warning",
            is90Min: true,
            selectionTypeIcon: undefined,
            onSelectionRemove: expect.any(Function),
          },
          undefined,
        );
      });
    });
  });

  describe("when there is no urn", () => {
    it("should not call BetSelectionDetails", () => {
      renderSelection({
        urn: null,
        id: "LEG:1",
        title: "Title",
        subtitle: "Subtitle",
        icon: "silkUrl",
        racingSport: 7,
        silkFallbackType: "silkFallbackType",
        odd: "13.1",
        oddsMovement: "UP",
        hintMessage: "Warning message",
        hintType: "Warning",
        isReadOnly: false,
      });

      expect(BetSelectionDetails).not.toHaveBeenCalled();
    });
  });

  describe("when onSelectionRemove is called", () => {
    describe("when isReadOnly is false", () => {
      it("should have onSelectionRemove defined", () => {
        const dispatchSelectionRemoveSpy = jest.fn();

        renderSelection({
          id: "1",
          urn: "urn:1",
          isReadOnly: false,
          dispatchSelectionRemove: dispatchSelectionRemoveSpy,
        });

        expect(BetSelectionDetails).toHaveBeenCalledWith(
          expect.objectContaining({ onSelectionRemove: expect.any(Function) }),
          undefined,
        );
      });

      it("should dispatch when called", () => {
        const dispatchSelectionRemoveSpy = jest.fn();

        renderSelection({
          id: "1",
          urn: "urn:1",
          isReadOnly: false,
          dispatchSelectionRemove: dispatchSelectionRemoveSpy,
        });

        BetSelectionDetails.mock.calls[0][0].onSelectionRemove();

        expect(dispatchSelectionRemoveSpy).toHaveBeenCalledWith("1", "urn:1");
      });
    });

    describe("when isReadOnly is true", () => {
      it("should have onSelectionRemove undefined", () => {
        const dispatchSelectionRemoveSpy = jest.fn();

        renderSelection({ urn: "urn", id: "1", isReadOnly: true, dispatchSelectionRemove: dispatchSelectionRemoveSpy });

        expect(BetSelectionDetails).toHaveBeenCalledWith(
          expect.objectContaining({ onSelectionRemove: undefined }),
          undefined,
        );
      });
    });
  });
});
