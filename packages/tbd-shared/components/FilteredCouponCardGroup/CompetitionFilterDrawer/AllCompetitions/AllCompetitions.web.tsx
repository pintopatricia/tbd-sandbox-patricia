import { OptionList, Image, Card } from "@ppb/the-wall-web";
import { FunctionComponent, useMemo } from "react";
import { CardHeaderSize, CardTheme } from "@ppb/the-wall-common/types/Card/Card.types";
import { CompetitionFilterGroup } from "../CompetitionFilterDrawer.types";
import styles from "./AllCompetitions.web.css";
import { AllCompetitionsCheckboxListHandler } from "./props";

const CompetitionsByCountry: FunctionComponent<{
  group: CompetitionFilterGroup;
  onCheckboxListChange: AllCompetitionsCheckboxListHandler;
  selectedCompetitions: string[];
}> = ({ group, selectedCompetitions, onCheckboxListChange }) => {
  const listOptions = useMemo(
    () =>
      group.items.map((item) => ({
        ...item,
        isSelected: selectedCompetitions.some((id) => item.id === id),
      })),
    [group, selectedCompetitions],
  );

  const flagComponent = group.flag ? (
    <div className={styles.collapseHeaderIcon}>
      {
        // alt attribute as "" because image (country flag) doesn't add different information from title (country name)
        <Image src={group.flag} alt="" />
      }
    </div>
  ) : undefined;

  return (
    <Card
      key={group.id}
      startOpen={false}
      isCollapsible={true}
      title={group.title}
      theme={CardTheme.TRANSPARENT}
      size={CardHeaderSize.LARGE}
      fullWidthContent={true}
      startElement={flagComponent}
    >
      <div className={`${styles.accordionContent}`}>
        <OptionList listGroupName={group.id} listOptions={listOptions} handleChange={onCheckboxListChange} />
      </div>
    </Card>
  );
};

export const AllCompetitions: FunctionComponent<{
  competitions: CompetitionFilterGroup[];
  selectedCompetitions: string[];
  onCheckboxListChange: AllCompetitionsCheckboxListHandler;
}> = ({ competitions, selectedCompetitions, onCheckboxListChange }) => (
  <>
    {competitions.map((group) => (
      <div key={`competitions-${group.id}`} className={styles.competitionsGroup}>
        <CompetitionsByCountry
          group={group}
          selectedCompetitions={selectedCompetitions}
          onCheckboxListChange={onCheckboxListChange}
        />
      </div>
    ))}
  </>
);
