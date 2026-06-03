import i18next from "i18next";
import { i18n } from "./i18n";

jest.mock("i18next", () => ({ t: jest.fn() }));

describe("i18n", () => {
  it("should call i18next with correct key", () => {
    i18n({ key: "key" });
    expect(i18next.t).toHaveBeenCalledWith("key", {});
  });

  it("should call i18next with correct interpolationValues", () => {
    i18n({ key: "key", interpolationValues: { value: "value" } });
    expect(i18next.t).toHaveBeenCalledWith("key", { value: "value" });
  });
});
