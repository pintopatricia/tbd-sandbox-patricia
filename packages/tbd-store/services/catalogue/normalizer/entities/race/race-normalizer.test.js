import raceNormalizer from "./race-normalizer";

const RaceMock = {
  __typename: "Race",
  urn: "ppb:race:29893526.1020",
  startTime: "2020-07-08T10:20:00.000Z",
  name: "1m4f Hcap",
  raceId: "29893526.1020",
  meeting: {
    urn: "ppb:meeting:29893526",
    venue: "Washington",
    country: "ES",
    countryFlag: {
      small: "url",
    },
  },
};
const raceWithRaceRunnersMock = {
  __typename: "Race",
  urn: "ppb:race:29893526.1020",
  startTime: "2020-07-08T10:20:00.000Z",
  verdict: "Verdict",
  winningTime: 10.3,
  name: "1m4f Hcap",
  raceId: "29893526.1020",
  runners: [
    {
      __typename: "RaceRunner",
      urn: "ppb:tbd:racerunner:29893526.1020/1",
      raceURN: "ppb:race:29893526.1020",
      selectionId: 1,
      horse: {
        name: "BUACHAILL OR (IRE)",
        sireName: "BALTIC KING",
        damName: "MILLENIUMDAUGHTER (IRE)",
        damSireName: "BOLD FACT (USA)",
        age: 3,
        color: "BAY",
        sex: "GELDING",
        bred: "IRE",
      },
      form: "runner.form",
      rating: "runner.rating",
      rating123: 3,
      ratingStars: 5,
      comments: "runner.comments",
      details: {
        jockeyName: "C. J. McGovern",
        trainerName: "Paul W. Flynn, Ireland",
        saddleCloth: 14,
        silk: null,
        draw: 3,
        weight: "runner.details.weightCarried",
        equipmentDescription: "runner.details.equipmentDescription",
      },
    },
    {
      __typename: "RaceRunner",
      urn: "ppb:tbd:racerunner:29893526.1020/2",
      raceURN: "ppb:race:29893526.1020",
      selectionId: 2,
      form: "runner.form2",
      rating: "runner.rating2",
      comments: "runner.comments2",
      horse: {
        name: "BUACHAILL OR (IRE)",
        sireName: "BALTIC KING",
        damName: "MILLENIUMDAUGHTER (IRE)",
        damSireName: "BOLD FACT (USA)",
        age: 3,
        color: "BAY",
        sex: "GELDING",
        bred: "IRE",
      },
      details: {
        jockeyName: "C. J. McGovern",
        trainerName: "Paul W. Flynn, Ireland",
        saddleCloth: 14,
        silk: null,
        draw: 3,
      },
    },
  ],
  raceKind: {
    runners: [
      {
        __typename: "RaceRunner",
        urn: "ppb:tbd:racerunner:29893526.1020/1",
        raceURN: "ppb:race:29893526.1020",
      },
      {
        __typename: "GreyhoundRaceRunner",
        urn: "ppb:tbd:greyhoundracerunner:29893526.1020/1",
        trap: 1,
      },
    ],
  },
  details: {
    scheduledTime: "date",
    name: "GOLF SOCIETIES WELCOME AT GOWRAN PARK APPRENTICE HANDICAP",
    distance: 8,
    numberOfRunners: 8,
    going: "SOFT",
    status: "RESULT",
    type: "FLAT",
    resultType: "FULL_RESULT",
  },
  meeting: {
    __typename: "Meeting",
    urn: "ppb:meeting:29893526",
    venue: "Washington",
    country: "ES",
    countryFlag: {
      small: "url",
    },
    sport: {
      urn: "ppb:eventType:7",
    },
  },
};

