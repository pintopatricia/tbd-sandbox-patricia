import { resolveBetslipDeepLinking } from "./deep-linking-resolver";

const log = jest.fn();

const ENCODED_CHARS = {
  "|": encodeURIComponent("|"),
  "�": encodeURIComponent("�"),
  ",": encodeURIComponent(","),
  ";": encodeURIComponent(";"),
};

describe("resolveBetslipDeepLinking", () => {
  describe("when currentUrl is null", () => {
    it("should return undefined", async () => {
      expect(resolveBetslipDeepLinking(null, log)).toBeUndefined();
    });
  });

  describe("when current url is defined", () => {
    describe("SMX patterns", () => {
      describe.each([
        {
          description: "weird character",
          url: `https://www.betfair.com/anyroute?bets=SIMPLE_SELECTION:924.282663837${ENCODED_CHARS["|"]}48461[${ENCODED_CHARS["�"]}`,
          selections: [{ marketUrn: "ppb:sbkMarket:924.282663837", runnerUrn: "ppb:sbkRunner:924.282663837/48461" }],
        },
        {
          description: "simple",
          url: `/anyroute?bets=SIMPLE_SELECTION:924.282663837${ENCODED_CHARS["|"]}48461`,
          selections: [{ marketUrn: "ppb:sbkMarket:924.282663837", runnerUrn: "ppb:sbkRunner:924.282663837/48461" }],
        },
        {
          description: "multiple pattern (one selection)",
          url: `https://www.betfair.com/anyroute?bets=924.282663837${ENCODED_CHARS["|"]}48461`,
          selections: [{ marketUrn: "ppb:sbkMarket:924.282663837", runnerUrn: "ppb:sbkRunner:924.282663837/48461" }],
        },
        {
          description: "multiple pattern (several selections)",
          url: `anyroute?bets=924.282663837${ENCODED_CHARS["|"]}48461;924.1337${ENCODED_CHARS["|"]}1338`,
          selections: [
            { marketUrn: "ppb:sbkMarket:924.282663837", runnerUrn: "ppb:sbkRunner:924.282663837/48461" },
            { marketUrn: "ppb:sbkMarket:924.1337", runnerUrn: "ppb:sbkRunner:924.1337/1338" },
          ],
        },
      ])("when it's a $description deeplink", ({ url, selections }) => {
        it("should return command with expected selections", () => {
          const result = resolveBetslipDeepLinking(url, log);

          expect(result).toEqual({
            name: "CMD/LOAD_SBK_BETSLIP",
            args: { selections, isBetSharing: false },
          });
        });
      });
    });

    describe("SBW patterns", () => {
      describe.each([
        {
          description: "one selection",
          url: "anyroute?modules=betslip&action=addAffiliateSelection&bssId=1337&bsmId=924.1",
          selections: [{ marketUrn: "ppb:sbkMarket:924.1", runnerUrn: "ppb:sbkRunner:924.1/1337" }],
        },
        {
          description: "several selections",
          url: "https://www.betfair.com/anyroute?modules=betslip&action=addAffiliateSelections&bssId=1337,1338,1339&bsmId=924.1,924.2,924.3",
          selections: [
            { marketUrn: "ppb:sbkMarket:924.1", runnerUrn: "ppb:sbkRunner:924.1/1337" },
            { marketUrn: "ppb:sbkMarket:924.2", runnerUrn: "ppb:sbkRunner:924.2/1338" },
            { marketUrn: "ppb:sbkMarket:924.3", runnerUrn: "ppb:sbkRunner:924.3/1339" },
          ],
        },
        {
          description: "several selections with encoded comma",
          url: `https://www.betfair.com/anyroute?modules=betslip&action=addAffiliateSelections&bssId=1337${ENCODED_CHARS[","]}1338${ENCODED_CHARS[","]}1339&bsmId=924.1${ENCODED_CHARS[","]}924.2${ENCODED_CHARS[","]}924.3`,
          selections: [
            { marketUrn: "ppb:sbkMarket:924.1", runnerUrn: "ppb:sbkRunner:924.1/1337" },
            { marketUrn: "ppb:sbkMarket:924.2", runnerUrn: "ppb:sbkRunner:924.2/1338" },
            { marketUrn: "ppb:sbkMarket:924.3", runnerUrn: "ppb:sbkRunner:924.3/1339" },
          ],
        },
        {
          description: "several selections with encoded semicolon",
          url: `https://www.betfair.com/anyroute?modules=betslip&action=addAffiliateSelections&bssId=1337${ENCODED_CHARS[";"]}1338${ENCODED_CHARS[";"]}1339&bsmId=924.1${ENCODED_CHARS[";"]}924.2${ENCODED_CHARS[";"]}924.3`,
          selections: [
            { marketUrn: "ppb:sbkMarket:924.1", runnerUrn: "ppb:sbkRunner:924.1/1337" },
            { marketUrn: "ppb:sbkMarket:924.2", runnerUrn: "ppb:sbkRunner:924.2/1338" },
            { marketUrn: "ppb:sbkMarket:924.3", runnerUrn: "ppb:sbkRunner:924.3/1339" },
          ],
        },
      ])("when it's a $description deeplink", ({ url, selections }) => {
        it("should return command with expected selections", () => {
          const result = resolveBetslipDeepLinking(url, log);

          expect(result).toEqual({
            name: "CMD/LOAD_SBK_BETSLIP",
            args: { selections, isBetSharing: false },
          });
        });
      });
    });

    describe("and has betsharing as src", () => {
      it("should return command with expected selections and isBetSharing true", () => {
        const url = `anyroute?bets=924.282663837${ENCODED_CHARS["|"]}48461;924.1337${ENCODED_CHARS["|"]}1338&src=betsharing`;
        const selections = [
          { marketUrn: "ppb:sbkMarket:924.282663837", runnerUrn: "ppb:sbkRunner:924.282663837/48461" },
          { marketUrn: "ppb:sbkMarket:924.1337", runnerUrn: "ppb:sbkRunner:924.1337/1338" },
        ];
        const result = resolveBetslipDeepLinking(url, log);

        expect(result).toEqual({
          name: "CMD/LOAD_SBK_BETSLIP",
          args: { selections, isBetSharing: true },
        });
      });
    });
  });

  describe("when url does not have query string", () => {
    it("should return undefined", async () => {
      expect(resolveBetslipDeepLinking("THROW", log)).toBeUndefined();
    });
  });
});
