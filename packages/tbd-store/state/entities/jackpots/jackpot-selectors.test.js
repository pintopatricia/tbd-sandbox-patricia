import { getJackpotByURN } from "./jackpot-selectors";

describe("jackpot selectors", () => {
  describe("getJackpotByURN", () => {
    const jackpotStateMock = {
      "urn:tbd:card:1": {
        urn: "ppb:jackpot:1",
      },
    };

    it("must return undefined when receiving an URN for a non-existing jackpot", () => {
      const card = getJackpotByURN(jackpotStateMock, "RANDOM_URN");
      expect(card).toBe(undefined);
    });

    it("must return the correct jackpot card when receiving an existing URN", () => {
      const card = getJackpotByURN(jackpotStateMock, "urn:tbd:card:1");
      expect(card.urn).toEqual("ppb:jackpot:1");
    });
  });
});
