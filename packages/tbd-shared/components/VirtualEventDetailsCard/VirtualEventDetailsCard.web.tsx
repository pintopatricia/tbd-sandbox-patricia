import { useMemo, FunctionComponent } from "react";
import { RaceDetails } from "@ppb/the-wall-web";

import { VirtualFootballScoreboard } from "./snowflakes/VirtualFootballScoreboard/VirtualFootballScoreboard.web";
import { ComponentProps, KindComponentProps } from "./props";
import { FootballCardProps, RacingCardProps, VirtualEventKind } from "./map-to-props-factory";
import styles from "./VirtualEventDetailsCard.web.css";
import { VirtualFootballScoreboardProps } from "./snowflakes/VirtualFootballScoreboard/VirtualFootballScoreboard.types";

const RacingDetailsCard: FunctionComponent<KindComponentProps<RacingCardProps>> = ({
  showMeetingInfo,
  startTime,
  venue,
  name,
  distance,
}) => (
  <div className={styles.raceDetailsContainer}>
    <RaceDetails
      showMeetingInfo={showMeetingInfo}
      raceTime={startTime}
      meetingName={venue}
      raceName={name}
      distance={distance}
      isHighlighted
    />
  </div>
);

/** FootballScoreboard replacement with VirtualFootballScoreboard is supposed to be
 * a quickFix to white text on no-background for SBG Virtuals
 * Correct implementation is being addressed with implementation of Highlighted variant for Team
 * in "Blue Stats" scope
 */

const FootballDetailsCard: FunctionComponent<KindComponentProps<FootballCardProps>> = ({ home, away }) => {
  const teamProps = useMemo<Pick<VirtualFootballScoreboardProps, "home" | "away">>(
    () => ({ home: { name: home }, away: { name: away } }),
    [home, away],
  );
  return <VirtualFootballScoreboard {...teamProps} />;
};

const VirtualEventDetailsCard: FunctionComponent<ComponentProps> = (props) => (
  <div className={styles.container}>
    {props.kind === VirtualEventKind.Racing && <RacingDetailsCard {...props} />}
    {props.kind === VirtualEventKind.Football && <FootballDetailsCard {...props} />}
  </div>
);

export default VirtualEventDetailsCard;
