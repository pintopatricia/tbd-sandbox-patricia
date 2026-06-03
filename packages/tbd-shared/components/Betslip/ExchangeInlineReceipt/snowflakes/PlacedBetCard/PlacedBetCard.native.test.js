import { Text } from "react-native";
import { render } from "@testing-library/react-native";

import { Alert, BetSegments, FreeBets } from "@ppb/the-wall-native";

import { PlacedBetCard } from "./PlacedBetCard.native";
import { FREE_BETS, PLACED_BET_CARD } from "./PlacedBetCard.native.selectors";

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

jest.mock("@ppb/the-wall-native", () => ({
  BetSegments: jest.fn(() => <bet-segments-mock />),
  FreeBets: jest.fn(() => <free-bets-mock />),
  Text: jest.requireActual("react-native").Text,
  Alert: jest.fn(() => <alert-mock />),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  tokens: {},
  typography: {},
  spacings: {},
}));

const BONUS_MOCK = "Used Bonus £10";

function renderPlacedBetCard({
  price = "3.00",
  stake = "£5.00",
  profit = "£10.00",
  liability = "£5.00",
  bonus = BONUS_MOCK,
  hasFreeBets = false,
  labels = {},
  type = "MATCHED",
  children,
}) {
  const victim = render(
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

  const placeBetCard = victim.queryByTestId(PLACED_BET_CARD);
  const freeBets = victim.queryByTestId(FREE_BETS);

  return {
    victim,
    placeBetCard,
    freeBets,
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
      it("should call FreeBets with isReadOnly", () => {
        renderPlacedBetCard({ hasFreeBets: true });

        expect(FreeBets).toHaveBeenCalledWith(expect.objectContaining({ isReadOnly: true }), undefined);
      });

      it("should call FreeBets bonus with label", () => {
        renderPlacedBetCard({ hasFreeBets: true, bonus: "Used bonus £10" });

        expect(FreeBets).toHaveBeenCalledWith(expect.objectContaining({ label: "Used bonus £10" }), undefined);
      });

      it("should call FreeBets with the correct parameters", () => {
        renderPlacedBetCard({ hasFreeBets: true });

        expect(FreeBets).toHaveBeenCalledWith(
          expect.objectContaining({ label: BONUS_MOCK, isReadOnly: true }),
          undefined,
        );
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
      const { victim } = renderPlacedBetCard({ children: <Text testID="test-me">I am a child</Text> });
      const childComponent = victim.queryByTestId("test-me");

      expect(childComponent).toHaveTextContent("I am a child");
    });
  });
});
