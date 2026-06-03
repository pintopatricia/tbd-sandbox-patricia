import { render, act } from "@testing-library/react";
import { Card as CardTheWall } from "@ppb/the-wall-web";
import { CardHeaderSize, CardTheme } from "@ppb/the-wall-common/types/Card/Card.types";
import "jest-dom/extend-expect";
import ConnectedCard from "../Card";
import Card from "../Card/Card.web";
import MarketBetExpandableCardGroup from "./MarketBetExpandableCardGroup.web";

jest.mock("../Card", () => jest.fn(({ props }) => <connected-card-mock {...props} />));
jest.mock("../Card/Card.web", () => ({ Card: jest.fn().mockReturnValue(<card-mock />) }));
jest.mock("@ppb/the-wall-web", () => ({
  Card: jest.fn(({ children }) => <card-mock>{children}</card-mock>),
}));

const dispatchFetchCardsActionMock = jest.fn();
const dispatchToggleAccordionActionMock = jest.fn();

const defaultProps = {
  items: [
    {
      typename: "MarketBetSelectionCardGroup",
      urn: "market-bet-selection-card-urn",
    },
  ],
  isOpen: false,
  urn: "market-bet-expandable-card-urn",
  collapsedLabel: "collapse-label-mock",
  expandedLabel: "expandable-label-mock",
  dispatchFetchCardsAction: dispatchFetchCardsActionMock,
  dispatchToggleAccordionAction: dispatchToggleAccordionActionMock,
  marketBetCardGroupURN: "marketBetCardGroupURN",
  isSettled: true,
};

const cardTheWallDefaultProps = {
  isCollapsible: true,
  startOpen: defaultProps.isOpen,
  title: defaultProps.collapsedLabel,
  theme: CardTheme.TERTIARY,
  size: CardHeaderSize.MEDIUM,
  children: expect.anything(),
};

function renderMarketBetExpandableCardGroup(props) {
  return render(<MarketBetExpandableCardGroup {...props} />);
}

describe("Market Bet Expandable Card Group web component", () => {
  beforeEach(jest.clearAllMocks);

  describe("when props doesn't has items", () => {
    it("should not render ConnectedCard component", () => {
      renderMarketBetExpandableCardGroup({ ...defaultProps, items: undefined });

      expect(ConnectedCard).not.toHaveBeenCalled();
    });
  });

  describe("when props has items", () => {
    it("should render ConnectedCard component", () => {
      renderMarketBetExpandableCardGroup({ ...defaultProps });

      expect(ConnectedCard).toHaveBeenCalledWith(
        {
          urn: "market-bet-selection-card-urn",
          component: Card,
          typename: "MarketBetSelectionCardGroup",
        },
        undefined,
      );
    });
  });

  describe("when Collapse Toggle action is called", () => {
    it("should call dispatchToggleAccordionAction", () => {
      renderMarketBetExpandableCardGroup(defaultProps);

      expect(CardTheWall).toHaveBeenCalledWith(
        expect.objectContaining({
          ...cardTheWallDefaultProps,
        }),
        undefined,
      );

      act(() => {
        CardTheWall.mock.calls[0][0].onTitleClick("onToggleMock");
      });

      expect(CardTheWall).toHaveBeenCalledWith(
        expect.objectContaining({
          ...cardTheWallDefaultProps,
          title: defaultProps.expandedLabel,
        }),
        undefined,
      );

      expect(dispatchToggleAccordionActionMock).toHaveBeenCalledWith("onToggleMock");
    });

    describe("and bet is not settled", () => {
      describe("and the expandable becomes closed", () => {
        it("should not call dispatchFetchCardsAction", () => {
          renderMarketBetExpandableCardGroup({ ...defaultProps, isSettled: false });

          renderMarketBetExpandableCardGroup({ ...defaultProps, isSettled: false });

          expect(CardTheWall).toHaveBeenCalledWith(
            expect.objectContaining({
              ...cardTheWallDefaultProps,
            }),
            undefined,
          );

          act(() => {
            CardTheWall.mock.calls[0][0].onTitleClick(false);
          });

          expect(CardTheWall).toHaveBeenCalledWith(
            expect.objectContaining({
              ...cardTheWallDefaultProps,
            }),
            undefined,
          );

          expect(dispatchFetchCardsActionMock).not.toHaveBeenCalled();
        });
      });

      describe("and the expandable becomes open", () => {
        it("should call dispatchFetchCardsAction", () => {
          renderMarketBetExpandableCardGroup({ ...defaultProps, isSettled: false });

          expect(CardTheWall).toHaveBeenCalledWith(
            expect.objectContaining({
              ...cardTheWallDefaultProps,
            }),
            undefined,
          );

          act(() => {
            CardTheWall.mock.calls[0][0].onTitleClick(true);
          });

          expect(CardTheWall).toHaveBeenCalledWith(
            expect.objectContaining({
              ...cardTheWallDefaultProps,
              title: defaultProps.expandedLabel,
            }),
            undefined,
          );

          expect(dispatchFetchCardsActionMock).toHaveBeenCalledWith(defaultProps.marketBetCardGroupURN);
        });
      });
    });

    describe("and bet is settled", () => {
      describe("and the expandable becomes closed", () => {
        it("should not call dispatchFetchCardsAction", () => {
          renderMarketBetExpandableCardGroup(defaultProps);

          expect(CardTheWall).toHaveBeenCalledWith(
            expect.objectContaining({
              ...cardTheWallDefaultProps,
            }),
            undefined,
          );

          act(() => {
            CardTheWall.mock.calls[0][0].onTitleClick(false);
          });

          expect(CardTheWall).toHaveBeenCalledWith(
            expect.objectContaining({
              ...cardTheWallDefaultProps,
            }),
            undefined,
          );

          expect(dispatchFetchCardsActionMock).not.toHaveBeenCalled();
        });
      });

      describe("and the expandable becomes open", () => {
        it("should not call dispatchFetchCardsAction", () => {
          renderMarketBetExpandableCardGroup(defaultProps);

          expect(CardTheWall).toHaveBeenCalledWith(
            expect.objectContaining({
              ...cardTheWallDefaultProps,
            }),
            undefined,
          );

          act(() => {
            CardTheWall.mock.calls[0][0].onTitleClick(true);
          });

          expect(CardTheWall).toHaveBeenCalledWith(
            expect.objectContaining({
              ...cardTheWallDefaultProps,
              title: defaultProps.expandedLabel,
            }),
            undefined,
          );

          expect(dispatchFetchCardsActionMock).not.toHaveBeenCalled();
        });
      });
    });
  });
});
