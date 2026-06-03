import { lazy, FunctionComponent, JSX, Suspense, useCallback, useEffect, useState } from "react";
import classnames from "classnames";
import { BetSegments, Divider, FullScreenModal } from "@ppb/the-wall-web";
import { OnIntersectCallback } from "@ppb/the-wall-common/types/web";
import { ExchangeSide as ExchangeSideType } from "@ppb/tbd-store/state/betting/exchange-bets/ExchangeBet.types";
import { ExchangeSide } from "@ppb/tbd-store/state/constants";
import INTERSECTION_CONFIG from "../../config/cards-intersection";
import styles from "./ExchangeMarket.web.css";
import { ComponentProps } from "./props";
import ConnectedGenericView from "../GenericView";
import ConnectedMarketGraph from "../MarketGraph";
import MarketGraph from "../MarketGraph/MarketGraph.web";

import ConnectedExchangeMarketRunner from "../ExchangeMarketRunner";
import ExchangeMarketRunnerComponent from "../ExchangeMarketRunner/ExchangeMarketRunner.web";
import ConnectedExchangeBetButtons from "../ExchangeBetButtons";
import ExchangeBetButtons from "../ExchangeBetButtons/ExchangeBetButtons.web";
import { GenericView, GenericViewPlaceholder } from "../GenericView/GenericView.web";
import { ExchangeMarket as ExchangeMarketComponent } from "./snowflakes/ExchangeMarket/ExchangeMarket.web";
import { InlineExchangeMarket } from "./snowflakes/InlineExchangeMarket/InlineExchangeMarket.web";
import type { ExchangeMarketRunner } from "./snowflakes/ExchangeMarket/ExchangeMarket.types";

const ConnectedCashout = lazy(() => import(/* webpackChunkName: "Cashout" */ "../Cashout"));
const Cashout = lazy(() => import(/* webpackChunkName: "Cashout" */ "../Cashout/Cashout.web"));

/**
 * Function component that wraps the exchange market component and trigger the updates
 *
 * @param props The props mapped by mapStateToProps
 * @returns The react component
 */
