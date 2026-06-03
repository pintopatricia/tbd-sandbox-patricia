import i18next from "i18next";
import { TranslationKey } from "../translations/keys";

export type TranslateArguments = {
  key: keyof TranslationKey;
  interpolationValues?: {
    [key: string]: string | number;
  };
};

export const i18n = ({ key, interpolationValues = {} }: TranslateArguments): string =>
  i18next.t(key, interpolationValues);
