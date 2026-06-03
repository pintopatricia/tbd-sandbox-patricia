import {
  formatDate,
  formatDateAndTimeWithMonth,
  formatDateWithMonth,
  formatDateWithDayAndMonthNumeric,
  formatDateWithMonthAndYearNumeric,
  formatDateWithToday,
  formatFullDate,
  formatFullDateAndTime,
  formatFullDateWithShortYear,
  formatStartDateWithTodayOrTomorrow,
  formatStartTime,
  formatStartTimeWithAt,
  formatTime,
  formatTimeLeft,
  formatWeekday,
  isPast,
  isToday,
  utcTime,
  formatDateWithTwoDigits,
  timeDifferenceFromNowInMillis,
} from "./dates";

const mockNowDate = "2020-01-01T12:15:00Z";
global.Date.now = jest.fn(() => new Date(mockNowDate).getTime());

jest.mock("./i18n", () => ({
  i18n: jest.fn(({ key, interpolationValues }) => (interpolationValues ? { key, interpolationValues } : key)),
}));

describe("isToday", () => {
  it("should return true when the date provided is from the same day", () => {
    expect(isToday(new Date(Date.now()), "Europe/London")).toBe(true);
  });

  it("should return false when the date provided is not from the same day", () => {
    expect(isToday(new Date("2019-12-23T12:15:00Z"), "Europe/London")).toBe(false);
  });
});

describe("formatDate", () => {
  it("should return formatted date", () => {
    expect(formatDate(new Date("2020-01-02T12:15:00Z"), "en-GB", "Europe/London")).toBe("2 Jan");
  });
});

describe("formatDateWithMonth", () => {
  it("should return formatted date", () => {
    expect(formatDateWithMonth(new Date("2020-01-02T12:15:00Z"), "en-GB", "Europe/London")).toBe("2 January");
  });
});

describe("formatDateWithDayAndMonthNumeric", () => {
  it("should return formatted date", () => {
    expect(formatDateWithDayAndMonthNumeric(new Date("2020-01-02"), "en-GB", "Europe/London")).toBe("02/01");
  });
});

describe("formatDateWithMonthAndYearNumeric", () => {
  it("should return formatted date", () => {
    expect(formatDateWithMonthAndYearNumeric(new Date("2020-01-02"), "en-GB", "Europe/London")).toBe("01/20");
  });
});

describe("formatDateWithTwoDigits", () => {
  it("should return formatted date", () => {
    expect(formatDateWithTwoDigits(new Date("2020-01-02"), "en-GB", "Europe/London")).toBe("02/01/20");
  });
});

describe("formatDateWithToday", () => {
  describe("when the date provided is from the same day", () => {
    it("should return the translation for 'TODAY'", () => {
      expect(formatDateWithToday(new Date(Date.now()), "en-GB", "Europe/London")).toBe("I18N.DATE.TODAY");
    });
  });

  describe("when the date provided is not from the same day", () => {
    it("should return the formatted date", () => {
      expect(formatDateWithToday(new Date("2020-01-04T12:15:00Z"), "en-GB", "Europe/London")).toBe("4 Jan");
    });
  });
});

describe("formatFullDate", () => {
  it("should return formatted date", () => {
    expect(formatFullDate(new Date("2020-01-02"), "en-GB", "Europe/London")).toBe("2 Jan 2020");
  });
});

describe("formatTime", () => {
  it("should return formatted time", () => {
    expect(formatTime(new Date("2020-01-02T12:15:00Z"), "en-GB", "Europe/London")).toBe(utcTime(12, 15));
  });

  describe("when time is string", () => {
    it("should return formatted time", () => {
      expect(formatTime("2020-01-02T12:15:00Z", "en-GB", "Europe/London")).toBe(utcTime(12, 15));
    });
  });
});

describe("formatFullDateAndTime", () => {
  it("should return formatted date and time", () => {
    expect(formatFullDateAndTime(new Date("2020-01-02T12:15:00Z"), "en-GB", "Europe/London")).toBe(
      `2 January 2020 at ${utcTime(12, 15)}`,
    );
  });
});

describe("formatDateAndTimeWithMonth", () => {
  it("should return formatted date and time with month", () => {
    expect(formatDateAndTimeWithMonth(new Date("2020-01-02T12:15:00Z"), "en-GB", "Europe/London")).toBe(
      `2 January at ${utcTime(12, 15)}`,
    );
  });
});

describe("formatStartTime", () => {
  it("should return formatted date", () => {
    expect(formatStartTime(new Date("2020-01-02T12:15:00Z"), "en-GB", "Europe/London")).toBe(
      `2 Jan, ${utcTime(12, 15)}`,
    );
  });

  describe("when time is string", () => {
    it("should return formatted time", () => {
      expect(formatStartTime("2020-01-02T12:15:00Z", "en-GB", "Europe/London")).toBe(`2 Jan, ${utcTime(12, 15)}`);
    });
  });

  describe("when the date provided is from the same day", () => {
    it("should return formatted date with i18n key", () => {
      const date = new Date(Date.now());
      date.setHours(0, 0, 0, 0);
      expect(formatStartTime(date, "en-GB", "Europe/London")).toBe("I18N.DATE.TODAY, 00:00");
    });
  });
});

