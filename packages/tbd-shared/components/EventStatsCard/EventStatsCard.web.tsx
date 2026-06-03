import { FunctionComponent } from "react";

import { useDimensions } from "@ppb/the-wall-web/hooks/useDimensions";
import { ComponentProps } from "./props";
import styles from "./EventStatsCard.web.css";

/**
 * sets width and height params to the event stats URL according to the device dimensions
 */
const getEventStatsUrl = (url: URL, width: number, height: number): string => {
  url.searchParams.set("width", `${width}`);
  url.searchParams.set("height", `${height}`);

  return url.toString();
};

const EventStatsCard: FunctionComponent<ComponentProps> = ({ statsUrl, aspectRatio }) => {
  const { ref, width, height } = useDimensions(aspectRatio);
  const style = {
    width: `${width}px`,
    height: `${height}px`,
  };

  return (
    <div className={styles.eventStats} ref={ref}>
      {width && height && (
        <iframe scrolling="no" title="Event Stats" style={style} src={getEventStatsUrl(statsUrl, width, height)} />
      )}
    </div>
  );
};

export default EventStatsCard;
