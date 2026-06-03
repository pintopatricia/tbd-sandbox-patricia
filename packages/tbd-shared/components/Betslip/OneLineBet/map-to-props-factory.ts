import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";
import { Dispatch } from "redux";

import { BetslipSportsbookRemoveLegClick, UI__BETSLIP_SBK_REMOVE_LEG_CLICK } from "@ppb/tbd-store/actions/betslip";
import { BettingSportsbookRemoveLegAction, BETTING__SBK_REMOVE_LEG_ACTION } from "@ppb/tbd-store/actions/betting";
import {
  getBetslipCard,
  getBetslipGroup,
  getSportsbookConfirmationCombinations,
  getSportsbookConfirmationLegs,
  getSportsbookConfirmationRunners,
} from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import {
  createSportsbookBettingRunnerSelector,
  getBettingResolvers,
  getSportsbookBettingCombinations,
  getSportsbookBettingLegs,
} from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { createIsBrandSettingEnabledSelector } from "@ppb/tbd-store/state/entities/brand-settings/brand-settings-selectors";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { Icons } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

import { BetslipSportsbookConfirmationBet } from "@ppb/tbd-store";
import { getSelectionTypeIcon } from "../../../helpers/selection-type";
import { buildSelection } from "../connected-sportsbook-betslip-mapper";
import { createIsConfirmStep } from "../sportsbook-betslip-confirm-mapper";

type Runner = {
  runnerURN: string;
  selectionId: number;
  name: string;
  resultType: string | null;
};

type CardProps = {
  runnerUrns: string[];
  id: string;
  isPlacing: boolean;
  selectionTypeIcon?: Icons;
  legId: string;
  runners: Runner[];
  subtitle: string;
};
export type StateProps = CardProps | Record<string, never>;

export type ContainerProps = {
  id: string;
  hasAvailabilityHints?: boolean;
  shouldFocusStakeField?: boolean;
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getSportsbookBettingRunner = createSportsbookBettingRunnerSelector();
  const getUserDetailsSelector = createGetCountryLocalCurrencyCodeSelector();
  const getIsConfirmStep = createIsConfirmStep();
  const isBrandSettingEnabled = createIsBrandSettingEnabledSelector();

  return (appState: ApplicationState, { id }: ContainerProps): StateProps => {
    try {
      const isConfirmStep = getIsConfirmStep(appState);
      const group = getBetslipGroup(appState);
      const resolvers = getBettingResolvers(group);
      let combinations: BetslipSportsbookConfirmationBet["combinations"];
      let legs: BetslipSportsbookConfirmationBet["legs"];
      let sportsbookRunners: BetslipSportsbookConfirmationBet["runners"];

      const metadataRunner: {
        name: string;
        subtitle: string;
        marketType: string;
        isSuperSub: boolean;
        runnerUrn: string;
        selectionId: number;
      }[] = [];

      if (isConfirmStep) {
        combinations = getSportsbookConfirmationCombinations(appState);
        legs = getSportsbookConfirmationLegs(appState);
        sportsbookRunners = getSportsbookConfirmationRunners(appState);
      } else {
        combinations = getSportsbookBettingCombinations(appState);
        legs = getSportsbookBettingLegs(appState);
        sportsbookRunners = appState.betting.sportsbookBetting.runners;
      }

      const bettingRunnersMetadata = resolvers.getMetadata(appState);
      const userDetails = <UserDetails>getUserDetailsSelector(appState);
      const combination = combinations[id];
      const legId = combination.legs[0];
      const runnerIds = legs[legId].runners;

      runnerIds.forEach((runnerId) => {
        const metadata = bettingRunnersMetadata[runnerId];
        if (metadata && Object.keys(metadata).length > 0) {
          const sportsbookBettingRunner = getSportsbookBettingRunner(sportsbookRunners, runnerId);
          const { name, subtitle } = buildSelection(metadata, userDetails);

          metadataRunner.push({
            name,
            subtitle,
            marketType: metadata.marketType,
            isSuperSub: metadata.isSuperSub ?? false,
            runnerUrn: metadata.runnerUrn,
            selectionId: sportsbookBettingRunner.selectionId,
          });
        }
      });

      const runners: Runner[] = [];
      const runnerUrns: string[] = [];
      metadataRunner.forEach((metadata) => {
        runnerUrns.push(metadata.runnerUrn);
        runners.push({
          runnerURN: metadata.runnerUrn,
          selectionId: metadata.selectionId,
          name: metadata.name,
          resultType: null,
        });
      });

      const card = getBetslipCard(appState);
      const { placeStatus } = card || {};
      const isPlacing = placeStatus === "INPROGRESS";

      if (!metadataRunner.length) {
        return {};
      }

      const { subtitle, marketType, isSuperSub } = metadataRunner[0];

      return {
        runnerUrns,
        id: combination.id,
        isPlacing,
        selectionTypeIcon: isBrandSettingEnabled(appState, "SHOW_SELECTION_TYPE_ICON")
          ? getSelectionTypeIcon(marketType, isSuperSub)
          : undefined,
        legId,
        runners,
        subtitle,
      };
    } catch (e) {
      console.error(e);

      return {};
    }
  };
};

export type DispatchActions = BetslipSportsbookRemoveLegClick | BettingSportsbookRemoveLegAction;

export type DispatchProps = {
  dispatchRemoveSelectionAction: ({ legId, runnerUrns }: { legId: string; runnerUrns: string[] }) => void;
};

export const mapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = (
  dispatch: Dispatch<DispatchActions>,
) => ({
  dispatchRemoveSelectionAction: ({ legId, runnerUrns }) => {
    runnerUrns?.forEach((runnerUrn) =>
      dispatch<BetslipSportsbookRemoveLegClick>({
        type: UI__BETSLIP_SBK_REMOVE_LEG_CLICK,
        payload: { legId, runnerUrn },
      }),
    );
    dispatch<BettingSportsbookRemoveLegAction>({
      type: BETTING__SBK_REMOVE_LEG_ACTION,
      payload: { legId },
    });
  },
});
