import { useOnIntersect } from "@ppb/the-wall-web";
import { FunctionComponent, useEffect, useId } from "react";
import classNames from "classnames";
import { ComponentProps } from "./props";
import styles from "./PopularBetBuilderSelectionOdd.web.css";

const PopularBetBuilderSelectionOdd: FunctionComponent<ComponentProps> = ({
  dispatchSportsbookMarketUpdatesSubscribe,
  dispatchSportsbookMarketUpdatesUnsubscribe,
  marketId,
  isRacing,
  odd,
}) => {
  const { isIntersecting, ref } = useOnIntersect<HTMLDivElement>(null);
  const id = useId();
  const titleStyle = isRacing ? `typography-h158` : `typography-h180`;

  useEffect(() => {
    const callbackUpdateMarketPrice = isIntersecting
      ? dispatchSportsbookMarketUpdatesSubscribe
      : dispatchSportsbookMarketUpdatesUnsubscribe;

    callbackUpdateMarketPrice(marketId, id);
  }, [
    dispatchSportsbookMarketUpdatesSubscribe,
    dispatchSportsbookMarketUpdatesUnsubscribe,
    isIntersecting,
    marketId,
    id,
  ]);

  return (
    <span className={classNames(styles.container, titleStyle)} ref={ref}>
      {odd}
    </span>
  );
};

export default PopularBetBuilderSelectionOdd;
