import getTimeRemaining from "./getTimeRemaining";

describe("when getting the time remaining of the Sky Bet Club promotion", () => {
  it("should return and empty string if fulfillmentEndDate is null", () => {
    expect(getTimeRemaining("en-gb", new Date("2024-12-24T10:14:11.000Z"), null)).toEqual("");
  });

  it("should return and empty string if fulfillmentEndDate is not a valid date string", () => {
    expect(getTimeRemaining("en-gb", new Date("2024-12-24T10:14:11.000Z"), "aaaaaaaaa")).toEqual("");
  });

  test.each([
    ["2024-12-24T10:14:11.000Z", "2024-12-31 23:59:59", "8 days"],
    ["2024-12-30T10:34:11.000Z", "2024-12-31 23:59:59", "2 days"],
    ["2024-12-31T12:34:11.000Z", "2024-12-31 23:59:59", "12 hours"],
    ["2024-12-31T22:34:11.000Z", "2024-12-31 23:59:59", "2 hours"],
    ["2024-12-31T23:14:11.000Z", "2024-12-31 23:59:59", "45 mins"],
    ["2024-12-31T23:58:11.000Z", "2024-12-31 23:59:59", "1 min"],
    ["2024-12-31T23:58:33.000Z", "2024-12-31 23:59:59", "1 min"],
    ["2025-01-01T00:01:33.000Z", "2024-12-31 23:59:59", "1 min"],
    ["2024-10-26T23:34:11.000Z", "2024-10-27 23:59:59", "1 day"],
    // Going out of daylight savings
    ["2024-10-24T23:34:11.000Z", "2024-10-27 23:59:59", "3 days"],
    ["2024-10-26T23:34:11.000Z", "2024-10-27 23:59:59", "1 day"],
    ["2024-10-27T01:34:11.000Z", "2024-10-27 23:59:59", "23 hours"],
    // Going into daylight savings
    ["2024-03-27T23:34:11.000Z", "2024-03-30 23:59:59", "3 days"],
    ["2024-03-29T23:34:11.000Z", "2024-03-30 23:59:59", "1 day"],
    ["2024-03-30T01:34:11.000Z", "2024-03-30 23:59:59", "23 hours"],
  ])(
    "when fulfillment end date is %s and now is %s - time remaining should be %s",
    (now, fulfillmentEndDate, expected) => {
      expect(getTimeRemaining("en-gb", new Date(now), fulfillmentEndDate)).toBe(expected);
    },
  );
});
