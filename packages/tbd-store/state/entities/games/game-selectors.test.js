import { getGameByURN } from "./game-selectors";

describe("games selectors", () => {
  describe("getGameByURN", () => {
    const gamesStateMock = {
      "urn:tbd:card:1": {
        urn: "ppb:game:1",
      },
    };

    it("must return undefined when receiving an URN for a non-existing game", () => {
      const card = getGameByURN(gamesStateMock, "RANDOM_URN");
      expect(card).toBe(undefined);
    });

    it("must return the correct game card when receiving an existing URN", () => {
      const card = getGameByURN(gamesStateMock, "urn:tbd:card:1");
      expect(card.urn).toEqual("ppb:game:1");
    });
  });
});
