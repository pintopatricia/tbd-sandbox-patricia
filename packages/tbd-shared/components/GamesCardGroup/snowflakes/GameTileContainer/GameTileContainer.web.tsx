import { FunctionComponent } from "react";
import classnames from "classnames";

import { GameTileContainerLayout, GameTileContainerProps } from "./GameTileContainerLayout.types";
import styles from "./GameTileContainer.web.css";

export const GameTileContainer: FunctionComponent<GameTileContainerProps> = ({ layout, children, cardRef }) => (
  <div
    ref={cardRef}
    className={classnames(layout === GameTileContainerLayout.RECTANGLE && styles.rectangle, styles.gameTileContainer)}
  >
    {children}
  </div>
);
