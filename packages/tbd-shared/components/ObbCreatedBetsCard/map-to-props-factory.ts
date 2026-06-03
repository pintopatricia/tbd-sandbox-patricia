import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";
import { Dispatch } from "redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { createObbCreatedBetsCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/obb-created-bets-card/obb-created-bets-card-selectors";
import { ObbInPlayBetButtonClickAction, UI__OBB_INPLAY_BET_CLICK } from "@ppb/tbd-store/actions/obb";
import { FootballMatchStatus, PUSH, PushAction } from "@ppb/tbd-store";
import { createObbLegByIdSelector } from "@ppb/tbd-store/state/entities/obb-legs/obb-legs-selector";
import { ViewLink } from "@ppb/the-wall-common/types/Link/Link.types";
import { ObbCreatedBetsLinkClickAction, UI__OBB_CREATED_BETS_LINK_CLICKED } from "@ppb/tbd-store/actions/navigation";
import { getLayoutMetadata } from "@ppb/tbd-store/state/layout-snapshot";
import {
  ContainerProps,
  DispatchProps,
  ObbCreatedBetsCardBettingOpportunities,
  StateProps,
} from "./ObbCreatedBetsCard.props";
import { i18n } from "../../helpers/i18n";
import { buildBettingOpportunitiesVm } from "./ObbCreatedBetsCard.helpers";
import { ObbLegTemplateId } from "@ppb/tbd-store/state/entities/obb-legs/ObbLegs.types";

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getObbCreatedBetsCardByURN = createObbCreatedBetsCardByURNSelector();
  const getObbLegById = createObbLegByIdSelector();

  return (state: ApplicationState, { urn, cardIndex }: ContainerProps): StateProps => {
    const obbCreatedBetsCard = getObbCreatedBetsCardByURN(state, urn);

    if (!obbCreatedBetsCard) {
      return {};
    }

    const {
      fixture: { urn: fixtureUrn, status: fixtureStatus, scheduledAt: fixtureScheduledAt },
      sportEvent: { urn: eventUrn, name: eventName },
      footerViewLink,
      eventViewLink,
      bettingOpportunities,
    } = obbCreatedBetsCard;

    const isEventInPlay =
      (!!fixtureStatus && fixtureStatus !== FootballMatchStatus.PRE_MATCH) ||
      (!!fixtureScheduledAt && fixtureScheduledAt?.getTime() <= Date.now());

    const bettingOpportunitiesVm: ObbCreatedBetsCardBettingOpportunities[] = buildBettingOpportunitiesVm(
      bettingOpportunities,
      (legId: string) => getObbLegById(state, legId),
    );

    if (!bettingOpportunitiesVm.length) {
      return {};
    }

    const { verticalPosition = 0 } = getLayoutMetadata(urn);

    return {
      fixtureUrn,
      eventUrn,
      eventName,
      isEventInPlay,
      eventViewLink,
      footerViewLink,
      position: { verticalPosition, horizontalPosition: cardIndex + 1 },
      footerLabel: i18n({ key: "I18N.OBB.CREATEDBETS.ALL_BETS" }),
      bettingOpportunities: bettingOpportunitiesVm,
    };
  };
};

export type DispatchActions = PushAction | ObbInPlayBetButtonClickAction | ObbCreatedBetsLinkClickAction;

export const mapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = (
  dispatch: Dispatch<DispatchActions>,
) => ({
  dispatchInactiveObbBetButtonClick: (legTemplateId?: ObbLegTemplateId) => {
    dispatch<ObbInPlayBetButtonClickAction>({
      type: UI__OBB_INPLAY_BET_CLICK,
      payload: {
        legTemplateId,
      },
    });
  },
  dispatchLinkClick: (viewLink, urn, label = "", eventName = "", cardIndex = undefined) => {
    dispatch<ObbCreatedBetsLinkClickAction>({
      type: UI__OBB_CREATED_BETS_LINK_CLICKED,
      payload: {
        urn,
        label,
        viewUrl: viewLink.viewUrl,
        cardIndex,
        event: eventName,
      },
    });
  },
  dispatchPushAction: (viewLink: ViewLink) => {
    dispatch<PushAction>({
      type: PUSH,
      payload: viewLink,
    });
  },
});
