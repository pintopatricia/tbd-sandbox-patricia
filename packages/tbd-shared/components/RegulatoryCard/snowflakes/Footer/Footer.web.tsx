import { FunctionComponent } from "react";

import {
  SectionElements,
  SectionElementsWebViewModel,
} from "../../../UserProfile/snowflakes/SectionElements/SectionElements.web";
import styles from "./Footer.web.css";

export type FooterViewModel = {
  sections: SectionElementsWebViewModel["section"][];
} & Pick<SectionElementsWebViewModel, "labels" | "onSectionClick">;

export const Footer: FunctionComponent<FooterViewModel> = ({ sections, onSectionClick, labels }) => (
  <div className={styles.footer}>
    {sections.map((section, index) => (
      <SectionElements
        key={`${section.title}-${index}`}
        section={section}
        onSectionClick={onSectionClick}
        labels={labels}
      />
    ))}
  </div>
);
