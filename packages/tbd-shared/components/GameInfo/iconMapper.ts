import { CasinoIconName, MarketIconName, SystemIconName } from "@ppb/the-wall-icons";

export const getIconByKey = (prop: string) => {
  switch (prop) {
    case "gameTheme":
      return CasinoIconName.NEW;
    case "jackpotType":
      return CasinoIconName.SLOTS;
    case "gameStudio":
      return MarketIconName.MARKET_RULES;
    case "minStakeWithCurrency":
      return SystemIconName.ARROW_BIG_DOWN;
    case "maxStakeWithCurrency":
      return SystemIconName.ARROW_BIG_UP;
    case "gameMechanics":
      return CasinoIconName.FEATURES;
    case "gameHelp":
      return SystemIconName.NOTIFICATION_HELP;
    default:
      return SystemIconName.NOTIFICATION_HELP;
  }
};
