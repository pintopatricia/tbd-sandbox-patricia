import { ObbPositionType } from "@ppb/tbd-store/state/layout/cards/obb-card/ObbCard.types";
import URN from "@ppb/tbd-store/state/layout/URN";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { SportsbookBetButtonStatus } from "@ppb/the-wall-common/types";
import {
  BETTING__OBB_TOGGLE_LEG_ACTION,
  BettingObbToggleLegAction,
  ObbBetButtonClickAction,
  UI__OBB_BET_BUTTON_CLICK,
} from "@ppb/tbd-store/actions/betting";
import { Dispatch } from "redux";
import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";
import { createGetObbLegInBetslipByIdSelector } from "@ppb/tbd-store/state/betting/obb-betting/obb-betting-selectors";
import { createObbLegByIdSelector } from "@ppb/tbd-store/state/entities/obb-legs/obb-legs-selector";
import { ObbFormattedQuote } from "@ppb/tbd-store/state/entities/obb-legs/ObbLegs.types";
import { createSportsbookDisplayOddsPreferencesSelector } from "@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors";

import { buildObbBetButtonSecondaryLabel, formatQuote } from "../../helpers/obb";
import { createGetExperimentSelector } from "@ppb/tbd-store/state/entities/experiments/experiments-selectors";
import { i18n } from "../../helpers/i18n";
import { TranslationKey } from "../../translations/keys";
import { ObbModuleMetadataTemplate } from "@ppb/tbd-store/middlewares/ga4-tagging-resolvers/helpers";

export type ContainerProps = {
  cardUrn?: URN;
  position?: ObbPositionType;
  legId: string;
  eventName: string;
  metadataOverride?: ObbModuleMetadataTemplate;
  showSecondaryLabel?: boolean;
  onClick?: () => void;
  status?: SportsbookBetButtonStatus;
  accessibilityLabel?: string;
};

export type BetButtonsProps = {
  cardUrn?: URN;
  eventName: string;
  position?: ObbPositionType;
  legId: string;
  quote: ObbFormattedQuote;
  secondaryLabel?: string;
  status: SportsbookBetButtonStatus;
  animated: boolean;
  accessibilityLabel?: string;
  accessibilityHints?: {
    selected: string;
    default: string;
  };
};

export type StateProps = BetButtonsProps | Record<string, never>;

export type ComponentProps = StateProps & ContainerProps & DispatchProps;

const buildAccessibilityLabel = (
  treatedSecondaryLabel: string | undefined,
  label: string | null,
  status: string | undefined,
) => {
  if (status === "CLOSED" || status === "SUSPENDED") {
    const statusAccessibilityMap: Partial<Record<"CLOSED" | "SUSPENDED", keyof TranslationKey>> = {
      CLOSED: "I18N.ACCESSIBILITY.BET_BUTTON_CLOSED",
      SUSPENDED: "I18N.ACCESSIBILITY.BET_BUTTON_SUSPENDED",
    };
    const statusAccessibilityKey = statusAccessibilityMap[status];

    if (statusAccessibilityKey) {
      return i18n({ key: statusAccessibilityKey });
    }
  }

  if (!label) {
    return;
  }

  if (treatedSecondaryLabel) {
    return `${treatedSecondaryLabel}, ${i18n({
      key: "I18N.ACCESSIBILITY.BET_BUTTON_DEFAULT",
      interpolationValues: { odds: label },
    })}`;
  }

  return i18n({
    key: "I18N.ACCESSIBILITY.BET_BUTTON_DEFAULT",
    interpolationValues: { odds: label },
  });
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getSportsbookDisplayOddsPreferences = createSportsbookDisplayOddsPreferencesSelector();
  const getObbLegById = createObbLegByIdSelector();
  const getObbLegInBetslipById = createGetObbLegInBetslipByIdSelector();
  const getExperiment = createGetExperimentSelector();

  return (
    state: ApplicationState,
    { cardUrn, position, legId, eventName, showSecondaryLabel = true, status, accessibilityLabel }: ContainerProps,
  ): StateProps => {
    const showSquadBetExtendedLabelExperiment =
      getExperiment(state.entities.experiments, "exp-obp-squadbet-bet-buttons-simplification")?.variant ===
      "extended-label";

    const format = getSportsbookDisplayOddsPreferences(state.entities.preferences);
    const animated = state.entities.brandSettings?.SPORTSBOOK_BET_BUTTON_ANIMATION ?? true;

    const obbLeg = getObbLegById(state, legId);

    if (!obbLeg || !obbLeg.templateParams) {
      return {};
    }

    const { templateParams, templateId } = obbLeg;

    const secondaryLabel = showSecondaryLabel
      ? buildObbBetButtonSecondaryLabel(templateId, templateParams, showSquadBetExtendedLabelExperiment)
      : undefined;

    const betButtonStatus = status ?? (getObbLegInBetslipById(state, legId) ? "selected" : "default");

    const accessibilityHints = {
      selected: i18n({ key: "I18N.ACCESSIBILITY.REMOVE_FROM_BETSLIP_HINT" }),
      default: i18n({ key: "I18N.ACCESSIBILITY.ADD_TO_BETSLIP_HINT" }),
    };

    const label = formatQuote(obbLeg.quote, format);

    return {
      cardUrn,
      eventName,
      position,
      legId,
      quote: label,
      secondaryLabel,
      status: betButtonStatus,
      animated,
      accessibilityHints,
      accessibilityLabel: accessibilityLabel ?? buildAccessibilityLabel(secondaryLabel, label.odds, betButtonStatus),
    };
  };
};

export type DispatchProps = {
  dispatchAddLegToBetslip: (
    legId: string,
    urn?: string,
    eventName?: string,
    position?: ObbPositionType,
    metadataOverride?: BettingObbToggleLegAction["payload"]["metadataOverride"],
  ) => void;
};

export type DispatchActions = BettingObbToggleLegAction | ObbBetButtonClickAction;

export const mapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = (
  dispatch: Dispatch<DispatchActions>,
) => ({
  dispatchAddLegToBetslip: (legId, cardUrn, eventName, position, metadataOverride) => {
    dispatch<BettingObbToggleLegAction>({
      type: BETTING__OBB_TOGGLE_LEG_ACTION,
      payload: { legId, cardUrn, eventName, position, metadataOverride },
    });
    dispatch<ObbBetButtonClickAction>({
      type: UI__OBB_BET_BUTTON_CLICK,
    });
  },
});
