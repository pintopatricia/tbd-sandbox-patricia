import { FunctionComponent } from "react";
import * as React from "react";
import { useSelector } from "react-redux";
import {
  createGetCountryLocalCurrencyCodeSelector,
  getUserJurisdiction,
} from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { Jurisdiction } from "@ppb/tbd-store/config/Jurisdiction";

export function withJurisdiction<T>(
  WrappedComponent: FunctionComponent<T>,
  { jurisdictions }: { jurisdictions: Jurisdiction[] },
): (props: T) => React.ReactElement<T> | null {
  const getUserDetails = createGetCountryLocalCurrencyCodeSelector();

  return function JurisdictionalGuard(props: T) {
    const userDetails = useSelector(getUserDetails);
    const currentJurisdiction = getUserJurisdiction(userDetails);

    if (currentJurisdiction && jurisdictions.includes(currentJurisdiction)) {
      return <WrappedComponent {...(props as React.PropsWithChildren<T>)} />;
    }

    return null;
  };
}
