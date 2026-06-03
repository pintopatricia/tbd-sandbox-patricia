import { useEffect, useState, useMemo } from "react";
import * as React from "react";
import RN, { StyleSheet, LogBox } from "react-native";

// prevents displaying log messages to ease the debugging experience when looking
// for rendering updates
LogBox.ignoreAllLogs();

/**
 * Holder references for React Native original components.
 */
const RNView = RN.View;
const RNText = RN.Text;
const RNTouchableWithoutFeedback = RN.TouchableWithoutFeedback;
const RNPressable = RN.Pressable;

/**
 * Hold heatmap color-coding values (green -> yellow -> red);
 */
const COLORS = ["transparent", "#0C6B37", "#F8B324", "#EB442C", "#BC2023"];
/**
 * Interval for printing render stats.
 */
const statsRenderInterval = 5000;

/**
 * Indicates the waiting time until the component render cycle goes silent.
 */
const resetRenderCountDebounceTimeout = 1000;

/**
 * Convenient object for printing component render count from `printStats` and
 * assign the new count from the `ChameleonComponent` component.
 */
let renders = {};

/**
 * Debounce helper to execute some code as soon as the render cycle interval goes
 * above the given waiting period.
 * @param func The code to be scheduled
 * @param waitFor The max period to be silent
 */
function debounce(func, waitFor = 100) {
  let timeout;
  return function innerFunction(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, waitFor);
  };
}

/**
 * Simulate a force update like the component class version `forceUpdate`.
 */
function useForceUpdate() {
  const [_, setValue] = useState(0); // integer state
  return () => setValue((value) => value + 1); // update the state to force render
}

/**
 * Prints render stats ordered by max render count.
 */
function printStats() {
  const orderedRenderCountKeys = Object.keys(renders).sort((a, b) => renders[b] - renders[a]);
  const orderedRenders = orderedRenderCountKeys.reduce((acc, key) => {
    acc[key] = renders[key];
    return acc;
  }, {});

  console.log("\n# Start Render Stats", JSON.stringify(orderedRenders, null, 2), "# End Render Stats");
  renders = {};
}

/**
 * Highlight the parent component render activity by drawing a coloured border
 * that will fill the parent boundaries. The border drawn can take different
 * colours depending on the rendering severity. The border is reset, that is
 * painted to transparent, when the component stopped rendering for a given period
 * e.g. 1000ms.
 * @param props Using the testID from a parent component for logging purposes.
 * @returns
 */
const ChameleonComponent = ({ testID }) => {
  const [resetRenderCountDebounced, setResetRenderCountDebounced] = React.useState(null);
  const forceUpdate = useForceUpdate();
  const renderCount = React.useRef(0);
  const skipCountForForceUpdate = React.useRef(false);
  const isUnmounted = React.useRef(false);
  const ref = React.useRef(undefined);

  useEffect(() => {
    const resetRenderCount = () => {
      skipCountForForceUpdate.current = true;
      renderCount.current = 0;
      if (!isUnmounted.current) {
        forceUpdate();
      }
    };
    // debounced reset count - the rational behind this debounced function is that
    // it should reset the re-rendering count once the component no longer re-renders
    // for the period of `resetRenderCountDebounceTimeout` - e.g. 1000ms.
    setResetRenderCountDebounced(() => debounce(resetRenderCount, resetRenderCountDebounceTimeout));
    return () => {
      isUnmounted.current = true;
    };
  }, []);

  // count only legit re-renders
  if (skipCountForForceUpdate.current) {
    skipCountForForceUpdate.current = false;
  } else {
    renderCount.current += 1;
    // eslint-disable-next-line react-hooks/immutability -- dev tool to keep track of render count for each component
    renders[testID] = renderCount.current;
    if (resetRenderCountDebounced) {
      resetRenderCountDebounced();
    }
  }

  // recompute style object when count updates
  const style = useMemo(
    () => ({
      ...StyleSheet.absoluteFillObject,
      borderWidth: 3,
      borderColor: COLORS[Math.min(COLORS.length - 1, renderCount.current)],
    }),
    [renderCount.current],
  );

  return <RNView ref={ref} style={style} />;
};

/**
 * Component wrapper to render the original RN components like View, Text, etc,
 * and wrap their children along with the Chameleon component helper that will
 * draw a border surrounding the <RNComponent/>. Currently using a Class Component
 * but this can be later addressed and improved with a FC.
 * @param RNComponent The RN component.
 * @param displayName The RN component name for logging purposes.
 */
function renderChameleonWrapper(RNComponent, displayName) {
  class WrapperComponent extends React.PureComponent {
    static displayName = displayName;

    /**
     * Assign `targetSingleComponent` the testID you would like to check for
     * highlight updates.
     */
    static targetSingleComponent = "";

    render() {
      const testID = this.props.testID || "no-test-id";
      let component = <ChameleonComponent testID={`[Type: ${this.constructor.displayName}] [testID: ${testID}]`} />;
      if (this.constructor.targetSingleComponent && this.constructor.targetSingleComponent !== testID) {
        component = <></>;
      }
      return (
        <RNComponent {...this.props} ref={this.props.innerRef}>
          <>
            {component}
            {this.props.children}
          </>
        </RNComponent>
      );
    }
  }
  // Forwardning refs fixes an issue with Functional Components that consuming `useRef`
  return React.forwardRef((props, ref) => <WrapperComponent innerRef={ref} {...props} />);
}

/**
 * Adding a guard code for DEV mode as this code is used for experimentation purposes
 * only and should never be shipped with release apps.
 */
// eslint-disable-next-line no-undef
if (__DEV__) {
  /**
   * Override React Native components definition.
   */

  Object.defineProperty(RN, "View", {
    value: renderChameleonWrapper(RNView, "View"),
  });

  Object.defineProperty(RN, "Text", {
    value: renderChameleonWrapper(RNText, "Text"),
  });

  Object.defineProperty(RN, "Pressable", {
    value: renderChameleonWrapper(RNPressable, "Pressable"),
  });

  Object.defineProperty(RN, "TouchableWithoutFeedback", {
    value: renderChameleonWrapper(RNTouchableWithoutFeedback, "TouchableWithoutFeedback"),
  });

  /**
   * Send to the stdout render stats periodically.
   */
  setInterval(() => {
    printStats();
  }, statsRenderInterval);
}
