import { FunctionComponent, useCallback, useEffect, useState } from "react";
import * as React from "react";

let RERENDERS_COUNT = 0;

// Make it true this if you want to test this locally
const wydrEnabled = false;

// Make sure we are in running wdio
if (wydrEnabled) {
   
  // const whyDidYouRender = require("@welldone-software/why-did-you-render");
  // whyDidYouRender(React, {
  //   include: [/Card|CardGroup/],
  //   trackAllPureComponents: true,
  //   notifier: () => {
  //     RERENDERS_COUNT += 1;
  //   },
  // });
}

const WdyrDashboard: FunctionComponent<{}> = () => {
  const [count, setCount] = useState(0);

  const styles: React.CSSProperties = {
    position: "fixed",
    top: "16px",
    width: "100px",
    height: "24px",
    color: "red",
    zIndex: "10000",
    lineHeight: "24px",
    fontSize: "16px",
    fontWeight: "700",
    textAlign: "center",
    left: "calc(50% - 50px)",
  };

  useEffect(() => {
    const timeout = setInterval(() => {
      setCount(RERENDERS_COUNT);
    }, 500);

    return () => clearInterval(timeout);
  }, []);

  const resetCount = useCallback(() => {
    RERENDERS_COUNT = 0;
  }, []);

  return (
    <button id="wdyr" style={styles} onClick={resetCount}>
      {count}
    </button>
  );
};

export default wydrEnabled ? WdyrDashboard : () => <></>;
