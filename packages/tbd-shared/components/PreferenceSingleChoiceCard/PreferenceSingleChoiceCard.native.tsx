import { FunctionComponent, useCallback, useMemo, useState } from "react";

import { ComponentTheme } from "@ppb/the-wall-common/types";
import { RadioList, SwitchOption, Tooltip } from "@ppb/the-wall-native";

import { PreferenceCard } from "./snowflakes/PreferenceCard/PreferenceCard.native";
import { ComponentProps } from "./props";

const PreferenceSingleChoiceCard: FunctionComponent<ComponentProps> = ({
  preferenceUrn,
  title,
  hint,
  selectedOptionIndex,
  listOptions,
  isVisible,
  isSwitchLayout,
  tooltipContent,
  dispatchPreferenceChange,
}) => {
  const [isChecked, setIsChecked] = useState(!!selectedOptionIndex);

  const handleChange = useCallback(
    (selectedOptionId: string): void => {
      dispatchPreferenceChange(preferenceUrn, selectedOptionId);
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
        selectedOption={listOptions[selectedOptionIndex].id}
        handleChange={handleChange}
        theme={ComponentTheme.DarkTransparent}
      />
    );
  }, [isSwitchLayout, hint, listOptions, selectedOptionIndex, handleChange, isChecked, handleSwitchChange]);

  const renderedToolTip = useMemo(
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

  return isVisible ? (
    <PreferenceCard
      title={title}
      hint={hintMessage}
      extraContent={renderedToolTip}
      onInfoButtonClick={onInfoButtonClick}
    >
      {renderedItems}
    </PreferenceCard>
  ) : null;
};

export default PreferenceSingleChoiceCard;
