import { TranslatableText } from "@ppb/tbd-store/state/layout/cards/Card.types";
import { i18n, TranslateArguments } from "./i18n";

export const buildTranslatableText = (translatableText?: TranslatableText): string | undefined => {
  if (translatableText?.translate) {
    return i18n(translatableText.translate as TranslateArguments);
  }

  return translatableText?.translated;
};
