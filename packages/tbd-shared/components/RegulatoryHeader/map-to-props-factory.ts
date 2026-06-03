import { MapStateToPropsFactory } from "react-redux";

import { ApplicationState, UserDetails } from "@ppb/tbd-store";
import { Jurisdiction } from "@ppb/tbd-store/state/constants";
import { Section } from "@ppb/tbd-store/state/layout/cards/regulatory-sections/RegulatorySections.types";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { createGetRegulatoryDataSectionsSelector } from "@ppb/tbd-store/state/entities/regulatory-data/regulatory-data-selectors";

export type StateProps = {
  regulatorySections?: Section[];
  isDenmarkJurisdiction?: boolean;
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, {}, ApplicationState> = () => {
  const getRegulatorySections = createGetRegulatoryDataSectionsSelector();
  const getUserDetailsSelector = createGetCountryLocalCurrencyCodeSelector();

  return function mapStateToProps(state: ApplicationState): StateProps {
    let userDetails;

    try {
      userDetails = <UserDetails>getUserDetailsSelector(state);
    } catch (e) {
      console.error(e);
      return {};
    }

    const { loggedIn, jurisdiction } = userDetails;
    const regulatorySections = getRegulatorySections(state.entities.regulatoryData, loggedIn);

    return {
      regulatorySections,
      isDenmarkJurisdiction: jurisdiction?.jurisdiction === Jurisdiction.DENMARK,
    };
  };
};
