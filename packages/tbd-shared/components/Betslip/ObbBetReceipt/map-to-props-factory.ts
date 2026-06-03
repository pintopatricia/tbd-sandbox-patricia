import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { MapStateToPropsFactory } from "react-redux";
import { getObbReport } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { BetslipObbReportBetLeg, UserDetails } from "@ppb/tbd-store";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import {
  BetslipAccordionHeaderClick,
  BetslipObbReceiptPanelDoneClickAction,
  UI__BETSLIP_ACCORDION_HEADER_CLICK,
} from "@ppb/tbd-store/actions/betslip";
import { createUserPreferencesWithProductSwitcherSelector } from "@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors";
import { i18n } from "../../../helpers/i18n";
import { currencyFormatWithDecimalPlaces } from "../../../formatters/currency-formatters";
import { buildOdds } from "../betslip-formatters";
import {
  SportsbookReceiptPanelCallbacks,
  SportsbookReceiptPanelProps,
} from "../SportsbookReceipt/snowflakes/SportsbookReceiptPanel/SportsbookReceiptPanel.types";
import { TranslationKey } from "../../../translations/keys";
import { BetSelection } from "../SportsbookReceipt/snowflakes/SportsbookReceiptPanel/snowflakes/BetSelections/BetSelections.types";

type ObbBetReceiptI18n = {
  totalStakeLabel: string;
  totalReturnsLabel: string;
  receiptTitle: string;
  receiptStatusLabel: string;
  boostedMultiplesTitleLabel: string;
  multiplesTitleLabel: string;
  singlesTitleLabel: string;
  castsTitleLabel: string;
  multiBetBuilderTitleLabel: string;
  betBuilderTitleLabel: string;
  selectionsLabel: string;
  oddsLabel: string;
  stakeLabel: string;
  returnsLabel: string;
  oddsMovementDescription: string;
  oddsMovementLabel: string;
  eachWayLabel: string;
  linesLabel: string;
  accaInsuranceLabel: string;
  reUseSelectionsLabel: string;
  guaranteedPriceLabel: string;
  betReceiptIdLabel: string;
  regulatorBetIdLabel: string;
  freeBetsAlertRemoveLabel?: string;
  confirmationMessage: string;
};

export type ContainerProps = {};

type CardProps = {
  i18n: ObbBetReceiptI18n;
  totalStake: string;
  totalReturns: string;
  betSelections: BetSelection[];
  singles: SportsbookReceiptPanelProps["singles"];
  multiples: SportsbookReceiptPanelProps["betBuilders"];
};

export type StateProps = CardProps | Record<string, never>;

function createSinglesBuilder(
  leg: BetslipObbReportBetLeg,
  stake: number,
  odds: string,
  formattedReturns: string,
  receiptId: string,
): SportsbookReceiptPanelProps["singles"][number] {
  return {
    title: leg.metadata.participantsDescription || leg.metadata.legDescription,
    subtitle: `${leg.metadata.outcomeDescription ? `${leg.metadata.outcomeDescription} - ` : ""}${
      leg.event.name || ""
    }`,
    stake: stake.toString(),
    odds,
    profitOrLiability: formattedReturns,
    eachWaySubtitle: "",
    betReceiptId: receiptId,
    hasEachWay: false,
    hasMyOddsBoost: false,
    isPriceBoosted: false,
    isGuaranteedPriceSelected: false,
  };
}

