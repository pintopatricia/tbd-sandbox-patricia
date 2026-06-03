import BetLiveHipotheticalsClient from "../clients/blh/bet-live-hypotheticals-client";
import BetLiveHipotheticalsService from "./bet-live-hypotheticals-service";

const getBetsResultSpy = BetLiveHipotheticalsClient().getBetsResult;
const mockURN = "123";

jest.mock("../clients/blh/bet-live-hypotheticals-client", () => {
  const getBetsResult = jest.fn(() => Promise.resolve({ betsResult: [{ foo: "bar" }] }));

  return jest.fn().mockReturnValue({
    getBetsResult,
  });
});

jest.mock("./client-factory", () => ({
  createClientFactory: jest.fn(() => BetLiveHipotheticalsClient),
}));

describe("BetLiveHipotheticalsService", () => {
  describe("API", () => {
    it("should expose a getBetsResult method", () => {
      expect(BetLiveHipotheticalsService.getBetsResult).toBeDefined();
    });
  });

  describe("Behaviour", () => {
    describe("getBetsResult", () => {
      let result;
      beforeAll(async () => {
        result = await BetLiveHipotheticalsService.getBetsResult({
          urnList: [mockURN],
          bets: [
            {
              betType: "SINGLE",
              legs: [
                {
                  legNumber: "1",
                  runners: [{ id: "123123456", result: "LOSE", marketId: "929.12991182" }],
                },
              ],
            },
          ],
        });
      });

      it("should call BetLiveHipotheticalsClient with the valid bets", () => {
        expect(getBetsResultSpy).toHaveBeenCalledWith({
          bets: [
            {
              betType: "SINGLE",
              legs: [
                {
                  legNumber: "1",
                  runners: [{ id: "123123456", result: "LOSE", marketId: "929.12991182" }],
                },
              ],
            },
          ],
        });
      });
      it("should return the bets and legs results", () => {
        expect(result).toEqual([{ foo: "bar", urn: "123" }]);
      });
    });
  });
});
