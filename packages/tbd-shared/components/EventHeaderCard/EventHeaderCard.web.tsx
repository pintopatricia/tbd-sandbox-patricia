import { FunctionComponent } from "react";
import { EventHeader } from "@ppb/the-wall-web";
import { EventHeaderViewMode } from "@ppb/the-wall-common/types";
import { ComponentProps } from "./props";

const EventHeaderCard: FunctionComponent<ComponentProps> = (props) => {
  if (props.title) {
    return (
      <EventHeader
        title={props.title}
        subtitle={props.subtitle || ""}
        tertiaryTitle={props.tertiaryTitle}
        viewMode={EventHeaderViewMode.COUPON}
        date={props.date}
        time={props.time}
        dateTime={props.dateTime}
      />
    );
  }

  return null;
};

export default EventHeaderCard;
