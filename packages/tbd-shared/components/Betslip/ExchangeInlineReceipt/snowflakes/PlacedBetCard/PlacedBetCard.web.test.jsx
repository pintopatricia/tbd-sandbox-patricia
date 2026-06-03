import { queryByTestId, render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { Alert, BetSegments, FreeBets } from "@ppb/the-wall-web";

import { PlacedBetCard } from "./PlacedBetCard.web";
import { FREE_BETS } from "./PlacedBetCard.web.selectors";

jest.mock("@ppb/the-wall-web", () => ({
  BetSegments: jest.fn(() => <bet-segments-mock />),
  FreeBets: jest.fn(() => <free-bets-mock />),
  Alert: jest.fn(() => <alert-mock />),
}));

function renderPlacedBetCard({
  type = "MATCHED",
  price = "3.00",
  stake = "£5.00",
  profit = "£10.00",
  liability = "£5.00",
  bonus = "Used Bonus £10",
  hasFreeBets = false,
  labels = {},
  children,
}) {
  const { container, rerender } = render(
    <PlacedBetCard
      price={price}
      stake={stake}
      profit={profit}
      liability={liability}
      bonus={bonus}
      hasFreeBets={hasFreeBets}
      labels={labels}
      type={type}
    >
      {children}
    </PlacedBetCard>,
  );

  const freeBets = container.querySelector(FREE_BETS);

  return {
    container,
    freeBets,
    rerender,
  };
}

describe("PlacedBetCard", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("when providing a type", () => {
    describe("and type is MATCHED", () => {
      it("should call Alert with type SUCCESS", () => {
        renderPlacedBetCard({ type: "MATCHED", labels: { name: "Matched title" } });

        expect(Alert).toHaveBeenCalledWith(
          expect.objectContaining({ message: "Matched title", type: "SUCCESS" }),
          undefined,
        );
      });
    });

    describe("and type is UNMATCHED", () => {
      it("should call Alert with type ERROR", () => {
        renderPlacedBetCard({ type: "UNMATCHED", labels: { name: "Unmatched title" } });

        expect(Alert).toHaveBeenCalledWith(
          expect.objectContaining({ message: "Unmatched title", type: "ERROR" }),
          undefined,
        );
      });
    });
  });

  describe("when name label is missing", () => {
    it("should not render Alert", () => {
      renderPlacedBetCard({ type: "UNMATCHED", labels: {} });

      expect(Alert).not.toHaveBeenCalled();
    });
  });

  describe("when displaying placed bet results", () => {
    it("should call BetSegments leftLabel with labels.price", () => {
      renderPlacedBetCard({ labels: { price: "This price" } });

      expect(BetSegments).toHaveBeenCalledWith(expect.objectContaining({ leftLabel: "This price" }), undefined);
    });

    it("should call BetSegments leftValue with price", () => {
      renderPlacedBetCard({ price: "69.69" });

      expect(BetSegments).toHaveBeenCalledWith(expect.objectContaining({ leftValue: "69.69" }), undefined);
    });

    it("should call BetSegments midLabel with labels.stake", () => {
      renderPlacedBetCard({ labels: { stake: "This stake" } });

      expect(BetSegments).toHaveBeenCalledWith(expect.objectContaining({ midLabel: "This stake" }), undefined);
    });

    it("should call BetSegments midValue with stake", () => {
      renderPlacedBetCard({ stake: "£69.69" });

      expect(BetSegments).toHaveBeenCalledWith(expect.objectContaining({ midValue: "£69.69" }), undefined);
    });

    it("should call BetSegments midRightLabel with labels.liability", () => {
      renderPlacedBetCard({ labels: { liability: "This liability" } });

      expect(BetSegments).toHaveBeenCalledWith(expect.objectContaining({ midRightLabel: "This liability" }), undefined);
    });

    it("should call BetSegments midRightValue with liability", () => {
      renderPlacedBetCard({ liability: "£69.69" });

      expect(BetSegments).toHaveBeenCalledWith(expect.objectContaining({ midRightValue: "£69.69" }), undefined);
    });

    it("should call BetSegments rightLabel with labels.profit", () => {
      renderPlacedBetCard({ labels: { profit: "This profit" } });

      expect(BetSegments).toHaveBeenCalledWith(expect.objectContaining({ rightLabel: "This profit" }), undefined);
    });

    it("should call BetSegments rightValue with profit", () => {
      renderPlacedBetCard({ profit: "£69.69" });

      expect(BetSegments).toHaveBeenCalledWith(expect.objectContaining({ rightValue: "£69.69" }), undefined);
    });
  });

  describe("when handling free bets", () => {
    describe("when there are free bets stake used", () => {
      it("should call FreeBets isSelected with hasFreeBets", () => {
        renderPlacedBetCard({ hasFreeBets: true });

        expect(FreeBets).toHaveBeenCalledWith(expect.objectContaining({ isSelected: true }), undefined);
      });

      it("should call FreeBets bonus with label", () => {
        renderPlacedBetCard({ hasFreeBets: true, bonus: "Used bonus £10" });

        expect(FreeBets).toHaveBeenCalledWith(expect.objectContaining({ label: "Used bonus £10" }), undefined);
      });
    });

    describe("when there are NO free bets stake used", () => {
      it("should not call FreeBets", () => {
        renderPlacedBetCard({ hasFreeBets: false });

        expect(FreeBets).not.toHaveBeenCalled();
      });
    });
  });

  describe("when passing child components", () => {
    it("should set the children inside the component", () => {
      const { container } = renderPlacedBetCard({ children: <div data-testid="test-me">I am a child</div> });
      const childComponent = queryByTestId(container, "test-me");

      expect(childComponent).toHaveTextContent("I am a child");
    });
  });
});
