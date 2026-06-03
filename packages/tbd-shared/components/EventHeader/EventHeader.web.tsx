import { FunctionComponent } from "react";
import { EventHeader as EventHeaderComponent } from "@ppb/the-wall-web";
import { ComponentProps } from "./props";
import useDebounce from "../../hooks/useDebounce";

const EventHeader: FunctionComponent<ComponentProps> = ({
  title,
  subtitle,
  inPlay,
  tertiaryTitle,
  isSticky,
  showBorder,
  viewMode,
  homeRunnerName,
  awayRunnerName,
  date,
  time,
  dateTime,
  iconsList,
  showHorizontalDuration,
}) => {
  const debouncedInplay = useDebounce<string | undefined>(inPlay, 1000);

  return (
    <EventHeaderComponent
      title={title}
      subtitle={subtitle}
      inPlay={debouncedInplay}
      tertiaryTitle={tertiaryTitle}
      isSticky={isSticky}
      showBorder={showBorder}
      viewMode={viewMode}
      homeRunnerName={homeRunnerName}
      awayRunnerName={awayRunnerName}
      date={date}
      time={time}
      dateTime={dateTime}
      iconsList={iconsList}
      showHorizontalDuration={showHorizontalDuration}
    />
  );
};

export default EventHeader;
