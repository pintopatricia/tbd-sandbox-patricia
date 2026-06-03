import { CasinoIconName, MarketIconName, SystemIconName } from "@ppb/the-wall-icons";
import { getIconByKey } from "./iconMapper";

describe("getIconByKey", () => {
  it("should return NEW for gameTheme", () => {
    expect(getIconByKey("gameTheme")).toBe(CasinoIconName.NEW);
  });

  it("should return SLOTS for jackpotType", () => {
    expect(getIconByKey("jackpotType")).toBe(CasinoIconName.SLOTS);
  });

  it("should return MARKET_RULES for gameStudio", () => {
    expect(getIconByKey("gameStudio")).toBe(MarketIconName.MARKET_RULES);
  });

  it("should return ARROW_BIG_DOWN for minStake", () => {
    expect(getIconByKey("minStakeWithCurrency")).toBe(SystemIconName.ARROW_BIG_DOWN);
  });

  it("should return ARROW_BIG_UP for maxStake", () => {
    expect(getIconByKey("maxStakeWithCurrency")).toBe(SystemIconName.ARROW_BIG_UP);
  });

  it("should return FEATURES for gameMechanics", () => {
    expect(getIconByKey("gameMechanics")).toBe(CasinoIconName.FEATURES);
  });

  it("should return NOTIFICATION_HELP for gameHelp", () => {
    expect(getIconByKey("gameHelp")).toBe(SystemIconName.NOTIFICATION_HELP);
  });

  it("should return NOTIFICATION_HELP for unknown key", () => {
    expect(getIconByKey("unknown")).toBe(SystemIconName.NOTIFICATION_HELP);
  });
});
