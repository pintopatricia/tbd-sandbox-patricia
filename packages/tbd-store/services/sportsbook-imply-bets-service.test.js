import { createClientFactory } from "./client-factory";
import { fetchCombinations } from "./sportsbook-imply-bets-service";

jest.mock("@ppb/platform-services", () => ({
  SportsbookImplyBetsService: jest.fn().mockReturnValue({
    implyBets: jest.fn(),
  }),
}));

const sibMock = {
  implyBets: jest.fn(),
};

jest.mock("./client-factory", () => ({
  createClientFactory: jest.fn(() => () => sibMock),
}));

function setupSib(mock) {
  createClientFactory()().implyBets.mockResolvedValue(mock);
}

describe("SportsbookImplyBetsService", () => {
  afterEach(() => {
    sibMock.implyBets.mockClear();
  });

  it("should expose a fetchCombinations method", () => {
    setupSib([{ respCode: "SUCCESS" }]);
    expect(fetchCombinations).toBeDefined();
  });

  describe("fetchCombinations", () => {
    it("should call sib with all the arguments", async () => {
      setupSib([{ respCode: "SUCCESS" }]);
      await fetchCombinations(
        {
          betLegs: [{ leg: "leg" }],
          includeCashoutEligibility: true,
          locale: "pt_PT",
          pricePolicy: "NORMAL",
          runners: [],
          scope: "MULTIPLES",
        },
        { combinationsGroupLimit: 5, betLegsLimit: 25 },
      );

      expect(sibMock.implyBets).toHaveBeenCalledWith(
        {
          betLegs: [{ leg: "leg" }],
          includeCashoutEligibility: true,
          locale: "pt_PT",
          pricePolicy: "NORMAL",
          runners: [],
          scope: "MULTIPLES",
        },
        { combinationsGroupLimit: 5, betLegsLimit: 25 },
      );
    });

    it("should call sib with options argument", async () => {
      setupSib([{ respCode: "SUCCESS" }]);
      await fetchCombinations({
        betLegs: [{ leg: "leg" }],
        includeCashoutEligibility: true,
        locale: "pt_PT",
        pricePolicy: "NORMAL",
        runners: [],
        scope: "MULTIPLES",
      });

      expect(sibMock.implyBets).toHaveBeenCalledWith(
        {
          betLegs: [{ leg: "leg" }],
          includeCashoutEligibility: true,
          locale: "pt_PT",
          pricePolicy: "NORMAL",
          runners: [],
          scope: "MULTIPLES",
        },
        undefined,
      );
    });

    it("should call sib with combinationsGroup limit", async () => {
      setupSib([{ respCode: "SUCCESS" }]);
      await fetchCombinations({}, { combinationsGroupLimit: 2 });

      expect(sibMock.implyBets).toHaveBeenCalledWith({}, { combinationsGroupLimit: 2 });
    });

    it("should call sib with betLegs limit", async () => {
      setupSib([{ respCode: "SUCCESS" }]);
      await fetchCombinations({}, { betLegsLimit: 20 });

      expect(sibMock.implyBets).toHaveBeenCalledWith({}, { betLegsLimit: 20 });
    });

    it("should call sib without arguments", async () => {
      setupSib([{ respCode: "SUCCESS" }]);
      await fetchCombinations({});

      expect(sibMock.implyBets).toHaveBeenCalledWith({}, undefined);
    });

    describe("when there is no betLegs", () => {
      it("should not call sib and return empty array", async () => {
        setupSib([{ respCode: "SUCCESS" }]);
        const result = await fetchCombinations({ betLegs: [] });

        expect(sibMock.implyBets).not.toHaveBeenCalled();
        expect(result).toEqual([]);
      });
    });

    describe("when the respCode is not SUCCESS", () => {
      it("should throw a General SportsbookImplyError", async () => {
        setupSib([{}]);

        await expect(fetchCombinations({ leg: "leg" })).rejects.toEqual("GENERAL");
      });
    });
  });
});
