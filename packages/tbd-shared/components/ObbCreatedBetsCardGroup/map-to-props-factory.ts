import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";
import { Dispatch } from "redux";
import { ApplicationState, PUSH, PushAction } from "@ppb/tbd-store";
import { createCardGroupByURNSelector } from "@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors";
import { ObbCreatedBetsCardGroups } from "@ppb/tbd-store/state/layout/cardgroups/CardGroup.types";
import { ObbCreatedBetsLinkClickAction, UI__OBB_CREATED_BETS_LINK_CLICKED } from "@ppb/tbd-store/actions/navigation";
import URN from "@ppb/tbd-store/state/layout/URN";
import { i18n } from "../../helpers/i18n";
import { ContainerProps, DispatchProps, StateProps } from "./ObbCreatedBetsCardGroup.props";

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getObbCreatedBetsCardGroupByURN = createCardGroupByURNSelector<ObbCreatedBetsCardGroups, URN>();

  return (state: ApplicationState, { urn }: ContainerProps): StateProps => {
    const createdBetsCardGroup = getObbCreatedBetsCardGroupByURN(
      state.layouts.cardgroups.obbcreatedbetscardgroups,
      urn,
    );

    if (!createdBetsCardGroup) return {};

    const { title, headerBadgeLabel, headerViewLink, items } = createdBetsCardGroup;

    return {
      urn,
      title,
      headerBadgeLabel,
      headerViewLinkLabel: i18n({ key: "I18N.OBB.SQUADBET.ALL_MATCHES" }),
      headerViewLink,
      cards: items.map((card) => ({ urn: card.urn })),
    };
  };
};

export type DispatchActions = PushAction | ObbCreatedBetsLinkClickAction;

export const mapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = (
  dispatch: Dispatch<DispatchActions>,
) => ({
  dispatchLinkClick: (viewLink, urn, label) => {
    dispatch<ObbCreatedBetsLinkClickAction>({
      type: UI__OBB_CREATED_BETS_LINK_CLICKED,
      payload: {
        urn,
        label,
        viewUrl: viewLink.viewUrl,
      },
    });
  },
  dispatchPushAction: (viewLink) => {
    dispatch<PushAction>({
      type: PUSH,
      payload: viewLink,
    });
  },
});
