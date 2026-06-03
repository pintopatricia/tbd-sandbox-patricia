import { FunctionComponent, useMemo } from "react";
import { ForecastTricastSelection, SilkWrapper, TrapWrapper } from "@ppb/the-wall-native";
import { RacingSport } from "@ppb/tbd-store";
import { FallbackIconType } from "@ppb/the-wall-common/types";
import { ComponentProps } from "./props";

export const CastRunner: FunctionComponent<ComponentProps> = ({
  horse,
  icon,
  meetingCountry,
  trap,
  racingSport,
  silkFallbackType,
  position,
  positionOrdinal,
  isTrapIconThrottleActive,
}) => {
  const IconComponent = useMemo(() => {
    if (racingSport === RacingSport.HORSE_RACING) {
      return (
        <SilkWrapper silkUrl={icon as string} silkFallbackType={silkFallbackType as FallbackIconType} silkAlt={horse} />
      );
    }

    if (racingSport === RacingSport.GREYHOUND_RACING && trap && isTrapIconThrottleActive) {
      return <TrapWrapper region={meetingCountry ?? "AGNOSTIC"} trap={trap} size="small" />;
    }

    return undefined;
  }, [racingSport, trap, isTrapIconThrottleActive, icon, silkFallbackType, horse, meetingCountry]);

  return (
    <ForecastTricastSelection
      horse={horse}
      icon={IconComponent}
      position={position}
      positionOrdinal={positionOrdinal}
    />
  );
};
