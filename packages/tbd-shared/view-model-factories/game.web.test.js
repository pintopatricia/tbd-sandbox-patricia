import { getImagePath } from "./game.web";

describe("getImagePath", () => {
  beforeEach(() => {
    window.__TBD_ENVIRONMENT__ = {
      ASSETS: { HOST: "http://localhost", BASE_PATH: "http://localhost/betting/assets" },
    };
  });

  it("should return the normalized jackpot path", () => {
    expect(getImagePath("daily_jackpot")).toEqual("http://localhost/betting/assets/daily_jackpot.png");
  });

  it("should return undefined if JackpotLogo has no value", () => {
    expect(getImagePath(undefined)).toEqual(undefined);
  });
});
