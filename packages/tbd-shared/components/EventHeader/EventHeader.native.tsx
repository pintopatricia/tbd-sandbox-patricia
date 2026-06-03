import { FunctionComponent } from "react";
import { EventHeader as EventHeaderComponent } from "@ppb/the-wall-native";
import ConnectedNotificationsSubscription from "../NotificationsSubscription";
import NotificationsSubscription from "../NotificationsSubscription/NotificationsSubscription.native";
import { NotificationsViewMode } from "../NotificationsSubscription/map-to-props-factory";

import { ComponentProps } from "./props";
import useDebounce from "../../hooks/useDebounce";

const EventHeader: FunctionComponent<ComponentProps> = ({
  title,
  subtitle,
  inPlay,
  tertiaryTitle,
  isSticky,
  showBorder,
  availableToSubscribe,
  viewMode,
  homeRunnerName,
  awayRunnerName,
  date,
  time,
  sporteventURN,
  iconsList,
  showHorizontalDuration,
}) => {
  const notificationsSubscription = sporteventURN && availableToSubscribe && (
    <ConnectedNotificationsSubscription
      viewMode={NotificationsViewMode.EVENT_OR_RACE}
      component={NotificationsSubscription}
    />
  );

  const debouncedInplay = useDebounce<string | undefined>(inPlay, 1000);

  return (
    <EventHeaderComponent
      title={title}
      subtitle={subtitle}
      inPlay={debouncedInplay}
      tertiaryTitle={tertiaryTitle}
      isSticky={isSticky}
      showBorder={showBorder}
      notificationsSubscription={notificationsSubscription}
      viewMode={viewMode}
      homeRunnerName={homeRunnerName}
      awayRunnerName={awayRunnerName}
      date={date}
      time={time}
      iconsList={iconsList}
      showHorizontalDuration={showHorizontalDuration}
    />
  );
};

export default EventHeader;
