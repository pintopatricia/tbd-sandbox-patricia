import { RenderInlineBetslipFactory } from "../Betslip/withInlineBetslip/types";
import { DispatchProps, CardProps, ContainerProps } from "./map-to-props-factory";

export type ComponentProps = {
  renderBetslip?: RenderInlineBetslipFactory;
} & CardProps &
  DispatchProps &
  ContainerProps;
