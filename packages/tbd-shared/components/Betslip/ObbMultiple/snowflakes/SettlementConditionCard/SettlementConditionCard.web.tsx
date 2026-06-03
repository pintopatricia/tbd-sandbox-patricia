import { FunctionComponent, useState, useCallback } from "react";
import { StatusLabel, Slider } from "@ppb/the-wall-web";
import { StatusLabelType, StatusLabelSizeType, SliderDirection, SliderSource } from "@ppb/the-wall-common/types";
import { SettlementConditionCardProps } from "./SettlementConditionCard.types";
import { i18n } from "../../../../../helpers/i18n";
import styles from "./SettlementConditionCard.web.css";

export const SettlementConditionCard: FunctionComponent<SettlementConditionCardProps> = ({
  showStatusLabel,
  potentialBets,
  readOnlyProps,
  defaultSliderStep,
  onChange,
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
    <div className={styles.container}>
      <div className={styles.titleRow}>
        <div className={styles.titleLeft}>
          <p className={styles.title}>{i18n({ key: "I18N.BETSLIP.OBB.SELECTIONS_TO_WIN" })}</p>
          {showStatusLabel && (
            <StatusLabel
              text={i18n({ key: "I18N.COMMON.NEW" })}
              statusLabelType={StatusLabelType.COMPLIMENTARY}
              statusLabelSize={StatusLabelSizeType.SMALL}
            />
          )}
        </div>
        <span className={styles.label}>
          {i18n({
            key: "I18N.BETSLIP.OBB.X_OF_N",
            interpolationValues: { x: selectionsToWin ?? 0, n: totalSelections ?? 0 },
          })}
        </span>
      </div>
      {!isReadOnly && totalSteps > 1 && (
        <Slider steps={totalSteps} initialStep={defaultSliderStep} onChange={handleSliderChange} debounce={200} />
      )}
    </div>
  );
};
