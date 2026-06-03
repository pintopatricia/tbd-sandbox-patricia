import { getAssets } from "@ppb/tbd-store/config/assets-config";
import { getJackpotLogo } from "./game-native";

const fakeJackpotLogoURL = "https://www.qa.com.betfair/betting/assets/daily_jackpot.png";

jest.mock("@ppb/tbd-store/config/assets-config", () => ({
  getAssets: jest.fn().mockReturnValue({
    BASE_PATH: "https://www.qa.com.betfair/betting/assets",
  }),
}));

describe("getJackpotLogo", () => {
  describe("when assets config is not defined", () => {
    it("should return undefined", () => {
      getAssets.mockImplementationOnce(() => undefined);
      expect(getJackpotLogo("daily_jackpot")).toEqual(undefined);
    });
  });

  describe("when assets config has BASE_PATH undefined", () => {
    it("should return undefined", () => {
      getAssets.mockImplementationOnce(() => ({}));
      expect(getJackpotLogo("daily_jackpot")).toEqual(undefined);
    });
  });

  describe("when jackpot type is not defined", () => {
    it("should return undefined if no jackpot logo is specified", () => {
      expect(getJackpotLogo("")).toEqual(undefined);
    });
  });

  describe("when jackpot type is defined", () => {
    it("should return the jackpot asset URL", () => {
      expect(getJackpotLogo("daily_jackpot")).toEqual(fakeJackpotLogoURL);
    });
  });
});
