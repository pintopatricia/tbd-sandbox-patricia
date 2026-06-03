import { setAppCustomHeaders } from "@ppb/tbd-store/services/client-factory";
import { getCustomHeadersSettings } from "../config/settings-utils.native";
import { setCustomHeaders } from "./custom-headers.native";
import { SETTINGS_BUNDLE_KEYS } from "./storage.native";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
}));

jest.mock("../config/settings-utils.native", () => ({
  getCustomHeadersSettings: jest.fn(() => ""),
}));

jest.mock("@ppb/tbd-store/services/client-factory", () => ({
  setAppCustomHeaders: jest.fn(),
}));

describe("setCustomHeaders", () => {
  const storage = {
    getItem: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    storage.getItem.mockResolvedValue({});
  });

  it("does not apply headers when no generated or custom headers exist", async () => {
    await setCustomHeaders(storage);

    expect(storage.getItem).toHaveBeenCalledWith(SETTINGS_BUNDLE_KEYS.GENERATED_APP_HEADERS);
    expect(setAppCustomHeaders).not.toHaveBeenCalled();
  });

  it("applies only custom headers when generated headers are empty", async () => {
    getCustomHeadersSettings.mockReturnValueOnce("X-IP:1.1.1.1,X-COUNTRY-CODE:DK");

    await setCustomHeaders(storage);

    expect(setAppCustomHeaders).toHaveBeenCalledTimes(1);
    expect(setAppCustomHeaders).toHaveBeenCalledWith({
      "X-IP": "1.1.1.1",
      "X-COUNTRY-CODE": "DK",
    });
  });

  it("applies only generated headers when custom headers are empty", async () => {
    storage.getItem.mockResolvedValueOnce({ Host: "betfair.com" });

    await setCustomHeaders(storage);

    expect(setAppCustomHeaders).toHaveBeenCalledTimes(1);
    expect(setAppCustomHeaders).toHaveBeenCalledWith({ Host: "betfair.com" });
  });

  it("merges generated and custom headers, with custom headers winning conflicts", async () => {
    storage.getItem.mockResolvedValueOnce({ Host: "betfair.com", "X-IP": "37.49.128.0" });
    getCustomHeadersSettings.mockReturnValueOnce("X-IP:91.184.0.200");

    await setCustomHeaders(storage);

    expect(setAppCustomHeaders).toHaveBeenCalledTimes(1);
    expect(setAppCustomHeaders).toHaveBeenCalledWith({
      Host: "betfair.com",
      "X-IP": "91.184.0.200",
    });
  });
});
