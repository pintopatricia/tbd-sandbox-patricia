import { getSportByURN } from "./sport-selectors";

describe("sports selectors", () => {
  describe("getSportByURN selector", () => {
    const sportMock = {
      urn: "ppb:tbd:card:sport:urn",
    };

    const stateMock = {
      "ppb:tbd:card:sport:urn": sportMock,
    };

    it("should return undefined when no eventmarket cards exist", () => {
      const card = getSportByURN(stateMock, "RANDOM_URN");
      expect(card).toBe(undefined);
    });

    it("should return the correct card when provided with a valid URN", () => {
      const card = getSportByURN(stateMock, "ppb:tbd:card:sport:urn");
      expect(card).toEqual({
        urn: "ppb:tbd:card:sport:urn",
      });
    });
  });
});
