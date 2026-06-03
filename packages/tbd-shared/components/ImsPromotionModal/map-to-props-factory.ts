import { MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { PUSH, PushAction } from "@ppb/tbd-store/actions/router";
import { createFindViewByURNSelector } from "@ppb/tbd-store/state/layout/views/view-selectors";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { ImsPromotionView } from "@ppb/tbd-store/state/layout/views/View.types";

export type ContainerProps = { urn: ImsPromotionView };

export type ViewProps = {
  title: string;
  view: ImsPromotionView;
  returnViewLink: ViewLink;
};

export type StateProps = ViewProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getViewByURN = createFindViewByURNSelector();

  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    const view = getViewByURN(state.layouts.views, urn.toString()) || null;
    if (!view) {
      return {};
    }

    const queryParams = state.router.currentUrl?.split("?")[1];
    const params = new URLSearchParams(queryParams);

    const returnUrl = params.get("url");
    const returnUrn = params.get("urn");
    const returnViewLink =
      returnUrn && returnUrl
        ? {
            viewUrn: returnUrn,
            viewUrl: returnUrl,
          }
        : {
            viewUrn: "ppb:tbd:view:generic:home",
            viewUrl: "",
          };

    return {
      view: urn,
      title: view.viewHeader?.title || view.title || "",
      returnViewLink,
    };
  };
};

const dispatchGoBack = (viewLink: ViewLink): PushAction => ({
  type: PUSH,
  payload: viewLink,
});

export type DispatchProps = {
  dispatchGoBack: typeof dispatchGoBack;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchGoBack,
};
