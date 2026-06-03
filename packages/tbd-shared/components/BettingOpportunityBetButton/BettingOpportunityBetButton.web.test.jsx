import { render, act } from "@testing-library/react";
import "jest-dom/extend-expect";
import { SportsbookBetButton, useOnIntersect } from "@ppb/the-wall-web";
import BettingOpportunityBetButton from "./BettingOpportunityBetButton.web";

jest.mock("@ppb/the-wall-web", () => ({
  useOnIntersect: jest.fn(() => ({ isIntersecting: false, ref: null })),
  SportsbookBetButton: jest.fn((props) => <sportsbook-bet-button-mock {...props} data-testid="bet-button" />),
}));

jest.mock("@ppb/the-wall-common/types", () => ({
  BetButtonTheme: { DARK: "DARK", ODDS_BOOST: "ODDS_BOOST", REGULAR: "REGULAR" },
  BetButtonStatus: { Normal: "Normal", Selected: "Selected" },
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useId: () => "r:id",
}));

const BASE_PROPS = {
  bettingOpportunityUrn: "bo:urn",
  bettingOpportunityId: "bo-1234",
  bettingOpportunityType: "POPULAR",
  label: "label",
  secondaryLabel: "secondary label",
  isMultipleOnBetslip: false,
  odds: 1.1,
  legIds: ["legID:1", "legID:2"],
  cardUrn: "card:urn",
  popularSelections: [
    { runnerUrn: 1, marketId: "9.1" },
    { runnerUrn: 2, marketId: "9.2" },
  ],
  marketsIds: new Set(["market1", "market2"]),
  isOddsboost: false,
  animated: false,
  dispatchAddRemoveSelections: jest.fn(),
  dispatchAddBoostSelections: jest.fn(),
  dispatchClickAddSelections: jest.fn(),
  dispatchClickRemoveSelections: jest.fn(),
  dispatchSubscribeBettingOpportunityPrice: jest.fn(),
  dispatchUnsubscribeBettingOpportunityPrice: jest.fn(),
  dispatchBetslipSportsbookRemoveLegAction: jest.fn(),
  dispatchSubscribeMarketsUpdates: jest.fn(),
  dispatchUnsubscribeMarketsUpdates: jest.fn(),
};

function renderBettingOpportunityBetButton(overwrites) {
  const props = {
    ...BASE_PROPS,
    ...overwrites,
  };
  return render(<BettingOpportunityBetButton {...props} />);
}

describe("BettingOpportunityBetButton", () => {
  beforeEach(() => jest.clearAllMocks());

  it("must render SportsbookBetButton", () => {
    renderBettingOpportunityBetButton();

    expect(SportsbookBetButton).toHaveBeenCalledWith(
      {
        onClick: expect.any(Function),
        label: "label",
        secondaryLabel: "secondary label",
        status: "default",
        disabled: false,
        struckThrough: false,
        oddsboost: false,
        animated: false,
      },
      undefined,
    );
  });

  describe("when is oddsboost", () => {
    it("must render SportsbookBetButton", () => {
      renderBettingOpportunityBetButton({
        isOddsboost: true,
      });

      expect(SportsbookBetButton).toHaveBeenCalledWith(
        {
          onClick: expect.any(Function),
          label: "label",
          secondaryLabel: "secondary label",
          status: "default",
          disabled: false,
          struckThrough: true,
          oddsboost: true,
          animated: false,
        },
        undefined,
      );
    });
    describe("when button is clicked", () => {
      it("should dispatch addSelections action with popular selection and boostedFields", () => {
        const dispatchAddRemoveSelections = jest.fn();
        // const dispatchClickAddSelections = jest.fn();
        renderBettingOpportunityBetButton({
          dispatchAddRemoveSelections,
          isOddsboost: true,
          isBoostedBet: true,
        });

        act(() => {
          SportsbookBetButton.mock.calls[0][0].onClick();
        });
        expect(dispatchAddRemoveSelections).toHaveBeenCalledWith(
          BASE_PROPS.popularSelections,
          "card:urn",
          1.1,
          "bo-1234",
          "POPULAR",
        );
      });
    });
  });

  describe("when the bet button is clicked", () => {
    const dispatchAddRemoveSelections = jest.fn();
    const dispatchClickAddSelections = jest.fn();

    beforeEach(() => {
      renderBettingOpportunityBetButton({ dispatchAddRemoveSelections, dispatchClickAddSelections });

      act(() => {
        SportsbookBetButton.mock.calls[0][0].onClick();
      });
    });

    it("should dispatch to add selections", () => {
      // popularSelections, cardUrn, odds, bettingOpportunityId, bettingOpportunityType
      expect(dispatchAddRemoveSelections).toHaveBeenCalledWith(
        BASE_PROPS.popularSelections,
        "card:urn",
        1.1,
        "bo-1234",
        "POPULAR",
      );
    });
  });

  describe("when the intersecting triggers with isIntersecting `false`", () => {
    it("should dispatch a subscribe to the bettingOpportunity price", () => {
      const dispatchUnsubscribeBettingOpportunityPrice = jest.fn();
      renderBettingOpportunityBetButton({ dispatchUnsubscribeBettingOpportunityPrice });

      expect(dispatchUnsubscribeBettingOpportunityPrice).toHaveBeenCalledWith(BASE_PROPS.bettingOpportunityUrn);
    });

    it("should dispatch an unsubscribe to the market updates", () => {
      const dispatchUnsubscribeMarketsUpdates = jest.fn();
      useOnIntersect.mockReturnValue({ isIntersecting: false, ref: null });
      renderBettingOpportunityBetButton({ dispatchUnsubscribeMarketsUpdates });

      expect(dispatchUnsubscribeMarketsUpdates).toHaveBeenCalledTimes(2);
      expect(dispatchUnsubscribeMarketsUpdates).toHaveBeenCalledWith("market1", "r:id");
      expect(dispatchUnsubscribeMarketsUpdates).toHaveBeenCalledWith("market2", "r:id");
    });
  });

  describe("when the intersecting triggers with isIntersecting `true`", () => {
    it("should dispatch a subscribe to the market updates", () => {
      const dispatchSubscribeMarketsUpdates = jest.fn();
      useOnIntersect.mockReturnValue({ isIntersecting: true, ref: null });
      renderBettingOpportunityBetButton({ dispatchSubscribeMarketsUpdates });

      expect(dispatchSubscribeMarketsUpdates).toHaveBeenCalledTimes(2);
      expect(dispatchSubscribeMarketsUpdates).toHaveBeenCalledWith("market1", "r:id");
      expect(dispatchSubscribeMarketsUpdates).toHaveBeenCalledWith("market2", "r:id");
    });

    it("should dispatch an subscribe to the bettingOpportunity price", () => {
      const dispatchSubscribeBettingOpportunityPrice = jest.fn();
      useOnIntersect.mockReturnValue({ isIntersecting: true, ref: null });
      renderBettingOpportunityBetButton({ dispatchSubscribeBettingOpportunityPrice });

      expect(dispatchSubscribeBettingOpportunityPrice).toHaveBeenCalledWith(BASE_PROPS.bettingOpportunityUrn);
    });
  });
});
