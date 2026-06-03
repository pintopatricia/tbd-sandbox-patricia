import { FunctionComponent, useMemo } from "react";
import { BetslipStep } from "@ppb/tbd-store";
import { BetslipType } from "@ppb/tbd-store/state/constants";
import { ReceiptTitle } from "@ppb/the-wall-web";
import { Drawer } from "@ppb/the-wall-web/components/walls/Drawer/Drawer";
import { SystemIconName } from "@ppb/the-wall-icons";
import classNames from "classnames";
import ConnectedSportsbookBetslip from "../../../SportsbookBetslip";
import { SportsbookBetslip } from "../../../SportsbookBetslip/SportsbookBetslip.web";
import ConnectedObbBetslip from "../../../ObbBetslip";
import { ObbBetslip } from "../../../ObbBetslip/ObbBetslip.web";
import styles from "./BetslipDrawer.web.css";

type BetslipDrawerProps = {
  title: string;
  step: BetslipStep;
  activeBetslipType: BetslipType | null;
  onClose: () => void;
};

export const BetslipDrawer: FunctionComponent<BetslipDrawerProps> = ({ title, activeBetslipType, step, onClose }) => {
  const content = useMemo(() => {
    if (activeBetslipType === BetslipType.OBB) {
      return <ConnectedObbBetslip component={ObbBetslip} />;
    }

    return <ConnectedSportsbookBetslip component={SportsbookBetslip} />;
  }, [activeBetslipType]);

  const names = classNames(styles.contentContainer, styles.contentContainer2);

  return (
    <Drawer onOutsideTap={onClose} customStyle={names}>
      <button className={styles.header} onClick={onClose}>
        <ReceiptTitle
          title={title}
          icon={step === "REPORT" ? SystemIconName.CLOSE : SystemIconName.CHEVRON_DOWN}
          onButtonClick={onClose}
        />
      </button>
      <div>{content}</div>
    </Drawer>
  );
};
