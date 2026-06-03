import { FixedOddsReadOnly, utils } from "@flutter-global/uki-channels-http-clients";
import SportsbookMarketService from "./sportsbook-market-service";
import { getSportsbookMarketStatus, getSportsbookRunnerStatus } from "./types-converter";

jest.mock("@flutter-global/uki-channels-http-clients", () => ({
  FixedOddsReadOnly: jest.fn().mockReturnValue({
    getMarketPrices: jest.fn(),
  }),
  utils: {
    splitIntoChunks: jest.fn(),
  },
}));

jest.mock("./client-factory", () => ({
  createClientFactory: jest.fn(() => FixedOddsReadOnly),
}));

jest.mock("./types-converter", () => ({
  getSportsbookMarketStatus: jest.fn().mockReturnValue("OPEN"),
  getSportsbookRunnerStatus: jest.fn().mockReturnValue("ACTIVE"),
}));

const getSportsbookMarketMock = [
  {
    marketId: "924.1111",
    marketStatus: "OPEN",
    eachwayAvailable: false,
    guaranteedPriceAvailable: false,
    inplay: false,
    runnerDetails: [
      {
        selectionId: 1234,
        handicap: -3.5,
        runnerStatus: "ACTIVE",
        winRunnerOdds: {
          decimalDisplayOdds: {
            decimalOdds: 2,
          },
          fractionalDisplayOdds: {
            numerator: 1,
            denominator: 2,
          },
          trueOdds: {
            decimalOdds: {
              decimalOdds: 2.0001,
            },
            fractionalOdds: {
              numerator: 1,
              denominator: 2,
            },
          },
        },
      },
    ],
  },
];

const sportsbookMarketWithEachWayMock = [
  {
    marketId: "924.1111",
    marketStatus: "OPEN",
    eachwayAvailable: true,
    guaranteedPriceAvailable: true,
    inplay: false,
    numberOfPlaces: 4,
    placeFraction: { numerator: 1, denominator: 4 },
    runnerDetails: [
      {
        handicap: 4,
        selectionId: 1234,
        runnerStatus: "ACTIVE",
        winRunnerOdds: {
          decimalDisplayOdds: {
            decimalOdds: 2,
          },
          fractionalDisplayOdds: {
            numerator: 1,
            denominator: 2,
          },
        },
        eachwayRunnerOdds: {
          trueOdds: {
            decimalOdds: { decimalOdds: 4 },
            fractionalOdds: {
              numerator: 2,
              denominator: 4,
            },
          },
          decimalDisplayOdds: { decimalOdds: 4 },
          fractionalDisplayOdds: {
            numerator: 2,
            denominator: 4,
          },
        },
      },
    ],
  },
];

const mockWithPreviousWinRunnerOddsDecimalAsUndefined = [
  {
    marketId: "924.1111",
    marketStatus: "OPEN",
    runnerDetails: [
      {
        handicap: -1,
        selectionId: 1234,
        runnerStatus: "ACTIVE",
        winRunnerOdds: {
          decimalDisplayOdds: {
            decimalOdds: 2,
          },
          fractionalDisplayOdds: {
            numerator: 1,
            denominator: 2,
          },
        },
        previousWinRunnerOdds: [
          {
            decimalDisplayOdds: undefined,
            fractionalDisplayOdds: {
              numerator: 1,
              denominator: 2,
            },
          },
          {
            decimalDisplayOdds: {
              decimalOdds: 1,
            },
            fractionalDisplayOdds: {
              numerator: 1,
              denominator: 2,
            },
          },
        ],
      },
    ],
  },
];

const mockWithPreviousWinRunnerOddsFractionalAsUndefined = [
  {
    marketId: "924.1111",
    marketStatus: "OPEN",
    runnerDetails: [
      {
        selectionId: 1234,
        runnerStatus: "ACTIVE",
        winRunnerOdds: {
          decimalDisplayOdds: {
            decimalOdds: 2,
          },
          fractionalDisplayOdds: {
            numerator: 1,
            denominator: 2,
          },
        },
        previousWinRunnerOdds: [
          {
            decimalDisplayOdds: {
              decimalOdds: 2,
            },
            fractionalDisplayOdds: undefined,
          },
        ],
      },
    ],
  },
];

const mockWithPreviousWinRunnerOdds = [
  {
    marketId: "924.1111",
    marketStatus: "OPEN",
    runnerDetails: [
      {
        handicap: 0,
        selectionId: 1234,
        runnerStatus: "ACTIVE",
        winRunnerOdds: {
          decimalDisplayOdds: {
            decimalOdds: 2,
          },
          fractionalDisplayOdds: {
            numerator: 1,
            denominator: 2,
          },
          americanDisplayOdds: {
            americanOddsInt: 100,
          },
        },
        previousWinRunnerOdds: [
          {
            decimalDisplayOdds: {
              decimalOdds: 2,
            },
            fractionalDisplayOdds: {
              numerator: 1,
              denominator: 2,
            },
            americanDisplayOdds: {
              americanOddsInt: 101,
            },
          },
        ],
      },
    ],
  },
];

