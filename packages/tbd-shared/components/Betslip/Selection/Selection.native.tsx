import { FunctionComponent, useCallback, useMemo } from "react";

import { BetSelectionDetails, SilkWrapper, TrapWrapper } from "@ppb/the-wall-native";
import { FallbackIconType } from "@ppb/the-wall-common/types";
import { RacingSport } from "@ppb/tbd-store";
import { ComponentProps } from "./props";

export const Selection: FunctionComponent<ComponentProps> = ({
  urn,
  id,
  title,
  subtitle,
  icon,
  meetingCountry,
  trap,
  silkFallbackType,
  racingSport,
  odd,
  oddsMovement,
  hintMessage,
  hintType,
  isReadOnly,
  isPlacing,
  isTrapIconThrottleActive,
  is90Min,
  selectionTypeIcon,
  dispatchSelectionRemove,
}) => {
  const onSelectionRemove = useCallback(
    () => urn && dispatchSelectionRemove(id, urn),
    [dispatchSelectionRemove, id, urn],
  );

  const IconComponent = useMemo(() => {
    if (racingSport === RacingSport.HORSE_RACING) {
      return <SilkWrapper silkUrl={icon} silkFallbackType={silkFallbackType as FallbackIconType} silkAlt={icon} />;
    }

    if (racingSport === RacingSport.GREYHOUND_RACING && trap && isTrapIconThrottleActive) {
      return <TrapWrapper region={meetingCountry ?? "AGNOSTIC"} trap={trap} size="small" />;
    }

    return undefined;
  }, [racingSport, trap, isTrapIconThrottleActive, icon, silkFallbackType, meetingCountry]);

  if (!urn) {
    return null;
  }

  return (
    <BetSelectionDetails
      key={id}
      title={title}
      subtitle={subtitle}
      icon={IconComponent}
      odd={odd}
      isPlacing={isPlacing}
      oddsMovement={oddsMovement}
      hintMessage={hintMessage}
      hintType={hintType}
      onSelectionRemove={isReadOnly ? undefined : onSelectionRemove}
      is90Min={is90Min}
      selectionTypeIcon={selectionTypeIcon}
    />
  );
};
