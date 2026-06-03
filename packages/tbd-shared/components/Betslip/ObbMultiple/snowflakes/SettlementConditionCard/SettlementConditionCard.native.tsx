import { FunctionComponent, useState, useCallback } from "react";
import { View } from "react-native";
import { StatusLabel, Slider, Text } from "@ppb/the-wall-native";
import { StatusLabelType, StatusLabelSizeType, SliderDirection, SliderSource } from "@ppb/the-wall-common/types";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { SettlementConditionCardProps } from "./SettlementConditionCard.types";
import { i18n } from "../../../../../helpers/i18n";
import styles from "./SettlementConditionCard.native.styles";
import { CONTAINER, TITLE, LABEL } from "./SettlementConditionCard.native.selectors";

export const SettlementConditionCard: FunctionComponent<SettlementConditionCardProps> = ({
  showStatusLabel,
  potentialBets,
  readOnlyProps,
  onChange,
  defaultSliderStep,
}) => {
  const isReadOnly = !!readOnlyProps;
  const totalSteps = potentialBets?.length ?? 0;
  const [selectedStep, setSelectedStep] = useState<number | null>(
    isReadOnly ? null : defaultSliderStep ?? totalSteps - 1,
  );
  const [prevDefaultSliderStep, setPrevDefaultSliderStep] = useState(defaultSliderStep);
  if (prevDefaultSliderStep !== defaultSliderStep) {
    setPrevDefaultSliderStep(defaultSliderStep);
    if (defaultSliderStep !== undefined) {
      setSelectedStep(defaultSliderStep);
    }
  }

  const handleSliderChange = useCallback(
    (step: number, direction?: SliderDirection, source?: SliderSource) => {
      setSelectedStep(step);

      if (potentialBets && onChange) {
        onChange(potentialBets[step].id, direction, source);
      }
    },
    [potentialBets, onChange],
  );

  const selectionsToWin = isReadOnly ? readOnlyProps.selectionsToWin : potentialBets?.[selectedStep as number]?.x;
  const totalSelections = isReadOnly ? readOnlyProps.totalSelections : totalSteps;

  return (
    <View style={styles.container} {...getTestProps(CONTAINER)}>
      <View style={styles.titleRow}>
        <View style={styles.titleLeft}>
          <Text style={styles.title} {...getTestProps(TITLE)}>
            {i18n({ key: "I18N.BETSLIP.OBB.SELECTIONS_TO_WIN" })}
          </Text>
          {showStatusLabel && (
            <StatusLabel
              text={i18n({ key: "I18N.COMMON.NEW" })}
              statusLabelType={StatusLabelType.COMPLIMENTARY}
              statusLabelSize={StatusLabelSizeType.SMALL}
            />
          )}
        </View>
        <Text style={styles.label} {...getTestProps(LABEL)}>
          {i18n({
            key: "I18N.BETSLIP.OBB.X_OF_N",
            interpolationValues: { x: selectionsToWin ?? 0, n: totalSelections ?? 0 },
          })}
        </Text>
      </View>

      {!isReadOnly && totalSteps > 1 && (
        <Slider steps={totalSteps} initialStep={defaultSliderStep} onChange={handleSliderChange} debounce={200} />
      )}
    </View>
  );
};
