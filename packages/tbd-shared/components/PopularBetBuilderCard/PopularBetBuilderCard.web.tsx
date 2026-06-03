import { MouseEvent, useCallback, useMemo } from "react";
import * as React from "react";
import { Card, Divider, RichTextComponent, SecondaryButton } from "@ppb/the-wall-web";
import { ScoreboardViewMode, RichTextType } from "@ppb/the-wall-common/types";
import classNames from "classnames";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { AssetsIconName, ValueIconName } from "@ppb/the-wall-icons";
import { BubbleItem } from "./snowflakes/BubbleItem/BubbleItem.web";
import ConnectedBettingOpportunityBetButton from "../BettingOpportunityBetButton";
import BettingOpportunityBetButton from "../BettingOpportunityBetButton/BettingOpportunityBetButton.web";
import ConnectedPopularBetBuilderSelectionOdd from "./PopularBetBuilderSelectionOdd";
import PopularBetBuilderSelectionOdd from "./PopularBetBuilderSelectionOdd/PopularBetBuilderSelectionOdd.web";
import { ComponentProps } from "./props";
import FixtureHeader from "../FixtureHeader/FixtureHeader.web";
import ConnectedFixtureHeader from "../FixtureHeader";

import styles from "./PopularBetBuilderCard.web.css";
import { TimesBacked } from "../TimesBacked/TimesBacked.web";

const PopularBetBuilderCard: React.FC<ComponentProps> = ({
  bettingOpportunityType,
  showWasPrice,
  fixture,
  sportevent,
  timesBackedLabel,
  selections,
  items,
  bettingOpportunityUrn,
  cardUrn,
  viewLink,
  isRacing,
  marketTitle,
  cardTitle,
  dispatchNavigateToEvent,
  dispatchPushAction,
  dispatchNavigateToEventBetBuilderTab,
  tabViewLink,
  buildYourOwn,
  buildYourOwnBtnLabel,
}) => {
  const isSameEvent = !!(viewLink && fixture && sportevent);
  const canJumpBetBuilderTab = !!(viewLink && fixture && sportevent && tabViewLink);
  const isBoostedBets = bettingOpportunityType === "BOOSTED_BETS";

  const onClickHandler = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();

      if (isSameEvent) {
        dispatchNavigateToEvent(cardUrn, viewLink.viewUrl, selections[0].marketUrn);
        dispatchPushAction(viewLink);
      }
    },
    [cardUrn, dispatchNavigateToEvent, dispatchPushAction, isSameEvent, selections, viewLink],
  );

  const onBetBuilderButtonClickHandler = useCallback(() => {
    if (canJumpBetBuilderTab) {
      dispatchNavigateToEventBetBuilderTab(cardUrn, tabViewLink.viewUrl, selections[0].marketUrn);
      dispatchPushAction(tabViewLink);
    }
  }, [
    cardUrn,
    dispatchNavigateToEventBetBuilderTab,
    dispatchPushAction,
    selections,
    tabViewLink,
    canJumpBetBuilderTab,
  ]);

  const marketTitleRichTextList = useMemo(() => {
    if (marketTitle) {
      return [
        {
          type: RichTextType.HEADING5,
          text: marketTitle,
        },
      ];
    }

    return null;
  }, [marketTitle]);

  const cardTitleRichText = useMemo(() => {
    if (!cardTitle) {
      return [];
    }

    return [
      {
        type: RichTextType.HEADING5,
        text: cardTitle,
      },
    ];
  }, [cardTitle]);

  const headerStyles = classNames(styles.header, {
    [styles.headerFixture]: fixture,
  });

  const renderHeader = useMemo(() => {
    if (isSameEvent) {
      return (
        <header className={headerStyles}>
          <a className={styles.fixtureHeader} href={viewLink.viewUrl} onClick={onClickHandler}>
            <ConnectedFixtureHeader
              component={FixtureHeader}
              fixture={fixture}
              sporteventURN={sportevent}
              stickyOnScroll={false}
              showBottomSeparator={false}
              viewMode={ScoreboardViewMode.SMALL}
            />
          </a>
        </header>
      );
    }

    if (cardTitle) {
      return (
        <header className={styles.header}>
          {isBoostedBets && (
            <div className={styles.boostedIconContainer}>
              <div className={styles.boostedIcon}>
                <GenericIcon
                  name={ValueIconName.PRICE_BOOST}
                  color="var(--popular-bet-builder-card-header-boost-icon-colour)"
                />
              </div>
            </div>
          )}
          <RichTextComponent list={cardTitleRichText} />
        </header>
      );
    }

    if (timesBackedLabel) {
      return (
        <header className={styles.header}>
          <TimesBacked
            label={timesBackedLabel}
            icon={ValueIconName.POPULAR_BET_BUILDER}
            iconColor="var(--times-backed-icon-colour)"
          />
        </header>
      );
    }

    return null;
  }, [
    isSameEvent,
    cardTitle,
    cardTitleRichText,
    timesBackedLabel,
    onClickHandler,
    fixture,
    sportevent,
    isBoostedBets,
    viewLink,
    headerStyles,
  ]);

  return (
    <Card showShadow fullWidthContent>
      <article className={styles.popularBetBuilderCard}>
        {renderHeader && (
          <>
            {renderHeader}
            <Divider />
          </>
        )}
        <main className={styles.content}>
          {isSameEvent && timesBackedLabel && (
            <TimesBacked
              label={timesBackedLabel}
              icon={ValueIconName.POPULAR_BET_BUILDER}
              iconColor="var(--times-backed-icon-colour)"
            />
          )}

          {marketTitle && marketTitleRichTextList && <RichTextComponent list={marketTitleRichTextList} />}

          <div className={styles.bubbleItemsContainer}>
            {items.map((item, index) => (
              <BubbleItem
                key={index}
                title={item.title}
                titleIcon={item.titleIcon}
                titleIconFallback={item.titleIcon ? <GenericIcon name={AssetsIconName.SILK} /> : undefined}
                description={item.description}
                subDescription={item.subDescription}
                isLast={index === items.length - 1}
              >
                {item.selectionTypeIcon ? (
                  <div className={styles.selectionTypeIcon}>
                    <GenericIcon name={item.selectionTypeIcon} />
                  </div>
                ) : null}
                {!isBoostedBets && item.marketId && item.runnerUrn ? (
                  <ConnectedPopularBetBuilderSelectionOdd
                    component={PopularBetBuilderSelectionOdd}
                    cardUrn={cardUrn}
                    isRacing={isRacing}
                    marketId={item.marketId}
                    runnerUrn={item.runnerUrn}
                  />
                ) : null}
              </BubbleItem>
            ))}
          </div>

          {!!buildYourOwn && !!sportevent && (
            <SecondaryButton label={buildYourOwnBtnLabel} onTap={onBetBuilderButtonClickHandler} />
          )}

          <ConnectedBettingOpportunityBetButton
            component={BettingOpportunityBetButton}
            cardUrn={cardUrn}
            bettingOpportunityUrn={bettingOpportunityUrn}
            showWasPrice={showWasPrice}
            placeholder={() => <></>}
          />
        </main>
      </article>
    </Card>
  );
};

export default PopularBetBuilderCard;
