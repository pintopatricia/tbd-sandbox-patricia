import { FunctionComponent, useMemo } from "react";
import { View } from "react-native";

import { InlinePanelColorMap } from "../../../InlinePanel/InlinePanel.types";

import { InlinePanel } from "../../../InlinePanel/InlinePanel.native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";

import { ExchangeMatchedCard } from "../ExchangeMatchedCard/ExchangeMatchedCard.native";
import { ExchangeUnmatchedCard } from "../ExchangeUnmatchedCard/ExchangeUnmatchedCard.native";
import type { ExchangeInlineReceiptPanelViewModel } from "./ExchangeInlineReceiptPanel.types";
import { PLACED_BET } from "./ExchangeInlineReceiptPanel.native.selectors";
import styles from "./ExchangeInlineReceiptPanel.native.styles";

export const ExchangeInlineReceiptPanel: FunctionComponent<ExchangeInlineReceiptPanelViewModel> = ({
  title,
  side,
  matched,
  unmatched,
  onDone,
  onCancel,
  onEdit,
}) => {
  const unmatchedStyles = useMemo(() => matched && styles.placedBet, [matched]);

  return (
    <InlinePanel
      title={title}
      titlePrefix={matched?.titlePrefix || unmatched?.titlePrefix}
      color={InlinePanelColorMap[side]}
      onAction={onDone}
    >
      {!!unmatched && (
        <View style={unmatchedStyles} {...getTestProps(PLACED_BET, false)}>
          <ExchangeUnmatchedCard {...unmatched} onCancel={onCancel} onEdit={onEdit} />
        </View>
      )}
      {!!matched && (
        <View {...getTestProps(PLACED_BET, false)}>
          <ExchangeMatchedCard {...matched} />
        </View>
      )}
    </InlinePanel>
  );
};
