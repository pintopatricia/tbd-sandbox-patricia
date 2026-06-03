import { FunctionComponent } from "react";
import * as React from "react";
import { ComponentProps } from "../RootInlineBetslip/props";
import { WrappedComponentProps } from "./types";
import useInlineBetslip from "./useInlineBetslip";

export function withInlineBetslipAgnostic<T extends WrappedComponentProps>(
  WrappedComponent: FunctionComponent<T>,
  RootInlineBetslipComponent: React.FC<ComponentProps>,
): (props: T) => React.ReactElement<T> {
  return function InlineBetslipAgnostic(props: T) {
    const renderBetslip = useInlineBetslip(RootInlineBetslipComponent);

    return <WrappedComponent {...props} renderBetslip={renderBetslip} />;
  };
}
