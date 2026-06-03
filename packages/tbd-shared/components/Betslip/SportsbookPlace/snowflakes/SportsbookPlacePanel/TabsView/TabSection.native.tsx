import { FunctionComponent, ReactNode } from "react";
import { CardProps } from "@ppb/the-wall-common/types";
import { SportsbookPlacePanelViewModel } from "../SportsbookPlacePanel.types";
import styles from "./SportsbookPlaceTabsPanel.native.styles";
import { Card } from "@ppb/the-wall-native";
import { CardHeaderSize, CardTheme } from "@ppb/the-wall-common/types/Card/Card.types";
import { View } from "react-native";

export const TabSection: FunctionComponent<
  Pick<CardProps, "title" | "onTitleClick"> & {
    card: ReactNode;
    withCollapsable?: boolean;
    onCollapseToggle: SportsbookPlacePanelViewModel["onCollapseToggle"];
  }
> = ({ title, card, withCollapsable, onCollapseToggle }) => {
  if (!withCollapsable) {
    return <View style={styles.tabSectionContent}>{card}</View>;
  }

  return (
    <View style={styles.tabSectionContainer}>
      <Card
        title={title}
        startOpen
        onTitleClick={onCollapseToggle}
        theme={CardTheme.PRIMARY}
        size={CardHeaderSize.SMALL}
        isCollapsible
        fullWidthContent
      >
        <View style={styles.tabSectionContent}>{card}</View>
      </Card>
    </View>
  );
};
