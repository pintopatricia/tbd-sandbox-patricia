import { FunctionComponent, useMemo, useState } from "react";
import { View } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";
import { SystemIconName } from "@ppb/the-wall-icons";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { BetInfo, Collapse, Text } from "@ppb/the-wall-native";
import { BetInfoCollapseProps } from "./BetInfoCollapse.types";
import { i18n } from "../../helpers/i18n";
import styles from "./BetInfoCollapse.native.styles";
import {
  BET_INFO_COLLAPSE,
  BET_INFO_COLLAPSE_HEADER,
  BET_INFO_COLLAPSE_HEADER_ICON,
  BET_INFO_COLLAPSE_HEADER_TITLE,
} from "./BetInfoCollapse.native.selectors";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";

export const BetInfoCollapse: FunctionComponent<BetInfoCollapseProps> = ({ items }) => {
  const [isOpen, setIsOpen] = useState(false);

  const chevronIconName = isOpen ? SystemIconName.CHEVRON_UP : SystemIconName.CHEVRON_DOWN;

  const header = useMemo(
    () => (
      <View style={styles.betInfoHeader} {...getTestProps(BET_INFO_COLLAPSE_HEADER, false)}>
        <Text style={styles.betInfoHeaderTitle} {...getTestProps(BET_INFO_COLLAPSE_HEADER_TITLE)}>
          {i18n({ key: "I18N.MY_BETS.BET_DETAILS" })}
        </Text>
        <View style={styles.betInfoHeaderIcon} {...getTestProps(BET_INFO_COLLAPSE_HEADER_ICON, false)}>
          <GenericIcon name={chevronIconName} color={tokens.CardHeaderTransparentIconColour} />
        </View>
      </View>
    ),
    [chevronIconName],
  );

  return (
    <View {...getTestProps(BET_INFO_COLLAPSE, false)}>
      <Collapse header={header} isOpen={isOpen} setIsOpen={setIsOpen}>
        <BetInfo items={items} />
      </Collapse>
    </View>
  );
};
