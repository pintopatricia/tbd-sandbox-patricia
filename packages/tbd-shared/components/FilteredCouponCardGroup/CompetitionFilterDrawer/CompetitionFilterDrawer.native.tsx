import { View } from "react-native";
import type { JSX } from "react";
import { FunctionComponent, useState, useCallback, useMemo } from "react";
import { OptionList, FilterDrawer, Placeholder, Text } from "@ppb/the-wall-native";
import { OptionListOnHandleChange } from "@ppb/the-wall-common/types/native";
import { ComponentTheme } from "@ppb/the-wall-common/types";
import styles from "./CompetitionFilterDrawer.native.styles";
import { i18n } from "../../../helpers/i18n";
import { ConnectedActiveCompetitions } from "./ActiveCompetitions/view/ActiveCompetitions.view";
import { ActiveCompetitions } from "./ActiveCompetitions/ActiveCompetitions.native";
import { AllCompetitions } from "./AllCompetitions/AllCompetitions.native";
import { ConnectedAllCompetitions } from "./AllCompetitions/view/AllCompetitions.view";
import { CompetitionFilterDrawerViewModel } from "./CompetitionFilterDrawer.types";
import { AllCompetitionsCheckboxListHandler } from "./AllCompetitions/props";

const AllCompetitionsPlaceholder = () => (
  <View style={styles.placeholderContainer}>
    <Placeholder style={styles.placeholder} />
  </View>
);

const CompetitionFilterDrawer: FunctionComponent<CompetitionFilterDrawerViewModel> = ({
  urn,
  title,
  onApply,
  onClose,
  topCompetitions,
  currentSelections,
  resetText,
}) => {
  const [selectedCompetitions, setSelectedCompetitions] = useState(currentSelections.competitionFilter ?? []);
  const selectedCompetitionsUrns = useMemo(
    () => selectedCompetitions.map((competition) => competition.urn),
    [selectedCompetitions],
  );

  const onOptionListChangeTopCompetitions = useCallback<OptionListOnHandleChange>(
    (selectedCompetitionId) => {
      if (selectedCompetitions.find((c) => c.urn === selectedCompetitionId)) {
        // remove from selected competitions
        setSelectedCompetitions(selectedCompetitions.filter((selection) => selection.urn !== selectedCompetitionId));
      } else {
        // add to selected competitions
        const name = topCompetitions.items?.find((sl) => sl.id === selectedCompetitionId)?.text ?? "";
        setSelectedCompetitions((prev) => [...prev, { urn: selectedCompetitionId, name }]);
      }
    },
    [setSelectedCompetitions, selectedCompetitions, topCompetitions.items],
  );

  const onOptionListChange = useCallback<AllCompetitionsCheckboxListHandler>(
    ({ id, text: name }) => {
      if (selectedCompetitions.find((c) => c.urn === id)) {
        // remove from selected competitions
        setSelectedCompetitions(selectedCompetitions.filter((competition) => competition.urn !== id));
      } else {
        setSelectedCompetitions((prev) => [...prev, { urn: id, name }]);
      }
    },
    [selectedCompetitions],
  );

  const onApplyButtonClick = useCallback(() => {
    const labels: (string | undefined)[] = selectedCompetitions.map((selected) => selected.name);
    onApply(selectedCompetitionsUrns, labels);
  }, [onApply, selectedCompetitions, selectedCompetitionsUrns]);

  const onSelectionChipRemove = useCallback(
    (id: string) => {
      setSelectedCompetitions(selectedCompetitions.filter((sc) => sc.urn !== id));
    },
    [selectedCompetitions, setSelectedCompetitions],
  );

  const onRemoveAllChips = useCallback(() => {
    setSelectedCompetitions([]);
  }, [setSelectedCompetitions]);

  const activeCompetitions = useMemo((): JSX.Element | null => {
    if (!selectedCompetitionsUrns.length) return null;

    return (
      <ConnectedActiveCompetitions
        urn={urn}
        placeholder={Placeholder}
        component={ActiveCompetitions}
        selectedCompetitionsIds={selectedCompetitionsUrns}
        resetText={resetText}
        onCompetitionRemove={onSelectionChipRemove}
        onReset={onRemoveAllChips}
      />
    );
  }, [onSelectionChipRemove, selectedCompetitionsUrns, resetText, onRemoveAllChips, urn]);

  return (
    <FilterDrawer
      title={title}
      displayApplyButton={true}
      onCloseTap={onClose}
      applyText={i18n({ key: "I18N.FILTERS.APPLY" })}
      onOutsideTap={onClose}
      onApply={onApplyButtonClick}
      headerContent={activeCompetitions}
      theme={ComponentTheme.Dark}
    >
      <View style={styles.drawerContentWithPadding}>
        <Text style={styles.sectionTitle}>{i18n({ key: "I18N.FILTERS.TOP_COMPETITIONS" })}</Text>
        <View style={styles.drawerContentWithPaddingCheckbox}>
          <OptionList
            listOptions={topCompetitions.items.map((competitionCheckbox) => ({
              ...competitionCheckbox,
              isSelected: selectedCompetitionsUrns.some((id) => competitionCheckbox.id === id),
            }))}
            handleChange={onOptionListChangeTopCompetitions}
          />
        </View>
      </View>
      <Text style={[styles.drawerContentWithPadding, styles.sectionTitle]}>
        {i18n({ key: "I18N.FILTERS.ALL_COMPETITIONS" })}
      </Text>
      <ConnectedAllCompetitions
        urn={urn}
        component={AllCompetitions}
        placeholder={AllCompetitionsPlaceholder}
        selectedCompetitions={selectedCompetitionsUrns}
        onCheckboxListChange={onOptionListChange}
      />
    </FilterDrawer>
  );
};

export default CompetitionFilterDrawer;
