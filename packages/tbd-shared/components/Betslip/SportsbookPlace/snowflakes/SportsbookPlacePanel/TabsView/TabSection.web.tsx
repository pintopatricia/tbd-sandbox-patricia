import { CardProps } from "@ppb/the-wall-common/types";
import { FunctionComponent, ReactNode } from "react";
import { SportsbookPlacePanelViewModel } from "../SportsbookPlacePanel.types";
import styles from "./TabSection.web.css";
import { Card } from "@ppb/the-wall-web";
import { CardTheme, CardHeaderSize } from "@ppb/the-wall-common/types/Card/Card.types";

export const TabSection: FunctionComponent<
  Pick<CardProps, "title" | "onTitleClick"> & {
    card: ReactNode;
    withCollapsable?: boolean;
    onCollapseToggle: SportsbookPlacePanelViewModel["onCollapseToggle"];
  }
> = ({ title, card, withCollapsable, onCollapseToggle }) => {
  return (
    <div className={styles.tabSectionContainer}>
      {withCollapsable ? (
        <Card
          title={title}
          startOpen
          onTitleClick={onCollapseToggle}
          theme={CardTheme.PRIMARY}
          size={CardHeaderSize.SMALL}
          isCollapsible
          fullWidthContent
        >
          <div className={styles.tabSectionContent}>{card}</div>
        </Card>
      ) : (
        <div className={styles.tabSectionContent}>{card}</div>
      )}
    </div>
  );
};
