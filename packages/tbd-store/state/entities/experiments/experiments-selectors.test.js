import { createGetExperimentSelector, getExperiments, getFormattedExperiments } from "./experiments-selectors";

const stateMock = {
  entities: {
    experiments: {
      "exp-cashout-button": {
        variant: "color-green",
      },
    },
  },
};

describe("createGetExperimentSelector selector", () => {
  describe("when experiment exists", () => {
    it("must return the experiment", () => {
      const getExperiment = createGetExperimentSelector();
      const experiment = getExperiment(stateMock.entities.experiments, "exp-cashout-button");

      expect(experiment).toEqual({
        variant: "color-green",
      });
    });
  });

  describe("when experiment does not exist", () => {
    it("must return undefined", () => {
      const getExperiment = createGetExperimentSelector();
      const experiment = getExperiment(stateMock.entities.experiments, "NON EXISTENT EXPERIMENT");

      expect(experiment).toEqual(undefined);
    });
  });
});

describe("getExperiments selector", () => {
  it("must return the experiments from the state", () => {
    const experiments = getExperiments(stateMock);
    expect(experiments).toEqual({
      "exp-cashout-button": {
        variant: "color-green",
      },
    });
  });

  it("must throw an error when no experiments are set in the state", () => {
    const experiments = () => getExperiments({});
    expect(experiments).toThrow("non existent experiments");
  });
});

describe("getFormattedExperiments selector", () => {
  it("must return the experiments from the state", () => {
    const experiments = getFormattedExperiments(stateMock.entities);
    expect(experiments).toEqual([
      {
        id: "exp-cashout-button",
        variant: "color-green",
      },
    ]);
  });

  it("must throw an error when no experiments are set in the state", () => {
    const experiments = getFormattedExperiments({});
    expect(experiments).toEqual([]);
  });
});
