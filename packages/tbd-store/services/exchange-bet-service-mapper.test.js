import { calc } from "@ppb/bet-engine";
import {
  mapPlaceExecutionToInstructionReport,
  mapReplaceExecutionToInstructionReport,
  mapCancelExecutionToInstructionReport,
  mapUpdateExecutionToInstructionReport,
} from "./exchange-bet-service-mapper";
import { ExchangeSide } from "../state/constants";

jest.mock("@ppb/bet-engine", () => ({
  calc: { liability: jest.fn() },
}));

describe("Exchange Bet Service Mapper", () => {
  describe("mapPlaceExecutionToInstructionReport", () => {
    describe("when instructionReports is undefined", () => {
      it("should throw 'instructionReports must be defined'", () => {
        expect(() => mapPlaceExecutionToInstructionReport({ status: "SUCCESS" })).toThrow(
          "instructionReports must be defined",
        );
      });
    });

    describe("when instructionReports is empty", () => {
      it("should throw 'instructionReports must be defined'", () => {
        expect(() => mapPlaceExecutionToInstructionReport({ status: "SUCCESS", instructionReports: [] })).toThrow(
          "instructionReports must be defined",
        );
      });
    });

    describe("when instructionReports is defined and there's no instruction with orderLimit", () => {
      it("should throw 'limitOrder must be defined'", () => {
        expect(() =>
          mapPlaceExecutionToInstructionReport({
            status: "SUCCESS",
            customerRef: "1585311802485",
            marketId: "1.111111111",
            instructionReports: [
              {
                instruction: {
                  selectionId: 2222222,
                  handicap: 0.0,
                  orderType: "LIMIT",
                  side: "BACK",
                },
                betId: "198837201770",
                placedDate: "2020-03-27T12:23:45.000Z",
                averagePriceMatched: 0.0,
                sizeMatched: 0.0,
                walletId: "999999999",
                status: "SUCCESS",
                orderStatus: "EXECUTABLE",
              },
              {
                instruction: {
                  selectionId: 2222222,
                  handicap: 0.0,
                  orderType: "LIMIT",
                  side: "BACK",
                },
                betId: "198837201771",
                placedDate: "2020-03-27T12:23:45.000Z",
                averagePriceMatched: 0.0,
                sizeMatched: 0.0,
                status: "SUCCESS",
                orderStatus: "EXECUTABLE",
              },
            ],
          }),
        ).toThrow("limitOrder must be defined");
      });
    });

    describe("when instructionReports is defined and there's no instruction with averagePriceMatched", () => {
      it("should throw 'averagePriceMatched must be defined'", () => {
        expect(() =>
          mapPlaceExecutionToInstructionReport({
            status: "SUCCESS",
            customerRef: "1585311802485",
            marketId: "1.111111111",
            instructionReports: [
              {
                instruction: {
                  selectionId: 2222222,
                  handicap: 0.0,
                  limitOrder: { size: 50.0, price: 100.0, persistenceType: "LAPSE" },
                  orderType: "LIMIT",
                  side: "BACK",
                },
                betId: "198837201770",
                placedDate: "2020-03-27T12:23:45.000Z",
                sizeMatched: 0.0,
                walletId: "999999999",
                status: "SUCCESS",
                orderStatus: "EXECUTABLE",
              },
              {
                instruction: {
                  selectionId: 2222222,
                  handicap: 0.0,
                  limitOrder: { size: 10.0, price: 100.0, persistenceType: "LAPSE" },
                  orderType: "LIMIT",
                  side: "BACK",
                },
                betId: "198837201771",
                placedDate: "2020-03-27T12:23:45.000Z",
                sizeMatched: 0.0,
                status: "SUCCESS",
                orderStatus: "EXECUTABLE",
              },
            ],
          }),
        ).toThrow("averagePriceMatched must be defined");
      });
    });

    describe("when instructionReports is defined and there's no betId in one of the instructions", () => {
      it("should build the correct report with empty string as one of the betIds", () => {
        expect(
          mapPlaceExecutionToInstructionReport({
            status: "SUCCESS",
            customerRef: "1585311802485",
            marketId: "1.111111111",
            instructionReports: [
              {
                instruction: {
                  selectionId: 2222222,
                  handicap: 0.0,
                  limitOrder: { size: 50.0, price: 100.0, persistenceType: "LAPSE" },
                  orderType: "LIMIT",
                  side: "BACK",
                },
                betId: "198837201770",
                placedDate: "2020-03-27T12:23:45.000Z",
                averagePriceMatched: 0.0,
                sizeMatched: 0.0,
                walletId: "999999999",
                status: "SUCCESS",
                orderStatus: "EXECUTABLE",
              },
              {
                instruction: {
                  selectionId: 2222222,
                  handicap: 0.0,
                  limitOrder: { size: 10.0, price: 100.0, persistenceType: "LAPSE" },
                  orderType: "LIMIT",
                  side: "BACK",
                },
                betId: undefined,
                placedDate: "2020-03-27T12:23:45.000Z",
                averagePriceMatched: 0.0,
                sizeMatched: 0.0,
                status: "SUCCESS",
                orderStatus: "EXECUTABLE",
              },
            ],
          }),
        ).toEqual({
          side: "BACK",
          betIds: ["198837201770", ""],
          unmatched: {
            betId: "198837201770",
            persistenceType: "LAPSE",
            price: 100,
            size: 60,
          },
          availableBonus: 50.0,
        });
      });
    });

    describe("when instructionReports is eligible", () => {
      it("should build the correct report for Unmatched bets", () => {
        expect(
          mapPlaceExecutionToInstructionReport({
            status: "SUCCESS",
            customerRef: "1585311802485",
            marketId: "1.111111111",
            instructionReports: [
              {
                instruction: {
                  selectionId: 2222222,
                  handicap: 0.0,
                  limitOrder: { size: 50.0, price: 100.0, persistenceType: "LAPSE" },
                  orderType: "LIMIT",
                  side: "BACK",
                },
                betId: "198837201770",
                placedDate: "2020-03-27T12:23:45.000Z",
                averagePriceMatched: 0.0,
                sizeMatched: 0.0,
                bonusUsed: 25.0,
                walletId: "999999999",
                status: "SUCCESS",
                orderStatus: "EXECUTABLE",
              },
              {
                instruction: {
                  selectionId: 2222222,
                  handicap: 0.0,
                  limitOrder: { size: 10.0, price: 100.0, persistenceType: "LAPSE" },
                  orderType: "LIMIT",
                  side: "BACK",
                },
                betId: "198837201771",
                placedDate: "2020-03-27T12:23:45.000Z",
                averagePriceMatched: 0.0,
                sizeMatched: 0.0,
                status: "SUCCESS",
                orderStatus: "EXECUTABLE",
              },
            ],
          }),
        ).toEqual({
          side: "BACK",
          betIds: ["198837201770", "198837201771"],
          unmatched: {
            betId: "198837201770",
            persistenceType: "LAPSE",
            price: 100,
            size: 60,
          },
          availableBonus: 25.0,
        });
      });

      it("should build the correct report for Matched bets", () => {
        expect(
          mapPlaceExecutionToInstructionReport({
            status: "SUCCESS",
            customerRef: "1585311802485",
            marketId: "1.111111111",
            instructionReports: [
              {
                instruction: {
                  selectionId: 2222222,
                  handicap: 0.0,
                  limitOrder: { size: 50.0, price: 100.0, persistenceType: "LAPSE" },
                  orderType: "LIMIT",
                  side: "BACK",
                },
                betId: "198837201770",
                placedDate: "2020-03-27T12:23:45.000Z",
                averagePriceMatched: 100.01,
                sizeMatched: 50.0,
                bonusUsed: 25.0,
                walletId: "999999999",
                status: "SUCCESS",
                orderStatus: "EXECUTION_COMPLETE",
              },
              {
                instruction: {
                  selectionId: 2222222,
                  handicap: 0.0,
                  limitOrder: { size: 10.0, price: 100.0, persistenceType: "LAPSE" },
                  orderType: "LIMIT",
                  side: "BACK",
                },
                betId: "198837201771",
                placedDate: "2020-03-27T12:23:45.000Z",
                averagePriceMatched: 100.01,
                sizeMatched: 10.0,
                status: "SUCCESS",
                orderStatus: "EXECUTION_COMPLETE",
              },
            ],
          }),
        ).toEqual({
          side: "BACK",
          betIds: ["198837201770", "198837201771"],
          matched: {
            betId: "198837201770",
            price: 100.01,
            size: 60,
          },
          availableBonus: 25.0,
        });
      });

      it("should build the correct report for Partial Matched bets", () => {
        expect(
          mapPlaceExecutionToInstructionReport({
            status: "SUCCESS",
            customerRef: "1585311802485",
            marketId: "1.111111111",
            instructionReports: [
              {
                instruction: {
                  selectionId: 2222222,
                  handicap: 0.0,
                  limitOrder: { size: 50.0, price: 100.0, persistenceType: "LAPSE" },
                  orderType: "LIMIT",
                  side: "BACK",
                },
                betId: "198837201770",
                placedDate: "2020-03-27T12:23:45.000Z",
                averagePriceMatched: 100.01,
                sizeMatched: 50.0,
                bonusUsed: 25.0,
                walletId: "999999999",
                status: "SUCCESS",
                orderStatus: "EXECUTION_COMPLETE",
              },
              {
                instruction: {
                  selectionId: 2222222,
                  handicap: 0.0,
                  limitOrder: { size: 10.0, price: 100.0, persistenceType: "LAPSE" },
                  orderType: "LIMIT",
                  side: "BACK",
                },
                betId: "198837201771",
                placedDate: "2020-03-27T12:23:45.000Z",
                averagePriceMatched: 100.01,
                sizeMatched: 3.0,
                status: "SUCCESS",
                orderStatus: "EXECUTABLE",
              },
            ],
          }),
        ).toEqual({
          side: "BACK",
          betIds: ["198837201770", "198837201771"],
          matched: {
            betId: "198837201770",
            price: 100.01,
            size: 53,
          },
          unmatched: {
            betId: "198837201770",
            persistenceType: "LAPSE",
            price: 100,
            size: 7,
          },
          availableBonus: 25.0,
        });
      });
    });
  });

  describe("mapReplaceExecutionToInstructionReport", () => {
    describe("when instructionReports is undefined", () => {
      it("should throw 'instructionReports must be defined'", () => {
        expect(() => mapReplaceExecutionToInstructionReport({ status: "SUCCESS" })).toThrow(
          "instructionReports must be defined",
        );
      });
    });

    describe("when instructionReports is empty", () => {
      it("should throw 'instructionReports must be defined'", () => {
        expect(() => mapReplaceExecutionToInstructionReport({ status: "SUCCESS", instructionReports: [] })).toThrow(
          "instructionReports must be defined",
        );
      });
    });

    describe("when instructionReports is defined and there's no placeInstructionReport", () => {
      it("should throw 'placeInstructionReport must be defined'", () => {
        expect(() =>
          mapReplaceExecutionToInstructionReport({
            status: "SUCCESS",
            customerRef: "1585311802485",
            marketId: "1.111111111",
            instructionReports: [{}],
          }),
        ).toThrow("placeInstructionReport must be defined");
      });
    });

    // Since Replace use the same report mapper as the Place, we will not test the exceptions, only the return
    describe("when instructionReports is defined and have a placeInstructionReport", () => {
      it("should build the correct report taking the same premisses as the Place execution", () => {
        expect(
          mapReplaceExecutionToInstructionReport({
            status: "SUCCESS",
            customerRef: "1585311802485",
            marketId: "1.111111111",
            instructionReports: [
              {
                cancelInstructionReport: {},
                placeInstructionReport: {
                  instruction: {
                    selectionId: 2222222,
                    handicap: 0.0,
                    limitOrder: { size: 50.0, price: 100.0, persistenceType: "LAPSE" },
                    orderType: "LIMIT",
                    side: "BACK",
                  },
                  betId: "198837201770",
                  placedDate: "2020-03-27T12:23:45.000Z",
                  averagePriceMatched: 0.0,
                  sizeMatched: 0.0,
                  walletId: "999999999",
                  status: "SUCCESS",
                  orderStatus: "EXECUTABLE",
                },
              },
            ],
          }),
        ).toEqual({
          side: "BACK",
          betIds: ["198837201770"],
          unmatched: {
            betId: "198837201770",
            persistenceType: "LAPSE",
            price: 100,
            size: 50,
          },
          availableBonus: 50.0,
        });
      });
    });
  });

  describe("mapCancelExecutionToInstructionReport", () => {
    const unmatchedBets = [
      {
        selectionId: 2222222,
        handicap: 0,
        size: 5,
        price: 10,
        orderType: "LIMIT",
        side: ExchangeSide.Lay,
        bonus: 5,
      },
      {
        selectionId: 2222222,
        handicap: 0,
        size: 10,
        price: 10,
        orderType: "LIMIT",
        side: ExchangeSide.Lay,
        bonus: 0,
      },
    ];

    const persistenceType = "LAPSE";

    describe("when instructionReports is undefined", () => {
      it("should throw 'instructionReports must be defined'", () => {
        expect(() =>
          mapCancelExecutionToInstructionReport({ status: "SUCCESS" }, unmatchedBets, persistenceType),
        ).toThrow("instructionReports must be defined");
      });
    });

    describe("when instructionReports is empty", () => {
      it("should throw 'instructionReports must be defined'", () => {
        expect(() =>
          mapCancelExecutionToInstructionReport(
            { status: "SUCCESS", instructionReports: [] },
            unmatchedBets,
            persistenceType,
          ),
        ).toThrow("instructionReports must be defined");
      });
    });

    describe("when instructionReports is defined and the sizeCancelled matches the total bet size", () => {
      it("should build a cancel report", () => {
        expect(
          mapCancelExecutionToInstructionReport(
            {
              customerRef: "1585311802485",
              marketId: "1.111111111",
              instructionReports: [
                {
                  instruction: { betId: "198919435016" },
                  sizeCancelled: 5.0,
                  status: "SUCCESS",
                },
                {
                  instruction: { betId: "198919435017" },
                  sizeCancelled: 10.0,
                  status: "SUCCESS",
                },
              ],
              status: "SUCCESS",
            },
            unmatchedBets,
            persistenceType,
          ),
        ).toEqual({
          side: ExchangeSide.Lay,
          cancelled: {
            price: 10,
            size: 15,
            totalBonusUsed: 5,
          },
        });
      });
    });

    // Since Cancel will use the same report mapper as the Place after the unmatched bet mapping, we will not test the
    // exceptions, only the return
    describe("when instructionReports is defined and the sizeCancelled doesn't matches with the total bet size", () => {
      beforeEach(() => {
        jest.clearAllMocks();
        calc.liability.mockReturnValue(3);
      });

      it("should build the correct report taking the same premisses as the Place execution", () => {
        expect(
          mapCancelExecutionToInstructionReport(
            {
              customerRef: "1585311802485",
              marketId: "1.111111111",
              instructionReports: [
                {
                  instruction: { betId: "198919435016" },
                  sizeCancelled: 2.0,
                  status: "SUCCESS",
                },
              ],
              status: "SUCCESS",
            },
            [unmatchedBets[0]],
            persistenceType,
          ),
        ).toEqual({
          side: ExchangeSide.Lay,
          betIds: ["198919435016"],
          unmatched: {
            betId: "198919435016",
            persistenceType: "LAPSE",
            price: 10,
            size: 3,
          },
          availableBonus: 3.0,
        });
      });

      describe("and unmatched bet has no bonus", () => {
        it("should not call betEngine calc", () => {
          mapCancelExecutionToInstructionReport(
            {
              customerRef: "1585311802485",
              marketId: "1.111111111",
              instructionReports: [
                {
                  instruction: { betId: "198919435016" },
                  sizeCancelled: 2.0,
                  status: "SUCCESS",
                },
              ],
              status: "SUCCESS",
            },
            [unmatchedBets[1]],
            persistenceType,
          );

          expect(calc.liability).not.toHaveBeenCalled();
        });
      });

      describe("and unmatched bet has bonus", () => {
        describe("and the marketInfo is correctly sent", () => {
          it("should call betEngine calc with correct market info", () => {
            mapCancelExecutionToInstructionReport(
              {
                customerRef: "1585311802485",
                marketId: "1.111111111",
                instructionReports: [
                  {
                    instruction: { betId: "198919435016" },
                    sizeCancelled: 2.0,
                    status: "SUCCESS",
                  },
                ],
                status: "SUCCESS",
              },
              [unmatchedBets[0]],
              persistenceType,
              { marketType: "MATCH_ODDS", bettingType: "ODDS" },
            );

            expect(calc.liability).toHaveBeenCalledWith(ExchangeSide.Lay, 3.0, 10, "ODDS", "MATCH_ODDS");
          });
        });

        describe("and the marketInfo is not correctly sent", () => {
          it("should call betEngine calc with market info as empty strings", () => {
            mapCancelExecutionToInstructionReport(
              {
                customerRef: "1585311802485",
                marketId: "1.111111111",
                instructionReports: [
                  {
                    instruction: { betId: "198919435016" },
                    sizeCancelled: 2.0,
                    status: "SUCCESS",
                  },
                ],
                status: "SUCCESS",
              },
              [unmatchedBets[0]],
              persistenceType,
            );

            expect(calc.liability).toHaveBeenCalledWith(ExchangeSide.Lay, 3.0, 10, "", "");
          });
        });
      });
    });
  });

  describe("mapUpdateExecutionToInstructionReport", () => {
    const unmatchedBet = {
      selectionId: 2222222,
      handicap: 0,
      size: 5,
      price: 10,
      orderType: "LIMIT",
      side: ExchangeSide.Lay,
      bonus: 5,
    };

    describe("when instructionReports is undefined", () => {
      it("should throw 'instructionReports must be defined'", () => {
        expect(() => mapUpdateExecutionToInstructionReport({ status: "SUCCESS" }, unmatchedBet)).toThrow(
          "instructionReports must be defined",
        );
      });
    });

    describe("when instructionReports is empty", () => {
      it("should throw 'instructionReports must be defined'", () => {
        expect(() =>
          mapUpdateExecutionToInstructionReport({ status: "SUCCESS", instructionReports: [] }, unmatchedBet),
        ).toThrow("instructionReports must be defined");
      });
    });

    // Since Update will use the same report mapper as the Place after the unmatched bet mapping, we will not test the
    // exceptions, only the return
    describe("when instructionReports is defined and the sizeCancelled matches the total bet size", () => {
      beforeEach(() => {
        calc.liability.mockReturnValue(5);
      });

      it("should build the correct report taking the same premisses as the Place execution", () => {
        expect(
          mapUpdateExecutionToInstructionReport(
            {
              customerRef: "1585311802485",
              marketId: "1.111111111",
              instructionReports: [
                {
                  instruction: {
                    betId: "198919435016",
                    newPersistenceType: "PERSIST",
                  },
                  status: "SUCCESS",
                },
              ],
              status: "SUCCESS",
            },
            unmatchedBet,
          ),
        ).toEqual({
          side: ExchangeSide.Lay,
          betIds: ["198919435016"],
          unmatched: {
            betId: "198919435016",
            persistenceType: "PERSIST",
            price: 10,
            size: 5,
          },
          availableBonus: 5,
        });
      });
    });
  });
});
