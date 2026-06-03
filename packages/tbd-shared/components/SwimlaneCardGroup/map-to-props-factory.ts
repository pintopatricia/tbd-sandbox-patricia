import { MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { PUSH, PushAction } from "@ppb/tbd-store/actions/router";
import { FETCH_CARDS_FROM_LIST, FetchCardsFromListAction } from "@ppb/tbd-store/actions/catalogue";
import { UI__CARDGROUP_VIEW_ALL_LINK_TAP, CardGroupViewAllLinkTapAction } from "@ppb/tbd-store/actions/navigation";
import URN from "@ppb/tbd-store/state/layout/URN";
import {
  SwimlaneCardGroup,
  DisplayMode,
  SwimlaneIndexedCardGroup,
  TitleImage,
  SwimlaneCardGroups,
  SwimlaneIndexedCardGroups,
  Image,
} from "@ppb/tbd-store/state/layout/cardgroups/CardGroup.types";
import { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { BETTING__REMOVE_POTENTIAL_BET_ACTION, RemovePotentialBetAction } from "@ppb/tbd-store/actions/betting";
import { getBetslipExchangeContext } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { createCardGroupByURNSelector } from "@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors";
import { ViewAllLink } from "@ppb/tbd-store/state/layout/views/ViewAll.types";
import { ExchangeSide } from "@ppb/tbd-store/state/betting/exchange-bets/ExchangeBet.types";
import { i18n } from "../../helpers/i18n";
import { TranslationKey } from "../../translations/keys";
import { ViewItemTheme } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";

export type ContainerProps = {
  segmentedCardGroupUrn?: string;
  urn: URN;
  isTitleHidden?: boolean;
  isSegmented?: boolean;
  visible?: boolean;
} & Pick<PartialItem, "theme">;

export type CardProps = {
  title: string;
  items: PartialItem[];
  icon?: Image;
  cardgroupURN: URN;
  displayMode: DisplayMode;
  isSegmented?: boolean;
  titleImage?: TitleImage;
  segmentedCardGroupUrn?: string;
  scrollIntoIndex?: number;
  viewAll?: ViewAllLink;
  currentRunner?: URN;
  currentSide?: ExchangeSide;
  isHighlighted: boolean;
};

export type StateProps = CardProps | Record<string, never>;

function isSwimlaneIndexedCardGroup(
  cardgroup: SwimlaneCardGroup | SwimlaneIndexedCardGroup,
): cardgroup is SwimlaneIndexedCardGroup {
  return (cardgroup as SwimlaneIndexedCardGroup).typename === "SwimlaneIndexedCardGroup";
}

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getSwimlaneCardGroupByURN = createCardGroupByURNSelector<SwimlaneCardGroups, URN>();
  const getSwimlaneIndexedCardGroupByURN = createCardGroupByURNSelector<SwimlaneIndexedCardGroups, URN>();

  return function mapStateToProps(
    state: ApplicationState,
    { urn: cardgroupURN, theme, isTitleHidden, segmentedCardGroupUrn }: ContainerProps,
  ): StateProps {
    const cardgroup =
      getSwimlaneCardGroupByURN(state.layouts.cardgroups.swimlanecardgroups, cardgroupURN) ||
      getSwimlaneIndexedCardGroupByURN(state.layouts.cardgroups.swimlaneindexedcardgroups, cardgroupURN);

    if (!cardgroup) {
      return {};
    }

    const title =
      cardgroup.displayName && cardgroup.displayName.translationKey
        ? i18n({ key: cardgroup.displayName.translationKey as keyof TranslationKey })
        : cardgroup.title;
    const hasBettingModule = !!state.modules.excBetting;
    const exchangeContext = hasBettingModule
      ? getBetslipExchangeContext(state)
      : { runner: undefined, side: undefined };

    return {
      title: !isTitleHidden ? title || "" : "",
      titleImage: cardgroup.titleImage,
      items: cardgroup.items || [],
      icon: isSwimlaneIndexedCardGroup(cardgroup) ? cardgroup.icon : undefined,
      cardgroupURN,
      scrollIntoIndex: isSwimlaneIndexedCardGroup(cardgroup) && cardgroup.hint ? cardgroup.hint : undefined,
      segmentedCardGroupUrn: segmentedCardGroupUrn || "",
      displayMode: cardgroup.displayMode ?? "SCROLLABLE",
      viewAll: cardgroup.viewAll,
      currentRunner: exchangeContext?.runner,
      currentSide: exchangeContext?.side,
      isHighlighted: theme === ViewItemTheme.Highlighted,
    };
  };
};

const dispatchFetchCards = (urn: string, partials: PartialItem[]): FetchCardsFromListAction => ({
  type: FETCH_CARDS_FROM_LIST,
  payload: {
    urn,
    partials,
  },
});

const dispatchPushAction = (viewLink: ViewLink): PushAction => ({
  type: PUSH,
  payload: viewLink,
});

const dispatchViewAllTap = (
  title: string,
  viewAllLink: ViewAllLink,
  cardgroupURN: URN,
): CardGroupViewAllLinkTapAction => ({
  type: UI__CARDGROUP_VIEW_ALL_LINK_TAP,
  payload: {
    title,
    viewAllLink,
    cardgroupURN,
  },
});

const dispatchClearBetting = (runner: URN, side: ExchangeSide): RemovePotentialBetAction => ({
  type: BETTING__REMOVE_POTENTIAL_BET_ACTION,
  payload: { runner, side },
});

export type DispatchProps = {
  dispatchPushAction: typeof dispatchPushAction;
  dispatchViewAllTap: typeof dispatchViewAllTap;
  dispatchFetchCards: typeof dispatchFetchCards;
  dispatchClearBetting: typeof dispatchClearBetting;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchPushAction,
  dispatchViewAllTap,
  dispatchFetchCards,
  dispatchClearBetting,
};
