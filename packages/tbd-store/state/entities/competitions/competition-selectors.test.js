import { createCompetitionSelector } from "./competition-selectors";

const stateMock = {
  entities: {
    competitions: {
      "competition:urn": {
        name: "competition name",
      },
    },
  },
};

const getCompetitionByURN = createCompetitionSelector();

describe("createCompetitionSelector", () => {
  it("should return a function", () => {
    expect(getCompetitionByURN).toEqual(expect.any(Function));
  });
});

describe("getCompetitionByURN", () => {
  describe("when urn is valid", () => {
    it("should be a function factory", () => {
      const competition = getCompetitionByURN(stateMock.entities.competitions, "competition:urn");
      expect(competition).toStrictEqual({ name: "competition name" });
    });
  });

  describe("when urn is invalid", () => {
    it("should be a function factory", () => {
      const competition = getCompetitionByURN(stateMock.entities.competitions, "not:competition:urn");
      expect(competition).toBe(undefined);
    });
  });

  describe("when urn is undefined", () => {
    it("should be a function factory", () => {
      const competition = getCompetitionByURN(stateMock.entities.competitions, "not:competition:urn");
      expect(competition).toBe(undefined);
    });
  });
});
