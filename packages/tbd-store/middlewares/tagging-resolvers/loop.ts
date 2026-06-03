import { ExperimentLoadEvent } from "../../state/tagging/PageLoad.types";
import { UserDetails } from "../../state/entities";
import { ApplicationState } from "../../state/ApplicationState.types";
import { APPLICATION, BUSINESS } from "./AnalyticsDimensions";
import { getExperiments } from "../../state/entities/experiments/experiments-selectors";
import { getUserDetails } from "../../state/entities/user-details/user-details-selectors";
import { TaggingCategory } from "./AnalyticsConstants";

export const getExperimentLoadEvent = (state: ApplicationState): ExperimentLoadEvent[] => {
  const { accountId, bucketId } = <UserDetails>getUserDetails(state);
  const experiments = getExperiments(state);

  return Object.keys(experiments).map((key) => ({
    event: "ga_event",
    category: TaggingCategory.LOOP,
    action: experiments[key].variant,
    label: key,
    [APPLICATION.ACCOUNT_ID]: accountId,
    [BUSINESS.LOOP_BUCKET_ID]: bucketId,
  }));
};
