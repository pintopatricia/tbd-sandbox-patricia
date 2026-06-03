import { FunctionComponent, useState, useCallback, useContext } from "react";
import { FilterDrawer, RadioList } from "@ppb/the-wall-web";
import { RadioListOption, RadioListOnHandleChange } from "@ppb/the-wall-common/types/RadioList/RadioList.types";
import { ComponentTheme } from "@ppb/the-wall-common/types";
import styles from "./SingleFilterDrawer.web.css";
import { SingleFilterDrawerViewModel } from "./SingleFilterDrawer.types";
import { ConfigContext } from "../../Config/ConfigContext";

const SingleFilterDrawer: FunctionComponent<SingleFilterDrawerViewModel> = ({
  filter,
  selections,
  onApply,
  onClose,
  refObject,
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

  const { isDesktopLayout } = useContext(ConfigContext);

  return (
    <FilterDrawer
      title={filter.title}
      displayApplyButton={false}
      onCloseTap={onClose}
      onOutsideTap={onClose}
      theme={ComponentTheme.Dark}
      refObject={refObject}
      isDesktop={isDesktopLayout}
    >
      <div className={styles.drawerContainer}>
        <RadioList
          listGroupName="filterSelections"
          listOptions={filter.availableOptions}
          handleChange={onRadioListChange}
          selectedOption={selectedRadioOption.id}
          theme={ComponentTheme.Dark}
        />
      </div>
    </FilterDrawer>
  );
};

export default SingleFilterDrawer;
