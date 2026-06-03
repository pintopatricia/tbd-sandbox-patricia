import { useEffect, useRef, useState } from "react";
import * as React from "react";
import { View } from "react-native";
import { Tooltip } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import styles from "./PlayersTooltip.native.styles";
import { useTooltip } from "./TooltipContext";
import { TOOLTIP_CONTAINER } from "./PlayersTooltip.native.selectors";

export const PlayersTooltip: React.FC = () => {
  const { visibleTooltipId, coords, tooltipText, closeTooltip, containerRef } = useTooltip();

  const tooltipRef = useRef<View>(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    if (containerRef?.current) {
      containerRef.current.measure((x, y, w, h) => {
        setContainerHeight(h);
      });
    }
  }, [containerRef, visibleTooltipId]);

  if (!visibleTooltipId) return null;

  const tooltipTop = coords?.pageY || 0;
  const isOverflowing = tooltipTop + tooltipHeight > containerHeight;

  return (
    <View
      style={{
        ...styles.tooltipContainer,
        ...(isOverflowing ? { bottom: 0 } : { top: tooltipTop }),
      }}
      ref={tooltipRef}
      onLayout={(e) => setTooltipHeight(e.nativeEvent.layout.height)}
      {...getTestProps(TOOLTIP_CONTAINER)}
    >
      <Tooltip title={tooltipText} onClosePress={closeTooltip} />
    </View>
  );
};
