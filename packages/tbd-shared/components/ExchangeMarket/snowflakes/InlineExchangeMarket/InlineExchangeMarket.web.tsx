import type { FunctionComponent, JSX } from "react";
import { useEffect } from "react";
import { OnIntersectCallback, IntersectionProps } from "@ppb/the-wall-common/types/web";
import classNames from "classnames";
import { ScrollableSwimlane, useOnIntersect } from "@ppb/the-wall-web";
import { InlineExchangeMarketProps } from "./InlineExchangeMarket.types";
import styles from "./InlineExchangeMarket.web.css";

export type InlineExchangeMarketViewModel = {
  renderBackBetBtns: JSX.Element[] | null;
  renderLayBetBtns: JSX.Element[] | null;
  onIntersectCallback?: OnIntersectCallback;
} & InlineExchangeMarketProps &
  IntersectionProps;

/**
 * @param {boolean} disabled if true, will disable all the bet buttons in the market
 * @param {InlineExchangeMarketRunners} runners Market Runners
 * @param {InlineSportsbookMarketOnBetClick} onBetClick OnClick callback for the bet buttons
 * @param intersectOffset Offset used to start/stop the prices subscription
 * @param onIntersectCallback Callback called when the market leaves/enters the intersectRootElement + intersectOffset
 */
export const InlineExchangeMarket: FunctionComponent<InlineExchangeMarketViewModel> = ({
  runners,
  intersectOffset,
  onIntersectCallback,
  renderBackBetBtns,
  renderLayBetBtns,
}) => {
  const { isIntersecting, ref } = useOnIntersect<HTMLDivElement>(null, intersectOffset);

  useEffect(() => {
    if (onIntersectCallback) {
      onIntersectCallback(isIntersecting);
    }
  }, [onIntersectCallback, isIntersecting]);

  const filteredRunnersByName = runners.filter(
    (element, index, array) => array.findIndex((s) => s.name === element.name) === index,
  );

  const exchangeMarketContainer = classNames(styles.inlineExchangeMarket, {
    [styles.inlineExchangeMarketSmall]: filteredRunnersByName.length === 2,
  });

  return (
    <div ref={ref} className={exchangeMarketContainer}>
      <ScrollableSwimlane snap={true} noSpacing={true}>
        <div className={styles.snapGroup}>{renderBackBetBtns}</div>
        <div className={styles.snapGroup}>{renderLayBetBtns}</div>
      </ScrollableSwimlane>
    </div>
  );
};
