import { FunctionComponent } from "react";
import classnames from "classnames";
import { HighlightedSelectionCardProps } from "./HighlightedSelectionCard.types";
import styles from "./HighlightedSelectionCard.web.css";

export const HighlightedSelectionCard: FunctionComponent<HighlightedSelectionCardProps> = ({
  text,
  isMarketClosed,
  children,
}) => {
  const containerClasses = classnames(styles.highlightedSelectionCard, {
    [styles.closed]: isMarketClosed,
  });
  const textClass = classnames(styles.text, "typography-h152");

  return (
    <div className={containerClasses}>
      <div className={styles.infoContainerClass}>
        <span className={textClass}>{text}</span>
        <div className={styles.button}>{children}</div>
      </div>
    </div>
  );
};
