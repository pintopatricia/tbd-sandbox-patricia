import { Card, QuickLink, SportsbookBetButton, SportsbookMarket } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { FunctionComponent, useCallback } from "react";
import { View } from "react-native";
import { navigate } from "@ppb/tbd-router/native";
import { VirtualRunner } from "./snowflakes/VirtualRunner/VirtualRunner.native";
import { BaseVirtualRunnerProps, ComponentProps } from "./props";
import { VIRTUAL_MARKET_CARD } from "./VirtualMarketCard.native.selectors";
import styles from "./VirtualMarketCard.native.styles";

type VirtualRunnerProps = BaseVirtualRunnerProps & {
  currentIndex: number;
  lastIndex: number;
};

const Runner: FunctionComponent<VirtualRunnerProps> = ({
  currentIndex,
  urn,
  cardUrn,
  name,
  description,
  number,
  sportId,
  showSilk,
  humanTexture,
  label,
  odds,
  isSelected,
  onButtonAction,
  toastMessageStatus,
  dispatchInactiveBetButtonClickAction,
  animated,
}) => {
  const onClick = useCallback(() => {
    if (toastMessageStatus) {
      dispatchInactiveBetButtonClickAction(toastMessageStatus);
    } else {
      const bet = { urn, odds };
      const metadata = { cardUrn, betOriginURL: "" };

      onButtonAction(bet, metadata);
    }
  }, [cardUrn, dispatchInactiveBetButtonClickAction, odds, onButtonAction, toastMessageStatus, urn]);

  return (
    <View key={urn} style={[currentIndex !== 0 && styles.runnerTopMargin]}>
      <VirtualRunner
        key={urn}
        number={number}
        name={name}
        description={description}
        sportId={sportId}
        showSilk={showSilk}
        humanTexture={humanTexture}
      >
        <View style={styles.button}>
          <SportsbookBetButton
            onClick={onClick}
            label={label}
            status={isSelected ? "selected" : "default"}
            animated={animated}
          />
        </View>
      </VirtualRunner>
    </View>
  );
};

const VirtualMarketCard: FunctionComponent<ComponentProps> = ({
  urn: cardUrn,
  title,
  status,
  i18n,
  runners,
  infoBlurbs,
  gameRulesViewLink,
  animated,
  dispatchBetPlacement,
  dispatchInactiveBetButtonClickAction,
}) => {
  const onClick = useCallback(() => {
    navigate(gameRulesViewLink);
  }, [gameRulesViewLink]);

  return (
    <View {...getTestProps(VIRTUAL_MARKET_CARD, false)} style={styles.marketContainer}>
      <Card title={title}>
        <SportsbookMarket infoBlurbs={infoBlurbs} status={status} guaranteedPriceAvailable={false} i18n={i18n}>
          {runners.map((virtualRunner, index) => (
            <Runner
              {...virtualRunner}
              key={virtualRunner.urn}
              cardUrn={cardUrn}
              onButtonAction={dispatchBetPlacement}
              currentIndex={index}
              lastIndex={runners.length}
              dispatchInactiveBetButtonClickAction={dispatchInactiveBetButtonClickAction}
              animated={animated}
            />
          ))}
        </SportsbookMarket>
      </Card>
      <View style={styles.virtualsLink}>
        <QuickLink item={{ text: i18n.gameRules }} isHighlighted={false} onPress={onClick} />
      </View>
    </View>
  );
};

export default VirtualMarketCard;
