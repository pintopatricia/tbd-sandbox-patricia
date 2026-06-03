import { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";
import { CardTheme } from "@ppb/the-wall-common/types/Card/Card.types";
import { Card as CollapsibleCard, Divider } from "@ppb/the-wall-web";
import classNames from "classnames";
import { FunctionComponent } from "react";
import ConnectedCard from "../Card";
import Card from "../Card/Card.web";
import { ComponentProps } from "./props";
import styles from "./SportsbookExpandableLegCardGroup.web.css";
import useCollapsibleCardToggle from "../../hooks/useCollapsibleCardToggle";

const SportsbookExpandableLegCardGroup: FunctionComponent<ComponentProps> = ({
  labels: { collapsedLabel, expandedLabel },
  cards,
  dispatchToggleAccordionAction,
  isBetPanelOpen,
}) => {
  const { isExpanded, onCollapseToggle } = useCollapsibleCardToggle({
    isBetPanelOpen,
    dispatchToggleAccordionAction,
  });

  return (
    <>
      {cards?.length && (
        <div className={styles.container}>
          <div className={styles.dividerContainer}>
            <Divider />
          </div>
          <CollapsibleCard
            isCollapsible
            onTitleClick={onCollapseToggle}
            title={isExpanded ? expandedLabel : collapsedLabel}
            startOpen={isBetPanelOpen}
            theme={CardTheme.TERTIARY}
            fullWidthContent
          >
            <div className={styles.aggregatorBody}>
              {cards.map(({ urn, typename }: PartialItem) => {
                const cardStyle = classNames(styles.card, {
                  [styles.legCardGroup]: typename === "SportsbookBetLegCardGroup",
                  [styles.legGroupContainer]: typename !== "SportsbookBetLegCardGroup",
                });
                return (
                  <div className={cardStyle} key={urn}>
                    <ConnectedCard key={urn} urn={urn} component={Card} typename={typename} />
                  </div>
                );
              })}
            </div>
          </CollapsibleCard>
        </div>
      )}
    </>
  );
};

export default SportsbookExpandableLegCardGroup;
