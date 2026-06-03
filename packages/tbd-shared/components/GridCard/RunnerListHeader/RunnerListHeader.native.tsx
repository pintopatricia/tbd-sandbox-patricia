import { FC } from "react";
import { View } from "react-native";
import { MarketBlurbs } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { AzSwitcherProps } from "@ppb/the-wall-common/types";
import styles from "./RunnerListHeader.native.styles";
import { GridCardItem } from "../map-to-props-factory";
import { TEST_ID as RUNNER_LIST_HEADER } from "./RunnerListHeader.native.selectors";

type RunnerListHeaderProps = {
  items: GridCardItem[];
  azSwitcherProps?: AzSwitcherProps;
};

const RunnerListHeader: FC<RunnerListHeaderProps> = ({ items, azSwitcherProps }) => {
  const columns = items.map(({ label: itemLabel }) => itemLabel);

  return (
    <View {...getTestProps(RUNNER_LIST_HEADER, false)} style={styles.marketHeader}>
      <MarketBlurbs columns={columns} columnGrid azSwitcherProps={azSwitcherProps} />
    </View>
  );
};

export default RunnerListHeader;
