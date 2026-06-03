import { i18n } from "./i18n";

/**
 * Checks if a date is on the current day.
 *
 * @param dateParameter A date parameter
 * @param {string} [timeZone] The timezone configuration to be used
 *
 * @returns {boolean} Returns true if the date is the same as the current day.
 */
export function isToday(dateParameter: Date, timeZone: string): boolean {
  // we're ignoring the locale param below because we just want to compare the dates disregarding the date format
  const date = new Date(dateParameter).toLocaleDateString(undefined, { timeZone });
  const today = new Date(Date.now()).toLocaleDateString(undefined, { timeZone });
  return date === today;
}

/**
 * Checks if a date is on the next day.
 *
 * @param dateParameter A date parameter
 * @param {string} [timeZone] The timezone configuration to be used
 *
 * @returns {boolean} Returns true if the date is tomorrow related with the current day.
 */
function isTomorrow(dateParameter: Date, timeZone: string): boolean {
  // we're ignoring the locale param below because we just want to compare the dates disregarding the date format
  const date = new Date(dateParameter).toLocaleDateString(undefined, { timeZone });
  const tomorrowDate = new Date(Date.now());
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);

  const tomorrow = new Date(tomorrowDate).toLocaleDateString(undefined, { timeZone });
  return date === tomorrow;
}

/**
 * Formats a date for a numeric 12-hour representation.
 * Example: "08:10"
 *
 * @param {Date} dateParameter Date to be formatted
 * @param {string} locale The locale configuration to be used
 * @param {string} [timeZone] The timezone configuration to be used
 *
 * @return {string} Returns a string formatted with the time for the given date.
 */
export function formatTime(dateParameter: Date | string, locale: string, timeZone: string): string {
  const date = typeof dateParameter === "string" ? new Date(dateParameter) : dateParameter;
  const timeOptions: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "numeric", hour12: false, timeZone };

  return new Intl.DateTimeFormat(locale, timeOptions).format(date);
}

/**
 * Formats a date for a month representation.
 * Example: "5 Feb"
 *
 * @param {Date} dateParameter Date to be formatted
 * @param {string} locale The locale configuration to be used
 * @param {string} [timeZone] The timezone configuration to be used
 *
 * @return {string} Returns a string formatted for the given date.
 */
export function formatDate(dateParameter: Date, locale: string, timeZone: string): string {
  const dateOptions: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", timeZone };
  return new Intl.DateTimeFormat(locale, dateOptions).format(dateParameter);
}

/**
 * Formats a date for a day/month numeric representation.
 * Example: "1/12"
 *
 * @param {Date} dateParameter Date to be formatted
 * @param {string} locale The locale configuration to be used
 * @param {string} [timeZone] The timezone configuration to be used
 *
 * @return {string} Returns a string formatted for the given date.
 */
export function formatDateWithDayAndMonthNumeric(dateParameter: Date, locale: string, timeZone: string): string {
  const dateOptions: Intl.DateTimeFormatOptions = { day: "numeric", month: "numeric", timeZone };
  return new Intl.DateTimeFormat(locale, dateOptions).format(dateParameter);
}

/**
 * Formats a date for a month/year numeric representation.
 * Example: "12/24"
 *
 * @param {Date} dateParameter Date to be formatted
 * @param {string} locale The locale configuration to be used
 * @param {string} [timeZone] The timezone configuration to be used
 *
 * @return {string} Returns a string formatted for the given date.
 */
export function formatDateWithMonthAndYearNumeric(dateParameter: Date, locale: string, timeZone: string): string {
  const dateOptions: Intl.DateTimeFormatOptions = { month: "2-digit", year: "2-digit", timeZone };
  return new Intl.DateTimeFormat(locale, dateOptions).format(dateParameter);
}

