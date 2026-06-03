import { View, ScrollView } from "react-native";
import { FunctionComponent, useCallback } from "react";
import { ActionLink, Chip } from "@ppb/the-wall-native";
import { ActionLinkColor } from "@ppb/the-wall-common/types";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import styles from "./ActiveCompetitions.native.styles";
import { COMPETITION_FILTERED_HEADER_CONTENT } from "../CompetitionFilterDrawer.native.selectors";
import { CardProps } from "./props";

const ActiveCompetition: FunctionComponent<{
  index: number;
  competitionCheckbox: CardProps["selectedCompetitions"][0];
  onRemove: CardProps["onCompetitionRemove"];
}> = ({ index, competitionCheckbox, onRemove }) => {
  const removeCompetition = useCallback(() => onRemove(competitionCheckbox.id), [competitionCheckbox.id, onRemove]);

  return (
    <View style={[styles.chip, index === 0 && styles.firstChip]} key={competitionCheckbox.id}>
      <Chip text={competitionCheckbox.name} onTap={removeCompetition} />
    </View>
  );
};

export const ActiveCompetitions: FunctionComponent<CardProps> = ({
  selectedCompetitions: selectedCheckboxOptions,
  onCompetitionRemove,
  onReset,
  resetText,
}) => (
  <View {...getTestProps(COMPETITION_FILTERED_HEADER_CONTENT, false)} style={styles.headerContentContainer}>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {selectedCheckboxOptions.map((competitionCheckbox, index) => (
        <ActiveCompetition
          index={index}
          key={competitionCheckbox.id}
          competitionCheckbox={competitionCheckbox}
          onRemove={onCompetitionRemove}
        />
      ))}
    </ScrollView>
    <ActionLink color={ActionLinkColor.Default} onClick={onReset} text={resetText} />
  </View>
);
