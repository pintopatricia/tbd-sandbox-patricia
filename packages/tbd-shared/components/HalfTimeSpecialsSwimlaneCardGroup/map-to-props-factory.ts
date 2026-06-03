import URN from "@ppb/tbd-store/state/layout/URN";

import {
  HalfTimeSpecialsSwimlaneCardGroups,
  DisplayMode,
  TitleImage,
  Image,
} from "@ppb/tbd-store/state/layout/cardgroups/CardGroup.types";
import { ExchangeSide } from "@ppb/tbd-store/state/betting/exchange-bets/ExchangeBet.types";
import { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";
import { MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { createCardGroupByURNSelector } from "@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors";
import { getBetslipExchangeContext } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { FETCH_CARDS_FROM_LIST, FetchCardsFromListAction, PUSH, PushAction } from "@ppb/tbd-store";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { BETTING__REMOVE_POTENTIAL_BET_ACTION, RemovePotentialBetAction } from "@ppb/tbd-store/actions/betting";
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
  subtitle: string;
  items: PartialItem[];
  icon?: Image;
  cardgroupURN: URN;
  displayMode: DisplayMode;
  isSegmented?: boolean;
  titleImage?: TitleImage;
  segmentedCardGroupUrn?: string;
  scrollIntoIndex?: number;
  currentRunner?: URN;
  currentSide?: ExchangeSide;
  isDecorated?: boolean;
  isIconSupportingTitle?: boolean;
  isHighlighted: boolean;
};

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getHalfTimeSpecialsSwimlaneCardGroupByURN = createCardGroupByURNSelector<
    HalfTimeSpecialsSwimlaneCardGroups,
    URN
  >();

  return function mapStateToProps(
    state: ApplicationState,
    { urn: cardgroupURN, theme, isTitleHidden, segmentedCardGroupUrn }: ContainerProps,
  ): StateProps {
    const cardgroup = getHalfTimeSpecialsSwimlaneCardGroupByURN(
      state.layouts.cardgroups.halftimespecialsswimlanecardgroups,
      cardgroupURN,
    );

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
      subtitle: !isTitleHidden ? cardgroup.subtitle || "" : "",
      titleImage: cardgroup.titleImage,
      items: cardgroup.items || [],
      cardgroupURN,

      segmentedCardGroupUrn: segmentedCardGroupUrn || "",
      displayMode: cardgroup.displayMode ?? "SCROLLABLE",
      currentRunner: exchangeContext?.runner,
      currentSide: exchangeContext?.side,
      isDecorated: cardgroup.isDecorated,
      isIconSupportingTitle: cardgroup.isIconSupportingTitle,
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

const dispatchClearBetting = (runner: URN, side: ExchangeSide): RemovePotentialBetAction => ({
  type: BETTING__REMOVE_POTENTIAL_BET_ACTION,
  payload: { runner, side },
});

export type DispatchProps = {
  dispatchPushAction: typeof dispatchPushAction;
  dispatchFetchCards: typeof dispatchFetchCards;
  dispatchClearBetting: typeof dispatchClearBetting;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchPushAction,
  dispatchFetchCards,
  dispatchClearBetting,
};
