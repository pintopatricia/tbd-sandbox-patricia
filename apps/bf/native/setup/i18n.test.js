import i18next from "i18next";
import { getLocales } from "react-native-localize";

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
import { initI18n } from "./i18n";

jest.mock("i18next", () => ({
  t: jest.fn(),
  init: jest.fn(),
}));

jest.mock("react-native-localize", () => ({
  getLocales: jest.fn(),
}));

const TRANSLATION_OPTIONS = {
  lng: "en-GB",
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
};

describe("i18n setup", () => {
  beforeEach(jest.clearAllMocks);

  describe("initI18n", () => {
    describe("when device doesn't return any locale", () => {
      beforeEach(async () => {
        getLocales.mockReturnValue([]);
        await initI18n();
      });

      it("should call i18next init with the correct parameters", () => {
        expect(i18next.init).toHaveBeenCalledWith(TRANSLATION_OPTIONS);
      });
    });

    describe("when device locale is not supported", () => {
      beforeEach(async () => {
        getLocales.mockReturnValue([{ languageTag: "fr-FR", languageCode: "fr" }]);
        await initI18n();
      });

      it("should call i18next init with the correct parameters", () => {
        expect(i18next.init).toHaveBeenCalledWith(TRANSLATION_OPTIONS);
      });
    });

    describe("when device locale is supported", () => {
      beforeEach(async () => {
        getLocales.mockReturnValue([{ languageTag: "pt-BR", languageCode: "pt" }]);
        await initI18n();
      });

      it("should call i18next init with the correct parameters", () => {
        expect(i18next.init).toHaveBeenCalledWith({ ...TRANSLATION_OPTIONS, lng: "pt-BR" });
      });
    });

    describe("when device locale is mapped to a different locale", () => {
      beforeEach(async () => {
        getLocales.mockReturnValue([{ languageTag: "es-US", languageCode: "es" }]);
        await initI18n();
      });

      it("should call i18next init with the correct parameters", () => {
        expect(i18next.init).toHaveBeenCalledWith({ ...TRANSLATION_OPTIONS, lng: "es-419" });
      });
    });

    describe("when only device language is supported", () => {
      beforeEach(async () => {
        getLocales.mockReturnValue([{ languageTag: "hu-HU", languageCode: "hu" }]);
        await initI18n();
      });

      it("should call i18next init with the correct parameters", () => {
        expect(i18next.init).toHaveBeenCalledWith({ ...TRANSLATION_OPTIONS, lng: "hu" });
      });
    });
  });
});
