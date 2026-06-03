import { MapStateToPropsFactory } from "react-redux";
import URN from "@ppb/tbd-store/state/layout/URN";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { BroadcastsCards } from "@ppb/tbd-store/state/layout/cards/Card.types";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import {
  BroadcastsCardToggleAction,
  MediaPlayerLoadedAction,
  UI__MEDIA_PLAYER_LOADED,
  UI__BROADCASTS_CARD_TOGGLE,
} from "@ppb/tbd-store/actions/media";
import { codecs } from "@ppb/tbd-urn-codecs";
import { LiveStreamAspectRatio } from "@ppb/the-wall-common/types";
import { i18n } from "../../helpers/i18n";

export type ContainerProps = {
  urn: URN;
};

export type CardProps = {
  dataVizUrl: string | null;
  liveVideoUrl: string | null;
  statusTitle: string;
  isCollapsed: boolean;
  aspectRatio?: LiveStreamAspectRatio;
  urn: URN;
};

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getBroadcastsCard = createCardByURNSelector<BroadcastsCards, URN>();

  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    const broadcastsCard = getBroadcastsCard(state.layouts.cards.broadcasts, urn);
    if (!broadcastsCard) {
      return {};
    }

    const liveVideoTitle = i18n({ key: "I18N.LIVE_VIDEO_STATUS.LIVE_VIDEO" });
    const dataVizTitle = i18n({ key: "I18N.LIVE_VIDEO_STATUS.MATCH_VIEW" });
    const {
      broadcasts: { dataVizUrl, liveVideoUrl },
      isCollapsed,
    } = broadcastsCard;
    const statusTitle = liveVideoUrl ? liveVideoTitle : dataVizTitle;

    const cardUrn = codecs.parse(broadcastsCard.urn);

    return {
      dataVizUrl,
      liveVideoUrl,
      statusTitle,
      isCollapsed,
      aspectRatio: (cardUrn && codecs.card.raceBroadcasts.isValid(cardUrn) && LiveStreamAspectRatio.RACE) || undefined,
      urn: broadcastsCard.urn,
    };
  };
};

const dispatchBroadcastsCardToggle = (isExpanded: boolean, cardUrn: URN): BroadcastsCardToggleAction => ({
  type: UI__BROADCASTS_CARD_TOGGLE,
  payload: { isExpanded, cardUrn },
});

const dispatchMediaPlayerLoaded = (label: string, cardUrn: URN): MediaPlayerLoadedAction => ({
  type: UI__MEDIA_PLAYER_LOADED,
  payload: { label, cardUrn },
});

export type DispatchProps = {
  dispatchBroadcastsCardToggle: typeof dispatchBroadcastsCardToggle;
  dispatchMediaPlayerLoaded: typeof dispatchMediaPlayerLoaded;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchBroadcastsCardToggle,
  dispatchMediaPlayerLoaded,
};
