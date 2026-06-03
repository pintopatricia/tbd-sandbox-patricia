import normalizeSportsbookExpandableLegCardGroupFragmentIntoSportsbookExpandableLegCardGroup from "./sportsbook-expandable-legs-card-group-normalizer";

const BFF_SEGMENT = {
  __typename: "SportsbookExpandableLegCardGroup",
  urn: "ppb:tbd:cardgroup:sbkExpandableLeg:1180181556",
  full: {
    edges: [
      {
        node: {
          __typename: "SportsbookBetLegCardGroup",
          urn: "ppb:tbd:card:sbkBetLeg:1180181556/0",
          full: {
            edges: [
              {
                node: {
                  __typename: "FixtureCard",
                  urn: "ppb:tbd:card:fixture:30824665|viewLink|0",
                },
              },
              {
                node: {
                  __typename: "BetLegCard",
                  urn: "ppb:tbd:card:sbkBetLeg:1180181556/0",
                },
              },
            ],
          },
          partials: {
            edges: [
              {
                node: {
                  __typename: "FixtureCard",
                  urn: "ppb:tbd:card:fixture:30824665|viewLink|0",
                },
              },
              {
                node: {
                  __typename: "BetLegCard",
                  urn: "ppb:tbd:card:sbkBetLeg:1180181556/0",
                },
              },
            ],
          },
        },
      },
      {
        node: {
          __typename: "SportsbookBetLegCardGroup",
          urn: "ppb:tbd:card:sbkBetLeg:1180181556/1",
          full: {
            edges: [
              {
                node: {
                  __typename: "RaceDetailsCard",
                  urn: "ppb:tbd:card:raceDetails:30886155.1230|true",
                },
              },
              {
                node: {
                  __typename: "BetLegCard",
                  urn: "ppb:tbd:card:sbkBetLeg:1180181556/1",
                },
              },
            ],
          },
          partials: {
            edges: [
              {
                node: {
                  __typename: "RaceDetailsCard",
                  urn: "ppb:tbd:card:raceDetails:30886155.1230|true",
                },
              },
              {
                node: {
                  __typename: "BetLegCard",
                  urn: "ppb:tbd:card:sbkBetLeg:1180181556/1",
                },
              },
            ],
          },
        },
      },
      {
        node: {
          __typename: "SportsbookBetLegCardGroup",
          urn: "ppb:tbd:card:sbkBetLeg:1180181556/2",
          full: {
            edges: [
              {
                node: {
                  __typename: "BetLegCard",
                  urn: "ppb:tbd:card:sbkBetLeg:1180181556/2",
                },
              },
            ],
          },
          partials: {
            edges: [
              {
                node: {
                  __typename: "BetLegCard",
                  urn: "ppb:tbd:card:sbkBetLeg:1180181556/2",
                },
              },
            ],
          },
        },
      },
    ],
  },
};

describe("Sportsbook expandable leg card group normalizer", () => {
  describe("normalizeSportsbookExpandableLegCardGroupFragmentIntoSportsbookExpandableLegCardGroup", () => {
    it("should correctly transform and return the data", () => {
      const { data } =
        normalizeSportsbookExpandableLegCardGroupFragmentIntoSportsbookExpandableLegCardGroup(BFF_SEGMENT);

      expect(data).toEqual({
        typename: "SportsbookExpandableLegCardGroup",
        urn: "ppb:tbd:cardgroup:sbkExpandableLeg:1180181556",
        items: [
          {
            typename: "SportsbookBetLegCardGroup",
            urn: "ppb:tbd:card:sbkBetLeg:1180181556/0",
          },
          {
            typename: "SportsbookBetLegCardGroup",
            urn: "ppb:tbd:card:sbkBetLeg:1180181556/1",
          },
          {
            typename: "SportsbookBetLegCardGroup",
            urn: "ppb:tbd:card:sbkBetLeg:1180181556/2",
          },
        ],
      });
    });
  });
});
