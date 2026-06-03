import { BetslipStep } from "@ppb/tbd-store";
import { BetslipType } from "@ppb/tbd-store/state/constants";
import { heights, tokens } from "@ppb/the-wall-common/base-theme";
import { SystemIconName } from "@ppb/the-wall-icons";
import { Overlay, ReceiptTitle } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { FunctionComponent, useMemo } from "react";
import { Dimensions, Pressable, View } from "react-native";
import { initialWindowMetrics } from "react-native-safe-area-context";
import { useHeaderSize } from "../../../../Header/hooks/useHeaderSize.native";
import ConnectedObbBetslip from "../../../ObbBetslip";
import { ObbBetslip } from "../../../ObbBetslip/ObbBetslip.native";
import ConnectedSportsbookBetslip from "../../../SportsbookBetslip";
import { SportsbookBetslip } from "../../../SportsbookBetslip/SportsbookBetslip.native";
import { BETSLIP_DRAWER, BETSLIP_DRAWER_CONTENT, BETSLIP_DRAWER_HEADER } from "./BetslipDrawer.native.selectors";
import styles from "./BetslipDrawer.native.styles";

type BetslipDrawerProps = {
  title: string;
  step: BetslipStep;
  activeBetslipType: BetslipType | null;
  onClose: () => void;
};

/**
 * Calculate max height for the scrollable area on betslip
 */
const DEFAULT_HEADER_HEIGHT = 124;

const calculateContentMaxHeight = (headerHeight = DEFAULT_HEADER_HEIGHT): number => {
  // top inset: status bar height (with or without notch)
  // bottom inset: soft nav bar height
  const { top, bottom } = initialWindowMetrics?.insets || { top: 0, bottom: 0 };

  const device = top + bottom;
  const application =
    heights["betslip-top-offset"] + tokens.BottomBarHeightSizing + heights["expandable-handle-height"];

  return Dimensions.get("screen").height - device - application - headerHeight;
};

export const BetslipDrawer: FunctionComponent<BetslipDrawerProps> = ({ title, step, activeBetslipType, onClose }) => {
  const content = useMemo(() => {
    if (activeBetslipType === BetslipType.OBB) {
      return <ConnectedObbBetslip component={ObbBetslip} />;
    }

    return <ConnectedSportsbookBetslip component={SportsbookBetslip} />;
  }, [activeBetslipType]);

  const headerSize = useHeaderSize();
  const contentStyle = useMemo(() => ({ maxHeight: calculateContentMaxHeight(headerSize?.height) }), [headerSize]);

  return (
    <View {...getTestProps(BETSLIP_DRAWER, false)} style={styles.betslipDrawerWrapper} accessibilityViewIsModal>
      <View style={styles.betslipDrawerOverlay}>
        <Overlay onOutsideTap={onClose} />
      </View>
      <View style={styles.betslipDrawer}>
        <Pressable {...getTestProps(BETSLIP_DRAWER_HEADER)} onPress={onClose}>
          <ReceiptTitle
            title={title}
            icon={step === "REPORT" ? SystemIconName.CLOSE : SystemIconName.CHEVRON_DOWN}
            onButtonPress={onClose}
          />
        </Pressable>
        <View {...getTestProps(BETSLIP_DRAWER_CONTENT, false)} style={contentStyle}>
          {content}
        </View>
      </View>
    </View>
  );
};
