import {
  createNavigatorFactory,
  type EventArg,
  type NavigatorTypeBagBase,
  type ParamListBase,
  type StackActionHelpers,
  StackActions,
  type StackNavigationState,
  StackRouter,
  type StackRouterOptions,
  type StaticConfig,
  type TypedNavigator,
  useNavigationBuilder,
} from "@react-navigation/native";
import * as React from "react";

import type {
  NativeStackNavigationEventMap,
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
  NativeStackNavigatorProps,
} from "@react-navigation/native-stack";
import { NativeStackView } from "@react-navigation/native-stack";

const DEFAULT_MAX_SAME_TYPE = 3;

interface NavigationWithHelpers {
  addListener?: (event: string, callback: (e: EventArg<string, true>) => void) => () => void;
  getState?: () => StackNavigationState<ParamListBase>;
}

interface ViewLinkParams {
  viewLink?: {
    viewUrn?: string;
  };
}

type RouteWithParams = StackNavigationState<ParamListBase>["routes"][number];

function getViewUrn(route: RouteWithParams): string | undefined {
  return (route.params as ViewLinkParams | undefined)?.viewLink?.viewUrn;
}

/**
 * Custom StackRouter that replicates getId behavior safely for native-stack.
 *
 * Without getId, navigate('ScreenName', params) reuses the existing screen
 * instead of creating a new instance. This router converts NAVIGATE to PUSH
 * when the target screen name already exists in the stack, allowing multiple
 * instances of the same screen type with different viewUrns.
 *
 * If the viewUrn matches the current top screen, the action passes through
 * normally (params update, no new screen).
 */
export function createCappedStackRouter(maxSameType: number) {
  const clampedMax = Math.max(1, maxSameType);
  return (options: StackRouterOptions) => {
    const router = StackRouter(options);

    return {
      ...router,
      getStateForAction(
        state: StackNavigationState<ParamListBase>,
        action: Parameters<typeof router.getStateForAction>[1],
        options: Parameters<typeof router.getStateForAction>[2],
      ): ReturnType<typeof router.getStateForAction> {
        if (action.type !== "NAVIGATE" || !action.payload) {
          return router.getStateForAction(state, action, options);
        }

        const { name, params } = action.payload as { name?: string; params?: ViewLinkParams };
        const viewUrn = params?.viewLink?.viewUrn;

        if (!name || !viewUrn) {
          return router.getStateForAction(state, action, options);
        }

        const topRoute = state.routes[state.routes.length - 1];

        // Same screen name AND same viewUrn as top → update params only
        if (topRoute.name === name && getViewUrn(topRoute) === viewUrn) {
          return router.getStateForAction(state, action, options);
        }

        // If screen name exists in stack → PUSH a new instance instead of navigating back
        const existsInStack = state.routes.some((route) => route.name === name);

        if (existsInStack) {
          const newState = router.getStateForAction(state, StackActions.push(name, params), options);

          if (newState && "key" in newState && newState.routes) {
            const trimmed = getTrimmedRoutes(
              newState.routes as StackNavigationState<ParamListBase>["routes"],
              clampedMax,
            );
            if (trimmed) {
              return {
                ...newState,
                routes: trimmed,
                index: trimmed.length - 1,
              } as StackNavigationState<ParamListBase>;
            }
          }

          return newState;
        }

        return router.getStateForAction(state, action, options);
      },
    };
  };
}

/**
 * Determines if the stack needs trimming (dedup + cap).
 * Returns the trimmed routes array, or null if no trimming needed.
 *
 * 1. Deduplicate by identity (name + viewUrn) — keeps only the most recent
 *    instance when the same screen with the same viewUrn appears multiple times.
 * 2. Cap by screen name — keeps at most `maxSameType` routes per screen name.
 */
