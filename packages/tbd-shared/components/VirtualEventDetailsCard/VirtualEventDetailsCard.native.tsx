import { FunctionComponent, useMemo } from "react";
import { View } from "react-native";
import { RaceDetails } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { ComponentProps, KindComponentProps } from "./props";
import { VirtualFootballScoreboard } from "./snowflakes/VirtualFootballScoreboard/VirtualFootballScoreboard.native";
import { VIRTUAL_EVENT_DETAILS_CARD } from "./VirtualEventDetailsCard.native.selectors";
import { FootballCardProps, RacingCardProps, VirtualEventKind } from "./map-to-props-factory";
import styles from "./VirtualEventDetailsCard.native.styles";
import { VirtualFootballScoreboardProps } from "./snowflakes/VirtualFootballScoreboard/VirtualFootballScoreboard.types";

const RacingDetailsCard: FunctionComponent<KindComponentProps<RacingCardProps>> = ({
  startTime,
  venue,
  name,
  showMeetingInfo,
  distance,
}) => (
  <View style={styles.raceDetailsContainer}>
    <RaceDetails
      raceTime={startTime}
      meetingName={venue}
      raceName={name}
      showMeetingInfo={showMeetingInfo}
      distance={distance}
      isHighlighted
    />
  </View>
);

const FootballDetailsCard: FunctionComponent<KindComponentProps<FootballCardProps>> = ({ home, away }) => {
  const teamProps = useMemo<Pick<VirtualFootballScoreboardProps, "home" | "away">>(
    () => ({ home: { name: home }, away: { name: away } }),
    [home, away],
  );

  return <VirtualFootballScoreboard {...teamProps} />;
};

const VirtualEventDetailsCard: FunctionComponent<ComponentProps> = (props) => (
  <View {...getTestProps(VIRTUAL_EVENT_DETAILS_CARD, false)}>
    {props.kind === VirtualEventKind.Racing && <RacingDetailsCard {...props} />}
    {props.kind === VirtualEventKind.Football && <FootballDetailsCard {...props} />}
  </View>
);

export default VirtualEventDetailsCard;
