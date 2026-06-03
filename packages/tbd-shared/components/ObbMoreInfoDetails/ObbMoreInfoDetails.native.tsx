import { FunctionComponent } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { navigate } from "@ppb/tbd-router/native";
import { DisplayMode } from "@ppb/the-wall-common/types/Link/Link.types";
import { QuickLink, RichTextComponent } from "@ppb/the-wall-native";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";

import styles from "./ObbMoreInfoDetails.native.styles";
import { ObbMoreInfoDetailsProps, groupMoreInfoDetails } from "../../helpers/obb";

export const ObbMoreInfoDetails: FunctionComponent<ObbMoreInfoDetailsProps> = ({ moreInfoDetails }) => {
  const handleOnTermsAndConditionsClick = (groupedMoreInfoDetailViewLink: ViewLink) => {
    navigate({
      viewUrl: groupedMoreInfoDetailViewLink.viewUrl,
      viewUrn: groupedMoreInfoDetailViewLink.viewUrn,
      viewDisplayMode: DisplayMode.BlankBrowser,
    });
  };
  const insets = useSafeAreaInsets();
  const safeContentStyle = { paddingBottom: insets.bottom };
  const groupedMoreInfoDetails = groupMoreInfoDetails(moreInfoDetails);

  return (
    <View style={[safeContentStyle, styles.bottomSheetContent]}>
      {groupedMoreInfoDetails.map((groupedMoreInfoDetail, index) => {
        if (groupedMoreInfoDetail[0].type !== "url_link") {
          return <RichTextComponent key={index} list={groupedMoreInfoDetail}></RichTextComponent>;
        }

        if (!groupedMoreInfoDetail[0]?.spans || !groupedMoreInfoDetail[0].spans[0]?.viewLink) {
          return null;
        }

        const groupedMoreInfoDetailViewLink = groupedMoreInfoDetail[0].spans[0].viewLink;

        return (
          <QuickLink
            key={index}
            item={{
              text: groupedMoreInfoDetail[0].text,
              viewLink: { ...groupedMoreInfoDetailViewLink, viewDisplayMode: DisplayMode.BlankBrowser },
            }}
            onPress={() => handleOnTermsAndConditionsClick(groupedMoreInfoDetailViewLink)}
            isLightBackground
          />
        );
      })}
    </View>
  );
};
