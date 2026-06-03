import { Fragment } from "react";
import "jest-dom/extend-expect";

import { render, act } from "@testing-library/react";
import { Card } from "@ppb/the-wall-web";
import { CardHeaderSize, CardTheme } from "@ppb/the-wall-common/types/Card/Card.types";

import ExpandableMarketCard from "./ExpandableMarketCard.web";
import ConnectedMarketCard from "../MarketCard";
import MarketCard from "../MarketCard/MarketCard.web";
import ConnectedOpenBets from "../OpenBets";
import { OpenBets } from "../OpenBets/OpenBets.web";

jest.mock("../MarketCard", () => jest.fn(() => <connected-basic-market-mock />));
jest.mock("../MarketCard/MarketCard.web", () => jest.fn(() => <basic-market-mock />));
jest.mock("../OpenBets", () => jest.fn(() => <connected-open-bets-mock />));
jest.mock("../OpenBets/OpenBets.web", () => ({
  OpenBets: jest.fn(() => <open-bets-mock />),
}));
jest.mock("@ppb/the-wall-web", () => ({
  Card: jest.fn(({ children, props }) => <card-mock {...props}>{children}</card-mock>),
}));

const dispatchFetchFullCardAction = jest.fn();

function renderExpandableMarketCard(props) {
  return render(<ExpandableMarketCard {...props} />);
}

describe("ExpandableMarketCard", () => {
  describe("Hydrated State (isShell: false)", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      renderExpandableMarketCard({
        isShell: false,
        title: "title",
        marketCardURN: "marketCardURN",
        urn: "expandableMarketCardURN",
        dispatchFetchFullCardAction,
      });
    });

    it("should render the Card component with the correct props", () => {
      expect(Card).toHaveBeenCalledWith(
        {
          title: "title",
          onTitleClick: expect.any(Function),
          endElement: expect.any(Object),
          children: expect.any(Object),
          isCollapsible: true,
          theme: CardTheme.SECONDARY,
          size: CardHeaderSize.LARGE,
          fullWidthContent: true,
        },
        undefined,
      );
    });

    it("should render the OpenBets component with the correct props", () => {
      const { endElement } = Card.mock.calls[0][0];
      render(endElement);

      expect(ConnectedOpenBets).toHaveBeenCalledWith(
        {
          cardURN: "expandableMarketCardURN",
          component: OpenBets,
        },
        undefined,
      );
    });

    it("should render the MarketCard component with the correct props", () => {
      const { children } = Card.mock.calls[0][0];
      render(children);

      expect(ConnectedMarketCard).toHaveBeenCalledWith(
        expect.objectContaining({
          component: MarketCard,
          urn: "marketCardURN",
        }),
        undefined,
      );
    });

    it("should pass visible prop to MarketCard when provided", () => {
      jest.clearAllMocks();
      renderExpandableMarketCard({
        isShell: false,
        title: "title",
        marketCardURN: "marketCardURN",
        urn: "expandableMarketCardURN",
        visible: false,
        dispatchFetchFullCardAction,
      });

      const { children } = Card.mock.calls[0][0];
      render(children);

      expect(ConnectedMarketCard).toHaveBeenCalledWith(
        expect.objectContaining({
          component: MarketCard,
          urn: "marketCardURN",
          visible: false,
        }),
        undefined,
      );
    });

    describe("on Collapse press", () => {
      describe("and it becomes expanded", () => {
        it("should call dispatchFetchFullCardAction with the correct parameters", () => {
          act(() => {
            Card.mock.calls[0][0].onTitleClick(true);
          });

          expect(dispatchFetchFullCardAction).toHaveBeenCalledWith("marketCardURN");
        });
      });

      describe("and it becomes collapsed", () => {
        it("should not call dispatchFetchFullCardAction with the correct parameters", () => {
          act(() => {
            Card.mock.calls[0][0].onTitleClick(false);
          });

          expect(dispatchFetchFullCardAction).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe("Shell State (isShell: true)", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      renderExpandableMarketCard({
        isShell: true,
        title: "shell title",
        urn: "expandableMarketCardURN",
        dispatchFetchFullCardAction,
      });
    });

    it("should render the Collapsible component with shell props", () => {
      expect(Card).toHaveBeenCalledWith(
        {
          title: "shell title",
          theme: CardTheme.SECONDARY,
          size: CardHeaderSize.LARGE,
          isCollapsible: true,
          fullWidthContent: true,
          children: expect.any(Object),
        },
        undefined,
      );
    });

    it("should render empty children in shell state", () => {
      const { children } = Card.mock.calls[0][0];
      expect(children.type).toBe(Fragment);
    });

    it("should not render OpenBets in shell state", () => {
      const { endElement } = Card.mock.calls[0][0];
      expect(endElement).toBeUndefined();
    });

    it("should not render MarketCard in shell state", () => {
      const { children } = Card.mock.calls[0][0];
      expect(children.type).toBe(Fragment);
    });
  });
});
