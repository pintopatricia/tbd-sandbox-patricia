import { MapStateToPropsFactory } from "react-redux";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import URN from "@ppb/tbd-store/state/layout/URN";
import { ImsPromotionTermsAndConditionsCards } from "@ppb/tbd-store/state/layout/cards/Card.types";
import { RichText } from "@ppb/tbd-store/state/entities/Gaming.types";
import { i18n } from "../../helpers/i18n";

export type ContainerProps = {
  urn: URN;
};

export type CardProps = {
  title: string;
  termsAndConditions: RichText[];
};

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getImsPromotionTermsAndConditionsCardByURN = createCardByURNSelector<
    ImsPromotionTermsAndConditionsCards,
    URN
  >();

  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    const card = getImsPromotionTermsAndConditionsCardByURN(state.layouts.cards.imspromotiontermsandconditions, urn);

    if (!card || card.termsAndConditions.length === 0) {
      return {};
    }

    return {
      title: i18n({ key: "I18N.PROMO.TERMS_CONDITIONS" }),
      termsAndConditions: card.termsAndConditions,
    };
  };
};
