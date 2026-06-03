import { normalizerEngine } from "./normalizer/normalizer-engine";
import { buildVirtualMarketsEntities } from "./virtual-markets-mapper";

jest.mock("./normalizer/normalizer-engine", () => ({ normalizerEngine: jest.fn() }));
jest.mock("./catalogue-types");

const layoutMock = {
  data: {},
};

describe("buildVirtualMarketsEntities", () => {
  beforeEach(jest.clearAllMocks);

  describe("without virtualMarkets data", () => {
    it("should return the result with empty data", () => {
      const result = buildVirtualMarketsEntities([]);

      expect(result).toEqual(layoutMock);
    });
  });

  describe("with virtualMarkets data", () => {
    describe("for non-null values", () => {
      const firstMarket = { __typename: "VirtualMarket", urn: "virtualMarket:urn:1" };
      const secondMarket = { __typename: "VirtualMarket", urn: "virtualMarket:urn:2" };
      const firstMappedEntities = { "virtualMarket:urn:1": { urn: "virtualMarket:urn:1" } };
      const secondMappedEntities = { ...firstMappedEntities, "virtualMarket:urn:2": { urn: "virtualMarket:urn:2" } };

      function setup() {
        normalizerEngine.mockReturnValueOnce(firstMappedEntities);
        normalizerEngine.mockReturnValueOnce(secondMappedEntities);

        return buildVirtualMarketsEntities([firstMarket, secondMarket]);
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
        buildVirtualMarketsEntities([null]);

        expect(normalizerEngine).not.toHaveBeenCalled();
      });
    });
  });
});
