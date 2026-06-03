import * as React from "react";
import EmbeddedContentCard from "@ppb/tbd-components-rich-data/components/EmbeddedContentCard/view/EmbeddedContentCard.native";
import NativeWebView from "../Navigation/screens/NativeWebView.native";

type Props = {
  urn: string;
  visible?: boolean;
};

const EmbeddedContentCardWrapper: React.FunctionComponent<Props> = (props) => (
  <EmbeddedContentCard {...props} NativeWebView={NativeWebView} />
);

export default EmbeddedContentCardWrapper;
