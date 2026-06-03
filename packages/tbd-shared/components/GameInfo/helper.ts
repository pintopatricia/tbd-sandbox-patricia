import { i18n } from "../../helpers/i18n";
import { TranslationKey } from "../../translations/keys";

type TableProperties = {
  gameTheme?: string;
  gameStudio?: string;
  jackpotType?: string;
  minStakeWithCurrency?: string;
  maxStakeWithCurrency?: string;
  gameMechanics?: string[];
};

type InfoPair<T> = {
  key: keyof TranslationKey;
  prop: keyof T;
};

export const getTableContent = (gameInfoProps: TableProperties) => {
  const infoPairs: InfoPair<TableProperties>[] = [
    { key: "I18N.GAME_INFO.THEME", prop: "gameTheme" },
    { key: "I18N.GAME_INFO.PROVIDER", prop: "gameStudio" },
    { key: "I18N.GAME_INFO.JACKPOT", prop: "jackpotType" },
    { key: "I18N.GAME_INFO.MIN_STAKE", prop: "minStakeWithCurrency" },
    { key: "I18N.GAME_INFO.MAX_STAKE", prop: "maxStakeWithCurrency" },
    { key: "I18N.GAME_INFO.KEY_FEATURES", prop: "gameMechanics" },
  ];

  const infoList = infoPairs.map(({ key, prop }) => {
    const rawValue = gameInfoProps[prop];

    const value = Array.isArray(rawValue) ? rawValue.join(", ") : rawValue ?? "";

    return {
      label: i18n({ key }),
      value,
      prop,
    };
  });
  return infoList;
};
