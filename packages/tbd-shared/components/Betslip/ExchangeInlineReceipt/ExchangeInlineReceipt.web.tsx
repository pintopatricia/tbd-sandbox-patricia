import { FunctionComponent, useCallback } from "react";

import { ExchangeInlineReceiptPanel } from "./snowflakes/ExchangeInlineReceiptPanel/ExchangeInlineReceiptPanel.web";

import { ComponentProps } from "./props";

export const ExchangeInlineReceipt: FunctionComponent<ComponentProps> = ({
  receipt,
  runner,
  order,
  dispatchPanelEdit,
  dispatchPanelDone,
  dispatchPanelCancel,
}) => {
  const handleExchangeReceiptPanelCancel = useCallback(() => {
    if (order && runner) {
      dispatchPanelCancel(order.betId, runner);
    }
  }, [order, runner, dispatchPanelCancel]);

  const onEditCallback = useCallback(() => {
    if (order && runner) {
      dispatchPanelEdit(order.betId, runner);
    }
  }, [order, runner, dispatchPanelEdit]);

  const canCancel = !!order && receipt?.unmatched;
  const canEdit = canCancel && !receipt?.unmatched?.hasFreeBets;

  if (!receipt) {
    return null;
  }

  return (
    <ExchangeInlineReceiptPanel
      {...receipt}
      onDone={dispatchPanelDone}
      onCancel={canCancel ? handleExchangeReceiptPanelCancel : null}
      onEdit={canEdit ? onEditCallback : null}
    />
  );
};
