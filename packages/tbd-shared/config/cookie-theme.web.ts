import { setCookie } from "../helpers/cookies.web";

type Preferences = {
  darkModePreference: MediaQueryList;
  lightModePreference: MediaQueryList;
};

function activateDarkMode(): void {
  setCookie("theme", "1", "/");
}

function activateLightMode(): void {
  setCookie("theme", "2", "/");
}

function reload() {
  window.location.reload();
}

function reloadOnThemeChange(preferences: Preferences): void {
  preferences.darkModePreference.addEventListener("change", (e: { matches: boolean }) => e.matches && reload());
  preferences.lightModePreference.addEventListener("change", (e: { matches: boolean }) => e.matches && reload());
}

export function setCookieTheme(): void {
  const darkModePreference = window.matchMedia("(prefers-color-scheme: dark)");
  const lightModePreference = window.matchMedia("(prefers-color-scheme: light)");

  reloadOnThemeChange({ darkModePreference, lightModePreference });

  const isDarkMode = darkModePreference.matches;
  const isLightMode = lightModePreference.matches;

  let theme;
  if (isDarkMode) theme = "DARK";
  else if (isLightMode) theme = "LIGHT";
  else theme = undefined;

  switch (theme) {
    case "DARK":
      activateDarkMode();
      break;
    case "LIGHT":
      activateLightMode();
      break;
    default:
      activateDarkMode();
  }
}
