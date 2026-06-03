export const OSG__CONNECTION_FAILED = "OSG/CONNECTION_FAILED";
export const OSG__SUBSCRIPTION_SUCCEEDED = "OSG/SUBSCRIPTION_SUCCEEDED";
export const OSG__SUBSCRIPTION_FAILED = "OSG/SUBSCRIPTION_FAILED";

export type OSGConnectionFailedAction = {
  type: typeof OSG__CONNECTION_FAILED;
};

export type OSGSubscriptionSucceededAction = {
  type: typeof OSG__SUBSCRIPTION_SUCCEEDED;
};

export type OSGSubscriptionFailedAction = {
  type: typeof OSG__SUBSCRIPTION_FAILED;
};
