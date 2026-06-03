import { View } from "react-native";
import { Card, OptionList, TBDImage } from "@ppb/the-wall-native";
import { FunctionComponent, useCallback, useMemo } from "react";
import { CardHeaderSize, CardTheme } from "@ppb/the-wall-common/types/Card/Card.types";
import styles from "./AllCompetitions.native.styles";
import { CompetitionFilterGroup } from "../CompetitionFilterDrawer.types";
import { AllCompetitionsCheckboxListHandler } from "./props";

const CompetitionsByCountry = ({
  competition,
  selectedCompetitions,
  onCheckboxListChange,
}: {
  competition: CompetitionFilterGroup;
  selectedCompetitions: string[];
  onCheckboxListChange: AllCompetitionsCheckboxListHandler;
}) => {
  const listOptions = useMemo(
    () =>
      competition.items.map((item) => ({
        ...item,
        key: item.id,
        isSelected: selectedCompetitions.some((id) => item.id === id),
      })),
    [competition, selectedCompetitions],
  );

  const handleOptionListChange = useCallback(
    (id: string) => {
      const name = competition.items.find((c) => c.id === id)?.text ?? "";
      const option = { id, text: name };
      onCheckboxListChange(option);
    },
    [competition, onCheckboxListChange],
  );

  const flagComponent = competition.flag ? (
    <View style={styles.collapseHeaderIcon}>
      <TBDImage source={competition.flag} />
    </View>
  ) : undefined;

  return (
    <Card
      key={competition.id}
      startOpen={false}
      isCollapsible={true}
      title={competition.title}
      theme={CardTheme.TRANSPARENT}
      size={CardHeaderSize.LARGE}
      fullWidthContent={true}
      startElement={flagComponent}
    >
      <View style={styles.drawerContentWithPadding}>
        <View style={styles.drawerContentWithPaddingCheckbox}>
          <OptionList listOptions={listOptions} handleChange={handleOptionListChange} />
        </View>
      </View>
    </Card>
  );
};

export const AllCompetitions: FunctionComponent<{
  competitions: CompetitionFilterGroup[];
  selectedCompetitions: string[];
  onCheckboxListChange: AllCompetitionsCheckboxListHandler;
}> = ({ competitions, selectedCompetitions, onCheckboxListChange }) => (
  <>
    {competitions.map((competitionsByCountry) => (
      <View key={`competition-${competitionsByCountry.id}`} style={styles.border}>
        <CompetitionsByCountry
          competition={competitionsByCountry}
          selectedCompetitions={selectedCompetitions}
          onCheckboxListChange={onCheckboxListChange}
          key={competitionsByCountry.id}
        />
      </View>
    ))}
  </>
);
