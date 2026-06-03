import { i18n } from "./i18n";

export type PlaceBetButtonLabelsConfig = {
  isPlacing?: boolean;
  isAuthenticating?: boolean;
  isDepositRequired?: boolean;
  isLoggedIn?: boolean;
  hasOddsChanged?: boolean;
  hasStake?: boolean;
  hasGenerosityWallets?: boolean;
  hasGenerosityTokens?: boolean;
  isSuspended?: boolean;
  isConfirmationStep?: boolean;
  shouldAcceptOddsMovement?: boolean;
  interpolatedValues?: { stake?: string; odds?: string };
};

export type PlaceBetButtonLabels = {
  label: string;
  secondaryLabel?: string;
  loadingLabel?: string;
  reverseLabels: boolean;
};

const getOddsChangedLabel = ({
  hasOddsChanged,
  shouldAcceptOddsMovement,
  interpolatedValues: { odds } = {},
}: PlaceBetButtonLabelsConfig) => {
  if (!hasOddsChanged || shouldAcceptOddsMovement) {
    return undefined;
  }

  return odds
    ? i18n({
        key: "I18N.BETSLIP.ACCEPT_VALUE_AND_PLACE",
        interpolationValues: { odds },
      })
    : i18n({ key: "I18N.BETSLIP.ACCEPT_ODDS_AND_PLACE" });
};

const buildPlaceBetButtonLabels = ({
  label,
  secondaryLabel,
  loadingLabel,
}: {
  label: string;
  secondaryLabel?: string;
  loadingLabel?: string;
}): PlaceBetButtonLabels => ({
  label,
  secondaryLabel,
  reverseLabels: !!secondaryLabel,
  loadingLabel,
});

const getAuthenticatingMessage = ({ isAuthenticating, isLoggedIn, hasStake }: PlaceBetButtonLabelsConfig) =>
  isAuthenticating && !isLoggedIn && hasStake ? buildPlaceBetButtonLabels({ label: "…" }) : undefined;

const getLoginMessage = ({ isLoggedIn, hasStake }: PlaceBetButtonLabelsConfig) =>
  !isLoggedIn && hasStake
    ? buildPlaceBetButtonLabels({ label: i18n({ key: "I18N.BETSLIP.LOGIN_PLACE_BET" }) })
    : undefined;

const getPlacingMessage = ({ isPlacing }: PlaceBetButtonLabelsConfig) =>
  isPlacing
    ? buildPlaceBetButtonLabels({ loadingLabel: i18n({ key: "I18N.BETSLIP.PLACING_BET" }), label: "" })
    : undefined;

const getSuspendedMessage = ({ isSuspended, isLoggedIn }: PlaceBetButtonLabelsConfig) =>
  isSuspended && isLoggedIn ? buildPlaceBetButtonLabels({ label: i18n({ key: "I18N.BETSLIP.SUSPENDED" }) }) : undefined;

const getDepositRequiredMessage = ({
  isDepositRequired,
  isConfirmationStep,
  isLoggedIn,
  interpolatedValues: { stake } = {},
}: PlaceBetButtonLabelsConfig) => {
  if (!isDepositRequired || !stake || !isLoggedIn) {
    return undefined;
  }

  const translationKey = isConfirmationStep
    ? "I18N.BETSLIP.DEPOSIT_TO_CONFIRM_STAKE_BET"
    : "I18N.BETSLIP.DEPOSIT_TO_PLACE_STAKE_BET";

  return buildPlaceBetButtonLabels({
    label: i18n({ key: translationKey, interpolationValues: { stake } }),
  });
};

const getEnterStakeMessage = ({ hasGenerosityWallets, hasGenerosityTokens, hasStake }: PlaceBetButtonLabelsConfig) =>
  // No stake + no tokens + has wallets -> undefined (it will later be "Place Bet" disabled, as default)

  !hasStake && !(hasGenerosityWallets && !hasGenerosityTokens)
    ? buildPlaceBetButtonLabels({ label: i18n({ key: "I18N.BETSLIP.ENTER_STAKE" }) })
    : undefined;

const getPlaceStakeBetMessage = (
  { hasStake, isConfirmationStep, interpolatedValues: { stake } = {} }: PlaceBetButtonLabelsConfig,
  secondaryLabel?: string,
) => {
  if (!hasStake || !stake) {
    return undefined;
  }

  const translationKey = isConfirmationStep ? "I18N.BETSLIP.CONFIRM_PLACE_STAKE_BET" : "I18N.BETSLIP.PLACE_STAKE_BET";

  return buildPlaceBetButtonLabels({
    label: i18n({ key: translationKey, interpolationValues: { stake } }),
    secondaryLabel,
  });
};

// Precedence:
// Authenticating (post-login redirect, before app context refresh completes)
// Log In to place bet
// Placing bet
// Suspended
// Deposit Required
// Please Enter Stake
// (Accept Odds &)? Place [STAKE_VALUE] Bet
// (Accept Odds &)? Place Bet (Fallback)
const sbkPlaceLabelsPrecedence = [
  getAuthenticatingMessage,
  getLoginMessage,
  getPlacingMessage,
  getSuspendedMessage,
  getDepositRequiredMessage,
  getEnterStakeMessage,
  getPlaceStakeBetMessage,
];

/**
 * Builds the labels for the SBK place bet button based on the provided parameters.
 * @param {Object} placeBetButtonLabelsConfig - The configuration object for the place bet button labels.
 *
 * @param {boolean} placeBetButtonLabelsConfig.isPlacing - Whether the bet is being placed.
 * @param {boolean} placeBetButtonLabelsConfig.isDepositRequired - Whether a deposit is required to place the bet.
 * @param {boolean} placeBetButtonLabelsConfig.isLoggedIn - Whether the user is logged in.
 * @param {boolean} placeBetButtonLabelsConfig.hasOddsChanged - Whether the odds have changed.
 * @param {boolean} placeBetButtonLabelsConfig.hasStake - Whether the bet has a stake.
 * @param {boolean} placeBetButtonLabelsConfig.hasGenerosityWallets - Whether the user has bonus wallets available.
 * @param {boolean} placeBetButtonLabelsConfig.isSuspended - Whether the bet is suspended.
 * @param {boolean} placeBetButtonLabelsConfig.isConfirmationStep - Whether the bet is on Confirmation Step.
 * @param {Object} placeBetButtonLabelsConfig.interpolatedValues - The interpolated values with formatted labels.
 * @param {string} placeBetButtonLabelsConfig.interpolatedValues.stake - The formatted stake value.
 * @param {string} placeBetButtonLabelsConfig.interpolatedValues.odds - The formatted odds value.
 *
 * @returns {string} The labels for the SBK place bet button.
 */
export const buildSbkPlaceBetButtonLabels = (
  placeBetButtonLabelsConfig: PlaceBetButtonLabelsConfig,
): PlaceBetButtonLabels => {
  const acceptOddsChangeLabel = getOddsChangedLabel(placeBetButtonLabelsConfig);

  for (const getLabels of sbkPlaceLabelsPrecedence) {
    const placeBetButtonLabels = getLabels(placeBetButtonLabelsConfig, acceptOddsChangeLabel);

    if (placeBetButtonLabels) {
      return placeBetButtonLabels;
    }
  }

  // Reachable if hasGenerosityWallets without stake (disabled state)
  return buildPlaceBetButtonLabels({
    label: i18n({ key: "I18N.BETSLIP.PLACE_BET" }),
    secondaryLabel: acceptOddsChangeLabel,
  });
};
