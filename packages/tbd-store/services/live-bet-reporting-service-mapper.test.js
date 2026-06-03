import lbrMapper from "./live-bet-reporting-service-mapper";
import { sanitizeBetId } from "./betting";
import { ExchangeSide } from "../state/constants";

jest.mock("./betting", () => ({
  sanitizeBetId: jest.fn((betId) => betId.replace(/^(1:)/, "")),
}));

describe("Live Bet Reporting Service Mapper", () => {
  describe("mapResponseToInstructionReport", () => {
    describe("when live order summary has betId with product qualifier", () => {
      it("should return report without product qualifier", () => {
        const report = lbrMapper.mapResponseToInstructionReport([
          {
            side: ExchangeSide.LAY,
            persistenceType: "persistenceType",
            betId: "1:123",
            sizeRemaining: 12,
          },
        ]);

        expect(sanitizeBetId).toHaveBeenCalledWith("1:123");

        expect(report).toEqual({
          side: ExchangeSide.LAY,
          betIds: ["123"],
          unmatched: {
            size: 12,
            persistenceType: "persistenceType",
            betId: "123",
            price: 0,
            totalBonusUsed: 0,
          },
        });
      });
    });

    describe("when live order summary does not have sizeMatched or sizeRemaining", () => {
      it("should return report only with side and betIds", () => {
        const report = lbrMapper.mapResponseToInstructionReport([{ side: ExchangeSide.LAY, betId: "betId" }]);
        expect(report).toEqual({
          betIds: ["betId"],
          side: ExchangeSide.LAY,
        });
      });
    });

    describe("when live order summary has sizeMatched", () => {
      describe("when order summary does not have averagePriceMatched or price", () => {
        it("should return report with matched with 0 as price", () => {
          const report = lbrMapper.mapResponseToInstructionReport([
            {
              side: ExchangeSide.LAY,
              persistenceType: "persistenceType",
              betId: "betId",
              sizeMatched: 515,
            },
          ]);

          expect(report).toEqual({
            side: ExchangeSide.LAY,
            betIds: ["betId"],
            matched: {
              size: 515,
              persistenceType: "persistenceType",
              betId: "betId",
              price: 0,
              totalBonusUsed: 0,
            },
          });
        });
      });

      describe("when order summary does not have averagePriceMatched", () => {
        it("should return report with matched with price", () => {
          const report = lbrMapper.mapResponseToInstructionReport([
            {
              side: ExchangeSide.LAY,
              persistenceType: "persistenceType",
              betId: "betId",
              sizeMatched: 515,
              price: 2.02,
            },
          ]);
          expect(report).toEqual({
            side: ExchangeSide.LAY,
            betIds: ["betId"],
            matched: {
              size: 515,
              persistenceType: "persistenceType",
              betId: "betId",
              price: 2.02,
              totalBonusUsed: 0,
            },
          });
        });
      });

      describe("when order summary has averagePriceMatched", () => {
        it("should return report with matched with averagePriceMatched as price", () => {
          const report = lbrMapper.mapResponseToInstructionReport([
            {
              side: ExchangeSide.LAY,
              persistenceType: "persistenceType",
              betId: "betId",
              sizeMatched: 515,
              price: 2.02,
              averagePriceMatched: 3.16,
            },
          ]);

          expect(report).toEqual({
            side: ExchangeSide.LAY,
            betIds: ["betId"],
            matched: {
              size: 515,
              persistenceType: "persistenceType",
              betId: "betId",
              price: 3.16,
              totalBonusUsed: 0,
            },
          });
        });
      });
    });

    describe("when live order summary has sizeRemaining", () => {
      describe("when order summary does not have price", () => {
        it("should return report with matched with 0 as price", () => {
          const report = lbrMapper.mapResponseToInstructionReport([
            {
              side: ExchangeSide.BACK,
              persistenceType: "persistenceType",
              betId: "betId",
              sizeRemaining: 12,
            },
          ]);

          expect(report).toEqual({
            side: ExchangeSide.BACK,
            betIds: ["betId"],
            unmatched: {
              size: 12,
              persistenceType: "persistenceType",
              betId: "betId",
              price: 0,
              totalBonusUsed: 0,
            },
          });
        });
      });

      describe("when order summary has price", () => {
        it("should return report with matched with price", () => {
          const report = lbrMapper.mapResponseToInstructionReport([
            {
              side: ExchangeSide.LAY,
              persistenceType: "persistenceType",
              betId: "betId",
              sizeRemaining: 13,
              price: 2.02,
            },
          ]);

          expect(report).toEqual({
            side: ExchangeSide.LAY,
            betIds: ["betId"],
            unmatched: {
              size: 13,
              persistenceType: "persistenceType",
              betId: "betId",
              price: 2.02,
              totalBonusUsed: 0,
            },
          });
        });
      });
    });

    describe("when live order summary has sizeMatched and sizeRemaining", () => {
      it("should return partially matched report", () => {
        const report = lbrMapper.mapResponseToInstructionReport([
          {
            side: ExchangeSide.BACK,
            persistenceType: "persistenceType",
            betId: "betId",
            sizeMatched: 10.3,
            sizeRemaining: 1.5,
            price: 2.02,
            averagePriceMatched: 3.16,
          },
        ]);

        expect(report).toEqual({
          side: ExchangeSide.BACK,
          betIds: ["betId"],
          matched: {
            size: 10.3,
            persistenceType: "persistenceType",
            betId: "betId",
            price: 3.16,
            totalBonusUsed: 0,
          },
          unmatched: {
            size: 1.5,
            persistenceType: "persistenceType",
            betId: "betId",
            price: 2.02,
            totalBonusUsed: 0,
          },
        });
      });
    });

    describe("when live order summary has isFreeBet", () => {
      describe("when order summary has an unmatched bet", () => {
        it("should return report with unmatched bet with totalBonusUsed", () => {
          const report = lbrMapper.mapResponseToInstructionReport([
            {
              side: ExchangeSide.LAY,
              persistenceType: "persistenceType",
              betId: "betId",
              sizeMatched: 0,
              price: 1.1,
              isFreeBet: true,
              sizeRemaining: 40,
            },
            {
              side: ExchangeSide.LAY,
              persistenceType: "persistenceType",
              betId: "betId2",
              sizeMatched: 0,
              price: 1.1,
              sizeRemaining: 60,
            },
          ]);

          expect(report).toEqual({
            side: ExchangeSide.LAY,
            betIds: ["betId", "betId2"],
            unmatched: {
              size: 100,
              persistenceType: "persistenceType",
              betId: "betId",
              price: 1.1,
              totalBonusUsed: 40,
            },
          });
        });
      });

      describe("when order summary has a matched bet", () => {
        it("should return report with matched bet with totalBonusUsed", () => {
          const report = lbrMapper.mapResponseToInstructionReport([
            {
              side: ExchangeSide.LAY,
              persistenceType: "persistenceType",
              betId: "betId",
              sizeMatched: 40,
              price: 1.1,
              isFreeBet: true,
              sizeRemaining: 0,
            },
            {
              side: ExchangeSide.LAY,
              persistenceType: "persistenceType",
              betId: "betId2",
              sizeMatched: 60,
              price: 1.1,
              sizeRemaining: 0,
            },
          ]);

          expect(report).toEqual({
            side: ExchangeSide.LAY,
            betIds: ["betId", "betId2"],
            matched: {
              size: 100,
              persistenceType: "persistenceType",
              betId: "betId",
              price: 1.1,
              totalBonusUsed: 40,
            },
          });
        });
      });

      describe("when order summary has a partially matched bet", () => {
        it("should return report with both matched and unmatched bets with totalBonusUsed", () => {
          const report = lbrMapper.mapResponseToInstructionReport([
            {
              side: ExchangeSide.LAY,
              persistenceType: "persistenceType",
              betId: "betId",
              sizeMatched: 30,
              price: 1.1,
              isFreeBet: true,
              sizeRemaining: 10,
            },
            {
              side: ExchangeSide.LAY,
              persistenceType: "persistenceType",
              betId: "betId2",
              sizeMatched: 0,
              price: 1.1,
              sizeRemaining: 60,
            },
          ]);

          expect(report).toEqual({
            side: ExchangeSide.LAY,
            betIds: ["betId", "betId2"],
            matched: {
              size: 30,
              persistenceType: "persistenceType",
              betId: "betId",
              price: 1.1,
              totalBonusUsed: 30,
            },
            unmatched: {
              size: 70,
              persistenceType: "persistenceType",
              betId: "betId",
              price: 1.1,
              totalBonusUsed: 10,
            },
          });
        });
      });
    });
  });
});
