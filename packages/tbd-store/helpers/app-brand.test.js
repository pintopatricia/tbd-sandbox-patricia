import { isBetfairProduct, isSkybetProduct } from "./app-brand";

describe("App Brand", () => {
  describe("isBetfairProduct", () => {
    describe("when called without productId", () => {
      it("should return false", () => {
        expect(isBetfairProduct(null)).toBeFalsy();
      });
    });

    describe("when called without a betfair productId", () => {
      it("should return false", () => {
        expect(isBetfairProduct("100")).toBeFalsy();
      });
    });

    describe("when called with a betfair productId", () => {
      it("should return true", () => {
        expect(isBetfairProduct("90")).toBeTruthy();
      });
    });
  });

  describe("isSkybetProduct", () => {
    describe("when called without productId", () => {
      it("should return false", () => {
        expect(isSkybetProduct(null)).toBeFalsy();
      });
    });

    describe("when called without a skybet productId", () => {
      it("should return false", () => {
        expect(isSkybetProduct("90")).toBeFalsy();
      });
    });

    describe("when called with a skybet web productId", () => {
      it("should return true", () => {
        expect(isSkybetProduct("110")).toBeTruthy();
      });
    });

    describe("when called with a skybet native productId", () => {
      it("should return true", () => {
        expect(isSkybetProduct("100")).toBeTruthy();
      });
    });
  });
});
