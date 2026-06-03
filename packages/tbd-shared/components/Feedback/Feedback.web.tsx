import { FunctionComponent } from "react";
import { AssetsIconName } from "@ppb/the-wall-icons";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { FeedbackViewModel } from "./Feedback.types";
import { TEST_ID } from "./Feedback.web.selectors";
import styles from "./Feedback.web.css";

const Feedback: FunctionComponent<FeedbackViewModel> = ({ onFeedbackTap }) => (
  <button
    type="button"
    aria-label="give feedback"
    data-testid={TEST_ID}
    className={styles.feedbackButton}
    onClick={onFeedbackTap}
  >
    <GenericIcon name={AssetsIconName.FEEDBACK} />
  </button>
);

export default Feedback;
