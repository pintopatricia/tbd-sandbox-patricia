import { FunctionComponent, useCallback, useState, useEffect, useMemo, useRef } from "react";
import { Styled, Text, PebbleList } from "@ppb/the-wall-native";
import { View, Animated, ScrollView, Pressable, useAnimatedValue } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { SearchBar } from "@ppb/the-wall-native/components/SearchBar/SearchBar";
import { PebbleListItem } from "@ppb/the-wall-common/types";
import { useIsFocused, useFocusEffect } from "@react-navigation/native";
import { typography } from "@ppb/the-wall-common/base-theme";
import styles from "./GamingSearchContainer.native.styles";
import {
  GAMING_SEARCH_CONTAINER,
  SEARCH_BAR_CONTAINER,
  SEARCH_RESULTS_CONTAINER,
  RECOMMENDED_GAMES_CONTAINER,
  NO_RESULTS_TEXT,
  NUMBER_OF_RESULTS_TEXT,
  OUT_OF_IDEAS_TEXT,
  SEARCH_HISTORY_CONTAINER,
  PRESSABLE_CONTAINER,
} from "./GamingSearchContainer.native.selectors";
import { GamingSearchContainerProps } from "./GamingSearchContainer.types";
import { getGamingSearchHistory } from "../../../../helpers/search-history-helper.native";
import { useScrollOffsetContext } from "@ppb/the-wall-native/helpers/ScrollContext";
import { Portal } from "@gorhom/portal";

function canShowResults(numberOfResults: number, inputSearchTerm: string): boolean {
  return numberOfResults > 0 && inputSearchTerm.length > 2;
}
function canShowHistory(historyLength: number, isFocused: boolean, shouldDisplayHistory: boolean): boolean {
  return shouldDisplayHistory && historyLength > 0 && isFocused;
}

