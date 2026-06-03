import { FunctionComponent } from "react";
import { ConnectedProps } from "../props";
import { useAllCompetitionsVM } from "../viewmodel/AllCompetitions.viewmodel";

export const ConnectedAllCompetitions: FunctionComponent<ConnectedProps> = ({
  urn,
  component: Component,
  placeholder: Placeholder,
  selectedCompetitions,
  onCheckboxListChange,
}) => {
  const { loading, competitions } = useAllCompetitionsVM(urn);

  if (loading) {
    return <Placeholder />;
  }

  if (!competitions) {
    return null;
  }

  return (
    <Component
      competitions={competitions}
      selectedCompetitions={selectedCompetitions}
      onCheckboxListChange={onCheckboxListChange}
    />
  );
};