const ExchangeMarket: FunctionComponent<ComponentProps> = ({
  marketURN,
  marketId,
  marketName,
  liquidity,
  runners,
  isRaceMarket,
  status,
  i18nLabels,
  inline = false,
  cardUrn,
  bookPercentage,
  isMarketDepthActive = false,
  runnerViewLinks,
  eventViewLink,
  runnerViewsTitles,
  exchangeCashoutURN,
  hasQuote,
  liabilityValue,
  isRunnerExpandable,
  marketRulesViewURN,
  marketPromo,
  turnInPlayEnabled,
  inplay,
  dispatchMarketUpdatesSubscribe,
  dispatchMarketUpdatesUnsubscribe,
  dispatchUpdateMarketDepth,
  dispatchSubscribeExchangeCashout,
  dispatchUnsubscribeExchangeCashout,
  dispatchFetchCatalogue,
  dispatchDeleteView,
  dispatchModalToggleAction,
  dispatchToggleMarketGraph,
  onMarketPromoClick,
}) => {
  const [displayMarketRules, setDisplayMarketRules] = useState<boolean>(false);
  const [isMarketGraphsVisible, setIsMarketGraphsVisible] = useState<boolean>(false);
  const [currentMarketGraphRunner, setCurrentMarketGraphRunner] = useState<ExchangeMarketRunner>();

  const onMarketDepthButtonClick = useCallback(
    () => dispatchUpdateMarketDepth(marketURN, isMarketDepthActive),
    [isMarketDepthActive, marketURN, dispatchUpdateMarketDepth],
  );

  const onIntersectCallback = useCallback<OnIntersectCallback>(
    (isIntersecting) => {
      if (isIntersecting) {
        dispatchMarketUpdatesSubscribe(marketId, inline);
      } else {
        dispatchMarketUpdatesUnsubscribe(marketId, inline);
      }
    },
    [dispatchMarketUpdatesSubscribe, dispatchMarketUpdatesUnsubscribe, marketId, inline],
  );

  useEffect(() => {
    if (exchangeCashoutURN) {
      dispatchSubscribeExchangeCashout(marketId);
    }

    return () => {
      if (exchangeCashoutURN) {
        dispatchUnsubscribeExchangeCashout(marketId);
      }
    };
  }, [dispatchSubscribeExchangeCashout, dispatchUnsubscribeExchangeCashout, exchangeCashoutURN, marketId]);

  const renderBetBtns = useCallback(
    (side: ExchangeSideType, orderedRunners: ExchangeMarketRunner[]): JSX.Element[] =>
      orderedRunners.map((runner) => (
        <ConnectedExchangeBetButtons
          key={runner.urn}
          component={ExchangeBetButtons}
          cardURN={cardUrn}
          marketURN={marketURN}
          runnerURN={runner.urn}
          displayBestOdds
          side={side}
        />
      )),
    [cardUrn, marketURN],
  );

  const marketRulesCallback = useCallback(() => {
    if (marketRulesViewURN) {
      dispatchFetchCatalogue(marketRulesViewURN);
      setDisplayMarketRules(true);
      dispatchModalToggleAction(true);
    }
  }, [dispatchFetchCatalogue, dispatchModalToggleAction, marketRulesViewURN]);

  const onMarketRulesViewDismiss = useCallback(() => {
    if (marketRulesViewURN) {
      dispatchDeleteView(marketRulesViewURN);
    }
    setDisplayMarketRules(false);
    dispatchModalToggleAction(false);
  }, [dispatchDeleteView, dispatchModalToggleAction, marketRulesViewURN]);

  const onMarketGraphsButtonClick = useCallback(
    (runner: ExchangeMarketRunner) => {
      setCurrentMarketGraphRunner(runner);
      setIsMarketGraphsVisible(true);

      // GTM show market graph
      dispatchToggleMarketGraph(runner.name, marketName, false);
    },
    [dispatchToggleMarketGraph, marketName],
  );

  const dismissMarketGraphs = useCallback(() => {
    if (currentMarketGraphRunner) {
      // GTM close market graph
      dispatchToggleMarketGraph(currentMarketGraphRunner.name, marketName, true);
    }

    if (isMarketGraphsVisible) {
      setIsMarketGraphsVisible(false);
    }
  }, [dispatchToggleMarketGraph, isMarketGraphsVisible, currentMarketGraphRunner, marketName]);

  if (!marketId) {
    return null;
  }

  if (inline) {
    return (
      <InlineExchangeMarket
        runners={runners}
        intersectOffset={INTERSECTION_CONFIG.rootMargin}
        onIntersectCallback={onIntersectCallback}
        renderBackBetBtns={renderBetBtns(ExchangeSide.BACK, runners)}
        renderLayBetBtns={renderBetBtns(ExchangeSide.LAY, runners)}
      />
    );
  }

  return (
    <>
      {exchangeCashoutURN && hasQuote && (
        <Suspense fallback={<></>}>
          <div className={styles.cashoutContainer}>
            <BetSegments leftValue={liabilityValue} leftLabel={i18nLabels.liability} />
            <ConnectedCashout component={Cashout} cashoutURN={exchangeCashoutURN} />
          </div>
          <div className={styles.divider}>
            <Divider />
          </div>
        </Suspense>
      )}
      <ExchangeMarketComponent
        marketURN={marketURN}
        liquidity={liquidity}
        runners={runners}
        isRaceMarket={isRaceMarket}
        status={status}
        i18nLabels={i18nLabels}
        intersectOffset={INTERSECTION_CONFIG.rootMargin}
        onIntersectCallback={onIntersectCallback}
        bookPercentage={bookPercentage}
        isMarketDepthActive={isMarketDepthActive}
        onMarketDepthButtonTap={onMarketDepthButtonClick}
        hasMarketRules={!!marketRulesViewURN}
        onMarketRulesButtonTap={marketRulesCallback}
        hasMarketGraph={isRaceMarket}
        onMarketGraphButtonTap={() => onMarketGraphsButtonClick(runners[0])}
        marketPromo={marketPromo}
        onMarketPromoClick={onMarketPromoClick}
        turnInPlayEnabled={turnInPlayEnabled}
        inplay={inplay}
      >
        {/* List of Runners */}
        <div
          className={classnames(styles.runnersList, {
            [styles.runnersOnMarketDepth]: isMarketDepthActive,
          })}
        >
          {runners.map((runner) => {
            const { urn } = runner;
            const runnerViewLink = runnerViewLinks?.[urn];
            const runnerViewTitle = runnerViewLink && runnerViewsTitles && runnerViewsTitles[runnerViewLink.viewUrn];

            return (
              <div key={urn} className={styles.runnersListItem}>
                <ConnectedExchangeMarketRunner
                  component={ExchangeMarketRunnerComponent}
                  cardURN={cardUrn}
                  marketURN={marketURN}
                  runnerURN={urn}
                  i18nLabels={i18nLabels}
                  isMarketDepthActive={isMarketDepthActive}
                  runnerViewLink={runnerViewLinks?.[urn]}
                  runnerViewTitle={runnerViewTitle}
                  isRunnerExpandable={isRunnerExpandable}
                  eventViewLink={eventViewLink}
                  onMarketGraphButtonTap={() => onMarketGraphsButtonClick(runner)}
                />
              </div>
            );
          })}
        </div>
      </ExchangeMarketComponent>
      {displayMarketRules && marketRulesViewURN && (
        <FullScreenModal title={i18nLabels.marketRules} onDismiss={onMarketRulesViewDismiss}>
          {/* @ts-expect-error TODO Universal integration with placeholders still break on ts-jest */}
          <ConnectedGenericView urn={marketRulesViewURN} component={GenericView} placeholder={GenericViewPlaceholder} />
        </FullScreenModal>
      )}

      {isMarketGraphsVisible && currentMarketGraphRunner && (
        <ConnectedMarketGraph
          component={MarketGraph}
          market={marketURN}
          runner={currentMarketGraphRunner.urn}
          onMarketGraphDismiss={dismissMarketGraphs}
        />
      )}
    </>
  );
};

export default ExchangeMarket;
