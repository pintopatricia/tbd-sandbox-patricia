import { FunctionComponent, useEffect } from "react";
import * as React from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import InAppReview from "react-native-in-app-review";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { dispatchRatingResetAction, RatingResetAction } from "@ppb/tbd-store/actions/rating";

export const RateMyApp: FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch<Dispatch<RatingResetAction>>();

  const { rateMyAppTriggered, ratingCount } = useSelector(
    (state: ApplicationState) => ({
      rateMyAppTriggered: state.rating?.rateMyAppTriggered || false,
      ratingCount: state.rating?.ratingCount || 0,
    }),
    shallowEqual,
  );

  useEffect(() => {
    if (rateMyAppTriggered) {
      InAppReview.RequestInAppReview();

      // The API does not indicate whether the user reviewed or not, or even whether the review dialog was shown.
      // Thus, no matter the result, we continue our app flow.

      /* Once a rating cycle is complete, we must reset the state
      set the *lastRatingDate* and provide the ratingCount to be updated */
      dispatchRatingResetAction(dispatch, new Date(Date.now()), ratingCount);
    }
  }, [dispatch, rateMyAppTriggered, ratingCount]);

  return <React.Fragment>{children}</React.Fragment>;
};
