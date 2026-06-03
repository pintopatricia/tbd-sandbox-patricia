import { FunctionComponent } from "react";
import { IncidentIconSize } from "@ppb/the-wall-common/types";
import { IncidentIcon } from "@ppb/the-wall-web/components/bricks/IncidentIcon/IncidentIcon";
import classnames from "classnames";
import { Incident } from "../Incident/Incident.web";
import { IncidentEventsProps } from "./IncidentEvents.types";
import styles from "./IncidentEvents.web.css";

export const IncidentEvents: FunctionComponent<IncidentEventsProps> = ({
  homeIncidents,
  awayIncidents,
  categoryIcon,
}) => {
  if (homeIncidents.length === 0 && awayIncidents.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div
        className={classnames(
          styles.incidentColumn,
          categoryIcon ? styles.scoreboardVariantHomeColumn : styles.defaultVariantHomeColumn,
        )}
      >
        {homeIncidents.map((incident, index) => (
          <Incident key={`home-${index}`} {...incident} />
        ))}
      </div>

      {categoryIcon && (
        <div className={styles.iconContainer}>
          <IncidentIcon isHighlighted type={categoryIcon} size={IncidentIconSize.BIG} />
        </div>
      )}

      <div
        className={classnames(
          styles.incidentColumn,
          categoryIcon ? styles.scoreboardVariantAwayColumn : styles.defaultVariantAwayColumn,
        )}
      >
        {awayIncidents.map((incident, index) => (
          <Incident key={`away-${index}`} {...incident} />
        ))}
      </div>
    </div>
  );
};
