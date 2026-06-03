import { makeMapStateToProps } from "./map-to-props-factory";

const runnerMock = {
  status: "ACTIVE",
  odds: {
    decimal: 10,
  },
  previousOdds: [
    {
      decimal: 5,
      fractional: {
        numerator: 5,
        denominator: 1,
      },
    },
    {
      decimal: 5.1,
      fractional: {
        numerator: 51,
        denominator: 10,
      },
    },
    {
      decimal: 5.2,
      fractional: {
        numerator: 26,
        denominator: 5,
      },
    },
  ],
  selectionId: 1234,
};

const getSportsbookRunnerByURN = jest.fn(() => runnerMock);

beforeEach(jest.clearAllMocks);

jest.mock("@ppb/tbd-store/state/entities/sportsbook-runners/sportsbook-runner-selectors", () => ({
  createSportsbookRunnerByURNSelector: jest.fn(() => getSportsbookRunnerByURN),
}));

const stateMock = {
  entities: {
    sportsbookrunners: "SPORTSBOOK_RUNNERS",
    preferences: {
      sportsbookOddsDisplay: "DECIMAL",
    },
  },
};

const setupMapStateToProps = (state, isMarketInplay = false) => {
  const containerProps = {
    runnerUrn: "runnerUrn",
    isMarketInplay,
  };

  return makeMapStateToProps()(state, containerProps);
};

describe("makeMapStateToProps", () => {
  it("should getSportsbookRunnerByURN from state", () => {
    setupMapStateToProps(stateMock);

    expect(getSportsbookRunnerByURN).toHaveBeenCalledWith(stateMock.entities.sportsbookrunners, "runnerUrn");
  });

  describe("when sportsbookOddsDisplay preference is DECIMAL", () => {
    it("should return correct previousOdds", () => {
      const stateProps = setupMapStateToProps(stateMock);

      expect(stateProps).toEqual({ previousOdds: "5.2 ▸ 5.1 ▸ 5" });
    });
  });

  describe("when sportsbookOddsDisplay preference is FRACTIONAL", () => {
    it("should return correct previousOdds", () => {
      const state = {
        ...stateMock,
        entities: {
          ...stateMock.entities,
          preferences: { sportsbookOddsDisplay: "FRACTIONAL" },
        },
      };
      const stateProps = setupMapStateToProps(state);

      expect(stateProps).toEqual({ previousOdds: "26/5 ▸ 51/10 ▸ 5/1" });
    });
  });

  describe("when isMarketInplay ContainerProp is true", () => {
    const isMarketInplay = true;

    it("should not call getSportsbookRunnerByURN from state", () => {
      setupMapStateToProps(stateMock, isMarketInplay);

      expect(getSportsbookRunnerByURN).not.toHaveBeenCalled();
    });

    it("should return an empty object", () => {
      const stateProps = setupMapStateToProps(stateMock, isMarketInplay);

      expect(stateProps).toEqual({});
    });
  });

  describe("when runner doesn't exist", () => {
    beforeEach(() => {
      getSportsbookRunnerByURN.mockReturnValueOnce(undefined);
    });

    it("should return an empty object", () => {
      const stateProps = setupMapStateToProps(stateMock);

      expect(stateProps).toEqual({});
    });
  });

  describe("when runner doesn't have previousOdds", () => {
    beforeEach(() => {
      getSportsbookRunnerByURN.mockReturnValueOnce({ ...runnerMock, previousOdds: undefined });
    });

    it("should return an empty object", () => {
      const stateProps = setupMapStateToProps(stateMock);

      expect(stateProps).toEqual({});
    });
  });

  describe("when sportsbookOddsDisplay preferences doesn't exist in state", () => {
    const state = {
      ...stateMock,
      entities: {
        ...stateMock.entities,
        preferences: { sportsbookOddsDisplay: undefined },
      },
    };

    it("should return an empty object", () => {
      const stateProps = setupMapStateToProps(state);

      expect(stateProps).toEqual({});
    });
  });

  describe("when sportsbookOddsDisplay preference is FRACTIONAL but one of the 3 previous odds is undefined", () => {
    const state = {
      ...stateMock,
      entities: {
        ...stateMock.entities,
        preferences: { sportsbookOddsDisplay: "FRACTIONAL" },
      },
    };

    beforeEach(() => {
      const previousOdds = Object.values({ ...runnerMock.previousOdds, 1: undefined });
      getSportsbookRunnerByURN.mockReturnValueOnce({ ...runnerMock, previousOdds });
    });

    it("should return previous odds without the second odd", () => {
      const stateProps = setupMapStateToProps(state);

      expect(stateProps).toEqual({ previousOdds: "26/5 ▸ 5/1" });
    });
  });

  describe("when runner status is REMOVED", () => {
    beforeEach(() => {
      getSportsbookRunnerByURN.mockReturnValueOnce({ ...runnerMock, previousOdds: undefined });
    });

    it("should return an empty object", () => {
      const stateProps = setupMapStateToProps(stateMock);

      expect(stateProps).toEqual({});
    });
  });
});
