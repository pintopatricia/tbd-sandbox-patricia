import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { createEntityByURNSelector } from "@ppb/tbd-store/state/entities/entities-selectors";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { ExtraWalletCard, ExtraWalletCards } from "@ppb/tbd-store/state/layout/cards/Card.types";
import URN from "@ppb/tbd-store/state/layout/URN";
import { MapStateToPropsFactory } from "react-redux";
import { createSelector } from "reselect";
import { ExtraWallets } from "@ppb/tbd-store/state/entities/extra-wallet/ExtraWallet.types";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { createUserPreferencesWithProductSwitcherSelector } from "@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors";
import { FreeBetsWalletToggleAction, UI__FREE_BETS_WALLET_TOGGLE_CLICK } from "@ppb/tbd-store/actions/interface";
import { WalletTypes } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { CountdownType } from "./snowflakes/Countdown/Countdown.types";
import { i18n } from "../../helpers/i18n";
import { currencyFormatWithDecimalPlaces } from "../../formatters/currency-formatters";
import { timeLeftFormatter } from "../../formatters/time-formatters";
import { formatFixedOdds, pickMoneyBackAlertMessage, OptionWallets } from "../../helpers/generosity-wallets";

export type ContainerProps = {
  urn: URN;
  optionWallets?: OptionWallets;
  onOptionWalletsUpdate?: (walletId: string, isSelected: boolean) => void;
  currentPebble: string;
};

export type CardProps = {
  title: string;
  subtitle?: string;
  optionId: string;
  shouldUseAlertType?: boolean;
  timeLeftText?: string;
  countdownType?: CountdownType;
  badges: { label: string; taggingLabel?: string }[];
  formattedFixedOdds?: string;
};

export type StateProps = CardProps | Record<string, never>;

const TIME_LIMIT_FOR_ALERT = 3600000;

