import { MapStateToPropsFactory } from "react-redux";

import { ApplicationState, BET_SHARING_SRC, DELETE_VIEW_ITEMS, DeleteViewItems } from "@ppb/tbd-store";
import URN from "@ppb/tbd-store/state/layout/URN";
import {
  MyBetsBetSharingDismissTapAction,
  MyBetsBetSharingShareBetTapAction,
  MyBetsBetSharingShareImageTapAction,
  UI__MY_BETS_BET_SHARING_DISMISS_TAP,
  UI__MY_BETS_BET_SHARING_SHARE_BET_TAP,
  UI__MY_BETS_BET_SHARING_SHARE_IMAGE_TAP,
} from "@ppb/tbd-store/actions/my-bets";
import { ExternalPushAction, EXTERNAL_PUSH } from "@ppb/tbd-store/actions/router";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";
import { BetSharingCardGroups } from "@ppb/tbd-store/state/layout/cardgroups/CardGroup.types";
import { Jurisdiction } from "@ppb/tbd-store/config/Jurisdiction";
import { BetProduct, SportsbookBet, BetLeg } from "@ppb/tbd-store/state/betting/sportsbook-bets/SportsbookBet.types";
import { createCardGroupByURNSelector } from "@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors";
import { createSportsbookBetLegsSelector } from "@ppb/tbd-store/state/entities/sportsbook-bet-legs/sportsbook-bet-legs-selectors";
import { createGetThrottleSelector } from "@ppb/tbd-store/state/entities/throttles/throttles-selectors";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { createUserPreferencesWithProductSwitcherSelector } from "@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors";

import { ShareProps } from "./snowflakes/Share/Share.types";
import { BetPart, buildBetslipAddBetsDeepLink } from "../../helpers/deep-links";
import { getMainUrl } from "../../helpers/domain.web";
import { i18n } from "../../helpers/i18n";
import { getBetTitle, getBetSupportingText, getBetStatusLabel, StatusLabel } from "../../helpers/my-bets";
import { SportsbookBetPanelProps } from "../SportsbookBetPanel/SportsbookBetPanel.types";

export type ContainerProps = {
  urn: URN;
};

export type CardProps = {
  title: ShareProps["title"];
  description: ShareProps["description"];
  betTitle: SportsbookBetPanelProps["title"];
  betSupportingText: SportsbookBetPanelProps["supportingText"];
  betStatusLabel?: StatusLabel;
  items: PartialItem[];
  betShareButtonText?: ShareProps["leftButtonText"];
  imageShareButtonText: ShareProps["rightButtonText"];
  shareMessage?: string;
};

export type StateProps = CardProps | Record<string, never>;

