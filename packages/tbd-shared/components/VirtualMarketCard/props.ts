import { CardProps, ContainerProps, DispatchProps, VirtualMarketCardRunner } from "./map-to-props-factory";

export type BaseVirtualRunnerProps = VirtualMarketCardRunner & {
  cardUrn: string;
  onButtonAction: DispatchProps["dispatchBetPlacement"];
  dispatchInactiveBetButtonClickAction: DispatchProps["dispatchInactiveBetButtonClickAction"];
  animated: boolean;
};

export type ComponentProps = CardProps & DispatchProps & ContainerProps;
