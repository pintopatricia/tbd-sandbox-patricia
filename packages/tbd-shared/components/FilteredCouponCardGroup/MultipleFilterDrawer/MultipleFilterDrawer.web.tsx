import { FunctionComponent, useState, useCallback, useContext } from "react";
import { FilterDrawer, OptionList } from "@ppb/the-wall-web";
import { OptionListItem, ComponentTheme } from "@ppb/the-wall-common/types";
import { OptionListOnHandleChange } from "@ppb/the-wall-common/types/web";
import { FilterDrawerOnApplyChanges } from "@ppb/the-wall-common/types/Drawer/FilterDrawer/FilterDrawer.types";
import styles from "./MultipleFilterDrawer.web.css";
import { i18n } from "../../../helpers/i18n";
import { MultipleFilterDrawerViewModel } from "./MultipleFilterDrawer.types";
import { ConfigContext } from "../../Config/ConfigContext";

const MultipleFilterDrawer: FunctionComponent<MultipleFilterDrawerViewModel> = ({
  filter,
  selections,
  onApply,
  onClose,
  refObject,
}) => {
  const [listOptions, setListOptions] = useState<OptionListItem[]>(() => {
    const filterSelections = selections[filter.id] || [];

    return filter.availableOptions.map((option) => ({ ...option, isSelected: filterSelections.includes(option.id) }));
  });

  const [selectedOptions, setSelectedOptions] = useState({
    ids: new Set(listOptions.filter((option) => option.isSelected).map((option) => option.id)),
    names: new Set(listOptions.filter((option) => option.isSelected).map((option) => option.text)),
  });

  const onHandleChange = useCallback<OptionListOnHandleChange>(
    (selectedOption: OptionListItem) => {
      if (selectedOptions.ids.has(selectedOption.id) && selectedOptions.names.has(selectedOption.text)) {
        selectedOptions.ids.delete(selectedOption.id);
        selectedOptions.names.delete(selectedOption.text);
      } else {
        selectedOptions.ids.add(selectedOption.id);
        selectedOptions.names.add(selectedOption.text);
      }
      setSelectedOptions({ ids: selectedOptions.ids, names: selectedOptions.names });
      setListOptions(
        listOptions.map((option) => ({
          ...option,
          isSelected: selectedOptions.ids.has(option.id),
        })),
      );
    },
    [listOptions, selectedOptions.ids, selectedOptions.names],
  );

  const onApplyButtonClick = useCallback<FilterDrawerOnApplyChanges>(() => {
    onApply(Array.from(selectedOptions.ids), Array.from(selectedOptions.names));
  }, [onApply, selectedOptions.ids, selectedOptions.names]);

  const { isDesktopLayout } = useContext(ConfigContext);

  return (
    <FilterDrawer
      title={filter.title}
      applyText={i18n({ key: "I18N.FILTERS.APPLY" })}
      displayApplyButton={true}
      onCloseTap={onClose}
      onOutsideTap={onClose}
      onApply={onApplyButtonClick}
      theme={ComponentTheme.Dark}
      refObject={refObject}
      isDesktop={isDesktopLayout}
    >
      <div className={styles.drawerContainer}>
        <OptionList listGroupName="filterSelections" listOptions={listOptions} handleChange={onHandleChange} />
      </div>
    </FilterDrawer>
  );
};

export default MultipleFilterDrawer;
