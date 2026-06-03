import { FunctionComponent } from "react";
import classnames from "classnames";

import { AlertType, PNLAndWhatIfSize } from "@ppb/the-wall-common/types";
import { InlinePanelColorMap } from "../../../InlinePanel/InlinePanel.types";
import {
  FixedNumberInputField,
  CurrencyNumberInputField,
  FreeBets,
  SecondaryButton,
  PrimaryButton,
  PNLAndWhatIf,
  Alert,
} from "@ppb/the-wall-web";
import { InlinePanel } from "../../../InlinePanel/InlinePanel.web";
import { JurisdictionalOperatorInfo } from "../../../JurisdictionalOperatorInfo/JurisdictionalOperatorInfo.web";
import type { ExchangeInlineConfirmPanelViewModel } from "./ExchangeInlineConfirmPanel.types";
import styles from "./ExchangeInlineConfirmPanel.web.css";

export const ExchangeInlineConfirmPanel: FunctionComponent<ExchangeInlineConfirmPanelViewModel> = ({
  labels,
  confirm,
  loading,
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
  betDelay,
  error,
  isFreeBetsSelected,
  onCancel,
  onEdit,
  onConfirm,
}) => (
  <div className={styles.container}>
    <InlinePanel title={title} titlePrefix={titlePrefix} color={InlinePanelColorMap[side]} onAction={onCancel}>
      <div className={classnames(styles.content, styles.inputFields)}>
        <FixedNumberInputField value={price} label={labels.price} />
        <CurrencyNumberInputField readonly value={size} label={labels.size} currencySymbol={currencySymbol} />
      </div>
      {isFreeBetsSelected && (
        <div className={styles.freeBets}>
          <FreeBets isReadOnly label={freeBets} isSelected />
        </div>
      )}
      {error && (
        <div className={styles.alert}>
          <Alert type={AlertType.Error} message={error.message} detail={error.detail} />
        </div>
      )}
      <div className={styles.content}>
        <SecondaryButton label={labels.edit} onTap={onEdit} />
        <PrimaryButton
          label={confirm}
          secondaryLabel={profitLabel}
          delay={betDelay}
          loadingLabel={loading}
          stopAnimation={!!error}
          onTap={onConfirm}
        >
          <PNLAndWhatIf pnl={profitValue} rawPnl={profitRawValue} size={PNLAndWhatIfSize.MEDIUM} agnostic={true} />
        </PrimaryButton>
      </div>
      <div className={styles.operatorInfo}>
        <JurisdictionalOperatorInfo />
      </div>
    </InlinePanel>
  </div>
);
