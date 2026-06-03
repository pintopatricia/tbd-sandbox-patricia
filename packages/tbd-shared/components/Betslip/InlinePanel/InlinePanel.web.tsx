import { FunctionComponent } from "react";
import classnames from "classnames";

import { SystemIconName } from "@ppb/the-wall-icons";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { InlinePanelViewModel, InlinePanelColor } from "./InlinePanel.types";

import styles from "./InlinePanel.web.css";

export const InlinePanel: FunctionComponent<InlinePanelViewModel> = ({
  titlePrefix,
  title,
  color,
  onAction,
  children,
}) => {
  const panelClassNames = classnames(styles.inlinePanel, {
    [styles.pink]: color === InlinePanelColor.Pink,
    [styles.blue]: color === InlinePanelColor.Blue,
  });

  return (
    <div className={panelClassNames}>
      <section className={styles.header}>
        <div className={styles.titleContainer}>
          {titlePrefix && <span className={styles.titlePrefix}>{titlePrefix}:</span>}
          <h3 className={styles.title}>{title}</h3>
        </div>
        <button className={styles.action} onClick={onAction} aria-label="close" type="button">
          <GenericIcon name={SystemIconName.CLOSE} color={"var(--neutrals-icon-default)"} />
        </button>
      </section>
      <div className={styles.content}>{children}</div>
    </div>
  );
};
