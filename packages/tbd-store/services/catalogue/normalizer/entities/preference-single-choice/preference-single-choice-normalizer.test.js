import normalizePreferenceSingleChoiceFragmentIntoPreferenceSingleChoice from "./preference-single-choice-normalizer";

const BFF_RESPONSE = {
  __typename: "PreferenceSingleChoice",
  urn: "ppb:tbd:preference:singleChoice:sportsbookOddsDisplay",
  preferenceKey: "sportsbookOddsDisplay",
  preferenceValues: [
    { translationKey: "I18N.SETTINGS.FRACTIONAL", value: "FRACTIONAL" },
    { translationKey: "I18N.SETTINGS.DECIMAL", value: "DECIMAL" },
  ],
  selectedValueIndex: 0,
};

describe("PreferenceSingleChoice normalizer", () => {
  describe("normalizePreferenceSingleChoiceFragmentIntoPreferenceSingleChoice", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizePreferenceSingleChoiceFragmentIntoPreferenceSingleChoice(BFF_RESPONSE);

      expect(data).toEqual({
        urn: "ppb:tbd:preference:singleChoice:sportsbookOddsDisplay",
        preferenceKey: "sportsbookOddsDisplay",
        preferenceValues: [
          { translationKey: "I18N.SETTINGS.FRACTIONAL", value: "FRACTIONAL" },
          { translationKey: "I18N.SETTINGS.DECIMAL", value: "DECIMAL" },
        ],
        selectedValueIndex: 0,
        typename: "PreferenceSingleChoice",
      });
    });
  });
});
