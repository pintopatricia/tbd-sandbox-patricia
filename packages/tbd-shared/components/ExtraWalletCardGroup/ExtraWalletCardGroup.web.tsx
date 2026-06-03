import { FunctionComponent, Fragment, useCallback, useRef, useEffect } from "react";
import { Option, Divider, Alert } from "@ppb/the-wall-web";
import { AlertType } from "@ppb/the-wall-common/types";
import { ComponentProps } from "./props";
import styles from "./ExtraWalletCardGroup.web.css";
import ConnectedExtraWalletCard from "../ExtraWalletCard";
import ExtraWalletCard from "../ExtraWalletCard/ExtraWalletCard.web";

const ExtraWalletCardGroup: FunctionComponent<ComponentProps> = ({
  items,
  optionTitle,
  optionIcon,
  optionWallets,
  onOptionWalletsUpdate,
  dispatchHelpNavigationAction,
  dispatchPushExternalBlankAction,
  i18nLabels,
  showAlert,
  helpUrl,
  currentPebble,
  isFromBetslip,
}) => {
  const lastCardIndex = items.length - 1;

  const extraWalletCardListRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (extraWalletCardListRef.current) {
      extraWalletCardListRef.current?.scrollIntoView();
    }
  }, [currentPebble]);

  const onAlertClosePress = useCallback(() => {
    if (helpUrl) {
      dispatchHelpNavigationAction(helpUrl, currentPebble, isFromBetslip);
      dispatchPushExternalBlankAction(helpUrl);
    }
  }, [dispatchHelpNavigationAction, dispatchPushExternalBlankAction, helpUrl, currentPebble, isFromBetslip]);

  return (
    <div className={styles.extraWalletCardGroup} ref={extraWalletCardListRef}>
      {helpUrl && showAlert && (
        <Alert
          type={AlertType.Info}
          message={i18nLabels.helpMessage}
          dismissLabel={i18nLabels.helpButtonLabel}
          onClose={onAlertClosePress}
        />
      )}

      {optionTitle && (
        <div className={styles.extraWalletCardGroupOption}>
          <Option icon={optionIcon} iconSize="small" title={optionTitle} isSelected={false} isReadOnly={true} />
        </div>
      )}

      {items.map((urn, index) => (
        <Fragment key={urn}>
          <ConnectedExtraWalletCard
            urn={urn}
            component={ExtraWalletCard}
            onOptionWalletsUpdate={onOptionWalletsUpdate}
            optionWallets={optionWallets}
            currentPebble={currentPebble}
          />

          {index !== lastCardIndex && <Divider />}
        </Fragment>
      ))}
    </div>
  );
};

export default ExtraWalletCardGroup;