export function getTrimmedRoutes(
  routes: StackNavigationState<ParamListBase>["routes"],
  maxSameType: number,
): StackNavigationState<ParamListBase>["routes"] | null {
  const seenIdentities = new Set<string>();
  const routeCountByName: Record<string, number> = {};
  const result: typeof routes = [];

  // Single reverse pass: dedup by identity AND cap by name
  for (let i = routes.length - 1; i >= 0; i--) {
    const route = routes[i];
    const viewUrn = getViewUrn(route);
    const identity = viewUrn ? JSON.stringify([route.name, viewUrn]) : route.key;

    // Skip duplicate identities (keep newest only)
    if (seenIdentities.has(identity)) {
      continue;
    }
    seenIdentities.add(identity);

    // Skip if name count exceeds cap (keep newest N only)
    const count = (routeCountByName[route.name] || 0) + 1;
    routeCountByName[route.name] = count;

    if (count > maxSameType) {
      continue;
    }

    result.unshift(route);
  }

  if (result.length === routes.length) {
    return null;
  }

  return result;
}

type CappedNativeStackNavigatorProps = NativeStackNavigatorProps & {
  maxSameType?: number;
};

/**
 * A native stack navigator that caps the number of same-type screens.
 *
 * The custom router enforces deduplication and capping synchronously during
 * navigation actions — no post-hoc resets needed. Removed screens are always
 * behind the current screen, so there's no visible flicker.
 */
export function CappedNativeStackNavigator({
  id,
  initialRouteName,
  UNSTABLE_routeNamesChangeBehavior,
  children,
  layout,
  screenListeners,
  screenOptions,
  screenLayout,
  maxSameType = DEFAULT_MAX_SAME_TYPE,
  ...rest
}: CappedNativeStackNavigatorProps) {
  const CappedRouter = React.useMemo(() => createCappedStackRouter(maxSameType), [maxSameType]);

  const { state, describe, descriptors, navigation, NavigationContent } = useNavigationBuilder<
    StackNavigationState<ParamListBase>,
    StackRouterOptions,
    StackActionHelpers<ParamListBase>,
    NativeStackNavigationOptions,
    NativeStackNavigationEventMap
  >(CappedRouter, {
    id,
    initialRouteName,
    UNSTABLE_routeNamesChangeBehavior,
    children,
    layout,
    screenListeners,
    screenOptions,
    screenLayout,
  });

  React.useEffect(() => {
    const navigationWithHelpers = navigation as unknown as NavigationWithHelpers;

    return navigationWithHelpers.addListener?.("tabPress", (e) => {
      const isFocused = navigation.isFocused();

      requestAnimationFrame(() => {
        const currentState = navigationWithHelpers.getState?.();

        if (currentState && currentState.index > 0 && isFocused && !e.defaultPrevented) {
          navigation.dispatch({
            ...StackActions.popToTop(),
            target: currentState.key,
          });
        }
      });
    });
  }, [navigation]);

  return (
    <NavigationContent>
      <NativeStackView {...rest} state={state} navigation={navigation} descriptors={descriptors} describe={describe} />
    </NavigationContent>
  );
}

export function createCappedNativeStackNavigator<
  const ParamList extends ParamListBase,
  const NavigatorID extends string | undefined = undefined,
  const TypeBag extends NavigatorTypeBagBase = {
    ParamList: ParamList;
    NavigatorID: NavigatorID;
    State: StackNavigationState<ParamList>;
    ScreenOptions: NativeStackNavigationOptions;
    EventMap: NativeStackNavigationEventMap;
    NavigationList: {
      [RouteName in keyof ParamList]: NativeStackNavigationProp<ParamList, RouteName, NavigatorID>;
    };
    Navigator: typeof CappedNativeStackNavigator;
  },
  const Config extends StaticConfig<TypeBag> = StaticConfig<TypeBag>,
>(config?: Config): TypedNavigator<TypeBag, Config> {
  return createNavigatorFactory(CappedNativeStackNavigator)(config);
}
