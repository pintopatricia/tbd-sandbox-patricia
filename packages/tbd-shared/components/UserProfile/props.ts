import { DispatchProps, CardProps, ContainerProps } from "./map-to-props-factory";

export type Bets = {
  totalBets: number;
  currentBets: number;
};

export type ComponentProps = CardProps & DispatchProps & ContainerProps;

export type OwnProps = Record<string, never>;