/**
 * Formats a date for a day/month/year numeric representation.
 * Example: "1/12/24"
 *
 * @param {Date} dateParameter Date to be formatted
 * @param {string} locale The locale configuration to be used
 * @param {string} [timeZone] The timezone configuration to be used
 *
 * @return {string} Returns a string formatted for the given date.
 */
export function formatDateWithTwoDigits(dateParameter: Date, locale: string, timeZone: string): string {
  const dateOptions: Intl.DateTimeFormatOptions = { day: "numeric", month: "numeric", year: "2-digit", timeZone };
  return new Intl.DateTimeFormat(locale, dateOptions).format(dateParameter);
}

/**
 * Formats a date for a month representation.
 * Example: "5 Feb"
 *
 * @param {Date} dateParameter Date to be formatted
 * @param {string} locale The locale configuration to be used
 * @param {string} [timeZone] The timezone configuration to be used
 *
 * @return {string} Returns a string formatted for the given date.
 */
export function formatDateWithMonth(dateParameter: Date, locale: string, timeZone: string): string {
  const dateOptions: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", timeZone };
  return new Intl.DateTimeFormat(locale, dateOptions).format(dateParameter);
}

/**
 * Formats a date for a month representation or returns label for Today.
 * Example: "5 Feb" or "Today"
 *
 * @param {Date} dateParameter Date to be formatted
 * @param {string} locale The locale configuration to be used
 * @param {string} timeZone The timezone configuration to be used
 *
 * @return {string} Returns a string formatted for the given date or the label for Today if it is today's date.
 */
export function formatDateWithToday(dateParameter: Date, locale: string, timeZone: string): string {
  return isToday(dateParameter, timeZone)
    ? i18n({ key: "I18N.DATE.TODAY" })
    : formatDate(dateParameter, locale, timeZone);
}

/**
 * Formats a date and time for a full representation.
 * Output example: "5 March 2020, 12:30"
 *
 * @param {Date} dateParameter Date to be formatted
 * @param {string} [locale] The locale configuration to be used
 * @param {string} [timeZone] The timezone configuration to be used
 *
 * @return {string} Returns a string formatted with the time for the given date.
 */
export function formatFullDateAndTime(dateParameter: Date, locale: string, timeZone: string): string {
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
    timeZone,
  };

  return new Intl.DateTimeFormat(locale, dateOptions).format(dateParameter);
}

/**
 * Formats a date and time for a month representation.
 * Output example: "5 March, 12:30"
 *
 * @param {Date} dateParameter Date to be formatted
 * @param {string} [locale] The locale configuration to be used
 * @param {string} [timeZone] The timezone configuration to be used
 *
 * @return {string} Returns a string formatted with the time for the given date.
 */
export function formatDateAndTimeWithMonth(dateParameter: Date, locale: string, timeZone: string): string {
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
    timeZone,
  };

  return new Intl.DateTimeFormat(locale, dateOptions).format(dateParameter);
}

/**
 * Formats a date for a full representation.
 * Output example: "5 Feb 2020"
 *
 * @param {Date} dateParameter Date to be formatted
 * @param {string} [locale] The locale configuration to be used
 * @param {string} [timeZone] The timezone configuration to be used
 *
 * @return {string} Returns a string formatted with the time for the given date.
 */
export function formatFullDate(dateParameter: Date, locale: string, timeZone: string): string {
  const dateOptions: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric", timeZone };
  return new Intl.DateTimeFormat(locale, dateOptions).format(dateParameter);
}

/**
 * Formats a date for a full representation with 2 digit year.
 * Output example: "5 Feb 20"
 *
 * @param {Date} dateParameter Date to be formatted
 * @param {string} [locale] The locale configuration to be used
 * @param {string} [timeZone] The timezone configuration to be used
 *
 * @return {string} Returns a string formatted with the time for the given date.
 */
