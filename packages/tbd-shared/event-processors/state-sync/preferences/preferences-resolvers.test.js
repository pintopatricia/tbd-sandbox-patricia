import { updateApolloCacheWithNewPreferences } from "./Preferences.graphql";
import { singleChoicePreferencesUpdate } from "./preferences-resolvers";

jest.mock("./Preferences.graphql", () => ({
  updateApolloCacheWithNewPreferences: jest.fn(),
}));

describe("singleChoicePreferencesUpdate", () => {
  beforeEach(jest.clearAllMocks);

  describe("when the received event has Payload", () => {
    it("should invoke updateApolloCacheWithNewPreferences with correct payload ", () => {
      singleChoicePreferencesUpdate();
      expect(updateApolloCacheWithNewPreferences).toHaveBeenCalledTimes(1);
    });
  });
});
