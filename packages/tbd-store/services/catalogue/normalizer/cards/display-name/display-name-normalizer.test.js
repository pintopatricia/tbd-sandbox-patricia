import victim from "./display-name-normalizer";

const DISPLAY_NAME_TITLE = {
  __typename: "DisplayNameTitle",
  name: "RandomName",
};

const DISPLAY_NAME_TRANSLATION_KEY = {
  __typename: "DisplayNameTranslationKey",
  translationKey: "I18N.RANDOM.KEY",
};

describe("DisplayName normalizer", () => {
  describe("normalizeDisplayNameFragmentIntoDisplayName", () => {
    it("should correctly transform the DisplayName into a string", () => {
      const data = victim(DISPLAY_NAME_TITLE);

      expect(data).toEqual("RandomName");
    });

    it("should correctly transform the DisplayName into a translation key", () => {
      const data = victim(DISPLAY_NAME_TRANSLATION_KEY);

      expect(data).toEqual("I18N.RANDOM.KEY");
    });
  });
});
