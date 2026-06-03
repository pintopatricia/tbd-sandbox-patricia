import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { MapStateToPropsFactory } from "react-redux";
import { getSportsbookBettingReviewLines } from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { getBetslipCard } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { formatOdds } from "@ppb/tbd-store/helpers/formatters";
import { createUserPreferencesWithProductSwitcherSelector } from "@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors";
import { currencyFormatWithDecimalPlaces } from "../../../formatters/currency-formatters";
import { createPreviewSelectionsSelector, PreviewSelection } from "./preview-line-mapper";

type CardProps = {
  order: number;
  runners: PreviewSelection[];
  odd: string;
  payout: string;
};

export type StateProps = CardProps | Record<string, never>;

export type ContainerProps = {
  id: string;
  order: number;
  isLast?: boolean;
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getUserPreferencesWithProductSwitcher = createUserPreferencesWithProductSwitcherSelector();
  const getPreviewSelections = createPreviewSelectionsSelector();
  const getUserDetails = createGetCountryLocalCurrencyCodeSelector();

  return (state: ApplicationState, { id, order }: ContainerProps): StateProps => {
    const card = getBetslipCard(state);
    let userDetails: UserDetails;

    if (!card) {
      return {};
    }

    try {
      userDetails = <UserDetails>getUserDetails(state);
    } catch (e) {
      console.error(e);

      return {};
    }

    const { sportsbookOddsDisplay } = getUserPreferencesWithProductSwitcher(state.entities.preferences);
    const lines = getSportsbookBettingReviewLines(state);
    const { odds, potentialReturns } = lines[id];

    return {
      order: order + 1,
      runners: getPreviewSelections(state, id),
      odd: odds ? formatOdds(odds, sportsbookOddsDisplay) : "",
      payout: currencyFormatWithDecimalPlaces({
        ...userDetails,
        value: potentialReturns || 0,
        decimalPlaces: 2,
      }),
    };
  };
};
