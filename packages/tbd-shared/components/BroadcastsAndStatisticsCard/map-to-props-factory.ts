import { MapStateToPropsFactory } from "react-redux";
import URN from "@ppb/tbd-store/state/layout/URN";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { BroadcastsAndStatisticsCards } from "@ppb/tbd-store/state/layout/cards/Card.types";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import {
  BroadcastsAndStatisticsCardMediaPlayerLoadedAction,
  BroadcastsAndStatisticsCardToggleAction,
  UI__BROADCASTS_AND_STATISTICS_CARD_TOGGLE,
  UI__BROADCASTS_AND_STATISTICS_MEDIA_PLAYER_LOADED,
} from "@ppb/tbd-store/actions/media";
import { ViewLink } from "@ppb/the-wall-common/types";
import { createFindViewByURNSelector } from "@ppb/tbd-store/state/layout/views/view-selectors";
import { DELETE_VIEW, DeleteViewAction, FETCH_CATALOGUE, FetchCatalogueAction } from "@ppb/tbd-store/actions/catalogue";
import { StatisticsModalToggleAction, UI__STATISTICS_MODAL_TOGGLE } from "@ppb/tbd-store/actions/interface";
import { i18n } from "../../helpers/i18n";

export type ContainerProps = {
  urn: URN;
};

export type CardProps = {
  urn: URN;
  dataVizUrl: string | null;
  liveVideoUrl: string | null;
  statusTitle: string;
  broadcastsIsCollapsedByDefault?: boolean;
  statisticsViewLink?: ViewLink;
  statisticsButtonLabel: string;
  statisticsViewTitle?: string;
};

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getBroadcastsAndStatisticsCard = createCardByURNSelector<BroadcastsAndStatisticsCards, URN>();
  const getViewByURN = createFindViewByURNSelector();

  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    const BroadcastsAndStatisticsCard = getBroadcastsAndStatisticsCard(
      state.layouts.cards.broadcastsandstatistics,
      urn,
    );

    if (!BroadcastsAndStatisticsCard) {
      return {};
    }

    const liveVideoTitle = i18n({ key: "I18N.LIVE_VIDEO_STATUS.LIVE_VIDEO" });
    const dataVizTitle = i18n({ key: "I18N.LIVE_VIDEO_STATUS.MATCH_VIEW" });
    const statisticsButtonLabel = i18n({ key: "I18N.STATISTICS" });
    const { broadcasts, isCollapsed, statisticsViewLink } = BroadcastsAndStatisticsCard;
    const statusTitle = broadcasts?.liveVideoUrl ? liveVideoTitle : dataVizTitle;
    const statisticsViewTitle =
      statisticsViewLink && getViewByURN(state.layouts.views, statisticsViewLink.viewUrn)?.title;

    const broadcastsProps = {
      dataVizUrl: broadcasts?.dataVizUrl ?? null,
      liveVideoUrl: broadcasts?.liveVideoUrl ?? null,
      statusTitle,
      broadcastsIsCollapsedByDefault: isCollapsed,
    };

    return {
      urn,
      ...broadcastsProps,
      statisticsViewLink,
      statisticsButtonLabel,
      statisticsViewTitle,
    };
  };
};

const dispatchBroadcastsCardToggle = (isExpanded: boolean, cardUrn: URN): BroadcastsAndStatisticsCardToggleAction => ({
  type: UI__BROADCASTS_AND_STATISTICS_CARD_TOGGLE,
  payload: { isExpanded, cardUrn },
});

const dispatchMediaPlayerLoaded = (
  label: string,
  cardUrn: URN,
): BroadcastsAndStatisticsCardMediaPlayerLoadedAction => ({
  type: UI__BROADCASTS_AND_STATISTICS_MEDIA_PLAYER_LOADED,
  payload: { label, cardUrn },
});

const dispatchToggleStatisticsView = (label: string, cardUrn: URN, isOpen: boolean): StatisticsModalToggleAction => ({
  type: UI__STATISTICS_MODAL_TOGGLE,
  payload: { cardUrn, label, isOpen },
});

const dispatchFetchCatalogue = (urn: string): FetchCatalogueAction => ({
  type: FETCH_CATALOGUE,
  payload: {
    urn,
  },
});

const dispatchDeleteView = (urn: string): DeleteViewAction => ({
  type: DELETE_VIEW,
  payload: urn,
});

export type DispatchProps = {
  dispatchBroadcastsCardToggle: typeof dispatchBroadcastsCardToggle;
  dispatchMediaPlayerLoaded: typeof dispatchMediaPlayerLoaded;
  dispatchFetchCatalogue: typeof dispatchFetchCatalogue;
  dispatchToggleStatisticsView: typeof dispatchToggleStatisticsView;
  dispatchDeleteView: typeof dispatchDeleteView;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchBroadcastsCardToggle,
  dispatchMediaPlayerLoaded,
  dispatchFetchCatalogue,
  dispatchToggleStatisticsView,
  dispatchDeleteView,
};
