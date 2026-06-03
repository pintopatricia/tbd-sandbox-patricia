import { FunctionComponent, useCallback } from "react";
import useStatsSupportingContentButtonsCardGroupVM from "../viewmodel/StatsSupportingContentButtonsCardGroup.viewmodel";
import { Props } from "./StatsSupportingContentButtonsCardGroup.types";
import SupportingContentCardGroup from "../snowflakes/SupportingContentCardGroup/SupportingContentCardGroup.native";

const StatsSupportingContentButtonsCardGroup: FunctionComponent<Props> = ({ urn, visible = true }) => {
  const {
    vm: { data: vmData, events },
  } = useStatsSupportingContentButtonsCardGroupVM(urn, visible);

  const onSupportingContentButtonPress = useCallback(
    (buttonId: string, isSelected: boolean) => {
      events.onButtonsStatsPress(urn, buttonId, isSelected);
    },
    [events, urn],
  );

  if (!vmData?.items?.length) {
    return null;
  }

  return (
    <SupportingContentCardGroup
      items={vmData.items}
      visible={visible}
      onSupportingContentButtonPress={onSupportingContentButtonPress}
    />
  );
};

export default StatsSupportingContentButtonsCardGroup;
