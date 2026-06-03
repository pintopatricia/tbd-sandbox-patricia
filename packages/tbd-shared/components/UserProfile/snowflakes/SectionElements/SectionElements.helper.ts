import { ImageItem } from "../RegulatorySectionsSession/RegulatorySections.types";

/**
 * Checks if a given item is the Denmark Gambling Authority logo.
 *
 * Disclaimer: Currently, SSC does not offer a reliable way to uniquely identify this specific image among others.
 * Given the urgency of the matter due to potential fines, this is the most effective solution available at the moment.
 * We have already initiated discussions with the SSC team to implement a more robust solution going forward.
 */
export const isDGALogo = (item: ImageItem) => !!item.viewLink?.viewUrl.includes("www.spillemyndigheden.dk");