function setup(mock) {
  FixedOddsReadOnly().getMarketPrices.mockReturnValue(Promise.resolve(mock));
}

describe("SportsbookMarketService", () => {
  describe("API", () => {
    it("should expose a getPrices method", () => {
      expect(SportsbookMarketService.getPrices).toBeDefined();
    });
  });

  describe("Behaviour", () => {
    describe("getPrices", () => {
      describe("when number of markets do not exceed the limit", () => {
        beforeEach(async () => {
          jest.clearAllMocks();
          utils.splitIntoChunks.mockReturnValue([["1.1234"]]);
          setup([]);

          await SportsbookMarketService.getPrices(["1.1234"], 1);
        });

        it("should split marketIds into chunks", () => {
          expect(utils.splitIntoChunks).toHaveBeenCalledWith(["1.1234"], 70);
        });

        it("should make a single request", () => {
          expect(FixedOddsReadOnly().getMarketPrices.mock.calls.length).toEqual(1);
        });

        it("should use SMP service to get prices", () => {
          expect(FixedOddsReadOnly().getMarketPrices).toHaveBeenCalledWith(["1.1234"], { priceHistory: 1 });
        });

        it("should use SMP service to get prices with 0 as default price history", async () => {
          setup([]);

          await SportsbookMarketService.getPrices(["1.1234"]);

          expect(FixedOddsReadOnly().getMarketPrices).toHaveBeenCalledWith(["1.1234"], { priceHistory: 0 });
        });

        it("should return sportsbook prices", async () => {
          setup(getSportsbookMarketMock);

          const sportsbookMarket = await SportsbookMarketService.getPrices(["924.11111"]);

          const expectedMarket = {
            markets: [
              {
                urn: "ppb:sbkMarket:924.1111",
                status: "OPEN",
                marketId: "924.1111",
                eachWayAvailable: false,
                guaranteedPriceAvailable: false,
                inplay: false,
              },
            ],
            runners: [
              {
                urn: "ppb:sbkRunner:924.1111/1234",
                market: "ppb:sbkMarket:924.1111",
                selectionId: 1234,
                handicap: -3.5,
                status: "ACTIVE",
                odds: {
                  decimal: 2,
                  fractional: {
                    numerator: 1,
                    denominator: 2,
                  },
                },
                trueOdds: {
                  decimal: 2.0001,
                  fractional: {
                    numerator: 1,
                    denominator: 2,
                  },
                },
                previousOdds: undefined,
              },
            ],
            runnerDetails: {},
          };

          expect(sportsbookMarket).toEqual(expectedMarket);
        });

        it("should return sportsbook prices when previousWinRunnerOdds has one decimal as undefined and other defined", async () => {
          setup(mockWithPreviousWinRunnerOddsDecimalAsUndefined);

          const sportsbookMarket = await SportsbookMarketService.getPrices(["924.11111"]);

          const expectedMarket = {
            markets: [{ urn: "ppb:sbkMarket:924.1111", status: "OPEN", marketId: "924.1111" }],
            runners: [
              {
                urn: "ppb:sbkRunner:924.1111/1234",
                market: "ppb:sbkMarket:924.1111",
                selectionId: 1234,
                handicap: -1,
                status: "ACTIVE",
                odds: {
                  decimal: 2,
                  fractional: {
                    numerator: 1,
                    denominator: 2,
                  },
                },
                previousOdds: [
                  {
                    decimal: 1,
                    fractional: {
                      numerator: 1,
                      denominator: 2,
                    },
                  },
                ],
              },
            ],
            runnerDetails: {},
          };

          expect(sportsbookMarket).toEqual(expectedMarket);
        });

        it("should return runnerDetails when the market betting type is 'MOVING_HANDICAP'", async () => {
          setup([
            {
              ...getSportsbookMarketMock[0],
              bettingType: "MOVING_HANDICAP",
            },
          ]);

          const sportsbookMarket = await SportsbookMarketService.getPrices(["924.11111"]);

          expect(sportsbookMarket.runnerDetails).toEqual({
            "ppb:sbkMarket:924.1111": getSportsbookMarketMock[0].runnerDetails,
          });
        });

        it("should return sportsbook prices when previousWinRunnerOdds has fractional as undefined", async () => {
          setup(mockWithPreviousWinRunnerOddsFractionalAsUndefined);

          const sportsbookMarket = await SportsbookMarketService.getPrices(["924.11111"]);

          const expectedMarket = {
            markets: [{ urn: "ppb:sbkMarket:924.1111", status: "OPEN", marketId: "924.1111" }],
            runners: [
              {
                urn: "ppb:sbkRunner:924.1111/1234",
                market: "ppb:sbkMarket:924.1111",
                selectionId: 1234,
                status: "ACTIVE",
                odds: {
                  decimal: 2,
                  fractional: {
                    numerator: 1,
                    denominator: 2,
                  },
                },
                previousOdds: [],
              },
            ],
            runnerDetails: {},
          };

          expect(sportsbookMarket).toEqual(expectedMarket);
        });

        it("should return sportsbook prices when previousWinRunnerOdds is returned", async () => {
          setup(mockWithPreviousWinRunnerOdds);

          const sportsbookMarket = await SportsbookMarketService.getPrices(["924.11111"]);

          const expectedMarket = {
            markets: [{ urn: "ppb:sbkMarket:924.1111", status: "OPEN", marketId: "924.1111" }],
            runners: [
              {
                urn: "ppb:sbkRunner:924.1111/1234",
                market: "ppb:sbkMarket:924.1111",
                selectionId: 1234,
                handicap: 0,
                status: "ACTIVE",
                odds: {
                  decimal: 2,
                  fractional: {
                    numerator: 1,
                    denominator: 2,
                  },
                  american: 100,
                },
                previousOdds: [
                  {
                    decimal: 2,
                    fractional: {
                      numerator: 1,
                      denominator: 2,
                    },
                    american: 101,
                  },
                ],
              },
            ],
            runnerDetails: {},
          };

          expect(sportsbookMarket).toEqual(expectedMarket);
        });

        it("should return eachway prices when eachway is available", async () => {
          setup(sportsbookMarketWithEachWayMock);

          const sportsbookMarket = await SportsbookMarketService.getPrices(["924.11111"]);

          const expectedMarket = {
            markets: [
              {
                urn: "ppb:sbkMarket:924.1111",
                status: "OPEN",
                marketId: "924.1111",
                eachWayAvailable: true,
                guaranteedPriceAvailable: true,
                inplay: false,
                eachWayPlaces: 4,
                eachWayPlaceFraction: { numerator: 1, denominator: 4 },
              },
            ],
            runners: [
              {
                urn: "ppb:sbkRunner:924.1111/1234",
                market: "ppb:sbkMarket:924.1111",
                selectionId: 1234,
                handicap: 4,
                status: "ACTIVE",
                odds: {
                  decimal: 2,
                  fractional: {
                    numerator: 1,
                    denominator: 2,
                  },
                },
                previousOdds: undefined,
                eachWayOdds: {
                  trueOdds: {
                    decimal: 4,
                    fractional: { numerator: 2, denominator: 4 },
                  },
                  displayDecimal: 4,
                  displayFractional: { numerator: 2, denominator: 4 },
                },
              },
            ],
            runnerDetails: {},
          };

          expect(sportsbookMarket).toEqual(expectedMarket);
        });

        it("should convert marketStatus to app ENUM", async () => {
          setup(getSportsbookMarketMock);
          await SportsbookMarketService.getPrices(["924.11111"]);
          expect(getSportsbookMarketStatus).toHaveBeenCalledWith("OPEN");
        });

        it("should convert runnerStatus to app ENUM", async () => {
          setup(getSportsbookMarketMock);
          await SportsbookMarketService.getPrices(["924.11111"]);
          expect(getSportsbookRunnerStatus).toHaveBeenCalledWith("ACTIVE");
        });
      });

      describe("when number of markets exceed the limit (70)", () => {
        const arrayToSplit = new Array(71);

        beforeEach(async () => {
          jest.clearAllMocks();
          utils.splitIntoChunks.mockReturnValue([["1.1234"], ["1.4321"]]);
          setup([]);

          await SportsbookMarketService.getPrices(arrayToSplit, 1);
        });

        it("should split requested markets into chunks", () => {
          expect(utils.splitIntoChunks).toHaveBeenCalledWith(arrayToSplit, 70);
        });

        it("should make more than one request", () => {
          expect(FixedOddsReadOnly().getMarketPrices.mock.calls.length).toEqual(2);
        });

        it("should use SMP service to get prices", () => {
          expect(FixedOddsReadOnly().getMarketPrices.mock.calls[0][0]).toEqual(["1.1234"], { priceHistory: 1 });
          expect(FixedOddsReadOnly().getMarketPrices.mock.calls[1][0]).toEqual(["1.4321"], { priceHistory: 1 });
        });
      });
    });
  });
});
