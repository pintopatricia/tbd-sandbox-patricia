import { useEffect, useId } from "react";
import * as React from "react";
import { useOnIntersect } from "@ppb/the-wall-web";
import { ComponentProps } from "./props";
import ConnectedSportsbookBetButton from "../../SportsbookBetButton";
import SportsbookBetButton from "../../SportsbookBetButton/SportsbookBetButton.web";
import styles from "./CorrectScoreCardItem.web.css";

const CorrectScoreCardItem: React.FC<ComponentProps> = ({
  cardUrn,
  marketUrn,
  runnerUrn,
  marketId,
  dispatchSportsbookMarketUpdatesSubscribe,
  dispatchSportsbookMarketUpdatesUnsubscribe,
}) => {
  const { isIntersecting, ref } = useOnIntersect<HTMLDivElement>(null);
  const id = useId();
  useEffect(() => {
    if (isIntersecting) {
      dispatchSportsbookMarketUpdatesSubscribe(marketId, id);
    } else {
      dispatchSportsbookMarketUpdatesUnsubscribe(marketId, id);
    }
  }, [dispatchSportsbookMarketUpdatesSubscribe, dispatchSportsbookMarketUpdatesUnsubscribe, isIntersecting, marketId]);

  return (
    <div className={styles.correctScoreCardItem} ref={ref}>
      <ConnectedSportsbookBetButton
        runnerUrn={runnerUrn}
        marketUrn={marketUrn}
        component={SportsbookBetButton}
        displayPreviousOdd={false}
        cardUrn={cardUrn}
        rounded={false}
      />
    </div>
  );
};

export default CorrectScoreCardItem;
