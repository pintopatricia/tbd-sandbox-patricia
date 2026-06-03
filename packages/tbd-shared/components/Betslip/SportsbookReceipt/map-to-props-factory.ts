import { MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { BetslipSportsbookReport } from "@ppb/tbd-store/state/betslip/Betslip.types";
import { getSportsbookReport } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import {
  BetslipAccordionHeaderClick,
  BetslipSportsbookReAddSelectionsClickAction,
  BetslipSportsbookReceiptBetIdCopyAction,
  BetslipSportsbookReceiptRegulatorBetIdCopyAction,
  UI__BETSLIP_ACCORDION_HEADER_CLICK,
  UI__BETSLIP_SBK_RE_ADD_SELECTIONS_CLICK,
  UI__BETSLIP_SBK_RECEIPT_BET_ID_COPY,
  UI__BETSLIP_SBK_RECEIPT_REGULATOR_BET_ID_COPY,
} from "@ppb/tbd-store/actions/betslip";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { Jurisdiction } from "@ppb/tbd-store/state/constants";
import { createGetThrottleSelector } from "@ppb/tbd-store";
import { buildPotentialReturns, buildTotalOriginalReturns } from "../betslip-formatters";
import { CurrencyUserDetails } from "../../../formatters/formatters";
import { i18n } from "../../../helpers/i18n";
import { currencyFormatWithDecimalPlaces } from "../../../formatters/currency-formatters";
import {
  createSelectionsBuilder,
  createMultiplesBuilder,
  createSinglesBuilder,
  createCastsBuilder,
  createBetBuildersBuilder,
  createMultiBetBuilder,
  createMultiBetBuilderGroups,
  createBoostedMultiplesBuilder,
  createOneLineBetsBuilder,
} from "./sportsbook-receipt-mapper";
import {
  SportsbookReceiptPanelCallbacks,
  SportsbookReceiptPanelProps,
  SportsbookReceiptReUseSelectionsClick,
} from "./snowflakes/SportsbookReceiptPanel/SportsbookReceiptPanel.types";

export type ContainerProps = {};

type CardProps = {
  selections: SportsbookReceiptPanelProps["selections"];
  multiples: SportsbookReceiptPanelProps["multiples"];
  boostedMultiples: SportsbookReceiptPanelProps["boostedMultiples"];
  singles: SportsbookReceiptPanelProps["singles"];
  oneLineBets: SportsbookReceiptPanelProps["oneLineBets"];
  casts: SportsbookReceiptPanelProps["casts"];
  betBuilders: SportsbookReceiptPanelProps["betBuilders"];
  multiBetBuilder?: SportsbookReceiptPanelProps["multiBetBuilder"];
  multiBetBuilderGroups: SportsbookReceiptPanelProps["multiBetBuilderGroups"];
  i18n: SportsbookReceiptPanelProps["i18n"];
  totalOriginalReturns?: SportsbookReceiptPanelProps["totalOriginalReturns"];
  totalStake: SportsbookReceiptPanelProps["totalStake"];
  potentialReturns: SportsbookReceiptPanelProps["potentialReturns"];
  isOddsBoosted: SportsbookReceiptPanelProps["isOddsBoosted"];
  hasBoostSignposting: SportsbookReceiptPanelProps["hasBoostSignposting"];
  hasShownReceiptIds: SportsbookReceiptPanelProps["hasShownReceiptIds"];
  showTopContent?: boolean;
  isModalThrottleActive: boolean;
  isTrapIconThrottleActive?: boolean;
};

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const buildSelections = createSelectionsBuilder();
  const buildMultiples = createMultiplesBuilder();
  const buildBoostedMultiples = createBoostedMultiplesBuilder();
  const buildSingles = createSinglesBuilder();
  const buildOneLineBets = createOneLineBetsBuilder();
  const buildCasts = createCastsBuilder();
  const buildBetBuilders = createBetBuildersBuilder();
  const buildMultiBetBuilder = createMultiBetBuilder();
  const buildMultiBetBuilderGroups = createMultiBetBuilderGroups();
  const getThrottle = createGetThrottleSelector();

  const i18nLabels = {
    multiplesTitleLabel: i18n({ key: "I18N.BETSLIP.MULTIPLES" }),
    boostedMultiplesTitleLabel: i18n({ key: "I18N.BETSLIP.GROUPS.PRICE_BOOST" }),
    selectionsLabel: i18n({ key: "I18N.BETSLIP.SELECTIONS" }),
    oddsLabel: i18n({ key: "I18N.BETSLIP.ODDS" }),
    stakeLabel: i18n({ key: "I18N.BETSLIP.STAKE" }),
    returnsLabel: i18n({ key: "I18N.BETSLIP.RETURNS" }),
    totalStakeLabel: i18n({ key: "I18N.BETSLIP.TOTAL_STAKE" }),
    totalReturnsLabel: i18n({ key: "I18N.BETSLIP.TOTAL_RETURNS" }),
    singlesTitleLabel: i18n({ key: "I18N.BETSLIP.SINGLES" }),
    castsTitleLabel: i18n({ key: "I18N.BETSLIP.CASTS" }),
    multiBetBuilderTitleLabel: i18n({ key: "I18N.BETSLIP.BET_BUILDER_MULTIS" }),
    betBuilderTitleLabel: i18n({ key: "I18N.BETSLIP.BET_BUILDER" }),
    receiptStatusLabel: i18n({ key: "I18N.BETSLIP.RECEIPT_TITLE" }),
    eachWayLabel: i18n({ key: "I18N.BETSLIP.EACHWAY" }),
    accaInsuranceLabel: i18n({ key: "I18N.BETSLIP.ACCA_INSURANCE_APPLIED" }),
    linesLabel: i18n({ key: "I18N.BETSLIP.LINES" }),
    reUseSelectionsLabel: i18n({ key: "I18N.BETSLIP.RE_USE_SELECTIONS" }),
    guaranteedPriceLabel: i18n({ key: "I18N.LABELS.BEST_ODDS_GUARANTEED_REDUCED" }),
    betReceiptIdLabel: i18n({ key: "I18N.MYBETS.BETID" }),
    regulatorBetIdLabel: i18n({ key: "I18N.MYBETS.BETID_AUX" }),
    confirmationMessage: i18n({ key: "I18N.BET.PLACED.CONFIRMATION.MESSAGING" }),
  };

  return (state: ApplicationState): StateProps => {
    let userDetails;
    try {
      userDetails = <UserDetails>getUserDetails(state);
    } catch (e) {
      console.error(e);
      return {};
    }

    const {
      result: { totalStake, totalPotentialReturns, originalTotalPotentialReturns, isAnyPriceBoostUsed },
    } = getSportsbookReport(state) as BetslipSportsbookReport;
    const selections = buildSelections(state);
    const isSkyBetClubActive =
      !!state.entities.brandSettings?.SKYBETCLUB &&
      getThrottle(state.entities.throttles, "ENABLE_SKYBETCLUB_TRACKER")?.isActive;
    const isBetfairClubActive =
      !!state.entities.brandSettings?.BETFAIRCLUB &&
      getThrottle(state.entities.throttles, "ENABLE_BETFAIRCLUB_TRACKER")?.isActive;
    const hasBoostSignposting = getThrottle(state.entities.throttles, "PRICE_BOOST_SINGLES_SIGNPOSTING")?.isActive;
    const modalThrottle = getThrottle(state.entities.throttles, "BETSLIP_DRAWER");
    const trapIconThrottle = getThrottle(state.entities.throttles, "SHOW_TRAP_ICON");

    return {
      selections,
      singles: buildSingles(state),
      oneLineBets: buildOneLineBets(state),
      multiples: buildMultiples(state),
      boostedMultiples: buildBoostedMultiples(state),
      casts: buildCasts(state),
      betBuilders: buildBetBuilders(state),
      multiBetBuilder: buildMultiBetBuilder(state),
      multiBetBuilderGroups: buildMultiBetBuilderGroups(state),
      i18n: {
        ...i18nLabels,
        selectionsLabel: i18n({
          key: "I18N.BETSLIP.SELECTIONS_COUNT",
          interpolationValues: { numberOfSelections: `${selections.length}` },
        }),
      },
      totalOriginalReturns: buildTotalOriginalReturns(
        totalStake,
        totalPotentialReturns,
        originalTotalPotentialReturns,
        !!isAnyPriceBoostUsed,
        userDetails,
      ),
      totalStake: currencyFormatWithDecimalPlaces({
        ...(<CurrencyUserDetails>userDetails),
        value: totalStake,
        decimalPlaces: 2,
      }),
      potentialReturns: buildPotentialReturns(totalStake, totalPotentialReturns, <UserDetails>userDetails),
      isOddsBoosted: !!isAnyPriceBoostUsed,
      hasBoostSignposting,
      hasShownReceiptIds: userDetails.jurisdiction.jurisdiction === Jurisdiction.ITALY,
      showTopContent: isBetfairClubActive || isSkyBetClubActive,
      isModalThrottleActive: !!modalThrottle?.isActive,
      isTrapIconThrottleActive: !!trapIconThrottle?.isActive,
    };
  };
};

