import { MapStateToPropsFactory, MapDispatchToProps } from "react-redux";
import { EntityType } from "@ppb/tbd-urn-codecs";

import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { getCanUsePhoenixExchange } from "@ppb/tbd-store/state/boot/boot-selectors";

import { i18n } from "../../helpers/i18n";

export type I18nLabels = {
  bottomSheetTitle: string;
  bottomSheetDescription: string;
  bottomSheetDismissButton: string;
};

export type CardProps = {
  i18nLabels: I18nLabels;
  canShowExchangeOnboarding: boolean;
};

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, {}, ApplicationState> = () => {
  const i18nLabels = {
    bottomSheetTitle: i18n({ key: "I18N.WELCOME.EXC.BOTTOMSHEET.TITLE" }),
    bottomSheetDescription: i18n({ key: "I18N.WELCOME.EXC.BOTTOMSHEET.DESCRIPTION" }),
    bottomSheetDismissButton: i18n({ key: "I18N.WELCOME.EXC.BOTTOMSHEET.CTA" }),
  };

  return (state: ApplicationState) => {
    const canUsePhoenixExchange = getCanUsePhoenixExchange(state);
    const { loggedIn } = <UserDetails>getUserDetails(state);

    const { currentView } = state.router;
    const isGamingView = currentView?.includes(EntityType.GameView) || currentView?.includes(EntityType.GamingView);

    const canShowExchangeOnboarding = loggedIn && canUsePhoenixExchange && !isGamingView;

    return {
      i18nLabels,
      canShowExchangeOnboarding,
    };
  };
};

export type DispatchProps = {};

export const makeMapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = () => ({});
