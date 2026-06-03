import { FunctionComponent, useCallback, useMemo } from "react";
import { BetSelectionDetails, SilkWrapper, TrapWrapper } from "@ppb/the-wall-web";
import { FallbackIconType } from "@ppb/the-wall-common/types";
import { RacingSport } from "@ppb/tbd-store";
import { ComponentProps } from "./props";

export const Selection: FunctionComponent<ComponentProps> = ({
  urn,
  id,
  title,
  subtitle,
  racingSport,
  trap,
  meetingCountry,
  icon,
  silkFallbackType,
  odd,
  oddsMovement,
  hintMessage,
  hintType,
  isReadOnly,
  isPlacing,
  is90Min,
  selectionTypeIcon,
  isTrapIconThrottleActive,
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
      oddsMovement={oddsMovement}
      hintMessage={hintMessage}
      hintType={hintType}
      onSelectionRemove={isReadOnly ? undefined : onSelectionRemove}
      isPlacing={isPlacing}
      is90Min={is90Min}
      selectionTypeIcon={selectionTypeIcon}
    />
  );
};
