import * as React from "react";
import { View } from "react-native";
import type { ObbCardsLayout as ObbCardsLayoutType } from "@ppb/tbd-store/state/layout/cardgroups/CardGroup.types";

import { ObbCardsStackedLayout } from "./snowflakes/ObbStacked/ObbCardsStackedLayout.native";

import styles from "./ObbCardsLayout.native.styles";
import { ObbCardsSwimlaneLayout } from "./snowflakes/ObbSwimlane/ObbCardsSwimlaneLayout.native";

type ObbCardsLayoutProps = {
  layout: ObbCardsLayoutType;
  isLast: boolean;
  onShowMoreClicked: (layoutUrn: string, isOpen: boolean) => void;
};

export const ObbCardsLayout: React.FC<ObbCardsLayoutProps> = ({ layout, isLast, onShowMoreClicked }) => {
  switch (layout.typename) {
    case "ObbCardsStackedLayout":
      return (
        <View style={[!isLast && styles.container]}>
          <ObbCardsStackedLayout layout={layout} onShowMoreClicked={onShowMoreClicked} />
        </View>
      );

    case "ObbCardsSwimlaneLayout":
      return (
        <View style={[!isLast && styles.container]}>
          <ObbCardsSwimlaneLayout layout={layout} />
        </View>
      );
    default:
      return null;
  }
};
