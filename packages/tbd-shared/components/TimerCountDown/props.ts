import { i18n } from "../../helpers/i18n";

export type ComponentProps = {
  targetDate: Date;
  title?: string;
  updateInterval?: number;
};

export type I18nLabels = {
  days: string;
  hours: string;
  minutes: string;
};

export const i18nLabels: I18nLabels = {
  days: i18n({ key: "I18N.OBB.UNAVAILABLE.DAYS" }),
  hours: i18n({ key: "I18N.OBB.UNAVAILABLE.HOURS" }),
  minutes: i18n({ key: "I18N.OBB.UNAVAILABLE.MINUTES" }),
};
