import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { MapStateToPropsFactory } from "react-redux";
import { URN } from "@ppb/the-wall-common/types";
import { createViewByURNSelector } from "@ppb/tbd-store/state/layout/views/view-selectors";
import { GameViews, GamingCategoryViews } from "@ppb/tbd-store/state/layout/views/View.types";
import { codecs } from "@ppb/tbd-urn-codecs";
import { GamingBackButtonClickAction, UI__GAMING_BACK_BUTTON_CLICK } from "@ppb/tbd-store/actions/navigation";

export type StateProps = {
  title: string;
  returnToHomepage: boolean;
};

export type ContainerProps = {
  urn: URN;
  iosTitle?: string;
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getViewInfoByURN = createViewByURNSelector<GameViews | GamingCategoryViews, URN>();

  return function mapStateToProps(state: ApplicationState, { urn, iosTitle = "" }: ContainerProps): StateProps {
    const { showBackButton } = state.router;
    const parsedUrn = codecs.parse(urn);

    let view;
    if (parsedUrn) {
      if (codecs.gameView.isValid(parsedUrn)) {
        view = getViewInfoByURN(state.layouts.views.game, urn);
      } else if (codecs.gamingCategoryView.isValid(parsedUrn)) {
        view = getViewInfoByURN(state.layouts.views.gamingcategory, urn);
      }
    }

    return {
      title: view?.navigationItem?.title ?? iosTitle ?? "",
      returnToHomepage: !showBackButton,
    };
  };
};

const dispatchGamingBackButtonClickAction = (): GamingBackButtonClickAction => ({
  type: UI__GAMING_BACK_BUTTON_CLICK,
});

export type DispatchProps = {
  dispatchGamingBackButtonClickAction: typeof dispatchGamingBackButtonClickAction;
};

export const makeMapDispatchToProps: DispatchProps = {
  dispatchGamingBackButtonClickAction,
};
