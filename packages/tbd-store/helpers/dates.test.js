import {
  formatTime,
  utcTime,
  formatMonthLong,
  isToday,
  getDaysBetweenDates,
  convertToSMDCompliantDateTime,
} from "./dates";

describe("formatTime", () => {
  describe("when locale is undefined", () => {
    it("should return formatted time", () => {
      expect(formatTime(new Date("2020-01-02T12:15:00Z"))).toBe(utcTime(12, 15));
    });

    describe("when time is string", () => {
      it("should return formatted time", () => {
        expect(formatTime("2020-01-02T12:15:00Z")).toBe(utcTime(12, 15));
      });
    });
  });

  describe("when locale is defined", () => {
    it("should return formatted time", () => {
      expect(formatTime(new Date("2020-01-02T12:15:00Z"), "pt-PT", "Europe/Lisbon")).toBe(utcTime(12, 15));
    });

    describe("when time is string", () => {
      it("should return formatted time", () => {
        expect(formatTime("2020-01-02T12:15:00Z", "pt-PT", "Europe/Lisbon")).toBe(utcTime(12, 15));
      });
    });
  });
});

describe("convertToSMDCompliantDateTime", () => {
  describe.each([
    ["UTC", "2024-05-03T15:50:00.000Z"],
    ["Europe/London", "2024-05-03T16:50:00.000Z"],
    ["Europe/Kiev", "2024-05-03T18:50:00.000Z"],
    ["America/Sao_paulo", "2024-05-03T12:50:00.000Z"],
  ])("when user's timeZone is %s", (timeZone, date) => {
    describe("and dateParameter is a Date", () => {
      it("should return ISOString date compliant to %s", () => {
        expect(convertToSMDCompliantDateTime(new Date("2024-05-03T15:50:00.000Z"), timeZone)).toBe(date);
      });
    });

    describe("and dateParameter is string", () => {
      it("should return ISOString date compliant to %s", () => {
        expect(convertToSMDCompliantDateTime("2024-05-03T15:50:00.000Z", timeZone)).toBe(date);
      });
    });
  });
});

describe("formatMonthLong", () => {
  it("should return the month name", () => {
    expect(formatMonthLong("2020-01-02T12:15:00Z", "pt-PT")).toBe("janeiro");
  });

  it("should use 'en-GB' as the default localeCode", () => {
    expect(formatMonthLong("2020-01-02T12:15:00Z", undefined)).toBe("January");
  });
});

describe("isToday", () => {
  it("should return true when the date provided is from the same day", () => {
    expect(isToday(new Date(Date.now()))).toBe(true);
  });

  it("should return false when the date provided is not from the same day", () => {
    expect(isToday(new Date("2019-12-23T12:15:00Z"))).toBe(false);
  });
});

describe("getDaysBetweenDates", () => {
  it("should return the number of days between two dates", () => {
    expect(getDaysBetweenDates("2020-12-22T12:15:00Z", "2019-12-23T12:15:00Z")).toBe(365);
  });

  it("should return the number of days between two dates in different timezones", () => {
    expect(getDaysBetweenDates("2020-12-22T01:15:00Z", "2019-12-23T12:15:00Z")).toBe(364);
  });
});
