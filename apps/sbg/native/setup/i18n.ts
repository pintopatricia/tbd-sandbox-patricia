import i18next from "i18next";
import britishEnglishTranslation from "../generated/translations/en_GB.json";

// Initialize the translations module
export const initI18n = async (): Promise<void> => {
  i18next.init({
    lng: "en-GB",
    fallbackLng: "en-GB",
    resources: {
      "en-GB": {
        translation: britishEnglishTranslation,
      },
    },
    nsSeparator: false,
    keySeparator: false,
    interpolation: { escapeValue: false },
  });
};
