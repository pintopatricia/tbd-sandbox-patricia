import { getSportEventByURN, createSportEventByURNSelector } from "./sport-event-selectors";

const stateMock = {
  "ppb:event:22334455": {
    urn: "ppb:event:22334455",
    name: "FCPorto v Benfica",
  },
};

describe('"sportevents" selectors', () => {
  describe("getSportEventByURN selector", () => {
    it("must return undefined when receiving an URN for a non-existing sport event", () => {
      const page = getSportEventByURN("RANDOM_URN");
      expect(page).toBe(undefined);
    });

    it("must return a sport event market when receiving an URN for an existing market", () => {
      const page = getSportEventByURN(stateMock, "ppb:event:22334455");
      expect(page).toEqual(stateMock["ppb:event:22334455"]);
    });

    it("must return the page", () => {
      const getSportEventByURNByCreateSelector = createSportEventByURNSelector();
      const page = getSportEventByURNByCreateSelector(stateMock, "ppb:event:22334455");

      expect(page).toEqual(stateMock["ppb:event:22334455"]);
    });
  });
});
