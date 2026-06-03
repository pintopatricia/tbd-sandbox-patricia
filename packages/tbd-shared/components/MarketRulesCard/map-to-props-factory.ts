import { MapStateToPropsFactory } from "react-redux";
import { createSelector, OutputParametricSelector } from "reselect";

import { ApplicationState, UserDetails } from "@ppb/tbd-store";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { FETCH_FULL_CARD, FetchFullCardAction } from "@ppb/tbd-store/actions/catalogue";
import {
  UI__NAVIGATE_TO_DISCOUNT_RATE_EXPLAINED,
  NavigateToDiscountRateExplained,
} from "@ppb/tbd-store/actions/navigation";
import URN from "@ppb/tbd-store/state/layout/URN";
import { MarketRulesCard, MarketRulesSection, MarketRulesCards } from "@ppb/tbd-store/state/layout/cards/Card.types";
import {
  MarketRulesMarketBettingType,
  MarketRulesSectionName,
} from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";

import { getExternalLink } from "../../helpers/external-links";
import { i18n } from "../../helpers/i18n";

export type ContainerProps = {
  urn: URN;
  modalView?: boolean;
};

type MarketRulesVM = {
  title: string;
  marketRules?: MarketRulesCard;
};

export type StateProps = {
  urn: URN;
  modalView?: boolean;
  timezone: string;
  localeCodeBcp47: string;
  discountRateUrl: string;
} & MarketRulesVM;

const dispatchFetchFullCardAction = (urn: string): FetchFullCardAction => ({
  type: FETCH_FULL_CARD,
  payload: urn,
});

const dispatchNavigateToDiscountRateExplainedAction = (text: string, url: string): NavigateToDiscountRateExplained => ({
  type: UI__NAVIGATE_TO_DISCOUNT_RATE_EXPLAINED,
  payload: { text, url },
});

export type DispatchProps = {
  dispatchFetchFullCardAction: typeof dispatchFetchFullCardAction;
  dispatchNavigateToDiscountRateExplainedAction: typeof dispatchNavigateToDiscountRateExplainedAction;
};

function getMarketRulesWalletSection(marketRules: MarketRulesCard): MarketRulesSection | undefined {
  return marketRules
    ? {
        name: i18n({ key: "I18N.MARKET_RULES.WALLET" }),
        content: marketRules.wallet,
      }
    : undefined;
}

function getMarketRulesClarificationsSection(marketRules: MarketRulesCard): MarketRulesSection | undefined {
  if (marketRules.clarifications) {
    return {
      name: i18n({ key: "I18N.MARKET_RULES.CLARIFICATIONS" }),
      content: marketRules.clarifications,
    };
  }

  return undefined;
}

function getMarketRulesMarketTypeSection(marketRules: MarketRulesCard): MarketRulesSection | undefined {
  if (marketRules.marketBettingType) {
    switch (marketRules.marketBettingType) {
      case MarketRulesMarketBettingType.WinOnlyMarket:
        return {
          name: i18n({ key: "I18N.MARKET_RULES.RULES" }),
          content: i18n({ key: "I18N.MARKET_RULES.WIN_ONLY_MARKET" }),
        };
      case MarketRulesMarketBettingType.AnyNumbWinners:
        return {
          name: i18n({ key: "I18N.MARKET_RULES.RULES" }),
          content: i18n({ key: "I18N.MARKET_RULES.ANY_NUMB_WINNERS" }),
        };
      case MarketRulesMarketBettingType.HandicapBet:
        return {
          name: i18n({ key: "I18N.MARKET_RULES.RULES" }),
          content: i18n({ key: "I18N.MARKET_RULES.HANDICAP_BET" }),
        };
      case MarketRulesMarketBettingType.ToBePlaced:
        if (marketRules.numberOfWinners) {
          return {
            name: i18n({ key: "I18N.MARKET_RULES.RULES" }),
            content: i18n({
              key: "I18N.MARKET_RULES.TO_BE_PLACED",
              interpolationValues: { winners: marketRules.numberOfWinners.toString() },
            }),
          };
        }
        break;
      default:
        break;
    }
  }

  return undefined;
}

const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getMarketRulesCardByURNSelector = createCardByURNSelector<MarketRulesCards, URN>();

  const createGetMarketRulesCardWithSectionsByURN = (): OutputParametricSelector<
    MarketRulesCards,
    string,
    MarketRulesVM,
    (marketRulesCard: MarketRulesCard | null, localeCode: string | undefined) => MarketRulesVM
  > =>
    createSelector(
      [
        (marketRulesCards: MarketRulesCards, urn: URN) => getMarketRulesCardByURNSelector(marketRulesCards, urn),
        (_, __, localeCode) => localeCode,
      ],
      (marketRulesCard): MarketRulesVM => {
        if (!marketRulesCard) {
          return { title: i18n({ key: "I18N.MARKET_RULES" }) };
        }

        const sections = marketRulesCard.sections.map((rule) => ({
          ...rule,
          name:
            rule.name === MarketRulesSectionName.MarketInformation
              ? i18n({ key: "I18N.MARKET_RULES.TITLE.MARKET_INFORMATION" })
              : i18n({ key: "I18N.MARKET_RULES.TITLE.CUSTOMER_AWARENESS" }),
        }));

        const rulesSection = getMarketRulesMarketTypeSection(marketRulesCard);
        if (rulesSection) {
          sections.unshift(rulesSection);
        }

        const walletSection = getMarketRulesWalletSection(marketRulesCard);
        if (walletSection) {
          sections.unshift(walletSection);
        }

        const clarificationsSection = getMarketRulesClarificationsSection(marketRulesCard);
        if (clarificationsSection) {
          sections.unshift(clarificationsSection);
        }

        return {
          marketRules: {
            ...marketRulesCard,
            sections,
          },
          title: i18n({ key: "I18N.MARKET_RULES" }),
        };
      },
    );

  const getMarketRulesCardWithSectionsByURN = createGetMarketRulesCardWithSectionsByURN();
  const getCountryLocalCurrencyCode = createGetCountryLocalCurrencyCodeSelector();

  return function mapStateToProps(state: ApplicationState, { urn, modalView }: ContainerProps): StateProps {
    const { localeCode, localeCodeBcp47, timezone, jurisdiction } = <UserDetails>getCountryLocalCurrencyCode(state);

    const { title, marketRules } = getMarketRulesCardWithSectionsByURN(
      state.layouts.cards.marketrules,
      urn,
      localeCode,
    );

    return {
      urn,
      marketRules,
      modalView,
      title,
      localeCodeBcp47,
      timezone,
      discountRateUrl: getExternalLink("MARKET_RULES_DISCOUNT_RATE", jurisdiction.jurisdiction, localeCode),
    };
  };
};

const mapDispatchToProps: DispatchProps = {
  dispatchFetchFullCardAction,
  dispatchNavigateToDiscountRateExplainedAction,
};

export { makeMapStateToProps, mapDispatchToProps };
