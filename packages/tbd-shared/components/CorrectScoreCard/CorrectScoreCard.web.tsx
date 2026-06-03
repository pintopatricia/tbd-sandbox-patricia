import { useCallback, useMemo, useState } from "react";
import * as React from "react";
import { Runner, MarketBlurbs } from "@ppb/the-wall-web";
import { ComponentProps } from "./props";
import { CorrectScoreCardItem } from "./map-to-props-factory";
import styles from "./CorrectScoreCard.web.css";
import CorrectScoreItem from "./CorrectScoreCardItem/CorrectScoreCardItem.web";
import ConnectedCorrectScoreCardItem from "./CorrectScoreCardItem";
import ShowMoreComponent from "../ShowMore/ShowMore.web";

const RunnerListHeader: React.FC<{ items: string[] }> = ({ items }) => (
  <div className={styles.marketHeader}>
    <MarketBlurbs columns={items} columnGrid={true} />
  </div>
);

const CorrectScoreColumn: React.FC<{
  label: string;
  items: CorrectScoreCardItem[];
  urn: ComponentProps["urn"];
  marketUrn: ComponentProps["marketUrn"];
}> = ({ label, items, urn, marketUrn }) => (
  <div className={styles.correctScoreRunnerColumn}>
    <RunnerListHeader items={[label]} />
    {items.map(({ label: name, runnerUrn, selectionId }) => (
      <div className={styles.correctScoreRunnerLine} key={`${runnerUrn}-${selectionId}`}>
        <Runner name={name}>
          <div className={styles.betButtonWrapper}>
            <ConnectedCorrectScoreCardItem
              component={CorrectScoreItem}
              marketUrn={marketUrn}
              runnerUrn={runnerUrn}
              cardUrn={urn}
            />
          </div>
        </Runner>
      </div>
    ))}
  </div>
);

const CorrectScoreCard: React.FC<ComponentProps> = ({
  urn,
  columns,
  numberOfItemsToDisplay,
  numberOfLines,
  marketUrn,
  dispatchToggleShowMoreRunners,
}) => {
  const [cardRef, setCardRef] = useState<HTMLDivElement | null>(null);
  const [showMore, setShowMore] = useState(numberOfItemsToDisplay < numberOfLines);

  const onToggleShowMoreRunners = useCallback(
    (showMoreProp: boolean) => dispatchToggleShowMoreRunners(urn, showMoreProp),
    [dispatchToggleShowMoreRunners, urn],
  );

  const lines = useMemo(
    () =>
      showMore
        ? columns.map((line) => ({ label: line.label, runners: line.runners.slice(0, numberOfItemsToDisplay) }))
        : columns,
    [columns, numberOfItemsToDisplay, showMore],
  );

  return (
    <div ref={setCardRef} className={styles.correctScoreCard}>
      <div className={styles.correctScoreRunnerList}>
        {lines.map(({ runners, label }, columnIndex) => (
          <CorrectScoreColumn items={runners} label={label} urn={urn} marketUrn={marketUrn} key={columnIndex} />
        ))}
      </div>
      <ShowMoreComponent
        cardRef={cardRef}
        numberOfItemsToDisplay={numberOfItemsToDisplay}
        numberOfLines={numberOfLines}
        setShowMore={setShowMore}
        showMore={showMore}
        onToggleShowMoreRunners={onToggleShowMoreRunners}
      />
    </div>
  );
};

export default CorrectScoreCard;
