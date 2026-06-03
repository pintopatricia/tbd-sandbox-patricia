import { getRemainder, round, getPreciseAddition, getPreciseSubtraction } from "./math";

describe("Math", () => {
  describe("getRemainder", () => {
    describe("with low floating points numbers", () => {
      it("should return the correct remainder", () => {
        expect(getRemainder(1.015, 0.01)).toBe(0.005);
      });
    });

    describe("with high floating points numbers", () => {
      it("should return the correct remainder", () => {
        expect(getRemainder(11231.10012, 100.01)).toBe(29.98012);
      });
    });

    describe("with integer numbers", () => {
      it("should return the correct remainder", () => {
        expect(getRemainder(11231, 1)).toBe(0);
      });
    });
  });

  describe("round", () => {
    describe("with low floating points numbers", () => {
      it("should return the correct round", () => {
        expect(round(1.01512131, 2)).toBe(1.02);
      });
    });

    describe("with high floating points numbers", () => {
      it("should return the correct round", () => {
        expect(round(11231.10012, 2)).toBe(11231.1);
      });
    });

    describe("with integer numbers", () => {
      it("should return the correct round", () => {
        expect(round(11231, 2)).toBe(11231);
      });
    });
  });

  describe("getPreciseAddition", () => {
    it("should return the correct sum", () => {
      // IEEE 754: 18.08 + 1.11 = 19.189999999999998
      expect(getPreciseAddition(18.08, 1.11)).toBe(19.19);
    });
  });

  describe("getPreciseSubtraction", () => {
    it("should return the correct sum", () => {
      // IEEE 754: 18.9 - 1.10 = 17.799999999999997
      expect(getPreciseSubtraction(18.9, 1.1)).toBe(17.8);
    });
  });
});
