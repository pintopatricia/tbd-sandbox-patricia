export const MILLISECONDS_IN_A_DAY = 86400000;

/**
 * Formats a date for a numeric 12 hour representation.
 * Example: "08:10"
 *
 * @param {Date} dateParameter Date to be formatted
 * @param {string} locale The locale configuration to be used
 * @param {(string|undefined)} timeZone The timezone configuration to be used
 *
 * @return {string} Returns a string formatted with the time for the given date.
 */
// eslint-disable-next-line default-param-last
export function formatTime(dateParameter: Date | string, locale = "en-GB", timeZone?: string): string {
  const date = typeof dateParameter === "string" ? new Date(dateParameter) : dateParameter;
  const timeOptions: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "numeric", hour12: false, timeZone };

  return new Intl.DateTimeFormat(locale, timeOptions).format(date);
}

/**
 * This method adds the timezone offset of the user timezone to the date which is in UTC.
 * Example: ("2024-05-03T14:00:00.000Z", "Europe/London") => "2024-05-03T15:00:00.000Z"
 *
 * Receives the ISOString and makes it compliant to SMD service
 *
 * Unfortunately, SMD requires us to pass an UTC  ISO 8601 date time adjusted to the user TZ,
 * thus the need for this calculation.
 *
 * @param dateParameter UTC Date
 * @param timeZone User's timezone
 *
 * @return {string} Returns the UTC date string with the timezone offset added
 */
export function convertToSMDCompliantDateTime(dateParameter: Date | string, timeZone?: string): string {
  const date: Date = typeof dateParameter === "string" ? new Date(dateParameter) : dateParameter;
  const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
  const tzDate = new Date(date.toLocaleString("en-US", { timeZone }));
  const offset = utcDate.getTime() - tzDate.getTime();

  date.setTime(date.getTime() - offset);

  return date.toISOString();
}

/**
 * Format a date based on hours and minutes
 *
 * @param hours The hour value to be formatted
 * @param minutes The minute value to be formatted
 * @param locale The user details localeCode
 */
export function utcTime(hours: number, minutes: number, locale = "en-GB"): string {
  const date = new Date();
  date.setHours(hours - date.getTimezoneOffset() / 60);
  date.setMinutes(minutes);

  return formatTime(date, locale);
}

/**
 * Format any date string as a month
 *
 * @param date The date string to format
 * @param locale The user details locale
 */
export function formatMonthLong(date: string, locale = "en-GB"): string {
  return new Intl.DateTimeFormat(locale, { month: "long" }).format(new Date(date));
}

/**
 * Checks if a date is on the current day.
 *
 * @param dateParameter A date parameter
 *
 * @returns {boolean} Returns true if the date is the same as the current day.
 */
export function isToday(dateParameter: Date): boolean {
  const today = new Date(Date.now());
  return (
    dateParameter.getDate() === today.getDate() &&
    dateParameter.getMonth() === today.getMonth() &&
    dateParameter.getFullYear() === today.getFullYear()
  );
}

/**
 * Checks the number of days between two dates and offsets the timezone
 *
 * @param currentDate A recent date
 * @param pastDate A past date
 *
 * @returns {number} Returns the number of days between the dates.
 */
export function getDaysBetweenDates(currentDate: Date, pastDate: Date): number {
  const correctTimezoneOffset = (date: Date): number => {
    const dateInst = new Date(date);

    return dateInst.setMinutes(dateInst.getMinutes() - dateInst.getTimezoneOffset());
  };

  const numberOfDays = (correctTimezoneOffset(currentDate) - correctTimezoneOffset(pastDate)) / MILLISECONDS_IN_A_DAY;

  return Math.floor(numberOfDays);
}