const createWalletDetailsSelector = () => {
  const getExtraWalletCard = createCardByURNSelector<ExtraWalletCards, URN>();
  const getExtraWalletEntity = createEntityByURNSelector<ExtraWallets, URN>();
  const getUserPreferencesWithProductSwitcher = createUserPreferencesWithProductSwitcherSelector();

  return createSelector(
    [
      (state: ApplicationState) => state.entities.extraWallets,
      (state: ApplicationState, extraWalletCardURN: URN) =>
        getExtraWalletCard(state.layouts.cards.extrawallet, extraWalletCardURN),
      (_: ApplicationState, __: URN, userDetails: UserDetails) => userDetails,
      (state: ApplicationState) =>
        getUserPreferencesWithProductSwitcher(state.entities.preferences).sportsbookOddsDisplay,
    ],
    (
      extraWallets: ExtraWallets,
      extraWalletCard: ExtraWalletCard | null,
      userDetails: UserDetails,
      sportsbookOddsDisplay,
    ): StateProps => {
      if (!extraWalletCard) {
        return {};
      }

      const extraWalletEntity = getExtraWalletEntity(extraWallets, extraWalletCard.extraWalletURN);

      if (!extraWalletEntity) {
        return {};
      }

      const { amount, expirationDate, indexedId, walletType, lostLegs, maxReturn, maxFinPos, ghostLegs, fixedOdds } =
        extraWalletEntity;
      const { localeCodeBcp47 } = userDetails;

      const formattedAmount = currencyFormatWithDecimalPlaces({
        ...userDetails,
        value: amount,
      });

      const formattedFixedOdds = fixedOdds ? formatFixedOdds(fixedOdds, sportsbookOddsDisplay) : undefined;

      const generosityWalletTitleProps = {
        PRICE_BOOST_TOKEN: i18n({
          key: fixedOdds ? "I18N.BOOST_FIXED_ODDS_VALUE" : "I18N.BOOST_VALUE",
          interpolationValues: { value: formattedFixedOdds || amount || 0 },
        }),
        ACCA_INSURANCE_TOKEN: i18n({
          key: "I18N.MONEY_BACK_ACCA_TOKEN",
        }),
        BONUS_CASH: i18n({
          key: "I18N.FREE_BET",
          interpolationValues: { value: formattedAmount },
        }),
        MONEY_BACK_TOKEN: i18n({
          key: "I18N.MONEY_BACK_ACCA_TOKEN",
        }),
        GHOST_LEG_TOKEN: i18n({
          key: "I18N.GHOST_LEG_TOKEN",
        }),
      };

      const title = generosityWalletTitleProps[walletType as keyof typeof generosityWalletTitleProps];

      let subtitle: string | undefined = undefined;

      if (walletType === WalletTypes.AccaInsuranceToken && lostLegs && maxReturn) {
        subtitle = i18n({
          key: "I18N.MONEY_BACK_ACCA_CONDITION",
          interpolationValues: {
            numberOfLegs: lostLegs,
            value: currencyFormatWithDecimalPlaces({
              ...userDetails,
              value: maxReturn,
            }),
          },
        });
      }

      if (walletType === WalletTypes.GhostLegToken && ghostLegs) {
        subtitle = i18n({
          key: "I18N.GHOST_LEG_CONDITION",
          interpolationValues: {
            numberOfLegs: ghostLegs,
          },
        });
      }

      if (walletType === WalletTypes.MoneyBackToken && maxReturn) {
        const formattedMaxReturn = currencyFormatWithDecimalPlaces({
          ...userDetails,
          value: maxReturn,
        });

        subtitle = pickMoneyBackAlertMessage({ maxFinPos, formattedAmount: formattedMaxReturn });
      }

      const { acca, sameGameMulti, single } = extraWalletCard.restrictions;
      let restrictionBadge: { label: string; taggingLabel: string } | null = null;

      if (sameGameMulti) {
        restrictionBadge = {
          label: i18n({ key: "I18N.DESCRIPTION.BET_BUILDER" }),
          taggingLabel: "Bet Builder",
        };
      } else if (acca) {
        restrictionBadge = {
          label: i18n({ key: "I18N.ACCA" }),
          taggingLabel: "Acca",
        };
      } else if (single && walletType === WalletTypes.MoneyBackToken) {
        restrictionBadge = {
          label: i18n({ key: "I18N.MONEY_BACK_REWARD.SINGLE" }),
          taggingLabel: "Single",
        };
      }

      const badges = [
        ...(restrictionBadge ? [restrictionBadge] : []),
        ...extraWalletCard.badges.map((badge) => ({ label: badge })),
      ];

      if (!expirationDate) {
        return {
          optionId: indexedId as string, // indexedId is optional but it's a prop that BFF always provides, so this will never be undefined
          title,
          subtitle,
          badges,
          formattedFixedOdds,
        };
      }

      const millisecondsLeft = new Date(expirationDate).getTime() - Date.now();
      const timeFormatted = timeLeftFormatter(localeCodeBcp47, millisecondsLeft);
      const timeLeftText = i18n({
        key: "I18N.LABEL.LEFT_TIME",
        interpolationValues: { time_left: timeFormatted },
      });

      const countdownType = millisecondsLeft < TIME_LIMIT_FOR_ALERT ? CountdownType.ALERT : CountdownType.DEFAULT;

      return {
        optionId: indexedId as string, // indexedId is optional but it's a prop that BFF always provides, so this will never be undefined
        title,
        subtitle,
        badges,
        timeLeftText,
        countdownType,
        formattedFixedOdds,
      };
    },
  );
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getWalletDetails = createWalletDetailsSelector();

  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    let userDetails;

    try {
      userDetails = <UserDetails>getUserDetails(state);
    } catch (e) {
      console.error(e);

      return {};
    }

    return getWalletDetails(state, urn, userDetails);
  };
};

const dispatchToggleWalletClick = (
  isSelected: boolean,
  walletDescription: string,
  value: number | undefined,
  totalAmount: number | string | undefined,
  currentPebble: string,
  numberOfPlaces: number | undefined,
  walletType: WalletTypes,
): FreeBetsWalletToggleAction => ({
  type: UI__FREE_BETS_WALLET_TOGGLE_CLICK,
  payload: {
    isSelected,
    walletDescription,
    value,
    totalAmount,
    currentPebble,
    numberOfPlaces,
    walletType,
  },
});

export type DispatchProps = {
  dispatchToggleWalletClick: typeof dispatchToggleWalletClick;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchToggleWalletClick,
};
