import { FunctionComponent } from "react";
import { ConnectedProps } from "../props";
import { useActiveCompetitionsVM } from "../viewmodel/ActiveCompetitions.viewmodel";

export const ConnectedActiveCompetitions: FunctionComponent<ConnectedProps> = ({
  urn,
  selectedCompetitionsIds,
  component: Component,
  placeholder: Placeholder,
  resetText,
  onCompetitionRemove,
  onReset,
}) => {
  const { loading, selectedCompetitions } = useActiveCompetitionsVM(urn, selectedCompetitionsIds);

  if (loading) {
    return <Placeholder />;
  }

  return (
    <Component
      selectedCompetitions={selectedCompetitions}
      resetText={resetText}
      onReset={onReset}
      onCompetitionRemove={onCompetitionRemove}
    />
  );
};
