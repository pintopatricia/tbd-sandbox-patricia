import { MapStateToPropsFactory } from "react-redux";
import URN from "@ppb/tbd-store/state/layout/URN";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";
import { createViewByURNSelector } from "@ppb/tbd-store/state/layout/views/view-selectors";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { PushAction, PUSH } from "@ppb/tbd-store/actions/router";
import {
  UI__NAVIGATE_FROM_NOT_FOUND_VIEW,
  NavigateFromNotFoundViewAction,
  UI__NOT_FOUND_VIEW_LOADED,
  NotFoundViewLoadedAction,
} from "@ppb/tbd-store/actions/navigation";
import { NotFoundViews } from "@ppb/tbd-store/state/layout/views/View.types";
import { i18n } from "../../helpers/i18n";

export type ContainerProps = { urn: string };

type HighlightedMessage = {
  title: string;
  message: string;
};

enum Icon {
  HOME = "HOME",
  MY_BETS = "MY_BETS",
  IN_PLAY = "IN_PLAY",
}

type QuickLink = {
  label: string;
  viewLink: ViewLink;
  icon: Icon;
};

export type StateProps = {
  messages: HighlightedMessage;
  links: QuickLink[];
  items?: PartialItem[];
  hasErrorViewImage: boolean;
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getNotFoundViewByURN = createViewByURNSelector<NotFoundViews, URN>();

  const messages = {
    title: i18n({ key: "I18N.REDIRECT404.TITLE" }),
    message: i18n({ key: "I18N.REDIRECT404.SUBTITLE" }),
  };

  return (state: ApplicationState, ownProps: ContainerProps): StateProps => {
    const view = getNotFoundViewByURN(state.layouts.views.notfound, ownProps.urn);
    const hasErrorViewImage = !!state.entities.brandSettings?.ERROR_VIEW_IMAGE;

    return {
      messages,
      links: [
        {
          label: i18n({ key: "I18N.NAVIGATION_BAR.HOME" }),
          viewLink: {
            viewUrl: "",
            viewUrn: "ppb:tbd:view:generic:home",
          },
          icon: Icon.HOME,
        },
        {
          label: i18n({ key: "I18N.NAVIGATION_BAR.MY_BETS" }),
          viewLink: { viewUrl: "mybets/myBets-open", viewUrn: "ppb:tbd:view:myBets:open" },
          icon: Icon.MY_BETS,
        },
        {
          label: i18n({ key: "I18N.SPORT_EVENT.IN_PLAY" }),
          viewLink: {
            viewUrl: "view/d-inplay",
            viewUrn: "ppb:tbd:view:generic:inplay",
          },
          icon: Icon.IN_PLAY,
        },
      ],
      items: view?.items,
      hasErrorViewImage,
    };
  };
};

const dispatchRouterPushAction = (viewLink: ViewLink): PushAction => ({
  type: PUSH,
  payload: viewLink,
});

const dispatchNavigationNotFoundViewLoaded = (): NotFoundViewLoadedAction => ({
  type: UI__NOT_FOUND_VIEW_LOADED,
});

const dispatchNavigationFromNotFoundView = (label: string, destinationUrl: string): NavigateFromNotFoundViewAction => ({
  type: UI__NAVIGATE_FROM_NOT_FOUND_VIEW,
  payload: {
    label,
    destinationUrl,
  },
});

export type DispatchProps = {
  dispatchNavigationNotFoundViewLoaded: typeof dispatchNavigationNotFoundViewLoaded;
  dispatchNavigationFromNotFoundView: typeof dispatchNavigationFromNotFoundView;
  dispatchRouterPushAction: typeof dispatchRouterPushAction;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchNavigationNotFoundViewLoaded,
  dispatchNavigationFromNotFoundView,
  dispatchRouterPushAction,
};
