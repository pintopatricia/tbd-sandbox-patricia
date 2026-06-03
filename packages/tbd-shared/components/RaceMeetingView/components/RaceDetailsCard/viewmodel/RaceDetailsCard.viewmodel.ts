import { getEventRegistry } from "eventemitter3-singleton";
import type { TranslationKey } from "../../../../../translations/keys";
import { i18n } from "../../../../../helpers/i18n";
import type { RaceDetailsCardEvents } from "./events";

export type RaceInput = {
  raceId: string;
  raceUrn: string;
  isHorseRacing: boolean;
  raceName: string;
  startTime: string;
  resultType: string | null;
  raceStatus: string | null;
  raceStatusLabel: string | null;
  numberOfRunners: number | null;
  raceClass: number | null;
  going: string | null;
  raceDetailsTitle: string | null;
  isRaceRunningStatus: boolean;
  availableToSubscribe: boolean;
};

export type MeetingInput = {
  name: string;
  venue: string;
  date: string | null;
  countryFlag: {
    vector?: string | null;
    small?: string | null;
  } | null;
};

export type RaceDetailsCardProps = {
  race: RaceInput;
  meeting: MeetingInput;
  locale: string;
  timezone: string;
  isHighlighted?: boolean;
};

const { emit } = getEventRegistry<RaceDetailsCardEvents>();

const onSubscribe = ({ raceUrn, isHorseRacing }: Pick<RaceInput, "raceUrn" | "isHorseRacing">) => {
  if (!isHorseRacing) {
    return;
  }

  emit("@@UI/RACE_DETAILS_CARD_SUBSCRIBE", { raceURN: raceUrn });
};

const onUnsubscribe = (raceURN: string) => {
  emit("@@UI/RACE_DETAILS_CARD_UNSUBSCRIBE", { raceURN });
};

const events = {
  onSubscribe,
  onUnsubscribe,
};

function formatTime(dateString: string, locale: string, timeZone: string): string {
  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "numeric",
    hour12: false,
    timeZone,
  }).format(new Date(dateString));
}

function toCountryFlag(flag: MeetingInput["countryFlag"]): { vector?: string; small?: string } | undefined {
  if (!flag) return undefined;
  return {
    ...(flag.vector ? { vector: flag.vector } : {}),
    ...(flag.small ? { small: flag.small } : {}),
  };
}

export function useRaceDetailsCardVM(race: RaceInput, meeting: MeetingInput, locale: string, timezone: string) {
  return {
    vm: {
      data: {
        countryFlag: toCountryFlag(meeting.countryFlag),
        raceTime: formatTime(race.startTime, locale, timezone),
        raceName: race.raceName,
        meetingName: meeting.venue,
        raceStatus: race.raceStatus ?? undefined,
        raceStatusLabel: race.raceStatusLabel ?? undefined,
        date: meeting.date ?? undefined,
        numberOfRunners: race.numberOfRunners ?? undefined,
        raceClass: race.raceClass ? `${i18n({ key: "I18N.LABELS.CLASS" })} ${race.raceClass}` : undefined,
        trackGoing: race.going ? i18n({ key: `I18N.RACE_GOING.${race.going}` as keyof TranslationKey }) : undefined,
        raceDetailsTitle: race.raceDetailsTitle ?? undefined,
        runnersLabel: i18n({ key: "I18N.LABELS.RUNNERS" }),
        isRaceRunningStatus: race.isRaceRunningStatus,
        availableToSubscribe: race.availableToSubscribe,
      },
      events,
    },
  };
}
