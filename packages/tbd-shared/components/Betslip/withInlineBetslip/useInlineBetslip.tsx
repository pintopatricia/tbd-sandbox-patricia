import { Suspense, useMemo, useCallback } from "react";
import * as React from "react";
import { useSelector } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import URN from "@ppb/tbd-store/state/layout/URN";
import { getBetslipExchangeContext } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { createExcRunnerPotentialBetsByRunnerURNSelector } from "@ppb/tbd-store/state/entities/entities-selectors";
import { ComponentProps } from "../RootInlineBetslip/props";
import { RenderInlineBetslipFn, RenderInlineBetslipFactory } from "./types";

const ConnectedInlineBetslip = React.lazy(
  () => import(/* webpackChunkName: "inline-betslip", webpackPrefetch:true */ "../RootInlineBetslip"),
);

const useHasPotentialBet = (urn: string): boolean => {
  const getExcRunnerPotentialBetsByRunnerURN = useMemo(() => createExcRunnerPotentialBetsByRunnerURNSelector(), []);

  return useSelector<ApplicationState, boolean>((state) => {
    const [potentialBet] = getExcRunnerPotentialBetsByRunnerURN(state, urn) || [];
    const exchangeContext = getBetslipExchangeContext(state);
    return potentialBet && urn === exchangeContext?.runner;
  });
};

const useHasReport = (urn: string): boolean =>
  useSelector<ApplicationState, boolean>((appState) => {
    const exchangeContext = getBetslipExchangeContext(appState);

    return exchangeContext?.runner === urn && appState.betslip?.exchangeReport?.runner === urn;
  });

const useHasOrderEdit = (urn: string): boolean =>
  useSelector<ApplicationState, boolean>((appState) => {
    const exchangeContext = getBetslipExchangeContext(appState);

    return exchangeContext?.runner === urn;
  });

const RenderFn: RenderInlineBetslipFn<ComponentProps> = (RootInlineBetslipComponent, urn) => {
  const hasPotentialBet = useHasPotentialBet(urn);
  const hasReport = useHasReport(urn);
  const hasEditableOrder = useHasOrderEdit(urn);
  const RootInlineBetslip = useMemo(
    () => (
      <Suspense fallback={<></>}>
        <ConnectedInlineBetslip component={RootInlineBetslipComponent} />
      </Suspense>
    ),
    [RootInlineBetslipComponent],
  );

  const hasRunnerContext = hasPotentialBet || hasReport || hasEditableOrder;

  if (hasRunnerContext) {
    return RootInlineBetslip;
  }

  return null;
};

export default function useInlineBetslip(
  RootInlineBetslipComponent: React.FC<ComponentProps>,
): RenderInlineBetslipFactory {
  const RenderFactory = useCallback(
    (urn: URN) => RenderFn(RootInlineBetslipComponent, urn),
    [RootInlineBetslipComponent],
  );

  return RenderFactory;
}
