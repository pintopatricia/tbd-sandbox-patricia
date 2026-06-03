import { FootballPeriod, FootballPeriodStatus } from "../clients/sca/sports-content-api-response-types";
import { FootballMatchPeriod, FootballMatchStatus } from "../state/entities/football-fixture/FootballFixture.types";

enum PeriodEndMinutes {
  FIRST_HALF = 45,
  SECOND_HALF = 90,
  EXTRA_TIME_FIRST_HALF = 105,
  EXTRA_TIME_SECOND_HALF = 120,
}

export const footballMatchPeriodEndMap = {
  [FootballMatchPeriod.REGULAR]: {
    [FootballMatchStatus.INPLAY_FIRST_HALF]: PeriodEndMinutes.FIRST_HALF,
    [FootballMatchStatus.INPLAY_SECOND_HALF]: PeriodEndMinutes.SECOND_HALF,
  },
  [FootballMatchPeriod.EXTRA]: {
    [FootballMatchStatus.INPLAY_FIRST_HALF]: PeriodEndMinutes.EXTRA_TIME_FIRST_HALF,
    [FootballMatchStatus.INPLAY_SECOND_HALF]: PeriodEndMinutes.EXTRA_TIME_SECOND_HALF,
  },
};

export function getClockExtraMinutes(
  minute: number,
  period: FootballPeriod | FootballMatchPeriod | null,
  periodStatus: FootballMatchStatus | FootballPeriodStatus | null,
): string {
  const currentMinute = minute + 1;

  if (
    !period ||
    !periodStatus ||
    (periodStatus !== FootballMatchStatus.INPLAY_FIRST_HALF && periodStatus !== FootballMatchStatus.INPLAY_SECOND_HALF)
  ) {
    return `${currentMinute}`;
  }

  const periodEnd = footballMatchPeriodEndMap[period][periodStatus];
  const extraMinutes = currentMinute > periodEnd ? currentMinute - periodEnd : 0;

  return extraMinutes ? `${periodEnd}\u00A0+${extraMinutes}` : `${currentMinute}`;
}