function createMultiplesBuilder(
  leg: BetslipObbReportBetLeg,
  stake: number,
  odds: string,
  formattedReturns: string,
  betId: string,
  receiptId: string,
  selectionsToWin?: number,
): SportsbookReceiptPanelProps["betBuilders"][number] {
  const {
    legId,
    event,
    metadata: { legDescription, participantsDescription = "", outcomeDescription = "" },
  } = leg;

  const legDescriptions = legDescription.split(" | ");
  const participants = participantsDescription.split(" | ") || [];
  const outcomes = outcomeDescription.split(" | ") || [];

  const selections = legDescriptions.map((description, index) => ({
    // since legId is the same for all selections in the leg, we append the index to make the id unique
    id: `${legId}-${index}`,
    urn: legId,
    title: participants[index] || description,
    subtitle: outcomes[index] || "",
    eventName: event.name,
  }));

  return {
    title: event.name,
    stake: stake.toString(),
    odds,
    returns: formattedReturns,
    betReceiptId: receiptId,
    id: betId,
    type: "",
    hasBonusUsed: false,
    selections,
    selectionsLabel: i18n({
      key: "I18N.BETSLIP.SELECTIONS_COUNT",
      interpolationValues: { numberOfSelections: legDescriptions.length.toString() },
    }),
    selectionsToWin,
  };
}

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const i18nLabels = {
    totalStakeLabel: i18n({ key: "I18N.BETSLIP.TOTAL_STAKE" }),
    totalReturnsLabel: i18n({ key: "I18N.BETSLIP.TOTAL_RETURNS" }),
    receiptTitle: i18n({ key: "I18N.BETSLIP.RECEIPT_TITLE" }),
    selectionsLabel: i18n({ key: "I18N.BETSLIP.SELECTIONS" }),
    oddsLabel: i18n({ key: "I18N.BETSLIP.ODDS" }),
    stakeLabel: i18n({ key: "I18N.BETSLIP.STAKE" }),
    returnsLabel: i18n({ key: "I18N.BETSLIP.RETURNS" }),
    singlesTitleLabel: i18n({ key: "I18N.BETSLIP.SINGLES" }),
    betBuilderTitleLabel: i18n({ key: "I18N.BETSLIP.MULTIPLES" }),
    receiptStatusLabel: i18n({ key: "I18N.BETSLIP.RECEIPT_TITLE" }),
    betReceiptIdLabel: i18n({ key: "I18N.MYBETS.BETID" }),
    regulatorBetIdLabel: i18n({ key: "I18N.MYBETS.BETID_AUX" }),
    confirmationMessage: i18n({ key: "I18N.BET.PLACED.CONFIRMATION.MESSAGING" }),
    multiplesTitleLabel: "",
    boostedMultiplesTitleLabel: "",
    castsTitleLabel: "",
    multiBetBuilderTitleLabel: "",
    oddsMovementDescription: "",
    oddsMovementLabel: "",
    eachWayLabel: "",
    accaInsuranceLabel: "",
    linesLabel: "",
    reUseSelectionsLabel: "",
    guaranteedPriceLabel: "",
  };

  const getUserPreferencesWithProductSwitcher = createUserPreferencesWithProductSwitcherSelector();

  return (state: ApplicationState): StateProps => {
    let userDetails: UserDetails;

    try {
      userDetails = <UserDetails>getUserDetails(state);
    } catch (e) {
      console.error(e);  

      return {};
    }

    const preferences = getUserPreferencesWithProductSwitcher(state.entities.preferences);
    const obbReport = getObbReport(state);

    if (!obbReport) {
      return {};
    }

    const { bets } = obbReport;

    const singles: SportsbookReceiptPanelProps["singles"] = [];
    const multiples: SportsbookReceiptPanelProps["betBuilders"] = [];

    let totalStake = 0;
    let totalReturns = 0;

    Object.values(bets).forEach((bet) => {
      const { betId, legs, stake, price, potentialPayout, receiptId, selectionsToWin } = bet;

      totalStake += stake;
      totalReturns += potentialPayout;

      const odds = buildOdds(
        {
          fractionalOdds: price.fractional,
          decimalOdds: price.decimal,
        },
        preferences.sportsbookOddsDisplay,
      );

      const formattedReturns = currencyFormatWithDecimalPlaces({
        ...userDetails,
        value: potentialPayout,
        decimalPlaces: 2,
      });

      const isXOfNBet =
        legs[0].metadata.legTypeDescription === i18n({ key: "I18N.OBB.BETTYPE.xOfN" as keyof TranslationKey });

      if (isXOfNBet) {
        multiples.push(
          createMultiplesBuilder(legs[0], stake, odds, formattedReturns, betId, receiptId, selectionsToWin),
        );
      } else {
        singles.push(createSinglesBuilder(legs[0], stake, odds, formattedReturns, receiptId));
      }
    });

    return {
      betSelections: [],
      singles,
      multiples,
      i18n: i18nLabels,
      totalStake: currencyFormatWithDecimalPlaces({
        ...userDetails,
        value: totalStake,
        decimalPlaces: 2,
      }),
      totalReturns: currencyFormatWithDecimalPlaces({
        ...userDetails,
        value: totalReturns,
        decimalPlaces: 2,
      }),
    };
  };
};

export type DispatchProps = {
  dispatchAccordionToggle: SportsbookReceiptPanelCallbacks["onTitleClick"];
};

export type DispatchActions = BetslipObbReceiptPanelDoneClickAction;

export const mapDispatchToProps: DispatchProps = {
  dispatchAccordionToggle: (isExpanded: boolean): BetslipAccordionHeaderClick => ({
    type: UI__BETSLIP_ACCORDION_HEADER_CLICK,
    payload: { isExpanded },
  }),
};
