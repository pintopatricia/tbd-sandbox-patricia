import { buildBetslipAddBetsDeepLink } from "./deep-links";

const basePathMock = "https://www.betfair.com/betting";

describe("buildBetslipAddBetsDeepLink", () => {
  describe("when a basePath is not provided", () => {
    describe("and no bet parts are provided", () => {
      it("should return an empty string", () => {
        expect(buildBetslipAddBetsDeepLink()).toBe("");
      });
    });

    describe("and the bet is a single", () => {
      it("should return the query string", () => {
        expect(buildBetslipAddBetsDeepLink([{ marketId: "924.365670042", selectionId: 48785 }])).toBe(
          "?bets=924.365670042%7C48785",
        );
      });
    });

    describe("and the bet is a multiple", () => {
      it("should return the query string", () => {
        expect(
          buildBetslipAddBetsDeepLink([
            { marketId: "924.365670042", selectionId: 48785 },
            { marketId: "924.365670043", selectionId: 48786 },
            { marketId: "924.365670044", selectionId: 48787 },
          ]),
        ).toBe("?bets=924.365670042%7C48785;924.365670043%7C48786;924.365670044%7C48787");
      });
    });
  });

  describe("when a basePath is provided", () => {
    describe("and no bet parts are provided", () => {
      it("should return the provided basePath", () => {
        expect(buildBetslipAddBetsDeepLink(undefined, basePathMock)).toBe(basePathMock);
      });
    });

    describe("and the bet is a single", () => {
      it("should return the correct deep link", () => {
        expect(buildBetslipAddBetsDeepLink([{ marketId: "924.365670042", selectionId: 48785 }], basePathMock)).toBe(
          "https://www.betfair.com/betting?bets=924.365670042%7C48785",
        );
      });
    });

    describe("and the bet is a multiple", () => {
      it("should return the correct deep link", () => {
        expect(
          buildBetslipAddBetsDeepLink(
            [
              { marketId: "924.365670042", selectionId: 48785 },
              { marketId: "924.365670043", selectionId: 48786 },
              { marketId: "924.365670044", selectionId: 48787 },
            ],
            basePathMock,
          ),
        ).toBe(
          "https://www.betfair.com/betting?bets=924.365670042%7C48785;924.365670043%7C48786;924.365670044%7C48787",
        );
      });
    });
  });
});
