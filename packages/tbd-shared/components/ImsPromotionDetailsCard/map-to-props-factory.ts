import { MapStateToPropsFactory } from "react-redux";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import URN from "@ppb/tbd-store/state/layout/URN";
import { ImsPromotionDetailsCards } from "@ppb/tbd-store/state/layout/cards/Card.types";
import { RichText } from "@ppb/tbd-store/state/entities/Gaming.types";
import { i18n } from "../../helpers/i18n";

export type ContainerProps = {
  urn: URN;
};

export type CardProps = {
  title: string;
  details: RichText[];
};

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getImsPromotionDetailsCardByURN = createCardByURNSelector<ImsPromotionDetailsCards, URN>();

  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    const card = getImsPromotionDetailsCardByURN(state.layouts.cards.imspromotiondetails, urn);

    if (!card || card.details.length === 0) {
      return {};
    }

    return {
      title: i18n({ key: "I18N.PROMO.DETAILS" }),
      details: card.details,
    };
  };
};
