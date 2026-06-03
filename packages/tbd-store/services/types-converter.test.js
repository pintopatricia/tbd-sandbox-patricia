import { ExchangeMarketStatus } from "../state/entities";
import { SportsbookMarketStatus } from "../state/constants";
import { getExchangeMarketStatus, getSportsbookMarketStatus, getSportsbookRunnerStatus } from "./types-converter";

describe("getExchangeMarketStatus", () => {
  describe("when market is OPEN", () => {
    it("should convert to OPEN enum", () => {
      expect(getExchangeMarketStatus("OPEN")).toEqual(ExchangeMarketStatus.Open);
    });
  });

  describe("when market is CLOSED", () => {
    it("should convert to CLOSED enum", () => {
      expect(getExchangeMarketStatus("CLOSED")).toEqual(ExchangeMarketStatus.Closed);
    });
  });

  describe("when market is SUSPENDED", () => {
    it("should convert to SUSPENDED enum", () => {
      expect(getExchangeMarketStatus("SUSPENDED")).toEqual(ExchangeMarketStatus.Suspended);
    });
  });
});

describe("getSportsbookMarketStatus", () => {
  describe("when market is OPEN", () => {
    it("should convert to OPEN enum", () => {
      expect(getSportsbookMarketStatus("OPEN")).toEqual(SportsbookMarketStatus.OPEN);
    });
  });

  describe("when market is SUSPENDED", () => {
    it("should convert to SUSPENDED enum", () => {
      expect(getSportsbookMarketStatus("SUSPENDED")).toEqual(SportsbookMarketStatus.SUSPENDED);
    });
  });
});

describe("getSportsbookRunnerStatus", () => {
  describe("when runner is ACTIVE", () => {
    it("should convert to ACTIVE enum", () => {
      expect(getSportsbookRunnerStatus("ACTIVE")).toEqual("ACTIVE");
    });
  });

  describe("when market is SUSPENDED", () => {
    it("should convert to SUSPENDED enum", () => {
      expect(getSportsbookRunnerStatus("SUSPENDED")).toEqual("SUSPENDED");
    });
  });

  describe("when market is REMOVED", () => {
    it("should convert to REMOVED enum", () => {
      expect(getSportsbookRunnerStatus("REMOVED")).toEqual("REMOVED");
    });
  });
});
