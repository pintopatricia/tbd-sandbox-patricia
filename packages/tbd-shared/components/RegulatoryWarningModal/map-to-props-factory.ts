import type { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";

import type { ApplicationState, UserDetails } from "@ppb/tbd-store/state";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";

import { i18n } from "../../helpers/i18n";

const WHITELISTED_JURISDICTIONS = new Set(["SPAIN"]);
// TODO: in the next iteration, create a SAFER_GAMBLING external link
const SPAIN_SAFER_GAMBLING_LINK = "www.juegoseguro.es";

export type ContainerProps = {};

export type StateProps = {
  labels: {
    modalTitle: string;
    modalContentHeaderTitle: string;
    warningMessageTitle: string;
    warningMessageText?: string;
  };
  warningMessageLink?: string;
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getUserDetailsSelector = createGetCountryLocalCurrencyCodeSelector();

  const baseVm = {
    labels: {
      modalTitle: i18n({ key: "I18N.REGULATORY_WARNING_MODAL.TITLE" }),
      modalContentHeaderTitle: i18n({ key: "I18N.REGULATORY_WARNING_MODAL.HEADER_TITLE" }),
      warningMessageTitle: i18n({ key: "I18N.REGULATORY_WARNING_MODAL.WARNING_TITLE" }),
    },
  };

  return (state: ApplicationState): StateProps => {
    let userDetails;

    try {
      userDetails = <UserDetails>getUserDetailsSelector(state);
    } catch (e) {
      console.error(e);
      return baseVm;
    }

    const jurisdiction = userDetails.jurisdiction?.jurisdiction;

    if (!jurisdiction || !WHITELISTED_JURISDICTIONS.has(jurisdiction)) {
      return baseVm;
    }

    return {
      labels: {
        ...baseVm.labels,
        warningMessageText: i18n({
          key: "I18N.REGULATORY_WARNING_MODAL.WARNING_TEXT",
          interpolationValues: {
            link: SPAIN_SAFER_GAMBLING_LINK,
          },
        }),
      },
      warningMessageLink: `https://${SPAIN_SAFER_GAMBLING_LINK}/`,
    };
  };
};

export type DispatchProps = {};

export const mapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = {};
