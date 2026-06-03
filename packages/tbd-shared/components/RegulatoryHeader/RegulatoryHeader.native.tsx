import { FunctionComponent, useContext, useEffect } from "react";
import { Platform } from "react-native";

import { CetContext } from "@flutter-global/react-native-cet-framework";
import { Item } from "@ppb/tbd-store/state/layout/cards/regulatory-sections/RegulatorySections.types";
import { RegulatoryHeader as RegulatoryHeaderComponent } from "./snowflakes/RegulatoryHeader/RegulatoryHeader.native";
import { ComponentProps } from "./props";

const RegulatoryHeader: FunctionComponent<ComponentProps> = ({ regulatorySections, isDenmarkJurisdiction = false }) => {
  const { setSessionTime } = useContext(CetContext);
  const isFixedHeight = isDenmarkJurisdiction && Platform.OS === "android";

  useEffect(() => {
    if (regulatorySections && regulatorySections.length) {
      for (let i = 0; i < regulatorySections.length; i += 1) {
        for (let j = 0; j < regulatorySections[i].items.length; j += 1) {
          const item: Item = regulatorySections[i].items[j];
          if (item.type === "SESSION") {
            setSessionTime(item.time);
          }
        }
      }
    }
  }, [regulatorySections, setSessionTime]);

  return regulatorySections?.length ? (
    <RegulatoryHeaderComponent regulatorySections={regulatorySections} isFixedHeight={isFixedHeight} />
  ) : null;
};

export default RegulatoryHeader;
