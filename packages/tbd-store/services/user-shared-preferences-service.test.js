import { UserSharedPreferencesService } from "@flutter-global/uki-channels-http-clients";
import UserSharedPreferencesClient from "./user-shared-preferences-service";

jest.mock("@flutter-global/uki-channels-http-clients", () => ({
  UserSharedPreferencesService: jest.fn().mockReturnValue({
    setUserPreferences: jest.fn(),
  }),
}));

jest.mock("./client-factory", () => ({
  createClientFactory: jest.fn(() => UserSharedPreferencesService),
}));

function setup(mock) {
  UserSharedPreferencesService().setUserPreferences.mockReturnValue(Promise.resolve(mock));
}

describe("UserSharedPreferencesService", () => {
  describe("setPreference", () => {
    describe("when service returns status SUCCESS", () => {
      beforeAll(async () => {
        setup({ status: "SUCCESS" });
      });

      it("should return the response", async () => {
        const response = await UserSharedPreferencesClient.setPreference();
        expect(response).toEqual({ status: "SUCCESS" });
      });
    });

    describe("when service returns other status besides status SUCCESS", () => {
      beforeAll(async () => {
        setup({ status: "FAILURE" });
      });

      it("should return the response", async () => {
        await expect(UserSharedPreferencesClient.setPreference()).rejects.toThrow("could not update the preferences");
      });
    });
  });
});
