import { createSelector, ParametricSelector } from "reselect";
import { Section } from "../../layout/cards/regulatory-sections/RegulatorySections.types";
import { RegulatoryData } from "./RegulatoryData.types";

export const createGetRegulatoryDataSectionsSelector = (): ParametricSelector<RegulatoryData, boolean, Section[]> =>
  createSelector(
    [(regulatoryData: RegulatoryData) => regulatoryData.sections, (_: RegulatoryData, loggedIn: boolean) => loggedIn],
    (sections, loggedIn): Section[] =>
      sections.reduce<Section[]>((acc, section) => {
        const sessionItem = section.items.find((item) => item.type === "SESSION");

        if (sessionItem && !loggedIn) {
          acc.push({
            ...section,
            items: section.items.filter((item) => item.type !== "SESSION"),
          });
        } else {
          acc.push(section);
        }
        return acc;
      }, []),
  );
