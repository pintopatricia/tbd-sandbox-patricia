import type { SelectorItem } from "@ppb/the-wall-common/types";
import { getEventRegistry } from "eventemitter3-singleton";
import type { JSX } from "react";
import type { RaceSwitcherCardEvents } from "./events";

type ViewLink = { viewUrl: string; viewUrn: string };

type ViewLinks = {
  [key: string]: ViewLink | undefined;
};

export interface SelectorItemWithVector extends SelectorItem {
  iconUrl?: {
    vector: string | null;
    small: string | null;
  };
  icon?: JSX.Element;
}

export type MeetingData = {
  urn: string;
  name: string;
  venue: string;
  country: string;
  date: string | null;
  countryFlag: {
    vector?: string | null;
    small?: string | null;
  } | null;
};

export type SiblingMeetingData = {
  meetingUrn: string;
  venue: string;
  countryFlag: {
    vector?: string | null;
    small?: string | null;
  } | null;
  viewLink: ViewLink;
};

const { emit } = getEventRegistry<RaceSwitcherCardEvents>();

const onClose = (urn: string, viewLink: ViewLink) => {
  emit("@@UI/RACE_SWITCHER_CLOSE", {
    urn,
    viewLink,
  });
};

const onOpen = (urn: string) => {
  emit("@@UI/RACE_SWITCHER_OPEN", {
    urn,
  });
};

const events = {
  onClose,
  onOpen,
};

export function useRaceSwitcherCardVM(
  meeting: MeetingData,
  siblings: SiblingMeetingData[],
  locale: string,
  timezone: string,
) {
  const defaultValue: SelectorItemWithVector = {
    id: meeting.urn,
    label: meeting.venue,
  };

  const icon = meeting.countryFlag
    ? {
        vector: meeting.countryFlag.vector || undefined,
        small: meeting.countryFlag.small || undefined,
      }
    : undefined;

  const items: SelectorItemWithVector[] = [];
  const links: ViewLinks = {};
  let defaultExists = false;

  for (const sibling of siblings) {
    items.push({
      id: sibling.meetingUrn,
      label: sibling.venue,
      iconUrl: sibling.countryFlag
        ? {
            vector: sibling.countryFlag.vector ?? null,
            small: sibling.countryFlag.small ?? null,
          }
        : undefined,
    });

    links[sibling.meetingUrn] = sibling.viewLink;
    defaultExists = defaultExists || sibling.meetingUrn === meeting.urn;
  }

  if (!defaultExists) {
    items.push({
      id: defaultValue.id,
      label: defaultValue.label,
    });
  }

  function formatDate(dateParameter: Date): string {
    const dateOptions: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      timeZone: timezone,
    };
    return new Intl.DateTimeFormat(locale, dateOptions).format(dateParameter);
  }

  const data = {
    title: meeting.name,
    defaultValue,
    items,
    links,
    icon,
    date: meeting.date ? formatDate(new Date(meeting.date)) : undefined,
  };

  return {
    vm: {
      data,
      events,
    },
  };
}
