import normalizeByTimeRangeMeetingCardGroupFragmentIntoByTimeRangeMeetingCardGroup from "./by-time-range-meeting-card-group-normalizer";

const BFF_RESPONSE = {
  __typename: "ByTimeRangeMeetingCardGroup",
  urn: "ppb:tbd:cardgroup:bytimerangemeetingcardgroup:4abeeba8",
  displayName: "translation",
  cardGroupTitle: "this is a title",
  icon: "icon",
  meetingItems: {
    edges: [
      {
        node: {
          __typename: "RaceTimeRangeCard",
          urn: "ppb:tbd:card:racetimerange:29970405",
        },
      },
    ],
  },
};

describe("Card group normalizer", () => {
  describe("normalizeByTimeRangeMeetingCardGroupFragmentIntoByTimeRangeMeetingCardGroup", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeByTimeRangeMeetingCardGroupFragmentIntoByTimeRangeMeetingCardGroup(BFF_RESPONSE);

      expect(data).toEqual({
        typename: "ByTimeRangeMeetingCardGroup",
        urn: "ppb:tbd:cardgroup:bytimerangemeetingcardgroup:4abeeba8",
        title: "this is a title",
        displayName: "translation",
        icon: "icon",
        items: [
          {
            typename: "RaceTimeRangeCard",
            urn: "ppb:tbd:card:racetimerange:29970405",
          },
        ],
      });
    });

    it("should correctly transform and return the data object when the title is null", () => {
      const BFF_RESPONSE_NO_TITLE = {
        ...BFF_RESPONSE,
        cardGroupTitle: null,
      };

      const { data } =
        normalizeByTimeRangeMeetingCardGroupFragmentIntoByTimeRangeMeetingCardGroup(BFF_RESPONSE_NO_TITLE);

      expect(data).toEqual({
        typename: "ByTimeRangeMeetingCardGroup",
        urn: "ppb:tbd:cardgroup:bytimerangemeetingcardgroup:4abeeba8",
        title: undefined,
        displayName: "translation",
        icon: "icon",
        items: [
          {
            typename: "RaceTimeRangeCard",
            urn: "ppb:tbd:card:racetimerange:29970405",
          },
        ],
      });
    });

    it("should correctly transform and return the data object when the displayName is null", () => {
      const BFF_RESPONSE_NO_TITLE = {
        ...BFF_RESPONSE,
        displayName: null,
      };

      const { data } =
        normalizeByTimeRangeMeetingCardGroupFragmentIntoByTimeRangeMeetingCardGroup(BFF_RESPONSE_NO_TITLE);

      expect(data).toEqual({
        typename: "ByTimeRangeMeetingCardGroup",
        urn: "ppb:tbd:cardgroup:bytimerangemeetingcardgroup:4abeeba8",
        title: "this is a title",
        icon: "icon",
        displayName: undefined,
        items: [
          {
            typename: "RaceTimeRangeCard",
            urn: "ppb:tbd:card:racetimerange:29970405",
          },
        ],
      });
    });

    it("should correctly transform and return the data object when the icon is null", () => {
      const BFF_RESPONSE_NO_TITLE = {
        ...BFF_RESPONSE,
        icon: null,
      };

      const { data } =
        normalizeByTimeRangeMeetingCardGroupFragmentIntoByTimeRangeMeetingCardGroup(BFF_RESPONSE_NO_TITLE);

      expect(data).toEqual({
        typename: "ByTimeRangeMeetingCardGroup",
        urn: "ppb:tbd:cardgroup:bytimerangemeetingcardgroup:4abeeba8",
        title: "this is a title",
        displayName: "translation",
        icon: undefined,
        items: [
          {
            typename: "RaceTimeRangeCard",
            urn: "ppb:tbd:card:racetimerange:29970405",
          },
        ],
      });
    });

    it("should correctly transform and return the data object when items are null", () => {
      const BFF_RESPONSE_NO_TITLE = {
        ...BFF_RESPONSE,
        meetingItems: { edges: [{ node: {} }] },
      };

      const { data } =
        normalizeByTimeRangeMeetingCardGroupFragmentIntoByTimeRangeMeetingCardGroup(BFF_RESPONSE_NO_TITLE);

      expect(data).toEqual({
        typename: "ByTimeRangeMeetingCardGroup",
        urn: "ppb:tbd:cardgroup:bytimerangemeetingcardgroup:4abeeba8",
        title: "this is a title",
        displayName: "translation",
        icon: "icon",
        items: [],
      });
    });
  });
});
