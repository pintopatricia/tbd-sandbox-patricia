import { FixedOddsTransactional } from "@flutter-global/uki-channels-http-clients";
import { placeBets, SportsbookTransactionalError } from "./sportsbook-bet-service";

jest.mock("@flutter-global/uki-channels-http-clients", () => ({
  FixedOddsTransactional: jest.fn().mockReturnValue({
    placeBet: jest.fn(),
  }),
}));

jest.mock("./client-factory", () => ({
  createClientFactory: jest.fn(() => FixedOddsTransactional),
}));

function setupFobPlaceBetMock(mock, reject = false) {
  FixedOddsTransactional().placeBet.mockReturnValue(reject ? Promise.reject() : Promise.resolve(mock));
}

const defaultOptions = {
  acceptLowerOdds: false,
  useAvailableBonus: false,
  dryRun: false,
  customerRef: "ref",
  walletAllocationType: "WALLET",
};

async function setupServicePlaceBets(legs, options = defaultOptions) {
  const definitions = [
    {
      betNo: 0,
      stakePerLine: 0.12,
      legs: !legs
        ? [
            {
              betRunners: [{ runner: { marketId: "924.1", selectionId: 123 } }],
              winExpectedOdds: {
                decimalOdds: {
                  decimalOdds: 1.23,
                },
              },
            },
          ]
        : legs,
    },
  ];
  const combinations = [{ betNo: 0, id: "COMB:ID" }];

  return placeBets({ definitions, combinations }, options);
}

describe("Sportsbook Bet Service", () => {
  afterEach(() => {
    FixedOddsTransactional().placeBet.mockClear();
  });

  it("should expose a placeBets method", () => {
    expect(placeBets).toBeDefined();
  });

  describe("placeBets", () => {
    it("should call fob place with the definitions and options", async () => {
      setupFobPlaceBetMock({ respCode: "SUCCESS" });
      const legs = [
        {
          betRunners: [{ runner: { marketId: "924.1", selectionId: 123 } }],
          winExpectedOdds: {
            decimalOdds: {
              decimalOdds: 1.23,
            },
          },
        },
      ];

      await setupServicePlaceBets(legs);

      const expectedDefinitions = [
        {
          betNo: 0,
          stakePerLine: 0.12,
          legs,
        },
      ];

      expect(FixedOddsTransactional().placeBet).toHaveBeenCalledWith(expectedDefinitions, defaultOptions);
    });

    describe("when there are no legs", () => {
      it("should call fob place with the definitions and options", async () => {
        setupFobPlaceBetMock({ respCode: "SUCCESS" });
        await setupServicePlaceBets([]);

        const expectedDefinitions = [
          {
            betNo: 0,
            stakePerLine: 0.12,
            legs: [],
          },
        ];

        expect(FixedOddsTransactional().placeBet).toHaveBeenCalledWith(expectedDefinitions, defaultOptions);
      });
    });

    describe("when there are no runners", () => {
      it("should call fob place with the definitions and options", async () => {
        setupFobPlaceBetMock({ respCode: "SUCCESS" });
        await setupServicePlaceBets([
          {
            winExpectedOdds: {
              decimalOdds: {
                decimalOdds: 1.23,
              },
            },
          },
        ]);

        const expectedDefinitions = [
          {
            betNo: 0,
            stakePerLine: 0.12,
            legs: [
              {
                winExpectedOdds: {
                  decimalOdds: {
                    decimalOdds: 1.23,
                  },
                },
              },
            ],
          },
        ];

        expect(FixedOddsTransactional().placeBet).toHaveBeenCalledWith(expectedDefinitions, defaultOptions);
      });
    });

    describe("when there are no odds", () => {
      it("should call fob place with the definitions and options", async () => {
        setupFobPlaceBetMock({ respCode: "SUCCESS" });
        await setupServicePlaceBets([{}]);

        const expectedDefinitions = [
          {
            betNo: 0,
            stakePerLine: 0.12,
            legs: [{}],
          },
        ];

        expect(FixedOddsTransactional().placeBet).toHaveBeenCalledWith(expectedDefinitions, defaultOptions);
      });
    });

    describe("when bonus is used", () => {
      it("should call fob place with definitions and options", async () => {
        setupFobPlaceBetMock({ respCode: "SUCCESS" });
        const legs = [
          {
            betRunners: [{ runner: { marketId: "924.1", selectionId: 123 } }],
            winExpectedOdds: {
              decimalOdds: {
                decimalOdds: 1.23,
              },
            },
          },
        ];
        const useAvailableBonus = true;
        await setupServicePlaceBets(legs, { ...defaultOptions, useAvailableBonus });

        const expectedDefinitions = [
          {
            betNo: 0,
            stakePerLine: 0.12,
            legs,
          },
        ];

        expect(FixedOddsTransactional().placeBet).toHaveBeenCalledWith(expectedDefinitions, {
          ...defaultOptions,
          useAvailableBonus,
        });
      });
    });

    describe("when dryRun is used", () => {
      it("should call fob place with definitions and options", async () => {
        setupFobPlaceBetMock({ respCode: "SUCCESS" });
        const legs = [
          {
            betRunners: [{ runner: { marketId: "924.1", selectionId: 123 } }],
            winExpectedOdds: {
              decimalOdds: {
                decimalOdds: 1.23,
              },
            },
          },
        ];
        const dryRun = true;
        await setupServicePlaceBets(legs, { ...defaultOptions, dryRun });

        const expectedDefinitions = [
          {
            betNo: 0,
            stakePerLine: 0.12,
            legs,
          },
        ];

        expect(FixedOddsTransactional().placeBet).toHaveBeenCalledWith(expectedDefinitions, {
          ...defaultOptions,
          dryRun,
        });
      });
    });

    describe("when there is a response with a code besides SUCCESS", () => {
      it("should throw a transactional error", async () => {
        setupFobPlaceBetMock({ respCode: "ERROR_CODE" });

        const throwable = async () => setupServicePlaceBets();

        await expect(throwable()).rejects.toThrow(SportsbookTransactionalError);
      });

      it("should include the definitions", async () => {
        setupFobPlaceBetMock({ respCode: "ERROR_CODE" });

        try {
          await setupServicePlaceBets();
        } catch (error) {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(error.definitions).toEqual([
            {
              betNo: 0,
              stakePerLine: 0.12,
              legs: [
                {
                  betRunners: [{ runner: { marketId: "924.1", selectionId: 123 } }],
                  winExpectedOdds: {
                    decimalOdds: {
                      decimalOdds: 1.23,
                    },
                  },
                },
              ],
            },
          ]);
        }
      });

      it("should include the operation", async () => {
        setupFobPlaceBetMock({ respCode: "ERROR_CODE" });

        try {
          await setupServicePlaceBets();
        } catch (error) {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(error.operation).toEqual({ respCode: "ERROR_CODE" });
        }
      });
    });

    describe("when there is a response with SUCCESS", () => {
      it("should return the placeBet response", async () => {
        setupFobPlaceBetMock({ respCode: "SUCCESS", result: ["this_is_a_result"] });

        expect(await setupServicePlaceBets()).toEqual({ respCode: "SUCCESS", result: ["this_is_a_result"] });
      });
    });
  });
});
