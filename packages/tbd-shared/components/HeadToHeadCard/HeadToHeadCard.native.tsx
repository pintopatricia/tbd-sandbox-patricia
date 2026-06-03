import { ScrollView, View } from "react-native";
import { FunctionComponent } from "react";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { HeadToHeadDetailed } from "./snowflakes/HeadToHeadDetailed/HeadToHeadDetailed.native";
import { HEAD_TO_HEAD, HEAD_TO_HEAD_CONTENT } from "./HeadToHeadCard.native.selectors";
import { ComponentProps } from "./props";
import styles from "./HeadToHeadCard.native.styles";

const HeadToHeadCard: FunctionComponent<ComponentProps> = ({ headToHeadProps, captionTranslations }) => {
  if (!headToHeadProps) return null;

  return (
    <View {...getTestProps(HEAD_TO_HEAD, false)}>
      <ScrollView contentContainerStyle={styles.scrollView} {...getTestProps(HEAD_TO_HEAD_CONTENT, false)}>
        <HeadToHeadDetailed headToHeadDetailedProps={headToHeadProps} captionI18n={captionTranslations} />
      </ScrollView>
    </View>
  );
};

export default HeadToHeadCard;
