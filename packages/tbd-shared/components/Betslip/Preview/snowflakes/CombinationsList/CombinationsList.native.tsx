import { Children, FunctionComponent, useCallback, useMemo, useState } from "react";
import * as React from "react";
import { View, Pressable } from "react-native";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SystemIconName } from "@ppb/the-wall-icons";
import { colors } from "@ppb/the-wall-common/base-theme";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { Text } from "@ppb/the-wall-native";
import { CombinationsListProps, ListCombinationLine } from "./CombinationsList.types";
import styles from "./CombinationsList.native.styles";
import {
  COMBINATIONS_LIST,
  COMBINATIONS_LIST_GRID,
  COMBINATIONS_LIST_HEADER,
  COMBINATIONS_LIST_HEADER_ODD,
  COMBINATIONS_LIST_HEADER_PAYOUT,
  COMBINATIONS_LIST_HEADER_TITLE,
  COMBINATIONS_LIST_LINES,
  COMBINATIONS_LIST_MORE,
  COMBINATIONS_LIST_MORE_LABEL,
  COMBINATIONS_LINE_ROW,
} from "./CombinationsList.native.selectors";

const Icon: FunctionComponent<{ isOpen: boolean }> = ({ isOpen }) => (
  <View style={styles.headerIcon}>
    <GenericIcon
      name={isOpen ? SystemIconName.CHEVRON_UP : SystemIconName.CHEVRON_DOWN}
      color={colors.ActionSportsbookIconDefault}
    />
  </View>
);

export const CombinationsListLine: FunctionComponent<
  ListCombinationLine & { children: React.ReactNode; isLast: boolean }
> = ({ id, children, odd, payout, isLast }) => (
  <View style={[styles.line, isLast && styles.lastLine]} {...getTestProps(COMBINATIONS_LINE_ROW)}>
    <View style={[styles.lineCell, styles.idCell]}>
      <Text style={styles.id} {...getTestProps("combinations-line-id")}>
        {id}
      </Text>
    </View>
    <View style={styles.lineCell} {...getTestProps("combinations-line-content")}>
      {children}
    </View>
    <View style={[styles.lineCell, styles.oddCell]}>
      <Text style={styles.odd} {...getTestProps("combinations-line-odd")}>
        {odd}
      </Text>
    </View>
    <View style={[styles.lineCell, styles.payoutCell]}>
      <Text style={styles.payout} {...getTestProps("combinations-line-payout")}>
        {payout}
      </Text>
    </View>
  </View>
);

const Header: FunctionComponent<{
  isOpen: boolean;
  i18n: CombinationsListProps["i18n"];
}> = ({ isOpen, i18n }) => (
  <>
    <View style={[styles.headerCell, styles.headerId]}></View>
    <View style={[styles.headerCell, styles.headerTitleContainer]}>
      <Icon isOpen={isOpen} />
      <Text style={styles.headerTitle} {...getTestProps(COMBINATIONS_LIST_HEADER_TITLE)}>
        {i18n.title}
      </Text>
    </View>
    <View style={styles.headerCell}>
      {isOpen && (
        <Text style={styles.headerOdd} {...getTestProps(COMBINATIONS_LIST_HEADER_ODD)}>
          {i18n.odd}
        </Text>
      )}
    </View>
    <View style={styles.headerCell}>
      {isOpen && (
        <Text style={styles.headerPayout} {...getTestProps(COMBINATIONS_LIST_HEADER_PAYOUT)}>
          {i18n.payout}
        </Text>
      )}
    </View>
  </>
);

export const CombinationsList: FunctionComponent<CombinationsListProps> = ({
  isOpen,
  shortViewCount,
  children,
  i18n,
  onToggle,
}) => {
  const [isShortView, setIsShortView] = useState(true);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (prevIsOpen !== isOpen) {
    setPrevIsOpen(isOpen);
    if (!isOpen) {
      setIsShortView(true);
    }
  }

  const visibleChildren = useMemo(() => {
    if (isShortView) {
      const childrenSet = Children.toArray(children);
      const size = Math.min(shortViewCount, childrenSet.length);
      return childrenSet.slice(0, size);
    }

    return children;
  }, [isShortView, children, shortViewCount]);
  const isThereMoreToShow = !isShortView || Children.count(visibleChildren) < Children.count(children);

  const onMoreHandler = useCallback(() => setIsShortView((isShort) => !isShort), []);

  return (
    <View
      style={[styles.combinationsList, !isThereMoreToShow && styles.withoutMore]}
      {...getTestProps(COMBINATIONS_LIST, false)}
    >
      <View {...getTestProps(COMBINATIONS_LIST_GRID, false)}>
        <Pressable
          style={[styles.header, isOpen && styles.headerOpen]}
          {...getTestProps(COMBINATIONS_LIST_HEADER, false)}
          onPress={onToggle}
        >
          <Header i18n={i18n} isOpen={isOpen} />
        </Pressable>
        {isOpen && <View {...getTestProps(COMBINATIONS_LIST_LINES, false)}>{visibleChildren}</View>}
      </View>
      {isOpen && isThereMoreToShow && (
        <Pressable style={styles.moreButton} onPress={onMoreHandler} {...getTestProps(COMBINATIONS_LIST_MORE, false)}>
          <View style={styles.moreIcon}>
            <GenericIcon
              name={isShortView ? SystemIconName.NUDGE_PLUS : SystemIconName.NUDGE_MINUS}
              color={colors.ActionSportsbookIconDefault}
            />
          </View>
          <Text style={styles.moreLabel} {...getTestProps(COMBINATIONS_LIST_MORE_LABEL)}>
            {isShortView ? i18n.more : i18n.less}
          </Text>
        </Pressable>
      )}
    </View>
  );
};
