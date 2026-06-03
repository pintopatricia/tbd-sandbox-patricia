import * as React from "react";
import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { ScrollableSwimlane } from "@ppb/the-wall-web";
import ObbCreatedBetsCardGroup from "./ObbCreatedBetsCardGroup.web";
import ConnectedObbCreatedBetsCard from "../ObbCreatedBetsCard";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(() => ({
    isDesktopLayout: false,
  })),
}));

jest.mock("@ppb/the-wall-web", () => ({
  ScrollableSwimlane: React.forwardRef(
    jest.fn(({ children }, ref) => <scrollable-mock ref={ref}>{children}</scrollable-mock>),
  ),
  StatusLabel: jest.fn(({ props }) => <status-label-mock {...props}></status-label-mock>),
}));

jest.mock("../ObbCreatedBetsCard", () =>
  jest.fn(() => <connected-obb-created-bets-card data-testid="connected-obb-created-bets-card" />),
);

jest.mock("../ObbCreatedBetsCard/ObbCreatedBetsCard.web", () =>
  jest.fn(() => <obb-created-bets-card-mock data-testid="obb-created-bets-card-mock" />),
);

const dispatchPushActionSpy = jest.fn();
const dispatchLinkClickSpy = jest.fn();

const defaultProps = {
  urn: "createdBetsCardGroup:1",
  title: "Obb Created Bets Card Group Title",
  headerBadgeLabel: "New",
  headerViewLink: {
    viewUrl: "header Url",
    viewUrn: "header Urn",
  },
  headerViewLinkLabel: "Header View Link Label",
  cards: [{ urn: "createdBetsCard:1" }, { urn: "createdBetsCard:2" }, { urn: "createdBetsCard:3" }],
  dispatchPushAction: dispatchPushActionSpy,
  dispatchLinkClick: dispatchLinkClickSpy,
};

function renderObbCreatedBetsCardGroup(props = {}) {
  const componentProps = { ...defaultProps, ...props };
  return render(<ObbCreatedBetsCardGroup {...componentProps} />);
}

describe("ObbCreatedBetsCardGroup", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when all the data is provided", () => {
    it("should render the card group correctly", () => {
      renderObbCreatedBetsCardGroup();

      expect(ScrollableSwimlane.render).toHaveBeenCalledTimes(1);
      expect(ScrollableSwimlane.render).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Obb Created Bets Card Group Title",
          iconPosition: "after",
          icon: expect.any(Object),
          isDesktopLayout: false,
          snap: true,
          navLink: {
            label: "Header View Link Label",
            viewLink: {
              viewUrl: "header Url",
              viewUrn: "header Urn",
            },
          },
          onButtonClick: expect.any(Function),
          children: expect.any(Object),
        }),
        null,
      );

      expect(ConnectedObbCreatedBetsCard).toHaveBeenCalledTimes(3);
      expect(ConnectedObbCreatedBetsCard).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({ urn: "createdBetsCard:1", fullWidth: false }),
        undefined,
      );
      expect(ConnectedObbCreatedBetsCard).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({ urn: "createdBetsCard:2", fullWidth: false }),
        undefined,
      );
      expect(ConnectedObbCreatedBetsCard).toHaveBeenNthCalledWith(
        3,
        expect.objectContaining({ urn: "createdBetsCard:3", fullWidth: false }),
        undefined,
      );
    });
  });

  describe("when no header badge label is provided", () => {
    it("should not render a status label in the header", () => {
      renderObbCreatedBetsCardGroup({ headerBadgeLabel: null });

      expect(ScrollableSwimlane.render).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: null,
        }),
        null,
      );
    });
  });

  describe("when no header view link is provided", () => {
    it("should not render a nav link in the header", () => {
      renderObbCreatedBetsCardGroup({ headerViewLink: null });

      expect(ScrollableSwimlane.render).toHaveBeenCalledWith(
        expect.objectContaining({
          navLink: undefined,
        }),
        null,
      );
    });
  });

  describe("when the header link is clicked", () => {
    it("should dispatch a push action with the header view link", () => {
      renderObbCreatedBetsCardGroup();

      const { onButtonClick } = ScrollableSwimlane.render.mock.calls[0][0];
      onButtonClick();

      expect(dispatchPushActionSpy).toHaveBeenCalledTimes(1);
      expect(dispatchPushActionSpy).toHaveBeenCalledWith({
        viewUrl: "header Url",
        viewUrn: "header Urn",
      });
    });
  });

  describe("layouts", () => {
    describe("desktop mode and two cards", () => {
      it("should render the cards with fullWidth set to true and set isDesktopLayout to true", () => {
        React.useContext.mockReturnValueOnce({
          isDesktopLayout: true,
        });

        renderObbCreatedBetsCardGroup({
          cards: [{ urn: "createdBetsCard:1" }, { urn: "createdBetsCard:2" }],
        });

        expect(ScrollableSwimlane.render).toHaveBeenCalledWith(
          expect.objectContaining({
            isDesktopLayout: true,
          }),
          null,
        );

        expect(ConnectedObbCreatedBetsCard).toHaveBeenCalledTimes(2);
        expect(ConnectedObbCreatedBetsCard).toHaveBeenNthCalledWith(
          1,
          expect.objectContaining({ urn: "createdBetsCard:1", fullWidth: true }),
          undefined,
        );
        expect(ConnectedObbCreatedBetsCard).toHaveBeenNthCalledWith(
          2,
          expect.objectContaining({ urn: "createdBetsCard:2", fullWidth: true }),
          undefined,
        );
      });
    });

    describe("one card", () => {
      it("should render the card with fullWidth set to true", () => {
        renderObbCreatedBetsCardGroup({
          cards: [{ urn: "createdBetsCard:1" }],
        });

        expect(ConnectedObbCreatedBetsCard).toHaveBeenCalledTimes(1);
        expect(ConnectedObbCreatedBetsCard).toHaveBeenNthCalledWith(
          1,
          expect.objectContaining({ urn: "createdBetsCard:1", fullWidth: true }),
          undefined,
        );
      });
    });
  });
});
