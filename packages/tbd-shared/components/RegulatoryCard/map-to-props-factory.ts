import { FooterLinkClickAction, UI__FOOTER_LINK_CLICK } from "@ppb/tbd-store/actions/navigation";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { RegulatoryCards } from "@ppb/tbd-store/state/layout/cards/Card.types";
import { Section } from "@ppb/tbd-store/state/layout/cards/regulatory-sections/RegulatorySections.types";
import URN from "@ppb/tbd-store/state/layout/URN";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { MapStateToPropsFactory } from "react-redux";
import { getMyBetsExchangeBottomSheet } from "@ppb/tbd-store/state/my-bets/my-bets-selectors";
import { i18n } from "../../helpers/i18n";

export type CardProps = {
  sections: Section[];
  labels: {
    nationalIdentifierLabel: string;
    contractNumberLabel: string;
  };
  usePortal?: boolean;
};
export type StateProps = CardProps | Record<string, never>;

export type ContainerProps = { urn: URN };

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getCardByUrn = createCardByURNSelector<RegulatoryCards, URN>();
  const labels = {
    nationalIdentifierLabel: i18n({ key: "I18N.USER.NATIONAL_IDENTIFIER" }),
    contractNumberLabel: i18n({ key: "I18N.USER.CONTRACT_NUMBER" }),
  };

  return (state: ApplicationState, { urn }: ContainerProps): StateProps => {
    const card = getCardByUrn(state.layouts.cards.regulatory, urn);

    if (!card) return {};

    const { isOpen: isBottomSheetOpened = false } = getMyBetsExchangeBottomSheet(state) || {};

    return {
      sections: card.sections,
      labels,
      usePortal: !isBottomSheetOpened,
    };
  };
};

const dispatchFooterLinkNavigation = (
  viewLink?: Omit<ViewLink, "viewUrn"> & { viewUrn?: URN },
  text?: string,
): FooterLinkClickAction => ({
  type: UI__FOOTER_LINK_CLICK,
  payload: {
    module: "footer",
    text,
    url: viewLink?.viewUrl,
  },
});

export type DispatchProps = {
  dispatchFooterLinkNavigation: typeof dispatchFooterLinkNavigation;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchFooterLinkNavigation,
};
