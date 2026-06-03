import { TimeFormatters } from "./formatters";
import { i18n } from "../helpers/i18n";

export const secondsToDh: TimeFormatters["secondsToDh"] = (seconds): string => {
  if (!seconds || seconds <= 0) {
    return "";
  }
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);

  let time;

  const dDisplay =
    d > 0 ? d + (d === 1 ? ` ${i18n({ key: "I18N.TIME.DAY" })}` : ` ${i18n({ key: "I18N.TIME.DAYS" })}`) : "";
  const hDisplay =
    h > 0 ? h + (h === 1 ? ` ${i18n({ key: "I18N.TIME.HOUR" })}` : ` ${i18n({ key: "I18N.TIME.HOURS" })}`) : "";

  if (d > 0 && h > 0) {
    time = `${dDisplay} & ${hDisplay}`;
  } else if (d === 0 && h === 0 && m > 0) {
    time = i18n({ key: "I18N.TIME.LESS_HOUR" });
  } else {
    time = `${dDisplay} ${hDisplay}`;
  }

  return time;
};

type UnitDisplay = "short" | "long" | "narrow";
const divMod = (n: number, m: number): number[] => [Math.floor(n / m), n % m];

/* This function is here due to an error on Hermes for iOS, which has problems with formatting days, hours and minutes,
 ** always returning them as seconds. To avoid a polyfill that can bring us more compatibility issues, was decided
 ** to do this "little" hack to understand if the formatting is wrong do a regular i18n conversion, otherwise use
 ** the Intl format
 */
const isCorrectlyFormatted =
  Intl.NumberFormat("en", {
    style: "unit",
    unit: "hour",
    unitDisplay: "narrow",
  }).format(1) === "1h";

export const timeLeftFormatter: TimeFormatters["timeLeftFormatter"] = (
  locale,
  millisecondsLeft,
  shouldCeilAndOnlyDisplayLargestUnit = false,
) => {
  const formatUnit = (unit: string, value: number, unitDisplay: UnitDisplay = "long") => {
    if (!isCorrectlyFormatted) {
      switch (unit) {
        case "day":
          return `${value} ${value === 1 ? i18n({ key: "I18N.TIME.DAY" }) : i18n({ key: "I18N.TIME.DAYS" })}`;
        case "hour":
          return `${value} ${value === 1 ? i18n({ key: "I18N.TIME.HOUR" }) : i18n({ key: "I18N.TIME.HOURS" })}`;
        case "minute":
        default:
          return `${value} ${i18n({ key: "I18N.TIME.MINUTES_SHORT" })}`;
      }
    }

    return Intl.NumberFormat(locale, {
      style: "unit",
      unit,
      unitDisplay,
    }).format(value);
  };

  const secondsLeft = millisecondsLeft / 1000;

  if (secondsLeft < 60) {
    return formatUnit("minute", 1, "short");
  }

  const [days, remainingSecondsAfterDays] = divMod(secondsLeft, 86400);
  const [hours, remainingSecondsAfterHours] = divMod(remainingSecondsAfterDays, 3600);
  const [minutes] = divMod(remainingSecondsAfterHours, 60);

  if (!days && !hours) {
    return formatUnit("minute", minutes, "short");
  }

  if (days && shouldCeilAndOnlyDisplayLargestUnit) {
    return formatUnit("day", hours > 0 ? days + 1 : days);
  }

  if (hours && shouldCeilAndOnlyDisplayLargestUnit) {
    return formatUnit("hour", minutes > 0 ? hours + 1 : hours);
  }

  return [days ? formatUnit("day", days) : null, hours ? formatUnit("hour", hours) : null].filter(Boolean).join(" ");
};
