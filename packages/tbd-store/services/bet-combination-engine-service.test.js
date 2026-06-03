import BetCombinationEngineService from "@flutter-global/uki-channels-http-clients/src/clients/BetCombinationEngineService/BetCombinationEngineService";
import { getCombinationsList } from "./bet-combination-engine-service";

jest.mock(
  "@flutter-global/uki-channels-http-clients/src/clients/BetCombinationEngineService/BetCombinationEngineService",
  () =>
    jest.fn().mockReturnValue({
      getCombinations: jest.fn(() => Promise.resolve({ status: null })),
    }),
);

jest.mock("./client-factory", () => ({
  createClientFactory: jest.fn(() => BetCombinationEngineService),
}));

describe("BetCombinationEngineService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getCombinationsList", () => {
    it("should call getCombinations", async () => {
      BetCombinationEngineService().getCombinations.mockReturnValue(Promise.resolve({ status: "SUCCESS" }));

      await getCombinationsList({ betType: "betTypeMock", selections: "selectionsMock", numberOfCombinations: 42 });

      expect(BetCombinationEngineService().getCombinations).toHaveBeenCalledWith("betTypeMock", "selectionsMock", {
        numberOfCombinations: 42,
      });
      expect(BetCombinationEngineService().getCombinations).toHaveBeenCalledTimes(1);
    });

    describe("when getCombinations throws", () => {
      it("should throw an Error", async () => {
        BetCombinationEngineService().getCombinations.mockReturnValue(
          Promise.resolve({ status: "FAIL", statusDescription: "DESC" }),
        );

        const throwable = async () =>
          getCombinationsList({ betType: "betTypeMock", selections: "selectionsMock", numberOfCombinations: 42 });

        await expect(throwable()).rejects.toThrow(new Error("BCE request FAIL DESC"));
      });
    });

    describe("when getCombinations succeeds", () => {
      it("should return response", async () => {
        BetCombinationEngineService().getCombinations.mockReturnValue(Promise.resolve({ status: "SUCCESS" }));

        const result = await getCombinationsList({
          betType: "betTypeMock",
          selections: "selectionsMock",
          numberOfCombinations: 42,
        });

        expect(result).toStrictEqual({ status: "SUCCESS" });
      });
    });
  });
});
