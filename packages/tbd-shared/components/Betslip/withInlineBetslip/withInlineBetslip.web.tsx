import { FunctionComponent } from "react";
import * as React from "react";
import { WrappedComponentProps } from "./types";
import { withInlineBetslipAgnostic } from "./withInlineBetslipAgnostic";

const RootInlineBetslip = React.lazy(
  () =>
    import(/* webpackChunkName: "inline-betslip", webpackPrefetch:true */ "../RootInlineBetslip/RootInlineBetslip.web"),
);

export function withInlineBetslip<T extends WrappedComponentProps>(
  WrappedComponent: FunctionComponent<T>,
): (props: T) => React.ReactElement<T> {
  return withInlineBetslipAgnostic(WrappedComponent, RootInlineBetslip);
}
