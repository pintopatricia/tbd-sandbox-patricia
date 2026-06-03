import type { JSX } from "react";
import { useRef } from "react";
import { View, ScrollView } from "react-native";
import { RouteProp, useRoute, useScrollToTop } from "@react-navigation/native";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import ConnectedNotFoundView from "../../NotFoundView";
import NotFoundView from "../../NotFoundView/NotFoundView.native";
import { NOT_FOUND_VIEW } from "./NotFoundScreen.native.selectors";

type ParamList = {
  NotFoundScreen: {
    viewLink: ViewLink;
  };
};

function NotFoundScreen(): JSX.Element {
  const ref = useRef<ScrollView>(null);

  useScrollToTop(ref);

  const route = useRoute<RouteProp<ParamList, "NotFoundScreen">>();
  const { viewUrn } = route.params.viewLink;

  return (
    <ScrollView ref={ref} keyboardShouldPersistTaps="handled" scrollEventThrottle={16}>
      <View {...getTestProps(NOT_FOUND_VIEW, false)}>
        <ConnectedNotFoundView urn={viewUrn} component={NotFoundView} />
      </View>
    </ScrollView>
  );
}

export default NotFoundScreen;
