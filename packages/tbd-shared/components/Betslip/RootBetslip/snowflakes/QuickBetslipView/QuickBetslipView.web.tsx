import { FunctionComponent, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from "react";
import classnames from "classnames";

import { AlertType, CounterColor, KeyboardSeparator, LinkItem } from "@ppb/the-wall-common/types";
import { SystemIconName } from "@ppb/the-wall-icons";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import {
  Alert,
  BetsSummary,
  CurrencyNumberInputField,
  Link,
  PrimaryButton,
  QuickStakes,
  Styled,
} from "@ppb/the-wall-web";

import { Minimized } from "../Minimized/Minimized.web";
import { ComponentProps } from "./props";
import { KeyboardContext } from "../../../Keyboard/KeyboardContext";
import { FooterCustomKeyboard } from "../../../Keyboard/FooterCustomKeyboard.web";
import styles from "./QuickBetslipView.module.css";
import { useScrollHandler } from "./useScrollHandler.web";
import { buildDepositRedirectPayload } from "../../../betslip-deposit-redirect-mapper";
import { Notifier } from "../../../Notifier/Notifier.web";
import ConnectedNotifier from "../../../Notifier";

const titleStyle = {
  context: styles.titleOpaquePart,
  returns: styles.titleOpaquePart,
};

const subtitleStyle = {
  name: styles.subtitleBoldPart,
};

const useQuickBetslipViewStates = (openBetslip: () => void, removeFocus: () => void) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [shouldRenderContent, setShouldRenderContent] = useState(true);

  const onScrollUp = useCallback(() => {
    if (!isExpanded) {
      setShouldRenderContent(true);
      setIsExpanded(true);
    }
  }, [isExpanded, setIsExpanded, setShouldRenderContent]);

  const onScrollDown = useCallback(() => {
    if (isExpanded) {
      setShouldRenderContent(true);
      setIsExpanded(false);
      removeFocus();
    }
  }, [isExpanded, setIsExpanded, setShouldRenderContent, removeFocus]);

  useScrollHandler(onScrollUp, onScrollDown);

  useEffect(() => {
    if (!isExpanded) {
      const timer = setTimeout(() => {
        setShouldRenderContent(false);
      }, 300);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isExpanded]);

  const onTitleClick = useCallback(() => {
    if (isExpanded) {
      openBetslip();
    } else {
      setShouldRenderContent(true);
      setIsExpanded(true);
    }
  }, [isExpanded, openBetslip]);

  const expand = useCallback(() => setIsExpanded(true), []);

  return {
    isExpanded,
    expand,
    shouldRenderContent,
    onTitleClick,
  };
};

export const QuickBetslipView: FunctionComponent<ComponentProps> = ({
  header,
  i18n,
  combinationId,
  balanceAfterBet,
  placeButtonLabel,
  placeBtnLoadingLabel,
  hasCTALoading,
  totalReturns,
  currencySymbol,
  stake,
  isStakeValid,
  isLastStakeValid,
  quickStakes,
  termsUrl,
  isPlacing,
  hasPlaceError,
  isPlaceDisabled,
  isDepositRequired,
  requiredDepositValue,
  lastSuccessfulStake,

  // Accept Odds Movement
  showAcceptOddsMovementAlert,
  isOddsMovementOn,
  oddsMovementLabels,

  onClick: openBetslip,
  dispatchStakeChange,
  dispatchIncrementPress,
  dispatchPlacement,
  dispatchDepositRedirect,
  dispatchNavigate,
  dispatchOddsMovementChange,
}) => {
  const keyboardContext = useContext(KeyboardContext);
  const {
    focusedKeyboardControls: { focusedInputId },
    setFocusedKeyboardControls,
  } = keyboardContext;

  const inputRef = useRef(null);
  const hasStakeInit = useRef(false);
  const uniqueInputId = useId();
  const oddsMovementSwitchId = useId();

  const removeFocus = useCallback(() => {
    setFocusedKeyboardControls((prev) => ({
      ...prev,
      focusedInputId: null,
    }));
  }, [setFocusedKeyboardControls]);

  const { isExpanded, expand, shouldRenderContent, onTitleClick } = useQuickBetslipViewStates(openBetslip, removeFocus);
  const isFocused = isExpanded && uniqueInputId === focusedInputId;

  useEffect(() => {
    // Auto-populate on first open
    // On unmount the ref gets reset to false, restarting the cycle
    // Further adds produce no stake change dispatches
    if (!hasStakeInit.current && stake === undefined && lastSuccessfulStake !== undefined && isLastStakeValid) {
      dispatchStakeChange({ id: combinationId, newValue: lastSuccessfulStake });
      hasStakeInit.current = true;
    }
  }, [isLastStakeValid]);

  const onStakeChangeGuard = useCallback(
    (newValue?: number) => {
      dispatchStakeChange({ id: combinationId, newValue });
    },
    [dispatchStakeChange, combinationId],
  );

  const onStakeFocusGuard = useCallback(() => {
    if (!isFocused) {
      dispatchStakeChange({ id: combinationId, newValue: undefined });

      expand();

      setFocusedKeyboardControls({
        focusedCombinationId: combinationId,
        focusedInputId: uniqueInputId,
        focusedInputRef: inputRef,
        focusedTargetRef: null,
      });
    }
  }, [dispatchStakeChange, combinationId, isFocused, expand, setFocusedKeyboardControls, uniqueInputId]);

  const onStakeBlurGuard = useCallback(() => {
    setFocusedKeyboardControls((prev) => ({
      ...prev,
      focusedInputId: null,
    }));
  }, [setFocusedKeyboardControls]);

  const onPlace = useCallback(() => {
    if (isDepositRequired) {
      const { viewUrn, viewUrl } = buildDepositRedirectPayload(window.location.href, requiredDepositValue);

      dispatchDepositRedirect();
      dispatchNavigate(viewUrn, viewUrl);

      return;
    }
    dispatchPlacement();
  }, [dispatchDepositRedirect, dispatchNavigate, dispatchPlacement, isDepositRequired, requiredDepositValue]);

  const handleOddsMovementChange = useCallback(
    (isChecked: boolean) => {
      dispatchOddsMovementChange(isChecked);
    },
    [dispatchOddsMovementChange],
  );

  const onQuickStakePress = useCallback(
    (stake: number) => {
      dispatchIncrementPress(combinationId, stake, currencySymbol);
    },
    [dispatchIncrementPress, combinationId, currencySymbol],
  );

  const terms = useMemo(() => {
    if (!termsUrl) {
      return null;
    }

    const item: LinkItem = { viewLink: { viewUrl: termsUrl }, target: "_blank" };

    return (
      <div className={styles.termsContainer}>
        {i18n.termsLabel}{" "}
        <Link onClick={() => {}} item={item}>
          {i18n.termsLinkLabel}
        </Link>
      </div>
    );
  }, [termsUrl, i18n]);

  const footerPrefix = useMemo(() => {
    return (
      <div className={styles.quickStakesContainer}>
        <QuickStakes quickStakes={quickStakes} onTouch={onQuickStakePress} isDisabled={false} />
      </div>
    );
  }, [quickStakes, onQuickStakePress]);

  const isWrapperView = window.__TBD_CLIENT_CONTEXT__?.webWrappedExperience;

  return (
    <div className={classnames(styles.sheetWrapper, { [styles.webWrappedVersion]: isWrapperView })}>
      <div className={styles.sheetContainer}>
        <button className={styles.sheetHeader} onClick={onTitleClick}>
          <div className={styles.headerContainer}>
            <div className={styles.headerTitle}>
              <Minimized counter={header.counter} color={CounterColor.Teal}>
                <span className={styles.titleText}>
                  <Styled translation={header.title} styles={titleStyle} />
                </span>
              </Minimized>
            </div>
            <div className={styles.actionIcon}>
              <GenericIcon name={SystemIconName.CHEVRON_UP} color={"var(--expandable-icon-colour)"} />
            </div>
          </div>
          <div className={classnames(styles.headerSubtitle, { [styles.headerSubtitleCollapsed]: !isExpanded })}>
            <div
              className={classnames(styles.headerSubtitleInfo, {
                [styles.headerSubtitleInfoPriceBoostMultiple]: header.isPriceBoostMultiple,
              })}
            >
              <Styled translation={header.subtitle} styles={subtitleStyle} />
            </div>
            {header.moreLabel && <span className={styles.headerSubtitleMore}>{header.moreLabel}</span>}
          </div>
        </button>

        <div
          className={classnames(styles.sheetContent, {
            [styles.sheetContentExpanded]: isExpanded || isFocused,
            [styles.sheetContentCollapsed]: !isExpanded && !isFocused,
          })}
        >
          {shouldRenderContent && <ConnectedNotifier component={Notifier} />}
          {shouldRenderContent && showAcceptOddsMovementAlert && (
            <div className={styles.oddsMovementAlertContainer}>
              <Alert
                message={oddsMovementLabels.message}
                detail={oddsMovementLabels.detailMessage}
                type={AlertType.Info}
                showCloseIcon={false}
                action={{
                  checkboxId: oddsMovementSwitchId,
                  onChange: handleOddsMovementChange,
                  isChecked: isOddsMovementOn,
                  label: oddsMovementLabels.message,
                }}
              />
            </div>
          )}
          {shouldRenderContent && isFocused && (
            <div className={classnames(styles.focusedContent, { [styles.focusedContentVisible]: isFocused })}>
              <FooterCustomKeyboard
                prefix={footerPrefix}
                separator={KeyboardSeparator.Dot}
                isDisabled={false}
                shouldScrollIntoView={false}
              />
              <BetsSummary
                disabled={false}
                totalStake={balanceAfterBet}
                totalStakeLabel={i18n.totalStakeLabel}
                totalReturns={totalReturns}
                totalReturnsLabel={i18n.totalReturnsLabel}
                isOddsBoosted={false}
              />
              {terms}
            </div>
          )}
        </div>

        <div className={classnames(styles.sheetFooter, { [styles.sheetFooterCollapsed]: !isExpanded })}>
          {(shouldRenderContent || isPlacing) && (
            <>
              <div className={styles.stakeInput}>
                <CurrencyNumberInputField
                  ref={inputRef}
                  id={combinationId}
                  disabled={isPlacing}
                  readonly={false}
                  label={i18n.stakePlaceholder}
                  value={stake}
                  invalid={!isStakeValid}
                  separator={KeyboardSeparator.Dot}
                  focused={isFocused}
                  hasCaret
                  currencySymbol={currencySymbol}
                  onChange={onStakeChangeGuard}
                  onFocus={onStakeFocusGuard}
                  onBlur={onStakeBlurGuard}
                />
              </div>
              <div className={styles.placeButton}>
                <PrimaryButton
                  disabled={isPlacing || isPlaceDisabled}
                  label={placeButtonLabel}
                  loadingLabel={hasCTALoading ? placeBtnLoadingLabel : undefined}
                  stopAnimation={hasPlaceError || isDepositRequired}
                  onTap={onPlace}
                  variant="transactional"
                  reverseLabels={false}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
