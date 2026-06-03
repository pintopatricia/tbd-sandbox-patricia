import * as React from "react";
import QuicklinksGridCardGroup from "@ppb/tbd-components-navigation/components/QuicklinksGridCardGroup/view/QuicklinksGridCardGroup.native";
import { useLogin } from "@flutter-global/react-native-cet-framework";

type Props = {
  urn: string;
  visible?: boolean;
};

/**
  This wrapper is necessary because we need to make use of the login callback from @flutter-global/react-native-cet-framework" and that is not available on tbd-components.
  The callback comes from a React hook and is only used in native (that's why we don't repeat this pattern on web).

  This wrapper pattern is (at this time) the recommended approach to deal with this issues according to the tbd-components docs.
*/
const QuicklinksGridCardGroupWrapper: React.FunctionComponent<Props> = (props) => {
  const login = useLogin();

  return <QuicklinksGridCardGroup {...props} login={login} />;
};

export default QuicklinksGridCardGroupWrapper;
