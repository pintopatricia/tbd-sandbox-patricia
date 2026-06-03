import normalizeTranslatableTextFragmentIntoTranslatableText from "./translatable-text-normalizer";

const BFF_RESPONSE = {
  translated: null,
  translate: {
    key: "I18N.DATE.TOMORROW",
  },
};

describe("TranslatableText Normalizer", () => {
  describe("normalizeTranslatableTextFragmentIntoTranslatableText", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeTranslatableTextFragmentIntoTranslatableText(BFF_RESPONSE);

      expect(data).toEqual({
        translated: undefined,
        translate: {
          key: "I18N.DATE.TOMORROW",
        },
      });
    });
  });
});
