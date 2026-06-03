import { MapStateToPropsFactory } from "react-redux";
import URN from "@ppb/tbd-store/state/layout/URN";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { TimeFormBroadCastsCards } from "@ppb/tbd-store/state/layout/cards/Card.types";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { UPDATE_TIME_FORM_COLLAPSE, UpdateTimeFormCollapse } from "@ppb/tbd-store/actions/preferences";
import { ToggleTimeformCard, UI__TOGGLE_TIMEFORM_CARD } from "@ppb/tbd-store/actions/interface";
import {
  TimeFormBroadCastsCardToggleAction,
  TimeFormBroadCastsCardMediaPlayerAction,
  UI__TIME_FORM_BROADCASTS_CARD_TOGGLE,
  UI__TIME_FORM_BROADCASTS_CARD_MEDIA_PLAYER_EVENT,
} from "@ppb/tbd-store/actions/media";
import { createRaceWithRunnersByURNSelector } from "@ppb/tbd-store/state/entities/entities-selectors";
import { createSelector } from "reselect";
import { createTimeFormCollapsePreferenceSelector } from "@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors";
import { RaceRunner, RaceRunners } from "@ppb/tbd-store/state/entities/races/Race.types";
import { i18n } from "../../helpers/i18n";
import { TimeformCardProps, TimeformCardRunnerRatings } from "./snowflakes/TimeformCard/TimeformCard.types";

export type ContainerProps = { urn: string };
export type CardProps = TimeformCardProps & {
  dataVizUrl: string | null;
  liveVideoUrl: string | null;
  statusTitle: string;
  timeFormTitle: string;
  raceUrn?: URN;
  cardUrn: URN;
};
export type StateProps = CardProps | Record<string, never>;

export const createRunnerRatingsForViewModel = () =>
  createSelector(
    [(raceRunners: RaceRunners) => raceRunners],
    (raceRunners?: RaceRunners): TimeformCardRunnerRatings | undefined => {
      if (!raceRunners) return undefined;

      return Object.values(raceRunners)
        .sort(({ rating123: prevRating123 = 0 }, { rating123: currRating123 = 0 }) => prevRating123 - currRating123)
        .reduce(
          (acc: TimeformCardRunnerRatings, runner: RaceRunner) => [
            ...acc,
            ...(runner.rating123 ? [{ name: runner.horse.name, stars: runner.ratingStars || 0 }] : []),
          ],
          [],
        );
    },
  );

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getTimeFormBroadCastsCardByURN = createCardByURNSelector<TimeFormBroadCastsCards, URN>();
  const getRaceWithRunnersByURN = createRaceWithRunnersByURNSelector();
  const getRunnerRatingsForViewModel = createRunnerRatingsForViewModel();
  const getTimeFormCollapseState = createTimeFormCollapsePreferenceSelector();

  return (state: ApplicationState, { urn }: ContainerProps): StateProps => {
    const card = getTimeFormBroadCastsCardByURN(state.layouts.cards.timeformbroadcasts, urn);
    if (!card) return {};

    const { race: raceUrn, broadcasts, urn: cardUrn } = card;
    const liveVideoTitle = i18n({ key: "I18N.LIVE_VIDEO_STATUS.LIVE_VIDEO" });
    const dataVizTitle = i18n({ key: "I18N.LIVE_VIDEO_STATUS.MATCH_VIEW" });
    const timeFormTitle = i18n({ key: "I18N.RACE.TIMEFORM_TITLE" });
    const hydratedRace = raceUrn ? getRaceWithRunnersByURN(state.entities, raceUrn) : null;
    const runnerRatings = (hydratedRace?.raceRunners && getRunnerRatingsForViewModel(hydratedRace.raceRunners)) || [];
    const statusTitle = broadcasts?.liveVideoUrl ? liveVideoTitle : dataVizTitle;

    return {
      statusTitle,
      timeFormTitle,
      runnerRatings,
      raceUrn,
      cardUrn,
      dataVizUrl: broadcasts?.dataVizUrl ?? null,
      liveVideoUrl: broadcasts?.liveVideoUrl ?? null,
      verdict: hydratedRace?.race.verdict,
      verdictLabel: hydratedRace?.race.verdict && i18n({ key: "I18N.RACE.TIMEFORM_VIEW" }),
      collapsed: getTimeFormCollapseState(state.entities.preferences),
    };
  };
};

const dispatchUpdateTimeFormCollapsePreference = (isExpanded: boolean): UpdateTimeFormCollapse => ({
  type: UPDATE_TIME_FORM_COLLAPSE,
  payload: {
    isCollapsed: !isExpanded,
  },
});

const dispatchToggleTimeForm = (isExpanded: boolean, raceUrn: URN): ToggleTimeformCard => ({
  type: UI__TOGGLE_TIMEFORM_CARD,
  payload: {
    isExpanded,
    raceUrn,
  },
});

const dispatchTimeFormBroadCastsCardToggle = (
  isExpanded: boolean,
  cardUrn: URN,
  raceUrn: URN,
): TimeFormBroadCastsCardToggleAction => ({
  type: UI__TIME_FORM_BROADCASTS_CARD_TOGGLE,
  payload: { isExpanded, cardUrn, raceUrn },
});

const dispatchMediaPlayerLoaded = (label: string, raceUrn: URN): TimeFormBroadCastsCardMediaPlayerAction => ({
  type: UI__TIME_FORM_BROADCASTS_CARD_MEDIA_PLAYER_EVENT,
  payload: { label, raceUrn },
});

export type DispatchProps = {
  dispatchUpdateTimeFormCollapsePreference: typeof dispatchUpdateTimeFormCollapsePreference;
  dispatchToggleTimeForm: typeof dispatchToggleTimeForm;
  dispatchTimeFormBroadCastsCardToggle: typeof dispatchTimeFormBroadCastsCardToggle;
  dispatchMediaPlayerLoaded: typeof dispatchMediaPlayerLoaded;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchUpdateTimeFormCollapsePreference,
  dispatchToggleTimeForm,
  dispatchTimeFormBroadCastsCardToggle,
  dispatchMediaPlayerLoaded,
};
