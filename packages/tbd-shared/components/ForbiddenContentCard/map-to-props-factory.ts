import { MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { ExternalPushAction, EXTERNAL_PUSH } from "@ppb/tbd-store/actions/router";
import { ComponentTheme } from "@ppb/the-wall-common/types";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { ForbiddenContentCards } from "@ppb/tbd-store/state/layout/cards/Card.types";
import URN from "@ppb/tbd-store/state/layout/URN";
import { SawCardAction, SAW_CARD } from "@ppb/tbd-store/actions/interface";
import { AuthData } from "@ppb/tbd-store/state/initial-state/Environment.types";
import { ForbiddenContentType } from "@ppb/tbd-store/state/constants";

import { i18n } from "../../helpers/i18n";
import { TranslationKey } from "../../translations/keys";
import { getAuthData } from "../../config/endpoints";
import type { ForbiddenCardSize } from "./snowflakes/ForbiddenContent/ForbiddenContent.types";

export type CardProps = {
  message: string;
  theme?: ComponentTheme;
  size?: ForbiddenCardSize;
  anchorTextGTM: string;
  labels: {
    logIn: string;
    joinNow: string;
  };
  authData: AuthData | undefined;
};

type CardConfig = {
  messageKey: keyof TranslationKey;
  anchorTextGTM?: string;
  withoutLinks?: boolean;
  theme?: ComponentTheme;
  size?: ForbiddenCardSize;
};

type CardTypesConfig = {
  [key in ForbiddenContentType]: CardConfig;
};

const forbiddenCardsConfig: CardTypesConfig = {
  [ForbiddenContentType.GENERIC]: {
    messageKey: "I18N.FORBIDDEN_CARD" as keyof TranslationKey,
  },
  [ForbiddenContentType.MARKET_GRAPHS]: {
    messageKey: "I18N.FORBIDDEN_CARD.MARKET_GRAPH" as keyof TranslationKey,
    anchorTextGTM: ForbiddenContentType.MARKET_GRAPHS.replace("_", " "),
  },
  [ForbiddenContentType.MY_BETS]: {
    messageKey: "I18N.FORBIDDEN_CARD.MY_BETS" as keyof TranslationKey,
    withoutLinks: true,
    theme: ComponentTheme.DarkTransparent,
    anchorTextGTM: ForbiddenContentType.MY_BETS.replace("_", " "),
  },
};

const CARD_NAME = "forbidden card";

export type StateProps = CardProps | Record<string, never>;

export type ContainerProps = {
  urn?: URN;
  currentView?: string | null;
};

const getForbiddenCardsConfig = (forbiddenCardType: ForbiddenContentType): CardConfig =>
  forbiddenCardsConfig[forbiddenCardType];

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const authData = getAuthData();
  const getForbiddenContentCardByURN = createCardByURNSelector<ForbiddenContentCards, URN>();
  const labels = {
    logIn: i18n({ key: "I18N.FORBIDDEN_CARD.LOG_IN" }),
    joinNow: authData?.JOIN_DATA.joinNowLabel || i18n({ key: "I18N.FORBIDDEN_CARD.JOIN_NOW" }),
  };

  return (state: ApplicationState, { urn }: ContainerProps): StateProps => {
    let forbiddenContentCard;
    if (urn) {
      forbiddenContentCard = getForbiddenContentCardByURN(state.layouts.cards.forbiddencontent, urn);
    }

    if (!forbiddenContentCard) {
      return {};
    }

    const { messageKey, withoutLinks, theme, size, anchorTextGTM } = getForbiddenCardsConfig(
      forbiddenContentCard.forbiddenCardType,
    );

    const logInFragment = withoutLinks ? labels.logIn : "|LOG_IN|";
    const joinFragment = withoutLinks ? labels.joinNow : "|JOIN_NOW|";

    const message = i18n({
      key: messageKey,
      interpolationValues: {
        logIn: logInFragment,
        joinNow: joinFragment,
      },
    });

    return {
      message,
      theme,
      size,
      labels,
      authData,
      anchorTextGTM: anchorTextGTM || "",
    };
  };
};

const dispatchExternalPushAction = (label: string, anchorTextGTM: string, url: string): ExternalPushAction => ({
  type: EXTERNAL_PUSH,
  payload: {
    viewUrn: "",
    viewUrl: url,
    gtmData: {
      label,
      moduleName: `${CARD_NAME} - ${anchorTextGTM}`,
    },
  },
});

const dispatchSawCardAction = (anchorTextGTM: string): SawCardAction => ({
  type: SAW_CARD,
  payload: {
    label: CARD_NAME,
    moduleName: `${CARD_NAME} - ${anchorTextGTM}`,
  },
});

export type DispatchProps = {
  dispatchExternalPushAction: typeof dispatchExternalPushAction;
  dispatchSawCardAction: typeof dispatchSawCardAction;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchExternalPushAction,
  dispatchSawCardAction,
};
