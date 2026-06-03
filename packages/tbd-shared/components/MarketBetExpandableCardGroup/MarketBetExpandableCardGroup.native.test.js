import { Card } from "@ppb/the-wall-native";
import { render, act } from "@testing-library/react-native";
import { CardHeaderSize, CardTheme } from "@ppb/the-wall-common/types/Card/Card.types";
import ConnectedCardGroup from "../CardGroup";
import CardGroup from "../CardGroup/CardGroup.native";
import MarketBetExpandableCardGroup from "./MarketBetExpandableCardGroup.native";

jest.mock("../CardGroup", () => jest.fn(({ props }) => <connected-card-group-mock {...props} />));
jest.mock("../CardGroup/CardGroup.native", () => ({ CardGroup: jest.fn(() => <card-group-mock />) }));

jest.mock("@ppb/the-wall-native", () => ({
  Card: jest.fn(({ children }) => <card-mock>{children}</card-mock>),
}));

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
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

const cardDefaultProps = {
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

describe("Market Bet Expandable Card Group native component", () => {
  beforeEach(jest.clearAllMocks);

  describe("when props doesn't has items", () => {
    it("should not render ConnectedCardGroup component", () => {
      renderMarketBetExpandableCardGroup({ ...defaultProps, items: undefined });

      expect(ConnectedCardGroup).not.toHaveBeenCalled();
    });
  });

  describe("when props has items", () => {
    it("should render ConnectedCardGroup component", () => {
      renderMarketBetExpandableCardGroup({ ...defaultProps });

      expect(ConnectedCardGroup).toHaveBeenCalledWith(
        {
          urn: "market-bet-selection-card-urn",
          component: CardGroup,
          typename: "MarketBetSelectionCardGroup",
        },
        undefined,
      );
    });
  });

  describe("when Collapse Toggle action is called", () => {
    it("should call dispatchToggleAccordionAction", () => {
      renderMarketBetExpandableCardGroup(defaultProps);

      expect(Card).toHaveBeenCalledWith(
        expect.objectContaining({
          ...cardDefaultProps,
        }),
        undefined,
      );

      act(() => {
        Card.mock.calls[0][0].onTitleClick("onToggleMock");
      });

      expect(Card).toHaveBeenCalledWith(
        expect.objectContaining({
          ...cardDefaultProps,
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

          expect(Card).toHaveBeenCalledWith(
            expect.objectContaining({
              ...cardDefaultProps,
            }),
            undefined,
          );

          act(() => {
            Card.mock.calls[0][0].onTitleClick(false);
          });

          expect(Card).toHaveBeenCalledWith(
            expect.objectContaining({
              ...cardDefaultProps,
            }),
            undefined,
          );

          expect(dispatchFetchCardsActionMock).not.toHaveBeenCalled();
        });
      });

      describe("and the expandable becomes open", () => {
        it("should call dispatchFetchCardsAction", () => {
          renderMarketBetExpandableCardGroup({ ...defaultProps, isSettled: false });

          expect(Card).toHaveBeenCalledWith(
            expect.objectContaining({
              ...cardDefaultProps,
            }),
            undefined,
          );

          act(() => {
            Card.mock.calls[0][0].onTitleClick(true);
          });

          expect(Card).toHaveBeenCalledWith(
            expect.objectContaining({
              ...cardDefaultProps,
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

          expect(Card).toHaveBeenCalledWith(
            expect.objectContaining({
              ...cardDefaultProps,
            }),
            undefined,
          );

          act(() => {
            Card.mock.calls[0][0].onTitleClick(false);
          });

          expect(Card).toHaveBeenCalledWith(
            expect.objectContaining({
              ...cardDefaultProps,
            }),
            undefined,
          );

          expect(dispatchFetchCardsActionMock).not.toHaveBeenCalled();
        });
      });

      describe("and the expandable becomes open", () => {
        it("should not call dispatchFetchCardsAction", () => {
          renderMarketBetExpandableCardGroup(defaultProps);

          expect(Card).toHaveBeenCalledWith(
            expect.objectContaining({
              ...cardDefaultProps,
            }),
            undefined,
          );

          act(() => {
            Card.mock.calls[0][0].onTitleClick(true);
          });

          expect(Card).toHaveBeenCalledWith(
            expect.objectContaining({
              ...cardDefaultProps,
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
