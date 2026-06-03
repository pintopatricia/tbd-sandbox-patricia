import { FunctionComponent, useContext, useCallback, useEffect, useMemo, useRef } from "react";

import { Styled } from "@ppb/the-wall-web";
import { HEIGHTS, SPACINGS } from "@ppb/the-wall-common/base-theme-tokens/spacing";
import { useNativeTokens } from "@ppb/the-wall-common/native-for-web-tokens";

import { InlinePanelColorMap } from "../InlinePanel/InlinePanel.types";
import { NotificationKeys, useNotifications } from "../../../hooks/useNotifications";
import { getAuthData } from "../../../config/endpoints";
import { buildDepositRedirectPayload } from "../betslip-deposit-redirect-mapper";
import { withKeyboard } from "../Keyboard/withKeyboard.web";
import { KeyboardContext } from "../Keyboard/KeyboardContext";
import { JurisdictionalOperatorInfo } from "../JurisdictionalOperatorInfo/JurisdictionalOperatorInfo.web";
import { InlinePanel } from "../InlinePanel/InlinePanel.web";

import { ExchangeInlinePlacePanel } from "./snowflakes/ExchangeInlinePlacePanel/ExchangeInlinePlacePanel.web";
import { ComponentProps } from "./props";

import styles from "./ExchangeInlinePlace.web.module.css";

/**
 * The height of free bets label and checkbox.
 *
 * Free bets is loaded async on betslip, when available, it
 * changes the height of the betslip after the scroll. That's why we
 * need this extra height.
 *
 * This works fine at the first time, the following ones, which already
 * have free bets loaded, will have an unneccessary extra margin :/
 */
const FREE_BETS = HEIGHTS["freebets-toggle"];
/**
 * Difference between ExchangeInlinePlacePanel node and the full inline betslip
 * (padding, border, …)
 */
const BOTTOM_INLINE_BETSLIP_DIFF = 9;
const MARGIN = SPACINGS["spacing-1"]; // Looks better with this

const KeyboardExchangeInlinePlacePanel = withKeyboard(ExchangeInlinePlacePanel);

