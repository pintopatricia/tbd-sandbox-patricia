import { Fragment, FunctionComponent, useCallback } from "react";
import { ActionLink, Divider } from "@ppb/the-wall-web";
import { ActionLinkTypography, ScoreboardViewMode, ViewLink } from "@ppb/the-wall-common/types";
import classNames from "classnames";
import { MatchStatSelection } from "../MatchStatSelectionCard/snowflakes/MatchStatSelection/MatchStatSelection.web";
import styles from "./ObbCreatedBetsCard.web.css";
import ConnectedFixtureHeader from "../FixtureHeader";
import FixtureHeader from "../FixtureHeader/FixtureHeader.web";
import ConnectedObbBetButton from "../ObbBetButton";
import ObbBetButton from "../ObbBetButton/ObbBetButton.web";
import { ComponentProps } from "./ObbCreatedBetsCard.props";

const ObbCreatedBetsCard: FunctionComponent<ComponentProps> = ({
  urn,
  fixtureUrn,
  eventUrn,
  eventName,
  footerViewLink,
  footerLabel,
  eventViewLink,
  bettingOpportunities,
  isEventInPlay,
  fullWidth,
  position,
  cardIndex,
  dispatchPushAction,
  dispatchInactiveObbBetButtonClick,
  dispatchLinkClick,
}) => {
  const handleLinkClick = useCallback(
    (viewLink: ViewLink, label?: string) => {
      if (isEventInPlay) {
        dispatchInactiveObbBetButtonClick();
        return;
      }
      dispatchLinkClick(viewLink, urn, label, eventName, cardIndex);
      dispatchPushAction(viewLink);
    },
    [
      isEventInPlay,
      dispatchLinkClick,
      urn,
      eventName,
      cardIndex,
      dispatchPushAction,
      dispatchInactiveObbBetButtonClick,
    ],
  );

  return (
    <div
      className={classNames(styles.card, {
        [styles.fullWidthCard]: fullWidth,
      })}
    >
      <button className={styles.header} onClick={() => handleLinkClick(eventViewLink, eventName)}>
        <ConnectedFixtureHeader
          fixture={fixtureUrn}
          sporteventURN={eventUrn}
          viewMode={ScoreboardViewMode.SMALL}
          showBottomSeparator={false}
          showEventDateBelow={true}
          showHorizontalDuration={false}
          component={FixtureHeader}
        />
      </button>

      <div className={styles.outcomesContainer}>
        {bettingOpportunities.map((opportunity, index) => (
          <Fragment key={opportunity.legId}>
            <MatchStatSelection
              title={[<span key={opportunity.legId}>{opportunity.title}</span>]}
              subtitle={opportunity.subtitle}
              stats={opportunity.statsLabel}
            >
              <ConnectedObbBetButton
                cardUrn={urn}
                eventName={eventName}
                legId={opportunity.legId}
                showSecondaryLabel={false}
                onClick={isEventInPlay ? () => dispatchInactiveObbBetButtonClick(opportunity.legTemplateId) : undefined}
                status={isEventInPlay ? "closed" : undefined}
                position={position}
                component={ObbBetButton}
              />
            </MatchStatSelection>
            {index < bettingOpportunities.length - 1 && <Divider />}
          </Fragment>
        ))}
      </div>

      <Divider />
      <div className={styles.seeAllContainer}>
        <ActionLink
          onClick={() => handleLinkClick(footerViewLink, footerLabel)}
          disabled={isEventInPlay}
          text={footerLabel}
          typography={ActionLinkTypography.Regular}
          noPadding
        />
      </div>
    </div>
  );
};

export default ObbCreatedBetsCard;
