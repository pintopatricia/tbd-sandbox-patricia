import subscribeEvent from "../../event-broker/event-subscriber";
import { singleChoicePreferencesUpdate } from "./preferences/preferences-resolvers";

const register = () => {
  subscribeEvent("@@SYNC/UPDATE_SINGLE_CHOICE_PREFERENCE", () => {
    singleChoicePreferencesUpdate();
  });
};

export default register;
