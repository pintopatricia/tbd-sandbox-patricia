import { setCookieTheme } from "./cookie-theme.web";
import { setCookie } from "../helpers/cookies.web";

jest.mock("../helpers/cookies.web");

describe("setCookieTheme", () => {
  let darkModePreference;
  let lightModePreference;

  beforeEach(() => {
    darkModePreference = { matches: true, addEventListener: jest.fn() };
    lightModePreference = { matches: false, addEventListener: jest.fn() };
    window.matchMedia = (mediaString) => {
      if (mediaString.includes("dark")) {
        return darkModePreference;
      }
      return lightModePreference;
    };

    delete window.location;
    window.location = { reload: jest.fn() };
  });

  it("should activate dark mode if darkModePreference matches", () => {
    darkModePreference.matches = true;
    lightModePreference.matches = false;

    setCookieTheme();
    expect(setCookie).toHaveBeenCalledWith("theme", "1", "/");
  });

  it("should activate light mode if lightModePreference matches", () => {
    darkModePreference.matches = false;
    lightModePreference.matches = true;

    setCookieTheme();
    expect(setCookie).toHaveBeenCalledWith("theme", "2", "/");
  });

  it("should set dark mode as default", () => {
    darkModePreference.matches = false;
    lightModePreference.matches = false;

    setCookieTheme();
    expect(setCookie).toHaveBeenCalledWith("theme", "1", "/");
  });

  it("should reload page if dark mode preference changes", () => {
    setCookieTheme();
    const changeCallback = darkModePreference.addEventListener.mock.calls[0][1];
    changeCallback({ matches: true });
    expect(window.location.reload).toHaveBeenCalled();
  });

  it("should reload page if light mode preference changes", () => {
    setCookieTheme();
    const changeCallback = lightModePreference.addEventListener.mock.calls[0][1];
    changeCallback({ matches: true });
    expect(window.location.reload).toHaveBeenCalled();
  });
});
