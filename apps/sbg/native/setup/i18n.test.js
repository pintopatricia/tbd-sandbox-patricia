import i18next from "i18next";
import britishEnglishTranslation from "../generated/translations/en_GB.json";
import { initI18n } from "./i18n";

jest.mock("i18next", () => ({
  t: jest.fn(),
  init: jest.fn(),
}));

const TRANSLATION_OPTIONS = {
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
};

describe("i18n setup", () => {
  beforeEach(jest.clearAllMocks);

  describe("initI18n", () => {
    it("should call i18next init with the correct parameters", async () => {
      await initI18n();
      expect(i18next.init).toHaveBeenCalledWith(TRANSLATION_OPTIONS);
    });
  });
});