describe("formatStartTimeWithAt", () => {
  it("should return formatted date", () => {
    expect(formatStartTimeWithAt(new Date("2020-01-02T12:15:00Z"), "en-GB", "Europe/London")).toBe(
      `2 January at ${utcTime(12, 15)}`,
    );
  });

  describe("when time is string", () => {
    it("should return formatted time", () => {
      expect(formatStartTimeWithAt("2020-01-02T12:15:00Z", "en-GB", "Europe/London")).toBe(
        `2 January at ${utcTime(12, 15)}`,
      );
    });
  });

  describe("when the date provided is from the same day", () => {
    it("should return formatted date with i18n key", () => {
      const date = new Date(Date.now());
      date.setHours(0, 0, 0, 0);
      expect(formatStartTimeWithAt(date, "en-GB", "Europe/London")).toEqual({
        key: "I18N.DATE.TODAY_AT",
        interpolationValues: {
          time: "00:00",
        },
      });
    });
  });
});

describe("formatFullDateWithShortYear", () => {
  it("should return formatted date", () => {
    expect(formatFullDateWithShortYear(new Date("2020-01-02T12:15:00Z"), "en-GB", "Europe/London")).toBe(`2 Jan 20`);
  });
});

describe("formatStartDateWithTodayOrTomorrow", () => {
  describe("when date is today", () => {
    it("should return formatted date as Today", () => {
      expect(formatStartDateWithTodayOrTomorrow(new Date(Date.now()), "en-GB", "Europe/London")).toBe(
        "I18N.DATE.TODAY",
      );
    });
  });

  describe("when date is tomorrow", () => {
    it("should return formatted date as Tomorrow", () => {
      const date = new Date(Date.now() + 24 * 60 * 60 * 1000);
      date.setHours(17, 0, 0, 0);
      expect(formatStartDateWithTodayOrTomorrow(date, "en-GB", "Europe/London")).toBe("I18N.DATE.TOMORROW");
    });
  });

  describe("when date is not today or tomorrow", () => {
    it("should return formatted date with year with 2 digits", () => {
      const date = new Date("2020-01-04T12:15:00Z");

      expect(formatStartDateWithTodayOrTomorrow(date, "en-GB", "Europe/London")).toBe("04/01/20");
    });
  });
});

describe("Format time left from today", () => {
  describe("when date is one day from today", () => {
    it("should return 24:00", () => {
      const date = new Date(Date.now() + 24 * 60 * 60 * 1000);
      expect(formatTimeLeft(date)).toBe("24:00");
    });
  });

  describe("when date is three days from today", () => {
    it("should return 72:00", () => {
      const date = "2020-01-04T12:15:00Z";
      expect(formatTimeLeft(date)).toBe("72:00");
    });
  });
});

describe("Format a date for weekday representation", () => {
  describe("When date day is Wednesday", () => {
    it("should return Wednesday", () => {
      expect(formatWeekday(mockNowDate, "en-GB", "Europe/London")).toBe("Wednesday");
    });
  });

  describe("When date day is Monday", () => {
    it("should return Monday", () => {
      const date = "2020-01-06T12:15:00Z";
      expect(formatWeekday(date, "en-GB", "Europe/London")).toBe("Monday");
    });
  });
});

describe("isPast", () => {
  describe("when date time has occurred", () => {
    it("should return true", () => {
      const date = "2019-01-01T12:15:00Z";

      expect(isPast(date)).toBe(true);
    });
  });

  describe("when date time is now", () => {
    it("should return true", () => {
      const date = mockNowDate;

      expect(isPast(date)).toBe(true);
    });
  });

  describe("when date time has not occurred yet", () => {
    it("should return false", () => {
      const date = "2020-01-04T12:15:00Z";

      expect(isPast(date)).toBe(false);
    });
  });
});

describe("timeDifferenceFromNowInMillis", () => {
  describe("when date time is in the past", () => {
    it("should return a negative value when passed a string", () => {
      const date = "2019-01-01T12:15:00Z";

      expect(timeDifferenceFromNowInMillis(date)).toBeLessThan(0);
    });

    it("should return a negative value when passed a Date", () => {
      const date = new Date("2019-01-01T12:15:00Z");

      expect(timeDifferenceFromNowInMillis(date)).toBeLessThan(0);
    });
  });

  describe("when date time is now", () => {
    it("should return zero", () => {
      const date = mockNowDate;

      expect(timeDifferenceFromNowInMillis(date)).toBe(0);
    });
  });

  describe("when date time is in the future", () => {
    it("should return a positive value when passed a string", () => {
      const date = "2020-01-04T12:15:00Z";

      expect(timeDifferenceFromNowInMillis(date)).toBeGreaterThan(0);
    });

    it("should return a positive value when passed a Date", () => {
      const date = new Date("2020-01-04T12:15:00Z");

      expect(timeDifferenceFromNowInMillis(date)).toBeGreaterThan(0);
    });
  });
});
