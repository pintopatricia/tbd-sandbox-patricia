import { createRaceByURNSelector } from "./race-selectors";

const raceData = {
  urn: "ppb:race:1.14.1200228.1",
  typename: "Race",
  meeting: "ppb:meeting:12290316",
  details: {
    name: "SPORT NOVICES",
    distance: 23.97,
    numberOfRunners: 3,
    scheduledTime: new Date("2020-02-28T14:00:00Z"),
    going: "Track Going",
    status: "GOING DOWN",
  },
  runners: ["ppb:sbkRunner:924.230553342/24550116"],
};

const stateMock = {
  entities: {
    races: {
      "ppb:race:1.14.1200228.1": raceData,
      "ppb:race:1.14.1200228.2": { ...raceData, details: undefined },
    },
  },
};

describe('"races" selector', () => {
  describe("createRaceByURNSelector selector", () => {
    it("must return the race when it exists", () => {
      const getRaceByURN = createRaceByURNSelector();
      const race = getRaceByURN(stateMock.entities.races, "ppb:race:1.14.1200228.1");

      expect(race).toEqual(raceData);
    });

    it("must return the race without details when race exists but its details are undefined", () => {
      const getRaceByURN = createRaceByURNSelector();
      const race = getRaceByURN(stateMock.entities.races, "ppb:race:1.14.1200228.2");
      const { urn, typename, meeting, runners } = raceData;
      expect(race).toEqual({ urn, typename, meeting, runners });
    });

    it("must return undefined when race with urn `ppb:race:00000` doesn't exist", () => {
      const getRaceByURN = createRaceByURNSelector();
      const race = getRaceByURN(stateMock.entities.races, "ppb:race:00000");

      expect(race).toEqual(undefined);
    });

    it("must return undefined when there aren't races", () => {
      const getRaceByURN = createRaceByURNSelector();
      const race = getRaceByURN({}, "ppb:race:1.14.1200228.1");

      expect(race).toEqual(undefined);
    });
  });
});
