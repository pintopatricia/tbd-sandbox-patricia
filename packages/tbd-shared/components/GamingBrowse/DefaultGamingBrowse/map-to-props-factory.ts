import { ExternalPushAction, EXTERNAL_PUSH, PUSH, PushAction } from "@ppb/tbd-store/actions/router";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import URN from "@ppb/tbd-store/state/layout/URN";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { LinkItem } from "@ppb/tbd-store/state/layout/views/browse-view/BrowseInterface.types";
import { Dispatch } from "react";
import { MapDispatchToPropsFactory, MapStateToPropsFactory } from "react-redux";
import { i18n } from "../../../helpers/i18n";
import { getCategoryLinks } from "./category-links";

export type StateProps = {
  typename: string | undefined;
  defaultGamingi18n: DefaultGamingi18n;
  categoryLinks: LinkItem[];
};

export type ContainerProps = { urn: URN; typename: string };

export type DefaultGamingi18n = {
  i18n: {
    title: string;
    subtitle: string;
  };
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const defaultGamingi18n = {
    i18n: {
      title: i18n({ key: "I18N.CATEGORY.CASINO_ESSENTIALS" }),
      subtitle: i18n({ key: "I18N.CATEGORY.MORE_CASINO_GAMES" }),
    },
  };

  return (state: ApplicationState, { typename }: ContainerProps): StateProps => {
    const {
      jurisdiction: { jurisdiction },
      localeCode,
      loggedIn,
    } = <UserDetails>getUserDetails(state);
    const categoryLinks = getCategoryLinks(jurisdiction, localeCode, loggedIn);

    return {
      typename,
      defaultGamingi18n,
      categoryLinks,
    };
  };
};

export type DispatchProps = {
  dispatchRouterPushAction: (viewLink: ViewLink) => void;
  dispatchExternalRouterPushAction: (viewLink: ViewLink) => void;
};

export const makeMapDispatchToProps: MapDispatchToPropsFactory<DispatchProps, {}> = () =>
  function mapDispatchToProps(dispatch: Dispatch<PushAction | ExternalPushAction>): DispatchProps {
    return {
      dispatchRouterPushAction: (viewLink) => {
        dispatch({
          type: PUSH,
          payload: viewLink,
        });
      },
      dispatchExternalRouterPushAction: (viewLink) => {
        dispatch({
          type: EXTERNAL_PUSH,
          payload: viewLink,
        });
      },
    };
  };
