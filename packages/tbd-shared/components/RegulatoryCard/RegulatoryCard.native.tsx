import { FunctionComponent, useCallback } from "react";
import { navigate } from "@ppb/tbd-router/native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { View } from "react-native";
import OTPublishersNativeSDK from "react-native-onetrust-cmp";
import { OnSectionPress } from "../UserProfile/snowflakes/SectionElements/SectionElements.native";
import { Footer } from "./snowflakes/Footer/Footer.native";
import { ComponentProps } from "./props";
import { FOOTER } from "./RegulatoryCard.native.selectors";

const RegulatoryCard: FunctionComponent<ComponentProps> = ({ sections, dispatchFooterLinkNavigation, labels }) => {
  const handleLinkPress = useCallback<OnSectionPress>(
    (item) => {
      switch (item.type) {
        case "COOKIE_CONSENT":
          OTPublishersNativeSDK.showPreferenceCenterUI({
            enableDarkMode: "false",
          });
          break;
        case "IMAGE": {
          if (item.viewLink) {
            dispatchFooterLinkNavigation(item.viewLink);
            navigate(item.viewLink);
          }
          break;
        }
        default: {
          const viewLink = item.viewLink.viewUrn
            ? { ...item.viewLink, viewUrn: item.viewLink.viewUrn }
            : { ...item.viewLink, viewUrn: "" };
          dispatchFooterLinkNavigation(item.viewLink, item.text);
          navigate(viewLink);
          break;
        }
      }
    },
    [dispatchFooterLinkNavigation],
  );

  if (!sections?.length) {
    return <></>;
  }

  return (
    <View {...getTestProps(FOOTER, false)}>
      <Footer sections={sections} onSectionPress={handleLinkPress} labels={labels} />
    </View>
  );
};

export default RegulatoryCard;
