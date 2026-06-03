import { getPromotionByURN, getBonusInstanceCode } from "./ims-promotion-selectors";

describe("promotions selectors", () => {
  describe("getPromotionByURN", () => {
    const imspromotionsStateMock = {
      "urn:tbd:card:1": {
        urn: "ppb:gaming:imspromotion:1",
      },
    };

    it("must return undefined when receiving an URN for a non-existing promotion", () => {
      const card = getPromotionByURN(imspromotionsStateMock, "RANDOM_URN");
      expect(card).toBe(undefined);
    });

    it("must return the correct promotion card when receiving an existing URN", () => {
      const card = getPromotionByURN(imspromotionsStateMock, "urn:tbd:card:1");
      expect(card.urn).toEqual("ppb:gaming:imspromotion:1");
    });
  });

  describe("getBonusInstanceCode", () => {
    const imspromotionsStateMock = {
      "urn:tbd:card:1": {
        urn: "ppb:gaming:imspromotion:1",
        bonusInstanceCode: "1234",
      },
    };

    it("must return undefined when receiving an URN for a non-existing promotion", () => {
      const card = getPromotionByURN(imspromotionsStateMock, "RANDOM_URN");
      expect(card).toBe(undefined);
    });

    it("must return the correct promotion card when receiving an existing URN", () => {
      const result = getBonusInstanceCode(imspromotionsStateMock, "urn:tbd:card:1");
      expect(result).toEqual("1234");
    });
  });
});
