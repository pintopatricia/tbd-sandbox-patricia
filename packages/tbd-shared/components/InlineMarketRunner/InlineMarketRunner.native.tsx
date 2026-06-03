import { FunctionComponent } from "react";
import { View } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { Text } from "@ppb/the-wall-native";
import ConnectedSportsbookBetButton from "../SportsbookBetButton";
import SportsbookBetButton from "../SportsbookBetButton/SportsbookBetButton.native";
import styles from "./InlineMarketRunner.native.styles";
import { InlineMarketRunnerNativeViewModel } from "./InlineMarketRunner.native.types";
import {
  INLINE_MARKET_RUNNER,
  INLINE_MARKET_RUNNER_HANDICAP,
  INLINE_MARKET_RUNNER_BET_BUTTON_CONTAINER,
} from "./InlineMarketRunner.native.selectors";

const InlineMarketRunner: FunctionComponent<InlineMarketRunnerNativeViewModel> = ({
  runner,
  cardUrn,
  runnerIdx,
  numberOfRunners,
  marketOpen,
  marketUrn,
  isSecondaryLabelRunnerName = false,
  isSecondaryLabelUppercase = false,
  showHandicap = false,
}) => {
  const betButtonContainerStyles = [
    styles.betButtonContainer,
    runnerIdx === 0 && runnerIdx < numberOfRunners - 1 && styles.betButtonContainerFirst,
    runnerIdx > 0 && runnerIdx === numberOfRunners - 1 && styles.betButtonContainerLast,
    runnerIdx === 0 && runnerIdx === numberOfRunners - 1 && styles.betButtonContainerOnly,
    isSecondaryLabelRunnerName && styles.betButtonContainerLarge,
  ];

  return (
    <View {...getTestProps(INLINE_MARKET_RUNNER, false)} style={[styles.marketContainer]}>
      {marketOpen && !!runner.handicapLabel && !isSecondaryLabelRunnerName && (
        <View style={[styles.labels, runnerIdx < numberOfRunners - 1 && styles.labelsNotLast]}>
          <Text {...getTestProps(INLINE_MARKET_RUNNER_HANDICAP)} style={styles.handicap}>
            {runner.handicapLabel}
          </Text>
        </View>
      )}
      <View {...getTestProps(INLINE_MARKET_RUNNER_BET_BUTTON_CONTAINER, false)} style={betButtonContainerStyles}>
        <ConnectedSportsbookBetButton
          runnerUrn={runner.urn}
          marketUrn={marketUrn}
          component={SportsbookBetButton}
          displayPreviousOdd={false}
          cardUrn={cardUrn}
          isSecondaryLabelRunnerName={isSecondaryLabelRunnerName}
          isSecondaryLabelUppercase={isSecondaryLabelUppercase}
          handicapLabel={showHandicap ? runner.handicapLabel : undefined}
        />
      </View>
    </View>
  );
};

export default InlineMarketRunner;
