import { FunctionComponent, MouseEvent, useCallback } from "react";
import classnames from "classnames";
import ConnectedFixtureHeader from "../../FixtureHeader";
import FixtureHeader from "../../FixtureHeader/FixtureHeader.web";
import { ComponentProps } from "../props";
import styles from "../FixtureCard.web.css";
import { ScoreboardViewMode } from "@ppb/the-wall-common/types";

const MyBetsFixtureCard: FunctionComponent<ComponentProps> = ({
  dispatchNavigateToEventFromMarketScoreboard,
  dispatchPushAction,
  eventViewLink,
  eventName,
  ...props
}) => {
  const isDisabledLink = !eventViewLink;

  const linkStyle = classnames(styles.fixtureCard, { [styles.disabledLink]: isDisabledLink });
  const href = eventViewLink?.viewUrl;

  const onClick = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();

      if (!isDisabledLink) {
        dispatchNavigateToEventFromMarketScoreboard(eventViewLink, eventName);
        dispatchPushAction(eventViewLink);
      }
    },
    [isDisabledLink, dispatchNavigateToEventFromMarketScoreboard, eventViewLink, eventName, dispatchPushAction],
  );

  return (
    <a href={href} onClick={onClick} className={linkStyle}>
      <ConnectedFixtureHeader
        fixture={props.fixture}
        sporteventURN={props.sporteventURN}
        viewMode={ScoreboardViewMode.COUPON}
        stickyOnScroll={false}
        showBottomSeparator={false}
        showEventDateBelow={props.showEventDateBelow}
        showHorizontalDuration={false}
        component={FixtureHeader}
      />
    </a>
  );
};

export default MyBetsFixtureCard;
