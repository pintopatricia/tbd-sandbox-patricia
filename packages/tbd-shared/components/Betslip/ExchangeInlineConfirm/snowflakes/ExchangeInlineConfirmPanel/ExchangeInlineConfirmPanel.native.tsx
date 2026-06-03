import { FunctionComponent } from "react";
import { View } from "react-native";

import { AlertType, PNLAndWhatIfSize } from "@ppb/the-wall-common/types";
import { InlinePanelColorMap } from "../../../InlinePanel/InlinePanel.types";
import {
  Alert,
  CurrencyNumberInputField,
  FixedNumberInputField,
  FreeBets,
  PNLAndWhatIf,
  PrimaryButton,
  SecondaryButton,
} from "@ppb/the-wall-native";
import { InlinePanel } from "../../../InlinePanel/InlinePanel.native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { JurisdictionalOperatorInfo } from "../../../JurisdictionalOperatorInfo/JurisdictionalOperatorInfo.native";

import type { ExchangeInlineConfirmPanelViewModel } from "./ExchangeInlineConfirmPanel.types";
import { EXCHANGE_INLINE_CONFIRM_PANEL, FREE_BETS } from "./ExchangeInlineConfirmPanel.native.selectors";
import styles from "./ExchangeInlineConfirmPanel.native.styles";

const leftItemStyles = [styles.item, styles.leftItem];
const rightItemStyles = [styles.item, styles.rightItem];

export const ExchangeInlineConfirmPanel: FunctionComponent<ExchangeInlineConfirmPanelViewModel> = ({
  labels,
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
  onCancel,
  onEdit,
  onConfirm,
}) => (
  <InlinePanel title={title} titlePrefix={titlePrefix} color={InlinePanelColorMap[side]} onAction={onCancel}>
    <View style={styles.container} {...getTestProps(EXCHANGE_INLINE_CONFIRM_PANEL, false)}>
      <View style={styles.content}>
        <View style={leftItemStyles}>
          <FixedNumberInputField value={price} label={labels.price} />
        </View>
        <View style={rightItemStyles}>
          <CurrencyNumberInputField readonly value={size} label={labels.size} currencySymbol={currencySymbol} />
        </View>
      </View>
      {isFreeBetsSelected && (
        <View {...getTestProps(FREE_BETS, false)}>
          <FreeBets isReadOnly label={freeBets} isSelected />
        </View>
      )}
      {error && <Alert type={AlertType.Error} message={error.message} detail={error.detail} />}
      <View style={styles.content}>
        <View style={leftItemStyles}>
          <SecondaryButton label={labels.edit} onTap={onEdit} />
        </View>
        <View style={rightItemStyles}>
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
        </View>
      </View>
      <JurisdictionalOperatorInfo />
    </View>
  </InlinePanel>
);
