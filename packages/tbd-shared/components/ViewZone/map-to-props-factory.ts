import { MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";
import { createViewZoneByURNSelector } from "@ppb/tbd-store/state/layout/viewzones/viewzone-selectors";

export type ContainerProps = {
  urn: string;
  visible?: boolean;
};

export type CardProps = {
  title: string;
  items: PartialItem[];
};

export type StateProps = CardProps | Record<string, never>;

export type DispatchProps = Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () =>
  function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    const getViewZoneByURN = createViewZoneByURNSelector();
    const viewZone = getViewZoneByURN(state.layouts.viewzones, urn);

    if (!viewZone) {
      return {};
    }

    return {
      title: viewZone.title,
      items: viewZone.items,
    };
  };

export const mapDispatchToProps: DispatchProps = {};
