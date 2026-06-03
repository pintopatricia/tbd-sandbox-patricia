import { FunctionComponent } from "react";
import classnames from "classnames";

import { Sport } from "@ppb/the-wall-common/types/VirtualSport.types";
import { VirtualSilk } from "@ppb/the-wall-common/icons/Virtuals/VirtualSilk";
import { VirtualRunnerProps } from "./VirtualRunner.types";
import styles from "./VirtualRunner.web.css";

export const VirtualRunner: FunctionComponent<VirtualRunnerProps> = ({
  children,
  number,
  name,
  sportId,
  showSilk,
  humanTexture,
  description,
}) => {
  const silkClassname = classnames({
    [styles.horseRacing]: [Sport.HorsesFlat, Sport.HorsesJumps, Sport.HorsesSprint].includes(sportId),
    [styles.square]: [Sport.Greyhounds, Sport.MotorRacing].includes(sportId),
    [styles.football]: [Sport.ClubFootball, Sport.WorldCup].includes(sportId),
  });

  return (
    <div className={styles.virtualRunnerLine}>
      <div className={styles.virtualRunnerInnerContainer} role="presentation">
        {number && (
          <div className={styles.leftColumn}>
            <p className={`typography-h158 ${styles.virtualRunnerNumber}`}>{number}</p>
          </div>
        )}
        {showSilk && (
          <div className={styles.imageContainer}>
            {humanTexture ? (
              <div className={silkClassname}>
                <VirtualSilk sportId={sportId} humanTexture={humanTexture} />
              </div>
            ) : (
              <div className={silkClassname} />
            )}
          </div>
        )}
        <div className={styles.informationContainer}>
          <p className={`typography-h152`}>{name}</p>
          {description && <p className={`typography-h120 ${styles.description}`}>{description}</p>}
        </div>
      </div>
      {children}
    </div>
  );
};