const getDeepLinkUrl = (
  { isSettled, product }: SportsbookBet,
  legs: BetLeg[],
  jurisdiction: Jurisdiction,
): string | undefined => {
  if (isSettled || product !== BetProduct.SPORTSBOOK) {
    return undefined;
  }

  const betParts: BetPart[] = legs.flatMap(({ parts }) =>
    parts.map(({ marketId = "", selectionId = 0 }) => ({ marketId, selectionId })),
  );

  if (!betParts.length) {
    return undefined;
  }

  return `${buildBetslipAddBetsDeepLink(betParts, getMainUrl(jurisdiction))}&src=${BET_SHARING_SRC}`;
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getBetSharingCardGroupByURNSelector = createCardGroupByURNSelector<BetSharingCardGroups, URN>();
  const getUserPreferencesWithProductSwitcher = createUserPreferencesWithProductSwitcherSelector();
  const getUserDetailsSelector = createGetCountryLocalCurrencyCodeSelector();
  const getSportsbookBetLegsByURN = createSportsbookBetLegsSelector();
  const getThrottle = createGetThrottleSelector();

  return (state: ApplicationState, { urn }: ContainerProps): StateProps => {
    const isWinLoseVoidActive = getThrottle(state.entities.throttles, "MY_BETS_WIN_LOSE_VOID")?.isActive;
    let userDetails;

    try {
      userDetails = <UserDetails>getUserDetailsSelector(state);
    } catch (e) {
      console.error(e);
      return {};
    }

    const betSharingCardGroup = getBetSharingCardGroupByURNSelector(state.layouts.cardgroups.betsharingcardgroups, urn);

    if (!betSharingCardGroup) {
      return {};
    }

    const betLegs = getSportsbookBetLegsByURN(state.entities.sportsbookbetlegs, betSharingCardGroup.bet.legs) || [];

    const { sportsbookOddsDisplay } = getUserPreferencesWithProductSwitcher(state.entities.preferences);
    const deepLinkUrl = getDeepLinkUrl(
      betSharingCardGroup.bet,
      betLegs,
      userDetails?.jurisdiction.jurisdiction as Jurisdiction,
    );
    const shouldDisplaySupportingText =
      (state.entities.brandSettings?.MYBETS_BET_PANEL_SUBTITLE ||
        state.entities.brandSettings?.MYBETS_BET_PANEL_SUPPORTING_TEXT) ??
      true;

    return {
      title: i18n({ key: "I18N.BET_SHARING.TITLE" }),
      description: i18n({ key: "I18N.BET_SHARING.DESCRIPTION" }),
      betTitle: getBetTitle(betSharingCardGroup.bet, betLegs, sportsbookOddsDisplay),
      betSupportingText: shouldDisplaySupportingText ? getBetSupportingText(betLegs) : undefined,
      betStatusLabel: getBetStatusLabel(betSharingCardGroup.bet, betLegs, {
        locale: userDetails?.localeCodeBcp47,
        timezone: userDetails?.timezone,
        showWinLoseVoidFeature: !!isWinLoseVoidActive,
      }),
      items: betSharingCardGroup.items,
      betShareButtonText: deepLinkUrl && i18n({ key: "I18N.BET_SHARING.BET_SHARE_BUTTON_TEXT" }),
      imageShareButtonText: i18n({ key: "I18N.BET_SHARING.IMAGE_SHARE_BUTTON_TEXT" }),
      shareMessage:
        deepLinkUrl &&
        `${i18n({
          key: "I18N.BET_SHARING.SHARE_MESSAGE",
          interpolationValues: { url: deepLinkUrl },
        })} \n \n`,
    };
  };
};

const dispatchDeleteViewItems = (urn: string): DeleteViewItems => ({
  type: DELETE_VIEW_ITEMS,
  payload: [urn],
});

const dispatchDismissTap = (): MyBetsBetSharingDismissTapAction => ({
  type: UI__MY_BETS_BET_SHARING_DISMISS_TAP,
});

const dispatchShareBetTap = (): MyBetsBetSharingShareBetTapAction => ({
  type: UI__MY_BETS_BET_SHARING_SHARE_BET_TAP,
});

const dispatchShareImageTap = (): MyBetsBetSharingShareImageTapAction => ({
  type: UI__MY_BETS_BET_SHARING_SHARE_IMAGE_TAP,
});

const dispatchExternalPushAction = (url: string): ExternalPushAction => ({
  type: EXTERNAL_PUSH,
  payload: {
    viewUrn: "",
    viewUrl: url,
    gtmData: {
      label: "help & support",
      moduleName: "mybets",
    },
  },
});

export type DispatchProps = {
  dispatchDeleteViewItems: typeof dispatchDeleteViewItems;
  dispatchDismissTap: typeof dispatchDismissTap;
  dispatchShareBetTap: typeof dispatchShareBetTap;
  dispatchShareImageTap: typeof dispatchShareImageTap;
  dispatchExternalPushAction: typeof dispatchExternalPushAction;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchDeleteViewItems,
  dispatchDismissTap,
  dispatchShareBetTap,
  dispatchShareImageTap,
  dispatchExternalPushAction,
};
