import { FunctionComponent, useState, useCallback } from "react";
import { View } from "react-native";
import { FilterDrawer, OptionList } from "@ppb/the-wall-native";
import { OptionListItem, ComponentTheme } from "@ppb/the-wall-common/types";
import { OptionListOnHandleChange } from "@ppb/the-wall-common/types/native";
import { FilterDrawerOnApplyChanges } from "@ppb/the-wall-common/types/Drawer/FilterDrawer/FilterDrawer.types";
import styles from "./MultipleFilterDrawer.native.styles";
import { i18n } from "../../../helpers/i18n";
import { MultipleFilterDrawerViewModel } from "./MultipleFilterDrawer.types";

const MultipleFilterDrawer: FunctionComponent<MultipleFilterDrawerViewModel> = ({
  filter,
  selections,
  onApply,
  onClose,
}) => {
  const [listOptions, setListOptions] = useState<OptionListItem[]>(() => {
    const filterSelections = selections[filter.id] || [];
    return filter.availableOptions.map((option) => ({ ...option, isSelected: filterSelections.includes(option.id) }));
  });

  const [selectedOptions, setSelectedOptions] = useState(
    new Set(listOptions.filter((option) => option.isSelected).map((option) => option.id)),
  );

  const onHandleChange = useCallback<OptionListOnHandleChange>(
    (selectedOption: string) => {
      if (selectedOptions.has(selectedOption)) {
        selectedOptions.delete(selectedOption);
      } else {
        selectedOptions.add(selectedOption);
      }
      setSelectedOptions(selectedOptions);
      setListOptions(
        listOptions.map((option) => ({
          ...option,
          isSelected: selectedOptions.has(option.id),
        })),
      );
    },
    [listOptions, selectedOptions],
  );

  const onApplyButtonClick = useCallback<FilterDrawerOnApplyChanges>(() => {
    onApply(Array.from(selectedOptions), []);
  }, [onApply, selectedOptions]);

  return (
    <FilterDrawer
      title={filter.title}
      applyText={i18n({ key: "I18N.FILTERS.APPLY" })}
      displayApplyButton={true}
      onCloseTap={onClose}
      onOutsideTap={onClose}
      onApply={onApplyButtonClick}
      theme={ComponentTheme.Dark}
    >
      <View style={styles.drawerContainer}>
        <OptionList listOptions={listOptions} handleChange={onHandleChange} />
      </View>
    </FilterDrawer>
  );
};

export default MultipleFilterDrawer;
