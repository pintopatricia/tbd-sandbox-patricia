import { ComponentProps } from "./props";

const isSnookerFixtureEqual = (prevProps: ComponentProps, nextProps: ComponentProps): boolean =>
  prevProps.competition === nextProps.competition &&
  prevProps.date === nextProps.date &&
  prevProps.matchStatus === nextProps.matchStatus &&
  prevProps.showBottomSeparator === nextProps.showBottomSeparator &&
  prevProps.sporteventURN === nextProps.sporteventURN &&
  prevProps.time === nextProps.time &&
  prevProps.urn === nextProps.urn &&
  prevProps.viewMode === nextProps.viewMode &&
  prevProps.teamA?.name === nextProps.teamA?.name &&
  prevProps.teamB?.name === nextProps.teamB?.name &&
  prevProps.notificationsSubscription === nextProps.notificationsSubscription &&
  JSON.stringify(prevProps.scoreData) === JSON.stringify(nextProps.scoreData);

export { isSnookerFixtureEqual };
