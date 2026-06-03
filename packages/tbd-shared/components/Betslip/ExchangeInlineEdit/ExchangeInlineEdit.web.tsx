import { FunctionComponent, useContext, useCallback, useMemo, useRef } from "react";

import { HEIGHTS, SPACINGS } from "@ppb/the-wall-common/base-theme-tokens/spacing";
import { useNativeTokens } from "@ppb/the-wall-common/native-for-web-tokens";
import { Styled } from "@ppb/the-wall-web";
import { ExchangePersistenceType } from "@ppb/tbd-store/state";

import { NotificationKeys, useNotifications } from "../../../hooks/useNotifications";
import { useWindowScrollIntoView } from "../../../hooks/useScrollIntoView.web";
import { buildDepositRedirectPayload } from "../betslip-deposit-redirect-mapper";
import { withKeyboard } from "../Keyboard/withKeyboard.web";
import { KeyboardContext } from "../Keyboard/KeyboardContext";
import { JurisdictionalOperatorInfo } from "../JurisdictionalOperatorInfo/JurisdictionalOperatorInfo.web";
import { ExchangeInlineEditPanel } from "./snowflakes/ExchangeInlineEditPanel/ExchangeInlineEditPanel.web";
import { ComponentProps } from "./props";
import { InlinePanelColorMap } from "../InlinePanel/InlinePanel.types";
import { InlinePanel } from "../InlinePanel/InlinePanel.web";

import styles from "./ExchangeInlineEdit.web.modules.css";

const INLINE_KEYBOARD = HEIGHTS["inline-keyboard"];
const MARGIN = SPACINGS["spacing-2"]; // Looks better with this

const KeyboardExchangeInlineEditPanel = withKeyboard(ExchangeInlineEditPanel);

