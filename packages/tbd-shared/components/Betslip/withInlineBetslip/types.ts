import type { JSX } from "react";
export type RenderInlineBetslipFactory = (urn: string) => JSX.Element | null;
export type RenderInlineBetslipFn<T> = (RootInlineBetslipComponent: React.FC<T>, urn: string) => JSX.Element | null;

export type WrappedComponentProps = {
  renderBetslip?: RenderInlineBetslipFactory;
};
