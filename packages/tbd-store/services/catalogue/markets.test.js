import { isRaceMarket } from "./markets";

describe("isRaceMarket", () => {
  it("should return true when the market hierarchy has a race and a meeting", () => {
    const market = {
      urn: "marketUrn",
      hierarchy: { race: "raceUrn", meeting: "meetingUrn" },
    };
    expect(isRaceMarket(market)).toBe(true);
  });

  it("should return false when the market hasn't the hierarchy", () => {
    const market = {
      urn: "marketUrn",
    };
    expect(isRaceMarket(market)).toBe(false);
  });

  it("should return false when the market hierarchy hasn't a meeting or a race", () => {
    const market = {
      urn: "marketUrn",
      hierarchy: { race: "raceUrn" },
    };
    expect(isRaceMarket(market)).toBe(false);
  });
});
