import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { View } from "react-native";

import { navigate } from "@ppb/tbd-router";
import { BetSegments, Divider } from "@ppb/the-wall-native";

import styles from "./ExchangeMarket.native.styles";
import {
  InlineExchangeMarket,
  type InlineExchangeMarketViewModel,
} from "./snowflakes/InlineExchangeMarket/InlineExchangeMarket.native";
import { ComponentProps } from "./props";
import { ExchangeMarket as ExchangeMarketComponent } from "./snowflakes/ExchangeMarket/ExchangeMarket.native";
import { ExchangeMarketRunner } from "./snowflakes/ExchangeMarket/ExchangeMarket.types";

import ConnectedCashout from "../Cashout";
import Cashout from "../Cashout/Cashout.native";
import ConnectedMarketGraph from "../MarketGraph";
import MarketGraph from "../MarketGraph/MarketGraph.native";
import ConnectedExchangeBetButtons from "../ExchangeBetButtons";
import ExchangeBetButtons from "../ExchangeBetButtons/ExchangeBetButtons.native";
import ConnectedExchangeMarketRunner from "../ExchangeMarketRunner";
import ExchangeMarketRunnerComponent from "../ExchangeMarketRunner/ExchangeMarketRunner.native";

/**
 * Function component that wraps the exchange market component and trigger the updates
 *
 * @param props The props mapped by mapStateToProps
 * @returns The react component
 */
const MemoizedExchangeMarket: FunctionComponent<ComponentProps> = ({
  marketURN,
  marketId,
  marketName,
  liquidity,
  runners,
  isRaceMarket,
  status,
  i18nLabels,
  cardUrn,
  dispatchUpdateMarketDepth,
  bookPercentage,
  runnerViewLinks,
  eventViewLink,
  isMarketDepthActive = false,
  exchangeCashoutURN,
  hasQuote,
  liabilityValue,
  inline = false,
  isRunnerExpandable,
  marketPromo,
  marketRulesViewURN,
  dispatchFetchCatalogue,
  dispatchModalToggleAction,
  dispatchToggleMarketGraph,
  onMarketPromoClick,
  turnInPlayEnabled,
  inplay,
}) => {
  const [isMarketGraphsVisible, setIsMarketGraphsVisible] = useState<boolean>(false);
  const [currentMarketGraphRunner, setCurrentMarketGraphRunner] = useState<ExchangeMarketRunner>();

  const onMarketDepthButtonClick = useCallback(
    () => dispatchUpdateMarketDepth(marketURN, isMarketDepthActive),
    [dispatchUpdateMarketDepth, isMarketDepthActive, marketURN],
  );

  const renderExcBetButtons = useCallback<InlineExchangeMarketViewModel["renderExcBetButtons"]>(
    (urn, side) => (
      <ConnectedExchangeBetButtons
        key={urn}
        component={ExchangeBetButtons}
        cardURN={cardUrn}
        marketURN={marketURN}
        runnerURN={urn}
        displayBestOdds={true}
        side={side}
      />
    ),
    [cardUrn, marketURN],
  );

  const marketRulesCallback = useCallback(() => {
    if (marketRulesViewURN) {
      dispatchFetchCatalogue(marketRulesViewURN);
      navigate({
        viewUrn: marketRulesViewURN,
      });
      dispatchModalToggleAction(true);
    }
  }, [dispatchFetchCatalogue, dispatchModalToggleAction, marketRulesViewURN]);

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
    return <InlineExchangeMarket runners={runners} renderExcBetButtons={renderExcBetButtons} />;
  }

  const containerStyles = [
    styles.runnersList,
    isMarketDepthActive && styles.runnersOnMarketDepth,
    isRaceMarket && styles.horseRacingRunnersList,
  ];

  return (
    <>
      {exchangeCashoutURN && hasQuote && (
        <>
          <View style={styles.cashoutContainer}>
            <View style={styles.liability}>
              <BetSegments leftValue={liabilityValue} leftLabel={i18nLabels.liability} />
            </View>
            <View style={styles.cashout}>
              <ConnectedCashout component={Cashout} cashoutURN={exchangeCashoutURN} />
            </View>
          </View>
          <View style={styles.divider}>
            <Divider />
          </View>
        </>
      )}
      <ExchangeMarketComponent
        marketURN={marketURN}
        liquidity={liquidity}
        runners={runners}
        isRaceMarket={isRaceMarket}
        status={status}
        i18nLabels={i18nLabels}
        bookPercentage={bookPercentage}
        isMarketDepthActive={isMarketDepthActive}
        onMarketDepthButtonTap={onMarketDepthButtonClick}
        hasMarketRules={!!marketRulesViewURN}
        hasMarketGraph={isRaceMarket}
        onMarketRulesButtonTap={marketRulesCallback}
        marketPromo={marketPromo}
        onMarketPromoClick={onMarketPromoClick}
        onMarketGraphButtonTap={() => onMarketGraphsButtonClick(runners[0])}
        turnInPlayEnabled={turnInPlayEnabled}
        inplay={inplay}
      >
        {/* List of Runners */}
        <View style={containerStyles}>
          {runners?.map((runner, index) => (
            <View
              key={runner.urn}
              style={[
                isMarketDepthActive && styles.marginBottomSpacing4,
                isMarketDepthActive && index === runners.length - 1 && styles.marginBottomSpacing1,
                !isMarketDepthActive && index !== 0 && styles.marginTopGutter1,
              ]}
            >
              <ConnectedExchangeMarketRunner
                component={ExchangeMarketRunnerComponent}
                cardURN={cardUrn}
                marketURN={marketURN}
                runnerURN={runner.urn}
                runnerIdx={index}
                runnersLength={runners.length}
                i18nLabels={i18nLabels}
                isMarketDepthActive={isMarketDepthActive}
                runnerViewLink={runnerViewLinks?.[runner.urn]}
                isRunnerExpandable={isRunnerExpandable}
                eventViewLink={eventViewLink}
                onMarketGraphButtonTap={() => onMarketGraphsButtonClick(runner)}
              />
            </View>
          ))}
        </View>
      </ExchangeMarketComponent>

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

const ExchangeMarket: FunctionComponent<ComponentProps> = (props) => {
  const {
    marketId,
    cardUrn,
    dispatchMarketUpdatesSubscribe,
    dispatchMarketUpdatesUnsubscribe,
    dispatchSubscribeExchangeCashout,
    dispatchUnsubscribeExchangeCashout,
    exchangeCashoutURN,
    visible,
    inline = false,
  } = props;

  useEffect(() => {
    if (marketId) {
      if (visible) {
        dispatchMarketUpdatesSubscribe(marketId, inline);
      } else {
        dispatchMarketUpdatesUnsubscribe(marketId, inline);
      }

      return () => {
        dispatchMarketUpdatesUnsubscribe(marketId, inline);
      };
    }
    return () => {};
  }, [dispatchMarketUpdatesSubscribe, dispatchMarketUpdatesUnsubscribe, marketId, inline, cardUrn, visible]);

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

  return <MemoizedExchangeMarket {...props} />;
};

export default ExchangeMarket;
