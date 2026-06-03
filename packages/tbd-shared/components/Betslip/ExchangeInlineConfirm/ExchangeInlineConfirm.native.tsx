import { FunctionComponent, useCallback } from "react";

import { Styled } from "@ppb/the-wall-native";
import { navigateDeposit } from "@ppb/tbd-router";
import { typography } from "@ppb/the-wall-common/base-theme";

import { getEndpoint } from "../../../config/endpoints";

import { ExchangeInlineConfirmPanel } from "./snowflakes/ExchangeInlineConfirmPanel/ExchangeInlineConfirmPanel.native";
import { ComponentProps } from "./props";

const depositToStyles = { depositTo: typography["typography-h220"] };

export const ExchangeInlineConfirm: FunctionComponent<ComponentProps> = ({
  labels,
  urn,
  title,
  titlePrefix,
  freeBets,
  side,
  price,
  size,
  currencySymbol,
  profitLabel,
  profitValue,
  profitRawValue,
  confirm,
  loading,
  betDelay,
  error,
  isFreeBetsSelected,
  isDepositRequired,
  dispatchConfirmBet,
  dispatchClose,
  dispatchEdit,
  dispatchDepositRedirect,
}) => {
  const handleCancel = useCallback(() => dispatchClose(), [dispatchClose]);
  const handleEdit = useCallback(() => dispatchEdit(), [dispatchEdit]);
  const handleConfirm = useCallback(() => {
    if (isDepositRequired) {
      dispatchDepositRedirect();
      navigateDeposit(getEndpoint("DEPOSIT"));

      return;
    }

    if (urn) {
      dispatchConfirmBet(urn);
    }
  }, [dispatchConfirmBet, dispatchDepositRedirect, isDepositRequired, urn]);

  if (!title || !side || !price || !size || !currencySymbol) {
    return null;
  }

  const confirmLabel = <Styled translation={confirm} styles={depositToStyles} />;

  return (
    <ExchangeInlineConfirmPanel
      labels={labels}
      title={title}
      titlePrefix={titlePrefix}
      freeBets={freeBets}
      side={side}
      price={price}
      size={size}
      currencySymbol={currencySymbol}
      profitLabel={profitLabel}
      profitValue={profitValue}
      profitRawValue={profitRawValue}
      confirm={confirmLabel}
      loading={loading}
      betDelay={betDelay}
      error={error}
      isFreeBetsSelected={isFreeBetsSelected}
      onCancel={handleCancel}
      onEdit={handleEdit}
      onConfirm={handleConfirm}
    />
  );
};
