import { IncidentIconType } from "@ppb/the-wall-common/types";
import { IncidentProps } from "../Incident/Incident.types";

export type IncidentEventsProps = {
  homeIncidents: IncidentProps[];
  awayIncidents: IncidentProps[];
  categoryIcon?: IncidentIconType;
};
