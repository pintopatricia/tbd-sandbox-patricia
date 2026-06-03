import { RenderInlineBetslipFactory } from "../Betslip/withInlineBetslip/types";
import { CardProps, DispatchProps, ContainerProps } from "./map-to-props-factory";

export type ComponentProps = {
  renderBetslip?: RenderInlineBetslipFactory;
} & CardProps &
  DispatchProps &
  ContainerProps;
