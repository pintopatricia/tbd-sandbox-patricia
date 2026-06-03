import { FunctionComponent, useCallback, useEffect } from "react";
import classNames from "classnames";
import { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";
import { Divider, useOnIntersect } from "@ppb/the-wall-web";
import { OnIntersectCallback } from "@ppb/the-wall-common/types/useOnIntersect.web.types";
import StatsSupportingContentButtonsCardGroup from "../StatsSupportingContentButtonsCardGroup/view/StatsSupportingContentButtonsCardGroup.web";
import { ComponentProps } from "./props";
import ConnectedCard from "../Card";
import ConnectedFixtureCard from "../FixtureCard";
import MyBetsFixtureCard from "../FixtureCard/MyBetsFixture/MyBetsFixtureCard.web";
import FixtureCardPlaceholder from "../FixtureCard/FixtureCardPlaceholder.web";
import Card from "../Card/Card.web";
import styles from "./SportsbookBetLegCardGroup.web.css";

const BET_LEG_CARD_TYPENAME = "BetLegCard";
const STATS_BUTTONS_CARD_TYPENAME = "StatsSupportingContentButtonsCardGroup";
const RACE_DETAILS_CARD_TYPENAME = "RaceDetailsCard";
const CARDS_WITHOUT_PADDING = [RACE_DETAILS_CARD_TYPENAME, STATS_BUTTONS_CARD_TYPENAME];

const SportsbookBetLegCardGroup: FunctionComponent<ComponentProps> = ({
  cards,
  betURN,
  isSettled,
  isMutationEligible,
  statsSupportingContentButtonsUrn,
  dispatchSubscribeBlhResult,
  dispatchUnsubscribeBlhResult,
  dispatchSubscribeBmeResult,
  dispatchUnsubscribeBmeResult,
}) => {
  const { isIntersecting, ref } = useOnIntersect<HTMLDivElement>(null);
  const onIntersectCallback = useCallback<OnIntersectCallback>(
    (isIntersectingFlag) => {
      if (isIntersectingFlag && betURN) {
        dispatchSubscribeBlhResult(betURN);
        if (isMutationEligible) dispatchSubscribeBmeResult(betURN);
        return;
      }

      if (betURN) {
        dispatchUnsubscribeBlhResult(betURN);
        if (isMutationEligible) dispatchUnsubscribeBmeResult(betURN);
      }
    },
    [
      betURN,
      isMutationEligible,
      dispatchSubscribeBlhResult,
      dispatchUnsubscribeBlhResult,
      dispatchSubscribeBmeResult,
      dispatchUnsubscribeBmeResult,
    ],
  );

  useEffect(() => {
    if (!isSettled && onIntersectCallback) {
      onIntersectCallback(isIntersecting);
    }
  }, [onIntersectCallback, isIntersecting, isSettled]);

  const getCardStyle = (typename: string): string | undefined =>
    typename !== BET_LEG_CARD_TYPENAME
      ? classNames(
          styles.card,
          styles.supportingContentCard,
          !CARDS_WITHOUT_PADDING.includes(typename) && styles.supportingContentCardBox,
        )
      : styles.card;

  const getCardContainerStyle = (typename: string): string | undefined => {
    if (typename === STATS_BUTTONS_CARD_TYPENAME) {
      return undefined;
    }

    if (statsSupportingContentButtonsUrn) {
      return classNames(styles.supportingContentCardStatsContainer, styles.supportingContentCardContainer);
    }

    return typename !== BET_LEG_CARD_TYPENAME ? styles.supportingContentCardContainer : undefined;
  };

  const lastCardIndex = cards.length - 2;

  return (
    <div className={styles.container} ref={ref}>
      {cards.map(({ urn, typename }: PartialItem, index) => (
        <div key={urn} className={getCardContainerStyle(typename)}>
          <div className={getCardStyle(typename)}>
            {/* 
              Using a different fixture component to drop all unnecessary 
              data fetching for My Bets.
            */}
            {typename !== STATS_BUTTONS_CARD_TYPENAME &&
              (typename === "FixtureCard" ? (
                <ConnectedFixtureCard
                  urn={urn}
                  component={MyBetsFixtureCard}
                  placeholder={FixtureCardPlaceholder}
                  iconsList={undefined}
                />
              ) : (
                <ConnectedCard urn={urn} component={Card} typename={typename} />
              ))}
          </div>
          {typename === STATS_BUTTONS_CARD_TYPENAME && <StatsSupportingContentButtonsCardGroup urn={urn} />}
          {typename === BET_LEG_CARD_TYPENAME && index !== lastCardIndex && !statsSupportingContentButtonsUrn && (
            <div className={styles.dividerContainer}>
              <Divider />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SportsbookBetLegCardGroup;
