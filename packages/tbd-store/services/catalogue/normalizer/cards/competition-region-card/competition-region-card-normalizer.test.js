import competitionRegionCardNormalizer from "./competition-region-card-normalizer";

jest.mock("../../entities/competitions/competition-normalizer", () => jest.fn());

const BFF_RESPONSE = {
  __typename: "CompetitionRegionCard",
  urn: "ppb:tbd:card:competitionRegion:1",
  competitionRegions: [
    {
      country: {
        urn: "ppb:tbd:country:gbr",
        code: "GBR",
        flag: { vector: "flagGBR" },
      },
      competitionViewLinks: [
        {
          urn: "ppb:tbd:competitionviewlink:1111",
          viewLink: "viewLink:1111",
          competition: {
            urn: "ppb:competition:1111",
          },
        },
      ],
    },
    {
      country: {
        urn: "ppb:tbd:country:es",
        code: "ES",
      },
      competitionViewLinks: [
        {
          urn: "ppb:tbd:competitionviewlink:2222",
          viewLink: "viewLink:2222",
          competition: {
            urn: "ppb:competition:2222",
          },
        },
      ],
    },
  ],
};

describe("CompetitionRegionCard normalizer", () => {
  describe("normalizeCompetitionRegionCardFragmentIntoCompetitionRegionCard", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = competitionRegionCardNormalizer(BFF_RESPONSE);

      expect(data).toEqual({
        urn: "ppb:tbd:card:competitionRegion:1",
        typename: "CompetitionRegionCard",
        competitionRegions: [
          {
            country: { urn: "ppb:tbd:country:gbr", code: "GBR", flag: "flagGBR" },
            competitionViewLinks: [
              {
                urn: "ppb:tbd:competitionviewlink:1111",
                viewLink: "viewLink:1111",
                competition: "ppb:competition:1111",
              },
            ],
          },
          {
            country: { urn: "ppb:tbd:country:es", code: "ES" },
            competitionViewLinks: [
              {
                urn: "ppb:tbd:competitionviewlink:2222",
                viewLink: "viewLink:2222",
                competition: "ppb:competition:2222",
              },
            ],
          },
        ],
      });
    });
  });
});
