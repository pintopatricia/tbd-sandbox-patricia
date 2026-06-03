import {
  createGreyhoundRaceRunnerByURNSelector,
  createGreyhoundRaceRunnerByRaceAndSelectionIdSelector,
} from "./greyhound-race-runners-selectors";

const RUNNER_MOCK = {
  urn: "ppb:tbd:greyhoundracerunner:123/1",
  trap: 1,
  raceURN: "ppb:tbd:race:123",
  selectionId: 1,
};

const STATE_MOCK = {
  entities: {
    greyhoundracerunners: {
      "ppb:tbd:greyhoundracerunner:123/1": RUNNER_MOCK,
    },
  },
};

describe("createGreyhoundRaceRunnerByURNSelector selector", () => {
  it("must return the greyhound race runner when it exists", () => {
    const getGreyhoundRaceRunnerByURN = createGreyhoundRaceRunnerByURNSelector();
    const runner = getGreyhoundRaceRunnerByURN(
      STATE_MOCK.entities.greyhoundracerunners,
      "ppb:tbd:greyhoundracerunner:123/1",
    );

    expect(runner).toEqual(RUNNER_MOCK);
  });

  it("must return undefined when greyhound race runner from the given raceURN doesn't exist", () => {
    const getGreyhoundRaceRunnerByURN = createGreyhoundRaceRunnerByURNSelector();
    const runner = getGreyhoundRaceRunnerByURN(
      STATE_MOCK.entities.greyhoundracerunners,
      "ppb:tbd:greyhoundracerunner:00000/2",
    );

    expect(runner).toEqual(undefined);
  });

  it("must return undefined when there aren't greyhound race runners", () => {
    const getGreyhoundRaceRunnerByURN = createGreyhoundRaceRunnerByURNSelector();
    const runner = getGreyhoundRaceRunnerByURN({}, "ppb:tbd:greyhoundracerunner:123/1");

    expect(runner).toEqual(undefined);
  });
});

describe("createGreyhoundRaceRunnerByRaceAndSelectionIdSelector selector", () => {
  it("must return the correct greyhound race runner when raceURN and selectionId match", () => {
    const getGreyhoundRaceRunnerByRaceAndSelectionId = createGreyhoundRaceRunnerByRaceAndSelectionIdSelector();

    const runner = getGreyhoundRaceRunnerByRaceAndSelectionId(
      STATE_MOCK.entities,
      RUNNER_MOCK.selectionId,
      RUNNER_MOCK.raceURN,
    );

    expect(runner).toEqual(RUNNER_MOCK);
  });

  it("must return undefined when no runner matches the given raceURN", () => {
    const getGreyhoundRaceRunnerByRaceAndSelectionId = createGreyhoundRaceRunnerByRaceAndSelectionIdSelector();

    const runner = getGreyhoundRaceRunnerByRaceAndSelectionId(
      STATE_MOCK.entities,
      RUNNER_MOCK.selectionId,
      "ppb:tbd:greyhoundracerunner:999",
    );

    expect(runner).toBeUndefined();
  });

  it("must return undefined when no runner matches the given selectionId", () => {
    const getGreyhoundRaceRunnerByRaceAndSelectionId = createGreyhoundRaceRunnerByRaceAndSelectionIdSelector();

    const runner = getGreyhoundRaceRunnerByRaceAndSelectionId(STATE_MOCK.entities, 999, RUNNER_MOCK.raceURN);

    expect(runner).toBeUndefined();
  });

  it("must return undefined when there are no greyhound race runners", () => {
    const getGreyhoundRaceRunnerByRaceAndSelectionId = createGreyhoundRaceRunnerByRaceAndSelectionIdSelector();

    const runner = getGreyhoundRaceRunnerByRaceAndSelectionId(
      { greyhoundracerunners: {} },
      RUNNER_MOCK.selectionId,
      RUNNER_MOCK.raceURN,
    );

    expect(runner).toBeUndefined();
  });
});
