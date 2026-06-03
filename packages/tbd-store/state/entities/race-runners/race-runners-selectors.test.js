import { createRaceRunnerByURNSelector, createRaceRunnersByRaceURNSelector } from "./race-runners-selectors";

const raceRunnerData = {
  urn: "ppb:tbd:racerunner:123/1",
  selectionId: 1,
  raceURN: "ppb:race:12345",
  details: {
    trainerName: "",
    jockeyName: "Brian Hughes",
    saddleCloth: 8,
    silk: "http://tbdui.qa.internal/images/silk.png",
    draw: 0,
  },
  horse: {
    name: "VOLT FACE (FR)",
    sirName: "",
    damName: "",
    damSirName: "",
    age: 4,
    color: "",
    sex: "",
  },
};

const stateMock = {
  entities: {
    racerunners: {
      "ppb:tbd:racerunner:123/1": raceRunnerData,
    },
  },
};

describe('"races" selector', () => {
  describe("createRaceRunnerByURNSelector selector", () => {
    it("must return the race runner when it exists", () => {
      const getRaceRunnerByURN = createRaceRunnerByURNSelector();
      const raceRunner = getRaceRunnerByURN(stateMock.entities.racerunners, "ppb:tbd:racerunner:123/1");

      expect(raceRunner).toEqual(raceRunnerData);
    });

    it("must return undefined when race runner from the given raceURN doesn't exist", () => {
      const getRaceRunnerByURN = createRaceRunnerByURNSelector();
      const raceRunner = getRaceRunnerByURN(stateMock.entities.racerunners, "ppb:tbd:racerunner:00000/2");

      expect(raceRunner).toEqual(undefined);
    });

    it("must return undefined when there aren't race runners", () => {
      const getRaceRunnerByURN = createRaceRunnerByURNSelector();
      const raceRunner = getRaceRunnerByURN({}, "ppb:tbd:racerunner:123/1");

      expect(raceRunner).toEqual(undefined);
    });
  });

  describe("createRaceRunnersByRaceURNSelector selector", () => {
    it("must return the race runners from the given raceURN", () => {
      const getRaceRunnersByURN = createRaceRunnersByRaceURNSelector();
      const raceRunners = getRaceRunnersByURN(stateMock.entities.racerunners, "ppb:race:12345");

      expect(raceRunners).toEqual({ "ppb:tbd:racerunner:123/1": raceRunnerData });
    });

    it("must return empty object when there are no race runners from the given raceURN", () => {
      const getRaceRunnersByURN = createRaceRunnersByRaceURNSelector();
      const raceRunners = getRaceRunnersByURN(stateMock.entities.racerunners, "ppb:race:54321");

      expect(raceRunners).toEqual({});
    });

    it("must return empty object when there are no race runners", () => {
      const getRaceRunnersByURN = createRaceRunnersByRaceURNSelector();
      const raceRunners = getRaceRunnersByURN({}, "ppb:race:12345");

      expect(raceRunners).toEqual({});
    });
  });
});
