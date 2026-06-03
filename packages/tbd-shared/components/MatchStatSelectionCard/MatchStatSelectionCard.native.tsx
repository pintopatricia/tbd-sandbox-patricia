import type { JSX } from "react";
import { FunctionComponent, memo, useEffect, useMemo } from "react";
import { View } from "react-native";
import { Label } from "@ppb/the-wall-native/components/bricks/Indicators/Label/Label";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { OthersIconName, RichContentIconName, SportsIconName } from "@ppb/the-wall-icons";
import { Text } from "@ppb/the-wall-native";
import { MatchStatSelection } from "./snowflakes/MatchStatSelection/MatchStatSelection.native";
import cardStyles from "./MatchStatSelectionCard.native.styles";
import styles from "./snowflakes/MatchStatSelection/MatchStatSelection.native.styles";
import { MATCH_STAT_SELECTION_CARD_CONTAINER } from "./MatchStatSelectionCard.native.selectors";
import { ComponentProps } from "./props";
import ConnectedSportsbookBetButton from "../SportsbookBetButton";
import SportsbookBetButton from "../SportsbookBetButton/SportsbookBetButton.native";

function getTransformedTitle(playerNames: string[], combiner: string): JSX.Element[] {
  const parts: JSX.Element[] = [];

  playerNames.forEach((name, index) => {
    const splitName = name.split(" ");

    splitName.forEach((namePart, nameIndex) => {
      parts.push(
        <Text key={`name-${index}-${nameIndex}`} style={styles.title}>
          {namePart}
        </Text>,
      );
    });

    if (index < playerNames.length - 1) {
      parts.push(
        <View key={`label-${index}`}>
          <Label text={combiner} />
        </View>,
      );
    }
  });

  return parts;
}

const MemoizedMatchStatSelectionCard: FunctionComponent<ComponentProps> = memo(
  ({ isMarketClosed, runnerUrn, marketUrn, statsDescription, title, subtitle, urn, incidentType }) => {
    const { playerNames, combiner } = title;
    const transformedTitle = getTransformedTitle(playerNames, combiner);

    const getIcon = useMemo(() => {
      const icon = incidentType?.toUpperCase();

      switch (icon) {
        case "FOULS":
          return RichContentIconName.FOULS;
        case "SHOTS":
          return RichContentIconName.PENALTY_SCORED;
        case "GOALS":
          return OthersIconName.GOALS;
        case "SOT":
          return RichContentIconName.PENALTY_SCORED;
        default:
          return SportsIconName.FOOTBALL;
      }
    }, [incidentType]);

    return (
      <View style={cardStyles.cardContainer} {...getTestProps(MATCH_STAT_SELECTION_CARD_CONTAINER, false)}>
        <MatchStatSelection
          title={transformedTitle}
          subtitle={subtitle}
          stats={statsDescription}
          isMarketClosed={isMarketClosed}
          icon={getIcon}
        >
          <ConnectedSportsbookBetButton
            runnerUrn={runnerUrn}
            marketUrn={marketUrn}
            component={SportsbookBetButton}
            cardUrn={urn}
          />
        </MatchStatSelection>
      </View>
    );
  },
);

MemoizedMatchStatSelectionCard.displayName = "MemoizedMatchStatSelectionCard";

const MatchStatSelectionCard: FunctionComponent<ComponentProps> = (props) => {
  const { marketId, visible } = props;
  const { dispatchMarketUpdatesSubscribe, dispatchMarketUpdatesUnsubscribe } = props;

  useEffect(() => {
    if (marketId) {
      dispatchMarketUpdatesSubscribe(marketId, visible);

      return () => {
        dispatchMarketUpdatesUnsubscribe(marketId);
      };
    }
    return () => {};
  }, [marketId, visible, dispatchMarketUpdatesSubscribe, dispatchMarketUpdatesUnsubscribe]);

  return <MemoizedMatchStatSelectionCard {...props} />;
};

export default MatchStatSelectionCard;
