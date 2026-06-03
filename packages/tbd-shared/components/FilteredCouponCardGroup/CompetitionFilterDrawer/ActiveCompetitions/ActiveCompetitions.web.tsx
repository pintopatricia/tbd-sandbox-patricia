import { ActionLinkColor, ActionLinkTypography } from "@ppb/the-wall-common/types";
import { ActionLink, Chip } from "@ppb/the-wall-web";
import { FunctionComponent, useCallback } from "react";
import { CardProps } from "./props";

import styles from "./ActiveCompetitions.web.css";

const ActiveCompetition: FunctionComponent<{
  competition: CardProps["selectedCompetitions"][0];
  onRemove: CardProps["onCompetitionRemove"];
}> = ({ competition, onRemove }) => {
  const onTap = useCallback(() => {
    onRemove(competition.id);
  }, [competition, onRemove]);

  return (
    <div className={styles.chip} key={competition.id}>
      <Chip text={competition.name} onTap={onTap} />
    </div>
  );
};

export const ActiveCompetitions: FunctionComponent<CardProps> = ({
  selectedCompetitions,
  onCompetitionRemove,
  resetText,
  onReset,
}) => (
  <div className={styles.container}>
    <div className={styles.competitionsContainer}>
      {selectedCompetitions.map((competition) => (
        <ActiveCompetition key={competition.id} competition={competition} onRemove={onCompetitionRemove} />
      ))}
    </div>
    <ActionLink
      color={ActionLinkColor.Default}
      onClick={onReset}
      text={resetText}
      typography={ActionLinkTypography.Regular}
    />
  </div>
);
