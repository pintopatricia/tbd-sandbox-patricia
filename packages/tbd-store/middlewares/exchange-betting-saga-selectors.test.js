import { getPlaceBetData } from "./exchange-betting-saga-selectors";
import {
  getEntities,
  getExchangeRunnerTree,
  createExcRunnerPotentialBetsByRunnerURNSelector,
} from "../state/entities/entities-selectors";
import { getExchangeRunnerByURN } from "../state/entities/exchange-runners/exchange-runner-selectors";
import { ExchangeSide } from "../state/constants";

jest.mock("../state/entities/entities-selectors", () => ({
  getEntities: jest.fn(),
  getExchangeRunnerTree: jest.fn(),
  createExcRunnerPotentialBetsByRunnerURNSelector: jest.fn(() => jest.fn()),
}));

jest.mock("../state/entities/exchange-runners/exchange-runner-selectors", () => ({
  getExchangeRunnerByURN: jest.fn(),
}));

jest.mock("../state/entities/exchange-markets/exchange-market-selectors", () => ({
  getExchangeMarketRunnerByURN: jest.fn(),
  createExchangeMarketSelector: jest.fn(),
}));

beforeEach(() => jest.clearAllMocks());

describe("getPlaceBetData", () => {
  const stateMock = { entities: {} };
  const exchangeMarketMock = {
    marketId: "some marketId",
  };

  describe("when there is no potential bet", () => {
    it("should return null", () => {
      createExcRunnerPotentialBetsByRunnerURNSelector.mockReturnValue(() => []);
      expect(getPlaceBetData(stateMock, "dummy:urn")).toBe(null);
    });
  });

  describe("when potential bet has no size", () => {
    it("should return null", () => {
      createExcRunnerPotentialBetsByRunnerURNSelector.mockReturnValue(() => [
        {
          price: 1.01,
        },
      ]);
      expect(getPlaceBetData(stateMock, "dummy:urn")).toBe(null);
    });
  });

  describe("when potential bet has no price", () => {
    it("should return null", () => {
      createExcRunnerPotentialBetsByRunnerURNSelector.mockReturnValue(() => [
        {
          size: 2,
        },
      ]);
      expect(getPlaceBetData(stateMock, "dummy:urn")).toBe(null);
    });
  });

  describe("when can't resolve the exchange runner tree", () => {
    it("should return null", () => {
      createExcRunnerPotentialBetsByRunnerURNSelector.mockReturnValue(() => [
        {
          size: 2,
          price: 1.23,
        },
      ]);
      getEntities.mockReturnValue({
        exchangerunners: {},
        exchangemarkets: {},
      });
      getExchangeRunnerByURN.mockReturnValue(undefined);

      expect(getPlaceBetData(stateMock, "dummy:urn")).toBe(null);
      expect(true).toBe(true);
    });
  });

  describe("when there is all necessary data for placement", () => {
    const getExcRunnerPotentialBetsByRunnerURN = jest.fn(() => [
      {
        size: 2,
        price: 1.23,
        runner: "some runner",
        side: "BACK",
      },
    ]);

    function setup() {
      createExcRunnerPotentialBetsByRunnerURNSelector.mockReturnValue(getExcRunnerPotentialBetsByRunnerURN);
      getExchangeRunnerTree.mockReturnValue({
        marketRunner: {
          urn: "dummy:urn",
          selectionId: 123,
          handicap: 0,
        },
        market: exchangeMarketMock,
      });
    }

    it("should call createExcRunnerPotentialBetsByRunnerURNSelector selector", () => {
      setup();
      getPlaceBetData(stateMock, "dummy:urn");

      expect(getExcRunnerPotentialBetsByRunnerURN).toHaveBeenCalledWith(stateMock, "dummy:urn");
      expect(getExcRunnerPotentialBetsByRunnerURN).toHaveBeenCalledTimes(1);
    });

    it("should call getExchangeRunnerTree selector", () => {
      setup();
      getPlaceBetData(stateMock, "dummy:urn");

      expect(getExchangeRunnerTree).toHaveBeenCalledWith(stateMock.entities, "dummy:urn");
      expect(getExchangeRunnerTree).toHaveBeenCalledTimes(1);
    });

    it("should return bet place data", () => {
      setup();

      expect(getPlaceBetData(stateMock, "dummy:urn")).toEqual({
        marketId: "some marketId",
        selectionId: 123,
        handicap: 0,
        side: ExchangeSide.BACK,
        orderType: "LIMIT",
        urn: "dummy:urn",
        limitOrder: {
          size: 2,
          price: 1.23,
          persistenceType: "LAPSE",
        },
      });
    });
  });
});
