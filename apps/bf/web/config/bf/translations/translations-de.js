 

/**
 * Translations is a new entry point on webpack, so it can be in included as critical path on http-webserver;
 * window.__TBD__.TRANSLATIONS is included in client.tsx afterwards
 */
 
import TRANSLATIONS from "./generated/de.json";

window.__TBD__ = {
  ...window.__TBD__,
  TRANSLATIONS,
};
