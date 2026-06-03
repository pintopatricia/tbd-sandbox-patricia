import { FunctionComponent, useCallback } from "react";
import { Styled } from "@ppb/the-wall-web";
import { buildDepositRedirectPayload } from "../betslip-deposit-redirect-mapper";
import { ComponentProps } from "./props";
import { ExchangeInlineConfirmPanel } from "./snowflakes/ExchangeInlineConfirmPanel/ExchangeInlineConfirmPanel.web";

const depositToStyle = { depositTo: "typography-h220" };

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
  isDepositRequired,
  isFreeBetsSelected,
  dispatchConfirmBet,
  dispatchClose,
  dispatchEdit,
  dispatchDepositRedirect,
  dispatchNavigate,
}) => {
  const handleCancel = useCallback(() => dispatchClose(), [dispatchClose]);
  const handleEdit = useCallback(() => dispatchEdit(), [dispatchEdit]);
  const handleConfirm = useCallback(() => {
    if (isDepositRequired) {
      const { viewUrn, viewUrl } = buildDepositRedirectPayload(window.location.href);

      dispatchDepositRedirect();
      dispatchNavigate(viewUrn, viewUrl);

      return;
    }

    if (urn) {
      dispatchConfirmBet(urn);
    }
  }, [dispatchConfirmBet, dispatchDepositRedirect, dispatchNavigate, isDepositRequired, urn]);

  if (!title || !side || !price || !size || !currencySymbol) {
    return null;
  }

  const confirmLabel = <Styled translation={confirm} styles={depositToStyle} />;

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
      confirm={confirmLabel}
      loading={loading}
      profitLabel={profitLabel}
      profitValue={profitValue}
      profitRawValue={profitRawValue}
      betDelay={betDelay}
      error={error}
      isFreeBetsSelected={isFreeBetsSelected}
      onCancel={handleCancel}
      onEdit={handleEdit}
      onConfirm={handleConfirm}
    />
  );
};
