import { Card, QuickLink, SportsbookBetButton, SportsbookMarket } from "@ppb/the-wall-web";
import { FunctionComponent, useCallback } from "react";
import INTERSECTION_CONFIG from "../../config/cards-intersection";
import { VirtualRunner } from "./snowflakes/VirtualRunner/VirtualRunner.web";
import { BaseVirtualRunnerProps, ComponentProps } from "./props";
import styles from "./VirtualMarketCard.web.css";

const Runner: FunctionComponent<BaseVirtualRunnerProps> = ({
  urn,
  cardUrn,
  name,
  description,
  number,
  label,
  odds,
  isSelected,
  sportId,
  showSilk,
  humanTexture,
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
      const metadata = { cardUrn, betOriginURL: window.location.href };

      onButtonAction(bet, metadata);
    }
  }, [cardUrn, dispatchInactiveBetButtonClickAction, odds, onButtonAction, toastMessageStatus, urn]);

  return (
    <VirtualRunner
      number={number}
      name={name}
      description={description}
      sportId={sportId}
      showSilk={showSilk}
      humanTexture={humanTexture}
    >
      <div className={styles.sportsbookButtonsContainer}>
        <SportsbookBetButton
          onClick={onClick}
          label={label}
          status={isSelected ? "selected" : "default"}
          animated={animated}
        />
      </div>
    </VirtualRunner>
  );
};

const VirtualMarketCard: FunctionComponent<ComponentProps> = ({
  urn: cardUrn,
  title,
  status,
  i18n,
  infoBlurbs,
  runners,
  gameRulesViewLink,
  animated,
  dispatchBetPlacement,
  dispatchInactiveBetButtonClickAction,
}) => (
  <>
    <Card title={title}>
      <SportsbookMarket
        status={status}
        guaranteedPriceAvailable={false}
        i18n={i18n}
        infoBlurbs={infoBlurbs}
        intersectOffset={INTERSECTION_CONFIG.rootMargin}
      >
        {runners.map((virtualRunner) => (
          <div key={virtualRunner.urn} className={styles.runnerBase}>
            <Runner
              {...virtualRunner}
              cardUrn={cardUrn}
              onButtonAction={dispatchBetPlacement}
              dispatchInactiveBetButtonClickAction={dispatchInactiveBetButtonClickAction}
              animated={animated}
            />
          </div>
        ))}
      </SportsbookMarket>
    </Card>
    <div className={styles.virtualsLink}>
      <QuickLink
        item={{ viewLink: gameRulesViewLink, text: i18n.gameRules, target: "blank" }}
        isHighlighted={false}
        onLinkClick={() => {}}
      />
    </div>
  </>
);

export default VirtualMarketCard;
