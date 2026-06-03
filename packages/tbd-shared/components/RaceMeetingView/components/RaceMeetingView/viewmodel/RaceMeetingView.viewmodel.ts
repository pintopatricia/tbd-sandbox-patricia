import { useMemo } from "react";
import { getEventRegistry } from "eventemitter3-singleton";
import { useRaceMeetingViewAppContextQuery, useRaceMeetingViewQuery } from "../model/RaceMeetingView.graphql";
import type { MeetingData, SiblingMeetingData } from "../../RaceSwitcherCard/viewmodel/RaceSwitcherCard.viewmodel";
import type { RaceMeetingViewEvents } from "./events";
import type { RaceMeetingViewQuery } from "../../../../../types/__generated__/graphql";
import type { TranslationKey } from "../../../../../translations/keys";
import { i18n } from "../../../../../helpers/i18n";

type ViewLink = {
  viewUrn: string;
  viewUrl: string;
};

const { emit } = getEventRegistry<RaceMeetingViewEvents>();

const onMount = (urn: string) => {
  emit("@@UI/RACE_MEETING_VIEW_LOADED", { urn });
};

const onSiblingSelected = (urn: string, viewLink: ViewLink) => {
  emit("@@UI/RACE_MEETING_VIEW_SIBLING_SELECTED", { urn, viewLink });
};

const onCardClicked = (viewUrn: string, cardUrn: string) => {
  emit("@@UI/RACE_MEETING_VIEW_CARD_CLICKED", { viewUrn, cardUrn });
};

const fetchBars = (viewUrn: string) => {
  emit("@@UI/FETCH_BARS", {
    bottomBar: true,
    leftSidebar: true,
    viewUrn,
  });
};

const RUNNING_STATUSES = new Set(["UNDER_ORDERS", "OFF", "RESULT"]);

function isRaceRunningStatus(status: string | null | undefined): boolean {
  return !!status && RUNNING_STATUSES.has(status);
}

function formatRaceStatus(status: string | undefined | null): string | null {
  if (!status || status === "DORMANT") return null;
  return i18n({ key: `I18N.RACE_STATUS.${status}` as keyof TranslationKey });
}

export type Broadcasts = {
  liveVideoUrl: string | null;
  dataVizUrl: string | null;
};

export type RunnerRating = {
  name: string;
  stars: number;
};

export type ExpertViewData = {
  verdict: string | null;
  runnerRatings: RunnerRating[];
};

export type RaceItem = {
  raceId: string;
  raceUrn: string;
  isHorseRacing: boolean;
  raceName: string;
  startTime: string;
  isRaceClosed: boolean;
  resultType: string | null;
  raceStatus: string | null;
  raceStatusLabel: string | null;
  numberOfRunners: number | null;
  raceClass: number | null;
  going: string | null;
  raceDetailsTitle: string | null;
  isRaceRunningStatus: boolean;
  viewLink: ViewLink;
  promotion: string | null;
  broadcasts: Broadcasts | null;
  expertView: ExpertViewData | null;
  availableToSubscribe: boolean;
};

type RaceMeetingViewResult = Extract<NonNullable<RaceMeetingViewQuery["View"]>, { __typename: "RaceMeetingView" }>;
export type InitialItemsData = RaceMeetingViewResult["items"];

type SiblingMeeting = {
  urn: string;
  name: string;
  venue: string;
  country: string;
  countryFlagUrl: string | null;
  viewLink: ViewLink;
};

type RaceMeetingViewData = {
  urn: string;
  title: string | null;
  meeting: MeetingData;
  sportName: string | null;
  locale: string;
  timezone: string;
  races: RaceItem[];
  selectedRaceUrn: string | undefined;
  siblingMeetings: SiblingMeeting[];
  siblingMeetingData: SiblingMeetingData[];
  initialItems: InitialItemsData;
  isHighlighted: boolean;
};

function useAppContext() {
  const {
    loading,
    data: { appContext },
  } = useRaceMeetingViewAppContextQuery();

  const isHighlighted = useMemo(
    () => !!appContext?.brandSettings?.find((s) => s.name === "HIGHLIGHTED_HEADER")?.isActive,
    [appContext?.brandSettings],
  );

  const locale = appContext?.userdetails.localeCodeBcp47;
  const timezone = appContext?.userdetails.timezone;

  return { loading, locale, timezone, isHighlighted };
}

function useMeetingData(view: RaceMeetingViewResult | undefined): MeetingData | null {
  return useMemo(() => {
    if (!view) return null;
    return {
      urn: view.meeting.urn,
      name: view.meeting.name,
      venue: view.meeting.venue,
      country: view.meeting.country,
      date: view.meeting.date ?? null,
      countryFlag: view.meeting.countryFlag
        ? {
            vector: view.meeting.countryFlag.vector ?? null,
            small: view.meeting.countryFlag.small ?? null,
          }
        : null,
    };
  }, [view]);
}

