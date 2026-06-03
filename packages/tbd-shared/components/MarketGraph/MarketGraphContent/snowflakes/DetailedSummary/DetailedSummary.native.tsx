import type { JSX } from "react";
import { FunctionComponent } from "react";
import { View } from "react-native";
import { Divider, Text } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";

import {
  DETAILED_SUMMARY,
  DETAILED_SUMMARY_GROUP_TITLE,
  DETAILED_SUMMARY_ITEM_TITLE,
  DETAILED_SUMMARY_ITEM_AMOUNT,
} from "./DetailedSummary.native.selectors";
import { DetailedSummaryItem, DetailedSummaryProps } from "./DetailedSummary.types";
import styles from "./DetailedSummary.native.styles";

const renderGroup = (item: DetailedSummaryItem, index: number): JSX.Element => (
  <View key={index} style={styles.item}>
    <Text {...getTestProps(DETAILED_SUMMARY_ITEM_TITLE)} style={styles.itemTitle}>
      {item.title}
    </Text>
    <Text {...getTestProps(DETAILED_SUMMARY_ITEM_AMOUNT)} style={styles.itemAmount}>
      {item.amount}
    </Text>
  </View>
);

export const DetailedSummary: FunctionComponent<DetailedSummaryProps> = ({ details, showHorizontalRule }) => (
  <View {...getTestProps(DETAILED_SUMMARY, false)} style={styles.detailed}>
    {showHorizontalRule && <Divider />}
    {details.map(({ title, groups }, index) => (
      <View key={`group-${index + 1}`} style={styles.group}>
        <Text {...getTestProps(DETAILED_SUMMARY_GROUP_TITLE)} style={styles.groupTitle}>
          {title}
        </Text>
        {groups.map((item, dataIndex) => renderGroup(item, dataIndex))}
      </View>
    ))}
  </View>
);
