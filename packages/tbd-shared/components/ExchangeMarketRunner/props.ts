import { RenderInlineBetslipFactory } from "../Betslip/withInlineBetslip/types";
import { CardProps, ContainerProps, DispatchProps } from "./map-to-props-factory";

export type ComponentProps = {
  renderBetslip?: RenderInlineBetslipFactory;
  onMarketGraphButtonTap: () => void;
} & CardProps &
  DispatchProps &
  ContainerProps;
