import { FunctionComponent, useMemo } from "react";
import { type StyleProp, type TextStyle, View, Pressable } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";

import { Text } from "@ppb/the-wall-native";
import type { CompetitionHeaderCommonProps } from "./CompetitionHeader.types";
import {
  COLUMNS,
  COLUMN_CONTENT,
  COLUMN_LABEL,
  COMPETITION_HEADER_CONTAINER,
  TITLE,
  TITLE_LINK,
} from "./CompetitionHeader.native.selectors";
import styles from "./CompetitionHeader.native.styles";

type CompetitionHeaderNativeCallbacks = {
  onTitleClick?: () => void;
};

export type CompetitionHeaderNativeViewModel = CompetitionHeaderCommonProps & CompetitionHeaderNativeCallbacks;

export const CompetitionHeader: FunctionComponent<CompetitionHeaderNativeViewModel> = ({
  title,
  columns,
  hasStats,
  onTitleClick,
}) => {
  const titleLinkElement = useMemo(() => {
    const titleElement = (
      <Text numberOfLines={1} style={styles.title} {...getTestProps(TITLE)}>
        {title}
      </Text>
    );

    if (onTitleClick) {
      return (
        <Pressable onPress={onTitleClick} style={styles.titleLink} {...getTestProps(TITLE_LINK, false)}>
          {titleElement}
        </Pressable>
      );
    }

    return titleElement;
  }, [onTitleClick, title]);

  return (
    <View style={styles.competitionHeader} {...getTestProps(COMPETITION_HEADER_CONTAINER, false)}>
      {titleLinkElement}

      <View style={styles.columns} {...getTestProps(COLUMNS, false)}>
        {columns?.length > 0 &&
          columns.map((columnLabel, index) => {
            const columnStyle: StyleProp<TextStyle>[] = [
              styles.column,
              index === 0 && styles.firstColumn,
              hasStats && index === columns.length - 1 && styles.lastColumn,
            ];

            return (
              <View key={`${index}-${columnLabel}`} style={columnStyle} {...getTestProps(COLUMN_CONTENT, false)}>
                <Text style={styles.columnLabel} {...getTestProps(COLUMN_LABEL)} numberOfLines={1}>
                  {columnLabel}
                </Text>
              </View>
            );
          })}
      </View>
    </View>
  );
};
