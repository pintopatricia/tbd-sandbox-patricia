import { FunctionComponent, useState, useCallback, useContext, useMemo } from "react";

import { OptionList, FilterDrawer, Placeholder } from "@ppb/the-wall-web";
import { ComponentTheme } from "@ppb/the-wall-common/types";

import { CompetitionFilterDrawerViewModel } from "./CompetitionFilterDrawer.types";
import { ConnectedAllCompetitions } from "./AllCompetitions/view/AllCompetitions.view";
import { ConnectedActiveCompetitions } from "./ActiveCompetitions/view/ActiveCompetitions.view";
import styles from "./CompetitionFilterDrawer.web.css";
import { i18n } from "../../../helpers/i18n";
import { ConfigContext } from "../../Config/ConfigContext";
import { AllCompetitions } from "./AllCompetitions/AllCompetitions.web";
import { ActiveCompetitions } from "./ActiveCompetitions/ActiveCompetitions.web";
import { AllCompetitionsCheckboxListHandler } from "./AllCompetitions/props";

const AllCompetitionsPlaceholder = () => (
  <div className={styles.placeholderContainer}>
    <Placeholder className={styles.placeholder} />
  </div>
);

const CompetitionFilterDrawer: FunctionComponent<CompetitionFilterDrawerViewModel> = ({
  urn,
  title,
  onApply,
  onClose,
  topCompetitions,
  currentSelections,
  resetText,
  refObject,
}) => {
  const [selectedCompetitions, setSelectedCompetitions] = useState(currentSelections.competitionFilter ?? []);
  const selectedCompetitionsUrns = useMemo(
    () => selectedCompetitions.map((competition) => competition.urn),
    [selectedCompetitions],
  );

  const onOptionListChange = useCallback<AllCompetitionsCheckboxListHandler>(
    ({ id, text: name }) => {
      if (selectedCompetitions.find((c) => c.urn === id)) {
        setSelectedCompetitions(selectedCompetitions.filter((competition) => competition.urn !== id));
      } else {
        setSelectedCompetitions((prev) => [...prev, { urn: id, name }]);
      }
    },
    [selectedCompetitions],
  );

  const onApplyButtonClick = useCallback(() => {
    const labels = selectedCompetitions.map((c) => c.name);
    onApply(selectedCompetitionsUrns, labels);
  }, [onApply, selectedCompetitions, selectedCompetitionsUrns]);

  const onSelectionChipRemove = useCallback(
    (id: string) => {
      setSelectedCompetitions(selectedCompetitions.filter((competition) => competition.urn !== id));
    },
    [selectedCompetitions],
  );

  const onRemoveAllChips = useCallback(() => setSelectedCompetitions([]), []);

  const activeCompetitions = useMemo(
    () =>
      !!selectedCompetitionsUrns.length && (
        <ConnectedActiveCompetitions
          urn={urn}
          placeholder={Placeholder}
          component={ActiveCompetitions}
          selectedCompetitionsIds={selectedCompetitionsUrns}
          resetText={resetText}
          onCompetitionRemove={onSelectionChipRemove}
          onReset={onRemoveAllChips}
        />
      ),
    [selectedCompetitionsUrns, urn, resetText, onRemoveAllChips, onSelectionChipRemove],
  );

  const { isDesktopLayout } = useContext(ConfigContext);

  return (
    <FilterDrawer
      title={title}
      displayApplyButton={true}
      onCloseTap={onClose}
      applyText={i18n({ key: "I18N.FILTERS.APPLY" })}
      onOutsideTap={onClose}
      onApply={onApplyButtonClick}
      isDesktop={isDesktopLayout}
      headerContent={activeCompetitions}
      theme={ComponentTheme.Dark}
      refObject={refObject}
    >
      <div className={styles.drawerContentWithPadding}>
        <div className={`typography-h158 ${styles.sectionTitle}`}>{i18n({ key: "I18N.FILTERS.TOP_COMPETITIONS" })}</div>
        <div className={styles.listPadding}>
          <OptionList
            listGroupName={topCompetitions.id}
            listOptions={topCompetitions.items.map((competitionCheckbox) => ({
              ...competitionCheckbox,
              isSelected: selectedCompetitions.some((competition) => competition.urn === competitionCheckbox.id),
            }))}
            handleChange={onOptionListChange}
          />
        </div>
      </div>
      <div className={`typography-h158 ${styles.drawerContentWithPadding} ${styles.sectionTitle}`}>
        {i18n({ key: "I18N.FILTERS.ALL_COMPETITIONS" })}
      </div>
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
