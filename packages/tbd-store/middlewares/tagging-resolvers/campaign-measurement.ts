import { CampaignMeasurementEvent } from "../../state/tagging/CampaignMeasurement.types";
import { TaggingAction, TaggingCategory } from "./AnalyticsConstants";
import { UserDetails } from "../../state/entities";
import { ApplicationState } from "../../state/ApplicationState.types";
import { getUserDetails } from "../../state/entities/user-details/user-details-selectors";

const CAMPAIGN_DETAILS_REGEX =
  /(?!&)(utm_(source|medium|content|campaign|ad)|mi_(u|ign)|acc_id|bid|pid|ttp|rfr|clkID)=[^&]*/g;

const containsUtmSourceParam = (match: RegExpMatchArray): boolean =>
  !!match.find((param) => param.includes("utm_source"));

export const getCampaignMeasurementEvent = (
  state: ApplicationState,
  url: string | null,
): CampaignMeasurementEvent | null => {
  if (!url) {
    return null;
  }

  const parameters = url.match(CAMPAIGN_DETAILS_REGEX);
  if (!parameters?.length || !containsUtmSourceParam(parameters)) {
    return null;
  }

  const { accountId } = <UserDetails>getUserDetails(state);
  return parameters.reduce(
    (acc, param) => {
      const [key, value] = param.split("=");
      return {
        ...acc,
        [key]: value,
      };
    },
    {
      event: "ga_event",
      category: TaggingCategory.CHANNEL_PERFORMANCE,
      action: TaggingAction.CLICK,
      label: "GA params",
      utm_source: "",
      acc_id: accountId,
    },
  );
};
