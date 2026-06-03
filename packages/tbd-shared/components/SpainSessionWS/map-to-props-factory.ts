import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { Jurisdiction } from "@ppb/tbd-store/state/constants";
import { getCurrencySymbol } from "../../formatters/currency-formatters";

export type StateProps = {
  shouldOpenWebSocket?: boolean;
  currencySymbol?: string;
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> =
  () =>
  (state: ApplicationState): StateProps => {
    let userDetails: UserDetails;

    try {
      userDetails = <UserDetails>getUserDetails(state);
    } catch (e) {
      console.error(e);

      return {};
    }
    const isLoggedIn = userDetails.loggedIn ?? false;
    const isSpainJurisdiction = userDetails.jurisdiction.jurisdiction === Jurisdiction.SPAIN;

    return {
      shouldOpenWebSocket: isLoggedIn && isSpainJurisdiction,
      currencySymbol: getCurrencySymbol(userDetails),
    };
  };

export type DispatchProps = Record<string, never>;
export type ContainerProps = {};

export const mapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = () => ({});
