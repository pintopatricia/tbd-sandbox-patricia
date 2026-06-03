import { FunctionComponent, useCallback } from "react";
import { createPortal } from "react-dom";
import { ComponentProps } from "./props";
import { Footer } from "./snowflakes/Footer/Footer.web";
import { SectionItemOnClick } from "../UserProfile/snowflakes/SectionElements/SectionElements.web";
import emit from "../../event-broker/event-emitter";

const RegulatoryCard: FunctionComponent<ComponentProps> = ({
  sections,
  dispatchFooterLinkNavigation,
  labels,
  usePortal = true,
}) => {
  const handleLinkClick = useCallback<SectionItemOnClick>(
    (_, item) => {
      emit("@@THE_BRIDGE/SBK_PRIVACY_CENTER_BUTTON_CLICKED", null);
      switch (item.type) {
        case "COOKIE_CONSENT":
          window.OneTrust?.ToggleInfoDisplay();
          break;
        case "IMAGE":
          dispatchFooterLinkNavigation(item.viewLink);
          break;
        default:
          dispatchFooterLinkNavigation(item.viewLink, item.text);
          break;
      }
    },
    [dispatchFooterLinkNavigation],
  );

  if (!sections?.length) {
    return <></>;
  }

  const footerElement = document.getElementById("page-footer");

  if (!footerElement || !usePortal) {
    return <Footer sections={sections} onSectionClick={handleLinkClick} labels={labels} />;
  }
  return createPortal(<Footer sections={sections} onSectionClick={handleLinkClick} labels={labels} />, footerElement);
};

export default RegulatoryCard;
