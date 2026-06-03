import { render } from "@testing-library/react-native";
import { Runner } from "@ppb/the-wall-native";
import ConnectedBettingOpportunityBetButton from "../BettingOpportunityBetButton";
import BettingOpportunityBetButton from "../BettingOpportunityBetButton/BettingOpportunityBetButton.native";
import BettingOpportunity from "./BettingOpportunity.native";

jest.mock("@ppb/the-wall-native", () => ({
  Runner: jest.fn((props) => <runner-mock {...props} data-testid="runner-mock" />),
}));

jest.mock("../BettingOpportunityBetButton/BettingOpportunityBetButton.native", () =>
  jest.fn(() => <bo-bet-button data-testid="bo-bet-button" />),
);
jest.mock("../BettingOpportunityBetButton", () =>
  jest.fn(() => <connected-bo-bet-button data-testid="connected-bo-bet-button" />),
);

const BASE_PROPS = {
  cardUrn: "card:urn",
  name: "Betting Opportunity",
  opportunityUrn: "bo:urn",
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
      },
      undefined,
    );
  });
});
