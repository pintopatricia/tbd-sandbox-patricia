import { render, act } from "@testing-library/react-native";
import { SportsbookBetButton } from "@ppb/the-wall-native";
import BettingOpportunityBetButton from "./BettingOpportunityBetButton.native";

jest.mock("@ppb/the-wall-native", () => ({
  SportsbookBetButton: jest.fn((props) => <sportsbook-bet-button-mock {...props} data-testid="bet-button" />),
}));

jest.mock("@ppb/the-wall-common/types", () => ({
  BetButtonTheme: { DARK: "DARK", ODDS_BOOST: "ODDS_BOOST", REGULAR: "REGULAR" },
  BetButtonStatus: { Normal: "Normal", Selected: "Selected" },
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  heights: {},
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useId: () => "r:id",
}));

const BASE_PROPS = {
  bettingOpportunityUrn: "bo:urn",
  bettingOpportunityId: "bo:id",
  label: "label",
  secondaryLabel: "secondary label",
  isMultipleOnBetslip: false,
  odds: 1.1,
  legIds: ["legID:1", "legID:2"],
  cardUrn: "card:urn",
  isOddsBoost: false,
  popularSelections: [
    { runnerUrn: 1, marketId: "9.1" },
    { runnerUrn: 2, marketId: "9.2" },
  ],
  marketsIds: ["market1", "market2"],
  visible: false,
  animated: false,
  accessibilityHints: {
    default: "I18N.ACCESSIBILITY.ADD_TO_BETSLIP_HINT",
    selected: "I18N.ACCESSIBILITY.REMOVE_FROM_BETSLIP_HINT",
  },
  accessibilityLabel: "I18N.ACCESSIBILITY.BET_BUTTON_DEFAULT",
  dispatchAddRemoveSelections: jest.fn(),
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
        animated: false,
        accessibilityHints: {
          default: "I18N.ACCESSIBILITY.ADD_TO_BETSLIP_HINT",
          selected: "I18N.ACCESSIBILITY.REMOVE_FROM_BETSLIP_HINT",
        },
        accessibilityLabel: "I18N.ACCESSIBILITY.BET_BUTTON_DEFAULT",
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
          accessibilityHints: {
            default: "I18N.ACCESSIBILITY.ADD_TO_BETSLIP_HINT",
            selected: "I18N.ACCESSIBILITY.REMOVE_FROM_BETSLIP_HINT",
          },
          accessibilityLabel: "I18N.ACCESSIBILITY.BET_BUTTON_DEFAULT",
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
          "bo:id",
          undefined,
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
      expect(dispatchAddRemoveSelections).toHaveBeenCalledWith(
        BASE_PROPS.popularSelections,
        "card:urn",
        1.1,
        "bo:id",
        undefined,
      );
    });
  });

  describe("and card is visible", () => {
    it("should dispatch a subscribe to the bettingOpportunity price", () => {
      const dispatchSubscribeBettingOpportunityPrice = jest.fn();
      renderBettingOpportunityBetButton({ dispatchSubscribeBettingOpportunityPrice, visible: true });

      expect(dispatchSubscribeBettingOpportunityPrice).toHaveBeenCalledWith(BASE_PROPS.bettingOpportunityUrn);
    });

    it("should dispatch a subscribe to the marketids subscription", () => {
      const dispatchSubscribeMarketsUpdates = jest.fn();
      renderBettingOpportunityBetButton({ dispatchSubscribeMarketsUpdates, visible: true });
      expect(dispatchSubscribeMarketsUpdates).toHaveBeenCalledTimes(2);
      expect(dispatchSubscribeMarketsUpdates).toHaveBeenCalledWith(BASE_PROPS.marketsIds[0], "r:id");
      expect(dispatchSubscribeMarketsUpdates).toHaveBeenCalledWith(BASE_PROPS.marketsIds[1], "r:id");
    });
  });

  describe("and card is not visible", () => {
    it("should dispatch a subscribe to the bettingOpportunity price", () => {
      const dispatchUnsubscribeBettingOpportunityPrice = jest.fn();
      renderBettingOpportunityBetButton({ dispatchUnsubscribeBettingOpportunityPrice, visible: false });

      expect(dispatchUnsubscribeBettingOpportunityPrice).toHaveBeenCalledWith(BASE_PROPS.bettingOpportunityUrn);
    });

    it("should dispatch a subscribe to the marketIds unsubscription", () => {
      const dispatchUnsubscribeMarketsUpdates = jest.fn();
      renderBettingOpportunityBetButton({ dispatchUnsubscribeMarketsUpdates, visible: false });

      expect(dispatchUnsubscribeMarketsUpdates).toHaveBeenCalledTimes(2);
      expect(dispatchUnsubscribeMarketsUpdates).toHaveBeenCalledWith(BASE_PROPS.marketsIds[0], "r:id");
      expect(dispatchUnsubscribeMarketsUpdates).toHaveBeenCalledWith(BASE_PROPS.marketsIds[1], "r:id");
    });
  });
});
