import { useCallback, MouseEvent } from "react";
import * as React from "react";

import { QuickLink, RichTextComponent } from "@ppb/the-wall-web";

import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";

import { ObbMoreInfoDetailsProps, groupMoreInfoDetails } from "../../helpers/obb";

export const ObbMoreInfoDetails: React.FC<ObbMoreInfoDetailsProps> = ({
  moreInfoDetails,
  dispatchNavigateToTermsAndConditionsPage,
}) => {
  const handleOnTermsAndConditionsClick = useCallback(
    (event: MouseEvent, moreInfoDetailViewLink: ViewLink) => {
      event.preventDefault();

      dispatchNavigateToTermsAndConditionsPage?.(moreInfoDetailViewLink);
    },
    [dispatchNavigateToTermsAndConditionsPage],
  );

  const groupedMoreInfoDetails = groupMoreInfoDetails(moreInfoDetails);

  return (
    <>
      {groupedMoreInfoDetails.map((groupedMoreInfoDetail, index) => {
        if (groupedMoreInfoDetail[0].type !== "url_link") {
          return <RichTextComponent key={index} list={groupedMoreInfoDetail}></RichTextComponent>;
        }

        if (!groupedMoreInfoDetail[0].spans || !groupedMoreInfoDetail[0].spans[0].viewLink) {
          return null;
        }

        const groupedMoreInfoDetailViewLink = groupedMoreInfoDetail[0].spans[0].viewLink;

        return (
          <QuickLink
            key={index}
            item={{
              text: groupedMoreInfoDetail[0].text,
              viewLink: groupedMoreInfoDetailViewLink,
            }}
            onLinkClick={(event) => handleOnTermsAndConditionsClick(event, groupedMoreInfoDetailViewLink)}
            isLightBackground
          />
        );
      })}
    </>
  );
};
