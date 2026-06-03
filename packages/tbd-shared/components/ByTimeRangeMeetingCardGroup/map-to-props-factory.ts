import { MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { PUSH, PushAction } from "@ppb/tbd-store/actions/router";
import { FETCH_CARDS_FROM_LIST, FetchCardsFromListAction } from "@ppb/tbd-store/actions/catalogue";
import { UI__CARDGROUP_VIEW_ALL_LINK_TAP, CardGroupViewAllLinkTapAction } from "@ppb/tbd-store/actions/navigation";
import URN from "@ppb/tbd-store/state/layout/URN";
import { ByTimeRangeMeetingCardGroups, Image } from "@ppb/tbd-store/state/layout/cardgroups/CardGroup.types";
import { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { BETTING__REMOVE_POTENTIAL_BET_ACTION, RemovePotentialBetAction } from "@ppb/tbd-store/actions/betting";
import { createCardGroupByURNSelector } from "@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors";
import { ViewAllLink } from "@ppb/tbd-store/state/layout/views/ViewAll.types";
import { ExchangeSide } from "@ppb/tbd-store/state/betting/exchange-bets/ExchangeBet.types";
import { i18n } from "../../helpers/i18n";
import { TranslationKey } from "../../translations/keys";

export type ContainerProps = {
  segmentedCardGroupUrn?: string;
  urn: URN;
  isTitleHidden?: boolean;
  isSegmented?: boolean;
  visible?: boolean;
};

export type CardProps = {
  title: string | undefined;
  items: PartialItem[];
  icon?: Image;
  cardgroupURN: URN;
};

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getByTimeRangeMeetingCardGroupByURN = createCardGroupByURNSelector<ByTimeRangeMeetingCardGroups, URN>();

  return function mapStateToProps(
    state: ApplicationState,
    { urn: cardgroupURN, isTitleHidden }: ContainerProps,
  ): StateProps {
    const cardgroup = getByTimeRangeMeetingCardGroupByURN(
      state.layouts.cardgroups.bytimerangemeetingcardgroup,
      cardgroupURN,
    );

    if (!cardgroup) {
      return {};
    }

    const title = cardgroup.displayName?.translationKey
      ? i18n({ key: cardgroup.displayName.translationKey as unknown as keyof TranslationKey })
      : cardgroup.title;

    return {
      title: (!isTitleHidden && title) || "",
      items: cardgroup.items || [],
      icon: cardgroup.icon ?? undefined,
      cardgroupURN,
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
