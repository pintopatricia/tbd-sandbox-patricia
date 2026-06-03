import type { FunctionComponent } from "react";
import { AlertType, BetDetailsAction, BetDetailsColor } from "@ppb/the-wall-common/types";
import { ReceiptTitle, BetDetails, BetSegments, Alert } from "@ppb/the-wall-web";
import styles from "./ReceiptPanel.web.css";
import { ReceiptPanelViewModel } from "./ReceiptPanel.types";

export const ReceiptPanel: FunctionComponent<ReceiptPanelViewModel> = ({
  receiptTitle,
  detailTitle,
  detailSubtitle,
  segmentLeftValue,
  segmentLeftLabel,
  segmentRightValue,
  segmentRightLabel,
  buttonText,
  onDismissPress,
  errorMessage,
  errorDetail,
  children,
}) => (
  <article className={styles.receipt}>
    <ReceiptTitle title={receiptTitle} buttonText={buttonText} onButtonClick={onDismissPress} />
    {!children && (
      <div className={styles.container}>
        {!errorMessage && (
          <article className={styles.betReceiptContainer}>
            <BetDetails
              tagName="div"
              title={detailTitle}
              subtitle={detailSubtitle}
              color={BetDetailsColor.Grey}
              action={BetDetailsAction.None}
            />
            {segmentLeftValue && segmentLeftLabel && segmentRightValue && segmentRightLabel && (
              <div className={styles.segmentsWrap}>
                <BetSegments
                  leftValue={segmentLeftValue}
                  leftLabel={segmentLeftLabel}
                  rightValue={segmentRightValue}
                  rightLabel={segmentRightLabel}
                />
              </div>
            )}
          </article>
        )}
        {errorMessage && <Alert type={AlertType.Error} message={errorMessage} detail={errorDetail} />}
      </div>
    )}
    {children}
  </article>
);