export const GamingSearchContainer: FunctionComponent<GamingSearchContainerProps> = ({
  containers,
  translations,
  inputSearchTerm = "",
  numberOfResults,
  onCancel,
  onChange,
  onFocusSearchBar,
  cleanResults,
  shouldHandleOnBlur,
  shouldDisplaySearchHistory,
  onSearchHistoryPebbleClick,
  pinGamingSearch,
}) => {
  const resultsAvailability = canShowResults(numberOfResults, inputSearchTerm);
  const [searchText, setSearchText] = useState(inputSearchTerm);
  const [showResults, setShowResults] = useState(resultsAvailability);
  const [history, setHistory] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const searchHistoryAvailability = canShowHistory(history.length, isFocused, shouldDisplaySearchHistory ?? false);
  const screenFocused = useIsFocused();
  const offset = useScrollOffsetContext() ?? 0;
  const pebbleClickedRef = useRef(false);
  const [showSearchContent, setShowSearchContent] = useState(true);

  useEffect(() => {
    if (!isFocused) return;
    const timeout = setTimeout(() => {
      setShowSearchContent(false);
    }, 250);

    return () => clearTimeout(timeout);
  }, [isFocused]);

  useFocusEffect(
    useCallback(
      () => () => {
        if (pebbleClickedRef.current) {
          setHistory([]);
          pebbleClickedRef.current = false;
        }
      },
      [],
    ),
  );

  useFocusEffect(
    useCallback(() => {
      setSearchText(inputSearchTerm);
    }, [inputSearchTerm]),
  );

  useEffect(() => {
    async function getHistory() {
      const searchHistory = await getGamingSearchHistory();
      setHistory(searchHistory);
    }
    if (isFocused || screenFocused) getHistory();
  }, [isFocused, screenFocused]);

  const truncate = (item: string, max: number = 20): string =>
    item.length > max ? `${item.slice(0, max - 3)}...` : item;

  const searchHistoryPebblesList: PebbleListItem[] = useMemo(
    () =>
      history.map((item, index) => ({
        text: truncate(item),
        id: index.toString(),
        limitNoOfCharacters: true,
      })),
    [history],
  );

  const handleFocusChange = useCallback(
    (focus: boolean) => {
      if (!focus) setShowSearchContent(true);
      setShowResults(focus || !!inputSearchTerm);
      setIsFocused(focus);
    },
    [inputSearchTerm, setShowResults],
  );

  const handleCancel = useCallback(
    (searchText: string) => {
      setShowResults(false);
      setSearchText("");
      onCancel(searchText);
    },
    [setShowResults, onCancel],
  );

  const handleChange = useCallback(
    (searchText: string) => {
      setSearchText(searchText);
      onChange(searchText);
    },
    [onChange],
  );

  const handleClean = useCallback(
    (searchText: string) => {
      cleanResults(searchText);
    },
    [cleanResults],
  );

  const handlePebbleClick = useCallback(
    (searchText: string) => {
      setShowResults(true);
      setSearchText(searchText);
      onChange(searchText);
      onSearchHistoryPebbleClick?.(searchText);
      pebbleClickedRef.current = true;
    },
    [onChange, onSearchHistoryPebbleClick],
  );

  const handleInputClick = useCallback(() => {
    onFocusSearchBar();
  }, [onFocusSearchBar]);

  const translateY = useAnimatedValue(0);
  const lastScrollY = useRef(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (offset == null) return;

    const diff = offset - lastScrollY.current;
    lastScrollY.current = offset;

    if (diff > 10) {
      Animated.timing(translateY, {
        toValue: -120,
        duration: 240,
        useNativeDriver: true,
      }).start();
    } else if (diff < -1) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 240,
        useNativeDriver: true,
      }).start();
    }
  }, [offset, translateY]);

  useEffect(() => {
    const id = translateY.addListener(({ value }) => {
      setHidden(value < 0);
    });
    return () => translateY.removeListener(id);
  }, [translateY]);

  const animatedStyle = [!isFocused && { transform: [{ translateY }] }];

  const DefaultSearchContent = (
    <View
      style={[styles.container, !pinGamingSearch ? styles.fixedSearchContainer : {}]}
      {...getTestProps(GAMING_SEARCH_CONTAINER)}
    >
      <View style={styles.searchBarContainer} {...getTestProps(SEARCH_BAR_CONTAINER)}>
        <SearchBar
          placeholderLabel={translations.i18n.searchPlaceholder}
          cancelLabel={translations.i18n.cancel}
          onCancel={handleCancel}
          onChange={handleChange}
          onClean={handleClean}
          onFocusChange={handleFocusChange}
          onInputClick={handleInputClick}
          inputSearchTerm={searchText}
          shouldHandleOnBlur={shouldHandleOnBlur}
          autofocus={pinGamingSearch}
        />
      </View>
      {searchHistoryAvailability && (
        <View {...getTestProps(SEARCH_HISTORY_CONTAINER)}>
          <Text style={styles.labels}>{translations.i18n.searchHistoryLabel}:</Text>
          <View style={styles.searchHistoryContainer}>
            <PebbleList
              defaultSelectedPebble=""
              items={searchHistoryPebblesList}
              onPebblePress={(event: string) => handlePebbleClick(history[parseInt(event, 10)])}
            />
          </View>
        </View>
      )}
      {resultsAvailability && (
        <View style={styles.itemListContainer} {...getTestProps(SEARCH_RESULTS_CONTAINER)}>
          {translations.i18n.numberOfResultsLabel && (
            <Text style={styles.labels} {...getTestProps(NUMBER_OF_RESULTS_TEXT)}>
              <Styled
                translation={translations.i18n.numberOfResultsLabel}
                styles={{ highlighted: typography["typography-h280"] }}
              />
            </Text>
          )}
          {containers.searchResults}
        </View>
      )}
      {translations.i18n.outOfIdeasLabel &&
        showResults &&
        numberOfResults === 0 &&
        !translations.i18n.noResultsLabel && (
          <View style={styles.itemListContainer} {...getTestProps(RECOMMENDED_GAMES_CONTAINER)}>
            <Text style={styles.labels} {...getTestProps(OUT_OF_IDEAS_TEXT)}>
              {translations.i18n.outOfIdeasLabel}
            </Text>
            {containers.recommendedGames}
          </View>
        )}
      {numberOfResults === 0 && translations.i18n.noResultsLabel && (
        <View style={styles.itemListContainer} {...getTestProps(RECOMMENDED_GAMES_CONTAINER)}>
          <Text style={styles.labels} {...getTestProps(NO_RESULTS_TEXT)}>
            {translations.i18n.noResultsLabel}
          </Text>
          <Text style={styles.labels} {...getTestProps(OUT_OF_IDEAS_TEXT)}>
            {translations.i18n.outOfIdeasLabel}
          </Text>
          {containers.recommendedGames}
        </View>
      )}
    </View>
  );

  const SearchOverlay = (
    <Portal>
      <View style={styles.searchOverlay} pointerEvents="auto">
        <ScrollView keyboardShouldPersistTaps="never">{DefaultSearchContent}</ScrollView>
      </View>
    </Portal>
  );

  const AnimatedSearchBar = (
    <View style={styles.container} pointerEvents={"none"} {...getTestProps(GAMING_SEARCH_CONTAINER)}>
      <Animated.View style={animatedStyle}>
        <View style={styles.searchBarContainer} {...getTestProps(SEARCH_BAR_CONTAINER)}>
          <SearchBar
            placeholderLabel={translations.i18n.searchPlaceholder}
            cancelLabel={translations.i18n.cancel}
            onCancel={handleCancel}
            onChange={handleChange}
            onClean={handleClean}
            onFocusChange={handleFocusChange}
            onInputClick={handleInputClick}
            inputSearchTerm={searchText}
            shouldHandleOnBlur={shouldHandleOnBlur}
          />
        </View>
      </Animated.View>
    </View>
  );

  const StickySearchContent = (
    <Animated.View
      style={[
        {
          transform: [{ translateY: translateY }],
        },
      ]}
      pointerEvents={hidden ? "box-none" : "auto"}
    >
      <Pressable
        {...getTestProps(PRESSABLE_CONTAINER)}
        style={styles.searchOverlay}
        onPress={() => {
          setIsFocused(true);
        }}
      />
      {AnimatedSearchBar}
    </Animated.View>
  );

  return (
    <>
      {pinGamingSearch && showSearchContent && StickySearchContent}
      {pinGamingSearch && isFocused && SearchOverlay}
      {!pinGamingSearch && DefaultSearchContent}
    </>
  );
};
