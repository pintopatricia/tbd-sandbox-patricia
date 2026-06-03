import { FunctionComponent, useState, useCallback } from "react";
import { View } from "react-native";

import { CombinationsList } from "./snowflakes/CombinationsList/CombinationsList.native";
import { ComponentProps } from "./props";
import ConnectedPreviewLine from "../PreviewLine";
import { PreviewLine } from "../PreviewLine/PreviewLine.native";
import styles from "./Preview.native.styles";

const noop = (): void => {};

export const Preview: FunctionComponent<ComponentProps> = ({ id, lineIds, i18n, dispatchOnOpen }) => {
  const [isOpen, setIsOpen] = useState(false);

  const onToggle = useCallback(() => {
    setIsOpen((prevState) => !prevState);

    if (!isOpen) {
      dispatchOnOpen(id);
    }
  }, [isOpen, dispatchOnOpen, id]);

  return (
    <View style={styles.previewContainer}>
      <CombinationsList isOpen={isOpen} shortViewCount={4} i18n={i18n} onToggle={onToggle} onMore={noop}>
        {lineIds.map((lineId, index) => (
          <ConnectedPreviewLine
            key={lineId}
            id={lineId}
            order={index}
            component={PreviewLine}
            isLast={index === lineIds.length - 1}
          />
        ))}
      </CombinationsList>
    </View>
  );
};
