import normalizePreferenceSingleChoiceCardFragmentIntoPreferenceSingleChoiceCard from "./preference-single-choice-card-normalizer";

const BFF_RESPONSE = {
  __typename: "PreferenceSingleChoiceCard",
  urn: "ppb:tbd:card:preference:singleChoice:sportsbookOddsDisplay",
  title: "I18N.SETTINGS.SPORTSBOOK_ODDS_DISPLAY.TITLE",
  description: "I18N.SETTINGS.SPORTSBOOK_ODDS_DISPLAY.DESCRIPTION",
  preference: {
    urn: "ppb:tbd:preference:singleChoice:sportsbookOddsDisplay",
  },
  cardLayout: undefined,
};

describe("PreferenceSingleChoiceCard normalizer", () => {
  describe("normalizePreferenceSingleChoiceCardFragmentIntoPreferenceSingleChoiceCard", () => {
    it("should correctly transform and return the data object for radio component", () => {
      const { data } = normalizePreferenceSingleChoiceCardFragmentIntoPreferenceSingleChoiceCard(BFF_RESPONSE);

      expect(data).toEqual({
        urn: "ppb:tbd:card:preference:singleChoice:sportsbookOddsDisplay",
        title: "I18N.SETTINGS.SPORTSBOOK_ODDS_DISPLAY.TITLE",
        description: "I18N.SETTINGS.SPORTSBOOK_ODDS_DISPLAY.DESCRIPTION",
        layout: "RADIO",
        preferenceURN: "ppb:tbd:preference:singleChoice:sportsbookOddsDisplay",
        typename: "PreferenceSingleChoiceCard",
      });
    });

    describe("when has layout type on urn", () => {
      beforeAll(() => {
        BFF_RESPONSE.urn = "ppb:tbd:card:preference:singleChoice:sportsbookOddsDisplay|SEGMENTED";
        BFF_RESPONSE.cardLayout = "SEGMENTED";
      });

      it("should correctly transform and return the data object for segmented component", () => {
        const { data } = normalizePreferenceSingleChoiceCardFragmentIntoPreferenceSingleChoiceCard(BFF_RESPONSE);

        expect(data).toEqual({
          urn: "ppb:tbd:card:preference:singleChoice:sportsbookOddsDisplay|SEGMENTED",
          title: "I18N.SETTINGS.SPORTSBOOK_ODDS_DISPLAY.TITLE",
          description: "I18N.SETTINGS.SPORTSBOOK_ODDS_DISPLAY.DESCRIPTION",
          layout: "SEGMENTED",
          preferenceURN: "ppb:tbd:preference:singleChoice:sportsbookOddsDisplay",
          typename: "PreferenceSingleChoiceCard",
        });
      });
    });
  });
});
