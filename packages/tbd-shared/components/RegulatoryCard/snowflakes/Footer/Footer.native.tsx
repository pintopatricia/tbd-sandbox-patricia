import { View } from "react-native";
import { FunctionComponent, useMemo } from "react";
import {
  SectionElements,
  SectionElementsNativeViewModel,
} from "../../../UserProfile/snowflakes/SectionElements/SectionElements.native";
import styles from "./Footer.native.styles";

export type FooterViewModel = {
  sections: SectionElementsNativeViewModel["section"][];
} & Pick<SectionElementsNativeViewModel, "labels" | "onSectionPress">;

export const Footer: FunctionComponent<FooterViewModel> = ({ sections, onSectionPress, labels }) => {
  const renderItems = useMemo(
    () =>
      sections
        ? sections.map((section, index) => (
            <SectionElements
              key={`${section.title}-${index}`}
              section={section}
              onSectionPress={onSectionPress}
              labels={labels}
            />
          ))
        : [],
    [onSectionPress, sections, labels],
  );

  return <View style={styles.footer}>{renderItems}</View>;
};
