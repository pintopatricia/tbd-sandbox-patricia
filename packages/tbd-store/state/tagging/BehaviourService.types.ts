export type DataSource = {
  urn: string;
  version: string;
  variant?: DataSource;
};

export type TrackableItem = {
  urn: string;
  container: string;
  source?: DataSource;
  correlationId?: string;
};
