import { FunctionComponent } from "react";
import { ScrollView, View } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";

import { ComponentProps } from "./props";
import styles from "./RecentFormCard.native.styles";
import { RECENT_FORM_CONTAINER } from "./RecentFormCard.native.selectors";
import { RecentFormDetailed } from "./snowflakes/RecentFormDetailed/RecentFormDetailed.native";

const ConnectedRecentFormCard: FunctionComponent<ComponentProps> = ({ home, away, translations }) => {
  // Empty component
  if (!home || !away) {
    return <></>;
  }
  return (
    <View {...getTestProps(RECENT_FORM_CONTAINER, false)}>
      <ScrollView contentContainerStyle={styles.content}>
        <RecentFormDetailed
          relativeFixtureResult={[home.detailed, away.detailed]}
          i18n={translations.recentFormDetailedTranslations}
        />
      </ScrollView>
    </View>
  );
};

export default ConnectedRecentFormCard;
