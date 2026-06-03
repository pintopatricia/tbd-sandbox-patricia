import subscribeEvent from "../../event-broker/event-subscriber";
import { resolveRaceMeetingViewSeo } from "./resolvers/race-meeting-view-seo-resolver";

const register = (): void => {
  subscribeEvent("@@UI/RACE_MEETING_VIEW_LOADED", async (payload) => {
    await resolveRaceMeetingViewSeo(payload.urn);
  });
};

export default register;
