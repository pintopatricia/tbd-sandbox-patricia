import type { JSX } from "react";
import { FunctionComponent, useEffect, useMemo } from "react";
import { Label } from "@ppb/the-wall-web/components/bricks/Indicators/Label/Label";
import { OthersIconName, RichContentIconName, SportsIconName } from "@ppb/the-wall-icons";
import { MatchStatSelection } from "./snowflakes/MatchStatSelection/MatchStatSelection.web";
import styles from "./MatchStatSelectionCard.web.css";
import { ComponentProps } from "./props";

import ConnectedSportsbookBetButton from "../SportsbookBetButton";
import SportsbookBetButton from "../SportsbookBetButton/SportsbookBetButton.web";

function getTransformedTitle(playerNames: string[], combiner: string): JSX.Element[] {
  const parts: JSX.Element[] = [];

  playerNames.forEach((name, index) => {
    const splitName = name.split(" ");

    splitName.forEach((namePart, nameIndex) => {
      parts.push(<span key={`name-${nameIndex}`}>{namePart}</span>);
    });

    if (index < playerNames.length - 1) {
      parts.push(
        <span key={`label-${index}`}>
          <Label text={combiner} />
        </span>,
      );
    }
  });
  return parts;
}

const MatchStatSelectionCard: FunctionComponent<ComponentProps> = ({
  visible,
  isMarketClosed,
  marketId,
  runnerUrn,
  marketUrn,
  title,
  subtitle,
  urn: cardUrn,
  statsDescription,
  dispatchMarketUpdatesSubscribe,
  dispatchMarketUpdatesUnsubscribe,
  incidentType,
}) => {
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

  useEffect(() => {
    if (marketId) {
      dispatchMarketUpdatesSubscribe(marketId, !!visible);

      return () => {
        dispatchMarketUpdatesUnsubscribe(marketId);
      };
    }
    return () => {};
  }, [dispatchMarketUpdatesSubscribe, dispatchMarketUpdatesUnsubscribe, marketId, visible]);

  return (
    <div className={styles.cardContainer}>
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
          cardUrn={cardUrn}
        />
      </MatchStatSelection>
    </div>
  );
};

export default MatchStatSelectionCard;
