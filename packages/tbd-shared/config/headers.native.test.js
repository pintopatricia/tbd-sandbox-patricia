import { Platform } from "react-native";

import { Jurisdiction } from "@ppb/tbd-store/state/constants";

import Storage, { SETTINGS_BUNDLE_KEYS } from "../helpers/storage.native";

import { Environment } from "./environments.native";
import { setGeneratedHeaders } from "./headers.native";

jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
}));

describe("headers", () => {
  describe("setGeneratedHeaders", () => {
    beforeEach(() => {
      Storage.setItem = jest.fn(() => Promise.resolve());
    });

    describe("when the platform is android and the environment is localhost", () => {
      beforeEach(() => {
        Platform.OS = "android";
      });

      it("should return only the property Host: betfair.com for International", async () => {
        await setGeneratedHeaders(Environment.localhost, Jurisdiction.INTERNATIONAL);

        expect(Storage.setItem).toHaveBeenCalledTimes(1);
        expect(Storage.setItem).toHaveBeenCalledWith(SETTINGS_BUNDLE_KEYS.GENERATED_APP_HEADERS, {
          Host: "betfair.com",
        });
      });

      it("should return the correct properties when selecting Jurisdiction", async () => {
        await setGeneratedHeaders(Environment.localhost, "SPAIN");

        expect(Storage.setItem).toHaveBeenCalledTimes(1);
        expect(Storage.setItem).toHaveBeenCalledWith(SETTINGS_BUNDLE_KEYS.GENERATED_APP_HEADERS, {
          "X-COUNTRY-CODE": "ES",
          "X-IP": "5.45.160.5",
          Host: "betfair.es",
        });
      });
    });

    describe("when the platform is ios and the environment is localhost", () => {
      it("should not generate headers", async () => {
        Platform.OS = "ios";

        await expect(setGeneratedHeaders(Environment.localhost, Jurisdiction.INTERNATIONAL)).resolves.toBeUndefined();
      });
    });

    describe("when the jurisdiction Brazil is selected", () => {
      it("should return the correct properties", async () => {
        await setGeneratedHeaders(Environment.nxt, Jurisdiction.BRAZIL);

        expect(Storage.setItem).toHaveBeenCalledTimes(1);
        expect(Storage.setItem).toHaveBeenCalledWith(SETTINGS_BUNDLE_KEYS.GENERATED_APP_HEADERS, {
          "X-COUNTRY-CODE": "BR",
          "X-IP": "45.7.23.255",
        });
      });
    });

    describe("when the jurisdiction Romania is selected", () => {
      it("should return the correct properties", async () => {
        await setGeneratedHeaders(Environment.nxt, "ROMANIA");

        expect(Storage.setItem).toHaveBeenCalledTimes(1);
        expect(Storage.setItem).toHaveBeenCalledWith(SETTINGS_BUNDLE_KEYS.GENERATED_APP_HEADERS, {
          "X-COUNTRY-CODE": "RO",
          "X-IP": "5.2.128.10",
        });
      });
    });

    describe("when the jurisdiction Italia is selected", () => {
      it("should return the correct properties", async () => {
        await setGeneratedHeaders(Environment.nxt, Jurisdiction.ITALY);

        expect(Storage.setItem).toHaveBeenCalledTimes(1);
        expect(Storage.setItem).toHaveBeenCalledWith(SETTINGS_BUNDLE_KEYS.GENERATED_APP_HEADERS, {
          "X-COUNTRY-CODE": "IT",
          "X-IP": "82.85.8.99",
        });
      });
    });
  });
});
