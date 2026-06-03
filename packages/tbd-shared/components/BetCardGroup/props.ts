import { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { StateProps, DispatchProps, ContainerProps } from "./map-to-props-factory";

export type BetCardGroupProps = {
  items: PartialItem[];
  viewLink?: ViewLink;
};

export type ComponentProps = StateProps & DispatchProps & ContainerProps;
