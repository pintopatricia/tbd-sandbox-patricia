import { FunctionComponent } from "react";
import { Pressable } from "react-native";
import { AssetsIconName } from "@ppb/the-wall-icons";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { FeedbackViewModel } from "./Feedback.types";
import { FEEDBACK_BUTTON } from "./Feedback.native.selectors";

export const Feedback: FunctionComponent<FeedbackViewModel> = ({ onFeedbackTap }) => (
  <Pressable {...getTestProps(FEEDBACK_BUTTON, false)} onPress={onFeedbackTap}>
    <GenericIcon name={AssetsIconName.FEEDBACK} />
  </Pressable>
);
