import { ComponentTheme } from "@ppb/the-wall-common/types";
import { RadioList, SegmentedControl, SwitchOption, Tooltip } from "@ppb/the-wall-web";
import { FunctionComponent, useCallback, useContext, useMemo, useState } from "react";

import styles from "./PreferenceSingleChoiceCard.web.css";
import { ComponentProps } from "./props";
import { PreferenceCard } from "./snowflakes/PreferenceCard/PreferenceCard.web";
import { ConfigContext } from "../Config/ConfigContext";

const PreferenceSingleChoiceCard: FunctionComponent<ComponentProps> = ({
  preferenceUrn,
  title,
  hint,
  selectedOptionIndex,
  listOptions,
  segmentedOptions,
  isVisible,
  isSwitchLayout,
  isLoggedIn,
  tooltipContent,
  layout,
  dispatchPreferenceChange,
}) => {
  const { isDesktopLayout } = useContext(ConfigContext);
  const [isChecked, setIsChecked] = useState(!!selectedOptionIndex);

  const handleChange = useCallback(
    (value: string): void => {
      dispatchPreferenceChange(preferenceUrn, value);
    },
    [dispatchPreferenceChange, preferenceUrn],
  );

  const handleSwitchChange = useCallback(
    (value: boolean): void => {
      const selectedValue = listOptions[Number(value)].id;
      dispatchPreferenceChange(preferenceUrn, selectedValue);
      setIsChecked(value);
    },
    [dispatchPreferenceChange, listOptions, preferenceUrn],
  );

  const renderedItems = useMemo(() => {
    if (isSwitchLayout && hint) {
      return <SwitchOption label={hint} isChecked={isChecked} onChange={handleSwitchChange} />;
    }
    if (!listOptions?.length || selectedOptionIndex === undefined) return null;
    return (
      <RadioList
        listOptions={listOptions}
        listGroupName={preferenceUrn}
        selectedOption={listOptions[selectedOptionIndex].id}
        handleChange={handleChange}
        theme={ComponentTheme.DarkTransparent}
      />
    );
  }, [
    handleChange,
    handleSwitchChange,
    isSwitchLayout,
    hint,
    listOptions,
    preferenceUrn,
    selectedOptionIndex,
    isChecked,
  ]);

  const renderedSegmentedItems = useMemo(() => {
    if (!segmentedOptions || selectedOptionIndex === undefined) return <></>;
    const segmentedOption = segmentedOptions[Number(selectedOptionIndex)]?.key;
    return (
      <div className={styles.toggleContainer}>
        <SegmentedControl onClick={handleChange} options={segmentedOptions} selectedOption={segmentedOption} />
      </div>
    );
  }, [handleChange, segmentedOptions, selectedOptionIndex]);

  const renderedTooltip = useMemo(
    () =>
      tooltipContent ? (
        <Tooltip
          title={tooltipContent.title || ""}
          description={tooltipContent.description}
          icon={{ name: tooltipContent.iconName, iconSize: tooltipContent.iconSize }}
        />
      ) : null,
    [tooltipContent],
  );

  const hintMessage = !isSwitchLayout ? hint : undefined;

  // TODO add callback when info button's behaviour is finalized
  const onInfoButtonClick = undefined;

  return isVisible && isLoggedIn ? (
    <div className={styles.container}>
      {layout === "RADIO" && (
        <PreferenceCard
          title={title}
          hint={hintMessage}
          extraContent={renderedTooltip}
          onInfoButtonClick={onInfoButtonClick}
        >
          {renderedItems}
        </PreferenceCard>
      )}
      {layout === "SEGMENTED" && isDesktopLayout && (
        <div className={styles.segmentedContainer}>
          <div className={`typography-h380 ${styles.title}`}>{title}</div>
          {renderedSegmentedItems}
        </div>
      )}
    </div>
  ) : null;
};

export default PreferenceSingleChoiceCard;