export const ExchangeInlinePlace: FunctionComponent<ComponentProps> = ({
  side,
  titlePrefix,
  title,
  profitLabel,
  profitValue,
  profitRawValue,
  quickStakes,
  size,
  price,
  runner,
  currencySymbol,
  prefersConfirm,
  betDelay,
  freeBetsLabel,
  hasFreeBets = false,
  isFreeBetsSelected = false,
  eligibleBonus,
  isPlacing,
  marketError,
  placeError,
  priceError,
  sizeError,
  isDepositRequired,
  placeBtnLabel,
  pricePlaceholder,
  sizePlaceholder,
  loadingLabel,
  isLoggedIn,
  isEditing,
  dispatchExchangeSizeInputChangeAction,
  dispatchExchangeSizeInputBlurAction,
  dispatchExchangeSizeNudgeUpAction,
  dispatchExchangeSizeNudgeDownAction,
  dispatchExchangePriceInputChangeAction,
  dispatchExchangePriceInputBlurAction,
  dispatchExchangePriceNudgeUpAction,
  dispatchExchangePriceNudgeDownAction,
  dispatchIncrementByQuickStakeAction,
  dispatchExchangeBonusChangeAction,
  dispatchExchangePlaceBetAction,
  dispatchExchangeSelectionRemoveAction,
  dispatchCloseAction,
  dispatchDepositRedirect,
  dispatchNavigate,
  dispatchLogin,
  dispatchLoginToPlaceBetAction,
}) => {
  const {
    focusedKeyboardControls: { focusedInputId },
    setFocusedKeyboardControls,
  } = useContext(KeyboardContext);
  const { BottomBarHeightSizing } = useNativeTokens(); // Don't let betslip stay under the bottom bar

  const scrollIntoViewOptions = useMemo(
    () => ({
      offset: FREE_BETS + BOTTOM_INLINE_BETSLIP_DIFF + MARGIN + BottomBarHeightSizing,
    }),
    [BottomBarHeightSizing],
  );

  const { addNotifications, clearNotifications, notifications } = useNotifications(
    marketError?.notification,
    placeError?.notification,
    runner,
  );

  const handleOnPriceBlur = useCallback(() => {
    if (priceError && runner && side) {
      dispatchExchangePriceInputBlurAction(runner, side, priceError.newPrice, size);
      addNotifications({ price: priceError.notification });
    }
  }, [priceError, runner, side, dispatchExchangePriceInputBlurAction, size, addNotifications]);

  const handleOnSizeBlur = useCallback(() => {
    if (sizeError && runner && side) {
      dispatchExchangeSizeInputBlurAction(runner, side, price, sizeError.newSize);
      addNotifications({ size: sizeError.notification });
    }
  }, [sizeError, runner, side, dispatchExchangeSizeInputBlurAction, price, addNotifications]);

  const handleOnSizeChange = useCallback(
    (newSize?: number) => {
      clearNotifications(NotificationKeys.Size);
      if (runner && side) {
        dispatchExchangeSizeInputChangeAction(runner, side, price, newSize);
      }
    },
    [clearNotifications, dispatchExchangeSizeInputChangeAction, runner, side, price],
  );

  const handleOnPriceChange = useCallback(
    (newPrice?: number) => {
      clearNotifications(NotificationKeys.Price);
      if (runner && side) {
        dispatchExchangePriceInputChangeAction(runner, side, newPrice, size);
      }
    },
    [clearNotifications, dispatchExchangePriceInputChangeAction, runner, side, size],
  );

  const onPriceNudgeUp = useCallback(() => {
    clearNotifications(NotificationKeys.Price);
    if (runner && side) {
      dispatchExchangePriceNudgeUpAction(runner, side);
    }
  }, [clearNotifications, runner, side, dispatchExchangePriceNudgeUpAction]);

  const onPriceNudgeDown = useCallback(() => {
    clearNotifications(NotificationKeys.Price);
    if (runner && side) {
      dispatchExchangePriceNudgeDownAction(runner, side);
    }
  }, [clearNotifications, runner, side, dispatchExchangePriceNudgeDownAction]);

  const onSizeNudgeUp = useCallback(() => {
    clearNotifications(NotificationKeys.Size);
    if (runner && side) {
      dispatchExchangeSizeNudgeUpAction(runner, side);
    }
  }, [clearNotifications, runner, side, dispatchExchangeSizeNudgeUpAction]);

  const onSizeNudgeDown = useCallback(() => {
    clearNotifications(NotificationKeys.Size);
    if (runner && side) {
      dispatchExchangeSizeNudgeDownAction(runner, side);
    }
  }, [clearNotifications, runner, side, dispatchExchangeSizeNudgeDownAction]);

  // Workaround to prevent the nudges from clearing the input value on focus, a refactor will be done in the US SLBY-698
  const inputMouseDownRef = useRef<boolean>(false);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const isNudgeButton = target.closest('[role="button"]') || target.closest("button");
    inputMouseDownRef.current = !isNudgeButton;
  }, []);

  const onPriceFocus = useCallback(() => {
    clearNotifications(NotificationKeys.Price);
    // Clear value only if focus came from input, not from nudge
    if (inputMouseDownRef.current) {
      handleOnPriceChange();
      inputMouseDownRef.current = false;
    }
  }, [clearNotifications, handleOnPriceChange]);

  const onSizeFocus = useCallback(() => {
    clearNotifications(NotificationKeys.Size);
    // Clear value only if focus came from input, not from nudge
    if (inputMouseDownRef.current) {
      handleOnSizeChange();
      inputMouseDownRef.current = false;
    }
  }, [clearNotifications, handleOnSizeChange]);

  const priceInputId = `${runner}-price`;
  const sizeInputId = `${runner}-size`;

  const handleQuickStakeTouch = useCallback(
    (quickStakeValue: number) => {
      clearNotifications();
      if (runner && side) {
        if (focusedInputId === sizeInputId) {
          const inputEl = document.getElementById(sizeInputId) as HTMLInputElement | null;
          const rawValue = inputEl?.value;
          if (rawValue != null && rawValue !== "") {
            const decoded = rawValue.replace(/,/g, "");
            const currentNumeric = Number(decoded.replace(/[^0-9.]/g, ""));
            if (!Number.isNaN(currentNumeric)) {
              dispatchExchangeSizeInputChangeAction(runner, side, price, currentNumeric + quickStakeValue);
              return;
            }
          }
        }
        dispatchIncrementByQuickStakeAction(runner, side, quickStakeValue, currencySymbol);
      }
    },
    [
      clearNotifications,
      runner,
      side,
      focusedInputId,
      sizeInputId,
      price,
      dispatchExchangeSizeInputChangeAction,
      dispatchIncrementByQuickStakeAction,
      currencySymbol,
    ],
  );

  const handleFreeBetsChange = useCallback(
    (isSelected: boolean) => {
      if (runner && eligibleBonus) {
        dispatchExchangeBonusChangeAction(isSelected, runner, eligibleBonus);
      }
    },
    [runner, eligibleBonus, dispatchExchangeBonusChangeAction],
  );

  const onPlaceBetCallback = useCallback(() => {
    if (!isLoggedIn) {
      if (side) {
        dispatchLoginToPlaceBetAction(side);
      }

      const { SSO_URL } = getAuthData() || {};
      const ssoWithRedirectUrl = `${SSO_URL}&url=${encodeURIComponent(window.location.href)}`;

      dispatchLogin(ssoWithRedirectUrl);

      return;
    }

    if (isDepositRequired) {
      const { viewUrn, viewUrl } = buildDepositRedirectPayload(window.location.href);

      dispatchDepositRedirect();
      dispatchNavigate(viewUrn, viewUrl);

      return;
    }

    if (runner) {
      dispatchExchangePlaceBetAction(runner, !!prefersConfirm);
    }
  }, [
    isLoggedIn,
    isDepositRequired,
    runner,
    side,
    dispatchLogin,
    dispatchLoginToPlaceBetAction,
    dispatchDepositRedirect,
    dispatchNavigate,
    dispatchExchangePlaceBetAction,
    prefersConfirm,
  ]);

  const onInlinePanelClose = useCallback(() => {
    if (runner && side) {
      dispatchExchangeSelectionRemoveAction(runner, side);
    }

    dispatchCloseAction();
  }, [dispatchCloseAction, runner, side, dispatchExchangeSelectionRemoveAction]);

  useEffect(() => {
    if (!isEditing) {
      setFocusedKeyboardControls((prev) => ({
        ...prev,
        focusedInputId: sizeInputId,
      }));
    }
  }, [setFocusedKeyboardControls, sizeInputId, isEditing]);

  if (!side || !quickStakes) {
    return null;
  }

  const isPlaceBtnDisabled = !price || !size || !!priceError;
  const disabled = !!isPlacing || !!marketError;

  const placeButtonLabel = <Styled translation={placeBtnLabel} styles={{ depositTo: "typography-h220" }} />;

  return (
    <InlinePanel
      titlePrefix={titlePrefix}
      title={title}
      color={InlinePanelColorMap[side]}
      onAction={onInlinePanelClose}
    >
      <div className={styles.container}>
        <KeyboardExchangeInlinePlacePanel
          sizeInputId={sizeInputId}
          priceInputId={priceInputId}
          disabled={disabled}
          currencySymbol={currencySymbol || ""}
          hasFreeBets={hasFreeBets}
          isFreeBetsSelected={isFreeBetsSelected}
          isPlaceButtonDisabled={isPlaceBtnDisabled}
          quickStakes={quickStakes}
          betDelay={betDelay}
          freeBetsLabel={freeBetsLabel}
          price={price}
          profitLabel={profitLabel}
          profitValue={profitValue}
          profitRawValue={profitRawValue}
          size={size}
          hasPlaceError={!!placeError}
          notifications={notifications}
          loadingLabel={loadingLabel}
          placeBtnLabel={placeButtonLabel}
          pricePlaceholder={pricePlaceholder}
          sizePlaceholder={sizePlaceholder}
          focusedInputId={focusedInputId}
          onFreeBetsChange={handleFreeBetsChange}
          onPriceNudgeDown={onPriceNudgeDown}
          onPriceNudgeUp={onPriceNudgeUp}
          onSizeNudgeDown={onSizeNudgeDown}
          onSizeNudgeUp={onSizeNudgeUp}
          onPlaceClick={onPlaceBetCallback}
          onPriceChange={handleOnPriceChange}
          onPriceBlur={handleOnPriceBlur}
          onPriceFocus={onPriceFocus}
          onQuickStakeTouch={handleQuickStakeTouch}
          onSizeChange={handleOnSizeChange}
          onSizeBlur={handleOnSizeBlur}
          onSizeFocus={onSizeFocus}
          scrollIntoViewOptions={scrollIntoViewOptions}
          onPriceMouseDown={handleMouseDown}
          onSizeMouseDown={handleMouseDown}
        />
        <JurisdictionalOperatorInfo />
      </div>
    </InlinePanel>
  );
};