function useRaces(view: RaceMeetingViewResult | undefined): RaceItem[] {
  return useMemo(() => {
    if (!view) return [];

    return (view.races ?? [])
      .filter((r): r is NonNullable<typeof r> => r !== null)
      .map((r) => {
        const primaryMarketNumberOfRunners =
          r.race.primaryMarket && "numberOfActiveRunners" in r.race.primaryMarket
            ? r.race.primaryMarket.numberOfActiveRunners
            : null;

        const horseKind = r.race.raceKind && "runners" in r.race.raceKind ? r.race.raceKind : null;
        let expertView: ExpertViewData | null = null;
        if (horseKind) {
          const runnerRatings = horseKind.runners
            .filter((runner) => runner.rating123)
            .sort((a, b) => (a.rating123 ?? 0) - (b.rating123 ?? 0))
            .map((runner) => ({
              name: runner.horse.name,
              stars: runner.ratingStars ?? 0,
            }));
          if (runnerRatings.length > 0) {
            expertView = {
              verdict: r.race.verdict ?? null,
              runnerRatings,
            };
          }
        }

        return {
          raceId: r.race.raceId,
          raceUrn: r.race.urn,
          isHorseRacing: !!horseKind,
          raceName: r.race.name,
          startTime: r.race.startTime,
          isRaceClosed: !!horseKind?.details?.resultType,
          resultType: horseKind?.details?.resultType ?? null,
          raceStatus: horseKind?.details?.status ?? null,
          raceStatusLabel: formatRaceStatus(horseKind?.details?.status),
          numberOfRunners: r.race.raceKind?.details?.numberOfRunners ?? primaryMarketNumberOfRunners ?? null,
          raceClass: horseKind?.details?.raceClass ?? null,
          going: horseKind?.details?.going ?? null,
          raceDetailsTitle: horseKind?.details?.title ?? null,
          isRaceRunningStatus: isRaceRunningStatus(horseKind?.details?.status),
          viewLink: {
            viewUrn: r.viewLink.viewUrn,
            viewUrl: r.viewLink.viewUrl,
          },
          promotion: r.promotion?.signposting ?? null,
          broadcasts: r.race.broadcasts
            ? {
                liveVideoUrl: r.race.broadcasts.liveVideoUrl ?? null,
                dataVizUrl: r.race.broadcasts.dataVizUrl ?? null,
              }
            : null,
          expertView,
          availableToSubscribe: r.race.availableToSubscribe ?? false,
        };
      });
  }, [view]);
}

function useSiblingMeetings(view: RaceMeetingViewResult | undefined) {
  return useMemo(() => {
    if (!view) return { siblingMeetings: [] as SiblingMeeting[], siblingMeetingData: [] as SiblingMeetingData[] };

    const filtered = (view.siblingRaceMeetingViews ?? []).filter((s): s is NonNullable<typeof s> => s !== null);

    const siblingMeetings: SiblingMeeting[] = filtered.map((s) => ({
      urn: s.urn,
      name: s.meeting.name,
      venue: s.meeting.venue,
      country: s.meeting.country,
      countryFlagUrl: s.meeting.countryFlag?.small ?? null,
      viewLink: {
        viewUrn: s.urn,
        viewUrl: s.url,
      },
    }));

    const siblingMeetingData: SiblingMeetingData[] = filtered.map((s) => ({
      meetingUrn: s.meeting.urn,
      venue: s.meeting.venue,
      countryFlag: s.meeting.countryFlag
        ? {
            vector: s.meeting.countryFlag.vector ?? null,
            small: s.meeting.countryFlag.small ?? null,
          }
        : null,
      viewLink: {
        viewUrn: s.urn,
        viewUrl: s.url,
      },
    }));

    return { siblingMeetings, siblingMeetingData };
  }, [view]);
}

export function useRaceMeetingViewVM(viewURN: string) {
  const { loading: appContextLoading, locale, timezone, isHighlighted } = useAppContext();

  const {
    loading,
    canRenderHeader,
    refresh,
    data: { view },
  } = useRaceMeetingViewQuery({ viewURN });

  const meeting = useMeetingData(view);
  const races = useRaces(view);
  const { siblingMeetings, siblingMeetingData } = useSiblingMeetings(view);

  const onRaceSelected = (_raceUrn: string, viewLink: ViewLink) => {
    emit("@@UI/RACE_MEETING_VIEW_RACE_SELECTED", { urn: viewURN, viewLink });
  };

  const events = {
    onMount,
    onRaceSelected,
    onSiblingSelected,
    onCardClicked,
    fetchBars,
  };

  const data = useMemo<RaceMeetingViewData | null>(() => {
    if (!view || !locale || !timezone || !meeting) return null;

    return {
      urn: view.urn,
      title: view.title ?? null,
      meeting,
      sportName: view.meeting.sport.name ?? null,
      locale,
      timezone,
      races,
      selectedRaceUrn: view.items.selectedRace.race.urn,
      siblingMeetings,
      siblingMeetingData,
      initialItems: view.items,
      isHighlighted,
    };
  }, [view, locale, timezone, meeting, races, siblingMeetings, siblingMeetingData, isHighlighted]);

  return {
    loading: loading || appContextLoading,
    canRenderHeader,
    refresh,
    vm: {
      data,
      events,
    },
  };
}