export function formatFullDateWithShortYear(dateParameter: Date, locale: string, timeZone: string): string {
  const yearOptions: Intl.DateTimeFormatOptions = { year: "2-digit", timeZone };
  const shortYear = new Intl.DateTimeFormat(locale, yearOptions).format(dateParameter);

  return `${formatDate(dateParameter, locale, timeZone)} ${shortYear}`;
}

export function formatStartTime(startTime: Date | string, locale: string, timeZone: string): string {
  const dateStartTime = typeof startTime === "string" ? new Date(startTime) : startTime;
  const date = formatDateWithToday(dateStartTime, locale, timeZone);
  const time = formatTime(dateStartTime, locale, timeZone);
  return `${date}, ${time}`;
}

export function formatStartTimeWithAt(startTime: Date | string, locale: string, timezone: string): string {
  const dateStartTime = typeof startTime === "string" ? new Date(startTime) : startTime;
  const time = formatTime(dateStartTime, locale, timezone);

  return isToday(dateStartTime, timezone)
    ? i18n({ key: "I18N.DATE.TODAY_AT", interpolationValues: { time } })
    : formatDateAndTimeWithMonth(new Date(startTime), locale, timezone);
}

export function formatStartDateWithTodayOrTomorrow(startTime: Date | string, locale: string, timezone: string): string {
  const dateStartTime = typeof startTime === "string" ? new Date(startTime) : startTime;

  if (isToday(dateStartTime, timezone)) {
    return i18n({ key: "I18N.DATE.TODAY" });
  }
  if (isTomorrow(dateStartTime, timezone)) {
    return i18n({ key: "I18N.DATE.TOMORROW" });
  }
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "numeric",
    year: "2-digit",
    timeZone: timezone,
  };

  return new Intl.DateTimeFormat(locale, dateOptions).format(dateStartTime);
}

/**
 * Formats a date to display a countdown with time left from today.
 * Output example: "13:00"
 *
 * @param dateParameter Date to be formatted
 *
 * @return Returns a string formatted with time left until the date provided.
 */
export function formatTimeLeft(dateParameter: Date | string): string {
  const date = typeof dateParameter === "string" ? new Date(dateParameter) : dateParameter;
  const today = new Date(Date.now()).getTime();

  const diffInMs = Math.abs(date.getTime() - today);

  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInMinutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));

  const formattedHours = String(diffInHours).padStart(2, "0");
  const formattedMinutes = String(diffInMinutes).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}`;
}

/**
 * Formats a date for a weekday representation.
 * Output example: "Monday"
 *
 * @param dateParameter Date to be formatted
 * @param locale The locale configuration to be used
 * @param timeZone The timezone configuration to be used
 *
 * @return Returns a string formatted with weekday for the given date.
 */
export function formatWeekday(dateParameter: Date | string, locale: string, timeZone: string): string {
  const date = typeof dateParameter === "string" ? new Date(dateParameter) : dateParameter;
  const dayOptions: Intl.DateTimeFormatOptions = { weekday: "long", timeZone };

  return new Intl.DateTimeFormat(locale, dayOptions).format(date);
}

export function utcTime(hours: number, minutes: number): string {
  const date = new Date();
  date.setHours(hours - date.getTimezoneOffset() / 60);
  date.setMinutes(minutes);
  return formatTime(date, "en-GB", "UTC");
}

export function isPast(dateTime: Date | string): boolean {
  return new Date(Date.now()).getTime() >= new Date(dateTime).getTime();
}

/**
 * Calculates the time difference in milliseconds between a given date and the current time.
 * A positive value indicates a future date, while a negative value indicates a past date.
 *
 * @param dateTime A `Date` or `string` parameter.
 *
 * @returns The time difference in milliseconds between the given date and now.
 */
export function timeDifferenceFromNowInMillis(dateTime: Date | string): number {
  const nowDate = new Date(Date.now());
  const comparisonDate = typeof dateTime === "string" ? new Date(dateTime) : dateTime;

  return comparisonDate.getTime() - nowDate.getTime();
}
