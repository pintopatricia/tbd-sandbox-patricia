import normalizeGreyhoundRaceRunnerFragmentIntoGreyhoundRaceRunner from "./greyhound-race-runners-normalizer";

const MOCK = {
  __typename: "GreyhoundRaceRunner",
  urn: "ppb:tbd:greyhoundracerunner:29893526.1020/1",
  trap: 1,
  raceURN: "ppb:tbd:race:29893526.1020",
};

describe("Greyhound race runner normalizer", () => {
  describe("normalizeGreyhoundRaceRunnerFragmentIntoGreyhoundRaceRunner", () => {
    describe("when a race runner is returned with all the props", () => {
      it("should correctly transform and return the data object", () => {
        const { data } = normalizeGreyhoundRaceRunnerFragmentIntoGreyhoundRaceRunner(MOCK);

        expect(data).toEqual({
          typename: "GreyhoundRaceRunner",
          urn: "ppb:tbd:greyhoundracerunner:29893526.1020/1",
          trap: 1,
          raceURN: "ppb:tbd:race:29893526.1020",
        });
      });
    });
  });
});
