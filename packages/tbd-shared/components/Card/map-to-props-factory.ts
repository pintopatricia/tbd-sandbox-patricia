import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { createFindCardbyURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { createFindCardGroupByURNSelector } from "@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors";
import { createViewZoneByURNSelector } from "@ppb/tbd-store/state/layout/viewzones/viewzone-selectors";
import { APOLLO_MIGRATED_CARDS } from "@ppb/tbd-store/state/layout/cards/Card.types";
import type { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";
import { Observe } from "../../hooks/useVisibilityObserver.types";

export type ContainerProps = {
  urn: string;
  typename: string;
  visibility?: Observe;
  moduleTitle?: string;
} & Pick<PartialItem, "theme">;

export type CardProps = {
  typename: string;
  isCardLoaded: boolean;
};

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getFindCardbyURNSelector = createFindCardbyURNSelector();

  // This has to remain here until we do the web version of this work
  // https://ppb.tpondemand.com/entity/1150858-web-tbd-shared-mapping-cardgroup-items
  // https://ppb.tpondemand.com/entity/1150857-web-tbd-shared-mapping-card-items
  const getFindCardgroupbyURNSelector = createFindCardGroupByURNSelector();
  const getViewZoneByURN = createViewZoneByURNSelector();

  return (state: ApplicationState, { urn, typename }: ContainerProps): StateProps => {
    const card = getFindCardbyURNSelector(state.layouts.cards, urn);

    // This has to remain here until we do the web version of this work
    // https://ppb.tpondemand.com/entity/1150858-web-tbd-shared-mapping-cardgroup-items
    // https://ppb.tpondemand.com/entity/1150857-web-tbd-shared-mapping-card-items
    const cardgroup = getFindCardgroupbyURNSelector(state.layouts.cardgroups, urn);
    const viewZone = getViewZoneByURN(state.layouts.viewzones, urn);

    const isMigrated = APOLLO_MIGRATED_CARDS.includes(typename);

    return {
      typename,
      isCardLoaded: !!card || !!cardgroup || !!viewZone || isMigrated,
    };
  };
};

export type DispatchProps = Record<string, never>;

export const mapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = () => ({});
