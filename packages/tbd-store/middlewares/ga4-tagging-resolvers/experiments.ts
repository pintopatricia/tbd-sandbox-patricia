import { ExperimentsEvent, buildExperimentsEvent } from "tagging-library";
import { UserDetails } from "../../state/entities";
import { ApplicationState } from "../../state/ApplicationState.types";
import { getExperiments } from "../../state/entities/experiments/experiments-selectors";
import { getUserDetails } from "../../state/entities/user-details/user-details-selectors";

export const getExperimentEvents = (state: ApplicationState): ExperimentsEvent[] => {
  const { accountId } = <UserDetails>getUserDetails(state);
  const experiments = getExperiments(state);

  return Object.keys(experiments).map((key) =>
    buildExperimentsEvent({
      accountId: accountId.toString(),
      expId: key,
      userId: accountId.toString(),
      varId: experiments[key].variant.toString(),
    }),
  );
};
