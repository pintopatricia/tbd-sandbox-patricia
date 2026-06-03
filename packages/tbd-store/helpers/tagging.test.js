import { Product } from "../state/entities/user-preferences/UserPreferences.types";
import {
  getProductLabelByProductType,
  getProductLabelByProductTypeFilterItem,
  getGtmBrand,
  getProductOptionPrefix,
} from "./tagging";

jest.mock("./app-brand", () => ({
  ProductIds: {
    Betfair: 90,
    SkybetNative: 100,
    SkybetWeb: 110,
  },
}));

const ProductTypeFilterItem = {
  Exchange: "exc",
  Sportsbook: "sbk",
};

describe("Tagging", () => {
  beforeEach(jest.clearAllMocks);

  describe("getGtmBrand", () => {
    describe("when called without productId", () => {
      it("should return the default betfair brand", () => {
        expect(getGtmBrand({ entities: {} })).toBe("bf");
      });
    });

    describe("when called with an unknown productId", () => {
      it("should return undefined", () => {
        expect(getGtmBrand({ entities: { productId: "00" } })).toBe(undefined);
      });
    });

    describe("when called with a known productId", () => {
      it("should return the correct brand", () => {
        expect(getGtmBrand({ entities: { productId: "100" } })).toBe("sbg");
      });
    });
  });

  describe("getProductLabelByProductType", () => {
    describe("when called with Exchange product type", () => {
      it("should return 'exchange'", () => {
        expect(getProductLabelByProductType(Product.Exchange)).toBe("exchange");
      });
    });

    describe("when called with Sportsbook product type", () => {
      it("should return 'sportsbook'", () => {
        expect(getProductLabelByProductType(Product.Sportsbook)).toBe("sportsbook");
      });
    });
  });

  describe("getProductLabelByProductTypeFilterItem", () => {
    describe("when called with Exchange filter item product type", () => {
      it("should return 'exchange'", () => {
        expect(getProductLabelByProductTypeFilterItem(ProductTypeFilterItem.Exchange)).toBe("exchange");
      });
    });

    describe("when called with Sportsbook filter item product type", () => {
      it("should return 'sportsbook'", () => {
        expect(getProductLabelByProductTypeFilterItem(ProductTypeFilterItem.Sportsbook)).toBe("sportsbook");
      });
    });
  });

  describe("getProductOptionPrefix", () => {
    describe("when called without productId", () => {
      it("should return the default betfair prefix", () => {
        expect(getProductOptionPrefix({ entities: {} })).toBe("rebuild");
      });
    });

    describe("when called with an unknown productId", () => {
      it("should return undefined", () => {
        expect(getProductOptionPrefix({ entities: { productId: "00" } })).toBe(undefined);
      });
    });

    describe("when called with a known productId", () => {
      it("should return the correct prefix", () => {
        expect(getProductOptionPrefix({ entities: { productId: "100" } })).toBe("cactus");
      });
    });
  });
});
