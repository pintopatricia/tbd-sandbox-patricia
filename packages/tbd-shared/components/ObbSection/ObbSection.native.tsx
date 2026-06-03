import { FunctionComponent } from "react";
import { Card, PebbleList, PebbleText, StatusLabel } from "@ppb/the-wall-native";
import { CardHeaderSize, CardTheme } from "@ppb/the-wall-common/types/Card/Card.types";
import { iconsMap } from "@ppb/the-wall-icons/icons";
import { StatusLabelSizeType, StatusLabelType } from "@ppb/the-wall-common/types";
import { ObbSectionProps } from "./ObbSection.types";
import { ObbCardsLayout } from "../ObbCardsLayout/ObbCardsLayout.native";

const ObbSection: FunctionComponent<ObbSectionProps> = ({
  urn,
  title,
  icon,
  isExpanded,
  layouts,
  selectedFilter,
  onToggle,
  handleLayoutSelection,
  onShowMoreClicked,
}) => {
  const selectedLayout = layouts.find((layout) => layout.isSelected) ?? layouts[0];

  const isLast = layouts.at(-1) === selectedLayout;

  if (!selectedLayout) {
    return null;
  }

  return (
    <Card
      key={`${urn}${selectedFilter}`}
      title={title}
      icon={icon ? iconsMap[icon.category][icon.id] : undefined}
      theme={CardTheme.SECONDARY}
      size={CardHeaderSize.LARGE}
      isCollapsible
      onTitleClick={(isOpen) => {
        onToggle(isOpen);
      }}
      startOpen={isExpanded}
    >
      {layouts.length > 1 && (
        <PebbleList
          items={layouts.map((layout) => ({
            id: layout.urn,
            text: layout.title || "",
            children: layout.badge ? (
              <>
                <PebbleText text={layout.title} />
                <StatusLabel
                  text={layout.badge}
                  statusLabelType={StatusLabelType.COMPLIMENTARY}
                  statusLabelSize={StatusLabelSizeType.SMALL}
                />
              </>
            ) : undefined,
          }))}
          onPebblePress={(layoutUrn) => {
            handleLayoutSelection(urn, layoutUrn);
          }}
          defaultSelectedPebble={selectedLayout.urn}
        />
      )}
      {selectedLayout.items.length > 0 && (
        <ObbCardsLayout
          key={selectedLayout.urn}
          layout={selectedLayout}
          isLast={isLast}
          onShowMoreClicked={(layoutUrn: string, isOpen: boolean) => {
            onShowMoreClicked(urn, layoutUrn, isOpen);
          }}
        />
      )}
    </Card>
  );
};

export default ObbSection;
