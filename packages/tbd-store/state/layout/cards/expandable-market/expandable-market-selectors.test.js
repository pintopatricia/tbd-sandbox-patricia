import {
  isHydratedExpandableMarketCard,
  createPartialExpandableMarketCardByURNSelector,
  createGetHydratedExpandableMarketCardByURNSelector,
} from "./expandable-market-selectors";

const HYDRATED_CARD_URN = "urn:hydrated";
const PARTIAL_CARD_URN = "urn:partial";
const MISSING_CARD_URN = "urn:missing";

const HYDRATED_CARD = {
  urn: HYDRATED_CARD_URN,
  title: "hydrated title",
  marketCardURN: "marketCardURN",
};

const PARTIAL_CARD = {
  title: "partial title",
  urn: PARTIAL_CARD_URN,
};

const CARDS_MOCK = {
  [HYDRATED_CARD_URN]: HYDRATED_CARD,
  [PARTIAL_CARD_URN]: PARTIAL_CARD,
};

describe("expandable market selectors", () => {
  describe("createGetHydratedExpandableMarketCardByURNSelector", () => {
    it("should return the hydrated card when urn matches and card is not a partial", () => {
      const selector = createGetHydratedExpandableMarketCardByURNSelector();
      const result = selector(CARDS_MOCK, HYDRATED_CARD_URN);

      expect(result).toBe(HYDRATED_CARD);
    });

    it("should return null when urn matches but card is a partial", () => {
      const selector = createGetHydratedExpandableMarketCardByURNSelector();
      const result = selector(CARDS_MOCK, PARTIAL_CARD_URN);

      expect(result).toBeNull();
    });

    it("should return null when urn does not exist in cards", () => {
      const selector = createGetHydratedExpandableMarketCardByURNSelector();
      const result = selector(CARDS_MOCK, MISSING_CARD_URN);

      expect(result).toBeNull();
    });

    it("should return null when state is null", () => {
      const selector = createGetHydratedExpandableMarketCardByURNSelector();
      const result = selector(null, HYDRATED_CARD_URN);

      expect(result).toBeNull();
    });

    it("should return null when state is undefined", () => {
      const selector = createGetHydratedExpandableMarketCardByURNSelector();
      const result = selector(undefined, HYDRATED_CARD_URN);

      expect(result).toBeNull();
    });
  });

  describe("createPartialExpandableMarketCardByURNSelector", () => {
    it("should return the partial card when urn matches and card is a partial", () => {
      const selector = createPartialExpandableMarketCardByURNSelector();
      const result = selector(CARDS_MOCK, PARTIAL_CARD_URN);

      expect(result).toBe(PARTIAL_CARD);
    });

    it("should return null when urn matches but card is hydrated", () => {
      const selector = createPartialExpandableMarketCardByURNSelector();
      const result = selector(CARDS_MOCK, HYDRATED_CARD_URN);

      expect(result).toBeNull();
    });

    it("should return null when urn does not exist in cards", () => {
      const selector = createPartialExpandableMarketCardByURNSelector();
      const result = selector(CARDS_MOCK, MISSING_CARD_URN);

      expect(result).toBeNull();
    });

    it("should return null when card is null", () => {
      const state = {
        [HYDRATED_CARD_URN]: null,
      };
      const selector = createPartialExpandableMarketCardByURNSelector();
      const result = selector(state, HYDRATED_CARD_URN);

      expect(result).toBeNull();
    });

    it("should return null when card is undefined", () => {
      const state = {
        [HYDRATED_CARD_URN]: undefined,
      };
      const selector = createPartialExpandableMarketCardByURNSelector();
      const result = selector(state, HYDRATED_CARD_URN);

      expect(result).toBeNull();
    });

    describe("isHydratedExpandableMarketCard", () => {
      it("should return true when contains a marketCardURN", () => {
        const result = isHydratedExpandableMarketCard(HYDRATED_CARD);

        expect(result).toBe(true);
      });

      it("should return false when not contains a marketCardURN", () => {
        const result = isHydratedExpandableMarketCard(PARTIAL_CARD);

        expect(result).toBe(false);
      });

      it("should return false for null or undefined", () => {
        expect(isHydratedExpandableMarketCard(null)).toBe(false);
        expect(isHydratedExpandableMarketCard(undefined)).toBe(false);
      });

      it("should return false for empty object", () => {
        const result = isHydratedExpandableMarketCard({});

        expect(result).toBe(false);
      });

      it("should return false for primitive values", () => {
        expect(isHydratedExpandableMarketCard("string")).toBe(false);
        expect(isHydratedExpandableMarketCard(123)).toBe(false);
        expect(isHydratedExpandableMarketCard(true)).toBe(false);
      });
    });
  });
});
