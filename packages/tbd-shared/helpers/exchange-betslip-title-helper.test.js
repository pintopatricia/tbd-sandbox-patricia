import { getInlineBetslipTitle } from "./exchange-betslip-title-helper";

const mockGetExchangeMarketByMarketId = jest.fn();
const mockGetExchangeRunnerTree = jest.fn();

jest.mock("@ppb/tbd-store/state/entities/exchange-markets/exchange-market-selectors", () => ({
  createGetExchangeMarketByMarketIdSelector:
    () =>
    (...args) =>
      mockGetExchangeMarketByMarketId(...args),
}));

jest.mock("@ppb/tbd-store/state/entities/entities-selectors", () => ({
  getExchangeRunnerTree: (...args) => mockGetExchangeRunnerTree(...args),
}));

const buildAppState = ({ runner, exchangemarkets } = {}) => ({
  betslip: { exchangeContext: { runner } },
  entities: { exchangemarkets },
});

describe("getInlineBetslipTitle", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return exchange market and runner names", () => {
    const exchangemarkets = { marketA: { id: "market-1" } };

    mockGetExchangeRunnerTree.mockReturnValue({
      market: {
        marketId: "market-1",
        runners: [
          { urn: "runner-1", name: "Team A" },
          { urn: "runner-2", name: "Team B" },
        ],
      },
    });
    mockGetExchangeMarketByMarketId.mockReturnValue({ name: "Match Odds" });

    const result = getInlineBetslipTitle(buildAppState({ runner: "runner-1", exchangemarkets }));

    expect(mockGetExchangeMarketByMarketId).toHaveBeenCalledWith(exchangemarkets, "market-1");
    expect(result).toEqual("Match Odds - Team A");
  });

  it("should return only market name when runner is not in market", () => {
    mockGetExchangeRunnerTree.mockReturnValue({
      market: {
        marketId: "market-1",
        runners: [{ urn: "runner-1", name: "Team A" }],
      },
    });
    mockGetExchangeMarketByMarketId.mockReturnValue({ name: "Match Odds" });

    const result = getInlineBetslipTitle(buildAppState({ runner: "missing-runner", exchangemarkets: {} }));

    expect(result).toEqual("Match Odds");
  });

  it("should return only runner name when exchange market does not exist", () => {
    mockGetExchangeRunnerTree.mockReturnValue({
      market: {
        marketId: "market-1",
        runners: [{ urn: "runner-1", name: "Team A" }],
      },
    });
    mockGetExchangeMarketByMarketId.mockReturnValue(undefined);

    const result = getInlineBetslipTitle(buildAppState({ runner: "runner-1", exchangemarkets: {} }));

    expect(result).toEqual("Team A");
  });

  it("should not throw when runner tree is undefined", () => {
    mockGetExchangeRunnerTree.mockReturnValue(undefined);
    mockGetExchangeMarketByMarketId.mockReturnValue({ name: "Match Odds" });

    const result = getInlineBetslipTitle(buildAppState({ runner: "runner-1", exchangemarkets: undefined }));

    expect(mockGetExchangeMarketByMarketId).toHaveBeenCalledWith({}, "");
    expect(result).toEqual("Match Odds");
  });
});
