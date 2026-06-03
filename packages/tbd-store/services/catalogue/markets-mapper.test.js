import { normalizerEngine } from "./normalizer/normalizer-engine";
import { buildMarketsEntities } from "./markets-mapper";

jest.mock("./normalizer/normalizer-engine", () => ({ normalizerEngine: jest.fn() }));
jest.mock("./catalogue-types");

const layoutMock = {
  data: {},
};

describe("buildMarketsEntities", () => {
  beforeEach(jest.clearAllMocks);

  describe("without markets data", () => {
    it("should return the result from getDefaultTransformedLayout", () => {
      const result = buildMarketsEntities();

      expect(result).toEqual(layoutMock);
    });
  });

  describe("with markets data", () => {
    describe("for non-null values", () => {
      const firstMarket = { __typename: "SportsbookMarket", urn: "sbkmarket:urn:1" };
      const secondMarket = { __typename: "SportsbookMarket", urn: "sbkmarket:urn:2" };
      const firstMappedEntities = { "sbkmarket:urn:1": { urn: "sbkmarket:urn:1" } };
      const secondMappedEntities = { ...firstMappedEntities, "sbkmarket:urn:2": { urn: "sbkmarket:urn:2" } };

      function setup() {
        normalizerEngine.mockReturnValueOnce(firstMappedEntities);
        normalizerEngine.mockReturnValueOnce(secondMappedEntities);

        return buildMarketsEntities([firstMarket, secondMarket]);
      }

      it("should call normalizer engine", () => {
        setup();

        expect(normalizerEngine).toHaveBeenNthCalledWith(1, firstMarket, {});
        expect(normalizerEngine).toHaveBeenNthCalledWith(2, secondMarket, firstMappedEntities);
        expect(normalizerEngine).toHaveBeenCalledTimes(2);
      });

      it("should return data with entities", () => {
        const result = setup();

        expect(result.data).toEqual(secondMappedEntities);
      });

      it("should return layouts with default", () => {
        const result = setup();

        expect(result.layouts).toEqual(layoutMock.layouts);
      });

      it("should return entities with default", () => {
        const result = setup();

        expect(result.entities).toEqual(layoutMock.entities);
      });
    });

    describe("for null values", () => {
      it("should not call normalizer engine", () => {
        buildMarketsEntities([null]);

        expect(normalizerEngine).not.toHaveBeenCalled();
      });
    });
  });
});
