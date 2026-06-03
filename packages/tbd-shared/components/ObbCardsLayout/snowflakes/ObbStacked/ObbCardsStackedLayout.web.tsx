import * as React from "react";
import classnames from "classnames";

import type { ObbCardsStackedLayout as ObbCardsStackedLayoutType } from "@ppb/tbd-store/state/layout/cardgroups/CardGroup.types";

import { ShowMore } from "@ppb/the-wall-web";
import ConnectedObbCard from "../../../ObbCard";
import ObbCard from "../../../ObbCard/ObbCard.web";

import styles from "./ObbCardsStackedLayout.web.css";
import { i18n } from "../../../../helpers/i18n";

type ObbCardsLayoutProps = {
  layout: ObbCardsStackedLayoutType;
  cardGroupUrn: string;
  onShowMoreClicked: (layoutUrn: string, isOpen: boolean) => void;
};

export const ObbCardsStackedLayout: React.FC<ObbCardsLayoutProps> = ({ layout, cardGroupUrn, onShowMoreClicked }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { maxCardsToDisplay, items } = layout;
  const cardsToDisplay = isOpen ? items : items.slice(0, maxCardsToDisplay);
  const hasMoreCards = maxCardsToDisplay && items.length > maxCardsToDisplay;

  return (
    <div className={classnames(styles.container)}>
      <div className={classnames(styles.itemsContainer)}>
        {cardsToDisplay.map((item, index) => (
          <ConnectedObbCard
            key={item.urn}
            typename={item.typename}
            urn={item.urn}
            component={ObbCard}
            layoutUrn={layout.urn}
            itemIndex={index}
            cardGroupUrn={cardGroupUrn}
          />
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
      </div>
    </div>
  );
};
