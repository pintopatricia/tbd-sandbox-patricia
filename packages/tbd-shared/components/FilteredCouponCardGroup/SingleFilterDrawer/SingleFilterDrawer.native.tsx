import { FunctionComponent, useState, useCallback } from "react";
import { View } from "react-native";
import { FilterDrawer, RadioList } from "@ppb/the-wall-native";
import { RadioListOption, RadioListOnHandleChange } from "@ppb/the-wall-common/types/RadioList/RadioList.types";
import { ComponentTheme } from "@ppb/the-wall-common/types";
import styles from "./SingleFilterDrawer.native.styles";
import { SingleFilterDrawerViewModel } from "./SingleFilterDrawer.types";

const SingleFilterDrawer: FunctionComponent<SingleFilterDrawerViewModel> = ({
  filter,
  selections,
  onApply,
  onClose,
}) => {
  const [selectedRadioOption, setSelectedRadioOption] = useState<RadioListOption>(
    filter.availableOptions.find((option) => option.id === selections[filter.id]) || { id: "", text: "" },
  );

  const onRadioListChange = useCallback<RadioListOnHandleChange>(
    (_, option: RadioListOption) => {
      setSelectedRadioOption(option);
      onApply([option.id], [option.text]);
    },
    [onApply, setSelectedRadioOption],
  );

  return (
    <FilterDrawer
      title={filter.title}
      displayApplyButton={false}
      onCloseTap={onClose}
      onOutsideTap={onClose}
      theme={ComponentTheme.Dark}
    >
      <View style={styles.drawerContainer}>
        <RadioList
          listOptions={filter.availableOptions}
          handleChange={onRadioListChange}
          selectedOption={selectedRadioOption.id}
          theme={ComponentTheme.Dark}
        />
      </View>
    </FilterDrawer>
  );
};

export default SingleFilterDrawer;
