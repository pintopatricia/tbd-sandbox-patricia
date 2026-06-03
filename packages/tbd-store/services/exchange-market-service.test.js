import { ExchangeReadOnly, utils } from "@flutter-global/uki-channels-http-clients";
import ExchangeMarketService from "./exchange-market-service";
import { getExchangeMarketStatus } from "./types-converter";

jest.mock("@flutter-global/uki-channels-http-clients", () => ({
  ExchangeReadOnly: jest.fn().mockReturnValue({
    getByMarkets: jest.fn(),
    getByRunner: jest.fn(),
  }),
  utils: {
    createMarketsChunks: jest.fn(),
    TYPES_WEIGHT_ENUM: {
      MARKET_STATE: "MARKET_STATE",
      MARKET_LICENCE: "MARKET_LICENCE",
      MARKET_RATES: "MARKET_RATES",
      MARKET_LINE_RANGE_INFO: "MARKET_LINE_RANGE_INFO",
      MARKET_DESCRIPTION: "MARKET_DESCRIPTION",
      EVENT: "EVENT",
      RUNNER_DESCRIPTION: "RUNNER_DESCRIPTION",
      RUNNER_STATE: "RUNNER_STATE",
      RUNNER_SP: "RUNNER_SP",
      RUNNER_EXCHANGE_PRICES_BEST: "RUNNER_EXCHANGE_PRICES_BEST",
      RUNNER_EXCHANGE_PRICES_ALL: "RUNNER_EXCHANGE_PRICES_ALL",
      RUNNER_EXCHANGE_TRADED: "RUNNER_EXCHANGE_TRADED",
      RUNNER_SP_TAKEN: "RUNNER_SP_TAKEN",
      RUNNER_METADATA: "RUNNER_METADATA",
    },
  },
}));

jest.mock("./client-factory", () => ({
  createClientFactory: jest.fn(() => ExchangeReadOnly),
}));

jest.mock("./types-converter", () => ({
  getExchangeMarketStatus: jest.fn().mockReturnValue("OPEN"),
}));

