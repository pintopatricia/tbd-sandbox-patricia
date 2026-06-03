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
import { createGetThrottleSelector } from "@ppb/tbd-store/state/entities/throttles/throttles-selectors";
import { FallbackIconType } from "@ppb/the-wall-common/types";
import { Icons } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import type { Region } from "@ppb/the-wall-icons/traps";

import { RacingSport } from "@ppb/tbd-store";
import { getSelectionTypeIcon } from "../../../helpers/selection-type";
import { i18n } from "../../../helpers/i18n";
import { getBoostedInfo, BoostedMarketTypeMap } from "../../../helpers/boosted-info";
import { buildSelection } from "../connected-sportsbook-betslip-mapper";
import { createIsConfirmStep } from "../sportsbook-betslip-confirm-mapper";

type CardProps = {
  runnerUrn: string;
  id: string;
  isPlacing: boolean;
  is90Min: boolean;
  selectionTypeIcon?: Icons;
  legId: string;
  title: string;
  subtitle: string;
  handicap?: string;
  icon?: string;
  silkFallbackIconType?: FallbackIconType;
  racingSport?: RacingSport;
  meetingCountry?: Region;
  trap?: string | number;
  isPriceBoosted?: boolean;
  boostedInfo?: BoostedMarketTypeMap;
  hasBoostSignposting: boolean;
  guaranteedPriceLabel: string;
  isGuaranteedPriceSelected: boolean;
};
export type StateProps = CardProps | Record<string, never>;

export type ContainerProps = {
  id: string;
  hasAvailabilityHints?: boolean;
  shouldFocusStakeField?: boolean;
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const guaranteedPriceLabel = i18n({ key: "I18N.LABELS.BEST_ODDS_GUARANTEED_REDUCED" });
  const getSportsbookBettingRunner = createSportsbookBettingRunnerSelector();
  const getUserDetailsSelector = createGetCountryLocalCurrencyCodeSelector();
  const getIsConfirmStep = createIsConfirmStep();
  const getThrottle = createGetThrottleSelector();
  const isBrandSettingEnabled = createIsBrandSettingEnabledSelector();

  return (appState: ApplicationState, { id }: ContainerProps): StateProps => {
    try {
      const isConfirmStep = getIsConfirmStep(appState);
      const group = getBetslipGroup(appState);
      const resolvers = getBettingResolvers(group);
      const pbsThrottle = getThrottle(appState.entities.throttles, "PRICE_BOOST_SINGLES_SIGNPOSTING");
      let combinations;
      let legs;
      let runner;

      if (isConfirmStep) {
        combinations = getSportsbookConfirmationCombinations(appState);
        legs = getSportsbookConfirmationLegs(appState);
        runner = getSportsbookConfirmationRunners(appState);
      } else {
        combinations = getSportsbookBettingCombinations(appState);
        legs = getSportsbookBettingLegs(appState);
        runner = appState.betting.sportsbookBetting.runners;
      }

      const bettingRunnersMetadata = resolvers.getMetadata(appState);
      const userDetails = <UserDetails>getUserDetailsSelector(appState);
      const combination = combinations[id];
      const legId = combination.legs[0];
      const runnerId = legs[legId].runners[0];
      const metadata = bettingRunnersMetadata[runnerId];
      const bettingRunner = getSportsbookBettingRunner(runner, runnerId);
      const trapIconThrottle = getThrottle(appState.entities.throttles, "SHOW_TRAP_ICON");

      if (!metadata) {
        return {};
      }

      const { name, handicap, subtitle, icon, silkFallbackType, racingSport, meetingCountry, trap } = buildSelection(
        metadata,
        userDetails,
        bettingRunner,
      );
      const { isGuaranteedPriceSelected } = combination;
      const card = getBetslipCard(appState);
      const { placeStatus } = card || {};
      const isPlacing = placeStatus === "INPROGRESS";
      const isPriceBoosted = metadata.isOddsboostMarketType;

      return {
        runnerUrn: metadata.runnerUrn,
        id: combination.id,
        isPlacing,
        is90Min: metadata.is90Min,
        selectionTypeIcon: isBrandSettingEnabled(appState, "SHOW_SELECTION_TYPE_ICON")
          ? getSelectionTypeIcon(metadata.marketType, metadata.isSuperSub)
          : undefined,
        legId,
        isPriceBoosted,
        boostedInfo: isPriceBoosted ? getBoostedInfo(metadata.marketType) : undefined,
        hasBoostSignposting: !!pbsThrottle?.isActive,
        title: name,
        subtitle,
        handicap,
        icon,
        racingSport,
        meetingCountry,
        trap: trapIconThrottle?.isActive ? trap : undefined,
        silkFallbackIconType: silkFallbackType,
        guaranteedPriceLabel,
        isGuaranteedPriceSelected,
      };
    } catch (e) {
      console.error(e);

      return {};
    }
  };
};

export type DispatchActions = BetslipSportsbookRemoveLegClick | BettingSportsbookRemoveLegAction;

export type DispatchProps = {
  dispatchRemoveSelectionAction: ({ legId, runnerUrn }: { legId: string; runnerUrn: string }) => void;
};

export const mapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = (
  dispatch: Dispatch<DispatchActions>,
) => ({
  dispatchRemoveSelectionAction: ({ legId, runnerUrn }) => {
    dispatch<BetslipSportsbookRemoveLegClick>({
      type: UI__BETSLIP_SBK_REMOVE_LEG_CLICK,
      payload: { legId, runnerUrn },
    });
    dispatch<BettingSportsbookRemoveLegAction>({
      type: BETTING__SBK_REMOVE_LEG_ACTION,
      payload: { legId },
    });
  },
});
