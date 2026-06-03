import { secondsToDh, timeLeftFormatter } from "./time-formatters";
import { i18n } from "../helpers/i18n";

jest.mock("../helpers/i18n", () => ({
  i18n: ({ key, interpolationValues }) => ({ key, interpolationValues }),
}));

describe("format seconds to days, hours", () => {
  it("should display the days and hours", () => {
    const time = secondsToDh(129600);

    expect(time).toEqual(`1 ${i18n({ key: "I18N.TIME.DAY" })} & 12 ${i18n({ key: "I18N.TIME.HOURS" })}`);
  });

  it("should display the correct value when is more than one day", () => {
    const time = secondsToDh(176400);

    expect(time).toEqual(`2 ${i18n({ key: "I18N.TIME.DAYS" })} & 1 ${i18n({ key: "I18N.TIME.HOUR" })}`);
  });

  it("should display the value when number of hours is 0", () => {
    const time = secondsToDh(86400);

    expect(time).toEqual(`1 ${i18n({ key: "I18N.TIME.DAY" })} `);
  });

  it("should display the value when number of days is 0", () => {
    const time = secondsToDh(7200);

    expect(time).toEqual(` 2 ${i18n({ key: "I18N.TIME.HOURS" })}`);
  });

  it("should display less than 1 hour when is less than one hour", () => {
    const time = secondsToDh(720);

    expect(time).toEqual(i18n({ key: "I18N.TIME.LESS_HOUR" }));
  });

  it("should return empty string when seconds value is 0", () => {
    const time = secondsToDh(0);

    expect(time).toEqual("");
  });

  it("should return empty string when seconds value is < 0", () => {
    const time = secondsToDh(-1300);

    expect(time).toEqual("");
  });
});

describe("timeLeftFormatter", () => {
  const numberFormatSpy = jest.spyOn(Intl, "NumberFormat");
  const locale = "en-US";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 1 min when time is less than one minute", () => {
    const millisecondsLeft = 1;
    const result = timeLeftFormatter(locale, millisecondsLeft);

    expect(result).toBe("1 min");
    expect(numberFormatSpy).toHaveBeenCalledWith(locale, { style: "unit", unit: "minute", unitDisplay: "short" });
  });

  it("should return the amount of minutes in short form when time is less than one hour", () => {
    // 30 minutes
    const millisecondsLeft = 1800000;
    const result = timeLeftFormatter(locale, millisecondsLeft);

    expect(result).toBe("30 min");
    expect(numberFormatSpy).toHaveBeenCalledWith(locale, { style: "unit", unit: "minute", unitDisplay: "short" });
  });

  it("should return the amount of hours when time is more than one hour", () => {
    // 1 hour and 30 minutes
    const millisecondsLeft = 5400000;
    const result = timeLeftFormatter(locale, millisecondsLeft);

    expect(result).toBe("1 hour");
    expect(numberFormatSpy).toHaveBeenCalledWith(locale, { style: "unit", unit: "hour", unitDisplay: "long" });
  });

  it("should return the amount of hours when time is more than one hour and should only display and ceil the largest unit", () => {
    // 1 hour and 30 minutes
    const millisecondsLeft = 5400000;
    const result = timeLeftFormatter(locale, millisecondsLeft, true);

    expect(result).toBe("2 hours");
    expect(numberFormatSpy).toHaveBeenCalledWith(locale, { style: "unit", unit: "hour", unitDisplay: "long" });
  });

  it("should return only the amount of hours when its value is exact (0 minutes) and should only display and ceil the largest unit", () => {
    // 1 hour
    const millisecondsLeft = 3600000;
    const result = timeLeftFormatter(locale, millisecondsLeft, true);

    expect(result).toBe("1 hour");
    expect(numberFormatSpy).toHaveBeenCalledWith(locale, { style: "unit", unit: "hour", unitDisplay: "long" });
  });

  it("should return the amount of days and hours when time is more than 24 hours", () => {
    // 36 hours
    const millisecondsLeft = 129600000;
    const result = timeLeftFormatter(locale, millisecondsLeft);

    expect(result).toBe("1 day 12 hours");
    expect(numberFormatSpy).toHaveBeenCalledWith(locale, { style: "unit", unit: "day", unitDisplay: "long" });
    expect(numberFormatSpy).toHaveBeenCalledWith(locale, { style: "unit", unit: "hour", unitDisplay: "long" });
  });

  it("should return the amount of days when time is more than 24 hours and should only display and ceil the largest unit", () => {
    // 36 hours
    const millisecondsLeft = 129600000;
    const result = timeLeftFormatter(locale, millisecondsLeft, true);

    expect(result).toBe("2 days");
    expect(numberFormatSpy).toHaveBeenCalledWith(locale, { style: "unit", unit: "day", unitDisplay: "long" });
  });

  it("should return only the amount of days when its value is exact (0 hours)", () => {
    // 48 hours
    const millisecondsLeft = 172800000;
    const result = timeLeftFormatter(locale, millisecondsLeft);

    expect(result).toBe("2 days");
    expect(numberFormatSpy).toHaveBeenCalledWith(locale, { style: "unit", unit: "day", unitDisplay: "long" });
  });

  it("should return only the amount of days when its value is exact (0 hours) and should only display and ceil the largest unit", () => {
    // 48 hours
    const millisecondsLeft = 172800000;
    const result = timeLeftFormatter(locale, millisecondsLeft, true);

    expect(result).toBe("2 days");
    expect(numberFormatSpy).toHaveBeenCalledWith(locale, { style: "unit", unit: "day", unitDisplay: "long" });
  });

  it("should return the time left for any other locale", () => {
    // 36 hours
    const millisecondsLeft = 129600000;
    const spanishLocale = "es-US";
    const result = timeLeftFormatter(spanishLocale, millisecondsLeft);

    expect(result).toBe("1 día 12 horas");
    expect(numberFormatSpy).toHaveBeenCalledWith(spanishLocale, { style: "unit", unit: "day", unitDisplay: "long" });
    expect(numberFormatSpy).toHaveBeenCalledWith(spanishLocale, { style: "unit", unit: "hour", unitDisplay: "long" });
  });
});