const exchangeMarketMock = {
  eventTypes: [
    {
      eventNodes: [
        {
          marketNodes: [
            {
              marketId: "1.1111",
              state: {
                status: "OPEN",
                betDelay: 2,
                numberOfWinners: 0,
                inplay: false,
              },
              runners: [
                {
                  handicap: 0,
                  selectionId: 1234,
                  state: {
                    removalDate: "13:30 13 Mar",
                    adjustmentFactor: 2.1,
                    status: "ACTIVE",
                    lastPriceTraded: 1.54,
                  },
                  exchange: {
                    availableToBack: [
                      { price: "1.01", size: 2000 },
                      { price: "1.02", size: 2001 },
                      { price: "1.03", size: 2002 },
                    ],
                    availableToLay: [
                      { price: "1.01", size: 2000 },
                      { price: "1.02", size: 2001 },
                      { price: "1.03", size: 2002 },
                    ],
                    traded: [
                      { price: "1.01", size: 2000 },
                      { price: "1.02", size: 2001 },
                      { price: "1.03", size: 2002 },
                    ],
                  },
                  sp: {
                    farPrice: 2.0453730154008607,
                    nearPrice: 2.222017664556625,
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const exchangeMarketMockWithDescription = {
  eventTypes: [
    {
      eventNodes: [
        {
          marketNodes: [
            {
              marketId: "1.1111",
              state: {
                status: "OPEN",
                betDelay: 2,
                bspReconciled: false,
                complete: true,
                inplay: false,
                numberOfWinners: 0,
                totalMatched: 1,
              },
              description: {
                priceLadderDescription: {
                  type: "Price Ladder Type Description",
                },
                turnInPlayEnabled: true,
              },
              rates: {
                marketBaseRate: 1.23,
                discountAllowed: 10,
              },
              runners: [
                {
                  handicap: 0,
                  selectionId: 1234,
                  state: {
                    lastPriceTraded: 1.54,
                    status: "ACTIVE",
                  },
                  exchange: {
                    availableToBack: [
                      { price: "1.01", size: 2000 },
                      { price: "1.02", size: 2001 },
                      { price: "1.03", size: 2002 },
                    ],
                    availableToLay: [
                      { price: "1.01", size: 2000 },
                      { price: "1.02", size: 2001 },
                      { price: "1.03", size: 2002 },
                    ],
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

function setup(mock) {
  utils.createMarketsChunks.mockReturnValue([["1.1234"]]);
  ExchangeReadOnly().getByMarkets.mockReturnValue(Promise.resolve(mock));
}

function setupByRunner(mock) {
  ExchangeReadOnly().getByRunner.mockReturnValue(Promise.resolve(mock));
}

describe("ExchangeMarketService", () => {
  describe("API", () => {
    it("should expose a getPrices method", () => {
      expect(ExchangeMarketService.getPrices).toBeDefined();
      expect(ExchangeMarketService.getRunnerMarketUpdate).toBeDefined();
    });
  });

  describe("Behaviour", () => {
    beforeEach(jest.clearAllMocks);

    describe("getPrices", () => {
      describe("when request size is bigger than the limit", () => {
        beforeEach(async () => {
          setup(exchangeMarketMock);
          utils.createMarketsChunks.mockReturnValue([["1.1234"], ["1.999"]]);

          await ExchangeMarketService.getPrices(["1.1234", "1.9999"], "en", "EUR");
        });

        it("should create market chunks", () => {
          expect(utils.createMarketsChunks).toHaveBeenCalledWith(
            ["1.1234", "1.9999"],
            ["RUNNER_EXCHANGE_PRICES_BEST", "RUNNER_DESCRIPTION", "MARKET_STATE", "RUNNER_STATE"],
          );
        });

        it("should call getByMarkets more than once", () => {
          expect(ExchangeReadOnly().getByMarkets.mock.calls.length).toEqual(2);
        });

        it("should call getByMarkets with both chunks", () => {
          expect(ExchangeReadOnly().getByMarkets.mock.calls[0][0]).toEqual(["1.1234"]);
          expect(ExchangeReadOnly().getByMarkets.mock.calls[1][0]).toEqual(["1.999"]);
        });
      });

      describe("when request size does not exceed the limit", () => {
        beforeEach(async () => {
          setup(exchangeMarketMock);
          utils.createMarketsChunks.mockReturnValue([["1.1234", "1.9999"]]);

          await ExchangeMarketService.getPrices(["1.1234", "1.9999"], "en", "EUR");
        });

        it("should create market chunks", () => {
          expect(utils.createMarketsChunks).toHaveBeenCalledWith(
            ["1.1234", "1.9999"],
            ["RUNNER_EXCHANGE_PRICES_BEST", "RUNNER_DESCRIPTION", "MARKET_STATE", "RUNNER_STATE"],
          );
        });

        it("should call getByMarkets only once", () => {
          expect(ExchangeReadOnly().getByMarkets.mock.calls.length).toEqual(1);
        });

        it("should call getByMarkets with one chunks", () => {
          expect(ExchangeReadOnly().getByMarkets.mock.calls[0][0]).toEqual(["1.1234", "1.9999"]);
        });
      });

      describe("when retrieving without description", () => {
        it("should use ERO service to get prices", async () => {
          setup(exchangeMarketMock);

          await ExchangeMarketService.getPrices(["1.1234"], "en", "EUR");

          expect(ExchangeReadOnly().getByMarkets).toHaveBeenCalledWith(
            ["1.1234"],
            ["RUNNER_EXCHANGE_PRICES_BEST", "RUNNER_DESCRIPTION", "MARKET_STATE", "RUNNER_STATE"],
            {
              currencyCode: "EUR",
              locale: "en",
              rollupLimit: 2,
              rollupModel: "STAKE",
            },
          );
        });
      });

      describe("when retrieving with description", () => {
        it("should use ERO service to get prices with extra description fields", async () => {
          setup(exchangeMarketMock);

          await ExchangeMarketService.getPrices(["1.1234"], "en", "EUR", true);

          expect(ExchangeReadOnly().getByMarkets).toHaveBeenCalledWith(
            ["1.1234"],
            [
              "RUNNER_EXCHANGE_PRICES_BEST",
              "RUNNER_DESCRIPTION",
              "MARKET_STATE",
              "RUNNER_STATE",
              "MARKET_DESCRIPTION",
              "MARKET_RATES",
            ],
            {
              currencyCode: "EUR",
              locale: "en",
              rollupLimit: 2,
              rollupModel: "STAKE",
            },
          );
        });
      });

      describe("when ERO returns market info", () => {
        it("should return exchange market update", async () => {
          setup(exchangeMarketMock);
          const exchangeMarket = await ExchangeMarketService.getPrices(["1.1234"], "en", "EUR");

          const expectedMarket = {
            markets: [
              {
                urn: "ppb:excMarket:1.1111",
                status: "OPEN",
                marketId: "1.1111",
                betDelay: 2,
                numberOfWinners: 0,
                inplay: false,
              },
            ],
            runners: [
              {
                urn: "ppb:excRunner:1.1111/1234/0",
                market: "ppb:excMarket:1.1111",
                selectionId: 1234,
                date: "13:30 13 Mar",
                reduction: 2.1,
                status: "ACTIVE",
                back: [
                  { price: "1.01", liquidity: 2000 },
                  { price: "1.02", liquidity: 2001 },
                  { price: "1.03", liquidity: 2002 },
                ],
                lay: [
                  { price: "1.01", liquidity: 2000 },
                  { price: "1.02", liquidity: 2001 },
                  { price: "1.03", liquidity: 2002 },
                ],
              },
            ],
          };

          expect(exchangeMarket).toEqual(expectedMarket);
        });

        it("should convert marketStatus to app ENUM", async () => {
          await ExchangeMarketService.getPrices(["1.1234"], "en", "EUR");

          expect(getExchangeMarketStatus).toHaveBeenCalledWith("OPEN");
        });
      });

      describe("when ERO returns market info with description", () => {
        it("should return exchange market update", async () => {
          setup(exchangeMarketMockWithDescription);

          const exchangeMarket = await ExchangeMarketService.getPrices(["1.1234"], "en", "EUR");

          const expectedMarket = {
            markets: [
              {
                urn: "ppb:excMarket:1.1111",
                status: "OPEN",
                marketId: "1.1111",
                betDelay: 2,
                bspReconciled: false,
                complete: true,
                turnInPlayEnabled: true,
                inplay: false,
                baseRate: 1.23,
                discountAllowed: 10,
                priceLadderType: "Price Ladder Type Description",
                numberOfWinners: 0,
                totalMatched: 1,
              },
            ],
            runners: [
              {
                urn: "ppb:excRunner:1.1111/1234/0",
                market: "ppb:excMarket:1.1111",
                selectionId: 1234,
                back: [
                  { price: "1.01", liquidity: 2000 },
                  { price: "1.02", liquidity: 2001 },
                  { price: "1.03", liquidity: 2002 },
                ],
                lay: [
                  { price: "1.01", liquidity: 2000 },
                  { price: "1.02", liquidity: 2001 },
                  { price: "1.03", liquidity: 2002 },
                ],
                status: "ACTIVE",
                date: null,
                reduction: null,
              },
            ],
          };

          expect(exchangeMarket).toEqual(expectedMarket);
        });

        it("should convert marketStatus to app ENUM", async () => {
          await ExchangeMarketService.getPrices(["1.1234"], "en", "EUR");

          expect(getExchangeMarketStatus).toHaveBeenCalledWith("OPEN");
        });
      });

      describe("when runner state is not available", () => {
        it("should return null", async () => {
          const exchangeMarketMockWithoutState = {
            eventTypes: [
              {
                eventNodes: [
                  {
                    marketNodes: [
                      {
                        marketId: "1.1111",
                        description: {
                          priceLadderDescription: {
                            type: "Price Ladder Type Description",
                          },
                        },
                        rates: {
                          marketBaseRate: 1.23,
                          discountAllowed: 10,
                        },
                        runners: [
                          {
                            handicap: 0,
                            selectionId: 1234,
                            state: {
                              lastPriceTraded: 1.54,
                            },
                            exchange: {
                              availableToBack: [
                                { price: "1.01", size: 2000 },
                                { price: "1.02", size: 2001 },
                                { price: "1.03", size: 2002 },
                              ],
                              availableToLay: [
                                { price: "1.01", size: 2000 },
                                { price: "1.02", size: 2001 },
                                { price: "1.03", size: 2002 },
                              ],
                            },
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          };
          setupByRunner(exchangeMarketMockWithoutState);

          const exchangeMarket = await ExchangeMarketService.getPrices("1.1234", 1234, "en", "EUR");

          const expectedMarket = {
            markets: [
              {
                urn: "ppb:excMarket:1.1111",
                status: "OPEN",
                marketId: "1.1111",
                betDelay: 2,
                baseRate: 1.23,
                discountAllowed: 10,
                priceLadderType: "Price Ladder Type Description",
                numberOfWinners: 0,
                bspReconciled: false,
                complete: true,
                turnInPlayEnabled: true,
                inplay: false,
                totalMatched: 1,
              },
            ],
            runners: [
              {
                urn: "ppb:excRunner:1.1111/1234/0",
                market: "ppb:excMarket:1.1111",
                selectionId: 1234,
                back: [
                  { price: "1.01", liquidity: 2000 },
                  { price: "1.02", liquidity: 2001 },
                  { price: "1.03", liquidity: 2002 },
                ],
                lay: [
                  { price: "1.01", liquidity: 2000 },
                  { price: "1.02", liquidity: 2001 },
                  { price: "1.03", liquidity: 2002 },
                ],
                reduction: null,
                date: null,
                status: "ACTIVE",
              },
            ],
          };
          expect(exchangeMarket).toEqual(expectedMarket);
        });
      });

      describe("when market state is not available", () => {
        it("should return the markets without the state property", async () => {
          const exchangeMarketMockWithoutState = {
            eventTypes: [
              {
                eventNodes: [
                  {
                    marketNodes: [
                      {
                        marketId: "1.1111",
                        description: {
                          priceLadderDescription: {
                            type: "Price Ladder Type Description",
                          },
                        },
                        rates: {
                          marketBaseRate: 1.23,
                          discountAllowed: 10,
                        },
                        runners: [
                          {
                            handicap: 0,
                            selectionId: 1234,
                            state: {
                              lastPriceTraded: 1.54,
                              status: "ACTIVE",
                            },
                            exchange: {
                              availableToBack: [
                                { price: "1.01", size: 2000 },
                                { price: "1.02", size: 2001 },
                                { price: "1.03", size: 2002 },
                              ],
                              availableToLay: [
                                { price: "1.01", size: 2000 },
                                { price: "1.02", size: 2001 },
                                { price: "1.03", size: 2002 },
                              ],
                            },
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          };

          setup(exchangeMarketMockWithoutState);

          const exchangeMarket = await ExchangeMarketService.getPrices("1.1234", 1234, "en", "EUR");

          const expectedMarket = {
            markets: [
              {
                urn: "ppb:excMarket:1.1111",
                marketId: "1.1111",
                status: "OPEN",
                totalMatched: 0,
                betDelay: 0,
                priceLadderType: "Price Ladder Type Description",
                baseRate: 1.23,
                discountAllowed: 10,
              },
            ],
            runners: [
              {
                urn: "ppb:excRunner:1.1111/1234/0",
                market: "ppb:excMarket:1.1111",
                selectionId: 1234,
                back: [
                  { price: "1.01", liquidity: 2000 },
                  { price: "1.02", liquidity: 2001 },
                  { price: "1.03", liquidity: 2002 },
                ],
                lay: [
                  { price: "1.01", liquidity: 2000 },
                  { price: "1.02", liquidity: 2001 },
                  { price: "1.03", liquidity: 2002 },
                ],
                date: null,
                reduction: null,
                status: "ACTIVE",
              },
            ],
          };

          expect(exchangeMarket).toEqual(expectedMarket);
        });
      });

      describe("when ERO does not return markets info", () => {
        it("should return default value", async () => {
          setup({ eventTypes: [] });
          const exchangeMarket = await ExchangeMarketService.getPrices(["1.1234"], "en", "EUR");

          expect(exchangeMarket).toEqual({
            markets: [],
            runners: [],
          });
        });
      });
    });

    describe("getRunnerMarketUpdate", () => {
      it("should call getByRunner with correct args", async () => {
        setupByRunner(exchangeMarketMock);
        await ExchangeMarketService.getRunnerMarketUpdate("1.1234", 1234, "en", "EUR");

        expect(ExchangeReadOnly().getByRunner).toHaveBeenCalledWith(
          "1.1234",
          1234,
          [
            "EVENT",
            "MARKET_DESCRIPTION",
            "RUNNER_DESCRIPTION",
            "RUNNER_STATE",
            "RUNNER_EXCHANGE_PRICES_ALL",
            "RUNNER_EXCHANGE_TRADED",
            "RUNNER_SP",
            "MARKET_LINE_RANGE_INFO",
          ],
          { currencyCode: "EUR", locale: "en" },
        );
      });

      describe("when runner is not available", () => {
        it("should return null", async () => {
          const noRunnerMock = {
            eventTypes: [
              {
                eventNodes: [
                  {
                    marketNodes: [
                      {
                        marketId: "1.1111",
                        state: {
                          status: "OPEN",
                          betDelay: 2,
                          numberOfWinners: 0,
                        },
                        runners: [],
                      },
                    ],
                  },
                ],
              },
            ],
          };
          setupByRunner(noRunnerMock);

          const runnerUpdate = await ExchangeMarketService.getRunnerMarketUpdate("1.1234", 1234, "en", "EUR");

          expect(runnerUpdate).toEqual(null);
        });
      });

      describe("when runner exchange prices is not available", () => {
        it("should return null", async () => {
          const noRunnerMock = {
            eventTypes: [
              {
                eventNodes: [
                  {
                    marketNodes: [
                      {
                        marketId: "1.1111",
                        state: {
                          status: "OPEN",
                          betDelay: 2,
                          numberOfWinners: 0,
                        },
                        runners: [
                          {
                            handicap: 0,
                            selectionId: 1234,
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          };
          setupByRunner(noRunnerMock);

          const runnerUpdate = await ExchangeMarketService.getRunnerMarketUpdate("1.1234", 1234, "en", "EUR");

          expect(runnerUpdate).toEqual(null);
        });
      });

      describe("when runner has exchange prices", () => {
        it("should return runner exchange prices", async () => {
          setupByRunner(exchangeMarketMock);
          const runnerUpdate = await ExchangeMarketService.getRunnerMarketUpdate("1.1234", 1234, "en", "EUR");

          expect(runnerUpdate).toEqual({
            urn: "ppb:excRunner:1.1234/1234/0",
            lastPriceTraded: 1.54,
            back: [
              { price: "1.01", liquidity: 2000 },
              { price: "1.02", liquidity: 2001 },
              { price: "1.03", liquidity: 2002 },
            ],
            lay: [
              { price: "1.01", liquidity: 2000 },
              { price: "1.02", liquidity: 2001 },
              { price: "1.03", liquidity: 2002 },
            ],
            traded: [
              { price: "1.01", liquidity: 2000 },
              { price: "1.02", liquidity: 2001 },
              { price: "1.03", liquidity: 2002 },
            ],
            sp: {
              farPrice: 2.0453730154008607,
              nearPrice: 2.222017664556625,
            },
          });
        });
      });
    });
  });
});
