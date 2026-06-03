import { ShowMore } from "@ppb/the-wall-web";
import { render, act } from "@testing-library/react";
import "jest-dom/extend-expect";

import { ObbCardsStackedLayout } from "./ObbCardsStackedLayout.web";
import ConnectedObbCard from "../../../ObbCard";

jest.mock("../../../ObbCard", () => jest.fn(() => <connected-obb-card data-testid="connected-obb-card" />));
jest.mock("../../../ObbCard/ObbCard.web", () => jest.fn(() => <obb-card-mock data-testid="obb-card" />));
jest.mock("../../../ObbCard/ObbCard.web", () => jest.fn(() => <obb-card-mock data-testid="obb-card" />));
jest.mock("@ppb/the-wall-web", () => ({
  ShowMore: jest.fn(() => <show-more-mock />),
}));
jest.mock("../../../../helpers/i18n", () => ({
  i18n: jest.fn((t) => t.key),
}));

const onShowMoreClickedMock = jest.fn();

describe("ObbCardsStackedLayout", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should not render the title when the value is not defined", () => {
    const { queryByRole } = render(<ObbCardsStackedLayout layout={{ title: undefined, items: [] }} />);
    expect(queryByRole("heading")).not.toBeInTheDocument();
  });

  it("should render the items with layoutUrn and itemIndex", async () => {
    const mockItems = [
      { urn: "urn1", typename: "CardA" },
      { urn: "urn2", typename: "CardB" },
    ];
    const layoutUrn = "layoutUrn";
    await act(async () => {
      render(
        <ObbCardsStackedLayout
          layout={{ items: mockItems, urn: layoutUrn }}
          onShowMoreClicked={onShowMoreClickedMock}
        />,
      );
    });
    expect(ConnectedObbCard).toHaveBeenCalledTimes(mockItems.length);
    expect(ConnectedObbCard).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        urn: "urn1",
        typename: "CardA",
        layoutUrn,
        itemIndex: 0,
      }),
      undefined,
    );
    expect(ConnectedObbCard).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        urn: "urn2",
        typename: "CardB",
        layoutUrn,
        itemIndex: 1,
      }),
      undefined,
    );
  });

  describe("ShowMore button", () => {
    describe("when there are more items to show than the maxCardsToDisplay limits", () => {
      it("should render the ShowMore button", async () => {
        const mockItems = [
          { urn: "urn1", typename: "CardA" },
          { urn: "urn2", typename: "CardB" },
        ];
        const layoutUrn = "layoutUrn";

        await act(async () => {
          render(
            <ObbCardsStackedLayout
              layout={{ items: mockItems, maxCardsToDisplay: 1, urn: layoutUrn }}
              onShowMoreClicked={onShowMoreClickedMock}
            />,
          );
        });

        expect(ShowMore).toHaveBeenCalledWith(
          {
            onClick: expect.any(Function),
            opened: false,
            text: "I18N.SHOW_MORE",
            hasBorderTop: false,
          },
          undefined,
        );
      });

      describe("when the other cards are not being shown and the button is clicked", () => {
        beforeAll(async () => {
          const mockItems = [
            { urn: "urn1", typename: "CardA" },
            { urn: "urn2", typename: "CardB" },
          ];
          const layoutUrn = "layoutUrn";

          await act(async () => {
            render(
              <ObbCardsStackedLayout
                layout={{ items: mockItems, maxCardsToDisplay: 1, urn: layoutUrn }}
                onShowMoreClicked={onShowMoreClickedMock}
              />,
            );
          });

          act(() => {
            const [[{ onClick }]] = ShowMore.mock.calls;

            onClick();
          });
        });

        it("should update the button's state to opened and its text to show less", () => {
          expect(ShowMore).toHaveBeenCalledWith(
            { hasBorderTop: false, onClick: expect.any(Function), opened: true, text: "I18N.SHOW_LESS" },
            undefined,
          );
        });
      });

      describe("when the cards are being shown and the button is clicked a second time", () => {
        beforeAll(async () => {
          const mockItems = [
            { urn: "urn1", typename: "CardA" },
            { urn: "urn2", typename: "CardB" },
          ];
          const layoutUrn = "layoutUrn";

          await act(async () => {
            render(
              <ObbCardsStackedLayout
                layout={{ items: mockItems, maxCardsToDisplay: 1, urn: layoutUrn }}
                onShowMoreClicked={onShowMoreClickedMock}
              />,
            );
          });

          const [[{ onClick }]] = ShowMore.mock.calls;

          // First click - open
          act(() => {
            onClick();
          });

          // Second click - close
          act(() => {
            onClick();
          });
        });

        it("should update the button's state back to closed and its text to show more", () => {
          expect(ShowMore).toHaveBeenCalledWith(
            { hasBorderTop: false, onClick: expect.any(Function), opened: false, text: "I18N.SHOW_MORE" },
            undefined,
          );
        });
      });
    });

    describe("when there are less or equal items to show than the maxCardsToDisplay limits", () => {
      it("should not render the ShowMore button", async () => {
        const mockItems = [
          { urn: "urn1", typename: "CardA" },
          { urn: "urn2", typename: "CardB" },
        ];
        const layoutUrn = "layoutUrn";

        await act(async () => {
          render(
            <ObbCardsStackedLayout
              layout={{ items: mockItems, maxCardsToDisplay: 2, urn: layoutUrn }}
              onShowMoreClicked={onShowMoreClickedMock}
            />,
          );
        });

        expect(ShowMore).not.toHaveBeenCalled();
      });
    });
  });
});
