import { useContext } from "react";
import * as React from "react";
import classnames from "classnames";
import { ScrollableSwimlane } from "@ppb/the-wall-web";

import type { ObbCardsSwimlaneLayout as ObbCardsSwimlaneType } from "@ppb/tbd-store/state/layout/cardgroups/CardGroup.types";
import { ConfigContext } from "../../../Config/ConfigContext";

import ConnectedObbCard from "../../../ObbCard";
import ObbCard from "../../../ObbCard/ObbCard.web";

import styles from "./ObbCardsSwimlaneLayout.web.css";
import { useTooltip } from "../../../ObbSquadVsSquadCard/snowflakes/PlayersTooltip/TooltipContext";

type ObbCardsLayoutProps = {
  layout: ObbCardsSwimlaneType;
  cardGroupUrn: string;
  onArrowClick?: (direction: "left" | "right") => void;
};

export const ObbCardsSwimlaneLayout: React.FC<ObbCardsLayoutProps> = ({ layout, cardGroupUrn, onArrowClick }) => {
  const { isDesktopLayout } = useContext(ConfigContext);
  const { closeTooltip } = useTooltip();

  return (
    <div className={classnames(styles.container)}>
      <div className={styles.scrollableSwimlaneContainer}>
        <ScrollableSwimlane
          isDesktopLayout={isDesktopLayout}
          snap
          onScrollArrowClick={onArrowClick}
          key={`${layout.urn}${layout.items.length}`}
          onScrollCb={closeTooltip}
        >
          {layout.items.map((item, i) => (
            <div className={styles.cardWrapper} key={item.urn + i}>
              <ConnectedObbCard
                typename={item.typename}
                urn={item.urn}
                component={ObbCard}
                layoutUrn={layout.urn}
                itemIndex={i}
                cardGroupUrn={cardGroupUrn}
              />
            </div>
          ))}
        </ScrollableSwimlane>
      </div>
    </div>
  );
};
