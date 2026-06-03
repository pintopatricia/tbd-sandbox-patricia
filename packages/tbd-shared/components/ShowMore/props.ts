import { RefObject } from "react";
import { View } from "react-native";
import { i18n } from "../../helpers/i18n";

type BaseProps = {
  showMore: boolean;
  setShowMore: any;
  onToggleShowMoreRunners: (showMore: boolean) => void;
  numberOfItemsToDisplay?: number;
  numberOfLines?: number;
  isHighlighted?: boolean;
};

type WebProps = {
  cardRef: HTMLDivElement | null;
};

type NativeProps = {
  cardRef: RefObject<View | null>;
};

export type I18nLabels = {
  showMore: string;
  showLess: string;
};

export const i18nLabels: I18nLabels = {
  showMore: i18n({ key: "I18N.SHOW_MORE" }),
  showLess: i18n({ key: "I18N.SHOW_LESS" }),
};

export type ComponentProps = BaseProps;
export type ComponentPropsWeb = BaseProps & WebProps;
export type ComponentPropsNative = BaseProps & NativeProps;
