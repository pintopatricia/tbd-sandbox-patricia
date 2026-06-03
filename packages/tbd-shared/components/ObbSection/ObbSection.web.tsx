import { FunctionComponent, useContext } from "react";
import { Card, PebbleList, StatusLabel } from "@ppb/the-wall-web";
import { CardHeaderSize, CardTheme } from "@ppb/the-wall-common/types/Card/Card.types";
import { iconsMap } from "@ppb/the-wall-icons/icons";
import { PebbleText } from "@ppb/the-wall-web/components/bricks/Pebble/Pebble";
import { StatusLabelSizeType, StatusLabelType } from "@ppb/the-wall-common/types";
import { ObbSectionProps } from "./ObbSection.types";
import { ConfigContext } from "../Config/ConfigContext";
import ObbCardsLayout from "../ObbCardsLayout/ObbCardsLayout.web";

const ObbSection: FunctionComponent<ObbSectionProps> = ({
  urn,
  title,
  icon,
  isExpanded,
  layouts,
  cardGroupUrn,
  selectedFilter,
  onToggle,
  handleOnSwimlaneArrowClick,
  handleLayoutSelection,
  onShowMoreClicked,
}) => {
  const { isDesktopLayout } = useContext(ConfigContext);
  const selectedLayout = layouts.find((layout) => layout.isSelected) ?? layouts[0];
  if (!selectedLayout) {
    return null;
  }

  return (
    <Card
      key={`${urn}${selectedFilter}`}
      title={title}
      icon={icon && iconsMap[icon.category][icon.id]}
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
          onPebbleClick={(layoutUrn) => {
            handleLayoutSelection(urn, layoutUrn);
          }}
          defaultSelectedPebble={selectedLayout.urn}
          isDesktopLayout={isDesktopLayout}
        />
      )}

      {selectedLayout.items.length > 0 && (
        <ObbCardsLayout
          layout={selectedLayout}
          cardGroupUrn={cardGroupUrn}
          onSwimlaneArrowClick={(direction) => handleOnSwimlaneArrowClick?.(direction, selectedLayout.title)}
          onShowMoreClicked={(layoutUrn: string, isOpen: boolean) => {
            onShowMoreClicked(urn, layoutUrn, isOpen);
          }}
        />
      )}
    </Card>
  );
};

export default ObbSection;
