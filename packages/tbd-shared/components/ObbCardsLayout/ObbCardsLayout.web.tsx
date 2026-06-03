import * as React from "react";
import classnames from "classnames";
import type { ObbCardsLayout as ObbCardsLayoutType } from "@ppb/tbd-store/state/layout/cardgroups/CardGroup.types";

import { ObbCardsStackedLayout } from "./snowflakes/ObbStacked/ObbCardsStackedLayout.web";

import styles from "./ObbCardsLayout.web.css";
import { ObbCardsSwimlaneLayout } from "./snowflakes/ObbSwimlane/ObbCardsSwimlaneLayout.web";

type ObbCardsLayoutProps = {
  layout: ObbCardsLayoutType;
  cardGroupUrn: string;
  onSwimlaneArrowClick?: (direction: "left" | "right") => void;
  onShowMoreClicked: (layoutUrn: string, isOpen: boolean) => void;
};

const ObbCardsLayout: React.FC<ObbCardsLayoutProps> = ({
  layout,
  cardGroupUrn,
  onSwimlaneArrowClick,
  onShowMoreClicked,
}) => {
  switch (layout.typename) {
    case "ObbCardsStackedLayout":
      return (
        <div className={classnames(styles.container)}>
          <ObbCardsStackedLayout layout={layout} cardGroupUrn={cardGroupUrn} onShowMoreClicked={onShowMoreClicked} />
        </div>
      );

    case "ObbCardsSwimlaneLayout":
      return (
        <div className={classnames(styles.container)}>
          <ObbCardsSwimlaneLayout layout={layout} cardGroupUrn={cardGroupUrn} onArrowClick={onSwimlaneArrowClick} />
        </div>
      );
    default:
      return null;
  }
};

export default ObbCardsLayout;
