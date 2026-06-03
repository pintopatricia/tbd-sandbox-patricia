import type { RaceSelectableItem } from "@ppb/the-wall-common/types";
import { getEventRegistry } from "eventemitter3-singleton";
import type { RaceViewLinksCardEvents } from "./events";

function formatTime(dateParameter: Date | string, locale: string, timeZone: string): string {
  const date = typeof dateParameter === "string" ? new Date(dateParameter) : dateParameter;
  const timeOptions: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "numeric", hour12: false, timeZone };

  return new Intl.DateTimeFormat(locale, timeOptions).format(date);
}

type ViewLink = {
  viewUrn: string;
  viewUrl: string;
};

export type RaceNavigationItemData = {
  raceUrn: string;
  startTime: string;
  isRaceClosed: boolean;
  viewLink: ViewLink;
  promotion: string | null;
};

const { emit } = getEventRegistry<RaceViewLinksCardEvents>();

const onClick = (urn: string, viewLink: ViewLink) => {
  emit("@@UI/RACE_VIEW_LINKS_CARD_CLICKED", {
    urn,
    viewLink,
  });
};

const events = {
  onClick,
};

export function useRaceViewLinksCardVM(
  viewUrn: string,
  selectedRaceUrn: string | null,
  races: RaceNavigationItemData[],
  locale: string,
  timezone: string,
) {
  const data = races.reduce(
    (acc, { viewLink, startTime, isRaceClosed, raceUrn, promotion }, idx) => {
      acc.items.push({
        viewLink,
        raceTime: formatTime(startTime, locale, timezone),
        isRaceClosed,
        marketPromo: isRaceClosed ? undefined : ((promotion ?? undefined) as RaceSelectableItem["marketPromo"]),
      });

      if (selectedRaceUrn === raceUrn) {
        acc.defaultRaceIndex = idx;
      }

      return acc;
    },
    {
      items: [] as RaceSelectableItem[],
      defaultRaceIndex: 0,
    },
  );

  return {
    vm: {
      data,
      events,
      viewUrn,
    },
  };
}