const dispatchCopyBetIdAction = (): BetslipSportsbookReceiptBetIdCopyAction => ({
  type: UI__BETSLIP_SBK_RECEIPT_BET_ID_COPY,
});

const dispatchCopyRegulatorBetIdAction = (): BetslipSportsbookReceiptRegulatorBetIdCopyAction => ({
  type: UI__BETSLIP_SBK_RECEIPT_REGULATOR_BET_ID_COPY,
});

export type DispatchProps = {
  dispatchAccordionToggle: SportsbookReceiptPanelCallbacks["onTitleClick"];
  dispatchReUseSelections: SportsbookReceiptReUseSelectionsClick;
  dispatchCopyBetIdAction: typeof dispatchCopyBetIdAction;
  dispatchCopyRegulatorBetIdAction: typeof dispatchCopyRegulatorBetIdAction;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchAccordionToggle: (isExpanded: boolean): BetslipAccordionHeaderClick => ({
    type: UI__BETSLIP_ACCORDION_HEADER_CLICK,
    payload: { isExpanded },
  }),
  dispatchReUseSelections: (selections): BetslipSportsbookReAddSelectionsClickAction => ({
    type: UI__BETSLIP_SBK_RE_ADD_SELECTIONS_CLICK,
    payload: {
      numberOfSelections: selections.length,
    },
  }),
  dispatchCopyBetIdAction,
  dispatchCopyRegulatorBetIdAction,
};
