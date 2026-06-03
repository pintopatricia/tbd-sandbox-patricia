import * as React from "react";
import { View } from "react-native";
import type { ObbCardsStackedLayout as ObbCardsStackedLayoutType } from "@ppb/tbd-store/state/layout/cardgroups/CardGroup.types";
import { ShowMore } from "@ppb/the-wall-native";
import ConnectedObbCard from "../../../ObbCard";
import ObbCard from "../../../ObbCard/ObbCard.native";
import styles from "./ObbCardsStackedLayout.native.styles";
import { i18n } from "../../../../helpers/i18n";

type ObbCardsLayoutProps = {
  layout: ObbCardsStackedLayoutType;
  onShowMoreClicked: (layoutUrn: string, isOpen: boolean) => void;
};

export const ObbCardsStackedLayout: React.FC<ObbCardsLayoutProps> = ({ layout, onShowMoreClicked }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { maxCardsToDisplay, items } = layout;
  const cardsToDisplay = isOpen ? items : items.slice(0, maxCardsToDisplay);
  const hasMoreCards = maxCardsToDisplay && items.length > maxCardsToDisplay;

  return (
    <View style={styles.container}>
      <View style={styles.itemsContainer}>
        {cardsToDisplay.map((item) => (
          <ConnectedObbCard key={item.urn} typename={item.typename} urn={item.urn} component={ObbCard} />
        ))}
        {hasMoreCards && (
          <ShowMore
            onClick={() => {
              setIsOpen(!isOpen);
              onShowMoreClicked(layout.urn, !isOpen);
            }}
            opened={isOpen}
            text={isOpen ? i18n({ key: "I18N.SHOW_LESS" }) : i18n({ key: "I18N.SHOW_MORE" })}
            hasBorderTop={false}
          />
        )}
      </View>
    </View>
  );
};