describe("Race normalizer", () => {
  describe("normalizeRaceFragmentIntoRace", () => {
    it("should correctly transform and return the data object when details and runners props are null", () => {
      const { data } = raceNormalizer({ ...RaceMock, details: null, runners: null });

      expect(data).toEqual({
        typename: "Race",
        urn: "ppb:race:29893526.1020",
        meeting: "ppb:meeting:29893526",
        startTime: "2020-07-08T10:20:00.000Z",
        name: "1m4f Hcap",
        raceId: "29893526.1020",
      });
    });

    describe("for loaded hydrated race with details", () => {
      it("should correctly transform and return the data object", () => {
        const { data } = raceNormalizer({ ...raceWithRaceRunnersMock, runners: undefined, raceKind: undefined });

        expect(data).toEqual({
          typename: "Race",
          urn: "ppb:race:29893526.1020",
          meeting: "ppb:meeting:29893526",
          startTime: "2020-07-08T10:20:00.000Z",
          verdict: "Verdict",
          winningTime: 10.3,
          name: "1m4f Hcap",
          raceId: "29893526.1020",
          details: {
            scheduledTime: "date",
            distance: 8,
            going: "SOFT",
            numberOfRunners: 8,
            status: "RESULT",
            raceType: "FLAT",
            resultType: "FULL_RESULT",
          },
        });
      });

      describe("race details", () => {
        it("should correctly transform race details", () => {
          const { data } = raceNormalizer({
            ...raceWithRaceRunnersMock,
          });

          expect(data.details).toEqual({
            distance: 8,
            numberOfRunners: 8,
            going: "SOFT",
            status: "RESULT",
            scheduledTime: "date",
            raceType: "FLAT",
            resultType: "FULL_RESULT",
          });
        });

        it("should correctly transform race details when not defined", () => {
          const { data } = raceNormalizer({
            ...raceWithRaceRunnersMock,
            details: undefined,
          });

          expect(data.details).toEqual(undefined);
        });
      });

      describe("race type", () => {
        it("should correctly transform race type in race details when undefined", () => {
          const { data } = raceNormalizer({
            ...raceWithRaceRunnersMock,
            details: {
              ...raceWithRaceRunnersMock.details,
              type: undefined,
            },
          });

          expect(data.details).toEqual({
            distance: 8,
            going: "SOFT",
            status: "RESULT",
            numberOfRunners: 8,
            raceType: undefined,
            scheduledTime: "date",
            resultType: "FULL_RESULT",
          });
        });
      });

      describe("result type", () => {
        it("should not return resultType when undefined", () => {
          const { data } = raceNormalizer({
            ...raceWithRaceRunnersMock,
            details: {
              ...raceWithRaceRunnersMock.details,
              resultType: undefined,
            },
          });

          expect(data.details).toEqual({
            distance: 8,
            going: "SOFT",
            status: "RESULT",
            numberOfRunners: 8,
            raceType: "FLAT",
            scheduledTime: "date",
          });
        });
      });

      describe("race status", () => {
        it("should correctly transform race status in race details when invalid", () => {
          const { data } = raceNormalizer({
            ...raceWithRaceRunnersMock,
            details: {
              ...raceWithRaceRunnersMock.details,
              status: "INVALID_VALUE",
            },
          });

          expect(data.details).toEqual({
            distance: 8,
            going: "SOFT",
            status: undefined,
            numberOfRunners: 8,
            raceType: "FLAT",
            scheduledTime: "date",
            resultType: "FULL_RESULT",
          });
        });

        it("should correctly transform race status in race details when undefined", () => {
          const { data } = raceNormalizer({
            ...raceWithRaceRunnersMock,
            details: {
              ...raceWithRaceRunnersMock.details,
              status: undefined,
            },
          });

          expect(data.details).toEqual({
            distance: 8,
            going: "SOFT",
            status: undefined,
            numberOfRunners: 8,
            raceType: "FLAT",
            scheduledTime: "date",
            resultType: "FULL_RESULT",
          });
        });
      });

      describe("going", () => {
        it("should correctly transform going in race details", () => {
          const { data } = raceNormalizer({
            ...raceWithRaceRunnersMock,
          });

          expect(data.details).toEqual({
            distance: 8,
            numberOfRunners: 8,
            going: "SOFT",
            status: "RESULT",
            scheduledTime: "date",
            raceType: "FLAT",
            resultType: "FULL_RESULT",
          });
        });

        it("should correctly transform going in race details when invalid", () => {
          const { data } = raceNormalizer({
            ...raceWithRaceRunnersMock,
            details: {
              ...raceWithRaceRunnersMock.details,
              going: "INVALID_VALUE",
            },
          });

          expect(data.details).toEqual({
            distance: 8,
            going: undefined,
            status: "RESULT",
            numberOfRunners: 8,
            raceType: "FLAT",
            scheduledTime: "date",
            resultType: "FULL_RESULT",
          });
        });

        it("should correctly transform going in race details when undefined", () => {
          const { data } = raceNormalizer({
            ...raceWithRaceRunnersMock,
            details: {
              ...raceWithRaceRunnersMock.details,
              going: undefined,
            },
          });

          expect(data.details).toEqual({
            distance: 8,
            going: undefined,
            status: "RESULT",
            numberOfRunners: 8,
            raceType: "FLAT",
            scheduledTime: "date",
            resultType: "FULL_RESULT",
          });
        });
      });

      describe("number of runners", () => {
        it("should correctly transform numberOfRunners in race details when null", () => {
          const { data } = raceNormalizer({
            ...raceWithRaceRunnersMock,
            details: {
              ...raceWithRaceRunnersMock.details,
              numberOfRunners: null,
            },
          });

          expect(data.details).toEqual({
            distance: 8,
            going: "SOFT",
            status: "RESULT",
            numberOfRunners: undefined,
            raceType: "FLAT",
            scheduledTime: "date",
            resultType: "FULL_RESULT",
          });
        });
      });
    });

    describe("for loaded hydrated race with runners", () => {
      it("should correctly transform and return the data object", () => {
        const { data } = raceNormalizer(raceWithRaceRunnersMock);

        expect(data).toEqual({
          typename: "Race",
          urn: "ppb:race:29893526.1020",
          meeting: "ppb:meeting:29893526",
          startTime: "2020-07-08T10:20:00.000Z",
          verdict: "Verdict",
          winningTime: 10.3,
          name: "1m4f Hcap",
          raceId: "29893526.1020",
          runners: ["ppb:tbd:racerunner:29893526.1020/1", "ppb:tbd:racerunner:29893526.1020/2"],
          racingRunners: ["ppb:tbd:racerunner:29893526.1020/1", "ppb:tbd:greyhoundracerunner:29893526.1020/1"],
          details: {
            distance: 8,
            going: "SOFT",
            status: "RESULT",
            numberOfRunners: 8,
            raceType: "FLAT",
            scheduledTime: "date",
            resultType: "FULL_RESULT",
          },
        });
      });
    });

    describe("for a non-hydrated race (mandatory fields only)", () => {
      it("should correctly transform and return the data object without runners nor details", () => {
        const { data } = raceNormalizer(RaceMock);

        expect(data).toEqual({
          typename: "Race",
          urn: "ppb:race:29893526.1020",
          meeting: "ppb:meeting:29893526",
          startTime: "2020-07-08T10:20:00.000Z",
          name: "1m4f Hcap",
          raceId: "29893526.1020",
        });
      });
    });
  });
});