export const ExchangeInlineEdit: FunctionComponent<ComponentProps> = ({
  title,
  titlePrefix,
  profitLabel,
  profitValue,
  profitRawValue,
  market,
  runner,
  side,
  size,
  price,
  priceError,
  sizeError,
  placeError,
  marketError,
  currencySymbol,
  betId,
  persistenceListTypes,
  persistenceListSelectedKey,
  isPriceDisabled,
  isSizeDisabled,
  isUpdateButtonDisabled,
  isPersistenceTypeMenuExpanded,
  betDelay,
  labels,
  placeLabel,
  loadingLabel,
  isDepositRequired,
  dispatchUnmatchedCancel,
  dispatchUnmatchedUpdate,
  dispatchUnmatchedDone,
  dispatchUnmatchedPersistenceItemClick,
  dispatchUnmatchedPersistenceListClick,
  dispatchEditPriceInputChange,
  dispatchEditPriceInputBlur,
  dispatchEditSizeInputChange,
  dispatchEditSizeInputBlur,
  dispatchEditPriceNudgeUp,
  dispatchEditPriceNudgeDown,
  dispatchEditSizeNudgeUp,
  dispatchEditSizeNudgeDown,
  dispatchDepositRedirect,
  dispatchNavigate,
}) => {
  const priceInputId = `${runner}-price`;
  const sizeInputId = `${runner}-size`;

  const { BottomBarHeightSizing } = useNativeTokens(); // Don't let betslip stay under the bottom bar
  const {
    focusedKeyboardControls: { focusedInputId },
  } = useContext(KeyboardContext);
  const scrollIntoView = useWindowScrollIntoView({ offset: INLINE_KEYBOARD + MARGIN + BottomBarHeightSizing });

  const { addNotifications, clearNotifications, notifications } = useNotifications(
    marketError?.notification,
    placeError?.notification,
    runner,
  );
  const noop = useCallback(() => {}, []);
  const quickStakes = useMemo(() => [], []);
  const handleExchangeEditPanelCancel = useCallback(
    () => betId && runner && dispatchUnmatchedCancel([betId], runner),
    [betId, dispatchUnmatchedCancel, runner],
  );

  const handleExchangeEditPanelUpdate = useCallback(() => {
    if (isDepositRequired) {
      const { viewUrn, viewUrl } = buildDepositRedirectPayload(window.location.href);

      dispatchDepositRedirect();
      dispatchNavigate(viewUrn, viewUrl);

      return;
    }

    if (market && runner && betId) {
      dispatchUnmatchedUpdate(betId, market, runner, window.location.href);
    }
  }, [isDepositRequired, market, runner, betId, dispatchDepositRedirect, dispatchNavigate, dispatchUnmatchedUpdate]);

  const handleExchangeEditPanelPersistenceItemClick = useCallback(
    (persistenceType: string) => {
      if (betId) {
        dispatchUnmatchedPersistenceItemClick(betId, persistenceType as ExchangePersistenceType);
      }
    },
    [betId, dispatchUnmatchedPersistenceItemClick],
  );

  const handleExchangeEditPanelPersistenceListToggle = useCallback(() => {
    clearNotifications(NotificationKeys.Price, NotificationKeys.Size);
    if (betId) {
      dispatchUnmatchedPersistenceListClick(betId, !isPersistenceTypeMenuExpanded);
    }
  }, [clearNotifications, betId, dispatchUnmatchedPersistenceListClick, isPersistenceTypeMenuExpanded]);

  const handleEditOnPriceChange = useCallback(
    (newPrice?: number) => {
      clearNotifications(NotificationKeys.Price);
      if (runner && side && betId) {
        dispatchEditPriceInputChange(runner, betId, side, newPrice, size);
      }
    },
    [clearNotifications, dispatchEditPriceInputChange, runner, side, betId, size],
  );

  const handleOnPriceBlur = useCallback(() => {
    if (priceError && runner && side && betId) {
      dispatchEditPriceInputBlur(runner, betId, side, priceError.newPrice, size);
      addNotifications({ price: priceError.notification });
    }
  }, [dispatchEditPriceInputBlur, addNotifications, priceError, runner, side, betId, size]);

  const handleEditOnSizeChange = useCallback(
    (newSize?: number) => {
      clearNotifications(NotificationKeys.Size);
      if (runner && side && betId) {
        dispatchEditSizeInputChange(runner, betId, side, newSize, price);
      }
    },
    [clearNotifications, dispatchEditSizeInputChange, runner, side, betId, price],
  );

  const handleOnSizeBlur = useCallback(() => {
    if (sizeError && runner && side && betId) {
      dispatchEditSizeInputBlur(runner, betId, side, price, sizeError.newSize);
      addNotifications({ size: sizeError.notification });
    }
  }, [dispatchEditSizeInputBlur, addNotifications, sizeError, runner, side, betId, price]);

  const onPriceNudgeUp = useCallback(() => {
    clearNotifications(NotificationKeys.Price);
    if (runner && betId && side) {
      dispatchEditPriceNudgeUp(runner, betId, side);
    }
  }, [clearNotifications, runner, betId, side, dispatchEditPriceNudgeUp]);

  const onPriceNudgeDown = useCallback(() => {
    clearNotifications(NotificationKeys.Price);
    if (runner && betId && side) {
      dispatchEditPriceNudgeDown(runner, betId, side);
    }
  }, [clearNotifications, runner, betId, side, dispatchEditPriceNudgeDown]);

  const onSizeNudgeUp = useCallback(() => {
    clearNotifications(NotificationKeys.Size);
    if (runner && betId) {
      dispatchEditSizeNudgeUp(runner, betId);
    }
  }, [clearNotifications, runner, betId, dispatchEditSizeNudgeUp]);

  const onSizeNudgeDown = useCallback(() => {
    clearNotifications(NotificationKeys.Size);
    if (runner && betId) {
      dispatchEditSizeNudgeDown(runner, betId);
    }
  }, [clearNotifications, runner, betId, dispatchEditSizeNudgeDown]);

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
      handleEditOnPriceChange();
      inputMouseDownRef.current = false;
    }
  }, [clearNotifications, handleEditOnPriceChange]);

  const onSizeFocus = useCallback(() => {
    clearNotifications(NotificationKeys.Size);
    // Clear value only if focus came from input, not from nudge
    if (inputMouseDownRef.current) {
      handleEditOnSizeChange();
      inputMouseDownRef.current = false;
    }
  }, [clearNotifications, handleEditOnSizeChange]);

  if (
    !title ||
    !side ||
    !currencySymbol ||
    isPersistenceTypeMenuExpanded === undefined ||
    !persistenceListSelectedKey
  ) {
    return null;
  }

  const placeButtonLabel = <Styled translation={placeLabel} styles={{ depositTo: "typography-h220" }} />;

  return (
    <div ref={scrollIntoView}>
      <InlinePanel
        title={title}
        titlePrefix={titlePrefix}
        color={InlinePanelColorMap[side]}
        onAction={dispatchUnmatchedDone}
      >
        <div className={styles.container}>
          <KeyboardExchangeInlineEditPanel
            sizeInputId={sizeInputId}
            priceInputId={priceInputId}
            price={price}
            size={size}
            profitLabel={profitLabel}
            profitValue={profitValue}
            profitRawValue={profitRawValue}
            labels={labels}
            placeLabel={placeButtonLabel}
            loadingLabel={loadingLabel}
            isPriceDisabled={isPriceDisabled}
            isSizeDisabled={isSizeDisabled}
            isUpdateDisabled={isUpdateButtonDisabled}
            currencySymbol={currencySymbol}
            isPersistenceMenuOpen={isPersistenceTypeMenuExpanded}
            persistenceOptions={persistenceListTypes}
            persistenceSelectedId={persistenceListSelectedKey}
            betDelay={betDelay}
            quickStakes={quickStakes}
            hasPlaceError={!!placeError?.notification}
            notifications={notifications}
            focusedInputId={focusedInputId}
            onPriceNudgeDown={onPriceNudgeDown}
            onPriceNudgeUp={onPriceNudgeUp}
            onSizeNudgeDown={onSizeNudgeDown}
            onSizeNudgeUp={onSizeNudgeUp}
            onPersistenceChange={handleExchangeEditPanelPersistenceItemClick}
            onPersistenceToggle={handleExchangeEditPanelPersistenceListToggle}
            onPriceChange={handleEditOnPriceChange}
            onPriceBlur={handleOnPriceBlur}
            onPriceFocus={onPriceFocus}
            onSizeChange={handleEditOnSizeChange}
            onSizeBlur={handleOnSizeBlur}
            onSizeFocus={onSizeFocus}
            onCancel={handleExchangeEditPanelCancel}
            onUpdate={handleExchangeEditPanelUpdate}
            onQuickStakeAdd={noop}
            onPriceMouseDown={handleMouseDown}
            onSizeMouseDown={handleMouseDown}
          />
          <JurisdictionalOperatorInfo />
        </div>
      </InlinePanel>
    </div>
  );
};
