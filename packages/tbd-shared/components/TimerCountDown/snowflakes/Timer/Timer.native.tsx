import { FunctionComponent, useMemo } from "react";
import { View } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { Text } from "@ppb/the-wall-native";
import { TimerProps } from "./Timer.types";
import { TimeUnit } from "../TimeUnit/TimeUnit.native";
import { styles } from "./Timer.native.styles";
import { TIMER, TIMER_LABEL, TIMER_DAYS, TIMER_HOURS, TIMER_MINUTES } from "./Timer.native.selectors";

export const Timer: FunctionComponent<TimerProps> = ({ label, days, hours, minutes }) => {
  const renderDays = useMemo(() => {
    if (!days) {
      return null;
    }

    return (
      <>
        <TimeUnit value={days.value} label={days.label} {...getTestProps(TIMER_DAYS)} />
        {(hours || minutes) && <Text style={styles.timerSign}> </Text>}
      </>
    );
  }, [days, hours, minutes]);

  const renderHours = useMemo(() => {
    if (!hours) {
      return null;
    }

    return (
      <>
        <TimeUnit value={hours.value} label={hours.label} {...getTestProps(TIMER_HOURS)} />
        {minutes && <Text style={styles.timerSign}>:</Text>}
      </>
    );
  }, [hours, minutes]);

  const renderMinutes = useMemo(
    () => (minutes ? <TimeUnit value={minutes.value} label={minutes.label} {...getTestProps(TIMER_MINUTES)} /> : null),
    [minutes],
  );

  return (
    <View style={styles.timerContainer} {...getTestProps(TIMER)}>
      {label && (
        <Text style={styles.timerTopLabel} {...getTestProps(TIMER_LABEL)}>
          {label}
        </Text>
      )}
      <View style={styles.countDownTimer}>
        {renderDays}
        {renderHours}
        {renderMinutes}
      </View>
    </View>
  );
};
