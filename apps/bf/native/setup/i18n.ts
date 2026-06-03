import i18next from "i18next";
import { getLocales } from "react-native-localize";
import { SUPPORTED_LOCALES_MAPPER } from "@ppb/tbd-shared/config/locales";

import danishTranslation from "../generated/translations/da.json";
import germanTranslation from "../generated/translations/de.json";
import englishTranslation from "../generated/translations/en.json";
import britishEnglishTranslation from "../generated/translations/en_GB.json";
import spanishTranslation from "../generated/translations/es.json";
import latinAmericaSpanishTranslation from "../generated/translations/es_419.json";
import finnishTranslation from "../generated/translations/fi.json";
import hungarianTranslation from "../generated/translations/hu.json";
import italianTranslation from "../generated/translations/it.json";
import norwegianTranslation from "../generated/translations/no.json";
import portugueseTranslation from "../generated/translations/pt_BR.json";
import romanianTranslation from "../generated/translations/ro.json";
import russianTranslation from "../generated/translations/ru.json";
import swedishTranslation from "../generated/translations/sv.json";

// Initialize the translations module
export const initI18n = async (): Promise<void> => {
  const deviceLocales = getLocales();
  const { languageTag, languageCode } = deviceLocales.length
    ? deviceLocales[0]
    : { languageTag: "en-GB", languageCode: "en" };

  // Device locales are in the language-REGION format. If not found in supported languages we try to match the language part only.
  const resolvedDeviceLng = SUPPORTED_LOCALES_MAPPER[languageTag] || SUPPORTED_LOCALES_MAPPER[languageCode] || "en-GB";

  i18next.init({
    lng: resolvedDeviceLng,
    fallbackLng: "en-GB",
    resources: {
      da: {
        translation: danishTranslation,
      },
      de: {
        translation: germanTranslation,
      },
      en: {
        translation: englishTranslation,
      },
      "en-GB": {
        translation: britishEnglishTranslation,
      },
      es: {
        translation: spanishTranslation,
      },
      "es-419": {
        translation: latinAmericaSpanishTranslation,
      },
      fi: {
        translation: finnishTranslation,
      },
      hu: {
        translation: hungarianTranslation,
      },
      it: {
        translation: italianTranslation,
      },
      no: {
        translation: norwegianTranslation,
      },
      "pt-BR": {
        translation: portugueseTranslation,
      },
      ro: {
        translation: romanianTranslation,
      },
      ru: {
        translation: russianTranslation,
      },
      sv: {
        translation: swedishTranslation,
      },
    },
    nsSeparator: false,
    keySeparator: false,
    interpolation: { escapeValue: false },
  });
};
