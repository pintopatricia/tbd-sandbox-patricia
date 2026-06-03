import { FunctionComponent, useEffect, useId } from "react";
import { HighlightedSelectionCard as HighlightedSelection } from "./snowflakes/HighlightedSelectionCard/HighlightedSelectionCard.web";
import styles from "./HighlightedSelectionCard.web.css";
import { ComponentProps } from "./props";

import ConnectedSportsbookBetButton from "../SportsbookBetButton";
import SportsbookBetButton from "../SportsbookBetButton/SportsbookBetButton.web";

const HighlightedSelectionCard: FunctionComponent<ComponentProps> = ({
  visible,
  isMarketClosed,
  marketId,
  runnerUrn,
  marketUrn,
  betButtondisplayPreviousOdd,
  title,
  urn: cardUrn,
  dispatchMarketUpdatesSubscribe,
  dispatchMarketUpdatesUnsubscribe,
}) => {
  const id = useId();
  useEffect(() => {
    if (marketId) {
      dispatchMarketUpdatesSubscribe(marketId, id, !!visible);

      return () => {
        dispatchMarketUpdatesUnsubscribe(marketId, id);
      };
    }
    return () => {};
  }, [dispatchMarketUpdatesSubscribe, dispatchMarketUpdatesUnsubscribe, marketId, visible, id]);

  return (
    <div className={styles.cardContainer}>
      <HighlightedSelection text={title} isMarketClosed={isMarketClosed}>
        <ConnectedSportsbookBetButton
          runnerUrn={runnerUrn}
          marketUrn={marketUrn}
          component={SportsbookBetButton}
          displayPreviousOdd={betButtondisplayPreviousOdd}
          cardUrn={cardUrn}
        />
      </HighlightedSelection>
    </div>
  );
};

export default HighlightedSelectionCard;
