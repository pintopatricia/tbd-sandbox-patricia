import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { Runner } from "@ppb/the-wall-web";
import ConnectedBettingOpportunityBetButton from "../BettingOpportunityBetButton";
import BettingOpportunityBetButton from "../BettingOpportunityBetButton/BettingOpportunityBetButton.web";
import BettingOpportunity from "./BettingOpportunity.web";

jest.mock("@ppb/the-wall-web", () => ({
  Runner: jest.fn((props) => <runner-mock {...props} data-testid="runner-mock" />),
}));

jest.mock("../BettingOpportunityBetButton/BettingOpportunityBetButton.web", () =>
  jest.fn(() => <bo-bet-button data-testid="bo-bet-button" />),
);
jest.mock("../BettingOpportunityBetButton", () =>
  jest.fn(() => <connected-bo-bet-button data-testid="connected-bo-bet-button" />),
);

const BASE_PROPS = {
  cardUrn: "card:urn",
  name: "Betting Opportunity",
  opportunityUrn: "bo:urn",
  showWasPrice: true,
};

function renderBettingOpportunity(overwrites) {
  const props = {
    ...BASE_PROPS,
    ...overwrites,
  };
  return render(<BettingOpportunity {...props} />);
}

describe("BettingOpportunity", () => {
  beforeEach(() => jest.clearAllMocks());

  it("must render Runner", () => {
    renderBettingOpportunity();

    expect(Runner).toHaveBeenCalledWith(
      {
        name: "Betting Opportunity",
        children: expect.any(Object),
      },
      undefined,
    );
  });

  it("must render ConnectedBettingOpportunityBetButton", () => {
    renderBettingOpportunity();

    expect(ConnectedBettingOpportunityBetButton).toHaveBeenCalledWith(
      {
        bettingOpportunityUrn: "bo:urn",
        cardUrn: "card:urn",
        component: BettingOpportunityBetButton,
        short: true,
        showWasPrice: true,
      },
      undefined,
    );
  });
});
