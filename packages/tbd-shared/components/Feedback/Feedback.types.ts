type FeedbackOnTap = () => void;

type FilterByCallbacks = {
  onFeedbackTap: FeedbackOnTap;
};

export type FeedbackViewModel = FilterByCallbacks;
