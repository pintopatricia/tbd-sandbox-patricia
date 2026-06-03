import { sanitizeBetId, prefixLBRBetId } from "./betting";

describe("betting helper", () => {
  beforeEach(jest.clearAllMocks);

  describe("sanitizeBetId", () => {
    it('should remove all digits from a given betId before the ":"', () => {
      expect(sanitizeBetId("123:4567890123")).toEqual("4567890123");
    });
  });

  describe("prefixLBRBetId", () => {
    it('should prefix an "1:" to betId', () => {
      expect(prefixLBRBetId("4567890123")).toEqual("1:4567890123");
    });
  });
});
