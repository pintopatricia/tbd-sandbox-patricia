import { FunctionComponent } from "react";
import classnames from "classnames";
import { JackpotProps, JackpotState } from "@ppb/tbd-store/state/entities/Gaming.types";
import { ColdDiamond } from "../ColdDiamond/ColdDiamond.web";
import { HotDiamond } from "../HotDiamond/HotDiamond.web";
import { RedDiamonds } from "../RedDiamonds/RedDiamonds.web";
import { WhiteDiamonds } from "../WhiteDiamonds/WhiteDiamonds.web";
import styles from "./JackpotMerchandise.web.css";
import { Jackpot } from "../Jackpot/Jackpot.web";

type JackpotMerchandiseProps = {
  state: JackpotState;
  logoUrl: string;
  items: JackpotProps[];
};

export const JackpotMerchandise: FunctionComponent<JackpotMerchandiseProps> = ({ state, logoUrl, items }) => {
  const isHotState = state === "HOT";

  return (
    <div
      className={classnames(styles.jackpotMerchandiseContainer, {
        [styles.hotStatus]: isHotState,
      })}
    >
      <div className={classnames(styles.diamond)}>{isHotState ? <HotDiamond /> : <ColdDiamond />}</div>

      <div className={styles.backgroundDiamonds}>{isHotState ? <RedDiamonds /> : <WhiteDiamonds />}</div>
      <div className={styles.content}>
        <div className={classnames(styles.logo)}>
          <img className={styles.logoImg} src={logoUrl} alt="Jackpot Logo" />
        </div>
        <div className={styles.jackpots}>
          {items.map((item, index) => (
            <div key={index} className={classnames(styles.jackpotItem)}>
              <Jackpot {...item} hasBigTitle={index === 0} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
