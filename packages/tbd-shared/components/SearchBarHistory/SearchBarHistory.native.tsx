import { FC } from "react";
import { View } from "react-native";
import { QuickLink, Text } from "@ppb/the-wall-native";
import { SearchBarHistoryProps } from "./SearchBarHistory.types";
import styles from "./SearchBarHistory.native.styles";

const VIEW_LINK = { viewUrl: "", viewUrn: "" };

export const SearchBarHistory: FC<SearchBarHistoryProps> = ({ historyLabel, onHistoryClick, searchHistory }) =>
  searchHistory.length > 0 && (
    <View style={styles.searchHistoryContainer}>
      <Text style={styles.searchHistoryLabel}>{historyLabel}</Text>
      <View style={styles.searchHistoryItemsContainer}>
        {searchHistory.map((result) => (
          <QuickLink
            isLightBackground
            withShadow={false}
            withBorder={false}
            key={result}
            item={{ viewLink: VIEW_LINK, text: result }}
            onPress={() => onHistoryClick(result)}
          />
        ))}
      </View>
    </View>
  );
