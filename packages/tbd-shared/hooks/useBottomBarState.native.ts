import { useNavigationState } from "@react-navigation/native";

/**
 * Convenient hook to access the bottom bar state. At the moment it allows to
 * determine when the current bottom bar tile root screen is focused. This is handy
 * to know when to display a back arrow or a logo.
 */
export const useBottomBarState = (): { isRootFocused: boolean; isLoading: boolean } => {
  return useNavigationState((state) => {
    // the bottom bar navigator is the first screen in the MainNavigator (see RootNavigator.tsx)
    const bottomBarNavigatorState = state.routes && state.routes[0]?.state;

    // each bottom bar tile has its own stack navigator (see BottomBar.native.tsx)
    const focusedStackIndex = bottomBarNavigatorState?.index ?? 0;
    const focusedStack = bottomBarNavigatorState?.routes?.[focusedStackIndex];

    const currentRouteIndex = focusedStack?.state?.index ?? 0;

    // an index of 0 means that the current screen is the root of the screen stack
    const isRootFocused = currentRouteIndex === 0;

    return {
      isRootFocused,
      isLoading: !bottomBarNavigatorState,
    };
  });
};
