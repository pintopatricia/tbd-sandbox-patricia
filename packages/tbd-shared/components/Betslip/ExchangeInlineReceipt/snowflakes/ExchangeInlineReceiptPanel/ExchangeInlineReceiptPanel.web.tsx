import { FunctionComponent } from "react";

import { InlinePanelColorMap } from "../../../InlinePanel/InlinePanel.types";

import styles from "./ExchangeInlineReceiptPanel.web.css";
import { ExchangeUnmatchedCard } from "../ExchangeUnmatchedCard/ExchangeUnmatchedCard.web";
import { ExchangeMatchedCard } from "../ExchangeMatchedCard/ExchangeMatchedCard.web";
import { ExchangeInlineReceiptPanelViewModel } from "./ExchangeInlineReceiptPanel.types";
import { InlinePanel } from "../../../InlinePanel/InlinePanel.web";

export const ExchangeInlineReceiptPanel: FunctionComponent<ExchangeInlineReceiptPanelViewModel> = ({
  title,
  side,
  matched,
  unmatched,
  onDone,
  onCancel,
  onEdit,
}) => (
  <InlinePanel
    title={title}
    titlePrefix={matched?.titlePrefix || unmatched?.titlePrefix}
    color={InlinePanelColorMap[side]}
    onAction={onDone}
  >
    {!!unmatched && (
      <div className={styles.placedBet}>
        <ExchangeUnmatchedCard {...unmatched} onCancel={onCancel} onEdit={onEdit} />
      </div>
    )}
    {!!matched && (
      <div className={styles.placedBet}>
        <ExchangeMatchedCard {...matched} />
      </div>
    )}
  </InlinePanel>
);
